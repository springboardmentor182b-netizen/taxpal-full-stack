const express = require('express');
const router = express.Router();
const { calculateTax } = require('../src/apis/TaxEstimator/taxestimate.controller');

console.log('✓ Tax Estimator routes file loaded');

/**
 * @swagger
 * tags:
 *   name: Tax Estimator
 *   description: Tax calculation and estimation endpoints
 */

/**
 * @swagger
 * /api/tax-estimator/calculate:
 *   post:
 *     summary: Calculate estimated tax
 *     tags: [Tax Estimator]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - income
 *             properties:
 *               income:
 *                 type: number
 *                 minimum: 0
 *                 example: 50000
 *               businessExpenses:
 *                 type: number
 *                 minimum: 0
 *                 example: 5000
 *               retirement:
 *                 type: number
 *                 minimum: 0
 *                 example: 3000
 *               healthInsurance:
 *                 type: number
 *                 minimum: 0
 *                 example: 2000
 *               homeOffice:
 *                 type: number
 *                 minimum: 0
 *                 example: 1000
 *               status:
 *                 type: string
 *                 enum: [Single, Married, Married Filing Jointly, Married Filing Separately, Head of Household]
 *                 example: Single
 *     responses:
 *       200:
 *         description: Tax calculation successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 taxableIncome:
 *                   type: number
 *                 estimatedTax:
 *                   type: number
 *                 effectiveTaxRate:
 *                   type: number
 *                 breakdown:
 *                   type: object
 *                   properties:
 *                     federalIncomeTax:
 *                       type: number
 *                     selfEmploymentTax:
 *                       type: number
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/calculate', async (req, res) => {
  try {
    const { userEmail, annualIncome, taxDeductibleExpenses } = req.body;

    // Validate required fields
    if (!userEmail || typeof annualIncome !== 'number' || typeof taxDeductibleExpenses !== 'number') {
      return res.status(400).json({ 
        error: 'Missing or invalid required fields',
        details: {
          userEmail: !userEmail ? 'Required' : null,
          annualIncome: typeof annualIncome !== 'number' ? 'Must be a number' : null,
          taxDeductibleExpenses: typeof taxDeductibleExpenses !== 'number' ? 'Must be a number' : null
        }
      });
    }

    const result = await calculateTax(userEmail, annualIncome, taxDeductibleExpenses);
    res.json(result);
  } catch (error) {
    console.error('Tax calculation error:', error);
    res.status(500).json({ error: error.message || 'Error calculating tax' });
  }
});

/**
 * @swagger
 * /api/tax-estimator/save:
 *   post:
 *     summary: Save tax estimate to database
 *     tags: [Tax Estimator]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaxEstimate'
 *     responses:
 *       201:
 *         description: Tax estimate saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/TaxEstimate'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/save', async (req, res) => {
  try {
    console.log('=== SAVE TAX ESTIMATE REQUEST ===');
    console.log('Request body:', req.body);
    
    const {
      userId,
      userEmail,
      country,
      state,
      status,
      quarter,
      income,
      businessExpenses,
      retirement,
      healthInsurance,
      homeOffice,
      taxableIncome,
      estimatedTax,
      effectiveRate
    } = req.body;

    // Validate required fields
    if (!userEmail) {
      return res.status(400).json({ message: 'User email is required' });
    }
    
    if (!income || income <= 0) {
      return res.status(400).json({ message: 'Valid income is required' });
    }

    // Create new document
    const taxEstimate = new TaxEstimate({
      userId: userId || undefined,
      userEmail: userEmail.toLowerCase(),
      country: country || 'United States',
      state: state || '',
      status: status || 'Single',
      quarter: quarter || 'Q1',
      income: parseFloat(income),
      businessExpenses: parseFloat(businessExpenses || 0),
      retirement: parseFloat(retirement || 0),
      healthInsurance: parseFloat(healthInsurance || 0),
      homeOffice: parseFloat(homeOffice || 0),
      taxableIncome: parseFloat(taxableIncome || 0),
      estimatedTax: parseFloat(estimatedTax || 0),
      effectiveRate: parseFloat(effectiveRate || 0)
    });

    // Save to MongoDB
    const savedEstimate = await taxEstimate.save();
    
    console.log('✓ Tax estimate saved to MongoDB!');
    console.log('Document ID:', savedEstimate._id);
    console.log('Collection:', TaxEstimate.collection.name);
    
    res.status(201).json({ 
      success: true,
      message: 'Tax estimate saved successfully', 
      data: savedEstimate
    });
  } catch (error) {
    console.error('✗ Error saving tax estimate:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while saving tax estimate',
      error: error.message 
    });
  }
});

/**
 * @swagger
 * /api/tax-estimator/user/{email}:
 *   get:
 *     summary: Get all tax estimates for a user
 *     tags: [Tax Estimator]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: User email address
 *     responses:
 *       200:
 *         description: List of tax estimates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TaxEstimate'
 *       400:
 *         description: Invalid email
 *       500:
 *         description: Server error
 */

console.log('✓ Tax Estimator routes registered:');
console.log('  - POST /calculate');
console.log('  - POST /save');

module.exports = router;
