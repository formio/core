export type ProjectGoogleDriveConfig = {
    clientId: string;
    cskey: string;
    refreshtoken: string;
};
export type ProjectKickboxConfig = {
    apikey: string;
};
export type ProjectSQLConnectorConfig = {
    host: string;
    password: string;
    type: 'mysql' | 'mssql' | 'postgres';
    user: string;
};
