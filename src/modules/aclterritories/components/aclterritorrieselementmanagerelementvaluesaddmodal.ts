/**
 * @module ModuleACLTerritories
 */
import {Component, ElementRef, Output, EventEmitter} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {language} from "../../../services/language.service";


@Component({
    selector: 'aclterritorries-element-manager-element-values-add-modal',
    templateUrl: '../templates/aclterritorrieselementmanagerelementvaluesaddmodal.html',
})
export class ACLTerritorriesElementmanagerElementValuesAddModal {

    self: any = {};

    elementname: string = '';
    elementvalue: string = '';
    @Output() newelementvalue: EventEmitter<any> = new EventEmitter<any>();

    constructor(public backend: backend, public language: language, public elementRef: ElementRef) {
    }

    close(){
        this.self.destroy();
    }

    save(){
        this.newelementvalue.emit({name: this.elementname, value: this.elementvalue});
        this.close();
    }

}
