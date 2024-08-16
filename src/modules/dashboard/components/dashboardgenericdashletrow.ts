/**
 * @module ModuleDashboard
 */
import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {layout} from "../../../services/layout.service";
import {language} from "../../../services/language.service";

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
    /**
     * expanded boolean for mobile view
     */
    public expanded: boolean = false;

    constructor(public metadata: metadata,
                public model: model,
                public view: view,
                public language: language,
                public layout: layout) {
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
        this.model.evaluateValidationRules(null, 'initialize');
        this.model.initializeFieldsAlertStyles(this.data);
    }

    public trackByFn(index, item) {
        return item.id;
    }

    /**
     * toggle expanded for mobile view
     * @param e
     */
    public toggleExpanded(e: MouseEvent) {
        e.stopPropagation();
        this.expanded = !this.expanded;
    }
}
