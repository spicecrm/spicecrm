/**
 * @module WorkbenchModule
 */
import {
    Component, Injector
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {modal} from '../../services/modal.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';


import {dictionarymanager} from '../services/dictionarymanager.service';

/**
 * the central dictionary Manager
 */
@Component({
    selector: 'dictionary-manager',
    templateUrl: '../templates/dictionarymanager.html',
    providers: [dictionarymanager]
})
export class DictionaryManager {

    constructor(public dictionarymanager: dictionarymanager, public modal: modal, public injector: Injector) {

    }

    public migrate(){
        this.modal.openModal('DictionaryManagerMigrateDefinitionModal', true, this.injector);
    }


}
