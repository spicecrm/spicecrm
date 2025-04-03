/**
 * @module ModuleMailgun
 */
import {
    Component, Injector
} from '@angular/core';
import {Router} from "@angular/router";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {modal} from "../../../services/modal.service";


/**
 * renders a field with the mailgun reasons
 */
@Component({
    selector: 'field-mailgun-reasons',
    templateUrl: '../templates/fieldmailgunreasons.html'
})
export class fieldMailgunReasons extends fieldGeneric {


    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public injector: Injector,
        public modal: modal
    ) {
        super(model, view, language, metadata, router);
    }

    get reasons(){
        let r = JSON.parse(this.value);
        return r?.reason ?? [];
    }

}
