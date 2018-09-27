"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

// this is our schema to represent a journey
const journeySchema = mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    // dates: { type: },
    description: 'string',
    created: { type: Date, default: Date.now },
    // photos: {type: 'image'}
});

journeySchema.methods.serialize = function() {
    return {
        id: this._id,
        title: this.title,
        location: this.location,
        dates: this.dates,
        description: this.description,

    }
}

const Journey = mongoose.model('Journey', journeySchema);

module.exports = { Journey };