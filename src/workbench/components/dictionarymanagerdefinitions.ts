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
 * list the available dictionary definitions
 */
@Component({
    selector: 'dictionary-manager-definitions',
    templateUrl: './src/workbench/templates/dictionarymanagerdefinitions.html',
})
export class DictionaryManagerDefinitions {

    constructor(private dictionarymanager: dictionarymanager, private metadata: metadata, private language: language,  private modal: modal, private injector: Injector, private modelutilities: modelutilities) {

    }

    /**
     * gets all non deleted entries sorted by name
     */
    get dictionarydefinitions() {
        return this.dictionarymanager.dictionarydefinitions.filter(d => d.deleted == 0).sort((a, b) => a.name > b.name ? 1 : -1);
    }


    /**
     * set the current definition to the service
     *
     * @param definitionId
     */
    private setCurrentDictionaryDefintion(definitionId: string) {
        this.dictionarymanager.currentDictionaryDefinition = definitionId;
    }



    /**
     * react to the click to add a new dictionary definition
     */
    private addDictionaryDefinition(event: MouseEvent) {
        event.stopPropagation();
        this.modal.openModal('DictionaryManagerAddDefinitionModal', true, this.injector);
    }

    /**
     * prompts the user and delets the dictionary definition
     *
     * @param event
     * @param id
     */
    private deleteDictionaryDefinition(event: MouseEvent, id: string) {
        event.stopPropagation();
        this.modal.prompt('confirm', this.language.getLabel('MSG_DELETE_RECORD', '', 'long'), this.language.getLabel('MSG_DELETE_RECORD')).subscribe(answer => {
            if (answer) {
                let di = this.dictionarymanager.dictionarydefinitions.find(f => f.id == id).deleted = 1;

                /*
                for (let f of this.domainmanager.domainfields.filter(f => f.sysdomaindefinition_id == id)) {
                    f.deleted = 1;
                }
                */

                if (this.dictionarymanager.currentDictionaryDefinition == id) {
                    this.dictionarymanager.currentDictionaryDefinition == null;
                }
            }
        });
    }

}
