/**
 * @module WorkbenchModule
 */
import {
    Component, OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {dictionarymanager} from '../services/dictionarymanager.service';
import {DictionaryDefinition} from "../interfaces/dictionarymanager.interfaces";
import {backend} from "../../services/backend.service";
import {view} from "../../services/view.service";

@Component({
    selector: 'dictionary-manager-usage-modal',
    templateUrl: '../templates/dictionarymanagerusagemodal.html'
})
export class DictionaryManagerUsageModal implements OnInit {

    /**
     * reference to the modal self
     */
    public self: any;

    /**
     * the domain definition
     */
    public dictionarydefinition: DictionaryDefinition;

    /**
     * holds the loaded items
     */
    public dictionaryitems: {definitionname:string, sequence: number }[] = [];

    constructor(public dictionarymanager: dictionarymanager, public metadata: metadata, public modelutilities: modelutilities, public backend: backend) {

    }

    public ngOnInit() {
        this.dictionaryitems = this.dictionarymanager.dictionaryitems.filter(d => d.sysdictionary_ref_id == this.dictionarydefinition.id).map(d => {
            return {
                definitionname: this.dictionarymanager.dictionarydefinitions.find(dd => dd.id == d.sysdictionarydefinition_id)?.name ?? d.id,
                sequence: d.sequence
            }
        }).sort((a, b) => a.definitionname.localeCompare(b.definitionname));
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

}
