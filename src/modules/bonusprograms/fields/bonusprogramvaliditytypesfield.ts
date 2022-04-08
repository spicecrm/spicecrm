/**
 * @module ModuleBonusPrograms
 */
import {Component} from '@angular/core';
import {configurationService} from "../../../services/configuration.service";
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {Router} from "@angular/router";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";

/**
 * a field to render a dropdown
 */
@Component({
    templateUrl: '../templates/bonusprogramvaliditytypesfield.html'
})
export class BonusProgramValidityTypesField extends fieldGeneric {
    /**
     * holds the validity types
     */
    public types: Array<{ id: string, name: string, label: string, method, editing_allowed: 0 | 1 }> = [];

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public configurationService: configurationService
    ) {
        super(model, view, language, metadata, router);
        this.loadTypes();
    }

    /**
     * set the validity date method and editing flag
     * @param val
     */
    set value(val) {
        this.model.setField('validity_date_method', val);
        this.types.some(type => {
            if (type.method == val) {
                this.model.setField('validity_date_editable', type.editing_allowed);
                return true;
            }
        });
    }

    /**
     * @return string the validity date method
     */
    get value() {
        return this.model.getField('validity_date_method');
    }

    /**
     * load the validity types from the configuration service
     */
    public loadTypes() {
        this.types = this.configurationService.getData('sysbonusprogramvaliditytypes');
    }
}
