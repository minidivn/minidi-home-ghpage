import React from "react";
import type { DomainItem } from "../types";

interface DomainCardProps {
  domain: DomainItem;
}

export const DomainCard: React.FC<DomainCardProps> = ({ domain }) => {
  return (
    <a
      href={domain.url}
      target="_blank"
      rel="noopener noreferrer"
      className="domain-card"
    >
      <div className="domain-top">
        <div className="domain-identity">
          <span className="domain-emoji">{domain.emoji}</span>
          <h3 className="domain-name">{domain.name}</h3>
        </div>
        <p className="domain-desc">{domain.description}</p>
      </div>
      <div className="domain-footer">
        <span>github: {domain.github}</span>
        <span className="domain-link-indicator">
          <span>Enter Portal</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            style={{ width: "12px", height: "12px" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </a>
  );
};
