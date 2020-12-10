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
import {DictionaryDefinition} from "../interfaces/dictionarymanager.interfaces";

/**
 * list the available dictionary definitions
 */
@Component({
    selector: 'dictionary-manager-definitions',
    templateUrl: './src/workbench/templates/dictionarymanagerdefinitions.html',
})
export class DictionaryManagerDefinitions {

    /**
     * a filter term to filter the list by
     *
     * @private
     */
    private definitionfilterterm: string;

    /**
     * a type to filter the list by
     *
     * @private
     */
    private definitionfiltertype: string;

    constructor(private dictionarymanager: dictionarymanager, private metadata: metadata, private language: language,  private modal: modal, private injector: Injector, private modelutilities: modelutilities) {

    }

    /**
     * gets all non deleted entries sorted by name
     */
    get dictionarydefinitions(): DictionaryDefinition[] {

        return this.dictionarymanager.dictionarydefinitions.filter(d => {
            // no deleted records
            if(d.deleted != 0) return false;
            // if we have a type filter apply it
            if(this.definitionfiltertype && d.sysdictionary_type != this.definitionfiltertype) return false;
            // if we have aterm filter apply it
            if(this.definitionfilterterm && !(d.name.toLowerCase().indexOf(this.definitionfilterterm.toLowerCase()) >= 0 || d.tablename.toLowerCase().indexOf(this.definitionfilterterm.toLowerCase()) >= 0)) return false;
            // otherwise list it
            return true;
        }).sort((a, b) => a.name.localeCompare(b.name));

    }

    private trackByFn(index, item) {
        return item.id;
    }

    /**
     * set the current definition to the service
     *
     * @param definitionId
     */
    private setCurrentDictionaryDefintion(definitionId: string) {
        if(definitionId != this.dictionarymanager.currentDictionaryDefinition) {
            this.dictionarymanager.currentDictionaryDefinition = definitionId;
            this.dictionarymanager.currentDictionaryItem = null;
            this.dictionarymanager.currentDictionaryIndex = null;
            this.dictionarymanager.currentDictionaryRelationship = null;
        }
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

                if (this.dictionarymanager.currentDictionaryDefinition == id) {
                    this.dictionarymanager.currentDictionaryDefinition == null;
                }
            }
        });
    }

}
