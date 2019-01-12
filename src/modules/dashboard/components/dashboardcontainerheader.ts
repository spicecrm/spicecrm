import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {language} from '../../../services/language.service';
import {dashboardlayout} from '../services/dashboardlayout.service';

@Component({
    selector: 'dashboard-container-header',
    templateUrl: './src/modules/dashboard/templates/dashboardcontainerheader.html'
})
export class DashboardContainerHeader {

    @Input() private showdashboardselector: boolean = false;
    @Output() private showselect: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private dashboardlayout: dashboardlayout, private language: language) {

    }

    private toggleEditMode() {
        this.dashboardlayout.editMode = !this.dashboardlayout.editMode;
    }

    get editable() {
        return this.dashboardlayout.model.checkAccess('edit') && !this.dashboardlayout.editMode;
    }

    get canDelete() {
        return this.dashboardlayout.model.checkAccess('delete');
    }

    private edit() {
        this.dashboardlayout.model.edit();
    }

    private showpanel() {
        this.showselect.emit(true);
    }
}