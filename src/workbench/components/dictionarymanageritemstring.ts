/**
 * @module WorkbenchModule
 */
import {
    Component,
    Input
} from '@angular/core';
import {view} from '../../services/view.service';

@Component({
    selector: 'dictionarymanager-item-string',
    templateUrl: './src/workbench/templates/dictionarymanageritemstring.html'
})
export class DictionaryManagerItemString{

    @Input() entry: any = {};
    @Input() field: any = {};

    constructor(private view: view) {
    }

    isEditMode(){
        return this.view.isEditMode();
    }

}