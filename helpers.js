// I've added just a general string helper functions that I think could come in handy. 
// Feel free to add any you need
import { ObjectId } from "mongodb";

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
    },

    checkStringLimited(strVal, varName) {
        if (!strVal) throw `Error: You must supply a ${varName || 'string'}.`;
        if (typeof strVal !== 'string') throw `Error: ${varName || 'input'} must be a string.`;
        strVal.trim();
        if (strVal.length === 0 || strVal.length > 30) throw `Error: ${varName || 'input'} must not be blank or more than 30 characters.`;
        if (!isNaN(strVal)) throw `Error: ${strVal || 'input'} must not be only numbers.`;
        return strVal;
    },

    checkEventMode(eventMode) {
        if (!eventMode) throw `You must provide a permission`;
        eventMode = eventMode.toLowerCase().trim();
        if (eventMode !== 'online' && eventMode !== 'person') throw `Event must be either online or in person.`;
        return eventMode;
    },

    checkPermission(perVal) {
        if (!perVal) throw `You must provide a permission`;
        perVal = perVal.toLowerCase().trim();
        if (perVal !== 'group' && perVal !== 'public') throw `Event must be either group or public`;
        return perVal;
    },

    checkStringFee(numVal, varName) {
        if (!numVal) throw `You must provide ${varName}`;
        if (typeof numVal !== 'string') throw   `${varName} must be a string`;
        numVal = numVal.trim(); 
        if (numVal.length === 0) throw `${varName} cannot be empty or all spaces`;
        return numVal;
    },

    // Status can be changed through editing
    checkStatus(pubStat, status, varName) {
        const eventStatus = {
            unpublished: ['planned', 'ready', 'suspended'],   // on save creation status will auto planned
            published: ['published', 'executed', 'closed']    // on publish creation status will auto published
        };

        if (pubStat === 'publish') {
            for (let i = 0; i < 3; i++) {
                if (status === eventStatus.published[i]) {
                    return status;
                }
            }
        }
        else {
            for (let i = 0; i < 3; i++) {
                if (status === eventStatus.unpublished[i]) {
                    return status;
                }
            }
        }
        return new Error('Status not found.');
    },

    checkPublishStatus(pubStat, varName) {
        if (!pubStat) throw `Error: You must supply a ${varName || 'string'}.`;
        if (typeof pubStat !== 'string') throw `Error: ${varName || 'input'} must be a string.`;
        pubStat.trim();
        if (pubStat.length === 0) throw `Error: ${varName || 'input'} must not be blank or all spaces.`;
        pubStat = pubStat.toLowerCase().trim(); 
        if (pubStat !== 'publish' && pubStat !== 'save') throw `${varName} must be either admin or user.`;

        return pubStat;
    }
}

export default helperFuncs;