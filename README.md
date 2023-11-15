# Pet Adoption Backend API

This repository contains the backend API for a pet adoption platform. The API allows users to log in, create new users, index pets from third-party APIs into the database, update pet statuses, and search for pets based on various parameters.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Routes](#api-routes)
  - [User Login](#user-login)
  - [Create User](#create-user)
  - [Index Pets into Database](#index-pets-into-database)
  - [Update Pet Status](#update-pet-status)
  - [Get Pets](#get-pets)
- [Dependencies](#dependencies)
- [License](#license)

## Getting Started

### Prerequisites

Make sure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/DouglasVolcato/pet-adoption-backend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd pet-adoption-backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Fulfill the .env variables

### Running the Application

Run the following command to start the application:

```bash
npm start
```

The API will be accessible at [http://localhost:3000](http://localhost:3000).

## Testing

To run tests, use the following command:

```bash
npm test
```

This will execute unit and integration tests.

## API Routes

### User Login

- **Endpoint:** `/login`
- **Method:** `POST`
- **Description:** User login
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Responses:**
  - `200`: Successful login
  - `400`: Bad request
  - `500`: Internal server error

### Create User

- **Endpoint:** `/user`
- **Method:** `POST`
- **Description:** Create user
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Responses:**
  - `200`: Successful creation
  - `400`: Bad request
  - `500`: Internal server error

### Index Pets into Database

- **Endpoint:** `/pet`
- **Method:** `POST`
- **Description:** Index pets into the database
- **Security:** Bearer Token
- **Responses:**
  - `200`: Successful request
  - `401`: Unauthorized
  - `500`: Internal server error

### Update Pet Status

- **Endpoint:** `/pet`
- **Method:** `PUT`
- **Description:** Update pet status
- **Security:** Bearer Token
- **Request Body:**
  ```json
  {
    "petId": "12345",
    "newStatus": "free"
  }
  ```
- **Responses:**
  - `200`: Successful update
  - `400`: Bad request
  - `401`: Unauthorized
  - `500`: Internal server error

### Get Pets

- **Endpoint:** `/pet`
- **Method:** `GET`
- **Description:** Get pets
- **Parameters:**
  - `limit` (number)
  - `offset` (number)
  - `term` (string)
  - `category` (string, "cats" or "dogs")
  - `status` (string, "free" or "adopted")
  - `createdAt` (string)
- **Responses:**
  - `200`: Successful request
  - `400`: Bad request
  - `500`: Internal server error

## Dependencies

- [axios](https://www.npmjs.com/package/axios)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [body-parser](https://www.npmjs.com/package/body-parser)
- [cors](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [email-validator](https://www.npmjs.com/package/email-validator)
- [express](https://www.npmjs.com/package/express)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)
- [uuid](https://www.npmjs.com/package/uuid)

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details.
