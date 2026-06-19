import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ArrowRight, CheckCircle, BookOpen, Bell, MessageCircle, Calendar, Shield, Zap, FileText, Users, Upload, Download } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="logo">Linkbridge</div>
          <div className="nav-links">
            <button onClick={() => navigate('/admin/login')} className="btn-text admin-login">
              Admin Login
            </button>
            <button onClick={() => navigate('/login')} className="btn-text">Login</button>
            <button onClick={() => navigate('/register')} className="btn-primary">Get Started</button>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-line">Educational Communication</span>
            <span className="title-line">Made Seamless</span>
          </h1>
          <p className="hero-subtitle">
            A professional platform for universities to manage assignments, announcements, 
            materials, and real-time communication all in one place.
          </p>
          <div className="hero-actions">
            <button onClick={() => navigate('/register')} className="btn-large btn-primary">
              Get Started <ArrowRight size={20} />
            </button>
            <button onClick={() => navigate('/login')} className="btn-large btn-secondary">
              Sign In
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <FileText className="card-icon" size={32} />
            <div className="card-text">Assignments</div>
          </div>
          <div className="floating-card card-2">
            <Bell className="card-icon" size={32} />
            <div className="card-text">Announcements</div>
          </div>
          <div className="floating-card card-3">
            <MessageCircle className="card-icon" size={32} />
            <div className="card-text">Real-time Chat</div>
          </div>
          <div className="floating-card card-4">
            <Calendar className="card-icon" size={32} />
            <div className="card-text">Events</div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="features-container">
          <h2 className="section-title">Everything You Need</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FileText className="feature-icon" size={40} />
              <h3>Assignments</h3>
              <p>Submit and track assignments with ease. Get instant feedback from instructors.</p>
            </div>
            <div className="feature-card">
              <Bell className="feature-icon" size={40} />
              <h3>Announcements</h3>
              <p>Stay updated with important notices and announcements from your department.</p>
            </div>
            <div className="feature-card">
              <BookOpen className="feature-icon" size={40} />
              <h3>Study Materials</h3>
              <p>Access notes, slides, and reference materials organized by subject.</p>
            </div>
            <div className="feature-card">
              <MessageCircle className="feature-icon" size={40} />
              <h3>Real-time Chat</h3>
              <p>Communicate instantly with peers and instructors in dedicated channels.</p>
            </div>
            <div className="feature-card">
              <Calendar className="feature-icon" size={40} />
              <h3>Events Calendar</h3>
              <p>Never miss important events, seminars, and academic activities.</p>
            </div>
            <div className="feature-card">
              <Shield className="feature-icon" size={40} />
              <h3>Secure & Private</h3>
              <p>Your data is protected with industry-standard security measures.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-container">
          <h2 className="section-title">About Linkbridge</h2>
          <div className="about-content">
            <div className="about-text">
              <p>
                Linkbridge is a comprehensive educational communication platform designed as a 
                final year project to streamline academic interactions. Built with modern web 
                technologies, it provides a centralized hub for students and administrators to 
                manage coursework, share resources, and communicate effectively.
              </p>
              <p>
                Our platform eliminates the need for multiple disconnected tools by bringing 
                assignments, announcements, materials, events, and real-time messaging into 
                one seamless experience.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat-card">
                <Users size={32} />
                <div className="stat-number">Unlimited</div>
                <div className="stat-label">Students & Admins</div>
              </div>
              <div className="stat-card">
                <FileText size={32} />
                <div className="stat-number">6+</div>
                <div className="stat-label">Core Features</div>
              </div>
              <div className="stat-card">
                <MessageCircle size={32} />
                <div className="stat-number">Real-time</div>
                <div className="stat-label">Communication</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="how-container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">
                <Users size={40} />
              </div>
              <h3>Create Account</h3>
              <p>Register as a student with your enrollment details or login as an administrator.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">
                <BookOpen size={40} />
              </div>
              <h3>Access Dashboard</h3>
              <p>View personalized dashboard with assignments, announcements, and upcoming events.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">
                <Upload size={40} />
              </div>
              <h3>Submit & Share</h3>
              <p>Submit assignments, download materials, and participate in discussions.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-icon">
                <MessageCircle size={40} />
              </div>
              <h3>Communicate</h3>
              <p>Chat in real-time with peers and instructors, send direct messages.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Get Started?</h2>
          <p>Join Linkbridge today and experience seamless educational communication.</p>
          <div className="cta-buttons">
            <button onClick={() => navigate('/register')} className="btn-large btn-primary">
              Create Account <ArrowRight size={20} />
            </button>
            <button onClick={() => navigate('/login')} className="btn-large btn-secondary">
              Sign In
            </button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-section">
              <h3 className="footer-logo">Linkbridge</h3>
              <p className="footer-description">
                A professional educational communication platform built to connect students and educators.
              </p>
            </div>
            <div className="footer-section">
              <h4>Platform</h4>
              <ul className="footer-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Access</h4>
              <ul className="footer-links">
                <li><a onClick={() => navigate('/login')}>Student Login</a></li>
                <li><a onClick={() => navigate('/admin/login')}>Admin Login</a></li>
                <li><a onClick={() => navigate('/register')}>Register</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Project Info</h4>
              <ul className="footer-links">
                <li>Final Year Project</li>
                <li>MERN Stack</li>
                <li>Educational Purpose</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Linkbridge. Built as a Final Year Project.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
