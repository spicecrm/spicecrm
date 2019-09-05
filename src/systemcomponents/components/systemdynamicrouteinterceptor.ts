/**
 * @module SystemComponents
 */
import {Component, ViewChild, ViewContainerRef, AfterViewInit, OnInit} from '@angular/core';
import {ActivatedRoute, Router}   from '@angular/router';

import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'system-dynamicroute-container',
    templateUrl: './src/systemcomponents/templates/systemdynamicroutecontainer.html'
})
export class SystemDynamicRouteInterceptor implements OnInit{

    @ViewChild('componentcontainer', {read: ViewContainerRef, static: true}) componentcontainer: ViewContainerRef;

    routercomponent: any = null;

    constructor(
        private metadata: metadata,
        private route: ActivatedRoute,
        private router: Router
    ) {

    }

    public ngOnInit(){
        this.router.navigate(['/module/Home']);
    }
}
