/**
 * @module ModuleDashboard
 */
import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';

@Component({
    selector: '[dashboard-generic-dashlet-row]',
    templateUrl: '../templates/dashboardgenericdashletrow.html',
    providers: [model, view]
})
export class DashboardGenericDashletRow implements OnInit {
    public fieldsetfields: Array<any> = [];
    @Input() public module: string = '';
    @Input() public fieldset: string = '';
    @Input() public data: any = {};

    constructor(public language: language, public metadata: metadata, public model: model, public view: view, public modelutilities: modelutilities) {
        // note editable
        this.view.isEditable = false;

        // hide labels
        this.view.displayLabels = false;
    }

    public ngOnInit() {
        this.model.module = this.module;
        this.model.id = this.data.id;
        this.model.setData(this.data);

        this.fieldsetfields = this.metadata.getFieldSetFields(this.fieldset);
    }

    public trackByFn(index, item) {
        return item.id;
    }
}
