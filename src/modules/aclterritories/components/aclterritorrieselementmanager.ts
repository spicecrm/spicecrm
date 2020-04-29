/**
 * @module ModuleACLTerritories
 */
import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {backend} from '../../../services/backend.service';
import {navigation} from '../../../services/navigation.service';
import {broadcast} from "../../../services/broadcast.service";


@Component({
    templateUrl: './src/modules/aclterritories/templates/aclterritorrieselementmanager.html',
})
export class ACLTerritorriesElementmanager {

    private activeElement: string = '';

    constructor(private backend: backend, private navigation: navigation, private elementRef: ElementRef) {
    }

    private setActiveElement(element){
        this.activeElement = element;
    }


}
