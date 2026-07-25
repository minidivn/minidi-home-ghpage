import React from "react";

export const AboutPage: React.FC = () => {
  return (
    <div style={{ animation: "fadeIn 0.5s ease", color: "var(--text-secondary)", lineHeight: 1.7 }}>
      <h2 style={{ fontSize: "1.75rem", fontWeight: 700, margin: "0 0 1.5rem", color: "var(--text-primary)" }}>
        ✨ About Large Language HyperGraphs (LLHG)
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "2.25rem" }}>
        {/* Section 1 */}
        <div>
          <p style={{ margin: 0, fontSize: "1.05rem" }}>
            MiniDi is built upon the **Large Language HyperGraph (LLHG)** architecture, a next-generation approach to structuring decentralized knowledge graphs that combines structural math frameworks with serverless scaling.
          </p>
        </div>

        {/* Column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div>
            <h4 style={{ color: "#06b6d4", fontSize: "1.1rem", margin: "0 0 0.5rem" }}>🔑 Content-Addressed Identity</h4>
            <p style={{ margin: 0, fontSize: "0.95rem" }}>
              Nodes do not rely on centralized auto-incrementing integers. Instead, entity identifiers are derived deterministically using a **Blake3 content hash** of their canonical label:
              <code style={{ display: "block", background: "rgba(15, 23, 42, 0.6)", padding: "0.4rem 0.8rem", borderRadius: "6px", color: "#34d399", fontFamily: "monospace", marginTop: "0.5rem", fontSize: "0.85rem" }}>
                id = Blake3(label || birth_signature)
              </code>
            </p>
          </div>

          <div>
            <h4 style={{ color: "#06b6d4", fontSize: "1.1rem", margin: "0 0 0.5rem" }}>🗺️ Spatial Morton Coordinates</h4>
            <p style={{ margin: 0, fontSize: "0.95rem" }}>
              To search and traverse large networks quickly without a database server, we elect global taxonomic landmarks. Multi-dimensional distances are converted into a 1D **Morton Z-order curve**, allowing fast range queries on CDNs.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div>
          <h3 style={{ color: "#a78bfa", fontSize: "1.2rem", margin: "0 0 0.5rem" }}>🛡️ Zero-Cost CDN Infrastructure</h3>
          <p style={{ margin: 0 }}>
            MiniDi operates entirely serverless. There are no relational or graph query servers running. Instead, pre-compiled JSON and Parquet partitions are stored on GitHub Pages and HuggingFace CDN networks. Dynamic client-side apps download and parse these files on-the-fly, giving us infinite scale with zero hosting overhead.
          </p>
        </div>
      </div>
    </div>
  );
};
