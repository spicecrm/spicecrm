/**
 * @module WorkbenchModule
 */
import {    Component} from '@angular/core';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';

@Component({
    selector: 'workbench-config-option-method',
    templateUrl: '../templates/workbenchconfigoptionmethod.html'
})
export class WorkbenchConfigOptionMethod {

    public option: any = {};
    public configValues = {};
    constructor(public language: language, public view: view) {
    }
}
