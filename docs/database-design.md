# MongoDB Database Design for Image Processing System

## 1. Overview

This document details the MongoDB database design for our image processing system. We use MongoDB, a NoSQL document-based database, to store and manage data related to products, processing requests, and individual processing requests.

## 2. Collections

Our database consists of two main collections:

1. Requests
2. RequestData


### 2.1 Requests Collection

This collection stores information about each request and its current status.

```json
{
  "_id": ObjectId,
  "requestId": String,
  "status": String,  // "pending", "processing", "completed", "failed"
}
```

- `requestId`: Unique identifier for the processing request
- `status`: Current status of the request ("pending", "processing", "completed", or "failed")

### 2.2 RequestData Collection

```json
{
  "_id": ObjectId,
  "requestId": String,
  "serialNumber": Number,
  "productName": String,
  "inputImageUrls": Array of String,
  "outputImageUrls": Array of String,
  "createdAt": Date,
  "completedAt": Date
}
```

- `requestId`: Reference to the associated ProcessingRequest
- `serialNumber`, `productName`, `inputImageUrls`: data extracted from CSV file
- `outputImageUrls`: The list of urls after compressing and storing them.
- `createdAt`: Timestamp of when the request was created
- `completedAt`: Timestamp of when the request was completed



## 3. Indexes

There are no indexes used.


## 4. Data Flow

1. When a CSV is uploaded, a new document is created in the Requests collection.
2. For each row in the CSV, a new document is created in the RequestData collection.
3. As images are processed, the RequestData documents are updated with their outputURLs.
4. The Requests document is updated to reflect the overall progress.


## 6. Scaling Considerations

1. As the data grows, consider sharding the collections based on appropriate shard keys (e.g., requestId for ProcessingJobs).
2. Use MongoDB's aggregation framework for complex queries and reports.
3. Implement appropriate indexing strategies as query patterns evolve.
4. Consider using MongoDB Atlas for managed scaling and backups.
