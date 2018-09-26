"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

// this is our schema to represent a journey
const journeySchema = mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    // dates: { type: },
    description: 'string',
    created: { type: Date, default: Date.now }
});