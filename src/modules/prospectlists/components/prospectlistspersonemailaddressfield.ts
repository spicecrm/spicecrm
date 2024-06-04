import {Component, SkipSelf} from '@angular/core';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {Router} from "@angular/router";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";

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
        this.model.setField(this.fieldname, emailAddress?.relid ?? '');
    }

    get value() {
        return this.model.getField(this.fieldname);
    }
    get emailAddresses(){
        if (this.model.parentmodel && this.model.module == 'ProspectLists'){
            return this.model.parentmodel.data.email_addresses.beans;
        }
        else {
            return this.model.data.email_addresses.beans;
        }
    }
    /**
     * angular ngFor track by function
     * @param index
     */
    public trackByFn(index: number): number {
        return index;
    }
}