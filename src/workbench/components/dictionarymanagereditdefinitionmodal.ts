/**
 * @module WorkbenchModule
 */
import {
    Component
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {dictionarymanager} from '../services/dictionarymanager.service';
import {DictionaryDefinition, DictionaryManagerMessage} from "../interfaces/dictionarymanager.interfaces";

@Component({
    templateUrl: '../templates/dictionarymanagereditdefinitionmodal.html',
})
export class DictionaryManagerEditDefinitionModal {

    /**
     * reference to the modal self
     */
    public self: any;

    /**
     * the domain definition
     */
    public dictionarydefinition: DictionaryDefinition;

    constructor(public dictionarymanager: dictionarymanager, public metadata: metadata, public modelutilities: modelutilities) {

    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * saves the definition changes
     */
    public save() {
        this.dictionarymanager.dictionarydefinitions.some(d => {
           if (d.id != this.dictionarydefinition.id) return false;
           d.package = this.dictionarydefinition.package;
           d.version = this.dictionarydefinition.version;
           d.sysdictionary_contenttype = this.dictionarydefinition.sysdictionary_contenttype;
           return true;
        });

        this.close();
    }
}
