/**
 * @module AdminComponentsModule
 */
import {
    Component,
    ViewChild,
    ViewContainerRef,
    ElementRef, OnInit
} from '@angular/core';

import {Router} from '@angular/router';


@Component({
    template: ''
})
export class AdministrationMenuRouteItem implements OnInit {

    public componentconfig: any = {};
    public self: any = {};

    constructor(
        public router: Router,
    ) {

    }

    public ngOnInit() {
        if(this.componentconfig.route) {
            this.router.navigate([this.componentconfig.route]);
        }
    }

}

