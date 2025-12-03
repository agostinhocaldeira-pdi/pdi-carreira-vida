import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Auto-create admin user for development if no user exists
const initDevAdmin = () => {
  const existingUser = localStorage.getItem("user");
  if (!existingUser) {
    const adminUser = {
      name: "Administrador",
      email: "agostinhocmcaldeira@gmail.com",
      password: "admin123",
      phone: "",
      createdAt: new Date().toISOString()
    };
    localStorage.setItem("user", JSON.stringify(adminUser));
    
    // Also ensure admin is in administrators list
    const admins = JSON.parse(localStorage.getItem("administrators") || "[]");
    if (!admins.some((a: any) => a.email === adminUser.email)) {
      admins.push({ name: adminUser.name, email: adminUser.email, phone: "" });
      localStorage.setItem("administrators", JSON.stringify(admins));
    }
    console.log("Dev admin user created automatically");
  }
};

initDevAdmin();

createRoot(document.getElementById("root")!).render(<App />);
