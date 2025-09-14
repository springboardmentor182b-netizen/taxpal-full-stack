import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    country: string;
    income_bracket: 'low' | 'middle' | 'high';
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map