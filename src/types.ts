export interface FeaturedEntity {
  id: string;
  repo: string;
  label: string;
  desc: string;
}

export interface DomainItem {
  id: string;
  type: string;
  name: string;
  emoji: string;
  url: string;
  github: string;
  description: string;
}

export interface PortalConfig {
  title: string;
  subtitle: string;
  featured_pool: FeaturedEntity[];
  domains: DomainItem[];
}
