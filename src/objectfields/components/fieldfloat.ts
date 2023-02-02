/**
 * @module ObjectFields
 */
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';
import {userpreferences} from '../../services/userpreferences.service';

@Component({
    selector: 'field-float',
    templateUrl: '../templates/fieldfloat.html'
})
export class fieldFloat extends fieldGeneric implements OnInit {

    /**
     * number of digits after decimal separator
     * user default preference
     * override with fieldconfig value if set
     */
    public precision: number = 0;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public userpreferences: userpreferences) {
        super(model, view, language, metadata, router);
    }

    /**
     * @ignore
     */
    public ngOnInit() {
        // set decimal precision
        this.precision = (this.fieldconfig.precision === undefined || this.fieldconfig.precision === '' ? parseInt(this.userpreferences.toUse.currency_significant_digits, 10) : parseInt(this.fieldconfig.precision, 10));
    }
}
