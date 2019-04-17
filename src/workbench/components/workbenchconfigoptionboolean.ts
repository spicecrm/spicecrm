/**
 * @module WorkbenchModule
 */
import {Component} from '@angular/core';

import {view} from "../../services/view.service";

@Component({
    selector: 'workbench-config-option-boolean',
    templateUrl: './src/workbench/templates/workbenchconfigoptionboolean.html'
})
export class WorkbenchConfigOptionBoolean {

    public configValues: any = [];
    public option: any = {};
    public objtype: string = "";
    private showInfo: boolean = false;

    constructor(private view: view) {
    }
}
