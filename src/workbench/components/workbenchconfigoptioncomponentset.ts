/**
 * @module WorkbenchModule
 */
import {Component} from '@angular/core';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';

@Component({
    selector: 'workbench-config-option-componentset',
    templateUrl: './src/workbench/templates/workbenchconfigoptioncomponentset.html'
})
export class WorkbenchConfigOptionComponentset {

    public configValues: any = [];
    public option: any = {};

    constructor(private language: language, private view: view) {
    }
}
