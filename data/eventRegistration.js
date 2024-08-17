
import { events } from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';
import validators from '../validators.js';
import helperFuncs from "../helpers.js";



const exportedMethods = {
async createEventRegisteredUser(  
  eventId,
  userName,
  emailId,
  phoneNumber,
  bestStartDate,
  bestEndDate) {

    try {
      userId = validators.checkObjectId(userId, 'Create Event userId');
      validators.checkStrings(
          [eventId, 'eventId'],
          [userName, 'userName'],
          [emailId, 'emailId'],
          [phoneNumber, 'phoneNumber']
      );
      eventId = helperFuncs.checkEventId((eventId), 'eventId validation');
      userName = validators.checkUsername((userName), 'userName validation');
      emailId = validators.checkEmail(emailId);
    }
    catch(e) {
      throw 'Validation Error: ', e;
    }
    const eventCollection = await events();
    const newRegistration = {
      _id: new ObjectId(),
      userName,
      emailId,
      phoneNumber,
      bestStartDate,
      bestEndDate
    };
  
    const updateInfo = await eventCollection.updateOne(
      { _id: new ObjectId(eventId) },
      { $push: { registration: newRegistration } }
    );
  
    if (updateInfo.modifiedCount === 0) throw 'Could not register the user to the event';
  
    return newRegistration;
  }  
}

  export default exportedMethods;