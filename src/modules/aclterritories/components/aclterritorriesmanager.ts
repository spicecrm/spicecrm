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
    templateUrl: './src/modules/aclterritories/templates/aclterritorriesmanager.html',
})
export class ACLTerritorriesManager {

    @ViewChild('managercontent', {read: ViewContainerRef, static: false}) elementmanagercontent: ViewContainerRef;

    activeTerritoryId: string = '';
    activeTerritoryData: any = {};
    activeTerritoryType: string = '';

    constructor(private backend: backend, private navigation: navigation, private elementRef: ElementRef) {

    }

    get contentStyle(){
        let rect = this.elementmanagercontent.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100vh - ' + rect.top + 'px'
        }
    }

    setTerritory(territory){
        this.activeTerritoryId = territory.id;
        this.activeTerritoryData = territory;
    }

    setType(type){
        this.activeTerritoryType = type;
    }

}