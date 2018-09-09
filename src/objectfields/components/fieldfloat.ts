import {Component, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';
import {userpreferences} from '../../services/userpreferences.service';

@Component({
    selector: 'field-float',
    templateUrl: './app/objectfields/templates/fieldfloat.html'
})
export class fieldFloat extends fieldGeneric implements OnInit {

    textvalue: string = '';

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public userpreferences: userpreferences ) {
        super(model, view, language, metadata, router);
    }

    ngOnInit(){
        this.model.data$.subscribe( () => {
            this.textvalue = this.getTextValue();
        });
    }

    getTextValue() {
        if ( this.value === undefined ) return '';
        let val = parseFloat( this.value );
        if ( isNaN( val )) return '';
        return this.userpreferences.formatMoney( val );
    }

    changed() {
        let val: any = this.textvalue;
        val = val.split( this.userpreferences.toUse.num_grp_sep ).join('');
        val = val.split( this.userpreferences.toUse.dec_sep ).join('.');
        if ( isNaN( val = parseFloat( val ))) {
            this.value = '';
        } else {
            this.value = ( Math.floor( val * Math.pow( 10, this.userpreferences.toUse.default_currency_significant_digits )) / Math.pow( 10, this.userpreferences.toUse.default_currency_significant_digits ));
        }
        this.textvalue = this.getTextValue();
    }

}