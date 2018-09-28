"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const subJourneySchema = mongoose.Schema({
    // subtitle: { type: String, required: true },
    sub_location: { type: String, required: true },
    // dates: { type: String, required: true },
    description: { type: String, required: true },
    created: { type: Date, default: Date.now },
    // photos: {type: 'image'},

});



// this is our schema to represent a journey
const journeySchema = mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    dates: { type: String, required: true },
    description: { type: String, required: true },
    created: { type: Date, default: Date.now },
    // photos: {type: 'image'},
    sub_journeys: [subJourneySchema],
    loggedInUserName: { type: String, required: true }
});

journeySchema.methods.serialize = function() {
    return {
        id: this._id,
        title: this.title,
        location: this.location,
        dates: this.dates,
        description: this.description,
        created: this.created,
        sub_journeys: this.sub_journeys
    }
}

const Journey = mongoose.model('Journey', journeySchema);

module.exports = { Journey };