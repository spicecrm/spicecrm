/*
SpiceUI 2018.10.001

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
        this.backend.getRequest('dashboards/dashlets').subscribe(dashlets => {
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
        this.backend.deleteRequest('dashboards/dashlets/' + dashletId);
        this.dashlets = this.dashlets.filter(dashlet => dashlet.id != dashletId);
        this.dashlet.emit(undefined);
    }
}
