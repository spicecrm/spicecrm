/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {Router} from '@angular/router';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";

@Component({
    templateUrl: '../templates/fieldleadclassification.html'
})
export class fieldLeadClassification extends fieldGeneric {

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    get trend() {
        switch (this.model.getField('classification')) {
            case 'hot':
                return 'up';
                break;
            case 'cold':
                return 'down';
                break;
            default:
                return 'neutral';
                break;
        }
    }

}
