import { ProjectLdapConfig, ProjectOauthConfig, ProjectSamlConfig } from './authorization';
import { ProjectEmailConfig, ProjectESignConfig, ProjectFileStorageConfig, ProjectGoogleDriveConfig, ProjectKickboxConfig, ProjectReCaptchaConfig, ProjectSQLConnectorConfig } from './integrations';
export type ProjectSettings = {
    appOrigin: string;
    keys?: Array<{
        key: string;
    }>;
    cors: string;
    csp?: string;
    secret?: string;
    pdfserver?: string;
    filetoken?: string;
    allowConfig?: boolean;
    allowConfigToForms?: boolean;
    custom?: {
        css?: string;
        js?: string;
    };
    formModule?: string;
    email?: ProjectEmailConfig;
    recaptcha?: ProjectReCaptchaConfig;
    esign?: ProjectESignConfig;
    google?: ProjectGoogleDriveConfig;
    kickbox?: ProjectKickboxConfig;
    sqlconnector?: ProjectSQLConnectorConfig;
    storage?: ProjectFileStorageConfig;
    tokenParse?: string;
    oauth?: ProjectOauthConfig;
    ldap?: ProjectLdapConfig;
    saml?: ProjectSamlConfig;
};
