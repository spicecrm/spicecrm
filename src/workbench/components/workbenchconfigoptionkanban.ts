import {Component, OnInit} from '@angular/core';
import {configurationService} from "../../services/configuration.service";
import {view} from "../../services/view.service";
import {language} from "../../services/language.service";

@Component({
    selector: 'workbench-config-option-kanban',
    templateUrl: '../templates/workbenchconfigoptionkanban.html'
})

export class WorkbenchConfigOptionKanban implements OnInit {
    public configValues: any = [];
    public option: any = {};
    public disabled: boolean = false;
    public moduleKanbans: any[] = [];
    public module: string;

    constructor(private configurationService: configurationService,
                public language: language,
                public view: view) {
    }

    public ngOnInit() {
        this.setModuleKanbans();
    }

    /**
     * set module kanbans
     */
    public setModuleKanbans() {
        this.moduleKanbans = this.configurationService.getData('spicebeanguides')[this.module];
    }
}