const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const Expense = require('../models/Expense');

console.log('✓ Reports routes file loaded');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Reports API is working!' });
});

router.post('/generate-report', async (req, res) => {
  try {
    console.log('=== GENERATE REPORT REQUEST ===');
    console.log('Request body:', req.body);
    
    const { format, data, year, reportType } = req.body;
    const userEmail = data?.userEmail || req.body.userEmail;
    
    if (!format || !year) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['format', 'year']
      });
    }
    
    console.log('Generating report:', { format, year, reportType, userEmail });
    
    // Fetch actual data from MongoDB if userEmail is provided
    let reports = data?.reports || [];
    
    if (userEmail) {
      console.log('Fetching data from MongoDB for user:', userEmail);
      
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59);
      
      const incomes = await Income.find({
        userEmail: userEmail,
        date: { $gte: startDate, $lte: endDate }
      }).sort({ date: 1 });
      
      const expenses = await Expense.find({
        userEmail: userEmail,
        date: { $gte: startDate, $lte: endDate }
      }).sort({ date: 1 });
      
      console.log(`Found ${incomes.length} incomes and ${expenses.length} expenses`);
      
      // Group by month
      const monthlyData = {};
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];
      
      months.forEach((month) => {
        monthlyData[month] = {
          name: month,
          income: 0,
          expenses: 0,
          netIncome: 0,
          transactions: 0
        };
      });
      
      // Aggregate income
      incomes.forEach(income => {
        const month = new Date(income.date).getMonth();
        monthlyData[months[month]].income += income.amount || 0;
        monthlyData[months[month]].transactions += 1;
      });
      
      // Aggregate expenses
      expenses.forEach(expense => {
        const month = new Date(expense.date).getMonth();
        monthlyData[months[month]].expenses += expense.amount || 0;
        monthlyData[months[month]].transactions += 1;
      });
      
      // Calculate net income
      Object.values(monthlyData).forEach(month => {
        month.netIncome = month.income - month.expenses;
      });
      
      reports = Object.values(monthlyData);
      
      data.yearSummary = {
        totalIncome: reports.reduce((sum, r) => sum + r.income, 0),
        totalExpenses: reports.reduce((sum, r) => sum + r.expenses, 0),
        netSavings: 0
      };
      data.yearSummary.netSavings = data.yearSummary.totalIncome - data.yearSummary.totalExpenses;
    }
    
    switch (format) {
      case 'csv':
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${reportType || 'financial'}-report-${year}.csv`);
        res.send(generateCSV(reports, reportType));
        break;
        
      case 'excel':
        res.setHeader('Content-Type', 'application/vnd.ms-excel');
        res.setHeader('Content-Disposition', `attachment; filename=${reportType || 'financial'}-report-${year}.xls`);
        res.send(generateExcel({ reports, year, yearSummary: data?.yearSummary }, reportType));
        break;
        
      case 'pdf':
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Disposition', `attachment; filename=${reportType || 'financial'}-report-${year}.html`);
        res.send(generatePDFHTML({ reports, year, yearSummary: data?.yearSummary }, reportType));
        break;
        
      default:
        res.status(400).json({ error: 'Invalid format specified. Use: pdf, csv, or excel' });
    }
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ error: 'Error generating report', details: error.message });
  }
});

// Add GET endpoint to fetch report data
router.get('/data/:userEmail/:year', async (req, res) => {
  try {
    const { userEmail, year } = req.params;
    
    console.log('=== FETCH REPORT DATA REQUEST ===');
    console.log('User Email:', userEmail);
    console.log('Year:', year);
    
    if (!userEmail || !year) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        required: ['userEmail', 'year']
      });
    }
    
    const startDate = new Date(parseInt(year), 0, 1);
    const endDate = new Date(parseInt(year), 11, 31, 23, 59, 59);
    
    // Fetch income and expense data
    const incomes = await Income.find({
      userEmail: userEmail,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });
    
    const expenses = await Expense.find({
      userEmail: userEmail,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });
    
    console.log(`Found ${incomes.length} incomes and ${expenses.length} expenses`);
    
    // Group by month
    const monthlyData = {};
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    months.forEach((month) => {
      monthlyData[month] = {
        name: month,
        income: 0,
        expenses: 0,
        netIncome: 0,
        transactions: 0
      };
    });
    
    // Aggregate income
    incomes.forEach(income => {
      const month = new Date(income.date).getMonth();
      monthlyData[months[month]].income += income.amount || 0;
      monthlyData[months[month]].transactions += 1;
    });
    
    // Aggregate expenses
    expenses.forEach(expense => {
      const month = new Date(expense.date).getMonth();
      monthlyData[months[month]].expenses += expense.amount || 0;
      monthlyData[months[month]].transactions += 1;
    });
    
    // Calculate net income
    Object.values(monthlyData).forEach(month => {
      month.netIncome = month.income - month.expenses;
    });
    
    const reports = Object.values(monthlyData);
    
    // Calculate year summary
    const yearSummary = {
      totalIncome: reports.reduce((sum, r) => sum + r.income, 0),
      totalExpenses: reports.reduce((sum, r) => sum + r.expenses, 0),
      netSavings: 0
    };
    yearSummary.netSavings = yearSummary.totalIncome - yearSummary.totalExpenses;
    
    res.json({
      reports,
      yearSummary,
      year: parseInt(year)
    });
    
  } catch (error) {
    console.error('Error fetching report data:', error);
    res.status(500).json({ error: 'Error fetching report data', details: error.message });
  }
});

function generateCSV(reports, reportType) {
  if (!reports || !Array.isArray(reports)) {
    return 'Period,Income,Expenses,Net Income,Transactions\n';
  }
  
  if (reportType === 'income') {
    const headers = ['Period', 'Total Income', 'Net Income'];
    const rows = reports.map(r => [
      r.name || '',
      (r.income || 0).toFixed(2),
      (r.netIncome || 0).toFixed(2)
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
  
  const headers = ['Period', 'Income', 'Expenses', 'Net Income', 'Transactions'];
  const rows = reports.map(r => [
    r.name || '',
    (r.income || 0).toFixed(2),
    (r.expenses || 0).toFixed(2),
    (r.netIncome || 0).toFixed(2),
    r.transactions || 0
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function generateExcel(data, reportType) {
  const { reports, year, yearSummary } = data;
  
  if (!reports || !Array.isArray(reports)) {
    return '<html><body><h1>No data available</h1></body></html>';
  }
  
  const title = reportType === 'income' ? 'Income Statement' : 
                reportType === 'expense' ? 'Expense Report' : 
                'Financial Report';
  
  if (reportType === 'income') {
    return `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #2563eb; text-align: center; margin-bottom: 30px; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #3b82f6; color: white; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .total-row { background-color: #dbeafe !important; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>${title} ${year}</h1>
          <table>
            <tr>
              <th>Period</th>
              <th>Total Income</th>
              <th>Net Income</th>
            </tr>
            ${reports.map(r => `
              <tr>
                <td>${r.name}</td>
                <td>$${r.income.toFixed(2)}</td>
                <td>$${r.netIncome.toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td>TOTAL</td>
              <td>$${yearSummary?.totalIncome?.toFixed(2) || '0.00'}</td>
              <td>$${yearSummary?.netSavings?.toFixed(2) || '0.00'}</td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }
  
  return `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; margin-bottom: 30px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>${title} ${year}</h1>
        <table>
          <tr>
            <th>Period</th>
            <th>Income</th>
            <th>Expenses</th>
            <th>Net Income</th>
            <th>Transactions</th>
          </tr>
          ${reports.map(r => `
            <tr>
              <td>${r.name}</td>
              <td>$${r.income.toFixed(2)}</td>
              <td>$${r.expenses.toFixed(2)}</td>
              <td>$${r.netIncome.toFixed(2)}</td>
              <td>${r.transactions}</td>
            </tr>
          `).join('')}
        </table>
      </body>
    </html>
  `;
}

function generatePDFHTML(data, reportType) {
  const { reports, year, yearSummary } = data;
  
  if (!reports || !Array.isArray(reports)) {
    return '<html><body><h1>No data available</h1></body></html>';
  }
  
  const title = reportType === 'income' ? 'Income Statement' : 
                reportType === 'expense' ? 'Expense Report' : 
                'Financial Report';
  
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .report-table { width: 100%; border-collapse: collapse; }
          .report-table th, .report-table td { border: 1px solid #ddd; padding: 8px; }
          .report-table th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title} ${year}</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        <table class="report-table">
          <tr>
            <th>Period</th>
            <th>Income</th>
            <th>Expenses</th>
            <th>Net Income</th>
            <th>Transactions</th>
          </tr>
          ${reports.map(r => `
            <tr>
              <td>${r.name}</td>
              <td>$${r.income.toFixed(2)}</td>
              <td>$${r.expenses.toFixed(2)}</td>
              <td>$${r.netIncome.toFixed(2)}</td>
              <td>${r.transactions}</td>
            </tr>
          `).join('')}
        </table>
      </body>
    </html>
  `;
}

console.log('✓ Reports routes registered:');
console.log('  - GET  /data/:userEmail/:year');
console.log('  - GET  /test');
console.log('  - POST /generate-report');

module.exports = router;
