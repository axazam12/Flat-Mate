import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import {
  FaBuilding,
  FaHome,
  FaCalendarCheck,
  FaFileAlt,
  FaCreditCard,
  FaTools,
  FaBell,
  FaArrowRight,
  FaPlus,
  FaUsers,
  FaMoneyBillWave,
  FaChartLine,
  FaCheckCircle,
  FaExclamationCircle,
  FaEye,
  FaClipboardList
} from "react-icons/fa";
import "../../css/ownerdashboard.css";

function OwnerDashboardHome() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    properties: 0,
    availableProperties: 0,
    visits: 0,
    applications: 0,
    tenants: 0,
    maintenance: 0,
    income: 0
  });
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [visits, setVisits] = useState([]);
  const [maintenance, setMaintenance] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const extractList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(Number(amount) || 0);
  };

  const formatDate = (date) => {
    if (!date) return "—";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getStatus = (item) => {
    return (
      item?.status ||
      item?.application_status ||
      item?.visit_status ||
      item?.request_status ||
      "Pending"
    );
  };

  const getPersonName = (item) => {
    return (
      item?.renter_name ||
      item?.tenant_name ||
      item?.user_name ||
      item?.renter?.full_name ||
      item?.tenant?.full_name ||
      item?.user?.full_name ||
      "Renter"
    );
  };

  const getPropertyName = (item) => {
    return (
      item?.property_title ||
      item?.property?.title ||
      item?.property_details?.title ||
      "Property"
    );
  };

  const getActivityIcon = (type) => {
    if (type === "visit") return <FaCalendarCheck />;
    if (type === "application") return <FaFileAlt />;
    if (type === "payment") return <FaMoneyBillWave />;
    return <FaTools />;
  };

  const createRecentActivities = (
    visitsData,
    applicationsData,
    paymentsData,
    maintenanceData
  ) => {
    const activities = [];

    visitsData.slice(0, 3).forEach((item) => {
      activities.push({
        type: "visit",
        title: "New property visit request",
        description: getPropertyName(item),
        date: item.created_at || item.created || item.visit_date
      });
    });

    applicationsData.slice(0, 3).forEach((item) => {
      activities.push({
        type: "application",
        title: "Rental application received",
        description: getPropertyName(item),
        date: item.created_at || item.created
      });
    });

    paymentsData.slice(0, 3).forEach((item) => {
      if (String(item.status || "").toLowerCase() === "paid") {
        activities.push({
          type: "payment",
          title: "Rent payment received",
          description: `${getPropertyName(item)} - ${formatCurrency(
            item.amount || item.rent_amount || item.monthly_rent || 0
          )}`,
          date: item.payment_date || item.created_at || item.created
        });
      }
    });

    maintenanceData.slice(0, 3).forEach((item) => {
      activities.push({
        type: "maintenance",
        title: "Maintenance request",
        description:
          item.title ||
          item.subject ||
          getPropertyName(item) ||
          "Maintenance request",
        date: item.created_at || item.created
      });
    });

    activities.sort(
      (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
    );

    setRecentActivities(activities.slice(0, 6));
  };

  const fetchDashboardData = async () => {
    try {
      const results = await Promise.allSettled([
        api.get("properties/properties/"),
        api.get("visit/visit-request/"),
        api.get("application/rental-application/"),
        api.get("lease/lease/"),
        api.get("maintenance/maintenance/"),
        api.get("payment/rent-payment/"),
        api.get("notifications/notifications/")
      ]);

      const propertiesData =
        results[0].status === "fulfilled"
          ? extractList(results[0].value.data)
          : [];

      const visitsData =
        results[1].status === "fulfilled"
          ? extractList(results[1].value.data)
          : [];

      const applicationsData =
        results[2].status === "fulfilled"
          ? extractList(results[2].value.data)
          : [];

      const leasesData =
        results[3].status === "fulfilled"
          ? extractList(results[3].value.data)
          : [];

      const maintenanceData =
        results[4].status === "fulfilled"
          ? extractList(results[4].value.data)
          : [];

      const paymentsData =
        results[5].status === "fulfilled"
          ? extractList(results[5].value.data)
          : [];

      const notificationData =
        results[6].status === "fulfilled"
          ? extractList(results[6].value.data)
          : [];

      const availableProperties = propertiesData.filter(
        (property) =>
          String(property.status || "").toLowerCase() === "available"
      ).length;

      const pendingVisits = visitsData.filter(
        (visit) =>
          String(
            visit.status || visit.visit_status || ""
          ).toLowerCase() === "pending"
      ).length;

      const pendingApplications = applicationsData.filter(
        (application) =>
          String(
            application.status ||
              application.application_status ||
              ""
          ).toLowerCase() === "pending"
      ).length;

      const activeTenants = leasesData.filter(
        (lease) =>
          String(
            lease.status || lease.lease_status || ""
          ).toLowerCase() === "active"
      ).length;

      const pendingMaintenance = maintenanceData.filter(
        (item) =>
          !["completed", "resolved", "closed"].includes(
            String(
              item.status || item.request_status || ""
            ).toLowerCase()
          )
      ).length;

      const paidPayments = paymentsData.filter(
        (payment) =>
          String(payment.status || "").toLowerCase() === "paid"
      );

      const totalIncome = paidPayments.reduce(
        (total, payment) =>
          total +
          Number(
            payment.amount ||
              payment.rent_amount ||
              payment.monthly_rent ||
              0
          ),
        0
      );

      setStats({
        properties: propertiesData.length,
        availableProperties,
        visits: pendingVisits,
        applications: pendingApplications,
        tenants: activeTenants,
        maintenance: pendingMaintenance,
        income: totalIncome
      });

      setPayments(
        [...paymentsData]
          .sort(
            (a, b) =>
              new Date(
                b.payment_date ||
                  b.created_at ||
                  b.created ||
                  0
              ) -
              new Date(
                a.payment_date ||
                  a.created_at ||
                  a.created ||
                  0
              )
          )
          .slice(0, 5)
      );

      setApplications(
        [...applicationsData]
          .sort(
            (a, b) =>
              new Date(
                b.created_at || b.created || 0
              ) -
              new Date(
                a.created_at || a.created || 0
              )
          )
          .slice(0, 5)
      );

      setVisits(
        [...visitsData]
          .sort(
            (a, b) =>
              new Date(
                b.visit_date ||
                  b.created_at ||
                  b.created ||
                  0
              ) -
              new Date(
                a.visit_date ||
                  a.created_at ||
                  a.created ||
                  0
              )
          )
          .slice(0, 4)
      );

      setMaintenance(
        [...maintenanceData]
          .sort(
            (a, b) =>
              new Date(
                b.created_at || b.created || 0
              ) -
              new Date(
                a.created_at || a.created || 0
              )
          )
          .slice(0, 4)
      );

      setNotifications(
        [...notificationData]
          .sort(
            (a, b) =>
              new Date(
                b.created_at ||
                  b.created ||
                  b.timestamp ||
                  0
              ) -
              new Date(
                a.created_at ||
                  a.created ||
                  a.timestamp ||
                  0
              )
          )
          .slice(0, 5)
      );

      createRecentActivities(
        visitsData,
        applicationsData,
        paymentsData,
        maintenanceData
      );
    } catch (error) {
      console.error("Owner dashboard loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="owner-dashboard-loading">
        <div className="owner-dashboard-loader"></div>
        <p>Loading owner dashboard...</p>
      </div>
    );
  }

  return (
    <div className="owner-home">
      <div className="owner-home-header">
        <div>
          <span className="owner-dashboard-label">
            OWNER DASHBOARD
          </span>
          <h1>Property Overview</h1>
          <p>
            Monitor your properties, tenants, rental applications,
            payments and maintenance activities from one place.
          </p>
        </div>
        <div className="owner-header-actions">
          <Link
            to="/owner-dashboard/add-property"
            className="owner-primary-btn"
          >
            <FaPlus />
            Add Property
          </Link>
          <Link
            to="/owner-dashboard/my-properties"
            className="owner-secondary-btn"
          >
            <FaBuilding />
            My Properties
          </Link>
        </div>
      </div>

      <div className="owner-stat-grid">
        <Link
          to="/owner-dashboard/my-properties"
          className="owner-stat-card"
        >
          <div className="owner-stat-icon property-stat">
            <FaBuilding />
          </div>
          <div>
            <span>Total Properties</span>
            <strong>{stats.properties}</strong>
          </div>
          <FaArrowRight className="owner-stat-arrow" />
        </Link>

        <Link
          to="/owner-dashboard/my-properties"
          className="owner-stat-card"
        >
          <div className="owner-stat-icon available-stat">
            <FaHome />
          </div>
          <div>
            <span>Active Listings</span>
            <strong>{stats.availableProperties}</strong>
          </div>
          <FaArrowRight className="owner-stat-arrow" />
        </Link>

        <Link
          to="/owner-dashboard/visit-request"
          className="owner-stat-card"
        >
          <div className="owner-stat-icon visit-stat">
            <FaCalendarCheck />
          </div>
          <div>
            <span>Pending Visits</span>
            <strong>{stats.visits}</strong>
          </div>
          <FaArrowRight className="owner-stat-arrow" />
        </Link>

        <Link
          to="/owner-dashboard/rental-application"
          className="owner-stat-card"
        >
          <div className="owner-stat-icon application-stat">
            <FaClipboardList />
          </div>
          <div>
            <span>Applications</span>
            <strong>{stats.applications}</strong>
          </div>
          <FaArrowRight className="owner-stat-arrow" />
        </Link>

        <Link
          to="/owner-dashboard/tenants"
          className="owner-stat-card"
        >
          <div className="owner-stat-icon tenant-stat">
            <FaUsers />
          </div>
          <div>
            <span>Current Tenants</span>
            <strong>{stats.tenants}</strong>
          </div>
          <FaArrowRight className="owner-stat-arrow" />
        </Link>

        <Link
          to="/owner-dashboard/maintenance"
          className="owner-stat-card"
        >
          <div className="owner-stat-icon maintenance-stat">
            <FaTools />
          </div>
          <div>
            <span>Maintenance</span>
            <strong>{stats.maintenance}</strong>
          </div>
          <FaArrowRight className="owner-stat-arrow" />
        </Link>
      </div>

      <div className="owner-main-grid">
        <div className="owner-section income-section">
          <div className="owner-section-header">
            <div>
              <span className="owner-section-label">
                FINANCIAL OVERVIEW
              </span>
              <h2>Rental Income</h2>
            </div>
            <Link to="/owner-dashboard/rent-payment">
              Payment Details
              <FaArrowRight />
            </Link>
          </div>

          <div className="income-summary">
            <div>
              <span>Total Collected</span>
              <strong>{formatCurrency(stats.income)}</strong>
            </div>
            <div className="income-growth">
              <FaChartLine />
              <span>Rental Performance</span>
            </div>
          </div>

          <div className="income-chart">
            <div className="chart-y-axis">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>
            <div className="chart-area">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map(
                (month, index) => {
                  const heights = [45, 60, 52, 72, 65, 80, 70, 88];
                  return (
                    <div className="chart-column" key={month}>
                      <div className="chart-bar-wrapper">
                        <div
                          className="chart-bar"
                          style={{
                            height: `${heights[index]}%`
                          }}
                        />
                      </div>
                      <span>{month}</span>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          <p className="chart-note">
            Monthly rental collection overview
          </p>
        </div>

        <div className="owner-section">
          <div className="owner-section-header">
            <div>
              <span className="owner-section-label">
                MANAGEMENT
              </span>
              <h2>Quick Actions</h2>
            </div>
          </div>

          <div className="owner-quick-actions">
            <Link to="/owner-dashboard/add-property">
              <div className="quick-action-icon">
                <FaPlus />
              </div>
              <div>
                <strong>Add Property</strong>
                <span>Create a new listing</span>
              </div>
              <FaArrowRight />
            </Link>

            <Link to="/owner-dashboard/visit-request">
              <div className="quick-action-icon">
                <FaCalendarCheck />
              </div>
              <div>
                <strong>Visit Requests</strong>
                <span>Review property visits</span>
              </div>
              <FaArrowRight />
            </Link>

            <Link to="/owner-dashboard/rental-application">
              <div className="quick-action-icon">
                <FaFileAlt />
              </div>
              <div>
                <strong>Applications</strong>
                <span>Review rental applications</span>
              </div>
              <FaArrowRight />
            </Link>

            <Link to="/owner-dashboard/maintenance">
              <div className="quick-action-icon">
                <FaTools />
              </div>
              <div>
                <strong>Maintenance</strong>
                <span>Manage service requests</span>
              </div>
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>

      <div className="owner-bottom-grid">
        <div className="owner-section">
          <div className="owner-section-header">
            <div>
              <span className="owner-section-label">
                RECENT ACTIVITY
              </span>
              <h2>Latest Updates</h2>
            </div>
          </div>

          {recentActivities.length > 0 ? (
            <div className="owner-activity-list">
              {recentActivities.map((activity, index) => (
                <div
                  className="owner-activity-item"
                  key={`${activity.type}-${index}`}
                >
                  <div className={`activity-icon ${activity.type}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-info">
                    <h3>{activity.title}</h3>
                    <p>{activity.description}</p>
                  </div>
                  <span className="activity-date">
                    {formatDate(activity.date)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="owner-empty-state">
              <FaChartLine />
              <h3>No recent activity</h3>
              <p>New rental activities will appear here.</p>
            </div>
          )}
        </div>

        <div className="owner-section">
          <div className="owner-section-header">
            <div>
              <span className="owner-section-label">
                UPDATES
              </span>
              <h2>Notifications</h2>
            </div>
            <Link to="/owner-dashboard/notifications">
              View All
              <FaArrowRight />
            </Link>
          </div>

          {notifications.length > 0 ? (
            <div className="owner-notification-list">
              {notifications.map((notification, index) => (
                <div
                  className="owner-notification-item"
                  key={notification.id || index}
                >
                  <div className="owner-notification-icon">
                    <FaBell />
                  </div>
                  <div>
                    <h3>
                      {notification.title ||
                        notification.heading ||
                        "Notification"}
                    </h3>
                    <p>
                      {notification.message ||
                        notification.description ||
                        "You have a new update."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="owner-empty-state">
              <FaBell />
              <h3>No new notifications</h3>
              <p>You're all caught up.</p>
            </div>
          )}
        </div>
      </div>

      <div className="owner-three-column">
        <div className="owner-section">
          <div className="owner-section-header">
            <div>
              <span className="owner-section-label">
                RENTAL PROCESS
              </span>
              <h2>Applications</h2>
            </div>
            <Link to="/owner-dashboard/rental-application">
              View All
              <FaArrowRight />
            </Link>
          </div>

          {applications.length > 0 ? (
            <div className="owner-mini-list">
              {applications.slice(0, 4).map((application, index) => (
                <div
                  className="owner-mini-item"
                  key={application.id || index}
                >
                  <div className="mini-icon">
                    <FaFileAlt />
                  </div>
                  <div className="mini-content">
                    <strong>{getPersonName(application)}</strong>
                    <span>{getPropertyName(application)}</span>
                  </div>
                  <span className="mini-status">
                    {getStatus(application)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="small-empty">
              <FaFileAlt />
              <p>No rental applications</p>
            </div>
          )}
        </div>

        <div className="owner-section">
          <div className="owner-section-header">
            <div>
              <span className="owner-section-label">
                SCHEDULE
              </span>
              <h2>Property Visits</h2>
            </div>
            <Link to="/owner-dashboard/visit-request">
              View All
              <FaArrowRight />
            </Link>
          </div>

          {visits.length > 0 ? (
            <div className="owner-mini-list">
              {visits.map((visit, index) => (
                <div
                  className="owner-mini-item"
                  key={visit.id || index}
                >
                  <div className="mini-icon visit-mini">
                    <FaCalendarCheck />
                  </div>
                  <div className="mini-content">
                    <strong>{getPropertyName(visit)}</strong>
                    <span>
                      {formatDate(
                        visit.visit_date ||
                          visit.created_at ||
                          visit.created
                      )}
                    </span>
                  </div>
                  <FaEye className="mini-arrow" />
                </div>
              ))}
            </div>
          ) : (
            <div className="small-empty">
              <FaCalendarCheck />
              <p>No upcoming visits</p>
            </div>
          )}
        </div>

        <div className="owner-section">
          <div className="owner-section-header">
            <div>
              <span className="owner-section-label">
                PROPERTY CARE
              </span>
              <h2>Maintenance</h2>
            </div>
            <Link to="/owner-dashboard/maintenance">
              Manage
              <FaArrowRight />
            </Link>
          </div>

          {maintenance.length > 0 ? (
            <div className="owner-mini-list">
              {maintenance.map((item, index) => (
                <div
                  className="owner-mini-item"
                  key={item.id || index}
                >
                  <div className="mini-icon maintenance-mini">
                    <FaTools />
                  </div>
                  <div className="mini-content">
                    <strong>
                      {item.title ||
                        item.subject ||
                        "Maintenance Request"}
                    </strong>
                    <span>{getPropertyName(item)}</span>
                  </div>
                  <span className="maintenance-status">
                    {getStatus(item)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="small-empty">
              <FaCheckCircle />
              <p>No pending maintenance</p>
            </div>
          )}
        </div>
      </div>

      <div className="owner-section payment-overview">
        <div className="owner-section-header">
          <div>
            <span className="owner-section-label">
              PAYMENT ACTIVITY
            </span>
            <h2>Recent Rent Payments</h2>
          </div>
          <Link to="/owner-dashboard/rent-payment">
            Payment History
            <FaArrowRight />
          </Link>
        </div>

        {payments.length > 0 ? (
          <div className="owner-payment-table">
            <div className="payment-table-header">
              <span>Property</span>
              <span>Amount</span>
              <span>Date</span>
              <span>Status</span>
            </div>

            {payments.map((payment, index) => (
              <div
                className="payment-table-row"
                key={payment.id || index}
              >
                <strong>{getPropertyName(payment)}</strong>
                <span>
                  {formatCurrency(
                    payment.amount ||
                      payment.rent_amount ||
                      payment.monthly_rent ||
                      0
                  )}
                </span>
                <span>
                  {formatDate(
                    payment.payment_date ||
                      payment.created_at ||
                      payment.created
                  )}
                </span>
                <span className="paid-status">
                  <FaCheckCircle />
                  {payment.status || "Paid"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="owner-empty-state">
            <FaCreditCard />
            <h3>No payment records</h3>
            <p>Recent rent payments will appear here.</p>
          </div>
        )}
      </div>

      <div className="owner-info-banner">
        <div className="owner-info-icon">
          <FaExclamationCircle />
        </div>
        <div>
          <h3>Keep your rental properties organized</h3>
          <p>
            Review applications, respond to visit requests, monitor
            payments and resolve maintenance issues from your
            dashboard.
          </p>
        </div>
        <Link to="/owner-dashboard/my-properties">
          Manage Properties
          <FaArrowRight />
        </Link>
      </div>
    </div>
  );
}

export default OwnerDashboardHome;