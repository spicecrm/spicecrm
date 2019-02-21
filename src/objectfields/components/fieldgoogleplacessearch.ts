import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

declare var _: any;
@Component({
    selector: 'field-google-places-search',
    templateUrl: './src/objectfields/templates/fieldgoogleplacessearch.html'
})
export class fieldGooglePlacesSearch extends fieldGeneric {

    public options: any[] = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);


    }

    private setDetails(details){
        let changedFields = {};
        if(this.fieldconfig.formatted_phone_number && details.formatted_phone_number) {
            changedFields[this.fieldconfig.formatted_phone_number] = details.formatted_phone_number;
        }
        if(this.fieldconfig.international_phone_number && details.international_phone_number) {
            changedFields[this.fieldconfig.international_phone_number] = details.international_phone_number;
        }
        if(this.fieldconfig.website && details.website) {
            changedFields[this.fieldconfig.website] = details.website;
        }
        if(details.address) {
            if (this.fieldconfig.city && details.address.city) {
                changedFields[this.fieldconfig.city] = details.address.city;
            }
            if (this.fieldconfig.country && details.address.country) {
                changedFields[this.fieldconfig.country] = details.address.country;
            }
            if (this.fieldconfig.postalcode && details.address.postalcode) {
                changedFields[this.fieldconfig.postalcode] = details.address.postalcode;
            }
            if (this.fieldconfig.state && details.address.state) {
                changedFields[this.fieldconfig.state] = details.address.state;
            }
            if (this.fieldconfig.street && details.address.street) {
                changedFields[this.fieldconfig.street] = details.address.street;
            }
            if (this.fieldconfig.location_lat && details.address.latitude) {
                changedFields[this.fieldconfig.location_lat] = details.address.latitude;
            }
            if (this.fieldconfig.location_long && details.address.longitude) {
                changedFields[this.fieldconfig.location_long] = details.address.longitude;
            }
        }
        if(!_.isEmpty(changedFields)) {
            this.model.setFields(changedFields);
        }
    }

}
