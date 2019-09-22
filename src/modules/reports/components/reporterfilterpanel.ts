/**
 * @module ModuleReports
 */
import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';

import {reporterconfig} from '../services/reporterconfig';
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
    selector: 'reporter-filter-panel',
    templateUrl: './src/modules/reports/templates/reporterfilterpanel.html'
})
export class ReporterFilterPanel {

    @Output() private filtersaved: EventEmitter<any> = new EventEmitter<any>();
    @Input() private integrationparams: any = {};

    constructor(private model: model, private language: language, private reporterconfig: reporterconfig) {

    }

    get whereConditions() {
        return this.reporterconfig.userFilters;
    }

    private saveFilter() {
        this.filtersaved.emit(true);
        this.reporterconfig.refresh();
    }


    get displaySavedFilters() {

        if (this.integrationparams.activePlugins) {
            for (let plugin in this.integrationparams.activePlugins) {
                switch (plugin) {
                    case 'ksavedfilters':
                        return true;
                }
            }
        }

        return false;
    }

}