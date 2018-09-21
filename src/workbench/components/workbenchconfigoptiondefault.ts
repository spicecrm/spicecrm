import {Component} from '@angular/core';
import {view} from '../../services/view.service';

@Component({
    selector: 'workbench-config-option-default',
    templateUrl: './src/workbench/templates/workbenchconfigoptiondefault.html'
})
export class WorkbenchConfigOptionDefault {

    configValues: any = [];
    option: any = {};

    constructor(private view: view) {
    }
}