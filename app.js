
import express from 'express';
import { create } from 'express-handlebars';
import path from 'path';
import eventRouter from './routes/eventRegistration.js';
import * as events from "./data/events.js";

const app = express();
const hbs = create({ defaultLayout: 'main' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use('/public', express.static(path.resolve('public')));

app.use('/', eventRouter);


app.listen(3000, () => {
 console.log("We've now got a server!");
 console.log('Your routes will be running on http://localhost:3000');
});

// async function main()
//  {
//     try {
//         console.log("Create")
//         const pinkFloyd = await events.createEvent("Sriya", "Birthday", "05/02/2025", "Edison", "Birthday", "Fun Party","Uber",
//             "Fun", "10.00", "Sriya")
//             console.log(pinkFloyd);
//     }
//     catch(e) {
//         console.log("Incorrect input:" + e);
//     } 

//  }

//  main();
