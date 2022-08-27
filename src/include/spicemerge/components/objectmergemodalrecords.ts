/**
 * @module ObjectComponents
 */
import {Component} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';

/**
 * renders a list of records if we want to offer the user a choice of duplicates to be selected for the merge
 * this is whenit comes fromt eh duplicates panel
 */
@Component({
    selector: 'object-merge-modal-records',
    templateUrl: '../templates/objectmergemodalrecords.html',
})
export class ObjectMergeModalRecords {

    /**
     * the fields for the list
     *
     * @private
     */
    public listFields: any[] = [];

    constructor(public metadata: metadata, public model: model, public modellist: modellist) {
        let componentconfig = this.metadata.getComponentConfig('ObjectMergeModalRecords', this.model.module);
        let allFields = this.metadata.getFieldSetFields(componentconfig.fieldset);
        for (let listField of allFields) {
            if (!listField.fieldconfig.hidden) {
                this.listFields.push(listField);
            }
        }

    }

    /**
     * reeturns true if called in the context of an active model and the model equasl teh current id
     *
     * @param id
     * @private
     */
    public isCurrentModel(id) {
        return this.model.id && this.model.id == id;
    }

    /**
     * if we have one model set as master as we trigger the process coming form that model
     * this will disable the select option for this column as the main model needs to be part of the merge and cannotbe unselected
     *
     * @param data
     * @private
     */
    public disableSelect(data) {
        if (data.id == this.model.id || !data.acl?.delete) {
            return true;
        } else {
            return false;
        }
    }

}
