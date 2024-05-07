// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Middleware
app.use(express.json());
app.use(cookieParser());

const corsOptions ={
    origin: 'http://localhost:3000',
    credentials:true,
    optionSuccessStatus:200
}
app.use(cors(corsOptions));


// Routes
app.use('/',require('./routes/router'));


// MongoDB connection

const dbOptions = {useNewUrlParser: true, useUnifiedTopology: true,}
mongoose.connect(process.env.DB_URI, dbOptions)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));