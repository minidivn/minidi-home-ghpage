import React from "react";
import type { FeaturedEntity as FeaturedEntityType } from "../types";

interface FeaturedEntityProps {
  entity: FeaturedEntityType | null;
}

export const FeaturedEntity: React.FC<FeaturedEntityProps> = ({ entity }) => {
  if (!entity) return null;
  
  // Resolve link destination to child repository ghpages index.html
  const targetUrl = `https://minidivn.github.io/${entity.repo}/#${entity.id}`;

  return (
    <div className="featured-section">
      <span className="featured-tag">Featured Knowledge Node</span>
      <h3 className="featured-title">{entity.label}</h3>
      <p className="featured-desc">{entity.desc}</p>
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="featured-btn"
      >
        <span>Explore Entity</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          style={{ width: "14px", height: "14px" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </a>
    </div>
  );
};
