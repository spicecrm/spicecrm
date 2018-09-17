import {
    Component,
    Input,
    AfterViewInit,
    OnInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy, ChangeDetectorRef
} from "@angular/core";
import {model} from "../../services/model.service";
import {modelutilities} from "../../services/modelutilities.service";
import {backend} from "../../services/backend.service";
import {broadcast} from "../../services/broadcast.service";
import {toast} from "../../services/toast.service";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {view} from "../../services/view.service";

import {Subject} from "rxjs";
@Component({
    selector: "workbench-config-option-actionset",
    templateUrl: "./src/workbench/templates/workbenchconfigoptionactionset.html"
})
export class WorkbenchConfigOptionActionset implements OnInit {

    public component: any = {};
    public option: any = {};
    private objtype: string = "";

    private modules: Array<any> = [];
    private module: string = "";

    private actionsets: Array<any> = [];

    constructor(
        private backend: backend,
        private broadcast: broadcast,
        private language: language,
        private metadata: metadata,
        private modelutilities: modelutilities,
        private toast: toast,
        private cdRef: ChangeDetectorRef,
        private view: view
    ) {}

    public ngOnInit() {
        if("field" in this.component){
            this.objtype = "field";
        }
        if("component" in this.component) {
            this.objtype = "component";
        }
    }

    public ngAfterViewInit(){
        this.actionsets = this.metadata.getActionSets();

        this.modules = this.metadata.getModules();
        this.modules.sort();

        // set the module if a fieldset is set
        if(this.component.componentconfig[this.option.option]) {
            this.module = this.metadata.getActionSet(this.component.componentconfig[this.option.option]).module;
        }

        this.cdRef.detectChanges();
    }

    private getActionSets() {
        return this.metadata.getActionSets();
    }
}
