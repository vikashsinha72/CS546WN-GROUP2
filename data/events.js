import { events } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

export const createEvent = async (
  username,
  eventName,
  date,
  location,
  category,
  description,
  nearByPort,
  eventMode,
  registrationFee,
  contactPerson
) => {
  //Add Error handling here

  try {
    //create event
    const eventsCollection = await events();

    const newEvent = {
      username: username,
      eventName: eventName,
      date: date,
      location: location,
      category: category,
      description: description,
      nearByPort: nearByPort,
      eventMode: eventMode,
      registrationFee: registrationFee,
      contactPerson: contactPerson,
    };
    const event = await eventsCollection.insertOne(newEvent);
    return event;
  } catch (error) {
    console.log("Error creating new event: ", error);
    throw new Error(error);
  }
};

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
    username: username,
    eventName: eventName,
    emailId: emailId,
    phoneNumber: phoneNumber,
    bestTimetoCall: bestTimetoCall,
  };
  const eventRegistration = await eventsCollection.insertOne(
    newEventRegistration
  );
  return eventRegistration;
};

// const getEvent = async (eventId) => {
//     //eventId error handling
//     if (!eventId) throw new Error("Must provide an ID.");
//     if (typeof eventId !== 'string') throw new Error("ID must be a string.");
//     eventId = eventId.trim();
//     if (!eventId) throw new Error("ID cannot be empty.");
//     if (!ObjectId.isValid(eventId)) throw new Error("Invalid Object ID.");

//     const eventsCollection = await events();
//     const event = await eventsCollection.findOne({ _id: new ObjectId(eventId)})

//     if (!event) throw new Error("Event could not be found.");

//     event._id = event._id.toString();

//     return event;
// }
