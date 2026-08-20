## D Enskill Backend Integration Guide

Base URL: `[https://denskill-backend.onrender.com](https://denskill-backend.onrender.com)`

---

### 1. Student Enrollment & Payment Flow

The student onboarding process integrates registration metadata with Paystack checkout initialization, verification, and automated password setup.

#### A. Initialize Enrollment & Paystack Checkout

- **Endpoint:** `POST /api/enrollments/initialize`
- **Content-Type:** `application/json`
- **Payload Schema:**

```json
{
  "firstName": "string",
  "middleName": "string",
  "lastName": "string",
  "country": "string",
  "phone": "string",
  "email": "string",
  "course": "string",
  "reason": "string",
  "referredBy": "string",
  "amountPaid": 0,
  "callback_url": "string"
}
```

- **Example cURL:**

```bash
curl -X 'POST' \
  'https://denskill-backend.onrender.com/api/enrollments/initialize' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "firstName": "Hilosthone",
  "middleName": "Alabi",
  "lastName": "Sulyman",
  "country": "Nigeria",
  "phone": "09051772498",
  "email": "hilosthonesulyman@gmail.com",
  "course": "Mobile Development",
  "reason": "To master full-stack and mobile engineering",
  "referredBy": "GitHub",
  "amountPaid": 20000,
  "callback_url": "https://denskill.com/verify"
}'

```

#### B. Verify Paystack Transaction

- **Endpoint:** `GET /api/enrollments/verify/{reference}`
- **Description:** Call this endpoint upon redirect from Paystack to validate the transaction reference and finalize enrollment tracking.
- **Example cURL:**

```bash
curl -X 'GET' \
  'https://denskill-backend.onrender.com/api/enrollments/verify/o6jxn8b719' \
  -H 'accept: */*'

```

#### C. Set Initial Password Post-Payment

- **Endpoint:** `POST /api/enrollments/set-password`
- **Content-Type:** `application/json`
- **Payload Schema:**

```json
{
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}
```

- **Example cURL:**

```bash
curl -X 'POST' \
  'https://denskill-backend.onrender.com/api/enrollments/set-password' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "hilosthonesulyman@gmail.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}'

```

---

### 2. Authentication Flow

Manage standard user sessions, logins, and logouts.

#### A. Register New User

- **Endpoint:** `POST /api/auth/signup`
- **Payload Schema:** `{ "name": "string", "email": "string", "password": "string" }`

#### B. Log In User

- **Endpoint:** `POST /api/auth/signin`
- **Payload Schema:** `{ "email": "string", "password": "string" }`
- **Response:** Returns a JWT bearer token required for dashboard authorization headers.

#### C. Log Out User

- **Endpoint:** `POST /api/auth/logout`
- **Security:** `-H 'Authorization: Bearer <JWT_TOKEN>'`

---

### 3. Student Portal Dashboard

All dashboard endpoints require the Bearer Token acquired during sign-in.

#### A. Get Complete Overview (All Tabs)

- **Endpoint:** `GET /api/dashboard/overview`
- **Example cURL:**

```bash
curl -X 'GET' \
  'https://denskill-backend.onrender.com/api/dashboard/overview' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <JWT_TOKEN>'

```

#### B. Get Student Profile Details

- **Endpoint:** `GET /api/dashboard/profile`
- **Example cURL:**

```bash
curl -X 'GET' \
  'https://denskill-backend.onrender.com/api/dashboard/profile' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <JWT_TOKEN>'

```

#### C. Get Enrolled Courses & Assigned Tutors

- **Endpoint:** `GET /api/dashboard/courses`
- **Example cURL:**

```bash
curl -X 'GET' \
  'https://denskill-backend.onrender.com/api/dashboard/courses' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <JWT_TOKEN>'

```

#### D. Get Payment History

- **Endpoint:** `GET /api/dashboard/payments`
- **Example cURL:**

```bash
curl -X 'GET' \
  'https://denskill-backend.onrender.com/api/dashboard/payments' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <JWT_TOKEN>'

```

#### E. Get Portal Announcements

- **Endpoint:** `GET /api/dashboard/announcements`
- **Example cURL:**

```bash
curl -X 'GET' \
  'https://denskill-backend.onrender.com/api/dashboard/announcements' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <JWT_TOKEN>'

```
