import {Component, Input, OnChanges} from '@angular/core';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';
import {toast} from "../../services/toast.service";
import {metadata} from '../../services/metadata.service';
import {view} from "../../services/view.service";

declare var _;

@Component({
    selector: 'dashlet_generator_dashlet-details',
    templateUrl: './src/workbench/templates/dashletgeneratordashletdetails.html',
    providers: [view]
})
export class DashletGeneratorDashletDetails implements OnChanges {

    @Input() public dashlet: any;
    public sysComponents: any[] = [];
    public configValues: any = {};
    private _generic: boolean = false;
    private genericComponent: string = 'DashboardGenericDashlet';

    constructor(
        private backend: backend,
        private language: language,
        private metadata: metadata,
        private toast: toast,
        private view: view,
    ) {
        this.view.setEditMode();
        this.sysComponents = this.metadata.getSystemComponents()
            .filter(component => component.component.toLowerCase().includes('dashlet') && component.component != this.genericComponent);
    }

    set generic(bool) {
        this._generic = bool;
        this.dashlet.component = bool ? this.genericComponent : '';
    }

    get generic() {
        return this._generic;
    }

    public ngOnChanges() {
        if (this.dashlet) {
            this.generic = this.dashlet.component == this.genericComponent;
            this.configValues = this.dashlet.componentconfig ? JSON.parse(this.dashlet.componentconfig) : {};
        }
    }

    private save() {
        this.dashlet.componentconfig = JSON.stringify(this.configValues);
        this.backend.postRequest('dashboards/dashlets/' + this.dashlet.id, {}, this.dashlet)
            .subscribe(res => this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED") + ".", "success"));
    }
}
