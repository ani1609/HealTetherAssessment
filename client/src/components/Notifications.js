import {ReactComponent as Close} from '../icons/close.svg';
import "../styles/Notifications.css";


function Notifications(props) 
{
    
    const hadleCrossClick = () =>
    {
        props.setNotifications([]);
        props.setShowNotification(false);
    };

    function formatTimestamp(timestamp) 
    {
        const options1 = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };
        const formattedTime = new Date(timestamp).toLocaleString('en-US', options1);

        const options2 = {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
        };
        const formattedData = new Date(timestamp).toLocaleString('en-US', options2);

        return `${formattedTime} ${formattedData}`;
    }

    const hadleNotiClick = (notification) => () =>
    {
        console.log('Notification clicked:', notification);
        // Assuming /notifiedShare/:postId is the route for NotifiedShare
        const notifiedShareLink = `/notifiedShare/${notification.postId}`;

        // Open the link in a new tab
        window.open(notifiedShareLink, '_blank');
    }


    return (
        <div className="noti-container bg-white relative p-6 shadow-md rounded-md h-96">
            <div className="absolute cursor-pointer p-2" style={{right: "10px", top:"10px"}} onClick={hadleCrossClick}>
                <Close className="w-5 h-5"/>
            </div>
            <h2 className="flex justify-center text-2xl font-bold mb-6">
                Notifications
            </h2>
            <ul className="noti-wrapper border-t overflow-auto">
                {props.notifications.length === 0 ? (
                    <li className="text-center text-gray-500 py-2">No notifications</li>
                ) : (
                    props.notifications.map((notification, index) => (
                        <li key={index} className="border-b pt-1 pb-1 flex flex-wrap items-center cursor-pointer" onClick={hadleNotiClick(notification)}>
                            <p className='text-base font-semibold'>{notification.content.split(' ')[0]}&nbsp;</p>
                            <p className='text-base flex flex-wrap'>{notification.content.split(' ').slice(1).join(' ')}&nbsp;</p>
                            <p className='text-xs ml-auto'>{formatTimestamp(notification.timestamp)}</p>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}


export default Notifications;
