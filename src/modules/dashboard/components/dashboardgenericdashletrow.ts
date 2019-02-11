import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';

@Component({
    selector: '[dashboard-generic-dashlet-row]',
    templateUrl: './src/modules/dashboard/templates/dashboardgenericdashletrow.html',
    providers: [model, view]
})
export class DashboardGenericDashletRow implements OnInit {
    public fieldsetfields: Array<any> = [];
    @Input() private module: string = '';
    @Input() private fieldset: string = '';
    @Input() private data: any = {};

    constructor(private language: language, private metadata: metadata, private model: model, private view: view, private modelutilities: modelutilities) {
        this.view.isEditable = false;
    }

    public ngOnInit() {
        this.model.module = this.module;
        this.model.id = this.data.id;
        this.model.acl = this.data.acl;
        this.model.data = this.modelutilities.backendModel2spice(this.module, this.data);

        this.fieldsetfields = this.metadata.getFieldSetFields(this.fieldset);
    }

    private trackByFn(index, item) {
        return item.id;
    }
}