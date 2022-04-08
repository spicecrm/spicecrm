/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {fieldGeneric} from "./fieldgeneric";
import {model} from "../../services/model.service";
import {view} from "../../services/view.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {Router} from "@angular/router";

@Component({
    selector: 'field-barcode',
    templateUrl: '../templates/fieldbarcode.html'
})
export class fieldBarcode extends fieldGeneric {

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    isEditMode() {
        return this.view.isEditMode() && this.isEditable();
    }

    isEditable() {
        return this.view.isEditable && !this.fieldconfig.readonly;
    }
}
