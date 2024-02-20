import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import '../styles/App.css';
import Navbar from './Navbar';
import Home from './Home';
import io from 'socket.io-client';
import NotifiedShare from './NotifiedShare';
const socket=io.connect("http://localhost:3001");


function App() 
{
    const userToken = localStorage.getItem("realTimeToken");
    const [user, setUser] = useState([]);
    const [roomId, setRoomId] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => 
    {
        const fetchUserFromProtectedAPI = async (userToken) => {
        try 
        {
            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            };
            const response = await axios.get("http://localhost:3001/api/user/fetchUser", config);
            setUser(response.data);
            setRoomId(response.data._id);
            console.log(response.data);
        } 
        catch (error) 
        {
            console.error("Error fetching data:", error);
        }
        };

        if (userToken) {
            fetchUserFromProtectedAPI(userToken); // Pass userToken as an argument
        }
    }, [userToken]);

    useEffect(() =>
    {
        if (roomId && socket.connected)
        {
            socket.emit('joinRoom', roomId);
        }
    }, [socket, roomId]);

    useEffect(() => 
    {
        const handleJoinRoom = (message) => {
            // console.log('Received joinRoom message:', message);
        };

        socket.on('joinRoom', handleJoinRoom);

        return () => {
            socket.off('joinRoom', handleJoinRoom);
        };
    }, [socket]);


    return (
        <div className="App">
            {loading ? (
                <div className="fullscreen-loading">
                    <div className="spinner"></div>
                </div>
            ) : (
                <>
                <BrowserRouter>
                    <Navbar user={user} socket={socket} setLoading={setLoading} />
                    <Routes>
                        <Route path="/" element={<Home user={user} socket={socket} setLoading={setLoading}/>}/>
                        <Route path="/notifiedShare/:postId" element={<NotifiedShare user={user}/>}/>
                    </Routes>
                </BrowserRouter>
                </>
            )}
        </div>
    );
}

export default App;
