'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { Journey } = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();


router.post('/create', jsonParser, (req, res) => {
    console.log(req.body.title, req.body.location, req.body.dates, req.body.description);
    const requiredFields = ['title', 'location', 'dates', 'description'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    Journey
        .create({
            title: req.body.title,
            location: req.body.location,
            dates: req.body.dates,
            description: req.body.description
        })
        .then(journey => res.status(201).json(journey.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        });

});

module.exports = router;