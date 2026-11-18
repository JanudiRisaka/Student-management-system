# API Testing – Student Management System

## Overview

This directory contains the Postman collection, environment configuration, and documentation used to test the Student Management System REST API.

The API tests verify endpoint functionality, input validation, error handling, and database operations.

## Tools and Technologies

- **Postman** – API testing and request execution
- **Node.js** – Runtime environment
- **Express.js** – Backend framework
- **MongoDB Atlas** – Database

## Getting Started

### 1. Start the Application

Start the Student Management System backend locally:

```bash
npm install
npm start
```

The API should be available at:

`http://localhost:3000`

### 2. Import Postman Files

1. Import `Student Management System API.postman_collection.json` into Postman.
2. Import `Student Management - Local.postman_environment.json`.
3. Select the `Student Management - Local` environment.
4. Verify that the `base_url` variable is set to `http://localhost:3000`.

### 3. Execute API Requests

Open the imported collection and execute the requests in their respective folders.

## Test Coverage

The collection covers:

- Student retrieval
- Student creation
- Student updates
- Student search
- Student deletion
- Input validation
- Error handling

## Additional Documentation

- [`test-cases.md`](test-cases.md) – API test scenarios and expected results.
- [`test-execution-results.md`](test-execution-results.md) – Actual test results and observations.

## Notes

- The collection is configured for local development and testing.
- Some requests create, update, or delete database records.
- Use a dedicated test database when executing requests that modify or delete data.
- Ensure the backend server is running before executing the requests.