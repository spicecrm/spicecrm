/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {EnumDisplayOptionArray, language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {Router} from '@angular/router';
import {fieldEnum} from "../../../objectfields/components/fieldenum";

@Component({
    selector: 'field-process-impact-score',
    templateUrl: '../templates/fieldprocessimpactscore.html'
})
export class fieldProcessImpactScore extends fieldEnum {

    public options: EnumDisplayOptionArray = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    get badgeClass(){
        switch (this.value){
            case 'H':
                return 'slds-theme--error';
            case 'M':
                return 'slds-theme--warning';
            case 'L':
                return 'slds-theme--success';
            default:
                return '';
        }
    }

}
