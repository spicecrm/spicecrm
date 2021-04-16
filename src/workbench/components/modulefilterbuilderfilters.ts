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

@Component({
    selector: 'module-builder-filters',
    templateUrl: './src/workbench/templates/modulefilterbuilderfilters.html',
})
export class ModuleFilterBuilderFilters {

    private loading: boolean = false;
    private _module: string = '';
    public modules: string[];
    public filters: any[] = [];
    private activeTab: string = 'global';

    @Output() private filter: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private backend: backend,
        private language: language,
        private metadata: metadata,
        private modelutilities: modelutilities,
        private session: session
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
        return this.filters.filter(filter => filter.scope == 'global');
    }

    get customModulefilters() {
        return this.filters.filter(filter => filter.scope == 'custom');
    }

    private goDetail(filter) {
        this.filter.emit(filter);
    }

    private loadLists() {
        this.filters = [];
        if (this.module) {
            this.loading = true;
            this.backend.getRequest('configuration/sysmodulefilters/' + this.module).subscribe(filters => {
                this.filters = filters;
                this.loading = false;
            });
        }
    }

    private add(scope) {
        let filter = {
            id: this.modelutilities.generateGuid(),
            module: this.module,
            filterdefs: null,
            createdby: this.session.authData.userId,
            name: 'new filter',
            scope: scope,
            package: '',
            version: ''
        };
        this.filters.push(filter);
        this.filter.emit(filter);
    }

    private remove(filter) {
        this.metadata.removeModuleFilter(filter.id);
        this.backend.deleteRequest('configuration/sysmodulefilters/' + filter.module + '/' + filter.id);
        this.filters = this.filters.filter(moduleFilter => moduleFilter.id != filter.id);
        this.filter.emit(undefined);
    }
}
