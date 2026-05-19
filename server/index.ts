import dotenv from 'dotenv';
import app from './app.js'; // NodeNext ESM requires explicit .js extension even for .ts files

// Load environment variables
dotenv.config();

const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});