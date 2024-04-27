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


    const count = await categoryCollection.countDocuments();
    if (count === 0) {
      const subCategories=[
        {
          "image": "https://i.ibb.co/GFXSvrh/images-q-tbn-ANd9-Gc-TI-JLGx-IH-y-TPGL71-N6tb-BVz-Zx-Gh5-E580-V8a9-Gd-JXw-s.jpg",
          "Subcategory_Name": "Landscape Painting",
          "info": "Paintings specific to Landscape Painting"
        },
        {
          "image": "https://i.ibb.co/BNnbfYV/images-q-tbn-ANd9-Gc-RM6y-Lzh-IEbrmp9g-NW3-Ertec-Aemm7-W4nm-Wik-ERhqb-Rhb-A-s.jpg",
          "Subcategory_Name": "Portrait Drawing",
          "info": "Information specific to Portrait Drawing"
        },
        {
          "image": "https://i.ibb.co/Sf2hRph/images-q-tbn-ANd9-Gc-TXW3-Ah-MBBT5jj-PA4i5k2-Wvgqn1-BS6-Ft-SUOA51-EDw5-VKA-s.jpg",
          "Subcategory_Name": "Watercolour Painting",
          "info": "Paintings specific to Watercolour Painting"
        },
        {
          "image": "https://i.ibb.co/Q9fCCSD/images-q-tbn-ANd9-Gc-SKg-Jfj5lyvh-L-Gqeuhp-UNQ54-Dd-TOn-Z7-Amc-Od7-XP-Srw-s.jpg",
          "Subcategory_Name": "Oil Painting",
          "info": "Paintings specific to Oil Painting"
        },
        {
          "image": "https://i.ibb.co/wrX22Yk/maxresdefault.jpg",
          "Subcategory_Name": "Charcoal Sketching",
          "info": "Sketching specific to Charcoal Sketching"
        },
        {
          "image": "https://i.ibb.co/42z1JFz/images-q-tbn-ANd9-Gc-RSWn1yd-X4i0-U6-BLu-Fi2-sy-K6-J2-B5-MWAWo2-Ud7hy-Az4-YQ-s.jpg",
          "Subcategory_Name": "Cartoon Drawing",
          "info": "Drawing specific to Cartoon Drawing"
        }
      ]
      const result = await categoryCollection.insertMany(subCategories);
      console.log(`${result.insertedCount} documents inserted into categoryCollection`);
    } else {
      console.log("subCategories collection is not empty. Skipping insertion.");
    }

   
    
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
  