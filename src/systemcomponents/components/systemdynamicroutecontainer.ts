/**
 * @module SystemComponents
 */
import {Component, ViewChild, ViewContainerRef, AfterViewInit} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';

import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'system-dynamicroute-container',
    templateUrl: './src/systemcomponents/templates/systemdynamicroutecontainer.html'
})
export class SystemDynamicRouteContainer implements AfterViewInit{

    @ViewChild('componentcontainer', {read: ViewContainerRef, static: false}) componentcontainer: ViewContainerRef;

    routercomponent: any = null;

    constructor(
        private metadata: metadata,
        //private router: Router
        private route: ActivatedRoute,
    ) {

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