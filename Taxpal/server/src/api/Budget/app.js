const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const budgetRoutes = require('./routes/budgetRoutes');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/budgets', budgetRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
