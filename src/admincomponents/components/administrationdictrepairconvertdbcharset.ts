/**
 * @module AdminComponentsModule
 */
 import {Component, Injector} from '@angular/core';
 import {backend} from '../../services/backend.service';
 import {toast} from "../../services/toast.service";
 import {language} from "../../services/language.service";
 import {modal} from "../../services/modal.service";
 import {AdministrationDictRepairDbColumnsModal} from "./administrationdictrepairdbcolumnsmodal";
 
 @Component({
     selector: 'administration-dict-repair-db-convert-db-charset',
     templateUrl: './src/admincomponents/templates/administrationdictrepairdbcolumns.html'
 })
 
 export class AdministrationDictRepairConvertDBCharset {
     constructor(private backend: backend, private toast: toast, private language: language, private modal: modal, private injector: Injector) {
     }
 
     public executeRepairDbColumns() {
         this.modal.openModal('AdministrationDictRepairDbColumnsModal', true, this.injector);
     }
 }