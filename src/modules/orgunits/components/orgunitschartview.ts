/**
 * @module ModuleOrgunits
 */
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef, HostListener,
    OnDestroy, OnInit,
    QueryList, SkipSelf,
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
    providers: [orgunitsViewService, model],
    standalone: false
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

    private zoomFactor: number = 1;

    constructor(
        @SkipSelf() public model: model,
        public newOrgUnit: model,
        public oview: orgunitsViewService,
        public cdRef: ChangeDetectorRef
    ) {
        this.oview.updated$.subscribe(() => {
            this.cdRef.detectChanges();
        })


    }


    public ngAfterViewInit() {
        this.oview.orgChart = this.model;
        this.oview.loadOrgUnits().subscribe({
            next: () => {
                this.oview.viewport = this.orgViewPort?.nativeElement;
                // this.oview.buildConnectors();
                // ugly but effective way to ensure the update ont eh page happens before the update on the connectors happen
                window.setTimeout(() => this.oview.buildConnectors(), 0);


                this.oview.viewport = this.orgViewPort?.nativeElement;
            }
        });
    }

    get rootID(){
        return this.oview.orgunits.find(o => !o.parent_id)?.id;
    }

    get zoomedStyle(){
        return {
            transform: `scale(${this.zoomFactor})`
        };
    }

    public zoomout(){
        if(this.zoomFactor > 0.1) this.zoomFactor -= 0.1;
        // ugly but effective way to ensure the update ont eh page happens before the update on the connectors happen
        window.setTimeout(() => this.oview.buildConnectors(), 0);
    }
    public zoomin(){
        if(this.zoomFactor < 1) this.zoomFactor += 0.1;
        // ugly but effective way to ensure the update ont eh page happens before the update on the connectors happen
        window.setTimeout(() => this.oview.buildConnectors(), 0);
    }

    get zoom(){
        return this.zoomFactor * 100;
    }

    set zoom(value){
        this.zoomFactor = value / 100;
        // ugly but effective way to ensure the update ont eh page happens before the update on the connectors happen
        window.setTimeout(() => this.oview.buildConnectors(), 0);
    }

    public add(){
        this.newOrgUnit.module = 'OrgUnits';
        this.newOrgUnit.initialize();
        this.newOrgUnit.addModel(null, this.model, {
            orgchart_id: this.model.id,
            orgchart_name: this.model.getField('name')
        }).subscribe({
            next: (data) => {
                this.oview.orgunits.push(data);
            }
        });
    }
}
