/**
 * @module ObjectComponents
 */
import { Component} from '@angular/core';
import {view} from '../../services/view.service';

@Component({
    selector: 'object-record-checklist',
    templateUrl: './src/objectcomponents/templates/objectrecordchecklist.html',
    providers: [view]
})
export class ObjectRecordChecklist {

    componentconfig: any = {};

    get checkitems(){
        return this.componentconfig.checkitems ? this.componentconfig.checkitems : [];
    }

    get modelfield(){
        return this.componentconfig.field;
    }

}