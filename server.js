const express = require('express'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      passport = require('passport'),
      path = require('path');

const users = require('./routes/api/users'),
      profile = require('./routes/api/profile'),
      tweets = require('./routes/api/tweets');

const app = express();

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
const db = require('./config/keys').mongoURI;

// Connect to mongodb
mongoose.connect(db)
        .then(() => console.log('MongoDB Connected'))
        .catch(e => console.log(e));

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// Use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/tweets', tweets);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));