import mongoose, { Document } from 'mongoose';
export interface ITransaction extends Document {
    user_id: mongoose.Types.ObjectId;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    date: Date;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ITransaction, {}, {}, {}, mongoose.Document<unknown, {}, ITransaction> & ITransaction & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Transaction.d.ts.map