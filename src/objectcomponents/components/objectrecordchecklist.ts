/**
 * @module ObjectComponents
 */
import { Component } from '@angular/core';
import { view } from '../../services/view.service';
import { language } from '../../services/language.service';

@Component({
    selector: 'object-record-checklist',
    templateUrl: '../templates/objectrecordchecklist.html',
    providers: [view]
})
export class ObjectRecordChecklist {

    componentconfig: any = {};

    constructor(public language: language) { }

    get checkitems() {
        return this.componentconfig.checkitems ? this.componentconfig.checkitems : [];
    }

    get modelfield() {
        return this.componentconfig.field;
    }

}
