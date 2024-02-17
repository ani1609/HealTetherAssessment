const express = require('express');
const http=require('http');
require('dotenv').config();
const cors = require('cors');
const connectDb = require('./configDB/mongoDB');
const {login, signup, getUser} = require('./controllers/userControllers');
const { addPost } = require('./controllers/postControllers');
const authenticateJWT = require('./middlewares/authenticateJWT');



const app = express();
const server=http.createServer(app);

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Connect to MongoDB
connectDb();

//Default route
app.get('/', (req, res) => 
{
    res.send('Hello World!');
});

// Use user routes
app.post('/api/users/signup', signup);
app.post('/api/users/login', login);
app.get('/api/user/fetchUser', authenticateJWT, getUser);

//add post
app.post('/api/addPosts',authenticateJWT, addPost);


// Start the server
server.listen(process.env.PORT, () => 
{
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
