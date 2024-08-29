# API Documentation

## 1. Upload CSV

This endpoint allows clients to upload a CSV file containing product information and image URLs for processing.

- **Endpoint**: `/api/upload`
- **Method**: POST
- **Content-Type**: `multipart/form-data`

### Request Body

| Field    | Type | Description                  |
|----------|------|------------------------------|
| file | File | The CSV file to be processed |

### Response

- **Status Code**: 200 OK
- **Content-Type**: `application/json`

```json
{
  "request_id": "507f1f77bcf86cd799439011",
}
```

### Error Responses

- **Status Code**: 400 Bad Request
  - If the CSV file is missing or invalid

```json
{
  "error": "Invalid or missing CSV file"
}
```

- **Status Code**: 500 Internal Server Error
  - If there's a server-side error during processing

```json
{
  "error": "An unexpected error occurred while processing the CSV file"
}
```

## 2. Check Processing Status

This endpoint allows clients to check the status of a previously submitted CSV processing request.

- **Endpoint**: `/api/status/{request_id}`
- **Method**: GET

### Path Parameters

| Parameter  | Type   | Description                                    |
|------------|--------|------------------------------------------------|
| request_id | String | The unique identifier returned by the upload API |

### Response

- **Status Code**: 200 OK
- **Content-Type**: `application/json`

```json
{
  "request_id": "507f1f77bcf86cd799439011",
  "status": "processing",
  "data": "data"
}
```

### Possible Status Values

- `pending`: The request is queued but processing has not yet begun
- `processing`: The CSV file is currently being processed
- `completed`: All items in the CSV have been processed
- `failed`: The processing has failed due to an error

### Error Responses

- **Status Code**: 404 Not Found
  - If the provided request_id is not found

```json
{
  "error": "Request ID not found"
}
```

- **Status Code**: 500 Internal Server Error
  - If there's a server-side error while retrieving the status

```json
{
  "error": "An unexpected error occurred while retrieving the status"
}
```

## 3. API Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "error": "Description of the error"
}
```

The HTTP status code will indicate the type of error:

- 400 series: Client errors (e.g., bad request, unauthorized)
- 500 series: Server errors

## 4. Rate Limiting

Currently, no type of rate limiting is in use.
To prevent abuse, the recommended rate limiting options are:

- Upload CSV: 5 requests per minute per IP
- Check Status: 60 requests per minute per IP


## 5. Authentication

Currently, the API does not require authentication. However, it's recommended to implement an authentication mechanism (e.g., API keys or OAuth).

