import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

@Component({
    selector: 'field-rating',
    templateUrl: './src/objectfields/templates/fieldrating.html'
})
export class fieldRating extends fieldGeneric
{

    options: Array<any> = ["1","2","3","4","5"];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }


    setRatingValue(value){
        this.value = value;
    }

    get ratingIcon(){
        if(parseInt(this.value) == 3)
            return 'sentiment_neutral';

        if(parseInt(this.value) > 3)
            return 'smiley_and_people';

        if(parseInt(this.value) < 3)
            return 'sentiment_negative';
    }

}