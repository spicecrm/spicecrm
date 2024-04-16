import {Component} from '@angular/core';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";

@Component({
    selector: 'prospect-lists-person-email-address-field',
    templateUrl: '../templates/prospectlistspersonemailaddressfield.html'
})

export class ProspectListsPersonEmailAddressField extends fieldGeneric {
    /**
     * set the id from the emailAddress and ignore invalid
     * @param emailAddress
     */
    set value(emailAddress) {
        if (emailAddress?.invalid_email == '1') return;
        this.model.setField(this.fieldname, emailAddress?.id ?? '');
    }

    get value() {
        return this.model.getField(this.fieldname);
    }
}