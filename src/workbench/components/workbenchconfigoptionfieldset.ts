/**
 * @module WorkbenchModule
 */
import {
    Component,
    AfterViewInit,
    ChangeDetectorRef, Pipe
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';


@Pipe({name: 'componentsetmanagermodulepipeglobal'})
export class ComponentsetManagerModulePipeGlobal {
    public transform(values, module) {
        let retValues = [];
        for (let value of values) {
            if (value.module == module && value.type == "global") {
                retValues.push(value);
            }
        }
        return retValues;
    }
}

@Pipe({name: 'componentsetmanagermodulepipecustom'})
export class ComponentsetManagerModulePipeCustom {
    public transform(values, module) {
        let retValues = [];
        for (let value of values) {
            if (value.module == module && value.type == "custom") {
                retValues.push(value);
            }
        }
        return retValues;
    }
}


@Component({
    selector: 'workbench-config-option-fieldset',
    templateUrl: './src/workbench/templates/workbenchconfigoptionfieldset.html'
})
export class WorkbenchConfigOptionFieldset implements AfterViewInit {

    public configValues: any = [];
    public option: any = {};
    public objtype: string = "";

    private fieldsets: Array<any> = [];
    private modules: Array<any> = [];
    private module: string = '';

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
        this.fieldsets = this.metadata.getFieldSets();
        this.modules = this.metadata.getModules();
        this.modules.sort();

        // set the module if a fieldset is set
        if (this.configValues[this.option.option]) {
            this.module = this.metadata.getFieldset(this.configValues[this.option.option]).module;
        }

        this.cdRef.detectChanges();
    }

    private getFieldSets(type = undefined) {
        return this.metadata.getFieldSets();




        // if (!type) {
        //     return this.metadata.getFieldSets(this.currentModule);
        // } else {
        //     let retArray = [];
        //     let fieldsets = this.metadata.getFieldSets(this.currentModule);
        //
        //     for (let fieldset of fieldsets) {
        //         if (fieldset.type == type) {
        //             retArray.push(fieldset);
        //         }
        //     }
        //
        //     return retArray;
        // }
    }
}
