/**
 * @module SystemComponents
 */
import {Component} from '@angular/core';
import {navigation} from '../../services/navigation.service';
import {session} from '../../services/session.service';
import {metadata} from "../../services/metadata.service";

/**
 * renders the navigation manager. This renders a component of a route container for each objecttab
 * that is in the navigation service. The tab then itself has reponsibility to render itself
 * and also trigger change detection and react to tab changes activating itself
 */
@Component({
    selector: 'system-navigation-manager',
    templateUrl: '../templates/systemnavigationmanager.html',
    standalone: false
})
export class SystemNavigationManager {

    constructor(public session: session, public navigation: navigation, private metadata: metadata) {

    }

    /**
     * checks if the user is authenticates
     */
    get authenticated() {
        return this.navigation.router.url !== '/login' &&
            (
                // logged in or we have public routes
                (this.session.authData.sessionId && this.session.authData.loaded === true)
                || this.metadata.publicRoutes.length > 0
            );
    }
}
