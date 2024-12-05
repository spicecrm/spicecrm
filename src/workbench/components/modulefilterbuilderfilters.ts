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
import {session} from '../../services/session.service';
import {configurationService} from "../../services/configuration.service";
import {modal} from "../../services/modal.service";

@Component({
    selector: 'module-builder-filters',
    templateUrl: '../templates/modulefilterbuilderfilters.html',
})
export class ModuleFilterBuilderFilters {

    public loading: boolean = false;
    public _module: string = '';
    public modules: string[];
    public filters: any[] = [];
    public activeTab: string = 'global';
    public definitionfiltertermCustom: string;
    public definitionfiltertermGlobal: string;
    public activeFilterCustom: string;
    public activeFilterGlobal: string;

    @Output() public filter: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        public backend: backend,
        public language: language,
        public metadata: metadata,
        public modelutilities: modelutilities,
        public session: session,
        private configurationService: configurationService,
        public modal: modal,
    ) {
        this.modules = this.metadata.getModules();
        this.modules.sort();
    }

    get module() {
        return this._module;
    }

    set module(module) {
        if (module != this._module) {
            this._module = module;
            this.filter.emit(null);
            this.loadLists();
        }
    }

    get modulefilters() {
        return this.filters.filter(filter => {
            return filter.module == this.module && filter.scope == 'global' && (!this.definitionfiltertermGlobal || filter.name.toLowerCase().includes(this.definitionfiltertermGlobal.toLowerCase()));
        }).sort((a, b) => a.name.localeCompare(b.name, undefined, {'sensitivity': 'base'}));
    }

    get customModulefilters() {
        return this.filters.filter(filter => {
            return filter.module == this.module && filter.scope == 'custom' && (!this.definitionfiltertermCustom || filter.name.toLowerCase().includes(this.definitionfiltertermCustom.toLowerCase()));
        }).sort((a, b) => a.name.localeCompare(b.name, undefined, {'sensitivity': 'base'}));
    }

    public goDetail(filter) {
        this.filter.emit(filter);
    }

    public loadLists() {
        this.filters = [];
        if (this.module) {
            this.loading = true;
            this.backend.getRequest('configuration/sysmodulefilters/' + this.module).subscribe(filters => {
                this.filters = filters;
                this.loading = false;
            });
        }
    }

    public trackByItemFn(item: any): any {
        return item.id;
    }

    public checkActiveElementWhenTabChange() {
        if (this.activeTab === 'custom') {
            this.filter.emit(this.filters.find(dashlet => dashlet.id === this.activeFilterCustom));
        } else {
            this.filter.emit(this.filters.find(dashlet => dashlet.id === this.activeFilterGlobal));
        }
    }

    public add(scope) {
        let filter = {
            id: this.modelutilities.generateGuid(),
            module: this.module,
            filterdefs: null,
            created_by_id: this.session.authData.userId,
            name: 'new filter',
            scope: scope,
            package: '',
            version: ''
        };
        this.filters.push(filter);
        this.filter.emit(filter);

        this[`activeFilter${scope === 'custom' ? 'Custom' : 'Global' }`] = filter.id;
    }

    public filterRemoval(filter) {
        this.metadata.removeModuleFilter(filter.id);
        this.backend.deleteRequest('configuration/sysmodulefilters/' + filter.module + '/' + filter.id).subscribe(() => {
            this.configurationService.reloadTaskData('modulefilters');
        });
        this.filters = this.filters.filter(moduleFilter => moduleFilter.id != filter.id);
        if (this.activeFilterGlobal === filter.id || this.activeFilterCustom === filter.id) this.filter.emit(undefined);
    }

    public remove(filterParam) {
        let filterToRemove = this.filters.find(filter => filter.id === filterParam.id);
        let modalMessage =this.language.getLabel('MSG_FILTER_REMOVAL', '_', 'long');
        let modalTitle = `${this.language.getLabel('LBL_DELETE')} "${filterToRemove.name}"?`;

        if(filterParam.filterdefs) {
            this.modal.confirm(modalMessage, modalTitle, 'warning').subscribe(res => {
                if(res) {
                    this.filterRemoval(filterParam);
                }
            })
        } else {
            this.filterRemoval(filterParam);
        }
    }
}
