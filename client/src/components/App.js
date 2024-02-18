import { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import '../styles/App.css';
import Home from './Home';
import io from 'socket.io-client';


function App() {
    const userToken = localStorage.getItem("realTimeToken");
    const [user, setUser] = useState([]);
    const socket=io.connect("http://localhost:3001");


    useEffect(() => {
        const fetchUserFromProtectedAPI = async (userToken) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            };
            const response = await axios.get("http://localhost:3001/api/user/fetchUser", config);
            setUser(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        };

        if (userToken) {
            fetchUserFromProtectedAPI(userToken); // Pass userToken as an argument
        }
    }, [userToken]); // Add userToken as a dependency

    return (
        <div className="App">
            <Home user={user} socket={socket}/>
        </div>
    );
}

export default App;
