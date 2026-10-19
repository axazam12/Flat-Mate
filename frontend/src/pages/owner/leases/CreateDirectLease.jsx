import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import "../../../css/ownerleases.css";

function CreateDirectLease({ onClose, refresh }) {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        tenant_email: "",
        property_id: "",
        lease_start: "",
        lease_end: "",
    });

    const [properties, setProperties] = useState([]);
    const [renters, setRenters] = useState([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {

        setLoading(true);

        try {

            await Promise.all([
                fetchProperties(),
                fetchRenters()
            ]);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    };

    const fetchProperties = async () => {

        try {

            const response = await api.get(
                "properties/properties/owner_properties_list/"
            );

            const availableProperties =
                response.data.filter(
                    property =>
                        property.status === "Available"
                );

            setProperties(availableProperties);

        } catch (error) {

            console.error(
                "Failed to fetch properties:",
                error
            );

            setProperties([]);
        }
    };

    const fetchRenters = async () => {

        try {

            const response = await api.get(
                "lease/lease/available_renters/"
            );

            setRenters(response.data);

        } catch (error) {

            console.error(
                "Failed to fetch renters:",
                error
            );

            setRenters([]);
        }
    };

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.tenant_email) {
            alert("Please select a renter.");
            return;
        }

        if (!formData.property_id) {
            alert("Please select a property.");
            return;
        }

        if (
            formData.lease_start >=
            formData.lease_end
        ) {
            alert(
                "Lease end date must be after lease start date."
            );
            return;
        }

        setSubmitting(true);

        try {

            await api.post(
                "lease/lease/create_direct/",
                formData
            );

            alert(
                "Direct lease created successfully."
            );

            setFormData({
                tenant_email: "",
                property_id: "",
                lease_start: "",
                lease_end: "",
            });

            if (refresh) {
                refresh();
            }

            await fetchProperties();
            await fetchRenters();

            if (onClose) {
                onClose();
            }

        } catch (error) {

            console.error(
                "Direct lease creation error:",
                error
            );

            const message =
                error.response?.data?.error ||
                "Unable to create direct lease.";

            alert(message);

        } finally {

            setSubmitting(false);
        }
    };

    return (
        <div className="owner-page">

            <div className="page-header">

                <div>
                    <h2>Create Direct Lease</h2>

                    <p>
                        Create a lease directly with an eligible renter.
                    </p>
                </div>

                <button
                    className="secondary-btn"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>

            </div>

            <div className="details-card">

                {loading ? (

                    <div className="form-info">
                        Loading eligible renters and properties...
                    </div>

                ) : (

                    <form onSubmit={handleSubmit}>

                        {/* RENTER */}

                        <div className="form-group">

                            <label>
                                Tenant
                            </label>

                            <select
                                name="tenant_email"
                                value={formData.tenant_email}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select eligible renter
                                </option>

                                {renters.map(renter => (

                                    <option
                                        key={renter.id}
                                        value={renter.email}
                                    >
                                        {renter.full_name}
                                        {" "}(
                                        {renter.email}
                                        )
                                    </option>

                                ))}

                            </select>

                            {renters.length === 0 && (

                                <p className="form-info">
                                    No renters are currently
                                    eligible for a direct lease.
                                </p>

                            )}

                        </div>

                        {/* PROPERTY */}

                        <div className="form-group">

                            <label>
                                Property
                            </label>

                            <select
                                name="property_id"
                                value={formData.property_id}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select available property
                                </option>

                                {properties.map(property => (

                                    <option
                                        key={property.id}
                                        value={property.id}
                                    >
                                        {property.title}
                                    </option>

                                ))}

                            </select>

                            {properties.length === 0 && (

                                <p className="form-info">
                                    No available properties.
                                </p>

                            )}

                        </div>

                        {/* START DATE */}

                        <div className="form-group">

                            <label>
                                Lease Start Date
                            </label>

                            <input
                                type="date"
                                name="lease_start"
                                value={formData.lease_start}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        {/* END DATE */}

                        <div className="form-group">

                            <label>
                                Lease End Date
                            </label>

                            <input
                                type="date"
                                name="lease_end"
                                value={formData.lease_end}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        {/* ACTIONS */}

                        <div className="modal-actions">

                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={onClose}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="primary-btn"
                                disabled={
                                    submitting ||
                                    renters.length === 0 ||
                                    properties.length === 0
                                }
                            >
                                {submitting
                                    ? "Creating..."
                                    : "Create Lease"}
                            </button>

                        </div>

                    </form>

                )}

            </div>

        </div>
    );
}

export default CreateDirectLease;