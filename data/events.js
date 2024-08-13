import { users, events } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
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


    let newId = insertEv._id.toString();
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

export const getEvents = async () => {
  const eventsCollection = await events();
  const eventsList = await eventsCollection.find({}, {projection: {eventName:1,  _id: 1}}).toArray();

  console.log("eventsList: ", eventsList);

  if (!eventsList) throw new Error("Event could not be found.");

  return eventsList;
}

export const getAllEvents = async () => {
    const eventCollection = await events();

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

export const updateEvent = async (
    eventId, 
    username,
    eventName, 
    date, 
    location, 
    category,
    permission,     
    description, 
    nearByPort, 
    eventMode, 
    registrationFee,
    publish, 
) => {

}

//Sriya - EventRegistration code 
export const createEventRegistration = async (
  username,
  eventName,
  emailId,
  phoneNumber,
  bestTimetoCall
) => {
  //get eventsCollection
  const eventsCollection = await events();

  const newEventRegistration = {
    _id: new ObjectId(),
    username: username,
    eventName: eventName,
    emailId: emailId,
    phoneNumber: phoneNumber,
    bestTimetoCall: bestTimetoCall
  };

  const eventRegistration = await eventsCollection.updateOne(
    { _id: new ObjectId(productId) },
    { $push: { registration: newEventRegistration } }
  );
  if (updateInfo.modifiedCount === 0) throw 'Could not add registration for specific event';
  return eventRegistration;

};
