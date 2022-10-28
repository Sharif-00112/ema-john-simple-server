const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
// var ObjectId = require('mongodb').ObjectID;
require('dotenv').config();
const port = process.env.PORT || 3005;

const app = express();

//middleware
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
    await client.connect();
    // console.log('Database Connected');
    const database = client.db("ema_JohnDB");
    const productCollection = database.collection("products");

    //GET Products API
    app.get('/products', async(req, res) =>{
      // console.log(req.query);
      const cursor = productCollection.find({});
      // const products = await cursor.limit(10).toArray();

      const page = req.query.page;
      const size = parseInt(req.query.size);
      const count = await cursor.count();

      let products; 
      if(page){
        products = await cursor.skip(page * size).limit(size).toArray();
      }
      else{
        products = await cursor.toArray();
      }

      res.send({
        count,
        products
      });
    });

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hellooooow Amazon World!');
}); 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});