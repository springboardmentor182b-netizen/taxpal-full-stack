import 'dotenv/config';
//import dotenv from 'dotenv';
import app from './app.js';  

//dotenv.config();
console.log("Current working directory:", process.cwd());
console.log("DATABASE_URL:", process.env.DATABASE_URL);

//const PORT = process.env.PORT || 5000;
const PORT=4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
