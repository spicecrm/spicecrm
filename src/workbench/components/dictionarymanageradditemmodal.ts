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
    templateUrl: './src/workbench/templates/dictionarymanageradditemmodal.html',
})
export class DictionaryManagerAddItemModal {

    /**
     * reference to the modal self
     */
    private self: any;

    /**
     * the domain definition
     */
    private dictionaryitem: any = {
        name: '',
        scope: 'g',
        deleted: 0,
        status: 'd'
    };

    private domains: any[] = [];

    constructor(private dictionarymanager: dictionarymanager, private metadata: metadata, private modelutilities: modelutilities) {
        for(let domain of this.dictionarymanager.domaindefinitions){
            this.domains.push({
                id: domain.id,
                name: domain.name
            });
        }
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
        return this.dictionaryitem.name && this.dictionaryitem.sysdomaindefinition_id && !this.dictionarymanager.dictionaryitems.find(d => d.name == this.dictionaryitem.name && d.sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition);
    }

    /**
     * saves the modal
     */
    private save() {
        if(this.canSave) {
            this.dictionaryitem.id = this.modelutilities.generateGuid();
            this.dictionaryitem.sysdictionarydefinition_id = this.dictionarymanager.currentDictionaryDefinition;
            this.dictionarymanager.dictionaryitems.push(this.dictionaryitem);
            this.close();
        }
    }


}
