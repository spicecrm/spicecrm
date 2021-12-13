/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

@Component({
    selector: 'field-rating',
    templateUrl: '../templates/fieldrating.html'
})
export class fieldRating extends fieldGeneric {

    public options: any[] = ["1","2","3","4","5"];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    public setRatingValue( value ) {
        if ( this.value == value ) this.value = '';
        else this.value = value;
    }

    public get ratingIcon() {
        if ( parseInt( this.value, 10 ) == 3) return 'sentiment_neutral';
        if ( parseInt( this.value, 10 ) > 3) return 'smiley_and_people';
        if ( parseInt( this.value, 10 ) < 3) return 'sentiment_negative';
    }

}
