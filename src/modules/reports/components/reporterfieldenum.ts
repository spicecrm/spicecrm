import {
    Component,
    Input,
    AfterViewInit,
    OnInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy
} from '@angular/core';
import {currency} from '../../../services/currency.service';
import {modelutilities} from '../../../services/modelutilities.service';

@Component({
    selector: 'reporter-field-enum',
    templateUrl: './app/modules/reports/templates/reporterfieldenum.html'
})
export class ReporterFieldEnum {

    record: any = {};
    field: any = {};

    constructor() {

    }

}