/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {fieldEnum} from './fieldEnum';

@Component({
    selector: 'field-enum-alternate',
    templateUrl: './src/objectfields/templates/fieldenumalternate.html'
})

export class fieldEnumAlternate extends fieldEnum {
    private setValue(value) {
        this.value = value; // not needed anymore? :o
    }
}
