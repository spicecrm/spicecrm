import {Component} from '@angular/core';

import {view} from "../../services/view.service";

@Component({
    selector: 'workbench-config-option-boolean',
    templateUrl: './src/workbench/templates/workbenchconfigoptionboolean.html'
})
export class WorkbenchConfigOptionBoolean {

    configValues: any = [];
    option: any = {};
    objtype: string = "";

    constructor(private view: view) {
    }
}