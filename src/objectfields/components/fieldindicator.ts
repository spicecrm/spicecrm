/**
 * @module ObjectFields
 */
import {
    Component
} from '@angular/core';
import { model } from '../../services/model.service';
import { view } from '../../services/view.service';
import { Router } from '@angular/router';
import { language } from '../../services/language.service';
import { metadata } from '../../services/metadata.service';
import { fieldGeneric } from './fieldgeneric';

/**
 * renders a trend indicator based on the input values
 */
@Component( {
    selector: 'field-indicator',
    templateUrl: '../templates/fieldindicator.html',
})
export class fieldIndicator extends fieldGeneric {

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
    ) {
        super( model, view, language, metadata, router );
    }

    /**
     *
     */
    get indicatorValue(){
        if(this.fieldconfig.up && this.value == this.fieldconfig.up) return 'up';
        if(this.fieldconfig.down && this.value == this.fieldconfig.down) return 'down';
        return 'neutral'
    }

}
