
import { events, users } from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';
import validators from '../validators.js';
import helperFuncs from "../helpers.js";


const exportedMethods = {
async userEventRegistration(  
  userId,
  eventId,
  userName,
  emailId,
  phoneNumber,
  bestStartDate,
  bestEndDate) {

    try {
      validators.checkStrings(
          [eventId, 'eventId'],
          [userName, 'userName'],
          [emailId, 'emailId'],
          [phoneNumber, 'phoneNumber']
      );
      userId = helperFuncs.checkUserId(userId, 'Create Event userId');
      eventId = helperFuncs.checkEventId((eventId), 'eventId validation');
      userName = validators.checkUsername((userName), 'userName validation');
      emailId = validators.checkEmail(emailId);
    }
    catch(e) {
      throw 'Validation Error: ', e;
    }
  
    const newRegistration = {
      _id: new ObjectId(),
      userName,
      emailId,
      phoneNumber,
      bestStartDate,
      bestEndDate
    };
  
    //Adding user to event
    const eventCollection = await events();
    const updateInfo = await eventCollection.updateOne(
      { _id: ObjectId(events.event._id) },
      { $push: { registration: {registerInfo: newRegistration } } }
    );
  
    if (updateInfo.modifiedCount === 0) throw 'Could not register the user to the event';

    else {
      //Adding event to user profile
      const userCollection = await users();
      const updateUserInfo = await userCollection.updateOne(
        { _id: ObjectId(users.user._id)},
        { $push: { registeredEvent: {registerInfo: newEvent} } }
      );
      if (updateUserInfo.modifiedCount === 0) throw 'Could not register the event to the user profile';
    }
  
    return newRegistration, newEvent;
  }  
}

  export default exportedMethods;