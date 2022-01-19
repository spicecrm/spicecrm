/**
 * @module SystemComponents
 */
import {Component, Input, ViewChild, ViewContainerRef, AfterViewInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {metadata} from '../../services/metadata.service';
import {navigation} from '../../services/navigation.service';

@Component({
    template: '<span></span>'
})
export class SystemNavigationCollector {

    constructor(public activatedRoute: ActivatedRoute, public navigation: navigation) {
        this.activatedRoute.params.subscribe(routeParams => {
            if(this.activatedRoute.routeConfig) {
                this.navigation.handleNavigation(routeParams, this.activatedRoute.routeConfig, this.activatedRoute.snapshot);
            }
        });
    }

}
