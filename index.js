const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 4000
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9yfqt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`; 

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
      await client.connect();
      const database = client.db('WaterPark');
      const bookingCollection = database.collection('bookings'); 
      const packageCollection  = database.collection('packages')
        
    //   get request 
    
    app.get('/packages', async(req, res)=>{
        const cursor = packageCollection.find({})
        const result = await cursor.toArray();
        res.json(result)  
    })
    app.get('/bookings', async(req, res)=>{
        const email = req.query.email;
        let query = {};
        if(email){
          query={email:email}
        } 
        const cursor = bookingCollection.find(query)
        const result = await cursor.toArray();
        res.json(result)  
    })
     
    app.get('/packages/:id', async(req, res)=>{
          const id = req.params.id;
        //   console.log(req.params)
          const query = {_id:ObjectId(id)};
          const result = await packageCollection.findOne(query)
          res.send(result) 
        //   console.log(result) 
    })
    // post request 

    app.post('/bookings',async(req, res)=>{
        const booking = req.body; 
        const result = await bookingCollection.insertOne(booking)
        res.json(result) 
    })
    app.post('/packages', async(req, res)=>{ 
      const newPackage = req.body;
      const result = await packageCollection.insertOne(newPackage);
      res.json(result)
    })

    // delete operation 

    app.delete('/bookings/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
        const result = await bookingCollection.deleteOne(query)
        res.json(result)
        console.log(result)
    })


    } finally { 
    //   await client.close();
    }
  }
  run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`  listening on port ${port}`)
})