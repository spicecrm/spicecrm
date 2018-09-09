import {Component, AfterViewInit, OnInit, OnDestroy, OnChanges, ViewChild, ViewContainerRef, ElementRef, Input} from '@angular/core';
import {model} from '../../../services/model.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {toast} from '../../../services/toast.service';

@Component({
    selector: '[dashboard-generic-dashlet-row]',
    templateUrl: './app/modules/dashboard/templates/dashboardgenericdashletrow.html',
    providers: [model, view]
})
export class DashboardGenericDashletRow implements OnInit {
    @Input() module: string = '';
    @Input() fieldset: string = '';
    @Input() data: any = {};
    fieldsetfields: Array<any> = [];

    constructor(private language: language, private metadata: metadata, private model: model, private view: view, private modelutilities: modelutilities) {
        this.view.isEditable = false;
    }

    ngOnInit() {
        this.model.module = this.module;
        this.model.id = this.data.id;
        this.model.acl = this.data.acl;
        this.model.data = this.modelutilities.backendModel2spice(this.module, this.data);

        this.fieldsetfields = this.metadata.getFieldSetFields(this.fieldset);
    }
}