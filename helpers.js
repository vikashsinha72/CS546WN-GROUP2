// I've added just a general string helper functions that I think could come in handy. 
// Feel free to add any you need

import { ObjectId } from "mongodb";

//import mailer from nodemailer;

const helperFuncs = {

    // Check if userID is valid
    checkUserId(userId) {
        if (!userId) throw new Error("Must provide an ID.");
        if (typeof userId !== 'string') throw new Error("ID must be a string.");
        userId = userId.trim();
        if (!userId) throw new Error("ID cannot be empty.");
        if (!ObjectId.isValid(userId)) throw new Error("Invalid Object ID.");
        return userId;
    },

    checkEventId(eventId) {
        if (!eventId) throw `Must supply an ID.`;
        if (typeof eventId !== 'string') throw `Event ID must be a string`;
        eventId = eventId.trim();
        if (eventId.length === 0) throw `Event ID must have contents.`;
        if (!ObjectId.isValid(eventId)) throw `${eventId} is not a valid ID`;
        return eventId;
    },

    // Check string input and return a trimmed version 
    checkString(strVal, varName) {
        if (!strVal) throw `Error: You must supply a ${varName || 'string'}.`;
        if (typeof strVal !== 'string') throw `Error: ${varName || 'input'} must be a string.`;
        strVal.trim();
        if (strVal.length === 0) throw `Error: ${varName || 'input'} must not be blank or all spaces.`;
        if (!isNaN(strVal)) throw `Error: ${strVal || 'input'} must not be only numbers.`;
        return strVal;
    }

    
}

export default helperFuncs;