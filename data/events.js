import { events } from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb'
import bcrypt, { hash } from 'bcryptjs'
import axios from 'axios'

const createEvent = async (username, eventName, date, location, category, description, nearByPort, eventMode, registrationFee,
    contactPerson
) => {

    //username error handling
    if (!username) throw new Error("Must provide a username.");
    if (typeof username !== 'string') throw new Error("Username must be a string.");
    username.trim()
    if (!username) throw new Error("Username cannot be empty.")
    if (username.length < 4 || username.length > 15) throw new Error("Username must be between 4 and 15 characters long.")
    
    //eventName error handling

    //date error handling

    //location error handling

    //category error handling
    
    //description error handling

    //nearByPort error handling

    //eventMode error handling

    //registrationFee error handling

    //contactPerson error handling

    const eventsCollection = await events();
    
    //check if username already exists 
    const count = await eventsCollection.countDocuments()
    if (count !== 0) {
        findEventName = await eventsCollection.findOne({ 'eventName': eventName});
        if (findEventName !== 0) {
            throw new Error ("EventName already exists. Please enter a unique name.");
        }
    }

    //check if email already exists
    const emailCount = await usersCollection.countDocuments();
    if (emailCount !== 0) {
        findEmail = await usersCollection.findOne({ 'email': email });
        if (findEmail !== 0) throw new Error ("Email already exists.");
    }

    //initialize empty reviews subdocument
    const reviews = [];

    //create new event object
    const newEvent = {
       "username": username, 
       "eventName": eventName,
       "date": date,
       "category": category,
       "description": description,
       "location": location,
       "nearByPort": nearByPort,
       "eventMode": eventMode,
       "registrationFee": registrationFee
    }

  //creating one instance of events
  let eventsInstance = await events();
  const event =  await bandsInstance.insertOne(event);

}

const getEvent = async (userId) => {
    //userId error handling
    if (!userId) throw new Error("Must provide an ID.");
    if (typeof userId !== 'string') throw new Error("ID must be a string.");
    userId = userId.trim();
    if (!userId) throw new Error("ID cannot be empty.");
    if (!ObjectId.isValid(userId)) throw new Error("Invalid Object ID.");

    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) })
    
    if (!user) throw new Error("User could not be found.");

    user._id = user._id.toString();

    return user;
}

const getAllUsers = async (userId) => {
    const usersCollection = await users();

    let userList = await usersCollection.find({}).toArray();
    if (!userList) throw new Error("Could not get all users.");
    
    userList = userList.map((element) => {
      element._id = element._id.toString();
      return element;
    })
  
    return userList;
}

export default { createUser, getUser, getAllUsers }