import { ProjectLdapConfig, ProjectOauthConfig, ProjectSamlConfig } from './authorization';
import {
  ProjectEmailConfig,
  ProjectESignConfig,
  ProjectFileStorageConfig,
  ProjectGoogleDriveConfig,
  ProjectKickboxConfig,
  ProjectCaptchaConfig,
  ProjectSQLConnectorConfig,
} from './integrations';

export type ProjectSettings = {
  appOrigin: string;

  // API Settings
  keys?: Array<{ key: string }>;
  cors: string;
  csp?: string;
  secret?: string;

  // PDF settings
  pdfserver?: string;
  filetoken?: string;

  // Public Configurations
  allowConfig?: boolean;
  allowConfigToForms?: boolean;

  // Custom JS & CSS
  custom?: {
    css?: string;
    js?: string;
  };
  formModule?: string;

  // Integrations
  email?: ProjectEmailConfig;
  captcha?: ProjectCaptchaConfig;
  recaptcha?: ProjectCaptchaConfig;
  esign?: ProjectESignConfig;
  google?: ProjectGoogleDriveConfig;
  kickbox?: ProjectKickboxConfig;
  sqlconnector?: ProjectSQLConnectorConfig;
  storage?: ProjectFileStorageConfig;

  // Authorization
  tokenParse?: string;
  oauth?: ProjectOauthConfig;
  ldap?: ProjectLdapConfig;
  saml?: ProjectSamlConfig;
};
