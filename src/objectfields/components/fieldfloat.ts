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

    @ViewChild('floatinput', {static: false}) public inputel: ElementRef;

    public textvalue: string = '';

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public userpreferences: userpreferences) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        this.textvalue = this.getValAsText();
        this.subscriptions.add(this.model.data$.subscribe(() => {
            this.textvalue = this.getValAsText();
        }));
    }

    public getValAsText() {
        if (this.value === undefined) return '';
        let val = parseFloat(this.value);
        if (isNaN(val)) return '';
        return this.userpreferences.formatMoney(val);
    }

    public checkInput(e) {
        let allowedKeys = ['ArrowRight', 'ArrowLeft', 'Backspace', 'Delete'];
        let regex = /^[0-9.,]+$/;
        if (!regex.test(e.key) && allowedKeys.indexOf(e.key) < 0) {
            e.preventDefault();
            console.log(e.key);
        }
    }

    public changed() {
        let curpos = this.inputel.nativeElement.selectionEnd;
        let val: any = this.textvalue;
        val = val.split(this.userpreferences.toUse.num_grp_sep).join('');
        val = val.split(this.userpreferences.toUse.dec_sep).join('.');
        if (isNaN(val = parseFloat(val))) {
            this.value = '';
        } else {
            this.value = (Math.round(val * Math.pow(10, this.userpreferences.toUse.default_currency_significant_digits)) / Math.pow(10, this.userpreferences.toUse.default_currency_significant_digits));
        }
        this.textvalue = this.getValAsText();
        // set a brieftimeout and set the current pos back to the field tricking the Change Detection
        setTimeout(()=> {
            this.inputel.nativeElement.selectionEnd = curpos;
        });
    }
}
