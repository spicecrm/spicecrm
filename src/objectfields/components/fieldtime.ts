/**
 * @module ObjectFields
 */
import {Component, ElementRef, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {Router}   from '@angular/router';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {userpreferences} from '../../services/userpreferences.service';

import {fieldGeneric} from './fieldgeneric';


/**
* @ignore
*/
/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'field-time',
    templateUrl: '../templates/fieldtime.html',
})
export class fieldTime extends fieldGeneric {

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public userpreferences: userpreferences
    ) {
        super(model, view, language, metadata, router);

    }

    /**
     * returns the time in the users timeformat
     */
    get displayTime(){
        return this.value.format(this.userpreferences.getTimeFormat());
    }

}
