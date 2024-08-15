
import { events } from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';

import validators from '../validators.js';

/**
 * Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    rating: { type: Number, required: true },
    review: { type: String, required: true }
});
*/


const exportedMethods = {
    async createReview (
      eventId,
      userId,
      review,
      rating
    ) {
  
  
      try {
        validators.checkString(review, "Review")
        validators.checkRating(rating, 'Rating');
        validators.checkObjectId(eventId, 'Event Id');
        validators.checkObjectId(userId, 'User Id');
      } catch (e) {
        throw 'Validation Error :', e;  
      }
  
  
      const reviewObj = {
        _id: new ObjectId(),
        reviewDate: new Date().toISOString().slice(0, 10),
        userId: new ObjectId(userId.trim()),
        review: review.trim(),
        rating
      };
  
  
      try {
        const eventCollection = await events();
        const objectId = new ObjectId(eventId);
  
        const event = await eventCollection.findOne({ _id: objectId });
  
        if (!event) 
        {
            throw `Event not found. for Event Id: ${eventId}` ;
        }
  
  
        event.reviews.push(reviewObj);
  
        if(event.reviews.length > 0)
        {
            event.averageRating = event.reviews.reduce((acc, rev) => acc + rev.rating, 0) / event.reviews.length;
        }
        else
        {
            event.averageRating =  0;
        }
    
        await eventCollection.updateOne({ _id: objectId }, { $set: { reviews: event.reviews, averageRating: event.averageRating } });
    
        return event;
      } catch (e) {
        throw 'MongoDB connection error :', e;  
      }
  
    },
  
    async getAllReviews (eventId) {
  
  
      try {
        validators.checkObjectId(eventId, 'Event Id');
      } catch (e) {
        throw 'Validation Error :', e;  
      }
  
  
      try {
    
        const eventCollection = await events();
  
        const objectId = new ObjectId(eventId);  
  
        const event = await eventCollection.findOne({ _id: objectId });
  
  
        return event.reviews || [];
      } catch (e) {
        throw 'MongoDB connection error :', e;  
      }
  
    },
  
    async getReview (reviewId) {
      
      try {
        validators.checkObjectId(reviewId, 'Review Id');
      } catch (e) {
        throw 'Validation Error :', e;  
      }
  
  
      try {
        const eventCollection = await events();
  
        const objectId = new ObjectId(reviewId);
  
        const event = await eventCollection.findOne({ "reviews._id": objectId }, { projection: { "reviews.$": 1 } });
  
      
        if (!event || !event.reviews || event.reviews.length === 0) {
          throw "Review not found.";
        }
  
        return event.reviews[0];
      } catch (e) {
        throw 'MongoDB connection error :', e;  
      }
  
    },
  
    async removeReview (reviewId) {
  
      try {
        validators.checkObjectId(reviewId, 'Review Id');    
      } catch (e) {
        throw 'Validation Error :', e;  
  
      }
  
      try {
        const eventCollection = await events();
  
        const objectId = new ObjectId(reviewId);
  
        const event = await eventCollection.findOne({ "reviews._id": objectId });
        if (!event) {
          throw "Review not found.";
        }
  
      
        const updatedReviews = event.reviews.filter(review => !review._id.equals(objectId));
  
        
        event.averageRating = updatedReviews.length > 0 ? updatedReviews.reduce((acc, rev) => acc + rev.rating, 0) / updatedReviews.length : 0;
      
        const eventObjectId = new ObjectId(event._id);
  
        await eventCollection.updateOne({ _id: eventObjectId}, { $set: { reviews: updatedReviews, averageRating: event.averageRating } });
      
        const updatedEvent = eventCollection.findOne({ "_id": eventObjectId });
        return updatedEvent;
  
      } catch (e) {
        throw 'MongoDB connection error :', e;  
      }
  
    },
  
    async updateReview (reviewId, updateObject) {
  
      //Input validations  
      
      const { userId, review, rating } = updateObject;

    
        try {
          validators.checkObjectId(reviewId, 'Review Id');
          validators.checkObjectId(userId, 'User Id');
          validators.checkString(review, "Review");

          validators.checkRating(rating,'Rating');
          
        } catch (e) {
          throw 'Validation Error :', e;  
        }
    
  
  
      try {

        const eventCollection = await events();
  
        const objectId = new ObjectId(reviewId);
  
        const event = await eventCollection.findOne({ "reviews._id": objectId });
        if (!event) {
          throw "Review not found.";
        }
      
        const reviewInfo = event.reviews.find(review => review._id.equals(objectId));
        if (!reviewInfo) {
          throw "Review not found.";
        }
      
        if (userId !== undefined) reviewInfo.userId = new ObjectId(userId.trim());
        if (review !== undefined) reviewInfo.review = review.trim();
        if (rating !== undefined) reviewInfo.rating = rating;
        reviewInfo.reviewDate = new Date().toISOString().slice(0, 10);
      
        if(event.reviews.length > 0)
        {
            event.averageRating = event.reviews.reduce((acc, rev) => acc + rev.rating, 0) / event.reviews.length;
        }
        else
        {
            event.averageRating =  0;
        }
      
        const eventObjectId = new ObjectId(event._id);
  
        await eventCollection.updateOne({ _id: eventObjectId }, { $set: { reviews: event.reviews, averageRating: event.averageRating } });
      
        return event;
  
      } catch (e) {
        throw 'MongoDB connection error :', e;  
      }
  
    }
  
  }
  
  export default exportedMethods;

