# API Test Cases – Student Management System

## 1. Overview

This document describes the API test cases designed and executed for the Student Management System REST API.

The purpose of API testing is to verify endpoint functionality, request handling, input validation, error handling, and database operations.

Testing is performed using Postman against the locally running backend application.

## 2. Testing Environment

| Item | Details |
|---|---|
| Application | Student Management System |
| Backend Runtime | Node.js |
| Backend Framework | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| API Testing Tool | Postman |
| API Base URL | `http://localhost:3000` |
| Request Format | JSON |
| HTTP Protocol | HTTP |

## 3. Test Case Conventions

The following HTTP response codes are used throughout the test cases:

| Status Code | Meaning |
|---|---|
| 200 | OK – Request completed successfully |
| 201 | Created – Resource created successfully |
| 400 | Bad Request – Invalid request or input |
| 404 | Not Found – Requested resource or endpoint not found |
| 409 | Conflict – Duplicate student information |
| 500 | Internal Server Error – Unexpected server-side error |

**Test result terminology:**

- **PASS:** Actual response matches the expected result.
- **FAIL:** Actual response does not match the expected result.
- **NOT RUN:** Test has not been executed.
- **NOT VERIFIED:** Insufficient evidence to determine the result.

---

# 4. Student Retrieval and Basic CRUD Operations

These test cases verify the basic functionality of retrieving, creating, updating, and deleting student records.

| Test ID | Test Scenario | Method | Endpoint | Expected Status |
|---|---|---|---|---|
| API-001 | Retrieve all students when the database is empty | GET | `/students` | 200 |
| API-002 | Add a student with valid information | POST | `/students` | 201 |
| API-003 | Attempt to add a student with a duplicate SID | POST | `/students` | 409 |
| API-004 | Add a student without the required firstName field | POST | `/students` | 400 |
| API-005 | Add a student with an invalid email address | POST | `/students` | 400 |
| API-006 | Attempt to update a student with an invalid email address | PUT | `/students/update/1001` | 400 |
| API-007 | Update an existing student's information successfully | PUT | `/students/update/1001` | 200 |
| API-008 | Attempt to update a student who does not exist | PUT | `/students/update/9999` | 404 |
| API-009 | Search for an existing student using SID | GET | `/students/search/SID/1001` | 200 |
| API-010 | Delete an existing student | DELETE | `/students/1001` | 200 |
| API-011 | Attempt to delete a student who does not exist | DELETE | `/students/9999` | 404 |
| API-012 | Retrieve all students after deleting the only student | GET | `/students` | 200 |
| API-013 | Attempt to delete a student using a non-numeric SID | DELETE | `/students/abc` | 400 |
| API-014 | Attempt to delete a student using a negative SID | DELETE | `/students/-100` | 400 |
| API-015 | Attempt to delete a student using SID zero | DELETE | `/students/0` | 400 |
| API-016 | Submit malformed JSON when creating a student | POST | `/students` | 400 |

# 5. Student Search Testing

These test cases verify student search functionality using different supported search fields.

## 5.1 Search by Supported Fields

| Test ID | Test Scenario | Method | Endpoint | Expected Status |
|---|---|---|---|---|
| API-017 | Search using a SID that does not exist | GET | `/students/search/SID/9999` | 404 |
| API-018 | Search using an unsupported search option | GET | `/students/search/invalid/John` | 400 |
| API-019 | Search using a non-numeric SID | GET | `/students/search/SID/abc` | 400 |
| API-020 | Search using a negative SID | GET | `/students/search/SID/-100` | 400 |
| API-021 | Search using SID zero | GET | `/students/search/SID/0` | 400 |
| API-022 | Search using firstName | GET | `/students/search/firstname/John` | 200 |
| API-023 | Search using lastName | GET | `/students/search/lastname/Smith` | 200 |
| API-024 | Search using email | GET | `/students/search/email/john@example.com` | 200 |
| API-025 | Search using city | GET | `/students/search/city/Kandy` | 200 |
| API-026 | Search using course | GET | `/students/search/course/Computer%20Science` | 200 |
| API-027 | Search using guardian name | GET | `/students/search/guardian/David%20Smith` | 200 |

## 5.2 Case Sensitivity and Whitespace Handling

| Test ID | Test Scenario | Method | Endpoint | Expected Status |
|---|---|---|---|---|
| API-028 | Search using lowercase firstName | GET | `/students/search/firstname/john` | 404 |
| API-029 | Search using firstName with surrounding spaces | GET | `/students/search/firstname/%20John%20` | 200 |
| API-030 | Search using lowercase lastName | GET | `/students/search/lastname/smith` | 404 |
| API-031 | Search using uppercase email address | GET | `/students/search/email/JOHN@EXAMPLE.COM` | 200 |
| API-032 | Search using lowercase city | GET | `/students/search/city/kandy` | 404 |
| API-033 | Search using lowercase course name | GET | `/students/search/course/computer%20science` | 404 |
| API-034 | Search using lowercase guardian name | GET | `/students/search/guardian/david%20smith` | 404 |

## 5.3 Partial Search Testing

| Test ID | Test Scenario | Method | Endpoint | Expected Status |
|---|---|---|---|---|
| API-035 | Search using a partial firstName | GET | `/students/search/firstname/Jo` | 404 |
| API-036 | Search using a partial email address | GET | `/students/search/email/john` | 404 |
| API-037 | Search using a partial lastName | GET | `/students/search/lastname/Smi` | 404 |
| API-038 | Search using a partial course name | GET | `/students/search/course/Computer` | 404 |
| API-039 | Search using a partial guardian name | GET | `/students/search/guardian/David` | 404 |
| API-040 | Search using a partial city name | GET | `/students/search/city/Kan` | 404 |

## 5.4 SID Format and Boundary Testing

| Test ID | Test Scenario | Method | Endpoint | Expected Status |
|---|---|---|---|---|
| API-041 | Search using a SID containing leading zeros | GET | `/students/search/SID/001001` | 200 |
| API-042 | Search using a decimal SID | GET | `/students/search/SID/1001.5` | 400 |
| API-043 | Search using an unsafe integer SID | GET | `/students/search/SID/9007199254740992` | 400 |
| API-044 | Search using an empty search value | GET | `/students/search/firstname/` | 404 |
| API-045 | Search using a whitespace-only value | GET | `/students/search/firstname/%20%20%20` | 404 |
| API-046 | Search using an unsupported field such as age | GET | `/students/search/age/24` | 400 |

## 5.5 Unsupported HTTP Methods

| Test ID | Test Scenario | Method | Endpoint | Expected Status |
|---|---|---|---|---|
| API-047 | Attempt to search using POST | POST | `/students/search/firstname/John` | 404 |
| API-048 | Attempt to search using PUT | PUT | `/students/search/firstname/John` | 404 |
| API-049 | Attempt to search using DELETE | DELETE | `/students/search/firstname/John` | 404 |
| API-050 | Retrieve all students after search operations | GET | `/students` | 200 |

# 6. Student Creation – Input Validation

These test cases verify validation rules when creating student records.

## 6.1 Student ID Validation

| Test ID | Test Scenario | Method | Endpoint | Expected Status |
|---|---|---|---|---|
| API-051 | Create a student using an alphabetic SID | POST | `/students` | 400 |
| API-052 | Create a student using a negative SID | POST | `/students` | 400 |
| API-053 | Create a student using SID zero | POST | `/students` | 400 |
| API-054 | Create a student using a decimal SID | POST | `/students` | 400 |
| API-055 | Create a student without SID | POST | `/students` | 400 |
| API-056 | Create a student using an empty SID | POST | `/students` | 400 |
| API-057 | Create a student using a numeric string as SID | POST | `/students` | 201 |
| API-058 | Create a student using a whitespace-only SID | POST | `/students` | 400 |
| API-059 | Create a student using an unsafe integer SID | POST | `/students` | 400 |

## 6.2 First Name Validation

| Test ID | Test Scenario | Method | Endpoint | Expected Status |
|---|---|---|---|---|
| API-060 | Create a student without firstName | POST | `/students` | 400 |
| API-061 | Create a student with an empty firstName | POST | `/students` | 400 |
| API-062 | Create a student with a whitespace-only firstName | POST | `/students` | 400 |

## 6.3 Last Name Validation

| Test ID | Test Scenario | Method | Endpoint | Expected Status |
|---|---|---|---|---|
| API-063 | Create a student without lastName | POST | `/students` | 400 |
| API-064 | Create a student with an empty lastName | POST | `/students` | 400 |
| API-065 | Create a student with a whitespace-only lastName | POST | `/students` | 400 |

## 6.4 Email Validation

| Test ID | Test Scenario | Method | Endpoint | Expected Status |
|---|---|---|---|---|
| API-066 | Create a student without email | POST | `/students` | 400 |
| API-067 | Create a student with an empty email | POST | `/students` | 400 |
| API-068 | Create a student with a whitespace-only email | POST | `/students` | 400 |
| API-069 | Create a student with an email missing the @ symbol | POST | `/students` | 400 |
| API-070 | Create a student with an incomplete email domain | POST | `/students` | 400 |
| API-071 | Create a student with an email missing the local part | POST | `/students` | 400 |
| API-072 | Create a student with multiple @ symbols in the email | POST | `/students` | 400 |
| API-073 | Create a student with an email exceeding the accepted length | POST | `/students` | 400 |
| API-074 | Create a student with an email at the accepted maximum length | POST | `/students` | 201 |

## 6.5 First Name and Last Name Length Validation

| Test ID | Test Scenario | Method | Endpoint | Expected Status |
|---|---|---|---|---|
| API-075 | Create a student with a firstName exceeding 50 characters | POST | `/students` | 400 |
| API-076 | Create a student with a firstName of exactly 50 characters | POST | `/students` | 201 |
| API-077 | Create a student with a lastName exceeding 50 characters | POST | `/students` | 400 |
| API-078 | Create a student with a lastName of exactly 50 characters | POST | `/students` | 201 |

## 6.6 City Validation

| Test ID | Test Scenario | Method | Endpoint | Expected Status |
|---|---|---|---|---|
| API-079 | Create a student without nearCity | POST | `/students` | 400 |
| API-080 | Create a student with an empty nearCity | POST | `/students` | 400 |
| API-081 | Create a student with a whitespace-only nearCity | POST | `/students` | 400 |

## 6.7 Guardian Validation

| Test ID | Test Scenario | Method | Endpoint | Expected Status |
|---|---|---|---|---|
| API-082 | Create a student without guardian | POST | `/students` | 400 |
| API-083 | Create a student with an empty guardian | POST | `/students` | 400 |
| API-084 | Create a student with a whitespace-only guardian | POST | `/students` | 400 |

# 7. Course and Subject Validation

These test cases verify the handling of course and subject values, including string formats, arrays, empty values, and maximum lengths.

## 7.1 Course Validation

| Test ID | Test Scenario | Method | Endpoint | Expected Status |
|---|---|---|---|---|
| API-085 | Create a student with course supplied as a single string | POST | `/students` | 201 |
| API-086 | Create a student with course supplied as a number | POST | `/students` | 400 |
| API-087 | Create a student with an array containing an invalid course value | POST | `/students` | 400 |
| API-088 | Create a student with an empty course array | POST | `/students` | 201 |
| API-089 | Create a student with empty values inside the course array | POST | `/students` | 201 |

## 7.2 Subject Validation

| Test ID | Test Scenario | Method | Endpoint | Expected Status |
|---|---|---|---|---|
| API-090 | Create a student with subject supplied as a number | POST | `/students` | 400 |
| API-091 | Create a student with subject supplied as a single string | POST | `/students` | 201 |
| API-092 | Create a student with an array containing an invalid subject value | POST | `/students` | 400 |
| API-093 | Create a student with an empty subject array | POST | `/students` | 201 |
| API-094 | Create a student with empty values inside the subject array | POST | `/students` | 201 |
| API-095 | Create a student with a subject exceeding 100 characters | POST | `/students` | 400 |
| API-096 | Create a student with a subject of exactly 100 characters | POST | `/students` | 201 |

# 8. Student Update Testing

These test cases verify student update functionality, including valid updates, invalid values, and error handling.

## 8.1 Update Validation and Successful Updates

| Test ID | Test Scenario | Method | Endpoint | Expected Status |
|---|---|---|---|---|
| API-097 | Attempt to update a student using an invalid email address | PUT | `/students/update/1014` | 400 |
| API-098 | Verify that student information remains unchanged after an invalid update | GET | `/students/search/SID/1014` | 200 |
| API-099 | Update a student's email address using a valid email | PUT | `/students/update/1014` | 200 |
| API-100 | Attempt to update subject using an invalid number value | PUT | `/students/update/1014` | 400 |
| API-101 | Attempt to update subject with a value exceeding 100 characters | PUT | `/students/update/1014` | 400 |
| API-102 | Clear a student's subject using an empty array | PUT | `/students/update/1014` | 200 |
| API-103 | Update a student's subject using a valid array | PUT | `/students/update/1014` | 200 |

## 8.2 Update Student ID Validation

| Test ID | Test Scenario | Method | Endpoint | Expected Status |
|---|---|---|---|---|
| API-104 | Attempt to update a student using an invalid SID in the URL | PUT | `/students/update/abc` | 400 |
| API-105 | Attempt to update a student who does not exist | PUT | `/students/update/99999` | 404 |
| API-106 | Submit an update request containing only the existing SID | PUT | `/students/update/1014` | 400 |
| API-107 | Verify that the student record remains unchanged after the SID-only update attempt | GET | `/students/search/SID/1014` | 200 |
| API-108 | Attempt to change an existing student's SID | PUT | `/students/update/1014` | 400 |
| API-109 | Verify that the student can be retrieved using the changed SID after the earlier update defect | GET | `/students/search/SID/1015` | 200 |
| API-110 | Verify that the original SID no longer retrieves the student after the earlier update defect | GET | `/students/search/SID/1014` | 404 |

**Note:** API-106 and API-108 exposed defects in the original update implementation. Their expected results describe the intended behaviour, not the original observed results. The implementation was subsequently corrected and retested in API-111 to API-116.

# 9. Regression Testing – SID Immutability Fix

These test cases verify the correction made to prevent student IDs from being modified through the update endpoint.

## 9.1 Student ID Protection

| Test ID | Test Scenario | Method | Endpoint | Expected Status |
|---|---|---|---|---|
| API-111 | Attempt to update a student's SID after implementing SID protection | PUT | `/students/update/1015` | 400 |

Expected response:

```json
{
    "message": "Student ID cannot be updated."
}
```

## 9.2 Normal Update Functionality

| Test ID | Test Scenario | Method | Endpoint | Expected Status |
|---|---|---|---|---|
| API-112 | Verify that normal student updates still work after SID protection | PUT | `/students/update/1015` | 200 |

## 9.3 Empty Update Request Validation

| Test ID | Test Scenario | Method | Endpoint | Expected Status |
|---|---|---|---|---|
| API-113 | Attempt to update a student using an empty JSON object | PUT | `/students/update/1015` | 400 |

Expected response:

```json
{
    "message": "No valid fields provided for updating."
}
```

## 9.4 Student Creation Regression Testing

| Test ID | Test Scenario | Method | Endpoint | Expected Status |
|---|---|---|---|---|
| API-114 | Verify that student creation still accepts a SID after implementing update protection | POST | `/students` | 201 |

## 9.5 Verify Restored Student Record

After identifying the SID modification defect, the original SID of the affected student was restored directly in MongoDB Atlas.

The restoration was verified manually in the test database. A subsequent API request was used to confirm that the incorrect SID no longer retrieves the student.

| Test ID | Test Scenario | Execution Type | Expected Result |
|---|---|---|---|
| API-115 | Verify that the student's original SID has been restored to `1014` directly in MongoDB Atlas. | Manual database verification | The student's record contains the original SID `1014`. |
| API-116 | Verify that the incorrect SID no longer retrieves the student after the original SID has been restored. | GET `/students/search/SID/1015` | 404 Not Found |

**API-115 – Manual verification**

- Verify the affected student's record directly in MongoDB Atlas.
- Confirm that the original SID is `1014`.
- This is a manual database verification and is not included in the Newman HTTP request count.

**API-116 – API verification**

- Method: `GET`
- Endpoint: `/students/search/SID/1015`
- Expected status: `404 Not Found`
- Expected result: The API does not return a student record for the incorrect SID `1015`.
- Execution: Included in the Newman collection.

---

# 10. Test Data and Preconditions

The following conditions should be considered when executing the test cases:

- The backend application must be running.
- MongoDB must be connected successfully.
- The Postman environment must be selected.
- The `base_url` variable must point to the local backend.
- Student IDs used for creation must not already exist in the database.
- Tests involving existing students require the relevant test records to be available.
- Tests involving deletion should use disposable test records.
- Tests that modify student information should use a dedicated test database.

Some test cases depend on records created by earlier test cases. Execute dependent tests in the appropriate order or prepare the required test data beforehand.

# 11. Expected Testing Outcomes

The API should satisfy the following requirements:

1. Retrieve student records successfully.
2. Create student records using valid information.
3. Reject duplicate student IDs.
4. Validate required student fields.
5. Reject invalid email addresses.
6. Validate student ID formats and boundaries.
7. Validate course and subject values.
8. Support searching students using supported fields.
9. Return appropriate responses when students cannot be found.
10. Update editable student information successfully.
11. Prevent student IDs from being modified through the update endpoint.
12. Reject empty update requests.
13. Delete existing student records.
14. Return appropriate HTTP status codes for invalid requests and unsuccessful operations.
15. Preserve existing student data when an update request is rejected.

# 12. Evidence and Screenshots

Postman screenshots should be stored in the `screenshots/` directory.

Recommended screenshot evidence includes:

- Request method and endpoint.
- Request body, where applicable.
- HTTP response status.
- Response body.
- Postman Test Results, when automated assertions are used.

Screenshots should be organized according to the relevant testing category.

# 13. Test Execution Records

Actual execution results are documented separately in:

`test-execution-results.md`

The execution record should contain:

- Test ID.
- Actual HTTP status.
- Actual response.
- Result (PASS, FAIL, NOT RUN, or NOT VERIFIED).
- Relevant observations.
- Defects identified and subsequent retest information.

A test should only be marked as passed when its actual response matches the expected behaviour.