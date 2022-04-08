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
    templateUrl: '../templates/dashboardcontainerheader.html'
})
export class DashboardContainerHeader {

    @Input() public showdashboardselector: boolean = false;
    @Output() public showselect: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public dashboardlayout: dashboardlayout,
                public language: language,
                public userpreferences: userpreferences,
                public metadata: metadata,
                public modal: modal,
                public backend: backend,
                public view: view,
                public model: model) {
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
    public toggleEditContent() {
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
    public toggleHomeDashboard() {
        this.userpreferences.setPreference('home_dashboard', this.isHomeDashboard ? '' : this.model.id, true);
    }

    /**
     * open edit modal
     * @private
     */
    public editModal() {
        this.model.edit();
    }

    /**
     * set dashboard deleted flag to true
     * @private
     */
    public deleteDashboard() {
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
    public showpanel() {
        this.showselect.emit(true);
    }

    /**
     * save dashboard components
     * @private
     */
    public saveComponents() {
        this.backend.postRequest('module/Dashboards/' + this.model.id + '/components', {}, this.dashboardlayout.dashboardElements)
            .subscribe(()=> {
                this.view.setViewMode();
                this.model.endEdit();
            });
    }

    /**
     * cancel editing dashboard
     * @private
     */
    public cancel() {
        this.view.setViewMode();
        this.model.cancelEdit();
        this.dashboardlayout.dashboardElements = this.model.getField('components');
    }
}
