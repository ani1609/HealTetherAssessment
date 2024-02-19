import Navbar from './Navbar';
import Posts from './Posts';


function Home(props) 
{
    return (
        <div>
            <Navbar user={props.user} socket={props.socket}/>
            <Posts user={props.user} socket={props.socket}/>
        </div>
    );
}


export default Home;
