/**
 * required oauth2 configs
 */
export interface Auth2ServiceConfigI {
    client_id: string;
    scope: string;
    /**
     * e.g. https://demo.spicecrm.com/oauth2redirect.html or /oauth2redirect
     */
    redirect_uri: string;
    token_endpoint: string;
    userinfo_endpoint: string;
    login_url: string;
    client_secret?: string;
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
