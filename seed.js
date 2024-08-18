import {dbConnection, closeConnection} from './config/mongoConnections.js';
import { users } from './config/mongoCollections.js';
import {registerUser} from './data/users.js';
import {createEvent} from './data/events.js';

const db = await dbConnection(); 
await db.dropDatabase();
const main = async () => {
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
        password: 'AnotherUser5!$'
    };

    
    const patrick = await registerUser(
        userOne.username,
        userOne.firstName,
        userOne.lastName,
        userOne.emailAddress,
        userOne.password
    );

    const alexis = await registerUser(
        userTwo.username,
        userTwo.firstName,
        userTwo.lastName,
        userTwo.emailAddress,
        userTwo.password
    );

    const katniss = await registerUser(
        userThree.username,
        userThree.firstName,
        userThree.lastName,
        userThree.emailAddress,
        userThree.password
    );

    const peeta = await registerUser(
        userFour.username,
        userFour.firstName,
        userFour.lastName,
        userFour.emailAddress,
        userFour.password
    );

    const userCollection = await users(); 
    let pid = await userCollection.findOne({username: userOne.username});
    pid = pid._id.toString();
    
    const frogHunt = {
        userId: pid,
        eventName: 'Frog Hunt',
        date: '2024-08-22T15:00',
        location: 'New Jersey',
        category: 'Party',
        description: 'We will hunt the frogs and look at them.',
        nearByPort: 'Hoboken Airport',
        eventMode: 'In-Person',
        registrationFee: '0',
        publish: 'publish'
    }

    try {
        const eventOne = await createEvent(
            frogHunt.userId, 
            frogHunt.eventName, 
            frogHunt.date, 
            frogHunt.location, 
            frogHunt.category,
            frogHunt.description, 
            frogHunt.nearByPort, 
            frogHunt.eventMode, 
            frogHunt.registrationFee,
            frogHunt.publish
        );
        if (!eventOne) throw `Seeding Incomplete.`;
    }
    catch(e){
        console.log('Error: ' + e);
        return;
    }

    let aid = await userCollection.findOne({username: userTwo.username});
    aid = aid._id.toString();

    const crochetParty = {
        userId: aid,
        eventName: 'Crochet Party',
        date: '2024-10-22T15:00',
        location: 'Salt Lake City',
        category: 'Get Together',
        description: 'Bring your wips and crochet through the night!',
        nearByPort: 'Salt Lake International',
        eventMode: 'Online',
        registrationFee: '5.00',
        publish: 'save'
    }

    try {
        const eventTwo = await createEvent(
            crochetParty.userId, 
            crochetParty.eventName, 
            crochetParty.date, 
            crochetParty.location, 
            crochetParty.category,
            crochetParty.description, 
            crochetParty.nearByPort, 
            crochetParty.eventMode, 
            crochetParty.registrationFee,
            crochetParty.publish
        );
        if (!eventTwo) throw `Seeding Incomplete.`;
    }
    catch(e){
        console.log('Error: ' + e);
        return;
    }
    
    let kid = await userCollection.findOne({username: userThree.username});
    kid = kid._id.toString();

    const huntHike = {
        userId: kid,
        eventName: 'Hunting Party',
        date: '2024-12-22T15:00',
        location: 'Panem',
        category: 'Casual Hangout',
        description: 'We are going to hunt in the forest.',
        nearByPort: 'Panem train system',
        eventMode: 'Online',
        registrationFee: '25.00',
        publish: 'publish'
    }

    try {
        const eventThree = await createEvent(
            huntHike.userId, 
            huntHike.eventName, 
            huntHike.date, 
            huntHike.location, 
            huntHike.category,
            huntHike.description, 
            huntHike.nearByPort, 
            huntHike.eventMode, 
            huntHike.registrationFee,
            huntHike.publish
        );
        if (!eventThree) throw `Seeding Incomplete.`;
    }
    catch(e){
        console.log('Error: ' + e);
        return;
    }

    let peid = await userCollection.findOne({username: userThree.username});
    peid = peid._id.toString();

    const baking = {
        userId: peid,
        eventName: 'Baking Class',
        date: '2024-12-22T15:00',
        location: 'Panem',
        category: 'Other',
        description: 'We are going to make a loaf of bread.',
        nearByPort: 'Panem train system',
        eventMode: 'In-Person',
        registrationFee: '30.00',
        publish: 'publish'
    }

    try {
        const eventFour = await createEvent(
            baking.userId, 
            baking.eventName, 
            baking.date, 
            baking.location, 
            baking.category,
            baking.description, 
            baking.nearByPort, 
            baking.eventMode, 
            baking.registrationFee,
            baking.publish
        );
        if (!eventFour) throw `Seeding Incomplete.`;
    }
    catch(e){
        console.log('Error: ' + e);
        return;
    }

    await closeConnection();

    console.log('Seeding Complete!');
}

main();