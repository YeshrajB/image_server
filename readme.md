# Image Compression Project

This is a Node.js application that compresses images using the Sharp library.

## Usage

The application exposes two endpoints at `/upload` that accepts a POST request with a CSV file containing data including the image URLs to be compressed.

The second endpoint `/status` allows user to request the processing status of the request using the requestID.

The application will return the compressed image as a response.

## Installation

To install the application, run `npm install` from the root directory.

## Running the application

To run the application, run `node index.js` from the root directory.

The application will start listening on port 3000.
