/**
 * @module WorkbenchModule
 */
import {    Component} from '@angular/core';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';

@Component({
    selector: 'workbench-config-option-fieldset',
    templateUrl: './src/workbench/templates/workbenchconfigoptionfieldset.html'
})
export class WorkbenchConfigOptionFieldset {

    public option: any = {};

    constructor(private language: language, private view: view) {
    }
}
