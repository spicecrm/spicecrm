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
export class DomainManagerFieldDetails {

    @Input() private field: any = {};


    constructor(private backend: backend, private metadata: metadata, private language: language) {

    }

    /**
     * getter for required since that is returned as int and not as boolean
     */
    get required(){
        return this.field.required == '1' ? true : false;
    }

    /**
     * setter for teh required checkbox to convert from boolean to tyniint
     *
     * @param isrequired
     */
    set required(isrequired){
        this.field.required = isrequired ? '1' : '0';
    }

}
