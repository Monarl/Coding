import React, { useEffect } from 'react';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';
import './about.css';

const About = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const now = new Date();

    if (!user || !user.token) {
      props.setLoggedIn(false);
      navigate('/');
      return;
    }

    if (now.getTime() > user.expiry) {
      localStorage.removeItem('user');
      props.setLoggedIn(false);
      navigate('/');
      return;
    }
  }, [navigate, props]);

  return (
    <div className="about-page">
      <Navbar loggedIn={props.loggedIn} setLoggedIn={props.setLoggedIn} />
      <header className="about-header">
        <div className="header-content">
          <h1>Welcome to Hospital X</h1>
          <p>Leading the way in healthcare innovation and excellence.</p>
        </div>
      </header>
      <div className="about-content">
        <section className="about-section">
          <div className="about-text">
            <h2>Our Mission</h2>
            <p>
              At <strong>Hospital X</strong>, we are dedicated to providing world-class healthcare
              services while adopting advanced technology to enhance patient outcomes and operational efficiency.
            </p>
          </div>
          <div className="about-image">
            <img src="https://via.placeholder.com/400x300" alt="Healthcare innovation" />
          </div>
        </section>
        <section className="about-section reverse">
          <div className="about-text">
            <h2>Comprehensive Database System</h2>
            <p>
              Our state-of-the-art system manages:
            </p>
            <ul>
              <li>Secure patient records</li>
              <li>Efficient employee management</li>
              <li>Accurate medical inventory tracking</li>
            </ul>
          </div>
          <div className="about-image">
            <img src="https://via.placeholder.com/400x300" alt="Database system" />
          </div>
        </section>
        <section className="about-section">
          <div className="about-text">
            <h2>Meet Our Team</h2>
            <p>
              A group of passionate professionals, including doctors, nurses, IT experts,
              and administrators, working together to revolutionize hospital management.
            </p>
          </div>
          <div className="about-image">
            <img src="https://via.placeholder.com/400x300" alt="Our team" />
          </div>
        </section>
      </div>
      <footer className="about-footer">
        <h3>CONTACT US</h3>
        <p>We are always here to help. If you have any questions, feel free to reach out.</p>
        <div className="contact-info">
          <p>Email: <a href="mailto:info@hospitalx.com">info@hospitalx.com</a></p>
          <p>Phone: +123 456 7890</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
