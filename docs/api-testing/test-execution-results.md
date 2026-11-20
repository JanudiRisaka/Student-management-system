# API Test Execution Results – Student Management System

## 1. Overview

This document summarises manual and automated API testing of the Student Management System REST API. It records the latest user-reported Newman run and preserves the earlier baseline.

Testing covered student CRUD operations, searching, input validation, error handling, SID immutability, and name-validation regression testing.

## 2. Testing Environment

| Item | Details |
|---|---|
| Backend | Node.js and Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Manual testing | Postman |
| Automated testing | Newman |
| Automated API URL | `http://127.0.0.1:3001` |
| Test database | `stu-management-test` (dedicated database) |
| Test command | `npm test` |

The automated runner starts a separate test API server and stops it after execution. It resets records in the dedicated test database; do not point it at a development or production database.

## 3. Test Coverage

- **Student retrieval and search:** Retrieve students and search supported fields.
- **Student creation:** Validate required fields, emails, lengths, arrays, and server-generated SIDs.
- **Student updates:** Test valid changes, invalid values, and preservation of existing records after rejected updates.
- **Student deletion:** Delete existing records and handle invalid or missing student IDs.
- **Search validation:** Test whitespace, case sensitivity, partial matches, and SID formats.
- **Regression testing:** Verify SID immutability and one-word first/last-name validation.

The current Postman/Newman collection contains **121 HTTP requests**. The test-case catalogue additionally documents **API-115**, a historical manual database restoration verification that is not an HTTP request.

## 4. Defects Identified and Corrected

| Issue | Earlier behaviour | Expected corrected behaviour |
|---|---|---|
| Invalid email during creation | Returned HTTP 500 | Return HTTP 400 |
| SID-only update | Allowed an update without editable fields | Return HTTP 400 |
| SID modification | Allowed SID changes | Reject SID updates |
| Search whitespace | Surrounding spaces affected search | Trim search values |
| Multiword first/last names | Validation errors could be classified as HTTP 500 | Return HTTP 400 for internal whitespace |

Earlier SID modification failures remain part of the historical record; they are not claims about the current implementation.

## 5. Automated Test Execution – Newman

Command:

```bash
npm test
```

### 5.1 Latest verified console results (20 November 2026)

The following figures come from the Newman terminal summary supplied after adding API-117–API-122.

| Metric | Result |
|---|---:|
| Iterations | 1 |
| HTTP requests executed | 121 |
| Failed requests | 0 |
| Test scripts executed | 121 |
| Failed test scripts | 0 |
| Prerequest scripts executed | 6 |
| Failed prerequest scripts | 0 |
| Assertions executed | 210 |
| Failed assertions | 0 |
| Passed assertions | 210 |
| Total run duration | 34.1 seconds |
| Average response time | 74 ms |
| Minimum response time | 1 ms |
| Maximum response time | 242 ms |
| Approximate data received | 20.66 kB |

**Overall result: PASS — 121 requests, 210 passing assertions, 0 failures.**

The terminal output specifically confirms that **API-122 – Verify Rejected Name Updates Did Not Change Student** returned `200 OK` and passed both assertions, including **“Names remain unchanged.”**

The complete Newman summary indicates the full updated collection passed, including API-117–API-122. Individual request-by-request details should be taken from the generated JSON/HTML reports rather than inferred from this summary.

### 5.2 Earlier automated execution baseline

| Metric | Earlier recorded result |
|---|---:|
| HTTP requests | 115 |
| Failed requests | 0 |
| Assertions | 180 |
| Failed assertions | 0 |
| Execution time | 29.8 seconds |
| Average response time | 52 ms |

**Historical result: PASS.** This baseline is retained for traceability; it is not the latest execution.

### 5.3 Generated Reports

The automated runner saved:

- `reports/newman-report.html` – visual Newman report.
- `reports/newman-report.json` – structured Newman report.

The latest report paths were shown in the user's terminal output. The report files themselves were not supplied for independent request-level inspection.

## 6. Testing Limitations

- Passing tests demonstrate the tested behaviours only; they do not prove complete correctness or production readiness.
- Some requests rely on records created earlier in the collection and must execute in order.
- The test database is separate from the development database.
- **API-115** is a historical manual database verification, not one of the 121 automated HTTP requests.
- The latest metrics were verified against the shared terminal summary, not by independently rerunning the API or inspecting the report files.

## 7. Conclusion

The updated Newman run completed **121 HTTP requests** with **210 passing assertions** and **zero failures** in **34.1 seconds**. The result supports successful regression testing of the existing API functionality and the newly added first/last-name validation scenarios. Historical defects and earlier results remain documented separately for traceability.