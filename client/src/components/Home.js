import Navbar from './Navbar';
import Posts from './Posts';


function Home(props) 
{
    return (
        <div>
            <Navbar user={props.user} socket={props.socket} setLoading={props.setLoading}/>
            <Posts user={props.user} socket={props.socket} setLoading={props.setLoading}/>
        </div>
    );
}


export default Home;
