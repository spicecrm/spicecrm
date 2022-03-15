/**
 * @module ModuleReports
 */
import {Component, Input,} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {Router} from '@angular/router';

/**
 * represents a tile in the cockpit that is one report the user can visualize
 */
@Component({
    selector: 'reporter-cockpit-tile',
    templateUrl: '../templates/reportercockpittile.html',
    host: {
        class: 'slds-tile slds-media slds-p-vertical--small slds-card__tile slds-p-horizontal--small slds-size--1-of-3 slds-hint-parent'
    }
})
export class ReporterCockpitTile {

    /**
     * an Input parameter set that holds the report object
     */
    @Input() public report: any = {};

    constructor(public backend: backend, public router: Router) {

    }

    /**
     * changes the route and displays the report
     */
    public navigateDetail() {
        this.router.navigate(['/module/KReports/' + this.report.id]);
    }
}
