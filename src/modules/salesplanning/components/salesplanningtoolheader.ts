/**
 * @module ModuleSalesPlanning
 */
import {Component} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from "../../../services/model.service";
import {SalesPlanningService} from "../services/salesplanning.service";

@Component({
    selector: 'sales-planning-tool-header',
    templateUrl: './src/modules/salesplanning/templates/salesplanningtoolheader.html'
})

export class SalesPlanningToolHeader {

    constructor(private language: language, private model: model, private planningService: SalesPlanningService) {
    }

    get breadcrumbs() {
        return this.planningService.selectedCharacteristics;
    }
}
