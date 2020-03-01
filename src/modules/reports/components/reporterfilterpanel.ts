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

/**
 * renders a panel with the dynamic filters for a report
 */
@Component({
    selector: 'reporter-filter-panel',
    templateUrl: './src/modules/reports/templates/reporterfilterpanel.html'
})
export class ReporterFilterPanel {

    /**
     * an event emitter that emits when the filter is applied
     */
    @Output() private filterapplied: EventEmitter<any> = new EventEmitter<any>();

    /**
     * the integration params
     */
    @Input() private integrationparams: any = {};

    constructor(private model: model, private language: language, private reporterconfig: reporterconfig) {

    }

    get whereConditions() {
        return this.reporterconfig.userFilters;
    }

    /**
     * when the filter is to be applied
     */
    private applyFilter() {
        this.filterapplied.emit(true);
        this.reporterconfig.refresh();
    }

    /**
     * checks if the plugin to save filters is enabled for the report
     */
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
