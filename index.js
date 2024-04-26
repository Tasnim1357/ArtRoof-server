const express = require('express')
const cors=require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// middleware

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cxnpdhc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const artCollection=client.db('artDB').collection('arts')
    app.get('/arts', async(req, res) => {
      const cursor= artCollection.find()
      const result=await cursor.toArray()
      res.send(result)
    })
    app.get('/arts/:id', async(req, res) => {
      const id=req.params.id
      const query={_id: new ObjectId(id)}
      const result=await artCollection.findOne(query)
      res.send(result)
    })
    // app.get('/myarts/:email', async(req, res) => {
    //   console.log(req.params.email)
    //   const result=await artCollection.find({email: req.params.email}).toArray();
    //   res.send(result)
    // })

    app.get('/myarts/:email', async (req, res) => {
      try {
        const userEmail = req.params.email;
        // console.log(userEmail); // Ensure the email is correctly received
    
        // Assuming 'email' is the field in your document
        const result = await artCollection.find({ email: userEmail }).toArray();
    
        if (result.length > 0) {
          res.send(result);
        } else {
          res.status(404).send("No matching data found");
        }
      } catch (error) {
        console.error("Error finding data:", error);
        res.status(500).send("Internal server error");
      }
    });
    
    app.post('/arts', async(req, res) => {
      const newArts=req.body
      console.log(newArts)
      const result=await artCollection.insertOne(newArts)
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Assignment10 server is running')
  })

 
app.listen(port, () => {
    console.log(`Assignment10 server is runing on port ${port}`)
  })
  