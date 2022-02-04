/**
 * required oauth2 configs
 */
export interface Auth2ServiceConfigI {
    issuer: string;
    client_id: string;
    scope: string;
    redirect_uri: string;
    token_endpoint: string;
    userinfo_endpoint: string;
    login_url: string;
    client_secret: string;
    discovery_document_url: string;
}
/**
 * reflects authentication_services vardefs
 */
export interface AuthServiceI {
    issuer: string;
    name: string;
    icon: string;
    sequence: number;
    config: Auth2ServiceConfigI
}
