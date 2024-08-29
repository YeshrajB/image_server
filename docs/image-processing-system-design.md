# Image Processing System Design Document

## 1. System Overview

```
This application is developed in NODE.JS using the MongoDB database
```

## 2. System Components

### 2.1 API Server
- **Role**: Entry point for client requests
- **Function**: Handles CSV file uploads, generates request IDs, and provides status updates

### 2.2 CSV Validator
- **Role**: Ensures data integrity
- **Function**: Validates the structure and content of uploaded CSV files

### 2.3 Database
- **Role**: Persistent data storage
- **Function**: Stores product information, processing requests, and job statuses

### 2.5 Asynchronous Workers
- **Role**: Background task processors
- **Function**: Handles image compression and updates job statuses

### 2.6 Image Processor
- **Role**: Image manipulation
- **Function**: Compresses images to 50% of their original quality

### 2.7 File Storage
- **Role**: Processed image storage
- **Function**: Stores compressed images and provides access URLs

## 3. System Workflow

1. Client uploads a CSV file to the API Server.
2. API Server validates the CSV using the CSV Validator.
3. If valid, API Server generates a unique request ID and stores it in the Database.
4. Asynchronous Workers are given the job to process.
5. Workers use the Image Processor to compress images.
6. Processed images are stored in the File Storage.
7. Workers update job status in the Database.
8. Clients can check processing status using the request ID via a separate API endpoint.


## 4. Asynchronous Workers Documentation

### 4.1 Image Processing Worker

**Function**: `processImages(requestId)`
1. Fetch the request data from the database including image URLs.
2. Update the status of the request.
3. Fetch the original image from the provided URL.
4. Use the Image Processor to compress the image to 50% quality.
5. Upload the compressed image to File Storage.
6. Update the product record in the database with the new image URL.
7. Update the request status in the database.

### 4.2 CSV Processing Worker

**Function**: `process_csv(request_id, csv_file)`

1. Read the CSV file.
2. For each row in the CSV:
   a. Create a data record in the database.
   b. Create a new request record in the database.
3. Trigger the processing of images.

## 5. Error Handling and Logging

- Implement comprehensive error handling for all components.
- Set up centralized logging for easy debugging and monitoring.
- Use structured logging format for better searchability.

## 6. Scalability Considerations

- Use a scalable message queue system (e.g., RabbitMQ, Apache Kafka) to handle high volumes of jobs.
- Implement horizontal scaling for API servers and workers.
- Use a content delivery network (CDN) for serving processed images.

## 7. Security Measures

- Implement authentication and authorization for API endpoints.
- Use HTTPS for all communications.
- Sanitize and validate all input data, especially CSV contents.
- Implement rate limiting to prevent abuse.

