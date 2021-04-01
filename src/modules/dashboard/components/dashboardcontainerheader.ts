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
 * @module ModuleDashboard
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {language} from '../../../services/language.service';
import {dashboardlayout} from '../services/dashboardlayout.service';
import {userpreferences} from "../../../services/userpreferences.service";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {modal} from "../../../services/modal.service";

/* @ignore */
declare var _;

/**
 * dashboard header to allow managing the dashboard and its content.
 */
@Component({
    selector: 'dashboard-container-header',
    templateUrl: './src/modules/dashboard/templates/dashboardcontainerheader.html'
})
export class DashboardContainerHeader {

    @Input() private showdashboardselector: boolean = false;
    @Output() private showselect: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private dashboardlayout: dashboardlayout,
                private language: language,
                private userpreferences: userpreferences,
                private metadata: metadata,
                private modal: modal,
                private backend: backend,
                private view: view,
                private model: model) {
    }

    /**
     * check if we can delete
     */
    get deletable() {
        return this.metadata.checkModuleAcl(this.model.module, 'delete');
    }

    /**
     * check if we can edit
     */
    get editable() {
        return this.metadata.checkModuleAcl(this.model.module, 'edit');
    }

    /**
     * check if this dashboard is set to the default home dashboard
     */
    get isHomeDashboard() {
        return this.userpreferences.toUse.home_dashboard == this.model.id;
    }

    /**
     * toggle editing the content
     * @private
     */
    private toggleEditContent() {
        if (this.view.isEditMode()) {
            this.cancel();
        } else {
            // clone the elements before start editing to ensure a successful backup
            this.dashboardlayout.dashboardElements = JSON.parse(JSON.stringify(this.dashboardlayout.dashboardElements));
            this.view.setEditMode();
            this.model.startEdit();
            this.dashboardlayout.calculateGrid();
        }
    }

    /**
     * toggle setting the home dashboard to user preferences
     * @private
     */
    private toggleHomeDashboard() {
        this.userpreferences.setPreference('home_dashboard', this.isHomeDashboard ? '' : this.model.id, true);
    }

    /**
     * open edit modal
     * @private
     */
    private editModal() {
        this.model.edit();
    }

    /**
     * set dashboard deleted flag to true
     * @private
     */
    private deleteDashboard() {
        this.modal.confirmDeleteRecord().subscribe(answer => {
            if (!answer) return;
            this.model.delete().subscribe(() => {
                this.dashboardlayout.dashboardId = undefined;
                this.model.reset();
                this.model.module = 'Dashboards';
            });
        });
    }

    /**
     * show dashboards panel
     * @private
     */
    private showpanel() {
        this.showselect.emit(true);
    }

    /**
     * save dashboard components
     * @private
     */
    private saveComponents() {
        this.backend.postRequest('dashboards/' + this.model.id, {}, this.dashboardlayout.dashboardElements)
            .subscribe(()=> {
                this.view.setViewMode();
                this.model.endEdit();
            });
    }

    /**
     * cancel editing dashboard
     * @private
     */
    private cancel() {
        this.view.setViewMode();
        this.model.cancelEdit();
        this.dashboardlayout.dashboardElements = this.model.getField('components');
    }
}
