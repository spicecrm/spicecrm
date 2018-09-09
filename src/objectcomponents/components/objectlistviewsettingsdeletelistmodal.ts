/**
 * Created by christian on 08.11.2016.
 */
import {Component, Output, EventEmitter} from '@angular/core';
import {popup} from '../../services/popup.service';
import {modellist} from '../../services/modellist.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-listview-settings-deletelist-modal',
    templateUrl: './app/objectcomponents/templates/objectlistviewsettingsdeletelistmodal.html'
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