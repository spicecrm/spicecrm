/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {backend} from '../../services/backend.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

@Component({
    selector: 'field-backend-method',
    templateUrl: '../templates/fieldbackendmethod.html'
})
export class fieldBackendMethod extends fieldGeneric {

    public classexists: boolean = false;
    public publicMethods: any[] = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);

    }

    get className() {
        if (this.value) {
            return this.value.split('->')[0];
        }

        return '';
    }

    set className(value) {
        this.value = value;
        this.validateNamespace();
    }

    get methodName() {
        if (this.value) {
            let values = this.value.split('->');
            if (values.length == 2) {
                return this.value.split('->')[1];
            }
        }
        return '';
    }

    set methodName(value) {
        let values = this.value.split('->');
        this.value = values[0] + '->' + value;
    }

    public validateNamespace() {
        this.model.backend.getRequest('system/checkclass/' + btoa(this.className)).subscribe(res => {
            this.classexists = res.classexists;
            this.publicMethods = res.methods;
        });
    }
}
