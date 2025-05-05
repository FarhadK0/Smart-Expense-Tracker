import React from "react";
import { BarChart2, Users, DollarSign, Settings } from "lucide-react";
import "../Styles/AdminSidebar.css";

function AdminSidebar({ activeSection, setActiveSection, adminName }) {
  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-logo">A</div>
        <h3>Admin</h3>
      </div>

      <ul className="admin-sidebar-menu">
        <li
          onClick={() => setActiveSection("overview")}
          className={activeSection === "overview" ? "active" : ""}
        >
          <BarChart2 size={18} />
          <span>Overview</span>
        </li>
        <li
          onClick={() => setActiveSection("users")}
          className={activeSection === "users" ? "active" : ""}
        >
          <Users size={18} />
          <span>Users</span>
        </li>

        <li
          onClick={() => setActiveSection("settings")}
          className={activeSection === "settings" ? "active" : ""}
        >
          <Settings size={18} />
          <span>Settings</span>
        </li>
      </ul>

      <div className="admin-sidebar-footer">
        <div className="admin-profile">
          <div className="admin-avatar">
            {adminName ? adminName.charAt(0) : "A"}
          </div>
          <div className="admin-info">
            <p className="admin-name-label">Logged in as:</p>
            <strong>{adminName || "Admin"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar;
