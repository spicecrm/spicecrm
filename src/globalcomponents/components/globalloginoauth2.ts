/**
 * @module GlobalComponents
 */
import {Component, EventEmitter, Input, OnDestroy, Output} from "@angular/core";
import {configurationService} from "../../services/configuration.service";
import {AuthServiceI} from "../interfaces/globalcomponents.interfaces";
import {loginService} from "../../services/login.service";
import {broadcast} from "../../services/broadcast.service";
import {Subscription} from "rxjs";

/**
 * container to render a list of the available oauth2 services
 */
@Component({
    selector: "global-login-oauth2",
    templateUrl: "../templates/globalloginoauth2.html"
})
export class GlobalLoginOAuth2 implements OnDestroy {

    @Input() public authenticatedUser: string;
    /**
     * holds the auth services definition
     */
    public services: AuthServiceI[] = [];
    /**
     * subscription to unsubscribe
     */
    public subscription = new Subscription();
    /**
     * emits the token
     */
    @Output() public token = new EventEmitter<{ issuer: string, accessToken: string }>();

    constructor(
        public configuration: configurationService,
        public broadcast: broadcast,
        public loginService: loginService
    ) {
        this.subscribeToBroadcast();

    }

    /**
     * display only this issuer if it's defined
     */
    @Input('issuer')
    set setSingleIssuer(issuer: string) {

        if (!issuer) return;

        this.services = [this.services.find(s => issuer == s.issuer)]
    };

    /**
     * unsubscribe from subscription
     */
    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * initialize and load the oauth libraries
     */
    public loadServices() {

        const services: AuthServiceI[] = this.configuration.getCapabilityConfig('oauth2');

        if (!Array.isArray(services)) return;

        this.services = services.map(service => {
            const clone = {...service};
            clone.config = JSON.parse(clone.config as any);
            return clone;
        });
    }

    /**
     * subscribe to broadcast to reload the services
     * @private
     */
    private subscribeToBroadcast() {
        this.subscription.add(
            this.configuration.loaded$.subscribe((loaded) => {
                if (loaded) this.loadServices();
            })
        )
    }
}
