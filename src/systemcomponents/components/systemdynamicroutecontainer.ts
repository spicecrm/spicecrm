/**
 * @module SystemComponents
 */
import {Component, ViewChild, ViewContainerRef, AfterViewInit} from '@angular/core';
import {ActivatedRoute, Router}   from '@angular/router';

import {metadata} from '../../services/metadata.service';
import {session} from '../../services/session.service';

@Component({
    selector: 'system-dynamicroute-container',
    templateUrl: './src/systemcomponents/templates/systemdynamicroutecontainer.html'
})
export class SystemDynamicRouteContainer implements AfterViewInit{

    @ViewChild('componentcontainer', {read: ViewContainerRef, static: true}) componentcontainer: ViewContainerRef;

    routercomponent: any = null;

    constructor(
        private metadata: metadata,
        private session: session,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        // dynamic routes only are avalbe when logged in
        if (!this.session || !this.session.authData.sessionId) {
            this.router.navigate(['/login']);
        }
    }

    ngAfterViewInit(){
        if(!this.routercomponent) {
            let component = this.metadata.getRouteComponent(this.route.snapshot.routeConfig.path);
            this.metadata.addComponent(component, this.componentcontainer).subscribe(component => {
                this.routercomponent = component;
            });
        }
    }
}
