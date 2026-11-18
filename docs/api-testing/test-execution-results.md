# API Test Execution Results – Student Management System

## 1. Overview

This document records the actual execution results of the Student Management System REST API tests performed using Postman.

The tests cover student retrieval, creation, updating, searching, deletion, input validation, error handling, and regression testing.

Results are recorded based on the HTTP responses observed during execution.

## 2. Testing Environment

| Item | Details |
|---|---|
| Application | Student Management System |
| Backend | Node.js and Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Testing Tool | Postman |
| Base URL | `http://localhost:3000` |
| Execution Date | 18 November 2026 |

## 3. Result Classification

| Result | Description |
|---|---|
| PASS | Actual response matched the expected behaviour. |
| FAIL | Actual response did not match the expected behaviour. |
| NOT RUN | Test has not been executed. |
| NOT VERIFIED | Insufficient evidence to determine the result. |

**PASS**: Diagnostic verification passed. The response confirmed the unintended state produced by an earlier defect; it does not indicate that the underlying behaviour was correct.

**Important:** These results describe observed HTTP responses. They do not imply that automated Postman assertions passed. Automated assertion results must be verified separately using Postman's Test Results panel.

---

# 4. Student Retrieval and Basic CRUD Operations

| Test ID | Test Scenario | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| API-001 | Retrieve all students when database is empty | 200 | 200 | PASS |
| API-002 | Add a student with valid information | 201 | 201 | PASS |
| API-003 | Attempt to add a student with duplicate SID | 409 | 409 | PASS |
| API-004 | Create student without firstName | 400 | 400 | PASS |
| API-005 | Create student with invalid email | 400 | 500 → 400 | PASS* |
| API-006 | Update student using invalid email | 400 | 400 | PASS |
| API-007 | Update existing student successfully | 200 | 200 | PASS |
| API-008 | Update a nonexistent student | 404 | 404 | PASS |
| API-009 | Search for an existing student using SID | 200 | 200 | PASS |
| API-010 | Delete an existing student | 200 | 200 | PASS |
| API-011 | Delete a nonexistent student | 404 | 404 | PASS |
| API-012 | Retrieve students after deletion | 200 | 200 | PASS |
| API-013 | Delete using a non-numeric SID | 400 | 400 | PASS |
| API-014 | Delete using a negative SID | 400 | 400 | PASS |
| API-015 | Delete using SID zero | 400 | 400 | PASS |
| API-016 | Submit malformed JSON | 400 | 400 | PASS |

*API-005 initially returned `500 Internal Server Error`. The error handling was corrected, and the test was repeated successfully with `400 Bad Request`.

# 5. Student Search Testing

## 5.1 Search by Supported Fields

| Test ID | Test Scenario | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| API-017 | Search using a nonexistent SID | 404 | 404 | PASS |
| API-018 | Search using an unsupported option | 400 | 400 | PASS |
| API-019 | Search using a non-numeric SID | 400 | 400 | PASS |
| API-020 | Search using a negative SID | 400 | 400 | PASS |
| API-021 | Search using SID zero | 400 | 400 | PASS |
| API-022 | Search using firstName | 200 | 404 → 200 | PASS* |
| API-023 | Search using lastName | 200 | 200 | PASS |
| API-024 | Search using email | 200 | 200 | PASS |
| API-025 | Search using city | 200 | 200 | PASS |
| API-026 | Search using course | 200 | 200 | PASS |
| API-027 | Search using guardian name | 200 | 200 | PASS |

*API-022 initially returned 404 because the database was empty. After creating the test student, the request was repeated and returned 200.

## 5.2 Case Sensitivity and Whitespace Handling

| Test ID | Test Scenario | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| API-028 | Search using lowercase firstName | 404 | 404 | PASS |
| API-029 | Search using firstName with surrounding spaces | 200 | 200 | PASS |
| API-030 | Search using lowercase lastName | 404 | 404 | PASS |
| API-031 | Search using uppercase email | 200 | 200 | PASS |
| API-032 | Search using lowercase city | 404 | 404 | PASS |
| API-033 | Search using lowercase course | 404 | 404 | PASS |
| API-034 | Search using lowercase guardian name | 404 | 404 | PASS |

## 5.3 Partial Search Testing

| Test ID | Test Scenario | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| API-035 | Search using partial firstName | 404 | 404 | PASS |
| API-036 | Search using partial email | 404 | 404 | PASS |
| API-037 | Search using partial lastName | 404 | 404 | PASS |
| API-038 | Search using partial course | 404 | 404 | PASS |
| API-039 | Search using partial guardian name | 404 | 404 | PASS |
| API-040 | Search using partial city | 404 | 404 | PASS |

## 5.4 SID Format and Boundary Testing

| Test ID | Test Scenario | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| API-041 | Search using SID with leading zeros | 200 | 200 | PASS |
| API-042 | Search using decimal SID | 400 | 400 | PASS |
| API-043 | Search using an unsafe integer SID | 400 | 400 | PASS |
| API-044 | Search using an empty value | 404 | 404 | PASS |
| API-045 | Search using whitespace-only value | 404 | 404 | PASS |
| API-046 | Search using an unsupported field | 400 | 400 | PASS |

## 5.5 Unsupported HTTP Methods

| Test ID | Test Scenario | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| API-047 | Attempt search using POST | 404 | 404 | PASS |
| API-048 | Attempt search using PUT | 404 | 404 | PASS |
| API-049 | Attempt search using DELETE | 404 | 404 | PASS |
| API-050 | Retrieve all students after search operations | 200 | 200 | PASS |

**Observation:** The search implementation uses exact matching for the tested fields. Partial searches and most case-different text searches returned no results. Uppercase email search returned a matching result.

# 6. Student Creation – Input Validation

## 6.1 Student ID Validation

| Test ID | Test Scenario | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| API-051 | Alphabetic SID | 400 | 400 | PASS |
| API-052 | Negative SID | 400 | 400 | PASS |
| API-053 | SID zero | 400 | 400 | PASS |
| API-054 | Decimal SID | 400 | 400 | PASS |
| API-055 | Missing SID | 400 | 400 | PASS |
| API-056 | Empty SID | 400 | 400 | PASS |
| API-057 | Numeric string SID | 201 | 201 | PASS |
| API-058 | Whitespace-only SID | 400 | 400 | PASS |
| API-059 | Unsafe integer SID | 400 | 400 | PASS |

## 6.2 First Name Validation

| Test ID | Test Scenario | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| API-060 | Missing firstName | 400 | 400 | PASS |
| API-061 | Empty firstName | 400 | 400 | PASS |
| API-062 | Whitespace-only firstName | 400 | 400 | PASS |

## 6.3 Last Name Validation

| Test ID | Test Scenario | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| API-063 | Missing lastName | 400 | 400 | PASS |
| API-064 | Empty lastName | 400 | 400 | PASS |
| API-065 | Whitespace-only lastName | 400 | 400 | PASS |

## 6.4 Email Validation

| Test ID | Test Scenario | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| API-066 | Missing email | 400 | 400 | PASS |
| API-067 | Empty email | 400 | 400 | PASS |
| API-068 | Whitespace-only email | 400 | 400 | PASS |
| API-069 | Email missing @ symbol | 400 | 400 | PASS |
| API-070 | Incomplete email domain | 400 | 400 | PASS |
| API-071 | Email missing username | 400 | 400 | PASS |
| API-072 | Multiple @ symbols | 400 | 400 | PASS |
| API-073 | Email exceeding accepted length | 400 | 400 | PASS |
| API-074 | Email at accepted maximum length | 201 | 201 | PASS |

## 6.5 First Name and Last Name Length Validation

| Test ID | Test Scenario | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| API-075 | FirstName exceeding 50 characters | 400 | 400 | PASS |
| API-076 | FirstName of exactly 50 characters | 201 | 201 | PASS |
| API-077 | LastName exceeding 50 characters | 400 | 400 | PASS |
| API-078 | LastName of exactly 50 characters | 201 | 201 | PASS |

## 6.6 City Validation

| Test ID | Test Scenario | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| API-079 | Missing nearCity | 400 | 400 | PASS |
| API-080 | Empty nearCity | 400 | 400 | PASS |
| API-081 | Whitespace-only nearCity | 400 | 400 | PASS |

## 6.7 Guardian Validation

| Test ID | Test Scenario | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| API-082 | Missing guardian | 400 | 400 | PASS |
| API-083 | Empty guardian | 400 | 400 | PASS |
| API-084 | Whitespace-only guardian | 400 | 400 | PASS |

# 7. Course and Subject Validation

## 7.1 Course Validation

| Test ID | Test Scenario | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| API-085 | Course supplied as a single string | 201 | 201 | PASS |
| API-086 | Course supplied as a number | 400 | 400 | PASS |
| API-087 | Course array containing an invalid value | 400 | 400 | PASS |
| API-088 | Empty course array | 201 | 201 | PASS |
| API-089 | Course array containing blank entries | 201 | 201 | PASS |

## 7.2 Subject Validation

| Test ID | Test Scenario | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| API-090 | Subject supplied as a number | 400 | 400 | PASS |
| API-091 | Subject supplied as a single string | 201 | 201 | PASS |
| API-092 | Subject array containing an invalid value | 400 | 400 | PASS |
| API-093 | Empty subject array | 201 | 201 | PASS |
| API-094 | Subject array containing blank entries | 201 | 201 | PASS |
| API-095 | Subject exceeding 100 characters | 400 | 400 | PASS |
| API-096 | Subject of exactly 100 characters | 201 | 201 | PASS |

**Observation:** Single course and subject strings were normalized into arrays. Empty arrays were accepted, and blank array entries were filtered.

# 8. Student Update Testing

## 8.1 Update Validation and Successful Updates

| Test ID | Test Scenario | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| API-097 | Attempt update using invalid email | 400 | 400 | PASS |
| API-098 | Verify student data after failed email update | 200 | 200 | PASS |
| API-099 | Update email using a valid address | 200 | 200 | PASS |
| API-100 | Update subject using an invalid number | 400 | 400 | PASS |
| API-101 | Update subject exceeding 100 characters | 400 | 400 | PASS |
| API-102 | Clear subject using an empty array | 200 | 200 | PASS |
| API-103 | Update subject using a valid array | 200 | 200 | PASS |

## 8.2 Update Student ID Validation

| Test ID | Test Scenario | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| API-104 | Update using invalid SID in URL | 400 | 400 | PASS |
| API-105 | Update a nonexistent student | 404 | 404 | PASS |
| API-106 | Submit an update containing only SID | 400 | 200 | FAIL |
| API-107 | Verify student record after SID-only update | 200 | 200 | PASS |
| API-108 | Attempt to change an existing student's SID | 400 | 200 | FAIL |
| API-109 | Verify student under the changed SID | 200 | 200 | PASS** |
| API-110 | Verify the old SID no longer finds the student | 404 | 404 | PASS** |

**Historical defect observations:**

- API-106 unexpectedly returned `200 OK` for an update containing only the SID. The `updatedAt` timestamp changed even though no editable field was supplied.
- API-108 unexpectedly returned `200 OK` and changed Noah Silva's SID from `1014` to `1015`.
- API-109 confirmed that the record could then be retrieved using SID `1015`.
- API-110 confirmed that the old SID `1014` no longer retrieved the record.

API-109 and API-110 are diagnostic checks of the unintended state change. They do not mean that changing a student's SID was correct behaviour.

# 9. Regression Testing – SID Immutability Fix

After identifying the SID modification defect, the student update route was corrected to prevent changes to the Student ID (SID).

The updated implementation rejects requests containing the `SID` field and prevents student identifiers from being modified through the update endpoint.

## 9.1 Student ID Protection

| Test ID | Test Scenario | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| API-111 | Attempt to update a student's SID after implementing SID protection | 400 | 400 | PASS |

**Observed response:**

```json
{
    "message": "Student ID cannot be updated."
}
```

The API correctly rejected the attempt to modify the student identifier.

## 9.2 Normal Update Functionality

| Test ID | Test Scenario | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| API-112 | Verify that normal student updates still work after SID protection | 200 | 200 | PASS |

A normal update was successful after implementing SID protection, confirming that editable student fields could still be modified.

## 9.3 Empty Update Request Validation

| Test ID | Test Scenario | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| API-113 | Attempt to update a student without providing editable fields | 400 | 400 | PASS |

**Observed response:**

```json
{
    "message": "No valid fields provided for updating."
}
```

The API rejected the update request because no editable fields were provided.

## 9.4 Student Creation Regression Testing

| Test ID | Test Scenario | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| API-114 | Verify that student creation still accepts a SID after implementing update protection | 201 | 201 | PASS |

Student creation remained functional after introducing SID protection in the update endpoint.

## 9.5 Verify Restored Student Record

After identifying the SID modification defect, Noah Silva's original SID (`1014`) was restored directly in MongoDB Atlas.

This was a manual database correction rather than an API update operation.

| Test ID | Test Scenario | Expected Status | Actual Status | Result |
|---|---|---:|---:|---|
| API-115 | Verify that the student can be retrieved using the restored original SID | 200 | 200 | PASS |
| API-116 | Verify that the incorrect SID no longer retrieves the student | 404 | 404 | PASS |

API-115 confirmed that Noah Silva could be retrieved using SID `1014`.

API-116 confirmed that searching for SID `1015` returned:

```json
{
    "message": "No students found."
}
```

The original student record was therefore accessible using its restored identifier, while the incorrect identifier no longer returned the record.

---

# 10. Overall Test Execution Summary

The test execution covered 116 test cases across student retrieval, creation, updating, searching, deletion, validation, error handling, and regression testing.

The execution identified two significant defects in the original implementation:

1. The API returned an internal server error (`500`) for an invalid email address during student creation.
2. The update endpoint allowed the Student ID to be modified and accepted an update containing only the SID.

The identified issues were addressed and the relevant functionality was retested.

API-005 was initially unsuccessful but returned the expected `400 Bad Request` after the error-handling correction.

API-106 and API-108 exposed the SID update defects. These tests remain recorded as failures of the original implementation. Subsequent regression tests verified the SID protection changes.

API-022 initially returned `404` because the database did not contain the required test record. After preparing the test data, the request returned the expected `200 OK`.

## 10.1 Important Observations

- Student searches use exact matching for the tested fields.
- Most tested text searches are case-sensitive.
- Uppercase email searches returned matching results.
- Numeric string SIDs are accepted and converted into numeric values.
- Course and subject strings are normalized into arrays.
- Empty course and subject arrays are accepted.
- Blank entries inside course and subject arrays are filtered.
- Subject values are limited to 100 characters.
- Invalid email addresses are rejected with `400 Bad Request`.
- Student IDs cannot be modified through the protected update endpoint.
- Normal updates and student creation continue to work after the SID protection change.

## 10.2 Testing Limitations

- Results represent the observed HTTP responses during manual Postman execution.
- Automated Postman assertion results are not claimed unless independently verified in the Postman Test Results panel.
- Some test cases depend on records created by earlier test cases.
- The test environment uses MongoDB Atlas and a locally running Express application.
- Database state changes can affect the results of subsequent tests.
- API-109 and API-110 are diagnostic checks of the original SID modification defect, not evidence that changing a student ID is valid behaviour.

## 10.3 Conclusion

The testing process identified defects in email validation error handling and Student ID immutability.

After applying the corrections, the relevant regression tests confirmed that invalid email updates were rejected, Student IDs could no longer be modified through the update endpoint, normal student updates remained functional, and student creation continued to work.

The API testing process also verified the main student management operations and their expected validation and error responses.

These results document the tested implementation and should not be interpreted as proof that the application is production-ready.