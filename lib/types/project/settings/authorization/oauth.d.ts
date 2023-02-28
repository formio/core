import { RoleId } from '@formio/types/Role';
export type ProjectOauthConfig = {
    openid?: OpenIdOauthConfig;
    github?: GithubOauthConfig;
    google?: GoogleOauthConfig;
};
export type OpenIdOauthConfig = {
    authURI: string;
    tokenURI: string;
    clientId: string;
    clientSecret: string;
    authorizationMethod: 'body' | 'header';
    userInfoURI: string;
    scope?: string;
    idPath?: string;
    emailPath?: string;
    roles: Array<{
        claim: string;
        claim1: string;
        value: string;
        role: RoleId;
    }>;
};
export type GithubOauthConfig = {
    clientId: string;
    clientSecret: string;
};
export type GoogleOauthConfig = {
    clientId: string;
    clientSecret: string;
};
