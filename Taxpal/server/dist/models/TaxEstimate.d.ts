import mongoose, { Document } from 'mongoose';
export interface ITaxEstimate extends Document {
    user_id: mongoose.Types.ObjectId;
    quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
    year: number;
    estimated_tax: number;
    income_total: number;
    deductions_total: number;
    tax_rate: number;
    status: 'pending' | 'paid' | 'overdue';
    due_date: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ITaxEstimate, {}, {}, {}, mongoose.Document<unknown, {}, ITaxEstimate> & ITaxEstimate & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=TaxEstimate.d.ts.map