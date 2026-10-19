import { useEffect, useState } from "react";
import api from "../../api";
import "../../css/profile.css"
import { useNavigate } from "react-router-dom";

function EditProfile() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        role: "",
        full_name: "",
        bio: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        occupation: "",
        preferred_location: "",
        budget: ""
    });

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        try {

            const response = await api.get("accounts/users/profile/",);
            const user = response.data;
            setFormData({
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role,
                full_name: user.full_name,

                bio: user.owner_profile?.bio || "",
                address: user.owner_profile?.address || "",
                city: user.owner_profile?.city || "",
                state: user.owner_profile?.state || "",
                pincode: user.owner_profile?.pincode || "",

                occupation: user.renter_profile?.occupation || "",
                preferred_location: user.renter_profile?.preferred_location || "",
                budget: user.renter_profile?.budget || "",
                });
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.put(
                "accounts/users/edit_profile/",
                formData);

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            alert("Profile Updated Successfully");
            if (formData.role === "Owner") {
                navigate("/owner-dashboard/profile");
            } else {
                navigate("/renter-dashboard/profile")
            }
        } catch (err) {
            console.log(err);
            alert("Unable to update profile");
        }
    };

    return (
        <div className="edit-profile-container">
            <h2>Edit Profile</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                    />
                </div>
                {formData.role === "Owner" && (
                    <>
                        <div className="form-group">
                            <label>Bio</label>
                            <input
                                type="text"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Pincode Number</label>
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}

                {formData.role === "Renter" && (
                    <>
                        <div className="form-group">
                            <label>Occupation</label>
                            <input
                                type="text"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                            />
                        </div><div className="form-group">
                            <label>Preferred Location</label>
                            <input
                                type="text"
                                name="preferred_location"
                                value={formData.preferred_location}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Budget</label>
                            <input
                                type="number"
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}

                <button type="submit">
                    Update Profile
                </button>

            </form>
        </div>
    );
}

export default EditProfile;