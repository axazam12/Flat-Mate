import {
    FaBell,
    FaCheckCircle,
    FaMoneyBillWave,
    FaTools,
    FaHome,
    FaCalendarCheck,
    FaStar,
    FaCreditCard,
    FaFileContract,
    FaClipboardCheck,
} from "react-icons/fa";

function NotificationCard({ notification, onRead }) {

    const getIcon = (type) => {
        switch (type) {
            case "Visit":
                return <FaCalendarCheck />;

            case "Application":
                return <FaClipboardCheck />;

            case "Lease":
                return <FaFileContract />;

            case "Lease Extension":
                return <FaHome />;

            case "Rent":
                return <FaMoneyBillWave />;

            case "Payment":
                return <FaCreditCard />;

            case "Maintenance":
                return <FaTools />;

            case "Review":
                return <FaStar />;

            case "General":
                return <FaBell />;

            default:
                return <FaBell />;
        }
    };

    return (
        <div
            className={`notification-card ${
                notification.is_read ? "read" : "unread"
            }`}
        >
            <div className="notification-icon">
                {getIcon(notification.notification_type)}
            </div>

            <div className="notification-content">
                <div className="notification-header">
                    <h4>{notification.title}</h4>

                    <span
                        className={`notification-type ${notification.notification_type
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                    >
                        {notification.notification_type}
                    </span>
                </div>

                <p>{notification.message}</p>

                <small>
                    {new Date(notification.created_at).toLocaleString()}
                </small>
            </div>

            <div className="notification-actions">
                {!notification.is_read ? (
                    <button
                        className="primary-btn"
                        onClick={() => onRead(notification.id)}
                    >
                        Mark Read
                    </button>
                ) : (
                    <span className="read-label">
                        <FaCheckCircle />
                        Read
                    </span>
                )}
            </div>
        </div>
    );
}

export default NotificationCard;