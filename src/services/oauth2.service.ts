import {Injectable, Renderer2} from '@angular/core';
import {HttpClient,} from '@angular/common/http';
import {Auth2ServiceConfigI} from "../globalcomponents/interfaces/globalcomponents.interfaces";
import {Subject} from "rxjs";

declare var _: any;

/**
 * Service for logging in and logging out with
 * OIDC and OAuth2. Supports implicit flow and
 * password flow.
 */
@Injectable()
export class OAuth2Service {
    /**
     * holds the config
     */
    public config: Auth2ServiceConfigI;

    constructor(
        protected renderer: Renderer2,
        protected http: HttpClient,
    ) {
    }

    /**
     * display popup window and return the response
     */
    public codeFlowLogin() {

        const resSubject = new Subject<string>();
        let checkForPopupClosedTimer: number;

        const state = this.generateState();

        const url = this.generateLoginUrl(state);

        const popupWindowRef = window.open(
            url, 'SpiceCRM OAuth2 login',
            this.popupWindowRect()
        );

        if (!popupWindowRef) {
            resSubject.error('window blocked');
        } else {
            checkForPopupClosedTimer = window.setInterval(() => {
                    if (!popupWindowRef?.closed) return;
                    cleanup();
                    resSubject.error('window closed');
                },
                500
            );
        }

        const messageListener = this.renderer.listen('window', 'message', (e: MessageEvent) => {

            if (e.source != popupWindowRef || e.origin != window.origin || e.data?.source != 'SpiceCRMOAuthWindow') return;

            cleanup();
            const queryStringObject = this.parseRedirectQueryString(e.data.hash);

            if (!!queryStringObject.error) {
                resSubject.error(queryStringObject.error);
            } else if (queryStringObject.state !== state) {
                resSubject.error('Invalid state');
            } else if (!queryStringObject) {
                resSubject.error('invalid redirect uri data');
            } else {
                resSubject.next(queryStringObject.code);
                resSubject.complete();
            }
        });

        const cleanup = () => {
            window.clearInterval(checkForPopupClosedTimer);
            messageListener();
            if (!!popupWindowRef) popupWindowRef.close();
        };

        return resSubject.asObservable();
    }

    /**
     * generate a cryptographic random state
     */
    public generateState(): string {

        const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let arr = new Uint8Array(40);
        window.crypto.getRandomValues(arr);
        arr = arr.map(x => validChars.charCodeAt(x % validChars.length));
        const randomState = String.fromCharCode.apply(null, arr);

        return btoa(randomState);
    }

    /**
     * generate login url with query string
     * @param state
     * @protected
     */
    protected generateLoginUrl(state: string): string {

        const params = new URLSearchParams({
            state: state,
            response_type: 'code',
            client_id: this.config.client_id,
            redirect_uri: this.config.redirect_uri,
            scope: this.config.scope,
        });

        return `${this.config.login_url}?${params.toString()}`;
    }

    /**
     * calculate the popup window size and position
     * @protected
     */
    protected popupWindowRect(): string {
        const height = 600;
        const width = 500;
        const left = window.screenLeft + (window.outerWidth - width) / 2;
        const top = window.screenTop + (window.outerHeight - height) / 2;
        return `width=${width},height=${height},top=${top},left=${left}`;
    }

    /**
     * get the authentication code from the redirect query string
     * @param queryString
     * @private
     */
    private parseRedirectQueryString(queryString: string): { state: string, code: string, error: string } {

        const vars = queryString.substring(1).split('&');
        const params: any = {};

        vars.forEach(v => {
            const keyValue = v.split('=');
            params[keyValue[0]] = decodeURIComponent(keyValue[1]);
        });

        return params;
    }
}
