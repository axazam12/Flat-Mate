import { useEffect, useState } from "react";
import api from "../api";
import "../css/notification.css"
import NotificationCard from "../components/NotificationCard";

function Notifications(){
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetchNotifications()
    },[])

    const fetchNotifications = async() => {
        try{
            const response = await api.get("notifications/notifications/");
            setNotifications(response.data)
        }catch(error){
            console.log(error)
        }finally {
            setLoading(false);
        }
    }

    const markAsRead = async  (id) => {
        try{
            await api.patch(`notifications/notifications/${id}/mark_read/`)
            setNotifications((prev) =>
                prev.map((notification) => 
                    notification.id === id
                       ? {...notification, is_read: true}
                       : notification
                )
            )
        }catch(error){
            console.log(error)
        }
    }

    const markAllRead = async () => {
        try{
            await api.patch("notifications/notifications/mark_all_read/")
            setNotifications((prev) => prev.map((notification) =>({
                ...notification,
                is_read: true,
            })))
        }catch(error){
            console.log(error)
        }
    }

    const unreadCount = notifications.filter(
        (notification) => !notification.is_read
    ).length

    return(
        <div className="notification-page">
            <div className="page-header">
                <div>
                    <h2>Notifications</h2>
                    <p>
                        Stay updated with visits, applications, leases,
                        maintenance, rent payments and other activities.
                    </p>
                </div>

                {unreadCount > 0 && (
                    <button className="primary-btn" onClick={markAllRead}>
                        Mark All Read ({unreadCount})
                    </button>
                )}
            </div>

            {loading ? (
                <div className="notification-message">
                    Loading notifications....
                </div>
            ): notifications.length === 0 ? (
                <div className="notification-message">
                    No Notifications available
                </div>
            ):(
                <div className="notification-list">
                    {notifications.map((notification) => (
                     <NotificationCard key={notification.id} notification={notification} onRead={markAsRead}/>
                    ))}
                </div>
            )}
        </div>
    )
}
export  default Notifications;