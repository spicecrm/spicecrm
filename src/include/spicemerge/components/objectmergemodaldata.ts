/**
 * @module ObjectComponents
 */
import {Component} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {modellist} from '../../../services/modellist.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';

import {objectmerge} from '../services/objectmerge.service';

/**
 * renders the content for the selection of the ducpliate fields and how they are to be merged
 */
@Component({
    selector: 'object-merge-modal-data',
    templateUrl: '../templates/objectmergemodaldata.html',
    providers: [view]
})
export class ObjectMergeModalData {

    constructor(public view: view, public metadata: metadata, public modellist: modellist, public objectmerge: objectmerge, public model: model) {
        this.view.displayLabels = false;
    }

    /**
     * simple getter to check if a switch of the master is allowed
     */
    get canSwitchMaster() {
        return this.objectmerge.allowSwitchMaster;
    }

    /**
     * returns the selected items from teh listview
     *
     * @private
     */
    public getSelected() {
        return this.modellist.listData.list.filter(i => i.selected);
    }

    /**
     * reeturns true if called in the context of an active model and the model equasl teh current id
     *
     * @param id
     * @private
     */
    public isCurrentModel(id) {
        return this.model.id && (this.model.id == id);
    }

    /**
     * selects all fields
     * @param id
     * @private
     */
    public selectAllFields(id) {
        this.objectmerge.setAllfieldSources(id);
    }

    public showField(field) {
        for (let selected of this.getSelected()) {
            if (selected[field.name] != '') {
                return true;
            }
        }
        return false;
    }
}
