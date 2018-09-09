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
import {view} from '../../services/view.service';

import {Subject} from 'rxjs';
@Component({
    selector: 'workbench-config-option-actionset',
    templateUrl: './app/workbench/templates/workbenchconfigoptionactionset.html'
})
export class WorkbenchConfigOptionActionset implements OnInit {

    component: any = {};
    option: any = {};
    objtype: string = "";

    constructor(
        private backend: backend,
        private broadcast: broadcast,
        private language: language,
        private metadata: metadata,
        private modelutilities: modelutilities,
        private toast: toast,
        private view: view
    ) {}

    ngOnInit(){
        if('field' in this.component) this.objtype = "field"
        if('component' in this.component) this.objtype = "component"
    }

    getActionSets() {
        return this.metadata.getActionSets();
    }
}
