/**
 * Runs the Student Management System API collection against a dedicated
 * MongoDB Atlas test database.
 *
 * Safety checks:
 * - Requires the database name to be stu-management-test.
 * - Verifies the MongoDB hostname against TEST_DB_HOST.
 * - Requires explicit permission before deleting test database records.
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const newman = require('newman');

const ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(ROOT, '.env.test');
dotenv.config({ path: ENV_FILE, override: true });
const COLLECTION = path.join(ROOT, 'collection', 'Student Management System API - Newman.postman_collection.json');
const REPORTS = path.join(ROOT, 'reports');
const TEST_DB_NAME = 'stu-management-test';
const TEST_DB_HOST = process.env.TEST_DB_HOST;
const ALLOW_TEST_DB_RESET = process.env.ALLOW_TEST_DB_RESET === 'true';
const PORT = process.env.PORT || '3001';
const BASE_URL = `http://127.0.0.1:${PORT}`;

function getDatabaseName(uri) {
    let parsed;
    try {
        parsed = new URL(uri);
    } catch {
        throw new Error('MONGODB_URI in .env.test is not a valid MongoDB connection URI.');
    }
    return decodeURIComponent(parsed.pathname.replace(/^\/+/, '').split('/')[0] || '');
}

function getDatabaseHost(uri) {
    try {
        return new URL(uri).hostname;
    } catch {
        throw new Error('MONGODB_URI in .env.test is not a valid MongoDB connection URI.');
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForExit(child, timeoutMs) {
    return new Promise(resolve => {
        if (child.exitCode !== null || child.signalCode !== null) {
            return resolve(true);
        }

        const onExit = () => {
            clearTimeout(timer);
            resolve(true);
        };

        const timer = setTimeout(() => {
            child.removeListener('exit', onExit);
            resolve(false);
        }, timeoutMs);

        child.once('exit', onExit);
    });
}

async function waitForServer(child) {
    const deadline = Date.now() + 30000;
    while (Date.now() < deadline) {
        if (child.exitCode !== null) {
            throw new Error(`API server exited early (code ${child.exitCode}). Check the server output above.`);
        }
        try {
            const response = await fetch(`${BASE_URL}/students`);
            if (response.status === 200) return;
        } catch {
            // Server is still starting.
        }
        await wait(500);
    }
    throw new Error('API server did not become ready within 30 seconds.');
}

async function seedIsolatedDatabase(uri) {
    await mongoose.connect(uri);
    try {
        const Student = require('../models/studentModel');
        // This destructive operation is confined to the database name checked above.
        await Student.deleteMany({});
        await Student.create({
            SID: 9000,
            firstName: 'Automation',
            lastName: 'Fixture',
            email: 'automation.fixture9000@example.com',
            nearCity: 'Kandy',
            course: ['Computer Science'],
            guardian: 'Automation Guardian',
            subject: ['API Testing']
        });
        const Counter = require('../models/counterModel');

        await Counter.updateOne(
            { _id: 'studentSID' },
            { $set: { seq: 9000 } },
            { upsert: true }
        );

    } finally {
        await mongoose.disconnect();
    }
}

async function main() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error('MONGODB_URI is missing. Configure it in .env.test.');
    }

    if (!TEST_DB_HOST) {
        throw new Error('TEST_DB_HOST is missing. Configure your MongoDB Atlas hostname in .env.test.');
    }

    if (!ALLOW_TEST_DB_RESET) {
        throw new Error(
            'Safety stop: Set ALLOW_TEST_DB_RESET=true in .env.test to allow cleanup of the dedicated test database.'
        );
    }

    if (!Number.isInteger(Number(PORT)) || Number(PORT) < 1 || Number(PORT) > 65535) {
        throw new Error('Invalid PORT in .env.test. Use a port between 1 and 65535.');
    }

    const actualDb = getDatabaseName(uri);

    if (actualDb !== TEST_DB_NAME) {
        throw new Error(`Safety stop: URI targets database "${actualDb || '(no database name)'}", not "${TEST_DB_NAME}". No data was changed.`);
    }

    const actualHost = getDatabaseHost(uri);

    if (actualHost !== TEST_DB_HOST) {
        throw new Error(
            `Safety stop: MongoDB hostname "${actualHost}" does not match TEST_DB_HOST in .env.test. No data was changed.`
        );
    }

    if (!fs.existsSync(COLLECTION)) throw new Error(`Collection not found: ${COLLECTION}`);

    fs.mkdirSync(REPORTS, { recursive: true });

    console.log(`Preparing isolated database: ${TEST_DB_NAME}`);
    await seedIsolatedDatabase(uri);
    console.log(`Seed fixture created. Starting API on port ${PORT}...`);

    const server = spawn(process.execPath, [path.join(ROOT, 'server.js')], {
        cwd: ROOT,
        env: { ...process.env, MONGODB_URI: uri, PORT },
        stdio: 'inherit'
    });

    try {
        await waitForServer(server);
        console.log('API is ready. Running Newman collection...');

        const summary = await new Promise((resolve, reject) => {
            newman.run({
                collection: COLLECTION,
                environment: {
                    name: 'Student Management - Test',
                    values: [{ key: 'base_url', value: BASE_URL, enabled: true }]
                },
                reporters: ['cli', 'json', 'htmlextra'],
                reporter: {
                    json: { export: path.join(REPORTS, 'newman-report.json') },
                    htmlextra: {
                        export: path.join(REPORTS, 'newman-report.html'),
                        title: 'Student Management System API Test Report'
                    }
                },
                timeoutRequest: 15000,
                delayRequest: 100
            }, (err, result) => err ? reject(err) : resolve(result));
        });

        console.log('\nReports saved:');
        console.log(path.join(REPORTS, 'newman-report.html'));
        console.log(path.join(REPORTS, 'newman-report.json'));

        if (summary.run.failures.length > 0) {
            console.error(`\n${summary.run.failures.length} request/test failure(s). Review the reports.`);
            process.exitCode = 1;
        } else {
            console.log('\nAll Newman assertions passed.');
        }
    } finally {
        if (server && server.exitCode === null) {
            console.log('\nStopping test API server...');

            server.kill();

            const stopped = await waitForExit(server, 5000);

            if (!stopped) {
                console.warn('Server did not stop gracefully. Forcing termination...');
                server.kill('SIGKILL');

                const forceStopped = await waitForExit(server, 5000);

                if (!forceStopped) {
                    throw new Error('Unable to stop the test API server.');
                }
            }

            console.log('Test API server stopped.');
        }
    }
}

main().catch(error => {
    console.error('\nTest run stopped:', error.message);
    process.exitCode = 1;
});
