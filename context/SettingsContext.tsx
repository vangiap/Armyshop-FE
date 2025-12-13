import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000') as string;

// Helper function to convert relative storage paths to full URLs
const getFullUrl = (path: string | null): string | null => {
  if (!path) return null;
  // If already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // If relative path starting with /, prepend API_URL
  if (path.startsWith('/')) {
    return `${API_URL}${path}`;
  }
  return path;
};

export interface SiteSettings {
  // General
  site_name: string;
  site_logo: string | null;
  site_favicon: string | null;
  site_description: string;
  
  // Contact
  contact_email: string;
  contact_phone: string;
  contact_hotline: string;
  contact_address: string;
  contact_working_hours: string;
  
  // Social
  social_facebook: string;
  social_zalo: string;
  social_tiktok: string;
  social_instagram: string;
  social_youtube: string;
  social_shopee: string;
  
  // SEO
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
}

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  getSetting: (key: keyof SiteSettings, defaultValue?: string) => string;
}

const defaultSettings: SiteSettings = {
  site_name: 'Army Shop',
  site_logo: null,
  site_favicon: null,
  site_description: 'Cửa hàng quân đội - Phụ kiện quân nhân',
  contact_email: '',
  contact_phone: '',
  contact_hotline: '',
  contact_address: '',
  contact_working_hours: '',
  social_facebook: '',
  social_zalo: '',
  social_tiktok: '',
  social_instagram: '',
  social_youtube: '',
  social_shopee: '',
  seo_title: '',
  seo_description: '',
  seo_keywords: '',
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  getSetting: () => '',
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.getSettings();
        // Process image URLs to be full URLs
        const processedData = {
          ...defaultSettings,
          ...data,
          site_logo: getFullUrl(data.site_logo || null),
          site_favicon: getFullUrl(data.site_favicon || null),
        };
        setSettings(processedData as SiteSettings);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const getSetting = (key: keyof SiteSettings, defaultValue = ''): string => {
    return settings[key]?.toString() || defaultValue;
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, getSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
