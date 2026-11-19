# API Testing - Student Management System

## 1. Overview

This document explains how to test the Student Management System REST API using Postman and Newman.

**Tools used:**
- **Postman:** Manual API testing.
- **Newman:** Automated API testing.
- **Node.js and Express.js:** Backend.
- **MongoDB Atlas:** Database.

## 2. Project Structure

```text
Student-management-system/
|
+-- collection/
|   +-- Student Management System API - Newman.postman_collection.json
|   +-- Student Management - Test.postman_environment.json
|
+-- docs/
|   +-- api-testing/
|       +-- README.md
|       +-- test-cases.md
|       +-- test-execution-results.md
|
+-- scripts/
|   +-- run-api-tests.js
|
+-- .env.example
+-- .env.test.example
+-- package.json
+-- server.js
```

## 3. Manual Testing with Postman

### Setup

1. Install the project dependencies:

```bash
npm install
```

2. Configure your MongoDB connection in `.env`, using `.env.example` as a template.
3. Make sure the database configured in `.env` is safe to use for manual testing. Prefer a dedicated test database rather than one containing important development or production data.
4. Start the API server:

```bash
npm run serve
```

5. Open Postman and import the collection:

```text
collection/Student Management System API - Newman.postman_collection.json
```

6. Create a Postman environment with the following variable:

```text
base_url = http://localhost:3000
```

7. Select the environment and start testing.

**Important:** Some requests create, update, or delete student records. Use disposable test records and avoid modifying important data.

## 4. Automated Testing with Newman

Automated testing uses a dedicated MongoDB Atlas test database and a separate API port (`3001`).

### Configuration

1. Copy `.env.test.example` and rename the copy to `.env.test`.
2. Configure the following environment variables:

```env
MONGODB_URI=your_test_database_connection_string
TEST_DB_HOST=your_mongodb_hostname
ALLOW_TEST_DB_RESET=false
PORT=3001
```

3. Ensure that the MongoDB connection string uses the database name:

```text
stu-management-test
```

4. Verify that `TEST_DB_HOST` matches the hostname in your MongoDB connection string.
5. Keep `ALLOW_TEST_DB_RESET=false` while configuring and checking your environment.
6. When you are ready to execute the tests, change it to:

```env
ALLOW_TEST_DB_RESET=true
```

**Database safety warning:**

The automated test runner can delete existing student records from the configured test database before execution.

- Use only a dedicated test database.
- Never use your development or production database.
- Verify the MongoDB connection string and hostname before enabling database reset.
- Never commit `.env.test` or share database credentials.

### Run the Tests

From the project root, execute:

```bash
npm test
```

The runner automatically:

1. Checks the test configuration.
2. Prepares the test database.
3. Starts the API server.
4. Executes the Newman collection.
5. Generates test reports.
6. Stops the test server.

## 5. Test Reports

After execution, reports are saved in:

```text
reports/
+-- newman-report.html
+-- newman-report.json
```

- **HTML:** Visual test execution report.
- **JSON:** Structured test execution results.

The `reports/` directory is excluded from Git.

## 6. Test Coverage

The test suite covers:

- Student retrieval and creation.
- Student updates and deletion.
- Student searching.
- Input validation.
- Duplicate student records.
- Error handling.
- Student ID protection.
- Regression testing.

## 7. Additional Documentation

- [Test Cases](test-cases.md) - Test scenarios and expected results.
- [Test Execution Results](test-execution-results.md) - Recorded test results and findings.

## 8. Important Notes

- Manual API server: port `3000`.
- Automated test server: port `3001`.
- Manual and automated testing should use isolated, disposable test data.
- Never commit `.env`, `.env.test`, or database credentials.
- Use `.env.example` and `.env.test.example` as configuration templates.
- The `reports/` directory is generated automatically and excluded from Git.
- Passing tests do not guarantee that the application is production-ready.
