## Question Bank API Documentation

The Question Bank API manages assessment containers, configuration parameters (duration, scheduling, attempt limits), lifecycle state transitions, and bulk question imports.

### 1. Base URL & Authentication

* **Base Route:** `/api/question-banks`
* **Authentication:** Required (`Bearer Token`). All endpoints enforce role-based access control for **Tutors** and **Admins**.

---

### 2. Endpoints Overview

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| **GET** | `/api/question-banks` | Admin, Tutor | Retrieve paginated list of question banks with search & filters. Tutors only see their own. |
| **POST** | `/api/question-banks` | Admin, Tutor | Create a new question bank container (defaults to status `DRAFT`). |
| **GET** | `/api/question-banks/:id` | Admin, Tutor | Get single question bank with its nested questions and options array. |
| **PUT** | `/api/question-banks/:id` | Admin, Tutor | Update question bank configuration fields safely. |
| **DELETE** | `/api/question-banks/:id` | Admin, Tutor | Delete a question bank and its cascading relations. |
| **PATCH** | `/api/question-banks/:id/submit` | Tutor | Submit question bank for admin review (validates 2–5 option constraints). |
| **PATCH** | `/api/question-banks/:id/review` | Admin | Review (Approve, Reject, Activate, or Draft) a question bank. |
| **POST** | `/api/question-banks/validate-import` | Admin, Tutor | Test-validate a bulk import payload for option rule compliance. |
| **POST** | `/api/question-banks/:id/import` | Admin, Tutor | Bulk import a list of questions into a specific bank inside a transaction block. |

---

### 3. Endpoint Specifications & Payloads

#### Get Question Banks

* **GET** `/api/question-banks`
* **Query Parameters:**
* `status` (string, optional): Filter by `DRAFT`, `PENDING_REVIEW`, `APPROVED`, `ACTIVE`, etc.
* `courseId` (string, optional): Filter by specific course ID.
* `search` (string, optional): Case-insensitive search on bank titles (`ILIKE`).
* `page` (number, optional): Page index (default: `1`).
* `limit` (number, optional): Items per page (default: `20`).



#### Create Question Bank

* **POST** `/api/question-banks`
* **Request Body:**

```json
{
  "title": "Calculus Midterm Assessment",
  "description": "Covers derivatives, limits, and chain rule integration.",
  "courseId": "CRS_MAT101",
  "subjects": ["SUB_DERIVATIVES", "SUB_LIMITS"],
  "durationMinutes": 45,
  "expiresAt": "2026-12-31T23:59:59Z",
  "startTime": "2026-10-01T08:00:00Z",
  "maxAttempts": 2
}

```

#### Get Single Question Bank (with Nested Questions)

* **GET** `/api/question-banks/:id`
* **Response Body Example:**

```json
{
  "success": true,
  "data": {
    "id": 3,
    "title": "Calculus Midterm Assessment",
    "description": "Covers derivatives, limits, and chain rule integration.",
    "status": "DRAFT",
    "duration_minutes": 45,
    "max_attempts": 2,
    "questions": [
      {
        "id": 12,
        "question_text": "What is the derivative of x^2?",
        "question_type": "MCQ",
        "marks": 5,
        "options": [
          { "id": 45, "text": "2x", "is_correct": true, "explanation": "Power rule applied." },
          { "id": 46, "text": "x", "is_correct": false, "explanation": null }
        ]
      }
    ]
  }
}

```

#### Submit for Review

* **PATCH** `/api/question-banks/:id/submit`
* **Behavior:** Triggers structural validation. Every child question must contain between **2 and 5 options** and at least one **correct answer**. If valid, status shifts from `DRAFT` to `PENDING_REVIEW`.

---

---

## Questions API Documentation

The Questions API handles individual question item creation, inline options management, filters, and status toggles.

### 1. Base URL & Authentication

* **Base Route:** `/api/questions`
* **Authentication:** Required (`Bearer Token`). Accessible by **Tutors** and **Admins**.

---

### 2. Endpoints Overview

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| **POST** | `/api/questions` | Admin, Tutor | Create a new question with options inside an atomic transaction block. |
| **GET** | `/api/questions` | Admin, Tutor | Retrieve paginated questions filtered by bank, subject, or course. |
| **GET** | `/api/questions/:id` | Admin, Tutor | Get a single question along with its options array. |
| **PUT** | `/api/questions/:id` | Admin, Tutor | Update question metadata and optionally replace its options array. |
| **DELETE** | `/api/questions/:id` | Admin, Tutor | Delete a question (options cascade delete automatically). |
| **PATCH** | `/api/questions/:id/status` | Admin, Tutor | Update question status (`ACTIVE`, `ARCHIVED`, `DRAFT`). |

---

### 3. Endpoint Specifications & Payloads

#### Create Question

* **POST** `/api/questions`
* **Validation Rules:**
* Must specify `questionBankId`, `subjectId`, and `questionText`.
* `options` array must contain **at least 2 choices**.
* At least one option must have `isCorrect: true` (or `is_correct: true`).


* **Request Body:**

```json
{
  "questionBankId": 3,
  "subjectId": "SUB_DERIVATIVES",
  "courseId": "CRS_MAT101",
  "questionText": "Evaluate the integral of 2x dx.",
  "questionType": "MCQ",
  "marks": 4,
  "options": [
    {
      "text": "x^2 + C",
      "isCorrect": true,
      "explanation": "Integration is the reverse of differentiation."
    },
    {
      "text": "2 + C",
      "isCorrect": false,
      "explanation": null
    },
    {
      "text": "2x^2 + C",
      "isCorrect": false,
      "explanation": null
    }
  ]
}

```

* **Response Body (201 Created):**

```json
{
  "success": true,
  "message": "Question created successfully",
  "data": {
    "id": 14,
    "question_bank_id": 3,
    "question_text": "Evaluate the integral of 2x dx.",
    "marks": 4,
    "options": [
      { "id": 50, "text": "x^2 + C", "is_correct": true, "explanation": "Integration is the reverse of differentiation." },
      { "id": 51, "text": "2 + C", "is_correct": false, "explanation": null },
      { "id": 52, "text": "2x^2 + C", "is_correct": false, "explanation": null }
    ]
  }
}

```

#### Get Questions (with Filtering)

* **GET** `/api/questions`
* **Query Parameters:**
* `question_bank_id` (number, optional): Filter questions belonging to a specific bank.
* `subject_id` (string, optional): Filter by subject code.
* `course_id` (string, optional): Filter by course code.
* `page` (number, optional): Page index (default: `1`).
* `limit` (number, optional): Page size (default: `20`).



#### Update Question & Options Replacement

* **PUT** `/api/questions/:id`
* **Behavior:** If the `options` array is provided in the update body, the backend automatically wipes existing option rows for this question inside a database transaction and inserts the newly provided options set.
* **Request Body:**

```json
{
  "questionText": "Evaluate the definite integral of 2x from 0 to 3.",
  "marks": 5,
  "options": [
    { "text": "9", "isCorrect": true, "explanation": "3^2 - 0^2 = 9" },
    { "text": "6", "isCorrect": false },
    { "text": "3", "isCorrect": false }
  ]
}

```