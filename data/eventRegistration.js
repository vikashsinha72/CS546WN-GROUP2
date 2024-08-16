
import { events } from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';
import validators from '../validators.js';



const exportedMethods = {
async createEventRegisteredUser(  
  eventId,
  userName,
  emailId,
  phoneNumber,
  bestStartDate,
  bestEndDate) {
    // productId = helpers.checkId(productId, "Product ID");
    // title = helpers.checkString(title, "Title");
    // reviewerName = helpers.checkString(reviewerName, "Reviewer Name");
    // review = helpers.checkString(review, "Review");
    // rating = helpers.checkNumber(rating, "Rating");
  
    // const reviewDate = helpers.getReviewDate();
  
    // if (rating < 1 || rating > 5) throw "Rating must be between 1 and 5";
  
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