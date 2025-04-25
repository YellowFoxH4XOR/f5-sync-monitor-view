
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Navigation: React.FC = () => {
  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Configuration Diff", path: "/config-diff" }
  ];

  return (
    <nav className="bg-sidebar text-sidebar-foreground py-3 px-4 border-b">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <h1 className="text-xl font-bold text-sidebar-primary-foreground">
            F5 Sync Monitor
          </h1>
        </div>
        <div className="flex space-x-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => {
                return cn(
                  "px-3 py-2 rounded-md text-sm font-medium",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                );
              }}
              end
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
