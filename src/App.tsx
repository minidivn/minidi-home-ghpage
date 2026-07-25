import { useState, useEffect } from "react";
import type { PortalConfig, FeaturedEntity as FeaturedEntityType, DomainItem } from "./types";
import { PortalHeader } from "./components/PortalHeader";
import { FeaturedEntity } from "./components/FeaturedEntity";
import { DomainCard } from "./components/DomainCard";
import { ThreeBackground } from "./components/ThreeBackground";
import { HGQLExplorer } from "./components/HGQLExplorer";
import { HelpPage } from "./components/HelpPage";
import { AboutPage } from "./components/AboutPage";

function App() {
  const [config, setConfig] = useState<PortalConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredEntity, setFeaturedEntity] = useState<FeaturedEntityType | null>(null);
  const [activeTab, setActiveTab] = useState<"home" | "hgql" | "help" | "about">("home");

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
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Fancy 3D particles graph background */}
      <ThreeBackground />
      
      <div className="portal-container">
        {/* Navigation Tabs bar */}
        <nav className="portal-navbar">
          <button
            className={`nav-tab ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            🏠 Home
          </button>
          <button
            className={`nav-tab ${activeTab === "hgql" ? "active" : ""}`}
            onClick={() => setActiveTab("hgql")}
          >
            🔮 HGQL Explorer
          </button>
          <button
            className={`nav-tab ${activeTab === "help" ? "active" : ""}`}
            onClick={() => setActiveTab("help")}
          >
            📖 Help
          </button>
          <button
            className={`nav-tab ${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            ✨ About
          </button>
        </nav>

        {/* Tab Routing content */}
        {activeTab === "home" && (
          <>
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
          </>
        )}

        {activeTab === "hgql" && (
          <div className="tab-content">
            <HGQLExplorer config={config} />
          </div>
        )}

        {activeTab === "help" && (
          <div className="tab-content">
            <HelpPage />
          </div>
        )}

        {activeTab === "about" && (
          <div className="tab-content">
            <AboutPage />
          </div>
        )}
        
        <footer className="portal-footer">
          <p>
            &copy; {new Date().getFullYear()} MiniDi Multigraph Project. Hosted on{" "}
            <a href="https://github.com/minidivn" target="_blank" rel="noreferrer" style={{ fontWeight: 600, color: "#8b5cf6" }}>
              GitHub Org
            </a>.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
