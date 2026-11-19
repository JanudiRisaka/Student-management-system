# API Test Execution Results - Student Management System

## 1. Overview

This document summarises the manual and automated API testing performed on the Student Management System REST API.

Testing covered student management operations, input validation, error handling, and regression testing.

## 2. Testing Environment

| Item | Details |
|---|---|
| Backend | Node.js and Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Manual Testing | Postman |
| Automated Testing | Newman |
| Runtime | Node.js |

## 3. Test Coverage

The API testing covered the following areas:

- **Student Retrieval:** Retrieve all students and search by supported fields.
- **Student Creation:** Create students and validate required fields.
- **Student Updates:** Update student information and validate update requests.
- **Student Deletion:** Delete existing and nonexistent students.
- **Input Validation:** Test missing, empty, invalid, and incorrectly formatted values.
- **Search Validation:** Test case sensitivity, whitespace, partial searches, and SID formats.
- **Error Handling:** Verify appropriate HTTP status codes and error messages.
- **Regression Testing:** Verify that corrections did not break existing functionality.

The test case documentation contains 116 test cases, including one manual database verification.

## 4. Defects Identified and Fixed

During testing, the following issues were identified:

| Issue | Original Behaviour | Correction |
|---|---|---|
| Invalid email during creation | Returned `500 Internal Server Error` | Corrected to return `400 Bad Request` |
| SID-only update | Allowed an update without editable fields | Rejected with `400 Bad Request` |
| SID modification | Allowed students' SIDs to be changed | SID updates are now rejected |
| Search whitespace | Surrounding spaces affected search results | Search values are trimmed before processing |

Regression testing confirmed that the corrected update validation, SID protection, and normal student operations continued to work.

The original failures for API-106 and API-108 are retained in the historical testing record. Their corrected behaviour was subsequently tested.

## 5. Automated Test Execution - Newman

The automated test suite was executed using:

```bash
node scripts/run-api-tests.js
```

The runner uses a separate MongoDB Atlas test database (`stu-management-test`) and starts the API server on port `3001`.

### Execution Results

| Metric | Result |
|---|---:|
| HTTP Requests Executed | 115 |
| Failed Requests | 0 |
| Total Assertions | 180 |
| Passed Assertions | 180 |
| Failed Assertions | 0 |
| Execution Time | 31 seconds |
| Average Response Time | 57 ms |

**Overall Result: PASS**

All 180 assertions passed during the latest Newman execution.

### Generated Reports

The automated runner generates:

- `reports/newman-report.html` - Visual test execution report.
- `reports/newman-report.json` - Structured test execution results.

## 6. Testing Limitations

- Results cover the tested scenarios and do not guarantee that every possible API behaviour has been tested.
- Some tests depend on data created by earlier test cases.
- The automated suite uses a separate test database.
- API-115 is a manual database restoration verification and is not included in the 115 Newman HTTP requests.
- Passing tests do not establish that the application is production-ready.

## 7. Conclusion

The testing process helped identify and correct issues in email validation, update requests, SID protection, and search handling.

The test documentation contains 116 test cases, comprising 115 HTTP requests executed through Newman and one manual database restoration verification.

The latest Newman execution completed all 115 HTTP requests with 180 passing assertions and no failures.

The results demonstrate that the tested API functionality behaved as expected during the recorded executions.