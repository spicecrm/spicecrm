/**
 * @module SystemComponents
 */
import {Component} from '@angular/core';
import {navigation} from '../../services/navigation.service';
import {session} from '../../services/session.service';

/**
 * renders the navigation manager. This renders a component of a route container for each objecttab
 * that is in the navigation service. The tab then itself has reponsibility to render itself
 * and also trigger change detection and react to tab changes activating itself
 */
@Component({
    selector: 'system-navigation-manager',
    templateUrl: '../templates/systemnavigationmanager.html',
})
export class SystemNavigationManager {

    constructor(public session: session, public navigation: navigation) {

    }

    /**
     * checks if the user is authenticates
     */
    get authenticated() {
        return this.session.authData.sessionId && this.session.authData.loaded === true;
    }
}
