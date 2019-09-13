/**
 * @module ModuleSalesPlanning
 */
import {Component} from '@angular/core';
import {language} from '../../../services/language.service';

@Component({
    selector: 'sales-planning-tool-header',
    templateUrl: './src/modules/salesplanning/templates/salesplanningtoolheader.html'
})

export class SalesPlanningToolHeader {

    constructor(private language: language) {
    }
}
