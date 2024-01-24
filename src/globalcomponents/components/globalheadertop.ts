/**
 * @module GlobalComponents
 */
import {metadata} from '../../services/metadata.service';
import {layout} from '../../services/layout.service';
import {AfterViewInit, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {configurationService} from "../../services/configuration.service";

@Component({
    selector: 'global-header-top',
    templateUrl: '../templates/globalheadertop.html'
})
export class GlobalHeaderTop {

    constructor(public metadata: metadata,public layout: layout, public configurationService: configurationService) {

    }

    get showSearch() {
        return this.metadata.getActiveRole().showsearch && this.metadata.getActiveRole().showsearch != '0';
    }

    get isSmall() {
        return this.layout.screenwidth == 'small';
    }
}
