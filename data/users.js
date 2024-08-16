import 'express-session';
import axios from 'axios';
import bcryptjs from 'bcryptjs'
import { users } from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb'
import validators from '../validators.js';


export const registerUser = async (
  username,
  firstName,
  lastName,
  emailAddress,
  password
) => {      
    //username error handling
    if (!username) throw new Error("Must provide a username.");
    if (typeof username !== 'string') throw new Error("Username must be a string.");
    username = username.trim()
    if (!username) throw new Error("Username cannot be empty.")
    if (username.length < 4 || username.length > 15) throw new Error("Username must be between 4 and 15 characters long.")

    //firstName error handling - check for numbers
    if (!firstName) throw new Error("Must provide a first name.");
    if (typeof firstName !== 'string') throw new Error("First name must be a string.");
    firstName = firstName.trim();
    if (!firstName) throw new Error("First name cannot be empty or just spaces.");
    if (firstName.length < 2 || firstName.length > 25) throw new Error("First name should be at least 2 characters long with a max of 25 characters.");
   
   //lastName error handling
   if (!lastName) throw new Error("Must provide a last name.");
   if (typeof lastName !== 'string') throw new Error("Last name must be a string.");
   lastName = lastName.trim();
   if (!lastName) throw new Error("Last name cannot be empty or just spaces.");
   if (lastName.length < 2 || lastName.length > 25) throw new Error("Last name should be at least 2 characters long with a max of 25 characters.");
  
   //email error handling
   if (!emailAddress) throw new Error("Must provide an email");
   if (typeof emailAddress !== 'string') throw new Error("Email must be a string");
   emailAddress = emailAddress.trim();
   if (!emailAddress) throw new Error("Email cannot be empty or just spaces.");
   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.toLowerCase())) throw new Error("Email must be in a proper format.");
   
   //password error handling
   if (!password) throw new Error("Must provide a password");
   if (typeof password !== 'string') throw new Error("Password must be a string.");
   if (password.includes(' ')) throw new Error("Password cannot have spaces.")
   if (password.length < 8) throw new Error("Password must be at least 8 characters long.")
   if (!/[A-Z]/.test(password)) throw new Error("Password must have at least one capital letter.")
   if (!/[0-9]/.test(password)) throw new Error("Password must have at least one number.")
   if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) throw new Error("Password must have at least one special character.")
      
   const usersCollection = await users();
  
   //check if username already exists
   const existingUserName = await usersCollection.findOne({username: username});
   if (existingUserName) throw new Error("That username is taken.");

   //check if email already exists
   const existingUser = await usersCollection.findOne({ email: emailAddress });
   if (existingUser) throw new Error("User with that email already exists.");
    
    //initialize empty reviews array
    const reviews = [];

    // This is going to connect the events db to the user one  for easier authentication
    let events = [];

    //hash password - 8 salt round
    const hashedPassword = await bcrypt.hash(password, 8);
  
    //now create user object
    const newUser = {
       "username": username,
       "password": hashedPassword,
       "emailAddress": emailAddress.toLowerCase(),
       "firstName": firstName,
       "lastName": lastName,
       reviews,
       events
      }
  
    //insert user into the db
    await usersCollection.insertOne(newUser);
  
    return { "userInserted": true };

};

export const loginUser = async (username, password) => {
  //email error handling
  if (!username) throw new Error("Must provide a username");
  if (typeof username !== 'string') throw new Error("Username must be a string");
  username.trim();
  if (!username) throw new Error("Username cannot be empty or just spaces.");

  if (!password) throw new Error("Must provide a password");
  if (typeof password !== 'string') throw new Error("Password must be a string.");
  if (password.includes(' ')) throw new Error("Password cannot have spaces.")
  if (password.length < 8) throw new Error("Password must be at least 8 characters long.")
  if (!/[A-Z]/.test(password)) throw new Error("Password must have at least one capital letter.")
  if (!/[0-9]/.test(password)) throw new Error("Password must have at least one number.")
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) throw new Error("Password must have at least one special character.")

  username = username.toLowerCase();

  const usersCollection = await users();
  const user = await usersCollection.findOne({ username })

  const checkPassword = await bcryptjs.compare(password, user.password);
  if (!checkPassword) throw new Error("Password does not match.");

  const { firstName, lastName, email } = user;
  return { username, firstName, lastName, email };

};

export const getUser = async (userId) => {
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


export const getUserList = async () => {
  // try {
  //     const usersCollection = await users();
  //     const userList = await usersCollection.find({}, { projection: { username: 1, _id: 1 } }).toArray();
  //     return userList || [];
  //   } catch (e) {
  //     throw 'MongoDB connection error :', e;  
  //   }
  const usersCollection = await users();

  let userList = await usersCollection.find({}).toArray();
  if (!userList) throw new Error("Could not get all users.");
  
  userList = userList.map((element) => {
    element._id = element._id.toString();
    return element;
  })

  return userList;
}



export const updateUser = async(userId, firstName, lastName, emailAddress, password) => {
    try{
      validators.checkStrings(
        [userId, 'User Id'],
        [firstName, 'First Name'],
        [lastName, 'Last Name'],
        [emailAddress, 'Email Address'],
        [password, 'Password']
      );
    
      // Add further validation
      validators.checkObjectId(userId, "User Id");
      validators.checkFirstname(firstName);
      validators.checkLastname(lastName);
      validators.checkEmail(emailAddress);
      validators.checkPassword(password);
    }
    catch (e) {
      throw 'Validation Error :', e;
    }
  
    try {
      const usersCollection = await users();
      const emailExists = await usersCollection.findOne({ emailAddress: emailAddress.toLowerCase() });
      if (emailExists && emailExists._id != userId) throw 'There is already a user with that email address.';
  
      const hashedPassword = await bcrypt.hash(password, 8);

      const updatedUser = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailAddress: emailAddress.trim(),
        hashedPassword: hashedPassword,
      };

    const objectId =  new ObjectId(userId);
  
    const result = await usersCollection.findOneAndUpdate(
      { _id: objectId },
      { $set: updatedUser },
      { returnOriginal: false }
    );
    
    if (result.matchedCount === 0) {
      throw `Failed to update User with ID ${objectId}`;
    }

    return updatedUser;

  } catch (e) {
    throw "MongoDB connection error : ", e;  
  }
  
  
}



export const changePasssword = async(userId, oldPassword, newPassword) => {
  try {
      validators.checkStrings(
        [userId, 'User Id'],
        [oldPassword, 'Old Passord'],
        [newPassword, 'New Password']
      );
    
      // Add further validation
      validators.checkObjectId(userId, "User Id");
      validators.checkPassword(oldPassword);
      validators.checkPassword(newPassword);  
    }
    catch (e) {
      throw 'Validation Error :', e;
    }
  
    try{
  
    const usersCollection = await users();

    const updatedUser = new ObjectId(userId);
    
    const user = await usersCollection.findOne({ _id: objectId });

    if (!user) 
    {
        throw `User not found for User Id: ${userId}` ;
    }
  
    const hashedPassword = await bcryptjs.hash(newPassword, 8);
    updatedUser.hashedPassword = hashedPassword;

  
    const result = await usersCollection.findOneAndUpdate(
      { _id: ObjectId },
      { $set: updatedUser },
      { returnOriginal: false }
    );
    
    if (result.matchedCount === 0) {
      throw `Failed to update User with ID ${ObjectId}`;
    }

    return updatedUser;

  } catch (e) {
    throw `MongoDB connection error : ${e}`;  
  }
  
}



export default { registerUser, loginUser, getUser, getUserList, updateUser, changePasssword }