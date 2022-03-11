const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');


const poll = require('./routes/poll');
const config = require('./config');

// App setup
const app = express();
app.set('port', config.port)

// Database setup
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
})
.then(() => {
    console.log('Database successful')
})
.catch(err => {
    console.log(err);
})

// App Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// App Routes
app.use('/poll', poll);

// Start App Server
app.listen(app.get("port"), (err) => {
    if (err){
        console.log(err)
    }
    console.log('Server is runnning at ', app.get('port'))
})