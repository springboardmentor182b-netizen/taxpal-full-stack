const mongoose = require('mongoose');

const TaxEstimateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    income: {
        salary: { type: Number, default: 0 },
        selfEmployment: { type: Number, default: 0 },
        investments: { type: Number, default: 0 },
        rental: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
    },
    deductions: {
        retirement: { type: Number, default: 0 },
        healthInsurance: { type: Number, default: 0 },
        mortgage: { type: Number, default: 0 },
        studentLoan: { type: Number, default: 0 },
        charitable: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
    },
    credits: {
        childTax: { type: Number, default: 0 },
        education: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
    },
    filingStatus: {
        type: String,
        enum: ['single', 'married_joint', 'married_separate', 'head_household'],
        required: true
    },
    dependents: {
        type: Number,
        default: 0
    },
    estimatedTax: {
        federalTax: { type: Number, default: 0 },
        stateTax: { type: Number, default: 0 },
        medicareTax: { type: Number, default: 0 },
        socialSecurityTax: { type: Number, default: 0 },
        selfEmploymentTax: { type: Number, default: 0 },
        totalTax: { type: Number, default: 0 }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate total income
TaxEstimateSchema.methods.calculateTotalIncome = function() {
    const income = this.income;
    return income.salary + income.selfEmployment + income.investments + 
                 income.rental + income.other;
};

// Calculate total deductions
TaxEstimateSchema.methods.calculateTotalDeductions = function() {
    const deductions = this.deductions;
    return deductions.retirement + deductions.healthInsurance + 
                 deductions.mortgage + deductions.studentLoan + 
                 deductions.charitable + deductions.other;
};

// Calculate total credits
TaxEstimateSchema.methods.calculateTotalCredits = function() {
    const credits = this.credits;
    return credits.childTax + credits.education + credits.other;
};

module.exports = mongoose.models.TaxEstimate || mongoose.model('TaxEstimate', TaxEstimateSchema);