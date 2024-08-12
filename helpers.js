// I've added just a general string helper functions that I think could come in handy. 
// Feel free to add any you need
import mailer from nodemailer;
const helperFuncs = {

    // Check string input and return a trimmed version 
    checkString(strVal, varName) {
        if (!strVal) throw `Error: You must supply a ${varName || 'string'}.`;
        if (typeof strVal !== 'string') throw `Error: ${varName || 'input'} must be a string.`;
        strVal.trim();
        if (strVal.length === 0) throw `Error: ${varName || 'input'} must not be blank or all spaces.`;
        if (!isNaN(strVal)) throw `Error: ${strVal || 'input'} must not be only numbers.`;
        return strVal;
    }

    
}

export default helperFuncs;