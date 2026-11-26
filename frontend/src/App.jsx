
import { useEffect, useState } from "react";
import "./App.css";

const API = "https://safenet-ai-rmto.onrender.com";

function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("safenet_token")
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // CHECK EXISTING LOGIN
  useEffect(() => {
    async function checkLogin() {
      if (!token) return;

      try {
        const response = await fetch(`${API}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Session expired");
        }

        const data = await response.json();

        setUser(data);
        setPage("dashboard");

      } catch {
        localStorage.removeItem("safenet_token");
        setToken(null);
        setUser(null);
        setPage("home");
      }
    }

    checkLogin();
  }, []);

  // SIGN UP
  async function handleRegister(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      setMessage("Account created successfully! Please log in.");

      setName("");
      setEmail("");
      setPassword("");

      setPage("login");

    } catch (error) {
      setMessage(error.message);

    } finally {
      setLoading(false);
    }
  }

  // LOGIN
  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      localStorage.setItem("safenet_token", data.access_token);

      setToken(data.access_token);
      setUser(data.user);

      setPassword("");
      setMessage("");
      setPage("dashboard");

    } catch (error) {
      setMessage(error.message);

    } finally {
      setLoading(false);
    }
  }

  // LOGOUT
  function handleLogout() {
    localStorage.removeItem("safenet_token");

    setToken(null);
    setUser(null);

    setUrl("");
    setResult(null);

    setMessage("");
    setEmail("");
    setPassword("");
    setName("");

    setPage("home");
  }

  // URL SCANNER
  async function handleScan(e) {
    e.preventDefault();

    setResult(null);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Scanning failed");
      }

      setResult(data);

    } catch (error) {
      setMessage(
        "Could not connect to the backend. Please check that it is running."
      );

    } finally {
      setLoading(false);
    }
  }

  // HOME PAGE
  if (page === "home") {
    return (
      <div className="app">
        <nav className="navbar">
          <h2 className="logo">🛡️ SafeNet AI</h2>

          <div>
            <button
              className="nav-btn"
              onClick={() => {
                setMessage("");
                setPage("login");
              }}
            >
              Login
            </button>

            <button
              className="primary-btn"
              onClick={() => {
                setMessage("");
                setPage("signup");
              }}
            >
              Sign Up
            </button>
          </div>
        </nav>

        <section className="hero">
          <p className="tagline">YOUR DIGITAL SAFETY PARTNER</p>

          <h1>
            Stay Safe From <span>Online Threats</span>
          </h1>

          <p>
            Check suspicious links and identify potentially dangerous
            URLs with SafeNet AI.
          </p>

          <button
            className="primary-btn large-btn"
            onClick={() => setPage("login")}
          >
            Login to Scan URLs
          </button>
        </section>

        <section className="features">
          <h2>Why Choose SafeNet AI?</h2>

          <div className="feature-grid">
            <div className="feature-card">
              <h3>🔍 URL Scanning</h3>
              <p>Check URLs for suspicious patterns.</p>
            </div>

            <div className="feature-card">
              <h3>🛡️ Online Safety</h3>
              <p>Learn to identify potentially risky links.</p>
            </div>

            <div className="feature-card">
              <h3>👤 User Accounts</h3>
              <p>Create an account and access your dashboard.</p>
            </div>
          </div>
        </section>

        <footer>
          © 2026 SafeNet AI | Stay Safe Online
        </footer>
      </div>
    );
  }

  // SIGN UP PAGE
  if (page === "signup") {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>🛡️ SafeNet AI</h1>
          <h2>Create Account</h2>
          <p>Join SafeNet AI and protect yourself online.</p>

          {message && (
            <div className="message">{message}</div>
          )}

          <form onSubmit={handleRegister}>
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="8"
              required
            />

            <button
              className="primary-btn full-btn"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p>
            Already have an account?{" "}
            <button
              className="text-btn"
              onClick={() => {
                setMessage("");
                setPage("login");
              }}
            >
              Login
            </button>
          </p>

          <button
            className="back-btn"
            onClick={() => {
              setMessage("");
              setPage("home");
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // LOGIN PAGE
  if (page === "login") {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>🛡️ SafeNet AI</h1>
          <h2>Welcome Back!</h2>
          <p>Login to access your account.</p>

          {message && (
            <div className="message">{message}</div>
          )}

          <form onSubmit={handleLogin}>
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              className="primary-btn full-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p>
            Don't have an account?{" "}
            <button
              className="text-btn"
              onClick={() => {
                setMessage("");
                setPage("signup");
              }}
            >
              Sign Up
            </button>
          </p>

          <button
            className="back-btn"
            onClick={() => {
              setMessage("");
              setPage("home");
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // USER DASHBOARD
  return (
    <div className="app">
      <nav className="navbar">
        <h2 className="logo">🛡️ SafeNet AI</h2>

        <div>
          <span className="welcome-text">
            Hi, {user?.name || "User"}!
          </span>

          <button
            className="nav-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <section className="dashboard">
        <h1>Welcome to Your Dashboard</h1>

        <p>
          Scan a URL to check for suspicious characteristics.
        </p>

        <div className="scanner-card">
          <h2>🔍 URL Scanner</h2>

          <form onSubmit={handleScan}>
            <input
              type="text"
              placeholder="Enter URL (example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />

            <button
              className="primary-btn"
              disabled={loading}
            >
              {loading ? "Scanning..." : "Scan URL"}
            </button>
          </form>

          {message && (
            <div className="message">{message}</div>
          )}

          {result && (
            <div className="result-card">
              <h3>Scan Result</h3>

              <h2
                className={
                  result.status === "Safe"
                    ? "safe"
                    : result.status === "Suspicious"
                    ? "suspicious"
                    : "invalid"
                }
              >
                {result.status === "Safe"
                  ? "✅ "
                  : result.status === "Suspicious"
                  ? "⚠️ "
                  : "❌ "}

                {result.status}
              </h2>

              <p>{result.message}</p>

              {result.reasons?.length > 0 && (
                <>
                  <h4>Reasons:</h4>

                  <ul>
                    {result.reasons.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>

        <div className="dashboard-info">
          <h3>🛡️ Stay Safe Online</h3>

          <p>
            Always verify website addresses before entering
            passwords or personal information. A Safe result
            from this prototype does not guarantee that a
            website is trustworthy.
          </p>
        </div>
      </section>

      <footer>
        © 2026 SafeNet AI | Your Digital Safety Partner
      </footer>
    </div>
  );
}

export default App;
