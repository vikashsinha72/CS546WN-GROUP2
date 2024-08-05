import { users } from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb'
import bcrypt, { hash } from 'bcryptjs'
import axios from 'axios'

const createUser = async (username, password, email, firstName, lastName) => {

    //username error handling
    if (!username) throw new Error("Must provide a username.");
    if (typeof username !== 'string') throw new Error("Username must be a string.");
    username.trim()
    if (!username) throw new Error("Username cannot be empty.")
    if (username.length < 4 || username.length > 15) throw new Error("Username must be between 4 and 15 characters long.")
    
    //password error handling

    //email error handling

    //firstName error handling

    //lastName error handling
    
    const usersCollection = await users();
    
    //check if username already exists 
    const count = await usersCollection.countDocuments()
    if (count !== 0) {
        findUsername = await usersCollection.findOne({ 'username': username });
        if (findUsername !== 0) throw new Error ("Username already exists.");
    }

    //check if email already exists
    const emailCount = await usersCollection.countDocuments();
    if (emailCount !== 0) {
        findEmail = await usersCollection.findOne({ 'email': email });
        if (findEmail !== 0) throw new Error ("Email already exists.");
    }

    //initialize empty reviews subdocument
    const reviews = [];

    //hash password - 8 salt round
    const hashedPassword = await bcrypt.hash(password, 8);

    //now create user object
    const newUser = {
       "username": username, 
       "password": hashedPassword,
       "email": email.toLowerCase(),
       "firstName": firstName,
       "lastName": lastName,
       reviews,
    }

    //insert user into the db
    let insertUser = await usersCollection.insertOne(newUser);

    return { "userInserted": true };

}

const getUser = async (userId) => {
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