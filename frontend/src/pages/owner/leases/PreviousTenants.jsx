import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api";
import "../../../css/previoustenants.css";

function PreviousTenants() {

    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchPreviousTenants();
    }, []);

    const fetchPreviousTenants = async () => {

        try {

            const response = await api.get(
                "lease/lease/previous_tenants/"
            );

            setTenants(response.data);

        } catch (error) {

            console.error(
                "Failed to fetch previous tenants:",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    const filteredTenants = tenants.filter(item => {

        const searchValue =
            search.toLowerCase();

        return (
            item.tenant_name
                ?.toLowerCase()
                .includes(searchValue) ||

            item.tenant_email
                ?.toLowerCase()
                .includes(searchValue) ||

            item.property_title
                ?.toLowerCase()
                .includes(searchValue)
        );
    });

    return (

        <div className="previous-tenants-page">

            <div className="page-header">

                <div>
                    <h2>Previous Tenants</h2>

                    <p>
                        View tenants who previously rented
                        your properties.
                    </p>
                </div>

                <Link
                    to="/owner-dashboard/lease"
                    className="secondary-btn"
                >
                    Back to Leases
                </Link>

            </div>

            <div className="previous-tenants-card">

                <div className="history-toolbar">

                    <input
                        type="text"
                        placeholder="Search tenant or property..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

                {loading ? (

                    <div className="empty-history">
                        Loading previous tenants...
                    </div>

                ) : filteredTenants.length === 0 ? (

                    <div className="empty-history">

                        <h3>
                            No Previous Tenants
                        </h3>

                        <p>
                            Completed or terminated leases
                            will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="table-responsive">

                        <table className="previous-tenants-table">

                            <thead>

                                <tr>
                                    <th>Property</th>
                                    <th>Tenant</th>
                                    <th>Email</th>
                                    <th>Lease Type</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Rent</th>
                                    <th>Status</th>
                                    <th>Details</th>
                                </tr>

                            </thead>

                            <tbody>

                                {filteredTenants.map(
                                    tenant => (

                                        <tr key={tenant.id}>

                                            <td>
                                                <strong>
                                                    {tenant.property_title}
                                                </strong>

                                                <span>
                                                    {tenant.property_city},
                                                    {" "}
                                                    {tenant.property_state}
                                                </span>
                                            </td>

                                            <td>
                                                {tenant.tenant_name}
                                            </td>

                                            <td>
                                                {tenant.tenant_email}
                                            </td>

                                            <td>
                                                {tenant.lease_type}
                                            </td>

                                            <td>
                                                {tenant.lease_start}
                                            </td>

                                            <td>
                                                {tenant.lease_end || "-"}
                                            </td>

                                            <td>
                                                ₹{" "}
                                                {Number(
                                                    tenant.monthly_rent
                                                ).toLocaleString()}
                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        tenant.status ===
                                                        "Completed"
                                                            ? "history-status completed"
                                                            : "history-status terminated"
                                                    }
                                                >
                                                    {tenant.status}
                                                </span>

                                            </td>

                                            <td>

                                                <Link
                                                    to={`/owner-dashboard/lease/${tenant.id}`}
                                                    className="history-details-btn"
                                                >
                                                    Details
                                                </Link>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default PreviousTenants;