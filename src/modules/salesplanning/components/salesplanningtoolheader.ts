/**
 * @module ModuleSalesPlanning
 */
import {Component} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from "../../../services/model.service";
import {SalesPlanningService} from "../services/salesplanning.service";
import {take} from "rxjs/operators";
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: 'sales-planning-tool-header',
    templateUrl: './src/modules/salesplanning/templates/salesplanningtoolheader.html'
})

export class SalesPlanningToolHeader {

    constructor(private metadata: metadata, private language: language, private model: model, private planningService: SalesPlanningService) {
    }

    get breadcrumbs() {
        return this.planningService.selectedCharacteristics;
    }

    get canEdit() {
        return this.metadata.checkModuleAcl(this.model.module, 'edit');
    }

    private edit() {
        this.model.edit();
    }
}
