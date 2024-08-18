import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import {registerUser, loginUser, getUser, getAllUsers} from './data/users.js';
import {createEvent, getEvent, getAllEvents, updateEventPatch, deleteEvent} from '../data/events.js';

const db = await dbConnection(); 
await db.dropDatabase();

const userOne = {
    username: 'patrickHill',
    firstName: 'Patrick',
    lastName: 'Hill',
    emailAddress: 'patrickhill@gmail.com',
    password: 'PatH!123'
};

const userTwo = {
    username: 'alexisbrule',
    firstName: 'Alexis',
    lastName: 'Brule',
    emailAddress: 'alexisbrule@gmail.com',
    password: 'AlexLogin123$'
};

const userThree = {
    username: 'katnissEHunger',
    firstName: 'Katniss',
    lastName: 'Everdeen',
    emailAddress: 'buttercupemail@gmail.com',
    password: 'KatisTired12$'
};

const userFour = {
    username: 'peetaMellark',
    firstName: 'Peeta',
    lastName: 'Mellark',
    emailAddress: 'boywithbread@gmail.com',
    password: 'AnotherUser!$'
};

const patrick = await registerUser(userOne);
const pid = patrick._id.toString();

const alexis = await registerUser(userTwo);
const aid = alexis._id.toString();

const katniss = await registerUser(userThree);
const kid = katniss._id.toString();

const peeta = await registerUser(userFour);
const peid = peeta._id.toString();

const frogHunt = {
    userId: pid,
    eventName: 'Frog Hunt',
    date: '2024-08-22T15:00',
    location: 'New Jersey',
    category: 'Party',
    permission: 'public',
    description: 'We will hunt the frogs and look at them.',
    nearByPort: 'Hoboken Airport',
    eventMode: 'public',
    registrationFee: '0',
    publish: 'publish'
}

const eventOne = await createEvent(frogHunt);

const crochetParty = {
    userId: aid,
    eventName: 'Crochet Party',
    date: '2024-10-22T15:00',
    location: 'Salt Lake City',
    category: 'Get Together',
    permission: 'public',
    description: 'Bring your wips and crochet through the night!',
    nearByPort: 'Salt Lake International',
    eventMode: 'Online',
    registrationFee: '5.00',
    publish: 'save'
}

const eventTwo = await createEvent(crochetParty);

const huntHike = {
    userId: kid,
    eventName: 'Hunting Party',
    date: '2024-12-22T15:00',
    location: 'Panem',
    category: 'Casual Hangout',
    permission: 'public',
    description: 'We are going to hunt in the forest.',
    nearByPort: 'Panem train system',
    eventMode: 'public',
    registrationFee: '25.00',
    publish: 'publish'
}

const eventThree = await createEvent(huntHike);

const baking = {
    userId: peid,
    eventName: 'Baking Class',
    date: '2024-12-22T15:00',
    location: 'Panem',
    category: 'Other',
    permission: 'public',
    description: 'We are going to make a loaf of bread.',
    nearByPort: 'Panem train system',
    eventMode: 'public',
    registrationFee: '30.00',
    publish: 'publish'
}

const eventFour = await createEvent(baking);

await closeConnection();