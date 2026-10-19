import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "../css/notification.css";

function NotificationDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        if(user?.id || user?.email){
        fetchNotifications();}
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await api.get("notifications/notifications/");
            console.log(response.data)
            setNotifications(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.patch(`notifications/notifications/${id}/mark_read/`);

            setNotifications((prev) =>
                prev.map((notification) =>
                    notification.id === id
                        ? { ...notification, is_read: true }
                        : notification
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    const unreadCount = notifications.filter(
        (notification) => !notification.is_read
    ).length;

    const recentNotifications = notifications.slice(0, 5);

    return (
        <div className="notification-dropdown">
            <button
                className="notification-toggle"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                🔔

                {unreadCount > 0 && (
                    <span className="notification-count">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="notification-dropdown-menu">

                    <div className="notification-dropdown-header">
                        <h4>Notifications</h4>
                    </div>

                    {recentNotifications.length === 0 ? (
                        <p className="notification-dropdown-empty">
                            No notifications
                        </p>
                    ) : (
                        recentNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`notification-dropdown-item ${
                                    notification.is_read
                                        ? "read"
                                        : "unread"
                                }`}
                            >
                                <div>
                                    <strong>
                                        {notification.title}
                                    </strong>

                                    <p>{notification.message}</p>

                                    <small>
                                        {new Date(
                                            notification.created_at
                                        ).toLocaleString()}
                                    </small>
                                </div>

                                {!notification.is_read && (
                                    <button
                                        className="read-btn"
                                        onClick={() =>
                                            markAsRead(notification.id)
                                        }
                                    >
                                        ✓
                                    </button>
                                )}
                            </div>
                        ))
                    )}

                    <div className="notification-dropdown-footer">
                        <Link
                            to={
                                user.role === "Owner"
                                 ? "/owner-dashboard/notifications"
                                 : "/renter-dashboard/notifications"
                            }
                            onClick={()=>setShowDropdown(false)}
                        >
                            View All Notifications
                        </Link>
                    </div>

                </div>
            )}
        </div>
    );
}

export default NotificationDropdown;