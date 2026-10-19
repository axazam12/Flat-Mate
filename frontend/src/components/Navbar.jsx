import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/Dropdown";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/navbar.css";
import api from "../api";
import { HashLink } from "react-router-hash-link";
import NotificationDropdown from "../components/NotificationDropdown";

function NavScrollExample() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, [location]);

  const handleLogout = async () => {
    try {
      await api.post("accounts/users/user_logout/");
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const getProfileImage = () => {
    if (!user?.profile_picture) {
      return null;
    }
    if (user.profile_picture.startsWith("http")) {
      return user.profile_picture;
    }
    return `http://localhost:8000${user.profile_picture}`;
  };
  const profileImage = getProfileImage();
  const profileInitial =
    user?.full_name?.charAt(0)?.toUpperCase() ||
    user?.username?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <Navbar expand="lg" className="navbar" fixed="top" collapseOnSelect>
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          RentFlow
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className="justify-content-between">
          <Nav className="mx-auto align-items-center nav-links">
            <Nav.Link as={NavLink} to="/">
              Home
            </Nav.Link>
            {!user && (
              <>
                <Nav.Link as={HashLink} smooth to="/#about">
                  About
                </Nav.Link>
                <Nav.Link as={HashLink} smooth to="/#features">
                  Features
                </Nav.Link>
                <Nav.Link as={NavLink} to="/properties">
                  Browse Properties
                </Nav.Link>
                <Nav.Link as={HashLink} smooth to="/#services">
                  Services
                </Nav.Link>
                <NavDropdown title="More" id="navbarScrollingDropdown">
                  <NavDropdown.Item as={HashLink} smooth to="/#reviews">
                    Reviews & Ratings
                  </NavDropdown.Item>
                  <NavDropdown.Item as={HashLink} smooth to="/#faq">
                    FAQs
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={HashLink} smooth to="/#policies">
                    Privacy Policy
                  </NavDropdown.Item>
                  <NavDropdown.Item as={HashLink} smooth to="/#policies">
                    Terms & Conditions
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}

            {user && (
              <>
                <Nav.Link as={NavLink} to="/properties">
                  Browse Properties
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to={
                    user.role === "Owner"
                      ? "/owner-dashboard"
                      : "/renter-dashboard"
                  }
                >
                  Dashboard
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav className="align-items-center auth-links">
            {!user ? (
              <>
                <Nav.Link as={NavLink} to="/login" className="login-link">
                  Login
                </Nav.Link>
                <Button as={NavLink} to="/register" className="signup-btn">
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <NotificationDropdown />
                <Dropdown align="end" className="profile-dropdown">
                  <Dropdown.Toggle
                    variant="link"
                    id="profile-dropdown"
                    className="profile-dropdown-toggle"
                  >
                    <div className="profile-avatar">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" />
                      ) : (
                        <span>{profileInitial}</span>
                      )}
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="profile-dropdown-menu">
                    <div className="profile-dropdown-header">
                      <div className="profile-dropdown-avatar">
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" />
                        ) : (
                          <span>{profileInitial}</span>
                        )}
                      </div>

                      <div className="profile-dropdown-info">
                        <strong>{user?.full_name || user?.username}</strong>
                        <span>{user?.email}</span>
                      </div>
                    </div>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      as={NavLink}
                      to={
                        user.role === "Owner"
                          ? "/owner-dashboard/profile"
                          : "/renter-dashboard/profile"
                      }
                      className="profile-link"
                    >
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={handleLogout}
                      className="logout-dropdown-item"
                    >
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
