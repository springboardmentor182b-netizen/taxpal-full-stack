import mongoose, { Document } from 'mongoose';
export interface IBudget extends Document {
    user_id: mongoose.Types.ObjectId;
    category: string;
    limit: number;
    month: string;
    spent?: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IBudget, {}, {}, {}, mongoose.Document<unknown, {}, IBudget> & IBudget & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Budget.d.ts.map