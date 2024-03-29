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
import {domainmanager} from '../services/domainmanager.service';

/**
 * a tab with details on a domain field
 */
@Component({
    selector: 'domainmanager-field-details',
    templateUrl: '../templates/domainmanagerfielddetails.html'
})
export class DomainManagerFieldDetails {

    /**
     * the field itself
     */
    @Input() public field: any = {};

    constructor(public backend: backend, public metadata: metadata, public language: language, public domainmanager: domainmanager) {

    }

    /**
     * getter for required since that is returned as int and not as boolean
     */
    get required() {
        return this.field.required == '1' ? true : false;
    }

    /**
     * setter for teh required checkbox to convert from boolean to tyniint
     *
     * @param isrequired
     */
    set required(isrequired) {
        this.field.required = isrequired ? '1' : '0';
    }

}
