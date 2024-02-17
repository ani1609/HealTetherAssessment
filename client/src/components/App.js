import { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import '../styles/App.css';
import Home from './Home';

function App() {
    const userToken = localStorage.getItem("realTimeToken");
    const [user, setUser] = useState([]);

    useEffect(() => {
        const fetchUserFromProtectedAPI = async (userToken) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            };
            const response = await axios.get("http://localhost:3001/api/user/authenticateJWT", config);
            setUser(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        };

        if (userToken) {
            console.log("token is ",userToken);
            fetchUserFromProtectedAPI(userToken); // Pass userToken as an argument
        }
    }, [userToken]); // Add userToken as a dependency

    return (
        <div className="App">
        <Home user={user} />
        </div>
    );
}

export default App;
