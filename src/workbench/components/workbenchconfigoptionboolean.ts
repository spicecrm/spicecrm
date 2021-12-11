/**
 * @module WorkbenchModule
 */
import {Component} from '@angular/core';

import {view} from "../../services/view.service";

@Component({
    selector: 'workbench-config-option-boolean',
    templateUrl: '../templates/workbenchconfigoptionboolean.html'
})
export class WorkbenchConfigOptionBoolean {

    public configValues: any = [];
    public option: any = {};
    public objtype: string = "";
    public showInfo: boolean = false;

    constructor(public view: view) {
    }
}
