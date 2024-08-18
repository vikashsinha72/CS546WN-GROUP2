import { users, events } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import helperFuncs from '../helpers.js';
import validators from '../validators.js';

export const createEvent = async (
    // I took away username as it is not needed here
    userId, 
    eventName, 
    date, 
    location, 
    category,
    description, 
    nearByPort, 
    eventMode, 
    registrationFee,
    publish,    // Added this for published/unpublished
) => {

    // Error handling
    // Changing error handling to a mix of Vikash's validators and mine

    try {
        userId = validators.checkObjectId(userId, 'Create Event userId');
        validators.checkStrings(
            [eventName, 'Create Event Name'],
            [location, 'Create location'],
            [category, 'Create category'],
            [description, 'Create description'],
            [nearByPort, 'Create nearByPort'],
        );
        date = validators.checkDate(date, 'Create date');  
        registrationFee = validators.checkPrice(registrationFee, 'Create fee');
        eventMode = helperFuncs.checkEventMode(eventMode);
        publish = helperFuncs.checkPublishStatus(publish, 'Create publish/save');
    }
    catch(e) {
        throw 'Validation Error: ', e;
    }

    let eventStatus = '';
    //initialize empty reviews subdocument

    if (publish === 'publish') {
        eventStatus = 'Published';
    }
    else {
        eventStatus = 'Planned';
    }
    

    // making a string into ObjectId format
    const userObjId = new ObjectId(userId);

    //create new event object
    const newEvent = {
        _id: new ObjectId(),
        userId: userId,
        eventName: eventName,
        date: date,
        category: category,
        description: description,
        location: location,
        nearByPort: nearByPort,
        eventMode: eventMode,
        registrationFee: registrationFee,
        publish: publish,
        eventStatus: eventStatus,
        subscribers: [],    // this is for event subscribers or register users
        reviews: [],  // this is for event reviews
        averageReview: 0    // this is for event reviews
    }

    const userCollection = await users();
    const eventCollection = await events();
    // Push event to the user
    const insertEv = await eventCollection.insertOne(newEvent);
    if (!insertEv.acknowledged || !insertEv.insertedId) throw 'Could not add event';
    const updateUser = await userCollection.updateOne({_id: userObjId}, {$push: {events:{_id: newEvent._id, eventName: eventName}}});
    if (!updateUser.acknowledged) throw 'Could not add event to user profile';

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
            eventName: 1, 
            date: 1, 
            location: 1, 
            category: 1,
            description: 1, 
            nearByPort: 1, 
            eventMode: 1, 
            registrationFee: 1
        }
    });
    
    if (!event) throw "Event could not be found.";
    return event;
}

export const getEventList = async () => {
    // This skeleton code comes from Vikash

    try {
      const eventCollection = await events();
      const eventList = await eventCollection.find({publish: 'publish'}, { 
        projection: {
            _id: 1,
             eventName: 1,
             date: 1,
             description: 1
            } 
    }).toArray();
    if (eventList.length != 0) {
        eventList.forEach((obj) => {
            obj.date = helperFuncs.eventDateTimeFormat(obj.date);
            obj._id = obj._id.toString();
        });
    }
    return eventList;
    } catch (e) {
        console.log('MongoDB connection error :', e);  
      throw 'MongoDB connection error :', e;  
    }
  
}

export const getAllEvents = async (userId) => {
    const eventCollection = await events();
    let eventChecker = await eventCollection.findOne({userId: userId.toString()});

    if (!eventChecker) throw `Cannot find events for that user!`;

    // excluded openClose and publish from users
    let eventList = await eventCollection.find({userId: userId.toString()}).project({
        eventName: 1, 
        date: 1, 
        location: 1, 
        category: 1,  
        description: 1, 
        nearByPort: 1, 
        eventMode: 1, 
        registrationFee: 1,
        eventStatus: 1
    }).toArray();
    if (!eventList) throw new Error("Could not get all events.");
    
    eventList = eventList.map((element) => {
      element._id = element._id.toString();
      return element;
    })
  
    return eventList;
}

export const updateEventPatch = async (eventId, updatedEvent) => {
    const eventCollection = await events(); 
    const eventFind = await eventCollection.findOne({_id: new ObjectId(eventId)});
    if (eventFind.eventStatus === 'Closed' || eventFind.eventStatus === 'Executed') {
        throw `You cannot edit closed events.`
    };

    // Fee and date are separately checked 
    const updatedEventData = {};

    if (updatedEvent.eventNameEdit) {
        updatedEventData['eventName'] = validators.checkString(updatedEvent.eventNameEdit, 'Edit Event Name');
    }
    if (updatedEvent.locationEdit) {
        updatedEventData['location'] = validators.checkString(updatedEvent.locationEdit, 'Edit Event Location');
    }
    if (updatedEvent.categoryEdit) {
        updatedEventData['category'] = validators.checkString(updatedEvent.categoryEdit, 'Edit Event Location');
    }
    if (updatedEvent.descriptionEdit) {
        updatedEventData['description'] = validators.checkString(updatedEvent.descriptionEdit, 'Edit Event Description');
    }
    if (updatedEvent.portEdit) {
        updatedEventData['nearByPort'] = validators.checkString(updatedEvent.portEdit, 'Edit Event Port');
    }
    if (updatedEvent.modeEdit) {
        updatedEventData['eventMode'] = helperFuncs.checkEventMode(updatedEvent.modeEdit);
    }
    if (updatedEvent.action) {
        updatedEventData['publish'] = helperFuncs.checkPublishStatus(updatedEvent.action);
    }
    if (updatedEvent.statusEdit) {
        updatedEventData['eventStatus'] = helperFuncs.checkStatus(updatedEvent.action, updatedEvent.statusEdit, 'Edit Event Status');
    }

    
    let updateEvent = await eventCollection.findOneAndUpdate(
        {_id: new ObjectId(eventId)},
        {$set: updatedEventData},
        {ReturnDocument: 'after'}
    );

    if (!updateEvent) throw `Could not update this event`;

    return updateEvent;
}

export const deleteEvent = async (eventId) => {
    eventId = validators.checkObjectId(eventId);

    const eventCollection = await events();
    const userCollection = await users();
    
    // Check if they can delete the event
    try { 
        const userId = await userCollection.findOne({
            'events._id': new ObjectId(eventId)
        });
        if (!userId) throw `Cannot find event attatched to a user.`;
    }
    catch(e) {
        return res.render(path.resolve('views/editEvent'), ({errors: e, hasErrors: true}));
    } 

    // Need error checking on delete but not sure how to do that
    const deleteEvent = await eventCollection.findOneAndDelete({
        _id: new ObjectId(eventId)
    });


    // Can't use find and delete because it will delete the whole user
    const deleteUserEvent = await userCollection.findOneAndUpdate(
        {'events._id': new ObjectId(eventId)},
        {$pull: {events: {_id: new ObjectId(eventId)}}},
        {returnDocument: 'after'}
    );



    return {deleted: true}
}


//Method for search, add subscriber, delete subscriber
export const searchEvent = async (
    eventName,
    eventDate, 
    locationInput, 
    category, 
    registration
  )  => {

    try {
      const eventCollection = await events();

      // Building the query object
      const query = {};

      if (eventName) {
        query.eventName = { $regex: eventName, $options: 'i' }; // Case-insensitive search
      }
      if (eventDate) {
        query.eventDate = eventDate;
      }
      if (locationInput) {
        query.locationInput = { $regex: locationInput, $options: 'i' };
      }
      if (category) {
        query.category = { $regex: category, $options: 'i' };
      }
      if (registration) {
        query.registrationFee = registration;
      }

      const eventList = await eventCollection.find(query).toArray();
      return eventList || [];        

    } catch (e) {
      throw 'MongoDB connection error :', e;  
    }
  
  }


  export const addSubscriber = async (
      eventId,
      userId
    ) => {
  
      try {
        validators.checkObjectId(eventId, 'Event Id');
        validators.checkObjectId(userId, 'User Id');
      } catch (e) {
        throw 'Validation Error :', e;  
      }
  
  
      try {
        const eventCollection = await events();
        const objectId = new ObjectId(eventId);
        const userObjectId = new ObjectId(userId);

        const event = await eventCollection.findOne({ _id: objectId });
  
        if (!event) 
        {
            throw `Event not found for Event Id: ${eventId}` ;
        }
  
        event.subscribers.push(userObjectId);
    
        await eventCollection.updateOne({ _id: objectId }, { $set: { subscribers: event.subscribers} });
    
        return event;
      } catch (e) {
        throw 'MongoDB connection error :', e;  
      }
  
    }
    
    export const removeSubscriber = async (
        eventId, userId) => {
      try {
          validators.checkObjectId(eventId, 'Event Id');
          validators.checkObjectId(userId, 'User Id');
        } catch (e) {
          throw 'Validation Error :', e;  
        }
    
    
        try {
          const eventCollection = await events();
          const objectId = new ObjectId(eventId);
          const userObjectId = new ObjectId(userId);

    
          const event = await eventCollection.findOne({ _id: objectId });
    
          if (!event) 
          {
              throw `Event not found for Event Id: ${eventId}` ;
          }
    
          event.subscribers.deleteOne(userObjectId);
      
          await eventCollection.updateOne({ _id: objectId }, { $set: { subscribers: event.subscribers} });
      
          return event;
        } catch (e) {
          throw 'MongoDB connection error :', e;  
        }

      
    }




export default {searchEvent,addSubscriber, removeSubscriber, deleteEvent, getEventList, updateEventPatch, getAllEvents, getEvent, createEvent};
