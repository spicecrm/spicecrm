import {
    Component,
    Input,
    AfterViewInit,
    OnInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy,
    ChangeDetectorRef, Pipe
} from '@angular/core';
import {model} from '../../services/model.service';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';


@Pipe({name: 'componentsetmanagermodulepipe'})
export class ComponentsetManagerModulePipe {
    transform(values, module) {
        let retValues = [];
        for(let value of values){
            if(value.module == module){
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
export class WorkbenchConfigOptionFieldset implements OnInit, AfterViewInit{

    component: any = {};
    option: any = {};
    objtype: string = "";

    fieldsets: Array<any> = [];
    modules: Array<any> = [];
    module: string = '';

    constructor(private backend: backend,
                private metadata: metadata,
                private language: language,
                private modelutilities: modelutilities,
                private broadcast: broadcast,
                private toast: toast,
                private cdRef: ChangeDetectorRef,
                private view: view) {

    }

    ngOnInit(){
        if('field' in this.component) this.objtype = "field"
        if('component' in this.component) this.objtype = "component"
    }

    ngAfterViewInit(){
        this.fieldsets = this.metadata.getFieldSets();
        this.modules = this.metadata.getModules();
        this.modules.sort();

        // set the module if a fieldset is set
        if(this.component.componentconfig[this.option.option]){
            this.module = this.metadata.getFieldset(this.component.componentconfig[this.option.option]).module;
        }

        this.cdRef.detectChanges();
    }

    getFieldSets(){
        return this.metadata.getFieldSets();
    }
}