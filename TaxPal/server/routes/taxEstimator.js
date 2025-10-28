const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

let TaxEstimate;
try {
  TaxEstimate = require('../src/apis/TaxEstimator/taxestimate.model');
} catch (e) {
  console.error('TaxEstimate model require failed:', e.message);
  TaxEstimate = null;
}

if (!TaxEstimate) {
  console.warn('TaxEstimate model not available; tax estimator routes will return 500 on save/fetch.');
}

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
    console.log('=== TAX CALCULATION REQUEST ===');
    console.log('Request body:', req.body);
    
    const { 
      income, 
      businessExpenses = 0, 
      retirement = 0, 
      healthInsurance = 0, 
      homeOffice = 0, 
      status = 'Single' 
    } = req.body;

    // Validate required fields
    if (income === undefined || income === null) {
      return res.status(400).json({ message: 'Income is required' });
    }

    // Convert string values to numbers
    const numIncome = parseFloat(income);
    const numBusinessExpenses = parseFloat(businessExpenses || 0);
    const numRetirement = parseFloat(retirement || 0);
    const numHealthInsurance = parseFloat(healthInsurance || 0);
    const numHomeOffice = parseFloat(homeOffice || 0);

    // Calculate total deductions
    const totalDeductions = 
      numBusinessExpenses + 
      numRetirement + 
      numHealthInsurance + 
      numHomeOffice;
    
    // Calculate taxable income
    const taxableIncome = Math.max(0, numIncome - totalDeductions);
    
    // Simple tax calculation based on filing status
    let taxRate = 0.15; // Default rate
    
    if (status === 'Single') {
      if (taxableIncome * 4 <= 11000) taxRate = 0.10;
      else if (taxableIncome * 4 <= 44725) taxRate = 0.12;
      else if (taxableIncome * 4 <= 95375) taxRate = 0.22;
      else taxRate = 0.24;
    } else if (status === 'Married') {
      if (taxableIncome * 4 <= 22000) taxRate = 0.10;
      else if (taxableIncome * 4 <= 89450) taxRate = 0.12;
      else if (taxableIncome * 4 <= 190750) taxRate = 0.22;
      else taxRate = 0.24;
    }
    
    // Calculate tax
    const estimatedTax = taxableIncome * taxRate;
    const effectiveTaxRate = numIncome > 0 ? (estimatedTax / numIncome) * 100 : 0;

    // Create tax breakdown
    const breakdown = {
      federalIncomeTax: estimatedTax * 0.7,
      selfEmploymentTax: estimatedTax * 0.3
    };

    console.log('✓ Tax calculation successful:', {
      taxableIncome,
      estimatedTax,
      effectiveTaxRate
    });

    res.json({
      taxableIncome,
      estimatedTax,
      effectiveTaxRate,
      breakdown
    });
  } catch (error) {
    console.error('✗ Error calculating tax:', error);
    res.status(500).json({ message: 'Server error while calculating tax' });
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
    if (!TaxEstimate) return res.status(500).json({ error: 'TaxEstimate model not configured on server' });

    const payload = req.body || {};
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
      effectiveRate,
      dueDate
    } = payload;

    if (!userId || !userEmail) {
      return res.status(400).json({ error: 'userId and userEmail are required' });
    }

    // Parse dueDate if present
    let parsedDue = null;
    if (dueDate) {
      const d = new Date(dueDate);
      if (!isNaN(d.getTime())) parsedDue = d;
    }

    const doc = new TaxEstimate({
      userId,
      userEmail,
      country,
      state,
      status,
      quarter,
      income: Number(income) || 0,
      businessExpenses: Number(businessExpenses) || 0,
      retirement: Number(retirement) || 0,
      healthInsurance: Number(healthInsurance) || 0,
      homeOffice: Number(homeOffice) || 0,
      taxableIncome: Number(taxableIncome) || 0,
      estimatedTax: Number(estimatedTax) || 0,
      effectiveRate: Number(effectiveRate) || 0,
      dueDate: parsedDue
    });

    const saved = await doc.save();
    return res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error('Error saving tax estimate:', error);
    return res.status(500).json({ error: 'Failed to save tax estimate' });
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
router.get('/user/:userId', async (req, res) => {
  try {
    if (!TaxEstimate) return res.status(500).json({ error: 'TaxEstimate model not configured on server' });

    const { userId } = req.params;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid or missing userId' });
    }

    const estimates = await TaxEstimate.find({ userId }).sort({ dueDate: 1, createdAt: 1 }).lean();
    return res.json(Array.isArray(estimates) ? estimates : []);
  } catch (error) {
    console.error('Error fetching tax estimates for user:', error);
    return res.status(500).json({ error: 'Failed to fetch tax estimates' });
  }
});

/**
 * @swagger
 * /api/tax-estimator/mark-paid:
 *   post:
 *     summary: Mark a tax estimate as paid
 *     tags: [Tax Estimator]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: Tax estimate marked as paid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 updated:
 *                   $ref: '#/components/schemas/TaxEstimate'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/mark-paid', async (req, res) => {
  try {
    if (!TaxEstimate) return res.status(500).json({ error: 'TaxEstimate model not configured on server' });

    const id = req.body?.id ?? req.body?._id;
    if (!id) return res.status(400).json({ error: 'Missing id' });
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });

    const deleted = await TaxEstimate.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Tax estimate not found' });

    return res.json({ success: true, deletedId: id });
  } catch (error) {
    console.error('Error deleting tax estimate:', error);
    return res.status(500).json({ error: 'Failed to delete tax estimate' });
  }
});

console.log('✓ Tax Estimator routes registered:');
console.log('  - POST /api/tax-estimator/calculate');
console.log('  - POST /api/tax-estimator/save');
console.log('  - GET  /api/tax-estimator/user/:userId');
console.log('  - POST /api/tax-estimator/mark-paid');

module.exports = router;