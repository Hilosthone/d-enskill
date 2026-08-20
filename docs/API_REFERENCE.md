Here is the comprehensive frontend integration guide and endpoint reference for **D Enskill Academy**.

### General Configuration

- **Base URL (Local):** `http://localhost:5000`
- **Base URL (Production):** `[https://denskill-backend.onrender.com](https://denskill-backend.onrender.com)`
- **Authentication Header:** Protected routes require the standard Bearer token schema:

```http
Authorization: Bearer <your_access_token>
Content-Type: application/json

```

---

## 1. Authentication & Account Management (`/api/auth`)

| Method   | Endpoint                    | Access    | Description                              | Request Body / Parameters                         |
| -------- | --------------------------- | --------- | ---------------------------------------- | ------------------------------------------------- |
| **POST** | `/api/auth/signup`          | Public    | Register a new user                      | `{ firstName, lastName, email, password, phone }` |
| **POST** | `/api/auth/signin`          | Public    | Log in and receive access/refresh tokens | `{ email, password }`                             |
| **POST** | `/api/auth/refresh`         | Public    | Exchange refresh token for access token  | `{ refreshToken }`                                |
| **POST** | `/api/auth/logout`          | Protected | Revoke active refresh session            | `{ refreshToken }`                                |
| **POST** | `/api/auth/forgot-password` | Public    | Request password reset OTP               | `{ email }`                                       |
| **POST** | `/api/auth/reset-password`  | Public    | Reset password using OTP                 | `{ email, otp, newPassword }`                     |

---

## 2. Student Portal Dashboard (`/api/dashboard`)

_All endpoints below require a student Bearer token._

| Method   | Endpoint                                           | Description                                       | Query / Path Parameters | Request Body            |
| -------- | -------------------------------------------------- | ------------------------------------------------- | ----------------------- | ----------------------- |
| **GET**  | `/api/dashboard/overview`                          | Full portal cross-tab data (with assigned tutors) | —                       | —                       |
| **GET**  | `/api/dashboard/profile`                           | Student profile details                           | —                       | —                       |
| **GET**  | `/api/dashboard/courses`                           | Enrolled courses & assigned instructors           | —                       | —                       |
| **GET**  | `/api/dashboard/payments`                          | Payment history records                           | —                       | —                       |
| **GET**  | `/api/dashboard/announcements`                     | General platform/course announcements             | —                       | —                       |
| **GET**  | `/api/dashboard/assessments/{courseId}`            | View quizzes/assignments for a course             | Path: `courseId`        | —                       |
| **POST** | `/api/dashboard/assessments/{assessmentId}/submit` | Submit answers or project repository link         | Path: `assessmentId`    | `{ submissionContent }` |
| **GET**  | `/api/dashboard/grades`                            | Personal scores & final aggregate status          | —                       | —                       |
| **GET**  | `/api/dashboard/modules/{courseId}`                | Weekly lecture modules & resources                | Path: `courseId`        | —                       |
| **GET**  | `/api/dashboard/sessions/{courseId}`               | Scheduled live workshop video links               | Path: `courseId`        | —                       |
| **POST** | `/api/dashboard/payment/verify`                    | Verify contribution payment & activate            | —                       | `{ reference }`         |
| **GET**  | `/api/dashboard/scholarship/profile`               | Student scholarship profile details               | —                       | —                       |

---

## 3. Enrollments & Payments (`/api/enrollments`)

| Method   | Endpoint                                       | Description                                 | Request Body / Parameters                         |
| -------- | ---------------------------------------------- | ------------------------------------------- | ------------------------------------------------- |
| **POST** | `/api/enrollments/initialize`                  | Register student details & init Flutterwave | `{ courseId, firstName, lastName, email, phone }` |
| **POST** | `/api/enrollments/pay-installment`             | Initialize subsequent installment payment   | `{ courseId, amount }` (Protected)                |
| **GET**  | `/api/enrollments/installment-status/{course}` | Check installment breakdown & health        | Path: `course` (Protected)                        |
| **GET**  | `/api/enrollments/verify/{reference}`          | Verify Flutterwave transaction reference    | Path: `reference`                                 |
| **POST** | `/api/enrollments/set-password`                | Set password after successful payment       | `{ token, password }`                             |

---

## 4. Scholarship Portal (`/api/scholarship`)

### Enrollment & Pre-Admission

| Method   | Endpoint                                         | Description                                | Request Body / Parameters                                            |
| -------- | ------------------------------------------------ | ------------------------------------------ | -------------------------------------------------------------------- |
| **GET**  | `/api/scholarship/enrollment/cohorts/active`     | Get active scholarship application cohorts | —                                                                    |
| **POST** | `/api/scholarship/enrollment/apply`              | Submit a new scholarship application       | `{ cohortId, firstName, lastName, email, phone, course, statement }` |
| **GET**  | `/api/scholarship/enrollment/status`             | Check application status                   | Query: `?email=...`                                                  |
| **POST** | `/api/scholarship/enrollment/payment/initialize` | Initialize ₦16,000 contribution payment    | `{ applicationId }`                                                  |
| **POST** | `/api/scholarship/enrollment/payment/verify`     | Verify Flutterwave contribution payment    | `{ reference }`                                                      |
| **POST** | `/api/scholarship/enrollment/claim`              | Claim scholarship offer & set password     | `{ applicationId, password }`                                        |

### Scholarship Auth

| Method   | Endpoint                       | Description                      | Request Body                               |
| -------- | ------------------------------ | -------------------------------- | ------------------------------------------ |
| **POST** | `/api/scholarship/auth/signup` | Register new scholarship student | `{ firstName, lastName, email, password }` |
| **POST** | `/api/scholarship/auth/login`  | Scholarship student login        | `{ email, password }`                      |

---

## 5. Admin Portal (`/api/admin`)

_All admin endpoints require an Admin Bearer token (`isAdmin` middleware)._

| Method     | Endpoint                                     | Description                          | Request Body / Parameters                     |
| ---------- | -------------------------------------------- | ------------------------------------ | --------------------------------------------- |
| **POST**   | `/api/admin/auth/login`                      | Admin authentication                 | `{ email, password }`                         |
| **GET**    | `/api/admin/dashboard`                       | Admin metrics & recent enrollments   | —                                             |
| **GET**    | `/api/admin/students`                        | Get all registered students          | —                                             |
| **PUT**    | `/api/admin/students/{id}/status`            | Freeze or unfreeze a student account | Path: `id`, Body: `{ status }`                |
| **DELETE** | `/api/admin/students/{id}`                   | Delete a student account             | Path: `id`                                    |
| **GET**    | `/api/admin/payments`                        | Get system payment logs              | —                                             |
| **GET**    | `/api/admin/courses`                         | Get courses with enrollment counts   | —                                             |
| **PATCH**  | `/api/admin/courses/{courseId}/assign-tutor` | Assign instructor to a course        | Path: `courseId`, Body: `{ tutorId }`         |
| **GET**    | `/api/admin/announcements`                   | Get system announcements             | —                                             |
| **POST**   | `/api/admin/announcements`                   | Create a new announcement            | `{ title, message, target }`                  |
| **GET**    | `/api/admin/instructors`                     | Get system instructors               | —                                             |
| **POST**   | `/api/admin/instructors`                     | Create a new instructor              | `{ firstName, lastName, email, password }`    |
| **PUT**    | `/api/admin/instructors/{id}`                | Update instructor details            | Path: `id`, Body: `{ ...fields }`             |
| **DELETE** | `/api/admin/instructors/{id}`                | Remove an instructor                 | Path: `id`                                    |
| **GET**    | `/api/admin/reports`                         | Get performance & grading reports    | —                                             |
| **PUT**    | `/api/admin/grading/override/{gradeId}`      | Administrative score override        | Path: `gradeId`, Body: `{ newScore, reason }` |
| **GET**    | `/api/admin/attendance/overview/{courseId}`  | Monitor attendance trends & absences | Path: `courseId`                              |
| **GET**    | `/api/admin/settings`                        | Get platform settings                | —                                             |
| **POST**   | `/api/admin/enrollments/manual-onboard`      | Manually onboard pre-paid student    | `{ firstName, lastName, email, cohortId }`    |

### Scholarship Admin Sub-Routes (`/api/admin/scholarships`)

| Method   | Endpoint                                            | Description                                   | Request Body / Parameters                                                       |
| -------- | --------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------- |
| **GET**  | `/api/admin/scholarships/metrics`                   | Scholarship dashboard metrics & active cohort | Query: `?cohortId=...`                                                          |
| **GET**  | `/api/admin/scholarships/applications`              | View all filtered scholarship applications    | Query: `?cohortId=...&status=...`                                               |
| **PUT**  | `/api/admin/scholarships/applications/{id}/approve` | Approve application & generate payment ref    | Path: `id`, Body: `{ adminNotes }`                                              |
| **PUT**  | `/api/admin/scholarships/applications/{id}/reject`  | Reject application                            | Path: `id`, Body: `{ adminNotes }`                                              |
| **POST** | `/api/admin/scholarships/students/manual-onboard`   | Directly onboard a scholarship student        | `{ firstName, lastName, email, cohortId, password }`                            |
| **GET**  | `/api/admin/scholarships/cohorts`                   | List all scholarship cohorts                  | —                                                                               |
| **POST** | `/api/admin/scholarships/cohorts`                   | Create a new scholarship cohort               | `{ name, code, startDate, endDate, applicationOpenDate, applicationCloseDate }` |
| **PUT**  | `/api/admin/scholarships/cohorts/{id}/status`       | Update cohort status (e.g., ACTIVE)           | Path: `id`, Body: `{ status }`                                                  |

---

## 6. Tutor & Instructor Portal (`/api/tutors`)

_All tutor endpoints require an authenticated tutor/instructor Bearer token._

| Method     | Endpoint                                        | Description                                    | Request Body / Parameters                             |
| ---------- | ----------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------- |
| **POST**   | `/api/tutors/auth/login`                        | Instructor login                               | `{ email, password }`                                 |
| **POST**   | `/api/tutors/assessments`                       | Create assessment, quiz, or assignment         | `{ courseId, title, description, dueDate, type }`     |
| **GET**    | `/api/tutors/assessments/{courseId}`            | Fetch published assessments for a course       | Path: `courseId`                                      |
| **PUT**    | `/api/tutors/assessments/{assessmentId}`        | Edit/Update an assessment                      | Path: `assessmentId`, Body: `{ ...fields }`           |
| **DELETE** | `/api/tutors/assessments/{assessmentId}`        | Delete an assessment                           | Path: `assessmentId`                                  |
| **GET**    | `/api/tutors/submissions/{assessmentId}`        | View student submissions                       | Path: `assessmentId`                                  |
| **PUT**    | `/api/tutors/submissions/{submissionId}/grade`  | Grade a student submission                     | Path: `submissionId`, Body: `{ score, feedback }`     |
| **PUT**    | `/api/tutors/submissions/{submissionId}/review` | Submit code review feedback/revisions          | Path: `submissionId`, Body: `{ reviewNotes, status }` |
| **POST**   | `/api/tutors/attendance`                        | Log attendance records for students            | `{ courseId, studentIds, date, status }`              |
| **POST**   | `/api/tutors/modules`                           | Upload weekly lecture modules & files          | `{ courseId, title, description, fileUrl }`           |
| **GET**    | `/api/tutors/modules/{courseId}`                | Fetch course modules for a specific course     | Path: `courseId`                                      |
| **POST**   | `/api/tutors/sessions`                          | Schedule a live lecture session/office hours   | `{ courseId, title, meetingLink, scheduledAt }`       |
| **GET**    | `/api/tutors/sessions/{courseId}`               | Get upcoming and past live sessions            | Path: `courseId`                                      |
| **GET**    | `/api/tutors/roster/{courseId}`                 | View enrolled student roster and tracking      | Path: `courseId`                                      |
| **POST**   | `/api/tutors/announcements`                     | Publish course-specific announcement           | `{ courseId, message }`                               |
| **GET**    | `/api/tutors/analytics/{courseId}`              | Get class grade distributions & early warnings | Path: `courseId`                                      |

---

> 💡 **Tip:** You can interactively test any of these endpoints right in your browser by spinning up the backend and visiting **`http://localhost:5000/api-docs`**. Let me know if you need any specific frontend Axios or fetch wrapper hooks generated for these routes!
