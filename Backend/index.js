const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');

mongoose.connect("mongodb://localhost:27017/mykeeperapp",{
    useNewUrlParser: true,
    useUnifiedTopology: true

}, ()=>{
    console.log('Database is connected')
})

const app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));

const keeperSchema =  mongoose.Schema({
    title: String,
    description: String
})

const keeper = new mongoose.model("keeper", keeperSchema)



app.get('/api/getall', (req,res)=>{
    keeper.find({}, (err, keeperList) =>{
        if(err){
            console.log(err)

        } else{
            res.status(200).send(keeperList)
        }
    })
    
})

app.post('/api/addnew', (req,res)=>{
    const {title, description } = req.body
    const keeperObj = new keeper({
        title,
        description
    })

    keeperObj.save( err =>{
        if(err){
            console.log(err)
        }

        keeper.find({}, (err, keeperList) =>{
            if(err){
                console.log(err)

            } else{
                res.status(200).send(keeperList)
            }
        })
    })
    
})

app.post('/api/delete', (req,res)=>{
    const {id} = req.body
    keeper.deleteOne({_id: id }, ()=>{
        keeper.find({}, (err, keeperList)=>{
            if(err){
                console.log(err)
            } else{
                res.status(200).send(keeperList)
            }

        })
       
    })
    
})

app.listen(5000, () =>{
    console.log("server is running at 5000")
})
