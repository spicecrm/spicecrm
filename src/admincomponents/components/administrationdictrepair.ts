/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";


@Component({
    selector: 'administration-dict-repair',
    templateUrl: './src/admincomponents/templates/administrationdictrepair.html'
})
export class AdministrationDictRepair {


    constructor(private backend: backend, private toast: toast, private language: language) {
    }


}
