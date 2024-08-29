const sharp = require('sharp');
const path = require('path');
const { default: axios } = require('axios');
const RequestInfo = require('../models/requestInfo');
const Request = require('../models/request');

async function downloadAndCompressImage(url, outputFilePath) {
    try {
        // Download the image as a stream
        const response = await axios({
            url,
            responseType: 'stream',
        });

        // Pipe the response stream into Sharp for compression
        await new Promise((resolve, reject) => {
            const transformStream = sharp()
                .jpeg({ quality: 50 }) // Compress the image with 50% quality
                .toFile(outputFilePath, (err, info) => {
                    if (err) reject(err);
                    else resolve(info);
                });

            response.data.pipe(transformStream);
        });

        console.log(`Image downloaded and saved to ${outputFilePath}`);
        //Return true to indicate success 
        return true;
    } catch (error) {
        console.error(`Failed to download image from ${url}:`, error.message);
        //Return false to indicate that download failed
        return false;
    }
}

// Helper function to generate a unique file name
const getImageId = (url) => {
    const fileName = `image-${Date.now()}-${Math.random().toString(12).substring(4)}.jpg`;
    return fileName;
}


const ImageProcessor = {
    processImages: async function(requestId) {
        const request = await Request.findOne({ requestId });
        if (!request) return;
        
        const data = await RequestInfo.find({ requestId });
        // Process images here
        try {
            request.status = 'processing';
            await request.save();
            
            for (const requestData of data) {
                const outputUrls = [];
                for (const url of requestData.inputImageUrls) {

                    const fileName = getImageId(url);

                    const outputFilePath = path.join('uploads', fileName);

                    const downloadSuccess = await downloadAndCompressImage(url, outputFilePath);
                    if(downloadSuccess) {
                        outputUrls.push(`http://localhost:3000/uploads/${fileName}`);
                    }
                }
        
                requestData.outputImageUrls = outputUrls;
                requestData.completedAt = new Date();
                requestData.save();
            }
            request.status = 'completed';
            await request.save();
            
        } catch (error) {
            console.error(error);
            request.status = 'failed';
            await request.save();
            return;
        }
        

        // Trigger webhook if needed
        // Send POST request to webhook URL with { requestId }
    }
};

module.exports = ImageProcessor;
