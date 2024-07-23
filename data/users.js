import { users } from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb'
import bcrypt, { hash } from 'bcryptjs'
import axios from 'axios'

const createUser = async (username, password, email, firstName, lastName) => {

    //error handling
    if (!username) throw new Error("Must provide a username.");
    if (typeof username !== 'string') throw new Error("Username must be a string.");
    username.trim()
    if (!username) throw new Error("Username cannot be empty.")
    if (username.length < 4 || username.length > 15) throw new Error("Username must be between 4 and 15 characters long.")
    
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
        if (findEmail !== 0) throw new Error ("Emaila already exists.");
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