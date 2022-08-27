/**
 * @module ModuleOrgunits
 */
import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {orgunitsViewService} from "../services/orgunitsview.service";
import {model} from "../../../services/model.service";


/**
 * renders a view with an org chart based on the org units
 */
@Component({
    selector: 'orgunits-chart-view-box',
    templateUrl: '../templates/orgunitschartviewbox.html',
    providers: [model]
})
export class OrgunitsChartViewBox implements OnInit,AfterViewInit{

    /**
     * the reference to the rendered box for the connectors
     */
    @ViewChild('box', {static: false}) public boxElement;

    /**
     * the guid of the orgunit
     */
    @Input() nodeid: string;

    /**
     * the module
     */
    @Input() nodemodule: string = 'OrgUnits';

    public displayButtons: boolean = false;

    constructor(public oview: orgunitsViewService, public model: model, public elementRef: ElementRef) {
    }

    /**
     * initialize the model and set the data
     */
    public ngOnInit() {
        this.model.module = this.nodemodule;
        this.model.id = this.nodeid;
        this.model.initialize();
        let modeldata = this.nodemodule == 'OrgCharts' ? this.oview.orgcharts.find(o => o.id == this.nodeid) : this.oview.orgunits.find(o => o.id == this.nodeid);
        this.model.setData(modeldata, true, true);
    }

    /**
     * after view init communicate the native element
     */
    public ngAfterViewInit() {
        this.oview.setNativeElement(this.nodeid,this.boxElement.nativeElement)
    }

    /**
     * edit the model
     */
    public edit(){
        this.model.edit(false);
    }

    /**
     * edit the model
     */
    public delete(){
        this.model.delete().subscribe({
            next: () => {
                this.oview.deleteOrgUnit(this.nodeid);
            }
        })
    }
}
