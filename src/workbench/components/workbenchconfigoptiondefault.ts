/**
 * @module WorkbenchModule
 */
import {Component, Input, OnInit} from '@angular/core';
import {view} from '../../services/view.service';

/**
 * the default wokbench Option
 */
@Component({
    selector: 'workbench-config-option-default',
    templateUrl: './src/workbench/templates/workbenchconfigoptiondefault.html'
})
export class WorkbenchConfigOptionDefault {

    /**
     * the config values passed in from the workbench
     */
    @Input() public configValues: any = [];

    /**
     * the option from the workbench
     */
    public option: any = {};

    /**
     * inidcator if the info shoudl be shown
     */
    public showInfo: boolean = false;

    constructor(public view: view) {
    }

    get optionValue(){
        return this.configValues[this.option.option];
    }

    set optionValue(value){
        this.configValues[this.option.option] = value;
    }
}
