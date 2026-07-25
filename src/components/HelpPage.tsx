import React from "react";

export const HelpPage: React.FC = () => {
  return (
    <div style={{ animation: "fadeIn 0.5s ease", color: "var(--text-secondary)", lineHeight: 1.7 }}>
      <h2 style={{ fontSize: "1.75rem", fontWeight: 700, margin: "0 0 1.5rem", color: "var(--text-primary)" }}>
        📖 Portal Help & Documentation
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* Section 1 */}
        <div>
          <h3 style={{ color: "#a78bfa", fontSize: "1.2rem", margin: "0 0 0.5rem" }}>🔍 Searching the HyperGraph</h3>
          <p style={{ margin: 0 }}>
            You can search entities dynamically across multiple domains using the global search input. Filters look through entity labels, localized descriptions, and aliases instantly.
          </p>
        </div>

        {/* Section 2 */}
        <div>
          <h3 style={{ color: "#a78bfa", fontSize: "1.2rem", margin: "0 0 0.5rem" }}>🤖 Writing HGQL Queries</h3>
          <p style={{ margin: "0 0 0.75rem" }}>
            The HyperGraph Query Language (HGQL) allows you to target specific properties and filter parameters using a declarative JSON-based structure:
          </p>
          <pre
            style={{
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid var(--glass-border)",
              borderRadius: "8px",
              padding: "1rem",
              color: "#a7f3d0",
              fontFamily: "monospace",
              fontSize: "0.85rem",
              margin: 0
            }}
          >
{`{
  "select": ["id", "label"],
  "from": "entities",
  "where": { "type": "person" },
  "limit": 5
}`}
          </pre>
        </div>

        {/* Section 3 */}
        <div>
          <h3 style={{ color: "#a78bfa", fontSize: "1.2rem", margin: "0 0 0.5rem" }}>🌐 Expanding the Network</h3>
          <p style={{ margin: 0 }}>
            To add a new country or domain space, clone the spider repository and run the setup commander:
            <code style={{ display: "block", background: "rgba(15, 23, 42, 0.6)", padding: "0.5rem 1rem", borderRadius: "6px", color: "#f472b6", fontFamily: "monospace", marginTop: "0.5rem" }}>
              python scripts/create_domain.py --country de --name Germany
            </code>
            This initializes the folder layout, configures GHA workflows, and provisions a public Pages site automatically.
          </p>
        </div>
      </div>
    </div>
  );
};
