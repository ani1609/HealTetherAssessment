import {ReactComponent as Close} from '../icons/close.svg';


function Notifications(props) 
{
    


    return (
        <div className="bg-white relative p-8 shadow-md rounded-md w-80 h-96">
            <div className="absolute cursor-pointer p-2" style={{right: "10px", top:"10px"}} onClick={()=>props.setShowNotification(false)}><Close className="w-5 h-5"/></div>
            <h2 className="flex justify-center text-2xl font-bold mb-6">Notifications</h2>
            <div className="mb-4 border-t">
                {props.notifications.map((notification, index) => (
                    <p key={index} className="border-b pt-1 pb-1">{notification}</p>
                ))}
            </div>
        </div>
    );
}


export default Notifications;