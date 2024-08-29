const express = require('express');
const multer = require('multer');
const uuid = require('uuid');
const csvParser = require('csv-parser');
const fs = require('fs');
const ImageProcessor = require('../controllers/imageProcessor');
const RequestInfo = require('../models/requestInfo');
const Request = require('../models/request');
const csvSchema = require('../models/csvInput');
const router = express.Router();
const upload = multer({ dest: 'file-uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
    const requestId = uuid.v4();
    
    if(!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const results = [];
    const errors = [];

    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on('data', (data) => {
        // Validate CSV data here
        const { error, value } = csvSchema.validate(data, { abortEarly: false });

        if (error) {
            errors.push({
                row: data,
                message: error.message
            });
        } else {
            results.push({
                serialNumber: value.serial,
                productName: value.name,
                imageUrls: value.urls.split(',')
            });
        }
      })
      .on('end', async () => {
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        
        for (const row of results) {
            const { serialNumber, productName, imageUrls } = row;
            const requestInfo = new RequestInfo({
                requestId,
                serialNumber: serialNumber,
                productName: productName,
                inputImageUrls: imageUrls
            });
            await requestInfo.save();
        }

        const newRequest = new Request({
            requestId: requestId,
        })
        await newRequest.save();

        // Trigger asynchronous processing
        ImageProcessor.processImages(requestId);
          
        res.json({ requestId });
      }).on('error', (error) => {
        console.error('Error parsing CSV:', error);
        res.status(500).json({ message: 'Error parsing CSV' });
      })
});

router.get('/status/:requestId', async (req, res) => {
    const request = await Request.findOne({ requestId: req.params.requestId });
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    if(request.status === 'completed') {
        const requestInfo = await RequestInfo.find({ requestId: req.params.requestId });
        // Process data here to return to the frontend
        let processedData = [];
        requestInfo.map((data) => {
            processedData.push({
                serialNumber: data.serialNumber,
                productName: data.productName,
                inputImageUrls: data.inputImageUrls,
                outputImageUrls: data.outputImageUrls,
            })
        })
        res.json({ id: request.requestId, status: request.status, data: processedData });
        return;
    }
    res.json({ id: req.params.requestId, status: request.status });
});


module.exports = router;
