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


@Component({
    selector: 'dictionary-manager-definition-tabs',
    templateUrl: '../templates/dictionarymanagerdefinitiontabs.html',
})
export class DictionaryManagerDefinitionTabs {

    /**
     * define the scope for the tabs
     */
    public scope: 'items'|'relationships'|'indexes'|'fields' = 'items';

    constructor(public dictionarymanager: dictionarymanager, public metadata: metadata, public language: language,  public modal: modal, public injector: Injector, public modelutilities: modelutilities) {

    }

}
