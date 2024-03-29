/**
 * @module WorkbenchModule
 */
import {Component, Input, OnChanges} from '@angular/core';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';
import {toast} from "../../services/toast.service";
import {metadata} from '../../services/metadata.service';
import {view} from "../../services/view.service";

/**
 * @ignore
 */
declare var _;

@Component({
    selector: 'dashlet_generator_dashlet-details',
    templateUrl: '../templates/dashletgeneratordashletdetails.html',
    providers: [view]
})
export class DashletGeneratorDashletDetails implements OnChanges {

    @Input() public dashlet: any;
    public sysModule: string;
    public sysModules: any[] = [];
    public configValues: any = {};

    constructor(
        public backend: backend,
        public language: language,
        public metadata: metadata,
        public toast: toast,
        public view: view,
    ) {
        this.view.setEditMode();
        this.sysModules = this.metadata.getSystemModules();
    }

    get components() {
        return this.metadata.getSystemComponents(this.sysModule);
    }

    public ngOnChanges() {
        if (this.dashlet) {
            let sysComponent = this.metadata.getSystemComponents().find(component => component.component == this.dashlet.component);
            this.sysModule = sysComponent ? sysComponent.module : undefined;
            this.configValues = this.dashlet.componentconfig ? JSON.parse(this.dashlet.componentconfig) : {};
        }
    }

    public save() {
        this.dashlet.componentconfig = JSON.stringify(this.configValues);
        this.backend.postRequest('module/Dashboards/dashlets/' + this.dashlet.id, {}, this.dashlet)
            .subscribe(res => this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED") + ".", "success"));
    }
}
