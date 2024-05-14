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
import {modal} from '../../services/modal.service';

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
    public definitionfiltertermCustom: string;
    public definitionfiltertermGlobal: string;
    public activeDashletCustom: string;
    public activeDashletGlobal: string;

    @Output() public dashlet: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        public backend: backend,
        public language: language,
        public metadata: metadata,
        public modelutilities: modelutilities,
        public modal: modal,
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
        return this.dashlets.filter(dashlet => {
            return dashlet.module == this.module && dashlet.type == 'global' && (!this.definitionfiltertermGlobal || dashlet.name.toLowerCase().includes(this.definitionfiltertermGlobal.toLowerCase()));
        }).sort((a, b) => a.name.localeCompare(b.name, undefined, {'sensitivity': 'base'}));
    }

    get customModuleDashlets() {
        return this.dashlets.filter(dashlet => {
            return dashlet.module == this.module && dashlet.type == 'custom' && (!this.definitionfiltertermCustom || dashlet.name.toLowerCase().includes(this.definitionfiltertermCustom.toLowerCase()));
        }).sort((a, b) => a.name.localeCompare(b.name, undefined, {'sensitivity': 'base'}));
    }

    public goDetail(dashlet) {
        this.dashlet.emit(dashlet);
    }

    public trackByItemFn(item: any): any {
        return item.id;
    }

    public checkActiveElementWhenTabChange() {
        if (this.activeTab === 'custom') {
            this.dashlet.emit(this.dashlets.find(dashlet => dashlet.id === this.activeDashletCustom));
        } else {
            this.dashlet.emit(this.dashlets.find(dashlet => dashlet.id === this.activeDashletGlobal));
        }
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

        this[`activeDashlet${type === 'custom' ? 'Custom' : 'Global' }`] = dashlet.id;
    }

    private dashletRemoval(dashletId) {
        this.backend.deleteRequest('module/Dashboards/dashlets/' + dashletId);
        this.dashlets = this.dashlets.filter(dashlet => dashlet.id != dashletId);
        if (this.activeDashletGlobal === dashletId || this.activeDashletCustom === dashletId) this.dashlet.emit(undefined);
    }

    public remove(dashletId) {
        let dashletToRemove = this.dashlets.find(dashlet => dashlet.id === dashletId);
        let modalMessage = `${this.language.getLabel('MSG_DASHLET_USAGE', '_', 'long')} "${dashletToRemove.component}"`;
        let modalTitle = `${this.language.getLabel('LBL_DELETE')} "${dashletToRemove.name}"?`;

        if(dashletToRemove.componentconfig) { // Only dashlets that are saved in the database have a componentconfig property
            this.modal.confirm(modalMessage, modalTitle, 'warning').subscribe(res => {
                if (res) {
                    this.dashletRemoval(dashletId)
                }
            });
        } else {
            this.dashletRemoval(dashletId)
        }
    }
}