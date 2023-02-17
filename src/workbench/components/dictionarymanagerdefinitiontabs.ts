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
    public _scope: 'items' | 'relationships' | 'indexes' | 'fields' = 'items';

    constructor(public dictionarymanager: dictionarymanager, public metadata: metadata, public language: language, public modal: modal, public injector: Injector, public modelutilities: modelutilities) {

    }

    /**
     * checks if we have a template
     */
    get isTemplate(){
        return this.dictionarymanager.currentIsTemplate();
    }


    /**
     * returns the scope and in case of temaplta anjd fields returns items
     */
    get scope() {
        return this.isTemplate && this._scope == 'fields' ? 'items' : this._scope;
    }

    set scope(scope) {
        this._scope = scope;
    }

}
