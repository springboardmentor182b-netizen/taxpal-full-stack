const http = require('http');
const url = require('url');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: __dirname + '/../../.env' });

const PORT = process.env.CATEGORY_PORT || 5000; // Port for categories
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taxpal';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

let db;

async function connectDB() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db(); // Assuming default database
  console.log('Connected to MongoDB for categories');
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Auth middleware
  let user = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    user = verifyToken(token);
  }
  if (!user) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Unauthorized' }));
    return;
  }

  if (path.startsWith('/api/categories')) {
    const collection = db.collection('categories');

    if (method === 'GET' && path === '/api/categories') {
      try {
        const categories = await collection.find({ userId: new ObjectId(user._id) }).toArray();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(categories));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
      }
    } else if (method === 'POST' && path === '/api/categories') {
      try {
        const body = await parseBody(req);
        const category = { ...body, userId: new ObjectId(user._id) };
        const result = await collection.insertOne(category);
        category._id = result.insertedId;
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(category));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
      }
    } else if (method === 'PUT' && path.startsWith('/api/categories/')) {
      try {
        const id = path.split('/')[3];
        const body = await parseBody(req);
        const result = await collection.updateOne(
          { _id: new ObjectId(id), userId: new ObjectId(user._id) },
          { $set: body }
        );
        if (result.matchedCount === 0) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Not found' }));
        } else {
          const updated = await collection.findOne({ _id: new ObjectId(id) });
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(updated));
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
      }
    } else if (method === 'DELETE' && path.startsWith('/api/categories/')) {
      try {
        const id = path.split('/')[3];
        const result = await collection.deleteOne({ _id: new ObjectId(id), userId: new ObjectId(user._id) });
        if (result.deletedCount === 0) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Not found' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Deleted' }));
        }
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Not found' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not found' }));
  }
});

async function startServer() {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Categories server running on http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { startServer };
