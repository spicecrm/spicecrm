/**
 * @module ModulePotentials
 */
import {Component, Input} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";

import {language} from "../../../services/language.service";
import {relatedmodels} from "../../../services/relatedmodels.service";

@Component({
    selector: 'potentials-manager-add-button',
    templateUrl: "../templates/potentialsmanageraddbutton.html",
    providers: [model]
})
export class PotentialsManagerAddButton {

    /**
     * the parent for the new button
     */
    @Input() public parentModel: any;

    /**
     * the product group id
     */
    @Input() public productgroup_id: string = '';
    /**
     * the product group name
     */
    @Input() public productgroup_name: string = '';

    constructor(
        public language: language,
        public metadata: metadata,
        public relatedmodels: relatedmodels,
        public model: model,
    ) {
        this.model.module = 'Potentials';
    }

    /**
     * checks if a potential exists or can be added
     *
     * @param productgroup_id the id of the prodzuctgroup of this record
     */
    get canAddPotential() {

        // check if we can add
        if (!this.metadata.checkModuleAcl('Potentials', 'create')) return true;

        // if related models are loading disable buttons
        if (this.relatedmodels.isloading) return true;

        // otherewise check if we have a record
        let related = this.relatedmodels.items.find(record => record.productgroup_id == this.productgroup_id);
        if (related) {
            return true;
        } else {
            return false;
        }
    }

    public addPotential() {
        let setData = {
            productgroup_id: this.productgroup_id,
            productgroup_name: this.productgroup_name,
            name: this.productgroup_name
        };

        this.model.addModel('', this.parentModel, setData);
    }

}
