const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const Expense = require('../models/Expense');

console.log('✓ Reports routes file loaded');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Reports API is working!' });
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

// Add preview endpoint
router.post('/preview-report', async (req, res) => {
  try {
    const { reportType, data, year } = req.body;
    const userEmail = data?.userEmail || req.body.userEmail;
    
    console.log('Generating preview for:', { reportType, year, userEmail });
    
    let reports = data?.reports || [];
    let yearSummary = data?.yearSummary || {};
    
    if (userEmail) {
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
      
      incomes.forEach(income => {
        const month = new Date(income.date).getMonth();
        monthlyData[months[month]].income += income.amount || 0;
        monthlyData[months[month]].transactions += 1;
      });
      
      expenses.forEach(expense => {
        const month = new Date(expense.date).getMonth();
        monthlyData[months[month]].expenses += expense.amount || 0;
        monthlyData[months[month]].transactions += 1;
      });
      
      Object.values(monthlyData).forEach(month => {
        month.netIncome = month.income - month.expenses;
      });
      
      reports = Object.values(monthlyData);
      
      yearSummary = {
        totalIncome: reports.reduce((sum, r) => sum + r.income, 0),
        totalExpenses: reports.reduce((sum, r) => sum + r.expenses, 0),
        netSavings: 0
      };
      yearSummary.netSavings = yearSummary.totalIncome - yearSummary.totalExpenses;
    }
    
    res.json({
      success: true,
      data: {
        reports,
        yearSummary,
        year,
        reportType,
        csvPreview: generateCSV(reports, reportType),
        htmlPreview: generatePDFHTML({ reports, year, yearSummary }, reportType)
      }
    });
    
  } catch (error) {
    console.error('Preview generation error:', error);
    res.status(500).json({ error: 'Error generating preview', details: error.message });
  }
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
    
    let reports = data?.reports || [];
    let yearSummary = data?.yearSummary || {};
    
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
      
      incomes.forEach(income => {
        const month = new Date(income.date).getMonth();
        monthlyData[months[month]].income += income.amount || 0;
        monthlyData[months[month]].transactions += 1;
      });
      
      expenses.forEach(expense => {
        const month = new Date(expense.date).getMonth();
        monthlyData[months[month]].expenses += expense.amount || 0;
        monthlyData[months[month]].transactions += 1;
      });
      
      Object.values(monthlyData).forEach(month => {
        month.netIncome = month.income - month.expenses;
      });
      
      reports = Object.values(monthlyData);
      
      yearSummary = {
        totalIncome: reports.reduce((sum, r) => sum + r.income, 0),
        totalExpenses: reports.reduce((sum, r) => sum + r.expenses, 0),
        netSavings: 0
      };
      yearSummary.netSavings = yearSummary.totalIncome - yearSummary.totalExpenses;
    }
    
    // Set proper headers for different formats
    switch (format) {
      case 'csv':
        const csvContent = generateCSV(reports, reportType);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${reportType || 'financial'}-report-${year}.csv"`);
        res.send('\ufeff' + csvContent); // Add BOM for proper UTF-8 encoding
        break;
        
      case 'excel':
        const excelContent = generateExcel({ reports, year, yearSummary }, reportType);
        res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${reportType || 'financial'}-report-${year}.xls"`);
        res.send(excelContent);
        break;
        
      case 'pdf':
        // Generate proper HTML for PDF (or use a PDF library)
        const htmlContent = generatePDFHTML({ reports, year, yearSummary }, reportType);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Disposition', `inline; filename="${reportType || 'financial'}-report-${year}.html"`);
        res.send(htmlContent);
        break;
        
      default:
        res.status(400).json({ error: 'Invalid format specified. Use: pdf, csv, or excel' });
    }
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ error: 'Error generating report', details: error.message });
  }
});

function generateCSV(reports, reportType) {
  if (!reports || !Array.isArray(reports)) {
    return 'Period,Income,Expenses,Net Income,Transactions\n';
  }
  
  if (reportType === 'income_statement') {
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
  
  const title = reportType === 'income_statement' ? 'Income Statement' : 
                reportType === 'expense_report' ? 'Expense Report' : 
                'Financial Report';
  
  if (reportType === 'income_statement') {
    return `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; margin: 0; }
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
          body { font-family: Arial, sans-serif; padding: 20px; margin: 0; }
          h1 { text-align: center; margin-bottom: 30px; color: #1f2937; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9fafb; }
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
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>No Data Available</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 40px; 
              margin: 0; 
              text-align: center; 
              background: #f8f9fa;
            }
            h1 { color: #dc3545; margin-bottom: 20px; }
            p { color: #6c757d; font-size: 16px; }
          </style>
        </head>
        <body>
          <h1>No Data Available</h1>
          <p>No financial data found for the selected period.</p>
        </body>
      </html>
    `;
  }
  
  const title = reportType === 'income_statement' ? 'Income Statement' : 
                reportType === 'expense_report' ? 'Expense Report' : 
                'Financial Report';
  
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} ${year}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #2c3e50;
            background: #ffffff;
            padding: 40px 20px;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          
          .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 300;
          }
          
          .header p {
            font-size: 1.1rem;
            opacity: 0.9;
          }
          
          .content {
            padding: 30px;
          }
          
          .summary-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #667eea;
          }
          
          .summary-title {
            font-size: 1.3rem;
            color: #2c3e50;
            margin-bottom: 15px;
            font-weight: 600;
          }
          
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
          }
          
          .summary-item {
            text-align: center;
            padding: 15px;
            background: white;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .summary-label {
            font-size: 0.9rem;
            color: #7f8c8d;
            margin-bottom: 5px;
          }
          
          .summary-value {
            font-size: 1.4rem;
            font-weight: bold;
            color: #2c3e50;
          }
          
          .summary-value.positive {
            color: #27ae60;
          }
          
          .summary-value.negative {
            color: #e74c3c;
          }
          
          .report-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          
          .report-table th { 
            background: #34495e;
            color: white;
            padding: 15px 12px;
            text-align: left;
            font-weight: 600;
            font-size: 0.95rem;
          }
          
          .report-table td { 
            padding: 12px;
            border-bottom: 1px solid #ecf0f1;
          }
          
          .report-table tr:nth-child(even) {
            background: #f8f9fa;
          }
          
          .report-table tr:hover {
            background: #e8f4fd;
          }
          
          .amount {
            font-weight: 600;
            text-align: right;
          }
          
          .amount.positive {
            color: #27ae60;
          }
          
          .amount.negative {
            color: #e74c3c;
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #ecf0f1;
            text-align: center;
            color: #7f8c8d;
            font-size: 0.9rem;
          }
          
          .total-row {
            background: #3498db !important;
            color: white;
            font-weight: bold;
          }
          
          .total-row td {
            border-bottom: none;
            padding: 15px 12px;
          }
          
          @media print {
            body { margin: 0; padding: 20px; }
            .container { box-shadow: none; }
            .header { background: #667eea !important; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${title}</h1>
            <p>Year ${year} • Generated on ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric'
            })}</p>
          </div>
          
          <div class="content">
            ${yearSummary ? `
              <div class="summary-section">
                <h2 class="summary-title">Financial Summary</h2>
                <div class="summary-grid">
                  <div class="summary-item">
                    <div class="summary-label">Total Income</div>
                    <div class="summary-value positive">$${yearSummary.totalIncome?.toFixed(2) || '0.00'}</div>
                  </div>
                  <div class="summary-item">
                    <div class="summary-label">Total Expenses</div>
                    <div class="summary-value negative">$${yearSummary.totalExpenses?.toFixed(2) || '0.00'}</div>
                  </div>
                  <div class="summary-item">
                    <div class="summary-label">Net Savings</div>
                    <div class="summary-value ${(yearSummary.netSavings || 0) >= 0 ? 'positive' : 'negative'}">$${yearSummary.netSavings?.toFixed(2) || '0.00'}</div>
                  </div>
                </div>
              </div>
            ` : ''}
            
            <table class="report-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Income</th>
                  <th>Expenses</th>
                  <th>Net Income</th>
                  <th>Transactions</th>
                </tr>
              </thead>
              <tbody>
                ${reports.map(r => `
                  <tr>
                    <td><strong>${r.name}</strong></td>
                    <td class="amount positive">$${r.income.toFixed(2)}</td>
                    <td class="amount negative">$${r.expenses.toFixed(2)}</td>
                    <td class="amount ${r.netIncome >= 0 ? 'positive' : 'negative'}">$${r.netIncome.toFixed(2)}</td>
                    <td style="text-align: center;">${r.transactions}</td>
                  </tr>
                `).join('')}
                ${yearSummary ? `
                  <tr class="total-row">
                    <td><strong>TOTAL</strong></td>
                    <td class="amount">$${yearSummary.totalIncome?.toFixed(2) || '0.00'}</td>
                    <td class="amount">$${yearSummary.totalExpenses?.toFixed(2) || '0.00'}</td>
                    <td class="amount">$${yearSummary.netSavings?.toFixed(2) || '0.00'}</td>
                    <td style="text-align: center;">${reports.reduce((sum, r) => sum + (r.transactions || 0), 0)}</td>
                  </tr>
                ` : ''}
              </tbody>
            </table>
            
            <div class="footer">
              <p>This report was generated by TaxPal Financial Management System</p>
              <p>All amounts are in USD • Report generated automatically</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

console.log('✓ Reports routes registered:');
console.log('  - GET  /data/:userEmail/:year');
console.log('  - POST /preview-report');
console.log('  - GET  /test');
console.log('  - POST /generate-report');

module.exports = router;
