/**
 * @module WorkbenchModule
 */
import {
    Component
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {dictionarymanager} from '../services/dictionarymanager.service';
import {DictionaryDefinition} from "../interfaces/dictionarymanager.interfaces";

@Component({
    templateUrl: './src/workbench/templates/dictionarymanageradddefinitionmodal.html',
})
export class DictionaryManagerAddDefinitionModal {

    /**
     * reference to the modal self
     */
    private self: any;

    /**
     * the domain definition
     */
    private dictionarydefinition: DictionaryDefinition;

    /**
     * messages collected
     * @private
     */
    private messages: any[] = [];

    constructor(private dictionarymanager: dictionarymanager, private metadata: metadata, private modelutilities: modelutilities) {
        this.dictionarydefinition = {
            id: this.modelutilities.generateGuid(),
            name: '',
            tablename: '',
            sysdictionary_type: 'module',
            scope: this.dictionarymanager.defaultScope,
            deleted: 0,
            status: 'd'
        };
    }

    /**
     * close the modal
     */
    private close() {
        this.self.destroy();
    }

    private getMessages(field) {
        return this.messages.filter(m => m.field == field);
    }

    /**
     * check if we can save
     *
     * name and fieldtype are defined and name does not exists yet
     *
     */
    get canSave() {
        this.messages = [];

        if (this.dictionarymanager.dictionarydefinitions.find(d => d.name == this.dictionarydefinition.name)) {
            this.messages.push({field: 'name', message: 'name exists already'});
        }
        if (this.dictionarymanager.dictionarydefinitions.find(d => d.tablename == this.dictionarydefinition.tablename)) {
            this.messages.push({field: 'tablename', message: 'table exists already'});
        }

        if(this.dictionarymanager.reservedWords.indexOf(this.dictionarydefinition.tablename.toUpperCase()) >= 0){
            this.messages.push({field: 'tablename', message: 'tablename cannot be used (reserved word)'});
        }

        return this.dictionarydefinition.name && this.dictionarydefinition.sysdictionary_type && this.messages.length == 0;
    }

    /**
     * saves the modal
     */
    private save() {
        if (this.canSave) {
            this.dictionarydefinition.id = this.modelutilities.generateGuid();
            this.dictionarymanager.dictionarydefinitions.push(this.dictionarydefinition);
            this.close();
        }
    }


}
