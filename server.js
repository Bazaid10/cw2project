const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('public'));
app.set('port',3000)
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin',"*");
    res.header("Access-Control-Allow-Headers","*");
    next();
})

const MongoClient = require('mongodb').MongoClient;

let db;
MongoClient.connect('mongodb+srv://bazaidkhan:Quad2646@cluster0.iyo6o.mongodb.net', (err, client) => {
    db = client.db('Club')
})

app.get('/', (req, res, next) => {
    res.render('index.html');
    // res.send('Select a collection, e.g., /collection/message')
})

app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    return next()
})


app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})

app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
        if (e) return next(e)
        res.send(results.ops)
    })
})

const ObjectID = require('mongodb').ObjectID;
app.get('/collection/:collection/:id', (req, res, next) => {
    req.collection.findOne({_id: new ObjectID(req.params.id) }, (e, result) => {
        if (e) return next(e)
        res.send(result)
    })
})

app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.update(
        {_id: new ObjectID(req.params.id)},
        {$set: req.body},
        {safe: true, multi: false},
        (e, result) => {
            if (e) return next(e)
            res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
        })
})

const port = process.env.PORT || 3000;
app.listen(port,() => {console.log('express server is running at localhost:3000')
})