const joi = require('joi');

const csvSchema = joi.object({
    serial: joi.number().required(),
    name: joi.string().trim().required(),
    urls: joi.string().custom((value, helpers) => {
        const urls = value.split(',');
        for (const url of urls) {
            try {
                new URL(url); // Validate URL
            } catch (err) {
                return helpers.error('any.invalid');
            }
        }
        return value;
    }).required()
});

module.exports = csvSchema