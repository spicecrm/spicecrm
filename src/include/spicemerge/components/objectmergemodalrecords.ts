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
    templateUrl: './src/include/spicemerge/templates/objectmergemodalrecords.html',
})
export class ObjectMergeModalRecords {

    /**
     * the fields for the list
     *
     * @private
     */
    private listFields: any[] = [];

    constructor(private metadata: metadata, private model: model, private modellist: modellist) {
        let componentconfig = this.metadata.getComponentConfig('ObjectMergeModalRecords', this.model.module);
        let allFields = this.metadata.getFieldSetFields(componentconfig.fieldset);
        for (let listField of allFields) {
            if (listField.fieldconfig.default !== false) {
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
    private isCurrentModel(id) {
        return this.model.id && this.model.id == id;
    }

    /**
     * if we have one model set as master as we trigger the process coming form that model
     * this will disable the select option for this column as the main model needs to be part of the merge and cannotbe unselected
     *
     * @param data
     * @private
     */
    private disableSelect(data) {
        if (data.id == this.model.id || !data.acl?.delete) {
            return true;
        } else {
            return false;
        }
    }

}
