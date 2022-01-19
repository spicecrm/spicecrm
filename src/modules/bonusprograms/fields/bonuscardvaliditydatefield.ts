/**
 * @module ModuleBonusPrograms
 */
import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {fieldDateSpan} from "../../../objectfields/components/fielddatespan";

/** @ignore */
declare var moment;

/**
 * a compo date field for validity
 */
@Component({
    templateUrl: '../templates/bonuscardvaliditydatefield.html'
})
export class BonusCardValidityDateField extends fieldDateSpan {

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public router: Router) {
        super(model, view, language, metadata, router);
    }

    /**
     * disable editing if the validity_date_editable is false
     * @param field
     */
    public isEditable(field: string = this.fieldname): boolean {
        if (this.model.getField('validity_date_editable') != 1) return false;
        return super.isEditable(field);
    }
}
