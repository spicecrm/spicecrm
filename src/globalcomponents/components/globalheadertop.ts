import {metadata} from '../../services/metadata.service';
import {AfterViewInit, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
@Component({
    selector: 'global-header-top',
    templateUrl: './src/globalcomponents/templates/globalheadertop.html'
})
export class GlobalHeaderTop {

    constructor(private metadata: metadata){

    }

    get showSearch(){
        return this.metadata.getActiveRole().showsearch && this.metadata.getActiveRole().showsearch != '0';
    }
}