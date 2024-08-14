
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

    async create(
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
  
    try {
        const eventCollection = await events();
  
        const objectId =  new ObjectId(eventId);  
    
        const event = await eventCollection.findOne({ _id: objectId });
        if (!event) {
            throw `Event not found. for Event Id: ${eventId}` ;
        }
        return event;
        } catch (e) {
        throw 'MongoDB connection error :', e;  
        }
  
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
  