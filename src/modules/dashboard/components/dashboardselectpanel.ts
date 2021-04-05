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
 * @module ModuleDashboard
 */
import {
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    EventEmitter,
    Injector,
    Output,
    ReflectiveInjector, ViewContainerRef
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {language} from '../../../services/language.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {dashboardlayout} from '../services/dashboardlayout.service';

@Component({
    selector: 'dashboard-select-panel',
    templateUrl: './src/modules/dashboard/templates/dashboardselectpanel.html',
    providers: [model]
})
export class DashboardSelectPanel {

    private dashboardFilter: string = '';
    @Output() private hide: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() private dashboardSelect: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private vcr: ViewContainerRef,private metadata: metadata, private userpreferences: userpreferences, private language: language, private model: model, private modellist: modellist, private dashboardlayout: dashboardlayout, private cfr: ComponentFactoryResolver) {

    }

    get dashboards(): any[] {
        let dashboards: any[] = [];
        for (let dashboard of this.modellist.listData.list) {
            if (dashboard.id == this.dashboardlayout.dashboardId || this.dashboardFilter == '' || (this.dashboardFilter != '' && dashboard.name.toLowerCase().indexOf(this.dashboardFilter.toLowerCase()) != -1)) {
                dashboards.push(dashboard);
            }
        }
        return dashboards;
    }

    get canAdd() {
        return this.metadata.checkModuleAcl('Dashboards', 'create');
    }

    private getActiveClass(id) {
        return id == this.dashboardlayout.dashboardId ? 'slds-is-active' : '';
    }

    private setDashboard(dashboard) {
        // save the preference
        this.userpreferences.setPreference('last_dashboard', dashboard.id);
        this.dashboardSelect.emit(dashboard.id);
        this.hidepanel();
    }

    private hidepanel() {
        this.hide.emit(true);
    }

    private trackByFn(index, item) {
        return item.id;
    }
}
