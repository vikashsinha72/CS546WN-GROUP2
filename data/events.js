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

export const getEvents = async () => {
    const eventsCollection = await events();
    const eventsList = await eventsCollection.find({}, {projection: {eventName:1,  _id: 1}}).toArray();

    console.log("eventsList: ", eventsList);

    if (!eventsList) throw new Error("Event could not be found.");

    return eventsList;
}
