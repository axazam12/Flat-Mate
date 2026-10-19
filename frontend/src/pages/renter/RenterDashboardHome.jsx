import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import {
    FaHeart,
    FaCalendarCheck,
    FaHome,
    FaCreditCard,
    FaSearch,
    FaFileAlt,
    FaTools,
    FaBell,
    FaArrowRight,
    FaBuilding,
    FaClock,
    FaCheckCircle,
    FaExclamationCircle,
    FaEnvelope
} from "react-icons/fa";
import "../../css/renterdashboard.css";

function RenterDashboardHome() {
    const [stats, setStats] = useState({
        favorites: 0,
        visits: 0,
        applications: 0,
        pendingPayments: 0
    });

    const [lease, setLease] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const results = await Promise.allSettled([
                api.get("renter/favorites/"),
                api.get("visit/visit-request/"),
                api.get("application/rental-application/"),
                api.get("payment/rent-payment/current/"),
                api.get("lease/lease/current/"),
                api.get("notifications/notifications/")
            ]);

            const favorites = results[0];
            const visits = results[1];
            const applications = results[2];
            const payments = results[3];
            const currentLease = results[4];
            const notificationResult = results[5];

            setStats({
                favorites:
                    favorites.status === "fulfilled"
                        ? getCount(favorites.value.data)
                        : 0,
                visits:
                    visits.status === "fulfilled"
                        ? getCount(visits.value.data)
                        : 0,
                applications:
                    applications.status === "fulfilled"
                        ? getCount(applications.value.data)
                        : 0,
                pendingPayments:
                    payments.status === "fulfilled"
                        ? getPendingPaymentAmount(payments.value.data)
                        : 0
            });

            if (currentLease.status === "fulfilled") {
                const leaseData = extractLease(currentLease.value.data);
                setLease(leaseData);
            }

            if (notificationResult.status === "fulfilled") {
                const notificationData = extractList(
                    notificationResult.value.data
                );

                const sortedNotifications = [...notificationData]
                    .sort((a, b) => {
                        const dateA = new Date(
                            a.created_at ||
                            a.created ||
                            a.timestamp ||
                            0
                        );

                        const dateB = new Date(
                            b.created_at ||
                            b.created ||
                            b.timestamp ||
                            0
                        );

                        return dateB - dateA;
                    })
                    .slice(0, 5);

                setNotifications(sortedNotifications);
            } else {
                console.error(
                    "Notifications API error:",
                    notificationResult.reason
                );
                setNotifications([]);
            }
        } catch (error) {
            console.error("Dashboard loading error:", error);
        } finally {
            setLoading(false);
        }
    };

    const extractList = (data) => {
        if (Array.isArray(data)) {
            return data;
        }

        if (Array.isArray(data?.results)) {
            return data.results;
        }

        if (Array.isArray(data?.data)) {
            return data.data;
        }

        if (Array.isArray(data?.notifications)) {
            return data.notifications;
        }

        return [];
    };

    const getCount = (data) => {
        if (!data) return 0;

        if (Array.isArray(data)) {
            return data.length;
        }

        if (Array.isArray(data.results)) {
            return data.results.length;
        }

        if (Array.isArray(data.data)) {
            return data.data.length;
        }

        if (typeof data.count === "number") {
            return data.count;
        }

        return 0;
    };

    const getPendingPaymentAmount = (data) => {
        if (!data) return 0;

        const payments = extractList(data);

        if (payments.length > 0) {
            return payments.reduce((total, payment) => {
                const status = String(
                    payment.status || ""
                ).toLowerCase();

                if (status === "pending") {
                    return (
                        total +
                        Number(
                            payment.amount ||
                            payment.rent_amount ||
                            payment.monthly_rent ||
                            0
                        )
                    );
                }

                return total;
            }, 0);
        }

        const status = String(data.status || "").toLowerCase();

        if (status === "pending") {
            return Number(
                data.amount ||
                data.rent_amount ||
                data.monthly_rent ||
                0
            );
        }

        return Number(data.pending_amount || 0);
    };

    const extractLease = (data) => {
        if (!data) return null;

        let leaseData = data;

        if (data.lease) {
            leaseData = data.lease;
        }

        if (data.current_lease) {
            leaseData = data.current_lease;
        }

        if (data.data?.lease) {
            leaseData = data.data.lease;
        }

        if (
            !leaseData ||
            typeof leaseData !== "object" ||
            Array.isArray(leaseData)
        ) {
            return null;
        }

        const property =
            leaseData.property ||
            data.property ||
            {};

        const application =
            leaseData.application ||
            data.application ||
            {};

        const propertyTitle =
            leaseData.property_title ||
            property.title ||
            application.property_title ||
            application.property?.title ||
            "";

        const propertyCity =
            leaseData.property_city ||
            property.city ||
            application.property_city ||
            application.property?.city ||
            "";

        const monthlyRent =
            leaseData.monthly_rent ??
            leaseData.rent ??
            leaseData.rent_amount ??
            property.monthly_rent ??
            application.monthly_rent ??
            application.rent ??
            application.property?.monthly_rent ??
            null;

        const startDate =
            leaseData.start_date ||
            leaseData.lease_start ||
            leaseData.start ||
            leaseData.begin_date ||
            leaseData.from_date ||
            application.start_date ||
            "";

        const endDate =
            leaseData.end_date ||
            leaseData.lease_end ||
            leaseData.end ||
            leaseData.expiry_date ||
            leaseData.to_date ||
            application.end_date ||
            "";

        const status =
            leaseData.status ||
            leaseData.lease_status ||
            "Active";

        const hasUsefulData =
            propertyTitle ||
            propertyCity ||
            monthlyRent !== null ||
            startDate ||
            endDate;

        if (!hasUsefulData) {
            return null;
        }

        return {
            ...leaseData,
            property_title: propertyTitle,
            property_city: propertyCity,
            monthly_rent: monthlyRent,
            start_date: startDate,
            end_date: endDate,
            status
        };
    };

    const formatCurrency = (amount) => {
        if (
            amount === null ||
            amount === undefined ||
            amount === ""
        ) {
            return "—";
        }

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(Number(amount) || 0);
    };

    const formatDate = (date) => {
        if (!date) return "—";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const getNotificationTitle = (notification) => {
        return (
            notification.title ||
            notification.heading ||
            notification.subject ||
            "Notification"
        );
    };

    const getNotificationMessage = (notification) => {
        return (
            notification.message ||
            notification.description ||
            notification.content ||
            "You have a new update."
        );
    };

    const getNotificationDate = (notification) => {
        const date =
            notification.created_at ||
            notification.created ||
            notification.timestamp;

        if (!date) return "";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short"
        });
    };

    const isUnread = (notification) => {
        return (
            notification.is_read === false ||
            notification.read === false ||
            notification.status === "Unread"
        );
    };

    if (loading) {
        return (
            <div className="renter-dashboard-loading">
                <div className="dashboard-loader"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="renter-home">
            <div className="renter-home-header">
                <div>
                    <span className="dashboard-label">
                        RENTER DASHBOARD
                    </span>

                    <h1>Welcome back!</h1>

                    <p>
                        Manage your properties, visits, applications,
                        payments and rental activities from one place.
                    </p>
                </div>

                <Link
                    to="/renter-dashboard/properties"
                    className="browse-property-btn"
                >
                    <FaSearch />
                    Browse Properties
                </Link>
            </div>

            <div className="dashboard-stats">
                <Link
                    to="/renter-dashboard/favorites"
                    className="stat-card"
                >
                    <div className="stat-icon favorite-icon">
                        <FaHeart />
                    </div>

                    <div className="stat-content">
                        <span>Saved Properties</span>
                        <strong>{stats.favorites}</strong>
                    </div>

                    <FaArrowRight className="stat-arrow" />
                </Link>

                <Link
                    to="/renter-dashboard/visit-request"
                    className="stat-card"
                >
                    <div className="stat-icon visit-icon">
                        <FaCalendarCheck />
                    </div>

                    <div className="stat-content">
                        <span>Visit Requests</span>
                        <strong>{stats.visits}</strong>
                    </div>

                    <FaArrowRight className="stat-arrow" />
                </Link>

                <Link
                    to="/renter-dashboard/my-application"
                    className="stat-card"
                >
                    <div className="stat-icon application-icon">
                        <FaFileAlt />
                    </div>

                    <div className="stat-content">
                        <span>Applications</span>
                        <strong>{stats.applications}</strong>
                    </div>

                    <FaArrowRight className="stat-arrow" />
                </Link>

                <Link
                    to="/renter-dashboard/rent-payment"
                    className="stat-card"
                >
                    <div className="stat-icon payment-icon">
                        <FaCreditCard />
                    </div>

                    <div className="stat-content">
                        <span>Pending Payment</span>

                        <strong>
                            {formatCurrency(stats.pendingPayments)}
                        </strong>
                    </div>

                    <FaArrowRight className="stat-arrow" />
                </Link>
            </div>

            <div className="dashboard-main-grid">
                <div className="dashboard-section lease-section">
                    <div className="section-header">
                        <div>
                            <span className="section-label">
                                RENTAL INFORMATION
                            </span>

                            <h2>Current Lease</h2>
                        </div>

                        <Link to="/renter-dashboard/lease">
                            View Details
                            <FaArrowRight />
                        </Link>
                    </div>

                    {lease ? (
                        <div className="lease-content">
                            <div className="lease-property-icon">
                                <FaBuilding />
                            </div>

                            <div className="lease-property-info">
                                <h3>
                                    {lease.property_title ||
                                        "Rental Property"}
                                </h3>

                                <p>
                                    {lease.property_city ||
                                        "Property location"}
                                </p>

                                <div className="lease-details">
                                    <div>
                                        <span>Monthly Rent</span>

                                        <strong>
                                            {formatCurrency(
                                                lease.monthly_rent
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Start Date</span>

                                        <strong>
                                            {formatDate(
                                                lease.start_date
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>End Date</span>

                                        <strong>
                                            {formatDate(
                                                lease.end_date
                                            )}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`lease-status ${
                                    String(
                                        lease.status
                                    ).toLowerCase() !== "active"
                                        ? "lease-status-other"
                                        : ""
                                }`}
                            >
                                <FaCheckCircle />

                                <span>
                                    {lease.status}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-lease">
                            <div className="empty-icon">
                                <FaHome />
                            </div>

                            <div>
                                <h3>No active lease</h3>

                                <p>
                                    You don't currently have an
                                    active rental lease.
                                </p>
                            </div>

                            <Link
                                to="/renter-dashboard/properties"
                                className="section-action"
                            >
                                Find a Property
                                <FaArrowRight />
                            </Link>
                        </div>
                    )}
                </div>

                <div className="dashboard-section quick-actions-section">
                    <div className="section-header">
                        <div>
                            <span className="section-label">
                                QUICK ACCESS
                            </span>

                            <h2>Quick Actions</h2>
                        </div>
                    </div>

                    <div className="quick-actions">
                        <Link to="/renter-dashboard/properties">
                            <div className="quick-icon">
                                <FaSearch />
                            </div>

                            <div>
                                <strong>Browse Properties</strong>
                                <span>Find your next home</span>
                            </div>

                            <FaArrowRight />
                        </Link>

                        <Link to="/renter-dashboard/visit-request">
                            <div className="quick-icon">
                                <FaCalendarCheck />
                            </div>

                            <div>
                                <strong>Visit Requests</strong>
                                <span>Manage property visits</span>
                            </div>

                            <FaArrowRight />
                        </Link>

                        <Link to="/renter-dashboard/my-application">
                            <div className="quick-icon">
                                <FaFileAlt />
                            </div>

                            <div>
                                <strong>My Applications</strong>
                                <span>Track applications</span>
                            </div>

                            <FaArrowRight />
                        </Link>

                        <Link to="/renter-dashboard/maintenance">
                            <div className="quick-icon">
                                <FaTools />
                            </div>

                            <div>
                                <strong>Maintenance</strong>
                                <span>Report a service issue</span>
                            </div>

                            <FaArrowRight />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="dashboard-bottom-grid">
                <div className="dashboard-section">
                    <div className="section-header">
                        <div>
                            <span className="section-label">
                                RENTAL MANAGEMENT
                            </span>

                            <h2>Manage Your Rental</h2>
                        </div>
                    </div>

                    <div className="management-grid">
                        <Link to="/renter-dashboard/rent-payment">
                            <FaCreditCard />
                            <span>Rent Payment</span>
                            <small>
                                Pay your monthly rent
                            </small>
                        </Link>

                        <Link to="/renter-dashboard/payment-history">
                            <FaClock />
                            <span>Payment History</span>
                            <small>
                                View previous payments
                            </small>
                        </Link>

                        <Link to="/renter-dashboard/lease-extension">
                            <FaFileAlt />
                            <span>Lease Extension</span>
                            <small>
                                Manage lease extension
                            </small>
                        </Link>

                        <Link to="/renter-dashboard/maintenance">
                            <FaTools />
                            <span>Maintenance</span>
                            <small>
                                Manage service requests
                            </small>
                        </Link>
                    </div>
                </div>

                <div className="dashboard-section notifications-section">
                    <div className="section-header">
                        <div>
                            <span className="section-label">
                                RECENT UPDATES
                            </span>

                            <h2>Recent Notifications</h2>
                        </div>

                        <Link to="/renter-dashboard/notifications">
                            View All
                            <FaArrowRight />
                        </Link>
                    </div>

                    {notifications.length > 0 ? (
                        <div className="recent-notifications">
                            {notifications.map(
                                (notification, index) => (
                                    <div
                                        className={`notification-item ${
                                            isUnread(notification)
                                                ? "notification-unread"
                                                : ""
                                        }`}
                                        key={
                                            notification.id ||
                                            notification._id ||
                                            index
                                        }
                                    >
                                        <div className="notification-icon">
                                            {isUnread(
                                                notification
                                            ) ? (
                                                <FaEnvelope />
                                            ) : (
                                                <FaBell />
                                            )}
                                        </div>

                                        <div className="notification-content">
                                            <div className="notification-title-row">
                                                <h3>
                                                    {getNotificationTitle(
                                                        notification
                                                    )}
                                                </h3>

                                                {getNotificationDate(
                                                    notification
                                                ) && (
                                                    <span>
                                                        {getNotificationDate(
                                                            notification
                                                        )}
                                                    </span>
                                                )}
                                            </div>

                                            <p>
                                                {getNotificationMessage(
                                                    notification
                                                )}
                                            </p>
                                        </div>

                                        {isUnread(
                                            notification
                                        ) && (
                                            <span className="unread-dot"></span>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <div className="no-notifications">
                            <div className="no-notification-icon">
                                <FaBell />
                            </div>

                            <h3>No recent notifications</h3>

                            <p>
                                You're all caught up. New updates
                                will appear here.
                            </p>
                        </div>
                    )}

                    <Link
                        to="/renter-dashboard/notifications"
                        className="notification-button"
                    >
                        Open Notifications
                        <FaArrowRight />
                    </Link>
                </div>
            </div>

            <div className="dashboard-section activity-section">
                <div className="section-header">
                    <div>
                        <span className="section-label">
                            RENTAL ACTIVITY
                        </span>

                        <h2>Things You Can Manage</h2>
                    </div>
                </div>

                <div className="activity-grid">
                    <Link to="/renter-dashboard/favorites">
                        <FaHeart />

                        <div>
                            <strong>Saved Properties</strong>

                            <span>
                                Properties you are interested in
                            </span>
                        </div>

                        <FaArrowRight />
                    </Link>

                    <Link to="/renter-dashboard/visit-request">
                        <FaCalendarCheck />

                        <div>
                            <strong>Property Visits</strong>

                            <span>
                                View and manage your visit requests
                            </span>
                        </div>

                        <FaArrowRight />
                    </Link>

                    <Link to="/renter-dashboard/my-application">
                        <FaFileAlt />

                        <div>
                            <strong>Rental Applications</strong>

                            <span>
                                Track your application status
                            </span>
                        </div>

                        <FaArrowRight />
                    </Link>

                    <Link to="/renter-dashboard/maintenance">
                        <FaTools />

                        <div>
                            <strong>Maintenance Requests</strong>

                            <span>
                                Report and track service issues
                            </span>
                        </div>

                        <FaArrowRight />
                    </Link>
                </div>
            </div>

            <div className="dashboard-info-banner">
                <div className="info-banner-icon">
                    <FaExclamationCircle />
                </div>

                <div>
                    <h3>Need something?</h3>

                    <p>
                        Browse available properties, check your
                        applications, make a payment or submit a
                        maintenance request directly from your dashboard.
                    </p>
                </div>

                <Link to="/renter-dashboard/properties">
                    Explore Properties
                    <FaArrowRight />
                </Link>
            </div>
        </div>
    );
}

export default RenterDashboardHome;