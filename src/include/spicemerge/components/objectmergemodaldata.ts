/**
 * @module ObjectComponents
 */
import {Component} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {modellist} from '../../../services/modellist.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';

import {objectmerge} from '../services/objectmerge.service';

@Component({
    selector: 'object-merge-modal-data',
    templateUrl: './src/include/spicemerge/templates/objectmergemodaldata.html',
    providers: [view]
})
export class ObjectMergeModalData {

    private modelFields: any = {};

    constructor(private language: language, private metadata: metadata, private modellist: modellist, private objectmerge: objectmerge) {

    }

    private getSelected() {
        let selItems = [];
        for (let listItem of this.modellist.listData.list) {
            if (listItem.selected) {
                selItems.push(listItem);
            }
        }
        return selItems;
    }

    private selectAllFields(id) {
        this.objectmerge.setAllfieldSources(id);
    }

    private showField(field) {
        for (let selected of this.getSelected()) {
            if (selected[field.name] != '') {
                return true;
            }
        }
        return false;
    }
}
