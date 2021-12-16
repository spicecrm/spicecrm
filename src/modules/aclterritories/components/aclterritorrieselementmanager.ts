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
    templateUrl: '../templates/aclterritorrieselementmanager.html',
})
export class ACLTerritorriesElementmanager {

    public activeElement: string = '';

    constructor(public backend: backend, public navigation: navigation, public elementRef: ElementRef) {
    }

    public setActiveElement(element){
        this.activeElement = element;
    }


}
