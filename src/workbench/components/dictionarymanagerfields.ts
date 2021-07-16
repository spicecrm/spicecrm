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
import {DictionaryItem} from "../interfaces/dictionarymanager.interfaces";
import {DomainField} from "../interfaces/domainmanager.interfaces";


@Component({
    selector: 'dictionary-manager-fields',
    templateUrl: './src/workbench/templates/dictionarymanagerfields.html',
})
export class DictionaryManagerFields {

    /**
     * the curretn dictionaryitem
     */
    private dictionaryitem: DictionaryItem;


    constructor(private dictionarymanager: dictionarymanager, private metadata: metadata, private language: language, private modal: modal, private injector: Injector, private modelutilities: modelutilities) {

    }

    /**
     * gets all non deleted entries sorted by name
     */
    get dictionaryitems(): DictionaryItem[] {

        // return an empty array when no DictionaryDefinition is set
        if (!this.dictionarymanager.currentDictionaryDefinition) return [];

        return this.dictionarymanager.getDictionaryDefinitionItems(this.dictionarymanager.currentDictionaryDefinition);

    }

    /**
     * returns the fields for the domain
     *
     * @param domaindefinitionid
     * @private
     */
    private getDomainFields(domaindefinitionid: string, first: boolean = true): DomainField[] {
        let fields = this.dictionarymanager.domainfields.filter(df => df.sysdomaindefinition_id == domaindefinitionid && df.deleted == 0).sort((a, b) => a.sequence > b.sequence ? 1 : -1);
        if (fields) {
            return first ? fields.slice(0, 1) : fields.slice(1);
        } else {
            return [];
        }
    }

    /**
     * return the name of the template
     *
     * @param dictionarydefinitionid
     * @private
     */
    private getRefDefinitionName(dictionarydefinitionid: string) {
        return dictionarydefinitionid != this.dictionarymanager.currentDictionaryDefinition ? this.dictionarymanager.dictionarydefinitions.find(d => d.id == dictionarydefinitionid)?.name : '';
    }

    /**
     * translate the field name
     *
     * @param fieldName
     * @param $dictionaryId
     */
    public translateDomainField(fieldName, dictionaryItem) {
        return fieldName.replace('{sysdictionaryitems.name}', dictionaryItem.name);
    }

}
