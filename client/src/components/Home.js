import { useState, useRef } from 'react';
import Navbar from './Navbar';
import Posts from './Posts';


function Home() 
{
    return (
        <div>
            <Navbar/>
            <Posts/>
        </div>
    );
}


export default Home;
