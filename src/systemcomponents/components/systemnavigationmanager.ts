import {Component, Input, ViewChild, ViewContainerRef, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {navigation} from '../../services/navigation.service';
import {session} from '../../services/session.service';

@Component({
    selector: 'system-navigation-manager',
    templateUrl: './src/systemcomponents/templates/systemnavigationmanager.html',
})
export class SystemNavigationManager {

    constructor(private session: session, private navigation: navigation, private changeDetectorRef: ChangeDetectorRef) {

    }

    /**
     * checks if the user is authenticates
     */
    get authenticated() {
        return this.session.authData.sessionId && this.session.authData.loaded === true;
    }
}
