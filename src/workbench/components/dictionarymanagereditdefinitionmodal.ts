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
import {backend} from "../../services/backend.service";
import {view} from "../../services/view.service";

@Component({
    selector: 'dictionary-manager-edit-definition-modal',
    templateUrl: '../templates/dictionarymanagereditdefinitionmodal.html',
    providers: [view]
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

    constructor(public dictionarymanager: dictionarymanager, public metadata: metadata, public modelutilities: modelutilities, public backend: backend) {

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
            this.backend.postRequest(`dictionary/definition/${this.dictionarydefinition.id}`, {}, this.dictionarydefinition).subscribe({
                next: (res) => {
                    this.close();
                },
                error: () => {
                    this.close();
                }
            })
           return true;
        });
    }

    /**
     * sets the version
     * @param version
     */
    public setVersion(version: {name: string;}) {
        this.dictionarydefinition.version = version?.name;
    }

    /**
     * sets the package
     * @param packageData
     */
    public setPackage(packageData: {name: string;}) {
        this.dictionarydefinition.package = packageData?.name;
    }
}
