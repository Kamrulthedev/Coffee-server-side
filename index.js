const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USERS}:${process.env.DB_PASS}@cluster0.zgseyoe.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect to MongoDB when the server starts
client.connect()
  .then(() => {
    console.log('Connected to MongoDB');

    const coffeeCollection = client.db('coffeeDB').collection('coffee');

    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      
      try {
        const result = await coffeeCollection.insertOne(newCoffee);
        res.json(result);
      } catch (error) {
        console.error('Error inserting coffee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.get('', (req, res) => {
      res.send('Coffee making in the server');
    });

    app.listen(port, () => {
      console.log(`Coffee server is running on port ${port}`);
    });
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Handle clean shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully');
  await client.close();
  process.exit(0);
});
