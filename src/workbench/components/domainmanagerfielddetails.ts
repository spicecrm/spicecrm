/**
 * @module WorkbenchModule
 */
import {
    Component,
    Input
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'domainmanager-field-details',
    templateUrl: './src/workbench/templates/domainmanagerfielddetails.html'
})
export class DomainManagerFieldDetails{

    @Input() field: any = {};


    constructor(private backend: backend, private metadata: metadata, private language: language) {

    }

}
