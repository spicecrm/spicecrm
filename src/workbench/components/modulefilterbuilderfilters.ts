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
    private modules: string[];
    private modulefilters: any[] = [];

    @Output() private filter: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private backend: backend,
        private language: language,
        private metadata: metadata,
        private modelutilities: modelutilities,
        private session: session
    ) {
        this.modules = this.metadata.getModules().sort();
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

    private goDetail(filter) {
        this.filter.emit(filter);
    }

    private loadLists() {
        this.modulefilters = [];
        if (this.module) {
            this.loading = true;
            this.backend.getRequest('sysmodulefilters/' + this.module).subscribe(filters => {
                this.modulefilters = filters;
                this.loading = false;
            });
        }
    }

    private add() {
        let filter = {
            id: this.modelutilities.generateGuid(),
            module: this.module,
            filterdefs: null,
            created_by_id: this.session.authData.userId,
            name: 'new filter',
            package: '',
            version: ''
        };
        this.modulefilters.push(filter);
        this.filter.emit(filter);
    }
}
