
import express from 'express';
import { create } from 'express-handlebars';
import path from 'path';
import eventRouter from './routes/events.js';
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
