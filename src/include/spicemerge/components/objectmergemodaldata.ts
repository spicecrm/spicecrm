/**
 * @module ObjectComponents
 */
import {Component} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {modellist} from '../../../services/modellist.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {objectmerge} from '../services/objectmerge.service';

/** @ignore */
declare var _;

/**
 * renders the content for the selection of the ducpliate fields and how they are to be merged
 */
@Component({
    selector: 'object-merge-modal-data',
    templateUrl: '../templates/objectmergemodaldata.html',
    providers: [view]
})
export class ObjectMergeModalData {

    constructor(public view: view,
                public metadata: metadata,
                public modellist: modellist,
                public objectmerge: objectmerge,
                public model: model) {
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

    /**
     * shows/hides fields in template
     * hides assigned_user_id and address fields from the template
     * displays non-db address field (i.e. primary_address)
     * @param field
     */
    public showField(field): boolean {

        for (let selected of this.getSelected()) {

            // check if field or object is set (i.e. date object)
            const notEmpty = (!!selected[field.name] && !_.isObject(selected[field.name])) || _.isObject(selected[field.name]) && !_.isEmpty(selected[field.name]);

            if (notEmpty) {
                return !(field.name == 'assigned_user_id' || field.name == 'parent_id' || this.isAddressField(field.name));
                // show address non-db field instead of the address fields
            } else if (this.isAddressGroupField(field)) {
                const addressFieldsFilled = Object.keys(selected).some(fieldName => fieldName.startsWith(`${field.name}_`) && !!selected[fieldName]);
                if (addressFieldsFilled) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * returns true if the given field is an address field
     * @param field
     */
    public isAddressField(field: string): boolean {
        return field.includes('_address_');
    }

    /**
     * set merge source name equals the selected field and value equals the bean id from the selected source
     * @param fieldDef
     * @param mergeSourceId
     */
    public setMergeSource(fieldDef: {name: string, source: 'non-db'}, mergeSourceId: string) {
        if (this.isAddressGroupField(fieldDef)) {
            this.objectmerge.mergeFields.forEach((f: {name: string, source: 'non-db'}) => {
                if (!f.name.startsWith(`${fieldDef.name}_`)) return;
                this.objectmerge.mergeSource[f.name] = mergeSourceId;
            });
        } else {
            this.objectmerge.mergeSource[fieldDef.name] = mergeSourceId;
        }
    }

    /**
     * check if the given field is a non-db address field e.g. primary_address
     * @param fieldDef
     */
    public isAddressGroupField(fieldDef: {name: string, source: 'non-db'}): boolean {
        return fieldDef.name.endsWith('_address') && fieldDef.source == 'non-db';
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param i
     * @return number
     */
    public trackByFn(i: number): number {
        return i;
    }
}
