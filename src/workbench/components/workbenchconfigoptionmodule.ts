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
    templateUrl: '../templates/workbenchconfigoptionmodule.html'
})
export class WorkbenchConfigOptionModule implements AfterViewInit {

    /**
     * the config values passed in from the workbench
     */
    @Input() public configValues: any;


    public option: any = {};
    public objtype: string = "";

    public modules: any[] = [];

    constructor(public backend: backend,
                public metadata: metadata,
                public language: language,
                public modelutilities: modelutilities,
                public broadcast: broadcast,
                public toast: toast,
                public cdRef: ChangeDetectorRef,
                public view: view) {
    }

    public ngAfterViewInit() {
        this.modules = this.metadata.getModules().sort();
        this.cdRef.detectChanges();
    }
}
