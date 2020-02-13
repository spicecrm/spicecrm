/**
 * @module ObjectFields
 */
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {configurationService} from '../../services/configuration.service';
import {Router} from '@angular/router';
import {backend} from "../../services/backend.service";
import {fieldGeneric} from "./fieldgeneric";

@Component({
    selector: 'field-output-templates',
    templateUrl: './src/objectfields/templates/fieldoutputtemplates.html'
})
export class FieldEnumOutputTemplates extends fieldGeneric implements OnInit {

    /**
     * set to true if the templates are loaded
     */
    private isLoaded: boolean = false;

    /**
     * the templates loaded and presernted in the enum
     */
    private items = [];


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

    /**
     * disable the field if it is not loaded or no items have been found
     */
    get isDisabled() {
        return !this.isLoaded || !this.items;
    }

    /**
     * returns the template matching the id
     */
    get selected_item() {
        return this.items.find(item => item.id == this.value);
    }

    /**
     * loads the output templates either from the configuration service if they are loaded already or from the backend
     */
    public ngOnInit() {
        let outPutTemplates = this.configuration.getData('OutputTemplates');
        if (outPutTemplates && outPutTemplates[this.model.module]) {
            this.items = outPutTemplates[this.model.module];
            this.isLoaded = true;
        } else {
            this.backend.getRequest('module/OutputTemplates/formodule/' + this.model.module, {}).subscribe(
                (data: any) => {
                    // set the templates
                    this.configuration.setData('OutputTemplates', data);

                    // set the templates internally
                    this.items = data;

                    this.isLoaded = true;
                }
            );
        }
    }
}
