import bcrypt from 'bcrypt';

import { users } from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';

import validators from '../validators.js';

/*
UsersSchema =Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    role: { type: String, required: true }
  });
  */



const exportedMethods = {
async registerUser(
  firstName,
  lastName,
  email,
  hashedPassword,
  role
)  {
  try{
    validators.checkStrings(
      [firstName, 'First Name'],
      [lastName, 'Last Name'],
      [emailAddress, 'Email Address'],
      [password, 'Password'],
      [role, 'Role']
    );
  
    // Add further validation
    validators.checkFirstname(firstName);
    validators.checkLastname(lastName);
    validators.checkEmail(emailAddress);
    validators.checkPassword(password);
    //validators.checkRole(role);

  }
  catch (e) {
    throw 'Validation Error :', e;
  }


  const usersCollection = await users();

  const emailExists = await usersCollection.findOne({ emailAddress: emailAddress.toLowerCase() });
  if (emailExists) {
    throw 'There is already a user with that email address.';
  }

  const hashedPassword = await bcrypt.hash(password, 16);
  const newUser = {
    firstName,
    lastName,
    emailAddress: emailAddress.toLowerCase(),
    password: hashedPassword,
    role: role.toLowerCase()
  };

  const insertResult = await usersCollection.insertOne(newUser);
  if (insertResult.insertedCount === 0) {
    throw 'Could not add user.';
  }

  return { insertedUser: true };

},


async getUserList()
{
    try {
        const usersCollection = await users();
        const userList = await usersCollection.find({}, { projection: { emailAddress: 1 } }).toArray();
        return userList || [];
      } catch (e) {
        throw 'MongoDB connection error :', e;  
      }
    
},


async getUser(userId)
{

    try {
  
        userId = validators.checkObjectId(userId, 'User Id');  
    } catch (e) {
        throw 'Validation Error :', e;  
    }
  
    try {
        const usersCollection = await users();
  
        const objectId =  new ObjectId(userId);  
    
        const user = await usersCollection.findOne({ _id: objectId });
        if (!user) {
            throw `User not found. for User Id: ${userId}` ;
        }
        return user;
        } catch (e) {
        throw 'MongoDB connection error :', e;  
        }
  

    
},

async updateUser(
    userId,
    firstName,
    lastName,
    email,
    password,
    role
  )  {
    try{
      validators.checkStrings(
        [userId, 'User Id'],
        [firstName, 'First Name'],
        [lastName, 'Last Name'],
        [email, 'Email Address'],
        [password, 'Password'],
        [role, 'Role']
      );
    
      // Add further validation
      validators.checkObjectId(userId, "User Id");
      validators.checkFirstname(firstName);
      validators.checkLastname(lastName);
      validators.checkEmail(email);
      validators.checkPassword(password);
      //validators.checkRole(role);
  
    }
    catch (e) {
      throw 'Validation Error :', e;
    }
  
    try{
  
    const usersCollection = await users();
  
    const emailExists = await usersCollection.findOne({ emailAddress: emailAddress.toLowerCase() });
    if (emailExists && emailExists._id != userId) {
      throw 'There is already a user with that email address.';
    }
  
    const hashedPassword = await bcrypt.hash(password, 16);


    const updatedUser = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        hashedPassword: hashedPassword,
        role: role.trim()
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
  
  
},

async loginUser(emailAddress, password) {

  try{
      validators.checkStrings(
        [emailAddress, 'Email Address'],
        [password, 'Password']
      );
      // Add further validation
      validators.checkEmail(emailAddress);
      validators.checkPassword(password);

  }
  catch (e) {
    throw 'Validation Error :', e;
  }

  try{

        const usersCollection = await users();

        const user = await usersCollection.findOne({ emailAddress: emailAddress.toLowerCase() });
        if (!user) {
            throw 'Either the email address or password is invalid.';
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw 'Either the email address or password is invalid.';
        }

        return {
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddress: user.emailAddress,
            role: user.role
        };

} catch (e) {
    throw "MongoDB connection error : ", e;  
  }
  

},


async changePasssword(
    userId,
    oldPassword,
    newPassword
  )  {
    try{
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
  
    const hashedPassword = await bcrypt.hash(newPassword, 16);
    updatedUser.hashedPassword = hashedPassword;

  
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
    throw `MongoDB connection error : ${e}`;  
  }
  
}

};

export default exportedMethods;



