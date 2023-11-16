/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';
import {userpreferences} from "../../services/userpreferences.service";

/**
 * handle rendering/setting cron tab expression
 */
@Component({
    selector: 'field-cron-interval',
    templateUrl: '../templates/fieldcroninterval.html'
})
export class fieldCronInterval extends fieldGeneric {

    constructor(public model: model,
                public view: view,
                public language: language,
                public userPreferences: userpreferences,
                public metadata: metadata,
                public router: Router) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        this.initializeValue();
    }

    /**
     * initialize the value if the model is new
     * @private
     */
    public initializeValue() {
        if (!this.model.isNew) return;
        this.value = '*::*::*::*::*';
    }
}
