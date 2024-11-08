/**
 * @module ModuleACLTerritories
 */
import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef, Output, EventEmitter} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {backend} from '../../../services/backend.service';
import {navigation} from '../../../services/navigation.service';
import {broadcast} from "../../../services/broadcast.service";
import {language} from "../../../services/language.service";


@Component({
    selector: 'aclterritorries-element-manager-elements-add-modal',
    templateUrl: '../templates/aclterritorrieselementmanagerelementsaddmodal.html',
})
export class ACLTerritorriesElementmanagerElementsAddModal {

    self: any = {};

    elementname: string = '';
    @Output() newelementname: EventEmitter<any> = new EventEmitter<any>();

    constructor(public backend: backend, public language: language, public elementRef: ElementRef) {
    }

    close(){
        this.self.destroy();
    }

    save(){
        this.newelementname.emit(this.elementname);
        this.close();
    }

}
