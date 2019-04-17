/**
 * @module ModuleReports
 */
import {
    Component
} from '@angular/core';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';

/**
 * renders the reporter cockpit
 */
@Component({
    selector: 'reporter-cockpit',
    templateUrl: './src/modules/reports/templates/reportercockpit.html'
})
export class ReporterCockpit {

    /**
     * holds the cockpits returned from teh abckend in which reports are sorted in
     */
    private cockpits: any[] = [];

    constructor(private backend: backend) {
        this.backend.getRequest('KReporter/categoriesmanager/cockpit').subscribe(cockpits => {
            for (let cockpit in cockpits) {
                this.cockpits.push({
                    name: cockpit,
                    items: cockpits[cockpit]
                });
            }
        });
    }

}