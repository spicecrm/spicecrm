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
        status: 'd',
        sequence: this.dictionarymanager.dictionaryitems.filter(d => d.sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition).length
    };

    /**
     * the list of the domains
     */
    private domains: any[] = [];

    /**
     * the list fo the didsctionary items
     */
    private templates: any[] = [];

    /**
     * the type of the item to be added
     */
    private itemtype: 'i' | 't' = 'i';

    constructor(private dictionarymanager: dictionarymanager, private metadata: metadata, private modelutilities: modelutilities) {
        for (let domain of this.dictionarymanager.domaindefinitions) {
            this.domains.push({
                id: domain.id,
                name: domain.name
            });
        }

        // sort the domain name alphabetically
        this.domains.sort((a, b) => a.name.localeCompare(b.name) > 0 ? 1 : -1);

        // add the other dictioanry items
        for (let template of this.dictionarymanager.dictionarydefinitions) {
            this.templates.push({
                id: template.id,
                name: template.name
            });
        }

        // sort the domain name alphabetically
        this.templates.sort((a, b) => a.name.localeCompare(b.name) > 0 ? 1 : -1);
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
        return (this.dictionaryitem.name && this.itemtype == 'i' && this.dictionaryitem.sysdomaindefinition_id && !this.dictionarymanager.dictionaryitems.find(d => d.name == this.dictionaryitem.name && d.sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition)) || (this.itemtype == 't' && this.dictionaryitem.sysdictionary_ref_id && !this.dictionarymanager.dictionaryitems.find(d => d.sysdictionary_ref_id == this.dictionaryitem.sysdictionary_ref_id && d.sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition));
    }

    /**
     * saves the modal
     */
    private save() {
        if (this.canSave) {

            // handle the itemtype and reset the other option
            if (this.itemtype == 'i') {
                this.dictionaryitem.sysdictionary_ref_id = null;
            } else {
                this.dictionaryitem.name = this.templates.find(t => t.id == this.dictionaryitem.sysdictionary_ref_id).name;
                this.dictionaryitem.sysdomaindefinition_id = null;
            }

            this.dictionaryitem.id = this.modelutilities.generateGuid();
            this.dictionaryitem.sysdictionarydefinition_id = this.dictionarymanager.currentDictionaryDefinition;
            this.dictionarymanager.dictionaryitems.push(this.dictionaryitem);
            this.close();
        }
    }


}
