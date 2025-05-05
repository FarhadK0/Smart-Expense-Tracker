import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  Activity,
  UserPlus,
  LogIn,
} from "lucide-react";
import "../Styles/AdminOverview.css";

function AdminOverview() {
  const [overviewData, setOverviewData] = useState({
    totalUsers: 0,
    recentSignup: [],
    recentLogins: [],
    userGrowth: [],
    expenseData: [],
  });

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch("http://localhost:5000/api/admin/overview", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setOverviewData(data);
      } catch (err) {
        console.error("Failed to load admin overview:", err);
      }
    };

    fetchOverview();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-Us", {
      style: "currency",
      currency: "GBP",
      minimunFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="admin-dashboard">
      {/*Summary Cards */}

      <div className="stats-grid">
        {/* Total User Card */}
        <div className="stats-card user-card">
          <div className="stats-content">
            <div>
              <p className="stats-label">Total Users</p>
              <p className="stats-value">{overviewData.totalUsers}</p>
            </div>
            <div className="icon-container icon-indigo">
              <Users className="stats-icon" />
            </div>
          </div>
        </div>

        {/* New User Card */}
        <div className="stats-card new-users-card">
          <div className="stats-content">
            <div>
              <p className="stats-label"> New Users Today</p>
              <p className="stats-value">
                {
                  overviewData.recentSignup.filter(
                    (user) =>
                      new Date(user.createdAt).toDateString() ===
                      new Date().toDateString()
                  ).length
                }
              </p>
            </div>
            <div className="icon-container icon-amber">
              <UserPlus className="stats-icon" />
            </div>
          </div>
        </div>

        {/* Active User Card*/}
        <div className="stats-card active-card">
          <div className="stats-content">
            <div>
              <p className="stats-label">Active Today</p>
              <p className="stats-value">
                {
                  overviewData.recentLogins.filter(
                    (user) =>
                      new Date(user.lastLogin).toDateString() ===
                      new Date().toDateString()
                  ).length
                }
              </p>
            </div>
            <div className="icon-container icon-blue">
              <LogIn className="stats-icon" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-container">
          <h2 className="chart-title">
            <Users className="chart-icon icon-indigo" /> User Growth
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={overviewData.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ff" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h2 className="chart-title">
            <DollarSign className="chart-icon icon-emerald" />
            Expense Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={overviewData.expenseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar
                dataKey="amount"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                barSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="tables-grid">
        <div className="table-container">
          <h2 className="table-title">
            <UserPlus className="table-icon icon-amber" /> Recent SignUp
          </h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {overviewData.recentSignup.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className="date-time-info">
                      <div className="date-info">
                        <Calendar size={14} className="date-icon" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                      <div className="time-info">
                        <Clock size={14} className="time-icon" />
                        {new Date(user.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <h2 className="table-title">
            <LogIn className="table-icon icon-blue" /> Recent Logins
          </h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Last Login</th>
              </tr>
            </thead>
            <tbody>
              {overviewData.recentLogins.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className="date-time-info">
                      <div className="date-info">
                        <Calendar size={14} className="date-icon" />
                        {new Date(user.lastLogin).toLocaleDateString("")}
                      </div>
                      <div className="time-info">
                        <Clock size={14} className="time-icon" />
                        {new Date(user.lastLogin).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
