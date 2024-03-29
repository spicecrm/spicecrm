/**
 * @module WorkbenchModule
 */
import {Component, ChangeDetectorRef} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {view} from "../../services/view.service";

@Component({
    selector: "workbench-config-option-module-filter",
    templateUrl: "../templates/workbenchconfigoptionmodulefilter.html"
})
export class WorkbenchConfigOptionModulefilter {

    public configValues: any = [];
    public option: any = {};

    public modules: any[] = [];
    public modulefilters: any[] = [];
    public module: string = "";

    constructor(
        public language: language,
        public metadata: metadata,
        public cdRef: ChangeDetectorRef,
        public view: view
    ) {
    }

    public ngAfterViewInit() {
        this.modulefilters = this.metadata.getModuleFilters();
        this.modules = this.metadata.getModules();
        this.modules.sort();

        // set the module if a fieldset is set
        if (this.configValues[this.option.option] && this.metadata.getModuleFilter(this.configValues[this.option.option])) {
            this.module = this.metadata.getModuleFilter(this.configValues[this.option.option]).module;
        }
        this.cdRef.detectChanges();
    }
}
