import {
    Component,
    Input,
    AfterViewInit,
    OnInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy,
    ChangeDetectorRef
} from '@angular/core';
import {model} from '../../services/model.service';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';

import {Subject} from 'rxjs';
@Component({
    selector: 'workbench-config-option-componentset',
    templateUrl: './app/workbench/templates/workbenchconfigoptioncomponentset.html'
})
export class WorkbenchConfigOptionComponentset implements OnInit, AfterViewInit{

    component: any = {};
    option: any = {};
    objtype: string = "";

    componentsets: Array<any> = [];
    modules: Array<any> = [];
    module: string = '';

    constructor(private backend: backend,
                private metadata: metadata,
                private language: language,
                private modelutilities: modelutilities,
                private broadcast: broadcast,
                private toast: toast,
                private cdRef: ChangeDetectorRef,
                private view: view ) {

    }

    ngOnInit(){
        if('field' in this.component) this.objtype = "field"
        if('component' in this.component) this.objtype = "component"
    }

    ngAfterViewInit(){
        this.componentsets = this.metadata.getComponentSets();

        this.modules = this.metadata.getModules();
        this.modules.sort();

        // set the module if a fieldset is set
        if(this.component.componentconfig[this.option.option]){
            this.module = this.metadata.getComponentSet(this.component.componentconfig[this.option.option]).module;
        }

        this.cdRef.detectChanges();
    }

    getComponentSets(){
        return this.metadata.getComponentSets();
    }
}