
import express from 'express';
//import constructorMethod from "./routes/index.js";
import path from 'path';

const __dirname = path.resolve();

const app = express();

const router = express.Router();

app.use('/public', express.static(path.join(__dirname,'public'))); 
//app.use('/', constructorMethod);

//constructorMethod(app);

app.listen(3000, () => {
 console.log("We've now got a server!");
 console.log('Your routes will be running on http://localhost:3000');
});

router.route('/').get((req, res) => {
    res.render('home', { title: 'Event Management System' });
});