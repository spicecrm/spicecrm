/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';
import {configurationService} from "../../services/configuration.service";

/**
* @ignore
*/
declare var _: any;
@Component({
    selector: 'field-google-places-search',
    templateUrl: '../templates/fieldgoogleplacessearch.html'
})
export class fieldGooglePlacesSearch extends fieldGeneric {

    public options: any[] = [];

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public configurationService: configurationService,
                public router: Router) {
        super(model, view, language, metadata, router);


    }

    public setDetails(details){
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
            if (this.fieldconfig.street && details.address.street_name) {
                changedFields[this.fieldconfig.street] = details.address.street_name;
            }
            if (!this.hideStreetNumber && !!this.fieldconfig.street_number && !!details.address.street_number) {
                changedFields[this.fieldconfig.street_number] = details.address.street_number;
            } else if (this.hideStreetNumber && this.fieldconfig.street  && details.address.street_name && details.address.street_number) {
                changedFields[this.fieldconfig.street] += ' ' + details.address.street_number;
            }
            if (this.fieldconfig.latitude && details.address.latitude) {
                changedFields[this.fieldconfig.latitude] = details.address.latitude;
            }
            if (this.fieldconfig.longitude && details.address.longitude) {
                changedFields[this.fieldconfig.longitude] = details.address.longitude;
            }
        }
        if(!_.isEmpty(changedFields)) {
            this.model.setFields(changedFields);
        }
    }



    /**
     * a getter to hide the field
     */
    get hideStreetNumber() {
        const addressConfig = JSON.parse(this.configurationService.data.backendextensions.address_format?.config?.format || '{}');
        if (addressConfig?.hidestreetnumber) return true;
        return false;
    }
}
