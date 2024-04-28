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
    const categoryCollection=client.db('artDB').collection('subCategories')


 
   
    
    app.get('/arts', async(req, res) => {
      const cursor= artCollection.find()
      const result=await cursor.toArray()
      res.send(result)
    })
    app.get('/subCategories', async(req, res) => {
      const cursor= categoryCollection.find()
      const result=await cursor.toArray()
      res.send(result)
    })
    app.get('/arts/:id', async(req, res) => {
      const id=req.params.id
      const query={_id: new ObjectId(id)}
      const result=await artCollection.findOne(query)
      res.send(result)
    })
    app.get('/category/:Subcategory_Name', async(req, res) => {
      console.log(req.params.Subcategory_Name)
      const result=await artCollection.find({Subcategory_Name: req.params.Subcategory_Name}).toArray();
      res.send(result)
    })

    app.get('/myarts/:email', async (req, res) => {
      try {
        const userEmail = req.params.email;
      
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

    app.put('/arts/:id', async(req, res) => {
      const id=req.params.id
      const filter={_id: new ObjectId(id)}
      const options={upsert:true}
      const updated=req.body
      const art={
          $set:{
            image:updated.image,
            item_name:updated.item_name,
            Subcategory_Name:updated.Subcategory_Name,
            short_description:updated.short_description,
            price:updated.price,
            rating:updated.rating,
            customization:updated.customization,
            processing_time:updated.processing_time,
            stockStatus:updated.stockStatus
            
          }
      }
      const result=await artCollection.updateOne(filter,art,options)
      res.send(result)
    })
    app.delete('/arts/:id', async(req, res) => {
      const id=req.params.id
      const query={_id: new ObjectId(id)}
      const result=await artCollection.deleteOne(query)
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
  