import {
    Component,
    Input,
    AfterViewInit,
    OnInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import {model} from '../../services/model.service';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

import {Subject} from 'rxjs';

@Component({
    selector: 'domainmanager-field-details',
    templateUrl: './src/workbench/templates/domainmanagerfielddetails.html'
})
export class DomainManagerFieldDetails{

    @Input() field: any = {};


    constructor(private backend: backend, private metadata: metadata, private language: language) {

    }

}
