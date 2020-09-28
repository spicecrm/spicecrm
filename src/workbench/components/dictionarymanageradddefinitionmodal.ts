/**
 * @module WorkbenchModule
 */
import {
    Component
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {dictionarymanager} from '../services/dictionarymanager.service';

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
    private dictionarydefinition: any = {
        name: '',
        sysdictionary_type: 'module',
        scope: 'g',
        deleted: 0,
        status: 'd'
    };



    constructor(private dictionarymanager: dictionarymanager, private metadata: metadata, private modelutilities: modelutilities) {

    }

    /**
     * close the modal
     */
    private close() {
        this.self.destroy();
    }

    /**
     * check if we can save
     *
     * name and fieldtype are defined and name does not exists yet
     *
     */
    get canSave() {
        return this.dictionarydefinition.name && this.dictionarydefinition.sysdictionary_type && !this.dictionarymanager.dictionarydefinitions.find(d => d.name == this.dictionarydefinition.name || d.tablename == this.dictionarydefinition.tablename);
    }

    /**
     * saves the modal
     */
    private save() {
        if(this.canSave) {
            this.dictionarydefinition.id = this.modelutilities.generateGuid();
            this.dictionarymanager.dictionarydefinitions.push(this.dictionarydefinition);
            this.close();
        }
    }


}
