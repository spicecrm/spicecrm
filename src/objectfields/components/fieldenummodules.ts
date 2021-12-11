/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router} from '@angular/router';
import {fieldEnum} from "./fieldenum";

@Component({
    selector: 'field-enum-modules',
    templateUrl: '../templates/fieldenummodules.html'
})
export class FieldEnumModulesComponent extends fieldEnum {

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    get displayAsterisk() {
        return !!this.fieldconfig.displayAsterisk;
    }
}
