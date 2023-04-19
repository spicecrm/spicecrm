/**
 * @module AdminComponentsModule
 */
import {Component, EventEmitter, Injector, Input, Output} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";
import {modal} from "../../services/modal.service";


@Component({
    selector: 'administration-dict-repair-item',
    templateUrl: '../templates/administrationdictrepairitem.html'
})
export class AdministrationDictRepairItem {


    /**
     * the label to be displayed
     */
    @Input() public itemlabel: string;

    /**
     * emitter to execute
     */
    @Output() public execute: EventEmitter<boolean> = new EventEmitter<boolean>();


    constructor(public backend: backend, public toast: toast, public language: language, public modal: modal, public injector: Injector) {
    }

}
