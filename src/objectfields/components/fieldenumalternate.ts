import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldEnum} from './fieldEnum';
import {Router} from '@angular/router';

@Component({
    selector: 'field-enum-alternate',
    templateUrl: './src/objectfields/templates/fieldenumalternate.html'
})

export class fieldEnumAlternate extends fieldEnum {
    private setValue(value) {
        this.value = value; // not needed anymore? :o
    }
}
