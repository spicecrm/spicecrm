/**
 * @module WorkbenchModule
 */
import {
    Component, Injector
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {modal} from '../../services/modal.service';


import {dictionarymanager} from '../services/dictionarymanager.service';
import {configurationService} from "../../services/configuration.service";

/**
 * the central dictionary Manager
 */
@Component({
    selector: 'dictionary-relationships',
    templateUrl: '../templates/dictionaryrelationships.html',
    providers: [dictionarymanager],
    standalone: false
})
export class DictionaryRelationships {

    constructor(public dictionarymanager: dictionarymanager,
                public modal: modal,
                public backend: backend,
                public toast: toast,
                public injector: Injector
    ) {
    }


}
