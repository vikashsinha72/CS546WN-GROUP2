import {ObjectId} from 'mongodb';

const exportedMethods = {

  checkObjectId(id, idName) {
    if (!id) {
        throw `${idName} is missing`;
    }
    if (typeof id !== 'string') {
        throw `${idName} must be a string`;
    }
    id = id.trim();
    if (id.length === 0) {
        throw `${idName} cannot be an empty string or empty spaces`;
    }
    if (!ObjectId.isValid(id)) {
        throw `${idName} is an invalid object ID`;
    }
    return id;
},


checkStrings(...params) {
    params.forEach(([strVal, varName]) => {

        this.checkString(strVal,varName);

    });
},
checkString(strVal, varName) {

    if (!strVal) {
        throw `${varName} is missing.`;
    }
    if (typeof strVal !== 'string') {
        throw `${varName} must be a string!`;
    }
    strVal = strVal.trim();
    if (strVal.length === 0) {
        throw ` ${varName} cannot be an empty string or string with empty spaces`;
    }
    
    /**if (!isNaN(strVal)) {
        throw `${strVal} is not a valid value for ${varName} as it only contains digits`;
    }**/ 

    return strVal;
},



checkArray(arr, varName, valueType='string', emptyCheck=true) {


    if (!arr || !Array.isArray(arr)) {
        throw `${varName} is not an Array`;
    }

    if (emptyCheck && arr.length === 0) {
        throw `${varName} is an empty Array`;
    }

    arr.forEach((element, index) => {
        switch (valueType) {
            case 'string':
                if (typeof element !== 'string' || element.trim().length === 0) {
                    throw `Element at index ${index} in ${varName} array is not a valid string or is an empty string`;
                }
                arr[index] = element.trim();
                break;
            case 'boolean':
                if (typeof element !== 'boolean') {
                    throw `Element at index ${index} in ${varName} array is not a valid boolean`;
                }
                break;
            case 'numeric':
                if (typeof element !== 'number' || isNaN(element)) {
                    throw `Element at index ${index} in ${varName} array is not a valid number`;
                }
                break;
            case 'array':
                if (!Array.isArray(element)) {
                    throw `Element at index ${index} in ${varName} array is not a valid array`;
                }
                break;
            case 'object':
                if (typeof element !== 'object' || Array.isArray(element) || element === null) {
                    throw `Element at index ${index} in ${varName} array is not a valid object`;
                }
                break;
            default:
                throw `Unsupported value type: ${valueType}`;
        }
    });

    return arr;
},


// TODO: improvise to check date in a fomrat passed as parameter
checkDate(date, varName) {

    if (!date) {
        throw `${varName} is missing`;
    }
    if (typeof date !== 'string') {
        throw `${varName} must be a string`;
    }
    date = date.trim();
    if (date.length === 0) {
        throw `${varName} cannot be an empty string or empty spaces`;
    }

    if (!/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(date)) {
        throw `${varName} dateReleased must be a valid date in mm/dd/yyyy format.`;
      }

    return date;
},

checkUrl(url, varName) {


    if (!url) {
        throw `${varName} is missing`;
    }
    if (typeof url !== 'string') {
        throw `${varName} must be a string`;
    }
    url = url.trim();
    if (url.length === 0) {
        throw `${varName} cannot be an empty string or empty spaces`;
    }

    if (!/^(http:\/\/www\.|http:\/\/www\.).{5,}\.com$/.test(url)) {
        throw `${varName}  must start with http://www. and end with .com and have at least 5 characters in-between.`;
    }

    return url;
},

checkPrice(price, varName) {

    if (!price && price != 0) {
        throw `${varName} is missing`;
    }
    if (typeof price !== 'number') {
        throw `${varName} must be a number`;
    }

    if (price < 0 || !/^\d+(\.\d{1,2})?$/.test(price.toString())) {
        throw `${varName} must be a number greater than 0 with up to 2 decimal places.`;
    }

    return price;
},

checkRating(rating, varName) {

    if (!rating) {
        throw `${varName} is missing`;
    }
    if (typeof rating !== 'number') {
        throw `${varName} must be a number`;
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5 || !/^\d+(\.\d{1})?$/.test(rating.toString())) {
        throw `${varName} must be a number between 1 and 5 with at most one decimal place.`;
    }     

    return rating;
},

checkBoolean(bolVal, varName) {

    if (bolVal=== undefined) {
        throw `${varName} is missing`;
    }

    if (typeof bolVal !== 'boolean') {
        throw `${varName} must be a boolean`;
    }    

    return bolVal;
},

 // Validate First Name
 checkFirstname(firstName)
 {

      if (!firstName || !/^[A-Za-z]{2,25}$/.test(firstName)) {
          throw 'First Name must be 2-25 characters long and contain only letters.';
      }

      return firstName;
  },

  // Validate Last Name
  checkLastname(lastName)
  {
      if (!lastName || !/^[A-Za-z]{2,25}$/.test(lastName)) {
          throw 'Last Name must be 2-25 characters long and contain only letters.';
      }

      return lastName;
  },

  // Validate Email Address
  checkEmail(email)
  {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          throw 'Invalid email address.';
      }

      return email;
  },

// Validate Password
checkPassword(password)
{
  if (!password || !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])[\S]{8,}$/.test(password)) {
      throw 'Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character.';
  }
  return password;
},

// Validate Confirm Password
checkPasswordmatch(password , confirmPassword)
{
  if (password !== confirmPassword) {
      throw 'Passwords do not match.';
  }

  return password;
},

// Validate Role
checkUsername(username)
{
    if (!username) throw new Error("Must provide a username.");
    if (typeof username !== 'string') throw new Error("Username must be a string.");
    username = username.trim()
    if (!username) throw new Error("Username cannot be empty.")
    if (username.length < 4 || username.length > 15) throw new Error("Username must be between 4 and 15 characters long.")

    return username;

}


};

export default exportedMethods;