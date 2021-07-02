'use strict';
var app = require('express')();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const schema = require('./../schema/schema.js').def;
const model = mongoose.model('user', schema);
const config = require('./../../config.json');
const { response } = require('express');

function create(req,res) {
    model.find({ username: req.body.username}, function(err, docs) {
        if(docs.length){
            res.status(200).send({ message : "Username already Taken"});
        }else{
            if(req.body.password){
                req.body.hash = bcrypt.hashSync(req.body.password, 10);
            }
            console.log(req.body);
            model.create(req.body)
            .then(() => {
                res.status(200).send({ message : "User added"});
            })
            .catch((err) => {
                res.status(500).json({ message: err.message });
            })
        }
    })
   
}

async function authenticate(req,res) {
    const usernm = req.body.username;
    const psswd = req.body.password;
    const user = await model.findOne({"username": usernm })
    if(user && bcrypt.compareSync(psswd, user.hash)) {
        console.log("Authenticated");
        const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '10m' });
        const resp = {
            ...user.toJSON(),
            token
        };
        delete resp._id;
        delete resp.hash;
        delete resp.createdDate;
        delete resp.__v;
        delete resp.firstName;
        delete resp.lastName;
        delete resp.username;
        res.status(200).send(resp);
        
    } else {
        res.status(200).send({ message : "Invalid Username or Password"});
    }
    
   
}

function getall(req,res) {
    var Bearer = req.headers.authorization;
    var token = Bearer.substr(Bearer.indexOf(' ')+1);
    jwt.verify(token, config.secret, function(err, decoded){
        if(!err){
             model.find({}, function(err, docs) {
                if(docs.length){
                      docs.forEach(function (value) {
                        value.hash = undefined;
                        value._id = undefined;
                        value.createdDate = undefined;
                        value.__v = undefined;
                        value = JSON.parse(JSON.stringify(value));
                       
                    })

                    res.status(200).send(docs);
                }else{
                        res.status(200).send({ message : "No details found"});
                }
            })
        }
        else{
            res.status(200).send({ message : "Invalid Token"});
        }
    })
   
}

module.exports = {
    create: create,
    authenticate: authenticate,
    getall: getall
  };
  