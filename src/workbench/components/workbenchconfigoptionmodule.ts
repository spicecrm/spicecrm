/**
 * @module WorkbenchModule
 */
import {
    Component,
    AfterViewInit,
    ChangeDetectorRef, Input
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {view} from "../../services/view.service";

@Component({
    selector: 'workbench-config-option-componentset',
    templateUrl: './src/workbench/templates/workbenchconfigoptionmodule.html'
})
export class WorkbenchConfigOptionModule implements AfterViewInit {

    /**
     * the config values passed in from the workbench
     */
    @Input() public configValues: any;


    public option: any = {};
    public objtype: string = "";

    private modules: any[] = [];

    constructor(private backend: backend,
                private metadata: metadata,
                private language: language,
                private modelutilities: modelutilities,
                private broadcast: broadcast,
                private toast: toast,
                private cdRef: ChangeDetectorRef,
                private view: view) {
    }

    public ngAfterViewInit() {
        this.modules = this.metadata.getModules().sort();
        this.cdRef.detectChanges();
    }
}
