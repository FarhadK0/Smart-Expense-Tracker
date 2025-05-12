import React, { useEffect, useState } from "react";
import { Trash2, Users, ArrowUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/AdminUsers.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loginChartData, setLoginChartData] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const res = await fetch("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setUsers(data.data);
        processLoginData(data.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, []);

  const processLoginData = (users) => {
    const counts = {};
    users.forEach((user) => {
      if (user.lastLogin) {
        const date = new Date(user.lastLogin).toLocaleDateString();
        counts[date] = (counts[date] || 0) + 1;
      }
    });

    const chartData = Object.entries(counts).map(([date, count]) => ({
      date,
      logins: count,
    }));

    setLoginChartData(chartData);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="admin-users-container">
      <h2 className="section-title">
        <Users /> Manage Users
      </h2>

      {/* Chart */}
      <div className="chart-wrapper">
        <h3>Login History</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={loginChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="logins" fill="#6366f1" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <table className="admin-users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Signup</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{new Date(user.createdAt).toLocaleDateString("en-GB")}</td>
              <td>
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleString("en-GB")
                  : "—"}
              </td>

              <td>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="delete-btn"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;
