/**
 * @module ModuleReports
 */
import {Component} from '@angular/core';
import {language} from '../../../services/language.service';
import {Router} from "@angular/router";
import {model} from "../../../services/model.service";

@Component({
    selector: 'reporter-detail-view-edit-button',
    templateUrl: '../templates/reporterdetailvieweditbutton.html'
})
export class ReporterDetailViewEditButton {

    constructor(public language: language, public router: Router, public model: model) {
    }

    /**
     * navigate to reports designer
     */
    public execute() {
        if (this.disabled) return;
        this.router.navigate(['/module/KReports/designer/' + this.model.id]);
    }

    /**
     * set to dsiabled when we are not allowed to edit or we are editing or saving already
     */
    get disabled() {
        if (!this.model.checkAccess('edit')) {
            return true;
        }
        return this.model.isEditing || this.model.isSaving;
    }
}
