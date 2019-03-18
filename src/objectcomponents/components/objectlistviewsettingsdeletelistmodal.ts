/**
 * @module ObjectComponents
 */

import {Component} from '@angular/core';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-listview-settings-deletelist-modal',
    templateUrl: './src/objectcomponents/templates/objectlistviewsettingsdeletelistmodal.html'
})
export class ObjectListViewSettingsDeletelistModal {

    self: any = {};
    modellist: any = {};

    constructor(private language: language) {
    }

    close() {
        this.self.destroy();
    }

    delete() {
        this.modellist.deleteListType().subscribe(res => {
            this.close();
        })
    }
}