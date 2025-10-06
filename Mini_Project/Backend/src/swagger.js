const swaggerJSDoc = require('swagger-jsdoc');


const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Auth Backend API',
            version: '1.0.0',
            description: 'Authentication API with JWT and MongoDB',
        },
        servers: [
            {
                url: 'http://localhost:' + (process.env.PORT || 5000),
            },
        ],
    },
    // Paths to files containing OpenAPI definitions (JSDoc comments)
    apis: ['./src/routes/*.js', './src/controllers/*.js'],
};


const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;