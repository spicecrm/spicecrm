/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
            this.backend.getRequest('sysmodulefilters/' + this.module).subscribe(filters => {
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
            created_by_id: this.session.authData.userId,
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
        this.backend.deleteRequest('sysmodulefilters/' + filter.module + '/' + filter.id);
        this.filters = this.filters.filter(moduleFilter => moduleFilter.id != filter.id);
        this.filter.emit(undefined);
    }
}
