/**
 * @module GlobalComponents
 */
import {Component, EventEmitter, Input, Output} from "@angular/core";
import {configurationService} from "../../services/configuration.service";
import {AuthServiceI} from "../interfaces/globalcomponents.interfaces";

/**
 * container to render a list of the available oauth2 services
 */
@Component({
    selector: "global-login-oauth2",
    templateUrl: "../templates/globalloginoauth2.html"
})
export class GlobalLoginOAuth2 {

    @Input() public authenticatedUser: string;
    /**
     * holds the auth services definition
     */
    public services: AuthServiceI[] = [];
    /**
     * emits the token
     */
    @Output() public token = new EventEmitter<{issuer: string, accessToken: string}>();

    constructor(
        public configuration: configurationService
    ) {
        this.configuration.loaded$.subscribe((loaded) => {
            if (loaded) this.loadServices();
        });
    }

    /**
     * initialize and load the oauth libraries
     */
    public loadServices() {

        const services = this.configuration.getCapabilityConfig('oauth2');

        if (!Array.isArray(services)) return;

        this.services = services.map(service => {
            const clone = {...service};
            clone.config = JSON.parse(clone.config);
            return clone;
        });
    }
}
