/**
 * @module ModuleDashboard
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {language} from '../../../services/language.service';
import {dashboardlayout} from '../services/dashboardlayout.service';
import {userpreferences} from "../../../services/userpreferences.service";

@Component({
    selector: 'dashboard-container-header',
    templateUrl: './src/modules/dashboard/templates/dashboardcontainerheader.html'
})
export class DashboardContainerHeader {

    @Input() private showdashboardselector: boolean = false;
    @Output() private showselect: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private dashboardlayout: dashboardlayout, private language: language, private userpreferences: userpreferences) {
    }

    get editable() {
        return this.dashboardlayout.model.checkAccess('edit') && !this.dashboardlayout.editMode;
    }

    get isHomeDashboard() {
        return this.userpreferences.toUse.home_dashboard == this.dashboardlayout.dashboardId;
    }

    private toggleEditMode() {
        this.dashboardlayout.editMode = !this.dashboardlayout.editMode;
    }

    private toggleHomeDashboard() {
        this.userpreferences.setPreference('home_dashboard', this.isHomeDashboard ? '' : this.dashboardlayout.dashboardId, true);
    }

    private edit() {
        this.dashboardlayout.model.edit();
    }

    private showpanel() {
        this.showselect.emit(true);
    }
}
