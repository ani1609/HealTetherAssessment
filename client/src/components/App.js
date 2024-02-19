import { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import '../styles/App.css';
import Home from './Home';
import io from 'socket.io-client';
const socket=io.connect("http://localhost:3001");


function App() 
{
    const userToken = localStorage.getItem("realTimeToken");
    const [user, setUser] = useState([]);
    const [roomId, setRoomId] = useState('');


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
            console.log('Received joinRoom message:', message);
        };

        socket.on('joinRoom', handleJoinRoom);

        return () => {
            socket.off('joinRoom', handleJoinRoom);
        };
    }, [socket]);


    return (
        <div className="App">
            <Home user={user} socket={socket}/>
        </div>
    );
}

export default App;
