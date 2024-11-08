/**
 * @module ModuleACLTerritories
 */
import {Component, ElementRef, Output, EventEmitter} from '@angular/core';
import {backend} from '../../../services/backend.service';
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
