'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { Journey } = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/:username', (req, res) => {
    console.log('hey');
    Journey
        .find({ loggedInUserName: req.param.username })
        .sort('created')
        .then(journeys => {
            // if (journey.loggedInUserName == req.params.user)
            res.json({
                journeys: journeys.map(journey => journey.serialize())
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Could not retrieve journeys" });
        });
});



router.post('/create', jsonParser, (req, res) => {
    // console.log(req.body.title, req.body.location, req.body.dates, req.body.description);
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

router.put('/:id', function(req, res) {
    console.log(req.body.title);
    // if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    //     const message = (
    //         `Request path id (${req.params.id}) and request body id ` +
    //         `(${req.body.id}) must match`);
    //     console.error(message);
    //     return res.status(400).json({ message: message });
    // }

    const toUpdate = {};
    // const updateableFields = ['title', 'location', 'dates', 'description'];
    const updateableFields = ['title', 'location'];
    updateableFields.forEach(function(field) {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });
    Journey
        .findByIdAndUpdate(req.params.id, { $set: toUpdate })
        .then(journey => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.delete('/:id', (req, res) => {
    Journey
        .findByIdAndRemove(req.params.id)
        .then(journey => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});




module.exports = router;