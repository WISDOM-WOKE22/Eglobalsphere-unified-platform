export interface PreferenceType {
  id: string;
  company_name: string;
  company_logo: string;
  theme_mode: string;
  language: string;
}

export interface PreferenceLogoFormData {
  file: File;
}