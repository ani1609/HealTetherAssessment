import Posts from './Posts';


function Home(props) 
{
    return (
        <div>
            <Posts user={props.user} socket={props.socket} setLoading={props.setLoading}/>
        </div>
    );
}


export default Home;
