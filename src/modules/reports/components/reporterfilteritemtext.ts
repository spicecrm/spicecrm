import {
    Component,
    Input,
    Output,
    AfterViewInit,
    OnInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy
} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {navigation} from '../../../services/navigation.service';
import {broadcast} from '../../../services/broadcast.service';

import  {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-filter-item-text',
    templateUrl: './app/modules/reports/templates/reporterfilteritemtext.html'
})
export class ReporterFilterItemText {

    @Input() field : string = '';
    @Input() wherecondition : any = {};

    constructor(private language: language, private model: model, private reporterconfig: reporterconfig) {

    }

}