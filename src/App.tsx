import { useState, useEffect } from "react";
import type { PortalConfig, FeaturedEntity as FeaturedEntityType, DomainItem } from "./types";
import { PortalHeader } from "./components/PortalHeader";
import { FeaturedEntity } from "./components/FeaturedEntity";
import { DomainCard } from "./components/DomainCard";

function App() {
  const [config, setConfig] = useState<PortalConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredEntity, setFeaturedEntity] = useState<FeaturedEntityType | null>(null);

  useEffect(() => {
    // Fetch portal configuration catalog
    fetch("config.json")
      .then((res) => res.json())
      .then((data: PortalConfig) => {
        setConfig(data);
        
        // Randomly select a featured node on initial load
        if (data.featured_pool && data.featured_pool.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.featured_pool.length);
          setFeaturedEntity(data.featured_pool[randomIndex]);
        }
      })
      .catch((err) => console.error("Failed to load portal configuration:", err));
  }, []);

  if (!config) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <p style={{ color: "#94a3b8", fontSize: "1.2rem" }}>Loading MiniDi portal...</p>
      </div>
    );
  }

  // Filter children domains/countries by search term query
  const filteredDomains = config.domains.filter((domain: DomainItem) => {
    const term = searchQuery.toLowerCase();
    return (
      domain.name.toLowerCase().includes(term) ||
      domain.description.toLowerCase().includes(term) ||
      domain.github.toLowerCase().includes(term)
    );
  });

  return (
    <div className="portal-container">
      <div className="glow-spot"></div>
      
      <PortalHeader
        title={config.title}
        subtitle={config.subtitle}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      {/* Featured entity element */}
      {!searchQuery && <FeaturedEntity entity={featuredEntity} />}
      
      <main>
        <div className="domain-grid">
          {filteredDomains.map((domain: DomainItem) => (
            <DomainCard key={domain.id} domain={domain} />
          ))}
        </div>
        
        {filteredDomains.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748b" }}>
            <p>No portals or country databases match "{searchQuery}"</p>
          </div>
        )}
      </main>
      
      <footer className="portal-footer">
        <p>
          &copy; {new Date().getFullYear()} MiniDi Multigraph Project. Hosted on{" "}
          <a href="https://pages.github.com" target="_blank" rel="noreferrer">
            GitHub Pages
          </a>.
        </p>
      </footer>
    </div>
  );
}

export default App;
