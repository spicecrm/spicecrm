import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router}   from '@angular/router';
import {backend} from "../../services/backend.service";
import {fieldGeneric} from "./fieldgeneric";

@Component({
    selector: 'field-mail-relais',
    templateUrl: './app/objectfields/templates/fieldmailrelais.html'
})
export class fieldMailRelais extends fieldGeneric{
    options: Array<any> = [];
    loadingOptions: boolean = false;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private backend: backend) {
        super(model, view, language, metadata, router);
    }

    getValue(){
        let optionsArray = this.getOptions();

        for (var i = 0; i < this.options.length; i++) {
            if (this.options[i].value == this.model.data[this.fieldname]) {
                return this.options[i].display;
            }
        }
    }

    getOptions(): Array<any>{
        if(!this.loadingOptions) {
            if (this.options.length > 0) {
                return this.options;
            } else {
                this.loadingOptions = true;
                this.backend.getRequest("campaigns/getMailRelais").subscribe((results: any) => {
                    this.options = results;
                    this.loadingOptions = false;
                    return this.options;
                });
            }
        }
    }

    get value(){
        return this.getValue();
    }

    getDisplay() {
        // not if editing
        if(this.model.data.acl && !this.model.data.acl.edit)
            return false;

        // only for email
        if(this.model.data.campaign_type !== 'Email')
            return false;

        // not if editing
        return this.model.isEditing ? false : true;
    }

    getEditDisplay() {
        // only for email
        if(this.model.data.campaign_type !== 'Email')
            return false;

        return true;
    }
}