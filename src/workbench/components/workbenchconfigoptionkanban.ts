import {Component} from '@angular/core';
import {configurationService} from "../../services/configuration.service";
import {view} from "../../services/view.service";
import {language} from "../../services/language.service";
import {WorkbenchService} from "../services/workbench.service";

@Component({
    selector: 'workbench-config-option-kanban',
    templateUrl: '../templates/workbenchconfigoptionkanban.html'
})

export class WorkbenchConfigOptionKanban {
    public configValues: any = [];
    public option: any = {};
    public disabled: boolean = false;
    public moduleKanbans: any[] = [];

    constructor(private configurationService: configurationService,
                public language: language,
                public workbenchService: WorkbenchService,
                public view: view) {
        this.setModuleKanbans();
    }

    get module(): string {
        return this.workbenchService.activeModule;
    }

    /**
     * set module kanbans
     */
    public setModuleKanbans() {
        this.moduleKanbans = this.configurationService.getData('spicebeanguides')[this.workbenchService.activeModule];
    }
}