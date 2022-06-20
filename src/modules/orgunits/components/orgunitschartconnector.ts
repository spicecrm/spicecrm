/**
 * @module ModuleOrgunits
 */
import {Component, ElementRef, Input, OnDestroy, QueryList, ViewChildren} from '@angular/core';
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
    selector: 'orgunits-chart-connector',
    templateUrl: '../templates/orgunitschartconnector.html',
})
export class OrgunitsChartConnector  {

    constructor(public oview: orgunitsViewService) {

    }

}
