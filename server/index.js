const express = require('express');
const http=require('http');
require('dotenv').config();
const cors = require('cors');
const{ Server }=require('socket.io');
const connectDb = require('./configDB/mongoDB');
const {login, signup, getUser} = require('./controllers/userControllers');
const { addPost, fetchPosts, addLike, addComment, sharePost, fetchPostById, deleteAllPosts } = require('./controllers/postControllers');
const authenticateJWT = require('./middlewares/authenticateJWT');



const app = express();
const server=http.createServer(app);

// middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Connect to MongoDB
connectDb();

// deleteAllPosts();

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
app.post('/api/addLike',authenticateJWT, addLike);
app.post('/api/addComment',authenticateJWT, addComment);
app.post('/api/sharePost',authenticateJWT, sharePost);
app.post('/api/fetchPostById',authenticateJWT, fetchPostById);


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

    socket.on('joinRoom', (roomId) => 
    {
         // Join the new room
         socket.join(roomId);

         // Emit a message to the room when a user joins
         io.to(roomId).emit('joinRoom', { message: `Joined room ${roomId}` });
    });

    // Handle new post
    socket.on('newPost', (postData) => 
    {
        io.emit('newPost', postData);
    });

    //Handle new post notification
    socket.on('newPostNotification', (data) => 
    {
        socket.broadcast.emit('newPostNotification', data);
    });

    //Handle post like notification
    socket.on('likePostNotification', (data) => 
    {
        socket.broadcast.to(data.roomId).emit('likePostNotification', data);
    });

    //Handle new comment notification
    socket.on('commentPostNotification', (data) => 
    {
        socket.broadcast.to(data.roomId).emit('commentPostNotification', data);
    });

    //Handle new share notificaion
    socket.on('sharePostNotification', (data) => 
    {
        socket.broadcast.to(data.roomId).emit('sharePostNotification', data);
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
