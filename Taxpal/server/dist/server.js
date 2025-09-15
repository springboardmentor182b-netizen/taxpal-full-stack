"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const transactions_1 = __importDefault(require("./routes/transactions"));
const budgets_1 = __importDefault(require("./routes/budgets"));
const tax_1 = __importDefault(require("./routes/tax"));
const reports_1 = __importDefault(require("./routes/reports"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Database connection
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taxpal')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/transactions', transactions_1.default);
app.use('/api/budgets', budgets_1.default);
app.use('/api/tax', tax_1.default);
app.use('/api/reports', reports_1.default);
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'TaxPal API is running' });
});
app.listen(PORT, () => {
    console.log(`TaxPal server running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map