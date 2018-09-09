import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

@Component({
    selector: 'field-email',
    templateUrl: './app/objectfields/templates/fieldemail.html'
})
export class fieldEmail extends fieldGeneric {

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    get email() {
        return this.value;  // <--- not needed anymore? :o
    }

    sendEmail() {
        if (this.model.data[this.fieldname] != '') {
            window.location.assign('mailto:' + this.model.data[this.fieldname]);
        }
    }

}
