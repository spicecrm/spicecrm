/**
 * @module ModuleOrgunits
 */
import {Component, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {OrgunitsChartViewBox} from "./orgunitschartviewbox";
import {orgunitsViewService} from "../services/orgunitsview.service";

/**
 * renders a view with an org unit
 */
@Component({
    selector: 'orgunits-chart-view-orgunit',
    templateUrl: '../templates/orgunitschartvieworgunit.html',
})
export class OrgunitsChartOrgViewOrgunit{

    @Input() public orgunitid: string;

    constructor(public oview: orgunitsViewService) {

    }

    get subUnits(){
        let units = this.oview.orgunits.filter(o => o.parent_id == this.orgunitid).map(u => {return {module: 'OrgUnits', id: u.id, name: u.name};});
        let charts = this.oview.orgcharts.filter(o => o.orgunit_id == this.orgunitid).map(u => {return {module: 'OrgCharts', id: u.id, name: u.name};});
        return units.concat(charts).sort((a, b) => a.name.localeCompare(b.name));
    }

    get subOrgUnits() {
        return this.oview.orgunits.filter(o => o.parent_id == this.orgunitid);
    }

    get subOrgCharts() {
        return this.oview.orgcharts.filter(o => o.orgunit_id == this.orgunitid);
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * @param index
     * @param item
     * @return index
     */
    public trackByFn(index, item) {
        return item.id;
    }

}
