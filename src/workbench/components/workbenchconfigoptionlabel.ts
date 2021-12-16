/**
 * @module WorkbenchModule
 */
import {Component, OnInit} from '@angular/core';
import {view} from '../../services/view.service';

@Component({
    selector: 'workbench-config-option-label',
    templateUrl: '../templates/workbenchconfigoptionlabel.html'
})
export class WorkbenchConfigOptionLabel {

    public configValues: any = [];
    public option: any = {};

    constructor(public view: view) {
    }
}
