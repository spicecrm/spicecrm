/**
 * @module ModuleOrgunits
 */
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef, HostListener,
    OnDestroy, OnInit,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {ListTypeI} from "../../../services/interfaces.service";
import {OrgunitsChartViewBox} from "./orgunitschartviewbox";
import {orgunitsViewService} from "../services/orgunitsview.service";

/**
 * renders a view with an org chart based on the org units
 */
@Component({
    selector: 'orgunits-chart-view',
    templateUrl: '../templates/orgunitschartview.html',
    providers: [orgunitsViewService]
})
export class OrgunitsChartView implements AfterViewInit {

    /**
     * hostlistener on resize events to recalc the connectors
     */
    @HostListener('window:resize')
    onResize() {
        this.oview.connectors = [];
        window.setTimeout(() => this.oview.buildConnectors(), 0);
    }

    /**
     * a reference to the org chart viewport so we know the dimensions when drawing the connectors
     */
    @ViewChild('orgviewport', {static: false}) public orgViewPort;

    constructor(public model: model, public oview: orgunitsViewService, public cdRef: ChangeDetectorRef) {
        this.oview.updated$.subscribe(() => {
            this.cdRef.detectChanges();
        })

        // set the model of the chart in focus to the service so we have it as reference
        this.oview.orgChart = this.model;
    }

    public ngAfterViewInit() {
        this.oview.viewport = this.orgViewPort?.nativeElement;
        this.oview.loadOrgUnits().subscribe({
            next: () => {
                this.oview.viewport = this.orgViewPort?.nativeElement;
                this.oview.buildConnectors();
            }
        });
    }

    get rootID(){
        return this.oview.orgunits.find(o => !o.parent_id).id;
    }

}
