import {
    Component,
    Input,
    OnInit,
    OnChanges,
    OnDestroy,
    Renderer2,
    ElementRef,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {footer} from '../../../services/footer.service';
import {language} from '../../../services/language.service';

import  {reporterconfig} from '../services/reporterconfig';

@Component({
    templateUrl: './app/modules/reports/templates/reporterintegrationexportmask.html'
})
export class ReporterIntegrationExportMask {


    constructor(private language: language) {
    }

}