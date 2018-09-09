import {
    Component,
    Input,
    AfterViewInit,
    OnInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy
} from '@angular/core';
import {model} from '../../services/model.service';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

import {Subject} from 'rxjs';
import {view} from "../../services/view.service";
@Component({
    selector: 'workbench-config-option-boolean',
    templateUrl: './src/workbench/templates/workbenchconfigoptionboolean.html'
})
export class WorkbenchConfigOptionBoolean implements OnInit {

    component: any = {};
    option: any = {};
    objtype: string = "";

    constructor(private backend: backend,
                private metadata: metadata,
                private language: language,
                private modelutilities: modelutilities,
                private broadcast: broadcast,
                private toast: toast,
                private view: view) {

    }

    ngOnInit(){
        if('field' in this.component) this.objtype = "field"
        if('component' in this.component) this.objtype = "component"
    }
}