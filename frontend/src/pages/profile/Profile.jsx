import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import "../../css/profile.css"

function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        try {
            const response = await api.get("accounts/users/profile/");
            setUser(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    if(!user){
        return(
            <div className="profile-container">
                <h3>Loading Profile... </h3>
            </div>
        )
    }

    return (
        <div className="profile-container">

            <div className="profile-cards">

                <h2>My Profile</h2>
                <div className="profile-header">
                    <img
                        src={user.profile_picture 
                            ? `http://127.0.0.1:8000${user.profile_picture}`
                            : "/default-profile.png"
                        }
                        alt="Profile"
                        className="profile-image"
                        
                    />

                    <h3>{user.full_name}</h3>
                    <p>{user.role}</p>
                </div>

                <div className="profile-buttons">

                    <Link to="../edit-profile">
                        <button>Edit Profile</button>
                    </Link>
                    <Link to="../upload-profile-picture">
                        <button>Upload Photo</button>
                    </Link>
                    <Link to="../change-password">
                        <button>Change Password</button>
                    </Link>

                </div>

                <div className="profile-details">

                    <h4>Account Information</h4>

                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong  >Full Name: </strong>{user.full_name}</p>

                    <p><strong>Email:</strong> {user.email}</p>

                    <p><strong>Phone:</strong> {user.phone}</p>

                    <p><strong>Role:</strong> {user.role}</p>

                    {user.role === "Owner" && (
                        <>
                            <h4>Owner Details</h4>


                            <p><strong>Bio:</strong> {user.owner_profile?.bio}</p>

                            <p><strong>Address:</strong> {user.owner_profile?.address}</p>

                            <p><strong>City:</strong> {user.owner_profile?.city}</p>

                            <p><strong>State:</strong> {user.owner_profile?.state}</p>

                            <p><strong>Pincode:</strong> {user.owner_profile?.pincode}</p>
                        </>
                    )}

                    {user.role === "Renter" && (
                        <>
                            <h4>Renter Details</h4>

                            <p><strong>Occupation:</strong> {user.renter_profile?.occupation}</p>

                            <p><strong>Preferred Location:</strong> {user.renter_profile?.preferred_location}</p>

                            <p><strong>Budget:</strong> ₹{user.renter_profile?.budget}</p>
                        </>
                    )}

                </div>
            </div>

        </div>
    );
}

export default Profile;