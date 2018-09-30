"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;




// this is our schema to represent a journey
const journeySchema = mongoose.Schema({
    title: { type: String, required: false },
    location: { type: String, required: false },
    startDates: { type: String, required: false },
    endDates: { type: String, required: false },
    dates: { type: String, required: false },
    description: { type: String, required: false },
    created: { type: Date, default: Date.now },
    // photos: {type: 'image'},
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
        loggedInUserName: this.loggedInUserName
    }
}

const Journey = mongoose.model('Journey', journeySchema);

module.exports = { Journey };