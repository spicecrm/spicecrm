/**
 * @module ModuleReports
 */
import {
    Component,
    Input,
} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {Router} from '@angular/router';

/**
 * represents a tile in the cockpit that is one report the user can visualize
 */
@Component({
    selector: 'reporter-cockpit-tile',
    templateUrl: './src/modules/reports/templates/reportercockpittile.html',
    host: {
        class: 'slds-tile slds-p-around--xx-small slds-media slds-card__tile slds-size--1-of-1 slds-medium-size--1-of-3 slds-large-size--1-of-4 slds- slds-hint-parent'
    }
})
export class ReporterCockpitTile {

    /**
     * an Input parameter set that holds the report object
     */
    @Input() private report: any = {};

    constructor(private backend: backend, private router: Router) {

    }

    /**
     * changes the route and displays the report
     */
    private navgiateDetail() {
        this.router.navigate(['/module/KReports/' + this.report.kreport_id]);
    }
}