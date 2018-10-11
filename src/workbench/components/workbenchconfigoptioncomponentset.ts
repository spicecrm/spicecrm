import {
    Component,
    AfterViewInit,
    ChangeDetectorRef
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';

@Component({
    selector: 'workbench-config-option-componentset',
    templateUrl: './src/workbench/templates/workbenchconfigoptioncomponentset.html'
})
export class WorkbenchConfigOptionComponentset implements AfterViewInit {

    public configValues: any = [];
    public option: any = {};
    public objtype: string = "";

    private componentsets: Array<any> = [];
    private modules: Array<any> = [];
    private module: string = '';
    private showInfo: boolean = false;

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
        this.componentsets = this.metadata.getComponentSets();

        this.modules = this.metadata.getModules();
        this.modules.sort();

        // set the module if a fieldset is set
        if (this.configValues[this.option.option]) {
            this.module = this.metadata.getComponentSet(this.configValues[this.option.option]).module;
        }

        this.cdRef.detectChanges();
    }

    private getComponentSets() {
        return this.metadata.getComponentSets();
    }
}
