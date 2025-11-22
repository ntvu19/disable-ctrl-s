/**
 * Types for the extension
 */

export interface SiteSettings {
  [domain: string]: {
    enabled: boolean;
  };
}
