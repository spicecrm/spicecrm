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

@Component({
    selector: 'reporter-field-standard',
    templateUrl: './app/modules/reports/templates/reporterfieldstandard.html'
})
export class ReporterFieldStandard {

    record: any = {};
    field: any = {};

    constructor() {

    }

}