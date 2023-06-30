/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from "@angular/router";

@Component({
    selector: 'field-notification-indicator',
    templateUrl: '../templates/fieldnotificationindicator.html'
})
export class fieldNotificationIndicator extends fieldGeneric {

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router
    ) {
        super(model, view, language, metadata, router);
    }

    get hasNotification(){
        return !!this.model.getField('has_notification')
    }
}
