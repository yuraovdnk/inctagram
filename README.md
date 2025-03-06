# Inctagram Backend

![Inctagram Logo](https://your-inctagram-logo-url.com)

Welcome to the Inctagram backend repository! Inctagram is an innovative social media platform developed using cutting-edge technologies. Our goal is to provide users with a feature-rich and engaging experience while maintaining the highest standards of security and scalability.

## Project Overview

Inctagram is a microservices-based application built on a foundation of Node.js, NestJS, and TypeScript. We leverage RabbitMQ as our message broker for efficient communication between services. The backend serves as the heart of our platform, handling authentication, payment processing, image storage, and much more.

## Key Features

### 1. Authentication

Inctagram offers secure authentication mechanisms, including JWT and OAuth. User data is protected, and login options are flexible and user-friendly.

### 2. Payment Integration

We've seamlessly integrated popular payment gateways such as PayPal and Stripe, allowing users to perform transactions securely within the app.

### 3. Media Storage

All user-generated images are stored efficiently on AWS S3, ensuring a responsive and scalable experience, even as the platform grows.

### 4. Microservices Architecture

Our microservices architecture guarantees scalability, fault tolerance, and maintainability. Each service handles a specific aspect of the application's functionality.

### 5. Parallel Processing

To ensure responsiveness and optimal performance, we employ Piscina for parallel processing of tasks and computations.

### 6. Database Management

Inctagram relies on PostgreSQL as the primary relational database management system. PrismaORM streamlines database interactions, making development more efficient.

## Getting Started

To set up the Inctagram backend on your local machine, follow these steps:

1. Clone this repository to your local environment.

   ```bash
   git clone https://github.com/InctaRepo/inctagram-back.git
   ```

2. Navigate to the project directory.

   ```bash
   cd inctagram-back
   ```

3. Install project dependencies.

   ```bash
   npm install
   ```

4. Start the backend.

   ```bash
   npm start
   ```
