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
    templateUrl: './src/workbench/templates/dictionarymanagerdefinitiontabs.html',
})
export class DictionaryManagerDefinitionTabs {

    /**
     * define the scope for the tabs
     */
    private scope: 'items'|'relationships'|'indexes'|'fields' = 'items';

    constructor(private dictionarymanager: dictionarymanager, private metadata: metadata, private language: language,  private modal: modal, private injector: Injector, private modelutilities: modelutilities) {

    }

}
