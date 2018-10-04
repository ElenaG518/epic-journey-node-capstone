"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

// this is our schema to represent a journey
const journeySchema = mongoose.Schema({
    title: { type: String, required: false },
    location: { type: String, required: false },
    startDates: { type: String, required: false },
    endDates: { type: String, required: false },
    description: { type: String, required: false },
    created: { type: Date, default: Date.now, required: false },
    loggedInUserName: { type: String, required: true },
    // images: [journeyImageSchema]
});

const journeyImageSchema = mongoose.Schema({
    imgAddress: { type: String, required: true },
    journeyId: { type: String, required: true },
    username: { type: String, required: true }
});

journeyImageSchema.methods.serialize = function() {
    return {
        journeyId: this.journeyId,
        imgAddress: this.imgAddress
    }
}

journeySchema.virtual('dates').get(function() {
    return `${this.startDates} - ${this.endDates}`.trim();
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
const Image = mongoose.model('Image', journeyImageSchema);

module.exports = { Journey, Image };