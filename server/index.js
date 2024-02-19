const express = require('express');
const http=require('http');
require('dotenv').config();
const cors = require('cors');
const{ Server }=require('socket.io');
const connectDb = require('./configDB/mongoDB');
const {login, signup, getUser} = require('./controllers/userControllers');
const { addPost, fetchPosts, addComment } = require('./controllers/postControllers');
const authenticateJWT = require('./middlewares/authenticateJWT');



const app = express();
const server=http.createServer(app);

// middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

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


// Serve the static files in the 'uploads' folder
app.use('/uploads', express.static('uploads'));

//add post
app.post('/api/addPosts',authenticateJWT, addPost);
app.get('/api/fetchPosts',authenticateJWT, fetchPosts);
app.post('/api/addComment',authenticateJWT, addComment);


// WebSocket connection handling
const io=new  Server(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on('connection', (socket) => 
{
    console.log('Client connected');

    socket.on('joinRoom', (roomId) => {
        try
        {
            // Join the new room
            socket.join(roomId);

            // Emit a message to the room when a user joins
            io.to(roomId).emit('joinRoom', { message: `Joined room ${roomId}` });
            console.log(`Socket ${socket.id} joined room ${roomId}`);
        }
        catch(error)
        {
            console.log('Error joining room',error);
        }
    });

    // Handle new post
    socket.on('newPost', (postData) => 
    {
        console.log('New post done');
        io.emit('newPost', postData);
    });

    //Handle new post notification
    socket.on('newPostNotification', (postData) => 
    {
        console.log('New post notification done');
        socket.broadcast.emit('newPostNotification', postData);
    });

    //Handle post like notification
    socket.on('likePostNotification', (postData) => 
    {
        const roomId = postData.roomId;
        console.log('Received like for post with roomId:', roomId);
        console.log(postData.likedBy);
        socket.broadcast.to(roomId).emit('likePostNotification', postData);
    });

    //Handle new comment notification
    socket.on('commentPostNotification', (postData) => 
    {
        const roomId = postData.roomId;
        console.log('Received new comment for post with roomId:', roomId);
        socket.broadcast.to(roomId).emit('commentPostNotification', postData);
        console.log(postData);
    });


    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});



// Start the server
server.listen(process.env.PORT, () => 
{
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
