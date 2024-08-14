import { users, events } from '../config/mongoCollections.js';
import { ObjectId, ReturnDocument } from 'mongodb';
import helperFuncs from '../helpers.js';
import axios from 'axios';

export const createEvent = async (
    userId, 
    username,
    eventName, 
    date, 
    location, 
    category,
    permission,     // Added this for groups or public
    description, 
    nearByPort, 
    eventMode, 
    registrationFee,
    publish,    // Added this for published/unpublished
) => {

    // Error handling
    // Check for valid userId 
    userId = helperFuncs.checkUserId(userId);

    // Check for valid strings
    username = helperFuncs.checkStringLimited(username, 'Create Event userName');
    eventName = helperFuncs.checkStringLimited(eventName, 'Create Event Name');
    location = helperFuncs.checkStringLimited(location, 'Create Event Location');
    category = helperFuncs.checkStringLimited(category, 'Create Event Category');
    description = helperFuncs.checkString(description, 'Create Event Description');
    nearByPort = helperFuncs.checkStringLimited(nearByPort, 'Create Event Port');
    registrationFee = helperFuncs.checkStringFee(registrationFee);
    
    // Special checks
    publish = helperFuncs.checkPublishStatus(publish);
    eventMode = helperFuncs.checkEventMode(eventMode);
    permission = helperFuncs.checkPermission(permission);
    
    // --- TODO check date ---

    //initialize empty reviews subdocument
    let reviews = [];
    let eventStatus = 'open'

    // making a string into ObjectId format
    const userObjId = new ObjectId(userId);

    //create new event object
    const newEvent = {
        _id: new ObjectId(),
        userId: userId,
        username: username, 
        eventName: eventName,
        date: date,
        category: category,
        permission: permission,
        description: description,
        location: location,
        nearByPort: nearByPort,
        eventMode: eventMode,
        registrationFee: registrationFee,
        publish: publish,
        eventStatus: eventStatus,
        reviews: reviews    // this is for event reviews
    }

    const userCollection = await users();
    const eventCollection = await events();
    // Push event to the user
    const insertEv = await eventCollection.insertOne(newEvent);
    if (!insertEv.acknowledged || !insertEv.insertedId) throw 'Could not add event';
    const updateUser = await userCollection.updateOne({_id: userObjId}, {$push: {events:{_id: newEvent._id, eventName: eventName}}});

    let newId = insertEv.insertedId.toString();
    return newId;
}

// Changes: Gets an event from id not a user
export const getEvent = async (eventId) => {
    // Error handling
    eventId = helperFuncs.checkEventId(eventId);
    
    // Get event
    const eventCollection = await events();
    const event = await eventCollection.findOne(
        { _id: new ObjectId(eventId)},
        {projection: {
            username: 1, 
            eventName: 1, 
            date: 1, 
            location: 1, 
            category: 1,
            permission: 1,     
            description: 1, 
            nearByPort: 1, 
            eventMode: 1, 
            registrationFee: 1
        }
    });
    
    if (!event) throw "Event could not be found.";
    return event;
}

export const getAllEvents = async (userId) => {
    const eventCollection = await events();
    let eventChecker = await eventCollection.findOne({userId: userId});

    if (!eventChecker) throw `Cannot find events for that user!`;


    // excluded openClose and publish from users
    let eventList = await eventCollection.find({}).project({
        username: 1, 
        eventName: 1, 
        date: 1, 
        location: 1, 
        category: 1,
        permission: 1,     
        description: 1, 
        nearByPort: 1, 
        eventMode: 1, 
        registrationFee: 1
    }).toArray();
    if (!eventList) throw new Error("Could not get all events.");
    
    eventList = eventList.map((element) => {
      element._id = element._id.toString();
      return element;
    })
  
    return eventList;
}

export const updateEventPatch = async (eventId, updatedEvent) => {
    const updatedEventData = {};

    if (updatedEvent.eventNameEdit) {
        updatedEventData['eventName'] = helperFuncs.checkStringLimited(updatedEvent.eventNameEdit, 'Edit Event Name');
    }
    if (updatedEvent.dateEdit) {
        // to do check dates
        updatedEventData['date'] = updatedEvent.dateEdit;
    }
    if (updatedEvent.locationEdit) {
        updatedEventData['location'] = helperFuncs.checkStringLimited(updatedEvent.locationEdit, 'Edit Event Location');
    }
    if (updatedEvent.categoryEdit) {
        updatedEventData['category'] = helperFuncs.checkStringLimited(updatedEvent.categoryEdit, 'Edit Event Location');
    }
    if (updatedEvent.permEdit) {
        updatedEventData['permission'] = helperFuncs.checkPermission(updatedEvent.permEdit);
    }
    if (updatedEvent.descriptionEdit) {
        updatedEventData['description'] = helperFuncs.checkString(updatedEvent.descriptionEdit, 'Edit Event Description');
    }
    if (updatedEvent.portEdit) {
        updatedEventData['nearByPort'] = helperFuncs.checkStringLimited(updatedEvent.portEdit, 'Edit Event Port');
    }
    if (updatedEvent.modeEdit) {
        updatedEventData['eventMode'] = helperFuncs.checkEventMode(updatedEvent.modeEdit);
    }
    if (updatedEvent.feeEdit) {
        updatedEventData['registrationFee'] = helperFuncs.checkStringFee(updatedEvent.feeEdit);
    }
    if (updatedEvent.action) {
        updatedEventData['publish'] = helperFuncs.checkPublishStatus(updatedEvent.action);
    }

    const eventCollection = await events();
    let updateEvent = await eventCollection.findOneAndUpdate(
        {_id: new ObjectId(eventId)},
        {$set: updatedEventData},
        {ReturnDocument: 'after'}
    );

    if (!updateEvent) throw `Could not update this event`;

    return updateEvent._id.toString();
}

export const deleteEvent = async (eventId) => {
    eventId = helperFuncs.checkEventId(eventId);

    const eventCollection = await events();
    const userCollection = await users();

    const deleteEvent = await eventCollection.findOneAndDelete({
        _id: new ObjectId(eventId)
    });
    if (deleteEvent.lastErrorObject.n === 0) {
        throw `Could not delete from events`
    }

    // const deleteUserEvent = await userCollection.findOneAndDelete({
    //     _id: new ObjectId(eventId)
    // });
    // if (deleteUserEvent.lastErrorObject.n === 0) {
    //     throw `Could not delete from events`
    // }

    return {deleted: true}
}
