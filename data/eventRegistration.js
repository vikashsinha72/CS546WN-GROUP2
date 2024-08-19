
import { events, users, registeredUsers } from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';
import validators from '../validators.js';
import helperFuncs from "../helpers.js";

const exportedMethods = {
async userEventRegistration( 
  userId,
  eventId,
  emailId,
  phoneNumber,
  bestStartDate,
  bestEndDate) {

    try {
      validators.checkStrings(
          [userId, 'userId'],
          [eventId, 'eventId'],
          [userName, 'userName'],
          [emailId, 'emailId'],
          [phoneNumber, 'phoneNumber']
      );
      userId = helperFuncs.checkUserId(userId, 'Create Event userId');
      eventId = helperFuncs.checkEventId((eventId), 'eventId validation');
      userName = validators.checkUsername((userName), 'userName validation');
      emailId = validators.checkEmail(emailId);
      bestStartDate = validators.checkDate((bestStartDate), 'bestStartDate vaildation')
      bestEndDate = validators.checkDate((bestEndDate), 'bestEndDate vaildation')

    }
    catch(e) {
      throw 'Validation Error: ', e;
    }

    const newRegistration = {
      _id: new ObjectId(),
      userId,
      userName,
      emailId,
      phoneNumber,
      bestStartDate,
      bestEndDate
    };
  
    //Adding user to event
    const registeredUsersCollection = await registeredUsers();
    const registrationInfo = await registeredUsersCollection.insertOne(newRegistration);
    return registrationInfo;
    // if (updateInfo.modifiedCount === 0) throw 'Could not register the user to the event';

    // else {
    //   //Adding event to user profile
    //   const userCollection = await users();
    //   const updateUserInfo = await userCollection.updateOne(
    //     { _id: userId },
    //     { $push: { event: newEvent} }
    //   );
    //   if (updateUserInfo.modifiedCount === 0) throw 'Could not register the event to the user profile';
    // }
  
    // return newRegistration, newEvent;
  }  
}

  export default exportedMethods;