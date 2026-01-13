import React, { useState, useEffect } from "react";
import { Key, TrendingUp, Users, Database, Copy, RefreshCw, LogOut, BookOpen, BarChart3, Shield, Eye, EyeOff, Plus, Edit, Trash2, CheckCircle, AlertCircle, Code, Zap, X } from "lucide-react";

// API Base URL - sesuaikan dengan backend Anda
const API_URL = "http://localhost:3000";

const App = () => {
  const [currentPage, setCurrentPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.data);
        setCurrentPage(data.data.role === "ADMIN" ? "admin-dashboard" : "dashboard");
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setCurrentPage("landing");
    showNotification("Berhasil logout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${notification.type === "success" ? "bg-green-500" : "bg-red-500"} text-white`}>
          {notification.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {notification.message}
        </div>
      )}

      {/* Router */}
      {currentPage === "landing" && <LandingPage setCurrentPage={setCurrentPage} />}
      {currentPage === "login" && <LoginPage setCurrentPage={setCurrentPage} setToken={setToken} setUser={setUser} showNotification={showNotification} />}
      {currentPage === "register" && <RegisterPage setCurrentPage={setCurrentPage} setToken={setToken} setUser={setUser} showNotification={showNotification} />}
      {currentPage === "dashboard" && user && <UserDashboard user={user} setUser={setUser} logout={logout} setCurrentPage={setCurrentPage} showNotification={showNotification} token={token} />}
      {currentPage === "admin-dashboard" && user && user.role === "ADMIN" && <AdminDashboard user={user} logout={logout} setCurrentPage={setCurrentPage} showNotification={showNotification} token={token} />}
      {currentPage === "documentation" && <DocumentationPage user={user} setCurrentPage={setCurrentPage} logout={logout} />}
    </div>
  );
};

// Landing Page
const LandingPage = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-indigo-600" size={32} />
            <span className="text-2xl font-bold text-gray-900">StockAPI</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setCurrentPage("login")} className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium">
              Login
            </button>
            <button onClick={() => setCurrentPage("register")} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          API Data Saham Indonesia <br /> untuk Developer
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Akses data pasar saham real-time dari Bursa Efek Indonesia dengan API yang mudah dan cepat. Mulai gratis, upgrade kapan saja.</p>
        <button onClick={() => setCurrentPage("register")} className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-lg inline-flex items-center gap-2">
          Mulai Gratis <Zap size={20} />
        </button>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard icon={<TrendingUp size={40} />} title="Real-time Data" description="Data saham update setiap detik dari BEI" />
          <FeatureCard icon={<Zap size={40} />} title="Fast & Reliable" description="Response time < 100ms dengan uptime 99.9%" />
          <FeatureCard icon={<Code size={40} />} title="Easy Integration" description="RESTful API yang mudah diintegrasikan" />
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Pricing Plans</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <PricingCard name="Free" price="Rp 0" features={["1,000 requests/bulan", "100 requests/hari", "Basic support"]} buttonText="Start Free" onClick={() => setCurrentPage("register")} />
          <PricingCard name="Starter" price="Rp 99K" features={["50,000 requests/bulan", "5,000 requests/hari", "Email support"]} buttonText="Get Started" onClick={() => setCurrentPage("register")} highlighted />
          <PricingCard name="Pro" price="Rp 499K" features={["500,000 requests/bulan", "50,000 requests/hari", "Priority support"]} buttonText="Get Started" onClick={() => setCurrentPage("register")} />
          <PricingCard name="Enterprise" price="Custom" features={["Unlimited requests", "Dedicated support", "99.9% SLA"]} buttonText="Contact Us" onClick={() => setCurrentPage("register")} />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-md text-center">
    <div className="text-indigo-600 mb-4 flex justify-center">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const PricingCard = ({ name, price, features, buttonText, onClick, highlighted }) => (
  <div className={`bg-white p-6 rounded-xl shadow-lg ${highlighted ? "ring-2 ring-indigo-600" : ""}`}>
    {highlighted && <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">Popular</span>}
    <h3 className="text-2xl font-bold mt-4">{name}</h3>
    <div className="text-3xl font-bold text-indigo-600 my-4">{price}</div>
    <ul className="space-y-2 mb-6">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center gap-2">
          <CheckCircle size={16} className="text-green-500" />
          <span className="text-gray-600">{feature}</span>
        </li>
      ))}
    </ul>
    <button onClick={onClick} className={`w-full py-2 rounded-lg font-medium ${highlighted ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-100 text-gray-900 hover:bg-gray-200"}`}>
      {buttonText}
    </button>
  </div>
);

// Login Page
const LoginPage = ({ setCurrentPage, setToken, setUser, showNotification }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.data.token);
        setToken(data.data.token);
        setUser(data.data.user);
        showNotification("Login berhasil!");
        setCurrentPage(data.data.user.role === "ADMIN" ? "admin-dashboard" : "dashboard");
      } else {
        showNotification(data.error.message, "error");
      }
    } catch (error) {
      showNotification("Terjadi kesalahan. Coba lagi.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <TrendingUp className="text-indigo-600 mx-auto mb-4" size={48} />
          <h2 className="text-3xl font-bold">Login ke StockAPI</h2>
          <p className="text-gray-600 mt-2">Selamat datang kembali!</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="your@email.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50">
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-600">
          Belum punya akun?{" "}
          <button onClick={() => setCurrentPage("register")} className="text-indigo-600 hover:text-indigo-800 font-medium">
            Register
          </button>
        </p>
        <button onClick={() => setCurrentPage("landing")} className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800">
          ← Kembali
        </button>
      </div>
    </div>
  );
};

// Register Page
const RegisterPage = ({ setCurrentPage, setToken, setUser, showNotification }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.data.token);
        setToken(data.data.token);
        setUser(data.data.user);
        showNotification("Registrasi berhasil! API Key otomatis di-generate.");
        setCurrentPage("dashboard");
      } else {
        showNotification(data.error.message, "error");
      }
    } catch (error) {
      showNotification("Terjadi kesalahan. Coba lagi.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <TrendingUp className="text-indigo-600 mx-auto mb-4" size={48} />
          <h2 className="text-3xl font-bold">Register StockAPI</h2>
          <p className="text-gray-600 mt-2">Mulai gratis, upgrade kapan saja</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="John Doe" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="your@email.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Minimal 6 karakter" required minLength={6} />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50">
            {loading ? "Loading..." : "Register"}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-600">
          Sudah punya akun?{" "}
          <button onClick={() => setCurrentPage("login")} className="text-indigo-600 hover:text-indigo-800 font-medium">
            Login
          </button>
        </p>
        <button onClick={() => setCurrentPage("landing")} className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800">
          ← Kembali
        </button>
      </div>
    </div>
  );
};

// User Dashboard
const UserDashboard = ({ user, setUser, logout, setCurrentPage, showNotification, token }) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showNotification("API Key berhasil di-copy!");
  };

  const handleRegenerateKey = async () => {
    if (!window.confirm("Yakin ingin regenerate API Key? Key lama akan invalid.")) return;
    try {
      const response = await fetch(`${API_URL}/auth/regenerate-key`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUser({ ...user, apiKey: data.data.apiKey });
        showNotification("API Key berhasil di-regenerate!");
      }
    } catch (error) {
      showNotification("Gagal regenerate API Key", "error");
    }
  };

  const quotaPercentage = (user.apiCalls / user.monthlyQuota) * 100;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-indigo-600" size={32} />
            <span className="text-2xl font-bold">StockAPI</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentPage("documentation")} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-indigo-600">
              <BookOpen size={20} /> Docs
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">{user.plan}</div>
              </div>
              <button onClick={logout} className="p-2 text-gray-600 hover:text-red-600">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button onClick={() => setActiveTab("overview")} className={`pb-3 px-4 font-medium ${activeTab === "overview" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-600"}`}>
            Overview
          </button>
          <button onClick={() => setActiveTab("apikey")} className={`pb-3 px-4 font-medium ${activeTab === "apikey" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-600"}`}>
            API Key
          </button>
          <button onClick={() => setActiveTab("usage")} className={`pb-3 px-4 font-medium ${activeTab === "usage" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-600"}`}>
            Usage
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <StatCard icon={<Key className="text-indigo-600" size={32} />} title="API Key Status" value={user.apiKey ? "Active" : "Not Generated"} subtitle={user.apiKey ? "Ready to use" : "Generate your key"} />
              <StatCard icon={<BarChart3 className="text-green-600" size={32} />} title="API Calls" value={user.apiCalls.toLocaleString()} subtitle={`of ${user.monthlyQuota.toLocaleString()} this month`} />
              <StatCard icon={<Shield className="text-purple-600" size={32} />} title="Current Plan" value={user.plan} subtitle="Upgrade for more" />
            </div>

            {/* Quick Start */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-4">Quick Start Guide</h3>
              <div className="space-y-4">
                <QuickStartStep number={1} title="Copy your API Key" description="Go to API Key tab and copy your key" />
                <QuickStartStep number={2} title="Make your first request" description="Use the API key in X-API-Key header" />
                <QuickStartStep number={3} title="Read the documentation" description="Learn about all available endpoints" />
              </div>
              <button onClick={() => setCurrentPage("documentation")} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                View Documentation
              </button>
            </div>
          </div>
        )}

        {/* API Key Tab */}
        {activeTab === "apikey" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-4">Your API Key</h3>
              <p className="text-gray-600 mb-4">Gunakan API Key ini untuk mengakses semua endpoint StockAPI. Jangan share ke publik!</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">API Key</span>
                  <button onClick={() => setShowApiKey(!showApiKey)} className="text-indigo-600 hover:text-indigo-800">
                    {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <code className="flex-1 bg-white px-4 py-3 rounded border font-mono text-sm">{showApiKey ? user.apiKey : "•".repeat(50)}</code>
                  <button onClick={() => copyToClipboard(user.apiKey)} className="p-3 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    <Copy size={20} />
                  </button>
                </div>
              </div>
              <button onClick={handleRegenerateKey} className="mt-4 flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                <RefreshCw size={20} /> Regenerate API Key
              </button>
            </div>

            {/* Example Code */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-4">Example Usage</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
                  {`// JavaScript (Fetch)
fetch('http://localhost:5000/api/v1/stocks', {
  headers: { 'X-API-Key': '${user.apiKey}' }
})
  .then(res => res.json())
  .then(data => console.log(data));`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Usage Tab */}
        {activeTab === "usage" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-4">Monthly Usage</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>API Calls</span>
                  <span className="font-medium">
                    {user.apiCalls.toLocaleString()} / {user.monthlyQuota.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-indigo-600 h-4 rounded-full transition-all" style={{ width: `${Math.min(quotaPercentage, 100)}%` }} />
                </div>
                <p className="text-sm text-gray-600 mt-2">{quotaPercentage < 80 ? "✅ You have plenty of quota remaining" : quotaPercentage < 95 ? "⚠️ You are approaching your quota limit" : "🚨 Quota almost exhausted. Consider upgrading."}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-4">Plan Details</h3>
              <div className="space-y-3">
                <PlanDetail label="Current Plan" value={user.plan} />
                <PlanDetail label="Monthly Quota" value={user.monthlyQuota.toLocaleString() + " requests"} />
                <PlanDetail label="Daily Quota" value={user.dailyQuota.toLocaleString() + " requests"} />
                <PlanDetail label="Rate Limit" value={user.plan === "FREE" ? "10/min" : user.plan === "STARTER" ? "100/min" : "500/min"} />
              </div>
              {user.plan === "FREE" && (
                <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                  <p className="text-indigo-900 font-medium mb-2">Want more?</p>
                  <p className="text-indigo-700 text-sm mb-3">Upgrade to Starter plan for 50x more requests at only Rp 99K/month</p>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Upgrade Plan</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, subtitle }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <div className="flex items-center gap-4">
      <div>{icon}</div>
      <div className="flex-1">
        <div className="text-sm text-gray-600">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>
    </div>
  </div>
);

const QuickStartStep = ({ number, title, description }) => (
  <div className="flex items-start gap-4">
    <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">{number}</div>
    <div>
      <div className="font-medium">{title}</div>
      <div className="text-sm text-gray-600">{description}</div>
    </div>
  </div>
);

const PlanDetail = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

// Stock Form Modal Component
const StockFormModal = ({ isOpen, onClose, stock, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    sector: "",
    price: "",
    change: "",
    changePercent: "",
    volume: "",
    marketCap: "",
    value: "",
    foreignBuy: "",
    foreignSell: "",
  });

  useEffect(() => {
    if (stock) {
      setFormData({
        symbol: stock.symbol || "",
        name: stock.name || "",
        sector: stock.sector || "",
        price: stock.price || "",
        change: stock.change || "",
        changePercent: stock.changePercent || "",
        volume: stock.volume || "",
        marketCap: stock.marketCap || "",
        value: stock.value || "",
        foreignBuy: stock.foreignBuy || "",
        foreignSell: stock.foreignSell || "",
      });
    } else {
      setFormData({
        symbol: "",
        name: "",
        sector: "",
        price: "",
        change: "",
        changePercent: "",
        volume: "",
        marketCap: "",
        value: "",
        foreignBuy: "",
        foreignSell: "",
      });
    }
  }, [stock, isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-bold">{stock ? "Edit Stock" : "Add New Stock"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Symbol <span className="text-red-500">*</span>
              </label>
              <input type="text" name="symbol" value={formData.symbol} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="BBCA" required disabled={stock !== null} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Bank Central Asia Tbk" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
              <input type="text" name="sector" value={formData.sector} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Banking" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price <span className="text-red-500">*</span>
              </label>
              <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="9875" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Change</label>
              <input
  type="number"
  step="0.01"
  name="change"
  value={formData.change}
  disabled
  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
/>

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Change Percent (%)</label>
              <input
  type="number"
  step="0.01"
  name="changePercent"
  value={formData.changePercent}
  disabled
  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
/>

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Volume</label>
              <input type="number" name="volume" value={formData.volume} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="45678900" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Market Cap</label>
              <input type="number" name="marketCap" value={formData.marketCap} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="1234567890000" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
              <input type="number" name="value" value={formData.value} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="1000000000" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Foreign Buy</label>
              <input type="number" name="foreignBuy" value={formData.foreignBuy} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="500000000" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Foreign Sell</label>
              <input type="number" name="foreignSell" value={formData.foreignSell} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="300000000" />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50">
              {loading ? "Saving..." : stock ? "Update Stock" : "Add Stock"}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Admin Dashboard
const AdminDashboard = ({ user, logout, setCurrentPage, showNotification, token }) => {
  const [activeTab, setActiveTab] = useState("stats");
  const [users, setUsers] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "stocks") fetchStocks();
    if (activeTab === "stats") fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) setUsers(data.data);
    } catch (error) {
      showNotification("Gagal load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/stocks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) setStocks(data.data);
    } catch (error) {
      showNotification("Gagal load stocks", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) setStats(data.data);
    } catch (error) {
      showNotification("Gagal load stats", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = () => {
    setEditingStock(null);
    setShowStockModal(true);
  };

  const handleEditStock = (stock) => {
    setEditingStock(stock);
    setShowStockModal(true);
  };

  const handleSubmitStock = async (formData) => {
    setFormLoading(true);
    try {
      const url = editingStock ? `${API_URL}/admin/stocks/${editingStock.id}` : `${API_URL}/admin/stocks`;
      const method = editingStock ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        showNotification(editingStock ? "Stock berhasil diupdate" : "Stock berhasil ditambahkan");
        setShowStockModal(false);
        fetchStocks();
      } else {
        showNotification(data.error?.message || "Gagal menyimpan stock", "error");
      }
    } catch (error) {
      showNotification("Terjadi kesalahan", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const deleteStock = async (id) => {
    if (!window.confirm("Yakin ingin hapus stock ini?")) return;
    try {
      const response = await fetch(`${API_URL}/admin/stocks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        showNotification("Stock berhasil dihapus");
        fetchStocks();
      }
    } catch (error) {
      showNotification("Gagal hapus stock", "error");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="text-indigo-600" size={32} />
            <span className="text-2xl font-bold">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-500">Administrator</div>
            </div>
            <button onClick={logout} className="p-2 text-gray-600 hover:text-red-600">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button onClick={() => setActiveTab("stats")} className={`pb-3 px-4 font-medium ${activeTab === "stats" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-600"}`}>
            Statistics
          </button>
          <button onClick={() => setActiveTab("users")} className={`pb-3 px-4 font-medium ${activeTab === "users" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-600"}`}>
            Users
          </button>
          <button onClick={() => setActiveTab("stocks")} className={`pb-3 px-4 font-medium ${activeTab === "stocks" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-600"}`}>
            Stocks
          </button>
        </div>

        {/* Stats Tab */}
        {activeTab === "stats" && stats && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <StatCard icon={<Users className="text-blue-600" size={32} />} title="Total Users" value={stats.totalUsers} subtitle="Registered users" />
              <StatCard icon={<Database className="text-green-600" size={32} />} title="Total Stocks" value={stats.totalStocks} subtitle="Listed stocks" />
              <StatCard icon={<BarChart3 className="text-purple-600" size={32} />} title="API Calls" value={stats.totalApiCalls.toLocaleString()} subtitle="Total requests" />
              <StatCard icon={<TrendingUp className="text-orange-600" size={32} />} title="Active Today" value={stats.recentUsage?.length || 0} subtitle="Recent activity" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-4">Users by Plan</h3>
              <div className="grid md:grid-cols-4 gap-4">
                {Object.entries(stats.usersByPlan || {}).map(([plan, count]) => (
                  <div key={plan} className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">{count}</div>
                    <div className="text-sm text-gray-600">{plan}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-4">Recent API Usage</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">User</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Endpoint</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Method</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {stats.recentUsage?.slice(0, 5).map((usage, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3 text-sm">{usage.user.name}</td>
                        <td className="px-4 py-3 text-sm font-mono">{usage.endpoint}</td>
                        <td className="px-4 py-3 text-sm">{usage.method}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs ${usage.statusCode === 200 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{usage.statusCode}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{new Date(usage.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold">User Management</h3>
            </div>
            {loading ? (
              <div className="p-8 text-center">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Plan</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">API Calls</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="px-4 py-3 text-sm font-medium">{u.name}</td>
                        <td className="px-4 py-3 text-sm">{u.email}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs ${u.role === "ADMIN" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}`}>{u.role}</span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">{u.plan}</span>
                        </td>
                        <td className="px-4 py-3 text-sm">{u.apiCalls.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Stocks Tab */}
        {activeTab === "stocks" && (
          <>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold">Stock Management</h3>
                <button onClick={handleAddStock} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  <Plus size={20} /> Add Stock
                </button>
              </div>
              {loading ? (
                <div className="p-8 text-center">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Symbol</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Price</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Change</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Volume</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {stocks.map((stock) => (
                        <tr key={stock.symbol}>
                          <td className="px-4 py-3 text-sm font-bold">{stock.symbol}</td>
                          <td className="px-4 py-3 text-sm">{stock.name}</td>
                          <td className="px-4 py-3 text-sm">Rp {stock.price.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`${stock.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {stock.changePercent >= 0 ? "+" : ""}
                              {stock.changePercent.toFixed(2)}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{stock.volume.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex gap-2">
                              <button onClick={() => handleEditStock(stock)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                <Edit size={16} />
                              </button>
                              <button onClick={() => deleteStock(stock.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Stock Form Modal */}
            <StockFormModal isOpen={showStockModal} onClose={() => setShowStockModal(false)} stock={editingStock} onSubmit={handleSubmitStock} loading={formLoading} />
          </>
        )}
      </div>
    </div>
  );
};

// Documentation Page
const DocumentationPage = ({ user, setCurrentPage, logout }) => {
  const [activeEndpoint, setActiveEndpoint] = useState("stocks");

  const endpoints = [
    { id: "stocks", name: "Get All Stocks", method: "GET", path: "/api/v1/stocks" },
    { id: "stock-detail", name: "Get Stock Detail", method: "GET", path: "/api/v1/stocks/:symbol" },
    { id: "search", name: "Search Stocks", method: "GET", path: "/api/v1/stocks/search" },
    { id: "history", name: "Stock History", method: "GET", path: "/api/v1/stocks/:symbol/history" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="text-indigo-600" size={32} />
            <span className="text-2xl font-bold">API Documentation</span>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <button onClick={() => setCurrentPage(user.role === "ADMIN" ? "admin-dashboard" : "dashboard")} className="px-4 py-2 text-gray-700 hover:text-indigo-600">
                  Dashboard
                </button>
                <button onClick={logout} className="p-2 text-gray-600 hover:text-red-600">
                  <LogOut size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4 sticky top-4">
              <h3 className="font-bold mb-4">Endpoints</h3>
              <div className="space-y-2">
                {endpoints.map((endpoint) => (
                  <button key={endpoint.id} onClick={() => setActiveEndpoint(endpoint.id)} className={`w-full text-left px-3 py-2 rounded text-sm ${activeEndpoint === endpoint.id ? "bg-indigo-100 text-indigo-800 font-medium" : "hover:bg-gray-100"}`}>
                    {endpoint.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Authentication</h2>
              <p className="text-gray-600 mb-4">Semua request ke API harus menyertakan API Key di header:</p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                <pre className="text-sm">{`X-API-Key: ${user?.apiKey || "your_api_key_here"}`}</pre>
              </div>
            </div>

            {activeEndpoint === "stocks" && (
              <EndpointDoc
                method="GET"
                path="/api/v1/stocks"
                title="Get All Stocks"
                description="Mengambil daftar semua saham dengan pagination"
                params={[
                  { name: "page", type: "number", description: "Halaman (default: 1)" },
                  { name: "limit", type: "number", description: "Jumlah per halaman (default: 50, max: 100)" },
                  { name: "sort", type: "string", description: "Sort by field (price, volume, change)" },
                  { name: "order", type: "string", description: "asc atau desc (default: desc)" },
                ]}
                example={`curl -H "X-API-Key: ${user?.apiKey || "your_key"}" \\\n  "http://localhost:5000/api/v1/stocks?page=1&limit=10"`}
                response={{
                  success: true,
                  data: [
                    {
                      symbol: "BBCA",
                      name: "Bank Central Asia Tbk",
                      price: 9875,
                      change: 125,
                      changePercent: 1.28,
                      volume: 45678900,
                      marketCap: 1234567890000,
                      lastUpdate: "2026-01-11T14:30:00Z",
                    },
                  ],
                  meta: {
                    total: 850,
                    page: 1,
                    perPage: 10,
                  },
                }}
              />
            )}

            {activeEndpoint === "stock-detail" && (
              <EndpointDoc
                method="GET"
                path="/api/v1/stocks/:symbol"
                title="Get Stock Detail"
                description="Mengambil detail lengkap saham berdasarkan symbol"
                params={[{ name: "symbol", type: "string", description: "Ticker symbol (contoh: BBCA, BBRI)", required: true }]}
                example={`curl -H "X-API-Key: ${user?.apiKey || "your_key"}" \\\n  "http://localhost:5000/api/v1/stocks/BBCA"`}
                response={{
                  success: true,
                  data: {
                    symbol: "BBCA",
                    name: "Bank Central Asia Tbk",
                    sector: "Banking",
                    price: 9875,
                    change: 125,
                    changePercent: 1.28,
                    volume: 45678900,
                    marketCap: 1234567890000,
                    lastUpdate: "2026-01-11T14:30:00Z",
                  },
                }}
              />
            )}

            {activeEndpoint === "search" && (
              <EndpointDoc
                method="GET"
                path="/api/v1/stocks/search"
                title="Search Stocks"
                description="Mencari saham berdasarkan symbol atau nama"
                params={[
                  { name: "q", type: "string", description: "Query pencarian (min 2 karakter)", required: true },
                  { name: "limit", type: "number", description: "Jumlah hasil (default: 10, max: 50)" },
                ]}
                example={`curl -H "X-API-Key: ${user?.apiKey || "your_key"}" \\\n  "http://localhost:5000/api/v1/stocks/search?q=bank&limit=5"`}
                response={{
                  success: true,
                  data: [
                    { symbol: "BBCA", name: "Bank Central Asia Tbk", price: 9875, changePercent: 1.28 },
                    { symbol: "BBRI", name: "Bank Rakyat Indonesia Tbk", price: 5250, changePercent: -0.94 },
                  ],
                  meta: { query: "bank", found: 2 },
                }}
              />
            )}

            {activeEndpoint === "history" && (
              <EndpointDoc
                method="GET"
                path="/api/v1/stocks/:symbol/history"
                title="Get Stock History"
                description="Mengambil data historis harga saham"
                params={[
                  { name: "symbol", type: "string", description: "Ticker symbol", required: true },
                  { name: "from", type: "date", description: "Tanggal mulai (YYYY-MM-DD)", required: true },
                  { name: "to", type: "date", description: "Tanggal akhir (YYYY-MM-DD)", required: true },
                  { name: "interval", type: "string", description: "daily, weekly, monthly (default: daily)" },
                ]}
                example={`curl -H "X-API-Key: ${user?.apiKey || "your_key"}" \\\n  "http://localhost:3000/api/v1/stocks/BBCA/history?from=2026-01-01&to=2026-01-09"`}
                response={{
                  success: true,
                  data: {
                    symbol: "BBCA",
                    interval: "daily",
                    prices: [
                      { date: "2026-01-02T00:00:00.000Z", open: 9700, high: 9800, low: 9650, close: 9750, volume: "42000000" },
                      { date: "2026-01-03T00:00:00.000Z", open: 9750, high: 9850, low: 9700, close: 9800, volume: "38500000" },
                      { date: "2026-01-06T00:00:00.000Z", open: 9800, high: 9900, low: 9750, close: 9875, volume: "45678900" },
                    ],
                  },
                  meta: { from: "2026-01-01", to: "2026-01-09", count: 3 },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EndpointDoc = ({ method, path, title, description, params, example, response }) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <div className="flex items-center gap-3 mb-4">
      <span className="px-3 py-1 bg-green-100 text-green-800 rounded font-mono text-sm font-bold">{method}</span>
      <code className="text-lg font-mono">{path}</code>
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>

    {params && params.length > 0 && (
      <>
        <h4 className="font-bold mb-2">Parameters:</h4>
        <div className="space-y-2 mb-4">
          {params.map((param, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <code className="bg-gray-100 px-2 py-1 rounded">{param.name}</code>
              <span className="text-gray-500">({param.type})</span>
              {param.required && <span className="text-red-500">*</span>}
              <span className="text-gray-600">- {param.description}</span>
            </div>
          ))}
        </div>
      </>
    )}

    <h4 className="font-bold mb-2">Request Example:</h4>
    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
      <pre className="text-sm">{example}</pre>
    </div>

    {response && (
      <>
        <h4 className="font-bold mb-2 mt-6">Response Example:</h4>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm">{JSON.stringify(response, null, 2)}</pre>
        </div>
      </>
    )}
  </div>
);

export default App;