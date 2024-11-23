const express = require('express');
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile= require('./controllers/profile');
const image = require('./controllers/image');
const db = knex({
    client: 'pg',
    connection:{
        host : '127.0.0.1',
        user : 'omar',
        password: '',
        database: 'facedetection'
    }
});



const app = express();


app.use(bodyparser.json());
app.use(cors());

app.get('/' , (req ,res) => {
   
    res.send(database.users);
    
})

app.post('/clarifai' , (req,res)=> {
    const IMAGE_URL = req.body.input;
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": 'clarifai',
            "app_id": 'main'
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key 8a883956cb934517808a7246eef518cb', 
            'Content-Type': 'application/json',
        },
        body: raw
    };

    fetch(`https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs`, requestOptions)
        .then(response => response.json())
        .then(result => res.json(result))  // Send the result back to the frontend
        .catch(error => res.status(400).json('Unable to work with Clarifai API'));

})

app.post('/signin' , (req,res) => {signin.handleSignin(req,res,db,bcrypt)})

app.post('/register' ,(req,res) => {register.handleRegister(req,res,db,bcrypt)})

app.get('/profile/:id' , (req,res) => {profile.handlePofile(req,res,db)})

app.put('/image' , (req,res)=> {image.handleImage(req,res,db)})

app.listen(3000, () => {
    console.log('app is running');
})

