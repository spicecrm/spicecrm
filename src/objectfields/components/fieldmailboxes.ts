/**
 * @module ObjectFields
 */
import {Component, OnInit} from '@angular/core';
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
export class fieldMailboxes extends fieldGeneric implements OnInit {
    /**
     * teh available mailboxes
     */
    public options: any[] = [];

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

    public ngOnInit() {
        super.ngOnInit();

        // get the mailboxes  / Options
        this.getOptions();
    }

    get displayValue() {
        return this.options.find(m => m.id == this.value);
    }

    public getOptions() {
        let options = this.configuration.getData(`mailboxes${this.scope}`);
        if (_.isEmpty(options)) {
            this.backend.getRequest("mailboxes/getmailboxes", {scope: this.scope}).subscribe(
                (results: any) => {
                    this.options = results;

                    if (this.options.length > 0 && !this.value) {
                        this.model.setField(this.fieldname, this.options[0].value);
                    }

                    // set to config
                    this.configuration.setData(`mailboxes${this.scope}`, this.options);

                });
        } else {
            this.options = options;
        }
    }


}
