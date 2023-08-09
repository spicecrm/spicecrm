/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {currency} from '../../services/currency.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

/**
 * renders a field that allows selection of currencies
 */
@Component({
    selector: 'field-countries',
    templateUrl: '../templates/fieldcountries.html'
})
export class fieldCountries extends fieldGeneric {

    public countries: any[] = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public currency: currency) {
        super(model, view, language, metadata, router);
        let countrylist = this.metadata.getCountries();
        if(countrylist.countries){
            countrylist.countries.forEach(country => {
                this.countries.push({cc: country.cc, name: this.language.getLabel(country.label)});
            });
        }
        // sort array by label translation asc
        this.countries.sort((a, b) => a.name.localeCompare(b.name));
    }

    /**
     * return the translated value for the selected country
     */
    public  getSelectedCountry(): string {
        if(!this.value) return '';
        let selectedCountry = this.countries.filter(item => item.cc == this.value);
        return selectedCountry[0]?.name;
    }

}
