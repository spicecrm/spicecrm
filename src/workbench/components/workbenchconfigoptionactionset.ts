/**
 * @module WorkbenchModule
 */
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
    templateUrl: "./src/workbench/templates/workbenchconfigoptionactionset.html"
})
export class WorkbenchConfigOptionActionset {

    public configValues: any = [];
    public option: any = {};

    private modules: Array<any> = [];
    private module: string = "";

    private actionsets: Array<any> = [];
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
        this.actionsets = this.metadata.getActionSets();

        this.modules = this.metadata.getModules();
        this.modules.sort();

        // set the module if a fieldset is set
        if (this.configValues[this.option.option]) {
            this.module = this.metadata.getActionSet(this.configValues[this.option.option]).module;
        }

        this.cdRef.detectChanges();
    }
}
