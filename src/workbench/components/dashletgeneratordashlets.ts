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
    templateUrl: './src/workbench/templates/dashletgeneratordashlets.html',
})
export class DashletGeneratorDashlets {

    private loading: boolean = false;
    private _module: string = '';
    public modules: string[];
    private dashlets: any[] = [];
    private activeTab: string = 'global';

    @Output() private dashlet: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private backend: backend,
        private language: language,
        private metadata: metadata,
        private modelutilities: modelutilities,
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

    private goDetail(dashlet) {
        this.dashlet.emit(dashlet);
    }

    private add(type) {
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

    private remove(dashletId) {
        this.backend.deleteRequest('module/Dashboards/dashlets/' + dashletId);
        this.dashlets = this.dashlets.filter(dashlet => dashlet.id != dashletId);
        this.dashlet.emit(undefined);
    }
}
