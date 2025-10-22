const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'TaxPal API Documentation',
    version: '1.0.0',
    description: 'Complete API documentation for TaxPal - Tax Management System',
    contact: {
      name: 'TaxPal Support',
      email: 'support@taxpal.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server'
    },
    {
      url: 'https://api.taxpal.com',
      description: 'Production server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address'
          },
          name: {
            type: 'string',
            description: 'User full name'
          },
          password: {
            type: 'string',
            format: 'password',
            minLength: 8,
            description: 'User password (min 8 characters)'
          }
        }
      },
      TaxEstimate: {
        type: 'object',
        required: ['userEmail', 'income'],
        properties: {
          userEmail: {
            type: 'string',
            format: 'email'
          },
          income: {
            type: 'number',
            minimum: 0
          },
          businessExpenses: {
            type: 'number',
            minimum: 0
          },
          retirement: {
            type: 'number',
            minimum: 0
          },
          healthInsurance: {
            type: 'number',
            minimum: 0
          },
          homeOffice: {
            type: 'number',
            minimum: 0
          },
          status: {
            type: 'string',
            enum: ['Single', 'Married', 'Married Filing Jointly', 'Married Filing Separately', 'Head of Household']
          },
          quarter: {
            type: 'string',
            enum: ['Q1', 'Q2', 'Q3', 'Q4']
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string'
          },
          error: {
            type: 'string'
          }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: [
    './routes/*.js',
    './src/apis/*/*.js',
    './models/*.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
