import {Component, ChangeDetectorRef} from "@angular/core";
import {modelutilities} from "../../services/modelutilities.service";
import {backend} from "../../services/backend.service";
import {broadcast} from "../../services/broadcast.service";
import {toast} from "../../services/toast.service";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {view} from "../../services/view.service";

@Component({
    selector: "workbench-config-option-actionset",
    templateUrl: "./src/workbench/templates/workbenchconfigoptionmodulefilter.html"
})
export class WorkbenchConfigOptionModulefilter {

    public configValues: any = [];
    public option: any = {};

    public modules: any[] = [];
    public modulefilters: any[] = [];
    private module: string = "";

    private showInfo: boolean = false;

    constructor(
        private backend: backend,
        private broadcast: broadcast,
        private language: language,
        private metadata: metadata,
        private modelutilities: modelutilities,
        private toast: toast,
        private cdRef: ChangeDetectorRef,
        private view: view
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
