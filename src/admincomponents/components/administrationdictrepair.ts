/**
 * @module AdminComponentsModule
 */
import {Component, Injector} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from "../../services/toast.service";
import {modal} from "../../services/modal.service";
import {language} from "../../services/language.service";
import {result} from "underscore";

/**
 * @deprecated
 * will be removed in 2023.02.001
 */
@Component({
    selector: 'administration-dict-repair',
    templateUrl: '../templates/administrationdictrepair.html'
})
export class AdministrationDictRepair {


    constructor(public backend: backend, public toast: toast, public modal: modal, public injector: Injector) {
    }


}
