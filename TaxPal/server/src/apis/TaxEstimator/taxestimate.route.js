
const routes = [
  {
    path: '/api/tax-estimator/calculate',
    method: 'POST',
    description: 'Calculate tax estimate based on input data',
    controller: 'calculateTax'
  },
  {
    path: '/api/tax-estimator/save',
    method: 'POST',
    description: 'Save tax estimate for a user',
    controller: 'saveTaxEstimate'
  },
  {
    path: '/api/tax-estimator/user/:userId',
    method: 'GET',
    description: 'Get all tax estimates for a specific user',
    controller: 'getUserTaxEstimates'
  }
];

module.exports = routes;
