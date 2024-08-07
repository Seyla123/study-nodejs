const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');

const uri = process.env.MB_DB_NAME.replace('<PASSWORD>', process.env.DB_PASSWORD);

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db('admin').command({ ping: 1 });
        console.log('Pinged your deployment. You successfully connected to MongoDB!');
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
// run().catch(console.dir);

async function main() {

    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB with Mongoose');
        // define schemas and models
    } catch (e) {
        console.error(e);
    }
}

main().catch(console.error);



//testTour.save();
async function modelAdd () {
    try {
        const testTour = new Tour({
            name: 'The Forest Hiker 8',
            price: 497
        });
        const result = await testTour.save();
        console.log('result : ', result);
    } catch (error) {
        console.log('error : ', error.message);
    }
};

//modelAdd();

module.exports = main;