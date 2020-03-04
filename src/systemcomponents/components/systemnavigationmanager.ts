import {Component, Input, ViewChild, ViewContainerRef, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {navigation} from '../../services/navigation.service';
import {session} from '../../services/session.service';

@Component({
    selector: 'system-navigation-manager',
    templateUrl: './src/systemcomponents/templates/systemnavigationmanager.html',
})
export class SystemNavigationManager implements AfterViewInit {

    @ViewChild('routercontainer', {read: ViewContainerRef}) private routercontainer: ViewContainerRef;

    constructor(private session: session, private navigation: navigation, private changeDetectorRef: ChangeDetectorRef) {

    }

    public ngAfterViewInit() {
        this.navigation.routercontainer = this.routercontainer;
    }
}
