/**
 * @module WorkbenchModule
 */
import {
    Component,
    Input, OnChanges, SimpleChanges
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {domainmanager} from '../services/domainmanager.service';

@Component({
    selector: 'domainmanager-field-validation',
    templateUrl: './src/workbench/templates/domainmanagerfieldvalidation.html'
})
export class DomainManagerFieldValidation implements OnChanges {

    @Input() private field: any = {};

    constructor(private domainmanager: domainmanager, private language: language) {

    }

    public ngOnChanges(changes: SimpleChanges): void {

    }

    get validation() {
        return this.domainmanager.getValidationById(this.field.sysdomainfieldvalidation_id);
    }

    get validationvalues() {
        return this.domainmanager.getValdiationValuesdById(this.field.sysdomainfieldvalidation_id);
    }

}
