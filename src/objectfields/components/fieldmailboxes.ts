/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {configurationService} from '../../services/configuration.service';
import {Router} from '@angular/router';
import {backend} from "../../services/backend.service";
import {fieldGeneric} from "./fieldgeneric";

declare var _: any;

@Component({
    selector: 'field-mailboxes',
    templateUrl: './src/objectfields/templates/fieldmailboxes.html'
})
export class fieldMailboxes extends fieldGeneric {
    public options: any[] = [];
    public loadingOptions: boolean = false;
    public loaded: boolean = false;

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        private backend: backend,
        private configuration: configurationService
    ) {
        super(model, view, language, metadata, router);
    }

    get scope() {
        return this.fieldconfig.scope ? this.fieldconfig.scope : 'outboundsingle';
    }

    get isDisabled() {
        return this.options.length == 0;
    }

    public getValue() {
        let optionsArray = this.getOptions();

        for (let i = 0; i < this.options.length; i++) {
            if (this.options[i].value == this.model.data[this.fieldname]) {
                return this.options[i].display;
            }
        }
    }

    public getOptions(): any[] {
        if (!this.loadingOptions) {
            if (this.loaded) {
                return this.options;
            } else {
                let options = this.configuration.getData(`mailboxes${this.scope}`);
                if(_.isEmpty(options)) {
                    this.loadingOptions = true;
                    this.backend.getRequest("mailboxes/getmailboxes", {scope: this.scope}).subscribe(
                        (results: any) => {
                            this.options = results;
                            this.loadingOptions = false;

                            if (this.options.length > 0 && !this.value) {
                                this.model.setField(this.fieldname, this.options[0].value);
                            }
                            this.loaded = true;

                            // set to config
                            this.configuration.setData(`mailboxes${this.scope}`, this.options);

                            // return the options
                            return this.options;
                        });
                } else {
                    this.options = options;
                    return this.options;
                }
            }
        }
    }

    get value() {
        return this.getValue();
    }

}
