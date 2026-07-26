import { useState, useEffect } from "react";
import type { PortalConfig, FeaturedEntity as FeaturedEntityType, DomainItem } from "./types";
import { PortalHeader } from "./components/PortalHeader";
import { FeaturedEntity } from "./components/FeaturedEntity";
import { DomainCard } from "./components/DomainCard";
import { ThreeBackground } from "./components/ThreeBackground";
import { HGQLExplorer } from "./components/HGQLExplorer";
import { HelpPage } from "./components/HelpPage";
import { AboutPage } from "./components/AboutPage";

const landmarks = [
  { name: "Paris", stat: "Q90 • Nodes: 284", desc: "Capital of France, centered on the historic Seine River.", link: "https://minidivn.github.io/minidi-data-country.fr/#Q90" },
  { name: "Hanoi", stat: "Q3602 • Nodes: 195", desc: "Capital of Vietnam, known for its centuries-old architecture.", link: "https://minidivn.github.io/minidi-data-country.vn/#Q3602" },
  { name: "Berlin", stat: "Q64 • Nodes: 220", desc: "Capital of Germany, rich in political and modern history.", link: "https://minidivn.github.io/minidi-data-country.de/#Q64" },
  { name: "Ha Long Bay", stat: "Q190128 • Nodes: 85", desc: "UNESCO World Heritage site famous for towering limestone pillars.", link: "https://minidivn.github.io/minidi-data-country.vn/#Q190128" },
  { name: "Eiffel Tower", stat: "Q243 • Nodes: 112", desc: "Iconic wrought-iron lattice tower on the Champ de Mars in Paris.", link: "https://minidivn.github.io/minidi-data-country.fr/#Q243" },
  { name: "Hoan Kiem Lake", stat: "Q1191004 • Nodes: 64", desc: "Historic lake in the heart of Hanoi, associated with the turtle legend.", link: "https://minidivn.github.io/minidi-data-country.vn/#Q1191004" },
  { name: "Mont Saint-Michel", stat: "Q4117 • Nodes: 78", desc: "Tidal island and famous monastery in Normandy, France.", link: "https://minidivn.github.io/minidi-data-country.fr/#Q4117" },
  { name: "Brandenburg Gate", stat: "Q82118 • Nodes: 94", desc: "18th-century neoclassical monument in Berlin, symbol of unity.", link: "https://minidivn.github.io/minidi-data-country.de/#Q82118" },
  { name: "Hue Imperial City", stat: "Q10772277 • Nodes: 140", desc: "Former imperial capital of the Nguyen Dynasty in Vietnam.", link: "https://minidivn.github.io/minidi-data-country.vn/#Q10772277" },
  { name: "Palace of Versailles", stat: "Q46679 • Nodes: 155", desc: "Principal royal residence of France from 1682 until the Revolution.", link: "https://minidivn.github.io/minidi-data-country.fr/#Q46679" }
];

const scienceNodes = [
  { name: "Albert Einstein", stat: "Q937 • Degree: 32", desc: "Theoretical physicist who developed the theory of relativity.", link: "https://minidivn.github.io/minidi-data-country.de/#Q937" },
  { name: "Marie Curie", stat: "Q7186 • Degree: 28", desc: "Physicist and chemist who conducted pioneering research on radioactivity.", link: "https://minidivn.github.io/minidi-data-country.fr/#Q7186" },
  { name: "Isaac Newton", stat: "Q935 • Degree: 35", desc: "Key figure in the Scientific Revolution, formulated laws of motion.", link: "https://minidivn.github.io/minidi-data-country.en/#Q935" },
  { name: "Alexander von Humboldt", stat: "Q6604 • Degree: 22", desc: "German polymath and naturalist who laid foundations for biogeography.", link: "https://minidivn.github.io/minidi-data-country.de/#Q6604" },
  { name: "Henry Dunant", stat: "Q12089 • Degree: 15", desc: "Founder of the Red Cross and first Nobel Peace Prize laureate.", link: "https://minidivn.github.io/minidi-data-country.fr/#Q12089" },
  { name: "Charles Darwin", stat: "Q1035 • Degree: 30", desc: "Naturalist who proposed the theory of evolution by natural selection.", link: "https://minidivn.github.io/minidi-data-country.en/#Q1035" },
  { name: "Louis Pasteur", stat: "Q38125 • Degree: 26", desc: "Chemist and microbiologist renowned for discoveries in vaccination.", link: "https://minidivn.github.io/minidi-data-country.fr/#Q38125" },
  { name: "Max Planck", stat: "Q41697 • Degree: 20", desc: "German physicist who discovered energy quanta, founding quantum theory.", link: "https://minidivn.github.io/minidi-data-country.de/#Q41697" },
  { name: "Ada Lovelace", stat: "Q11596 • Degree: 18", desc: "Mathematician chiefly known for work on the Analytical Engine.", link: "https://minidivn.github.io/minidi-data-country.en/#Q11596" },
  { name: "Johannes Kepler", stat: "Q8963 • Degree: 24", desc: "German astronomer and mathematician known for his laws of planetary motion.", link: "https://minidivn.github.io/minidi-data-country.de/#Q8963" }
];

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
              {/* Highlights section (only if not searching) */}
              {!searchQuery && (
                <section className="highlights-section">
                  <h2 className="section-title">✨ Key Node Highlights</h2>
                  <div className="highlights-grid">
                    <div className="highlights-col">
                      <h3 className="col-title">📍 Geographic & Historical Landmarks</h3>
                      {landmarks.map((item, idx) => (
                        <a
                          key={idx}
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="highlight-item"
                          style={{ textDecoration: "none", color: "inherit", display: "block" }}
                        >
                          <div className="highlight-header">
                            <span className="highlight-name">{item.name}</span>
                            <span className="highlight-stat">{item.stat}</span>
                          </div>
                          <p className="highlight-desc">{item.desc}</p>
                        </a>
                      ))}
                    </div>
                    <div className="highlights-col">
                      <h3 className="col-title">🧪 Scientific & Cultural Nodes</h3>
                      {scienceNodes.map((item, idx) => (
                        <a
                          key={idx}
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="highlight-item"
                          style={{ textDecoration: "none", color: "inherit", display: "block" }}
                        >
                          <div className="highlight-header">
                            <span className="highlight-name">{item.name}</span>
                            <span className="highlight-stat">{item.stat}</span>
                          </div>
                          <p className="highlight-desc">{item.desc}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              <h2 className="section-title">🌐 Countries Graph</h2>
              
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
