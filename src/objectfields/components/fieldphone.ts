import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {backend} from '../../services/backend.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

@Component({
    selector: 'field-phone',
    templateUrl: './src/objectfields/templates/fieldphone.html'
})
export class fieldPhone extends fieldGeneric {

    private invalid = false;
    private mark: string;

    constructor(public model: model, public view: view, public l: language, public metadata: metadata, public router: Router, private backend: backend) {
        super(model, view, l, metadata, router);
    }

    private makeCall() {
        if (this.model.data[this.fieldname] != '') {
            console.log('placing call to ' + this.value);
            this.backend.postRequest('asterisk/outgoingcall', {}, {msisdn: this.value}).subscribe(result => {
                console.log(result);
            });
        }
    }

}
