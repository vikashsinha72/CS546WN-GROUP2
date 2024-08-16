
import { events } from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';
import validators from '../validators.js';


/** 
 * EventSchema = Schema({
    createdByuserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    eventName: { type: String, required: true },
    eventDescription: { type: String, required: true },
    eventDate: { type: String, required: true },
    eventLocation: { type: String, required: true },
    category: { type: String, required: true },
    nearByPort: { type: String, required: true },
    eventMode: { type: String, required: true },
    registrationFee: { type: String, required: true },
    contactPerson: { type: String, required: true },
    status: { type: String, enum: ['plan', 'published', 'ready', 'executed', 'suspended', 'closed'], default: 'plan' },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }]
  });
  */


  const exportedMethods = {

    async createEvent(
    eventName,
    eventDescription,
    eventDate,
    eventLocation,
    category,
    nearByPort,
    eventMode,
    registrationFee,
    contactPersonId,
    publish,    // Added this for published/unpublished
    status
  ) 
 {

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
        // date = validators.checkDate(date, 'Create date');   // This will be updated to check the time as well 
        registrationFee = validators.checkPrice(Number(registrationFee), 'Create fee');
        eventMode = helperFuncs.checkEventMode(eventMode);
        permission = helperFuncs.checkPermission(permission);
        publish = helperFuncs.checkPublishStatus(publish, 'Create publish/save');
    }
    catch(e) {
        throw 'Validation Error: ', e;
    }

    let eventStatus = '';
    //initialize empty reviews subdocument
    let reviews = [];
    if (publish === 'publish') {
        eventStatus = 'published';
    }
    else {
        eventStatus = 'planned';
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
    if (!updateUser.acknowledged) throw 'Could not add event to user profile';

    let newId = insertEv.insertedId.toString();
    return newId;
},

// Changes: Gets an event from id not a user
async getEvent(eventId) {
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
            permission: 1,     
            description: 1, 
            nearByPort: 1, 
            eventMode: 1, 
            registrationFee: 1
        }
    });
    
    if (!event) throw "Event could not be found.";
    return event;
},

async getAllEvents(userId) {
    const eventCollection = await events();
    let eventChecker = await eventCollection.findOne({userId: userId});

    if (!eventChecker) throw `Cannot find events for that user!`;

    // excluded openClose and publish from users
    let eventList = await eventCollection.find({}).project({
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
  
      //Validations
      // Input validation
  
      try {
        validators.checkStrings(
          [eventName, 'Event Name'],
          [eventDescription, 'Event Description'],
          [eventLocation, 'Event Location'],
          [category, 'Category'],
          [nearByPort, 'Near-By Port'],
          [eventMode, 'Event Mode'],
          [contactPersonId, 'Contact PersonId']

        );
        validators.checkDate(eventDate,'Event Date');
        validators.checkPrice(registrationFee,'Registration Fee');
        validators.checkBoolean(status, "Status");
      } catch (e) {
        throw 'Validation Error :', e;  
      }
  
  
  
      const event = {
        eventName: eventName.trim(),
        eventDescription: eventDescription.trim(),
        eventDate: eventDate.trim(),
        eventLocation: eventLocation.trim(),
        category: category.trim(),
        nearByPort: nearByPort.trim(),
        eventMode: eventMode.trim(),
        registrationFee,
        contactPerson,
        status,
        subscribers: [],
        reviews: [],
        averageReview: 0
      };
  
  
      try {
          const eventCollection = await events();
  
          const result = await eventCollection.insertOne(event);
   
          if (!result.acknowledged || !result.insertedId) {
              throw `Failed to create the new event  :, ${eventName}`;
          }
  
          event._id = result.insertedId.toString();
  
          return event;
          
      } catch (e) {  
        throw 'MongoDB connection error :', e;  
      }
  
  },
  
  async getEvents() {
    try{

      const eventsCollection = await events();
      const eventsList = await eventsCollection.find({}, {projection: {eventName:1,  _id: 1}}).toArray();
      
      console.log("eventsList: ", eventsList);
      
      if (!eventsList) throw new Error("Event could not be found.");
      
      return eventsList;
    } catch (e) {  
      throw 'MongoDB connection error :', e;  
    }
  },
  
  async getEvent(eventId) {
  
    try {
  
        eventId = validators.checkObjectId(eventId, 'Event Id');  
    } catch (e) {
        throw 'Validation Error :', e;  
    }
    if (updatedEvent.locationEdit) {
        updatedEventData['location'] = validators.checkString(updatedEvent.locationEdit, 'Edit Event Location');
    }
    if (updatedEvent.categoryEdit) {
        updatedEventData['category'] = validators.checkString(updatedEvent.categoryEdit, 'Edit Event Location');
    }
    if (updatedEvent.permEdit) {
        updatedEventData['permission'] = helperFuncs.checkPermission(updatedEvent.permEdit);
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
    if (updatedEvent.feeEdit) {
        updatedEventData['registrationFee'] = validators.checkPrice(updatedEvent.feeEdit);
    }
    if (updatedEvent.action) {
        updatedEventData['publish'] = helperFuncs.checkPublishStatus(updatedEvent.action);
    }
    if (updatedEvent.statusEdit) {
        updatedEventData['eventStatus'] = helperFuncs.checkStatus(updatedEvent.action, updatedEvent.statusEdit, 'Edit Event Status');
    }

    const eventCollection = await events();
    let updateEvent = await eventCollection.findOneAndUpdate(
        {_id: new ObjectId(eventId)},
        {$set: updatedEventData},
        {ReturnDocument: 'after'}
    );

    if (!updateEvent) throw `Could not update this event`;

    return updateEvent._id.toString();
},

async deleteEvent(eventId) {
    eventId = validators.checkObjectId(eventId);

    const eventCollection = await events();
    const userCollection = await users();
    
        const event = await eventCollection.findOne({ _id: objectId });
        if (!event) {
            throw `Event not found. for Event Id: ${eventId}` ;
        }
        return event;
        
  },
  
  /** This is optional as event may not require to be removed. */
  async removeEvent (eventId) {
  
    // Input validation
    try {
      validators.checkObjectId(eventId, 'Event Id');
    } catch (e) {
      throw 'Validation Error :', e;  
    }
  
    try {
        const eventCollection = await events();
        const objectId =  new ObjectId(eventId);
    
    
        const event = await eventCollection.deleteOne({ _id: objectId });
        if (product.deletedCount === 0) {
            throw `Event not found and not deleted for Event Id: ${eventId}` ;
        }
        
        return { _id: eventId, deleted: true };
  
    } catch (e) {
      throw 'MongoDB connection error :', e;  
    }
  
  
  },
  
  /**Update Event */
  async updateEvent (
    eventId,
    eventName,
    eventDescription,
    eventDate,
    eventLocation,
    category,
    nearByPort,
    eventMode,
    registrationFee,
    contactPersonId,
    status
  ) {
  
  
     // Input validation    
     try {
        validators.checkStrings(
          [eventName, 'Event Name'],
          [eventDescription, 'Event Description'],
          [eventLocation, 'Event Location'],
          [category, 'Category'],
          [nearByPort, 'Near-By Port'],
          [eventMode, 'Event Mode']

        );
        validators.checkObjectId(eventId, 'Event Id');
        validators.checkDate(eventDate,'Event Date');
        validators.checkPrice(registrationFee,'Registration Fee');
        validators.checkObjectId(contactPersonId, 'Contact Person Id');
        validators.checkBoolean(status, "Status");
      } catch (e) {
        throw 'Validation Error :', e;  
      }


    const updatedEvent = {
        eventName: eventName.trim(),
        eventDescription: eventDescription.trim(),
        eventDate: eventDate.trim(),
        eventLocation: eventLocation.trim(),
        category: category.trim(),
        nearByPort: nearByPort.trim(),
        eventMode: eventMode.trim(),
        registrationFee,
        contactPersonId,
        status
      };
  
  
    try {
        const eventCollection = await events();
  
      const objectId =  new ObjectId(eventId);
  
  
      const result = await eventCollection.findOneAndUpdate(
        { _id: objectId },
        { $set: updatedEvent },
        { returnOriginal: false }
      );
      
      if (result.matchedCount === 0) {
        throw `Failed to update Event with ID ${objectId}`;
      }
  
      return updatedEvent;
  
    } catch (e) {
      throw 'MongoDB connection error :', e;  
    }
  
    },

    async addSubscriber (
        eventId,
        userId
      ) {
    
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
    
      },
      
      
      async removeSubscriber ( eventId, userId) {
  
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
  }
  
  export default exportedMethods;
  
