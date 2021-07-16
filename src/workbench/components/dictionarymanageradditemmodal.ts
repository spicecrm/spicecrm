/**
 * @module WorkbenchModule
 */
import {
    Component
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {dictionarymanager} from '../services/dictionarymanager.service';
import {DictionaryItem, DictionaryManagerMessage} from "../interfaces/dictionarymanager.interfaces";

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
    private dictionaryitem: DictionaryItem;

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

    /**
     * messages collected
     * @private
     */
    private messages: DictionaryManagerMessage[] = [];

    /**
     * the type tof the current dictionary item
     * currently no deep nesting of templates is allowed so templates cannot be added within templates
     *
     * @private
     */
    private currentType: string;

    constructor(private dictionarymanager: dictionarymanager, private metadata: metadata, private modelutilities: modelutilities) {

        this.dictionaryitem = {
            id: this.modelutilities.generateGuid(),
            sysdictionarydefinition_id: this.dictionarymanager.currentDictionaryDefinition,
            name: '',
            non_db: 0,
            exclude_from_audited: 0,
            required: 0,
            scope: this.dictionarymanager.defaultScope,
            deleted: 0,
            status: 'd',
            sequence: this.dictionarymanager.dictionaryitems.filter(d => d.sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition).length
        };

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
            if(template.sysdictionary_type == 'template') {
                this.templates.push({
                    id: template.id,
                    name: template.name
                });
            }
        }

        // sort the domain name alphabetically
        this.templates.sort((a, b) => a.name.localeCompare(b.name) > 0 ? 1 : -1);

        // get the current type
        this.currentType = this.dictionarymanager.dictionarydefinitions.find(d => d.id == this.dictionarymanager.currentDictionaryDefinition).sysdictionary_type;
    }

    /**
     * close the modal
     */
    private close() {
        this.self.destroy();
    }

    /**
     * returns the messages for a specific field
     * @param field
     * @private
     */
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

        if (this.itemtype == 'i' && !this.dictionaryitem.name) {
            this.messages.push({field: 'name', message: 'please specifiy the name'});
        }

        if (this.itemtype == 'i' && !this.dictionaryitem.sysdomaindefinition_id) {
            this.messages.push({field: 'sysdomaindefinition_id', message: 'please select a domain'});
        }

        if (this.itemtype == 'i' && this.dictionaryitem.name && this.dictionarymanager.dictionaryitems.find(d => d.name == this.dictionaryitem.name && d.sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition)) {
            this.messages.push({field: 'name', message: 'name already used'});
        }

        if (this.dictionaryitem.name && this.dictionarymanager.reservedWords.indexOf(this.dictionaryitem.name.toUpperCase()) >= 0) {
            this.messages.push({field: 'name', message: 'name cannot be used (reserved word)'});
        }

        if (this.itemtype == 't' && !this.dictionaryitem.sysdictionary_ref_id) {
            this.messages.push({field: 'sysdictionary_ref_id', message: 'no ref id defined'});
        }

        if (this.itemtype == 't' && this.dictionaryitem.sysdictionary_ref_id && this.dictionarymanager.dictionaryitems.find(d => d.sysdictionary_ref_id == this.dictionaryitem.sysdictionary_ref_id && d.sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition)) {
            this.messages.push({
                field: 'sysdictionary_ref_id',
                message: 'ref id already used in dictionary definition'
            });
        }

        return this.messages.length == 0;
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
