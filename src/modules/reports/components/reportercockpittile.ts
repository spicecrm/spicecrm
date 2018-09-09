import {
    Component,
    Input,
    AfterViewInit,
    OnInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy
} from '@angular/core';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {Router, ActivatedRoute}   from '@angular/router';

@Component({
    selector: 'reporter-cockpit-tile',
    templateUrl: './app/modules/reports/templates/reportercockpittile.html',
    host:{
        'class': 'slds-tile slds-media slds-p-vertical--small slds-card__tile slds-p-horizontal--small slds-size--1-of-1 spicecrm-card-size slds-hint-parent'
    }
})
export class ReporterCockpitTile {

    @Input() report: any = {};

    constructor(private backend: backend, private router: Router) {

    }

    navgiateDetail(){
        this.router.navigate(['/module/KReports/' + this.report.kreport_id]);
    }
}