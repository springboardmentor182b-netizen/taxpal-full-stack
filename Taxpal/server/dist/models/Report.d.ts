import mongoose, { Document } from 'mongoose';
export interface IReport extends Document {
    user_id: mongoose.Types.ObjectId;
    period: string;
    report_type: 'summary' | 'detailed' | 'tax';
    file_path?: string;
    data: any;
    generated_at: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IReport, {}, {}, {}, mongoose.Document<unknown, {}, IReport> & IReport & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Report.d.ts.map