import React from "react";

interface PortalHeaderProps {
  title: string;
  subtitle: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  title,
  subtitle,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="portal-header">
      <div className="logo-container">
        <img src="logo.svg" className="logo-svg" alt="MiniDi Multigraph Logo" />
      </div>
      <h1 className="portal-title">{title}</h1>
      <p className="portal-subtitle">{subtitle}</p>
      
      <div className="search-wrapper">
        <svg
          className="search-icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search country graphs, topics, and entities..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </header>
  );
};
