/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {backend} from '../../services/backend.service';
import {telephony} from '../../services/telephony.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

@Component({
    selector: 'field-phone',
    templateUrl: './src/objectfields/templates/fieldphone.html'
})
export class fieldPhone extends fieldGeneric {

    constructor(public model: model, public view: view, public l: language, public metadata: metadata, public router: Router, private backend: backend, private telephony: telephony) {
        super(model, view, l, metadata, router);
    }

    /**
     * returns true if the telephony service is active
     */
    get telehonyActive() {
        return this.telephony.isActive;
    }

    /**
     * triggers the calling of an msisdn
     */
    private initiateCall(e: MouseEvent) {
        e.stopPropagation();
        this.telephony.initiateCall(this.value);
    }
}
