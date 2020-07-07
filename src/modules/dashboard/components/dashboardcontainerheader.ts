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

/* @ignore */
declare var _;

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
                private backend: backend,
                private view: view,
                private model: model) {
    }

    get editable() {
        return this.metadata.checkModuleAcl(this.model.module, 'create');
    }

    get isHomeDashboard() {
        return this.userpreferences.toUse.home_dashboard == this.model.id;
    }

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

    private toggleHomeDashboard() {
        this.userpreferences.setPreference('home_dashboard', this.isHomeDashboard ? '' : this.model.id, true);
    }

    private editModal() {
        this.model.edit();
    }

    private showpanel() {
        this.showselect.emit(true);
    }

    private saveComponents() {
        this.backend.postRequest('dashboards/' + this.model.id, {}, this.dashboardlayout.dashboardElements)
            .subscribe(()=> {
                this.view.setViewMode();
                this.model.endEdit();
            });
    }

    private cancel() {
        this.view.setViewMode();
        this.model.cancelEdit();
        this.dashboardlayout.dashboardElements = this.model.getField('components');
    }
}
