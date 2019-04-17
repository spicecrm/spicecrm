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
    templateUrl: './src/modules/aclterritories/templates/aclterritorrieselementmanagerelementvaluesaddmodal.html',
})
export class ACLTerritorriesElementmanagerElementValuesAddModal {

    self: any = {};

    elementname: string = '';
    elementvalue: string = '';
    @Output() newelementvalue: EventEmitter<any> = new EventEmitter<any>();

    constructor(private backend: backend, private language: language, private elementRef: ElementRef) {
    }

    close(){
        this.self.destroy();
    }

    save(){
        this.newelementvalue.emit({name: this.elementname, value: this.elementvalue});
        this.close();
    }

}