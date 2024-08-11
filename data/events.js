import { events, users} from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb'


const createEvent = async (username, eventName, date, location, category, description, nearByPort, eventMode, registrationFee,
    contactPerson
) => {

    //check if username already exists 
    const count = await usersCollection.countDocuments()

    if (count !== 0) {
        let findUserName = await usersCollection.findOne({ 'userName': username});
        if (findUserName !== 0) {
            return findUserName;
        }
        else {
            throw new Error("Entered userName does not exist. Please create a user name by signing up for an account.");
        }
    }
    //username error handling
    if (!username) throw new Error("Must provide a username.");
    if (typeof username !== 'string') throw new Error("Username must be a string.");
    username.trim()
    if (!username) throw new Error("Username cannot be empty.")
    if (username.length < 4 || username.length > 15) throw new Error("Username must be between 4 and 15 characters long.")
    
    //eventName error handling
    if (!eventName) throw new Error("Must provide a unqiue event name.");
    if (typeof eventName !== 'string') throw new Error("Event Name must be a string value.");
    eventName.trim()
    if (!eventName) throw new Error("eventName cannot be empty.")
    if (eventName.length < 1 || username.length > 20) throw new Error("Username must be between 1 and 20 characters long.")

    //date error handling

    //location error handling

    //category error handling
    
    //description error handling

    //nearByPort error handling

    //eventMode error handling

    //registrationFee error handling

    //contactPerson error handling

    const eventsCollection = await events();

    //initialize empty reviews subdocument
    const reviews = [];

    //create new event object
    const newEvent = {
        "username": username, 
        "eventName": eventName,
        "date": date,
        "location": location,
        "category": category,
        "description": description,
        "nearByPort": nearByPort,
        "eventMode": eventMode,
        "registrationFee": registrationFee,
        "contactPerson": contactPerson
     }

  //creating one instance of events
  let eventsInstance = await events();
  const event =  await eventsInstance.insertOne(newEvent);

}

const getEvent = async (eventId) => {
    //eventId error handling
    if (!eventId) throw new Error("Must provide an ID.");
    if (typeof eventId !== 'string') throw new Error("ID must be a string.");
    eventId = eventId.trim();
    if (!eventId) throw new Error("ID cannot be empty.");
    if (!ObjectId.isValid(eventId)) throw new Error("Invalid Object ID.");

    const eventsCollection = await events();
    const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) })
    
    if (!event) throw new Error("Event could not be found.");

    event._id = event._id.toString();

    return event;
}

export default { createEvent, getEvent }