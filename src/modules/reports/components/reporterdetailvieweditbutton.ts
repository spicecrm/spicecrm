/**
 * @module ModuleReports
 */
import {Component} from '@angular/core';
import {language} from '../../../services/language.service';
import {Router} from "@angular/router";
import {model} from "../../../services/model.service";

@Component({
    selector: 'reporter-detail-view-edit-button',
    templateUrl: './src/modules/reports/templates/reporterdetailvieweditbutton.html'
})
export class ReporterDetailViewEditButton {

    constructor(public language: language, private router: Router, private model: model) {
    }

    /**
     * navigate to reports designer
     */
    private execute() {
        if (this.disabled) return;
        this.router.navigate(['/module/KReports/designer/' + this.model.id]);
    }

    /**
     * set to dsiabled when we are not allowed to edit or we are editing or saving already
     */
    get disabled() {
        if (this.model.data.acl && !this.model.checkAccess('edit')) {
            return true;
        }
        return this.model.isEditing || this.model.isSaving;
    }
}
