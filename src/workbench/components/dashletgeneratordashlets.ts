/**
 * @module WorkbenchModule
 */
import {
    Component, Output, EventEmitter
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {modelutilities} from '../../services/modelutilities.service';

@Component({
    selector: 'dashlet-generator-dashlets',
    templateUrl: '../templates/dashletgeneratordashlets.html',
})
export class DashletGeneratorDashlets {

    public loading: boolean = false;
    public _module: string = '';
    public modules: string[];
    public dashlets: any[] = [];
    public activeTab: string = 'global';

    @Output() public dashlet: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        public backend: backend,
        public language: language,
        public metadata: metadata,
        public modelutilities: modelutilities,
    ) {
        this.modules = this.metadata.getModules();
        this.modules.sort();
    }

    public ngOnInit() {
        this.loading = true;
        this.backend.getRequest('module/Dashboards/dashlets').subscribe(dashlets => {
            this.dashlets = dashlets;
            this.loading = false;
        });
    }

    get module() {
        return this._module;
    }

    set module(module) {
        if (module != this._module) {
            this._module = module;
            this.dashlet.emit(null);
        }
    }

    get moduleDashlets() {
        return this.dashlets.filter(dashlet => dashlet.module == this.module && dashlet.type == 'global');
    }

    get customModuleDashlets() {
        return this.dashlets.filter(dashlet => dashlet.module == this.module && dashlet.type == 'custom');
    }

    public goDetail(dashlet) {
        this.dashlet.emit(dashlet);
    }

    public add(type) {
        let dashlet = {
            id: this.modelutilities.generateGuid(),
            name: 'new dashlet',
            component: 'DashboardGenericDashlet',
            module: this.module,
            type: type,
            componentconfig: null,
            icon: '',
            description: '',
            acl_action: '',
            label: ''
        };
        this.dashlets.push(dashlet);
        this.dashlet.emit(dashlet);
    }

    public remove(dashletId) {
        this.backend.deleteRequest('module/Dashboards/dashlets/' + dashletId);
        this.dashlets = this.dashlets.filter(dashlet => dashlet.id != dashletId);
        this.dashlet.emit(undefined);
    }
}
