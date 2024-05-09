# AdventureHub REST API

AdventureHub is a RESTful API built using Node.js, TypeScript, Express, and MongoDB. It provides endpoints for managing tour packages, user authentication, reviews, and more. AdventureHub implements various features including image upload, email sending, authentication using JWT, role-based access control, error handling, security practices, and API documentation.

## Features

- **Express Application**: Implements the API using the Express framework in Node.js using typescript.
- **Repository Pattern**: Utilizes the repository pattern for data access and manipulation.
- **Singleton Pattern**: Uses the singleton pattern for managing certain resources.
- **Image Upload and Processing**: Uploads images to Cloudinary for storage and processing.
- **Email Sending**: Sends emails using Nodemailer, with Mailtrap for development and SendGrid for production. EJS templates are used for email content.
- **Authentication**: Implements JWT web token-based authentication.
- **Role-based Access Control**: Controls access to resources based on user roles.
- **Error Handling**: Handles operational and programming errors occurs in development and production, including those from Mongoose, validation, JWT token errors, and custom errors in a type-safe manner.
- **Security Practices**: Implements best security practices including maximum login attempts, prevention of parameter pollution, protection against SQL injection attacks, rate limiting, and data sanitization is applied where necessary.
- **Code Quality**: Adheres to best practices in writing clean, maintainable, and efficient code.
- **API Documentation**: Provides comprehensive API documentation using Postman.
- **Environment Management**: Manages different environment values for development and production.

## Setup and Configuration

1. **Clone Repository**: Clone the AdventureHub repository from [GitHub Repo URL].

2. **Install Dependencies**: Run `npm install` to install all required dependencies.

3. **Environment Configuration**: Create `.env` files for both development and production environments. Include necessary environment variables such as database connection string, Cloudinary credentials, SendGrid API key, JWT secret, etc.

4. **Database Setup**: Ensure MongoDB is installed and running. Configure the connection string in the `.env` file.

5. **Cloudinary Setup**: Sign up for a Cloudinary account and obtain API credentials. Configure these credentials in the `.env` file.

6. **SendGrid Setup**: Sign up for a SendGrid account and obtain an API key. Configure this key in the `.env` file.

7. **Run the Application**: Execute `npm start` to run the application in production mode. For development, use `npm run dev`.

## API Documentation

API documentation is available via Postman. Import the provided Postman collection and environment files to explore and test the endpoints.
[View API Documentation on Postman](https://documenter.getpostman.com/view/25499730/2sA3JM5fsE)
