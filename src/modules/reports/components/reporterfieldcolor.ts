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
    selector: 'reporter-field-Color',
    templateUrl: './src/modules/reports/templates/reporterfieldcolor.html'
})
export class ReporterFieldColor {

    record: any = {};
    field: any = {};

    constructor() {

    }

}