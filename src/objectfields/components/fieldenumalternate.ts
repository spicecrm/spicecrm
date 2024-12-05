/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {fieldEnum} from './fieldenum';

@Component({
    selector: 'field-enum-alternate',
    templateUrl: '../templates/fieldenumalternate.html'
})

export class fieldEnumAlternate extends fieldEnum {

    public ngOnInit() {
        super.ngOnInit();

        if(this.fieldconfig.fielddisplayclass){
            this.fielddisplayclass = this.fieldconfig.fielddisplayclass;
        }
    }

    public setValue(value) {
        this.value = value; // not needed anymore? :o
    }
}
