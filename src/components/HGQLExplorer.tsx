import React, { useState } from "react";

interface HGQLExplorerProps {
  config: any;
}

export const HGQLExplorer: React.FC<HGQLExplorerProps> = ({ config }) => {
  const sampleQueries = [
    {
      label: "Find French places",
      query: {
        select: ["id", "label", "properties.coordinates"],
        from: "entities",
        where: {
          type: "place",
          repo: "minidi-data-country.fr"
        },
        limit: 5
      }
    },
    {
      label: "List all active country portals",
      query: {
        select: ["name", "emoji", "url"],
        from: "domains",
        where: {
          type: "country"
        }
      }
    }
  ];

  const [queryString, setQueryString] = useState(
    JSON.stringify(sampleQueries[0].query, null, 2)
  );
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQuery = () => {
    setError(null);
    setResults(null);

    try {
      const q = JSON.parse(queryString);
      
      // Perform mock matching logic to evaluate HGQL against our config dataset
      const fromSource = q.from || "domains";
      let pool = [];

      if (fromSource === "domains") {
        pool = config.domains || [];
      } else if (fromSource === "entities") {
        pool = config.featured_pool || [];
      } else {
        throw new Error("Invalid 'from' source. Supported: 'domains', 'entities'.");
      }

      // Filter
      let filtered = pool.filter((item: any) => {
        if (!q.where) return true;
        
        let matches = true;
        // Simple type match
        if (q.where.type && item.type !== q.where.type && item.repo !== q.where.repo) {
          matches = false;
        }
        return matches;
      });

      // Limit
      if (q.limit && filtered.length > q.limit) {
        filtered = filtered.slice(0, q.limit);
      }

      // Projection (Select)
      if (q.select && q.select.length > 0) {
        filtered = filtered.map((item: any) => {
          const projected: any = {};
          q.select.forEach((field: string) => {
            projected[field] = item[field] || "";
          });
          return projected;
        });
      }

      setResults(filtered);
    } catch (err: any) {
      setError(err.message || "Failed to parse query JSON.");
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <h2 style={{ fontSize: "1.75rem", fontWeight: 700, margin: "0 0 1.5rem" }}>
        🔮 HGQL Query Explorer
      </h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Editor panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Quick Templates:</span>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
              {sampleQueries.map((sq, idx) => (
                <button
                  key={idx}
                  onClick={() => setQueryString(JSON.stringify(sq.query, null, 2))}
                  style={{
                    padding: "0.4rem 0.8rem",
                    background: "rgba(139, 92, 246, 0.1)",
                    border: "1px solid rgba(139, 92, 246, 0.25)",
                    borderRadius: "6px",
                    color: "#c084fc",
                    cursor: "pointer",
                    fontSize: "0.8rem"
                  }}
                >
                  {sq.label}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={queryString}
            onChange={(e) => setQueryString(e.target.value)}
            style={{
              width: "100%",
              height: "220px",
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid var(--glass-border)",
              borderRadius: "var(--radius-md)",
              color: "#a7f3d0",
              fontFamily: "Courier, monospace",
              padding: "1rem",
              boxSizing: "border-box",
              fontSize: "0.9rem"
            }}
          />

          <button
            onClick={handleQuery}
            style={{
              padding: "0.75rem",
              background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
              border: "none",
              borderRadius: "9999px",
              color: "#ffffff",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(139, 92, 246, 0.2)"
            }}
          >
            Execute HGQL Query
          </button>
        </div>

        {/* Results panel */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.45)",
            border: "1px solid var(--glass-border)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            maxHeight: "350px",
            overflowY: "auto"
          }}
        >
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block", marginBottom: "0.75rem" }}>
            Query Output Result:
          </span>

          {error && (
            <div style={{ color: "#ef4444", fontSize: "0.9rem", fontFamily: "monospace" }}>
              Error: {error}
            </div>
          )}

          {!error && !results && (
            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center", paddingTop: "4rem" }}>
              Run a query to inspect L2/L1 hypergraph objects
            </div>
          )}

          {results && (
            <pre style={{ margin: 0, fontSize: "0.85rem", color: "#f1f5f9", fontFamily: "monospace", overflowX: "auto" }}>
              {JSON.stringify(results, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
