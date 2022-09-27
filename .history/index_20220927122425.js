const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
// var ObjectId = require('mongodb').ObjectID;
require('dotenv').config();
const port = process.env.PORT || 3001;

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//user: prodManagement1
//pass: jJg4x3Ns8wCk6HCN


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aruppvu.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// CRUD Operation
async function run() {
  try {
    const database = client.db("carServiceDB");
    const carsCollection = database.collection("cars");
    const servicesCollection = database.collection("services");

    //POST API
    app.post('/services', async(req, res) =>{
      //getting data from frontend
      const service = req.body;

      //checking axios post
      console.log('hit the post api', service);

      //sending data to database
      const result = await servicesCollection.insertOne(service);

      console.log('Added New Service', result);
      res.json(result);
    });

    //GET API (all)
    app.get('/services', async(req, res) =>{
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    })

    //GET API (single)
    app.get('/services/:id', async(req, res) =>{
      const id = req.params.id;
      console.log('getting specific service', id)
      const query = {_id: ObjectId(id)};
      const service = await servicesCollection.findOne(query);
      res.json(service);
    })

    //DELETE API (needs to debug)
    app.delete('/services/:id', async(req, res) =>{
      const id = (req.params.id);
      const ID = id.trim();
      console.log('getting specific delete service', id , typeof(id))
      console.log('getting specific delete service', ID , typeof(ID))
      // const query = { _id: ObjectId(id) };
      // const result = await servicesCollection.deleteOne(query);
      // res.json(result);
    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hellooooow World!');
}); 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});