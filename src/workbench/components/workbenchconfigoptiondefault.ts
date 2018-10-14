import {Component, OnInit} from '@angular/core';
import {view} from '../../services/view.service';

@Component({
    selector: 'workbench-config-option-default',
    templateUrl: './src/workbench/templates/workbenchconfigoptiondefault.html'
})
export class WorkbenchConfigOptionDefault {

    public configValues: any = [];
    public option: any = {};
    private showInfo: boolean = false;

    constructor(private view: view) {
    }
}
