/**
 * @module ModuleBonusPrograms
 */
import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {fieldDateTimeSpan} from "../../../objectfields/components/fielddatetimespan";

/**
 * a field to render a dropdown
 */
@Component({
    templateUrl: './src/modules/bonusprograms/templates/bonuscardvaliditydatefield.html'
})
export class BonusCardValidityDateField extends fieldDateTimeSpan {

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public router: Router,
                private backend: backend,
                private modelUtilities: modelutilities) {
        super(model, view, language, metadata, router);
    }

    /**
     * subscribe to changes
     */
    public ngOnInit() {
        super.ngOnInit();
        this.handleProgramChanges(
            this.model.getField('bonusprogram_id')
        );
        this.subscribeToProgramChanges();
    }

    private subscribeToProgramChanges() {
        this.subscriptions.add(
            this.model.observeFieldChanges('bonusprogram_id').subscribe(value => {
                this.handleProgramChanges(value);
            })
        );
    }

    /**
     * handle the bonus program id changes
     * @param programId
     * @private
     */
    private handleProgramChanges(programId) {

        if (!programId) return;

        this.backend.get('BonusPrograms', programId).subscribe((res: any) => {
            if (res.validity_date_editable != 1) {
                this.model.setFieldStatus(this.fieldname, 'readonly');
            }
        });

        if (!!this.value) return;

        this.backend.getRequest(`module/BonusPrograms/${programId}/validitydate`).subscribe(res => {

            if (!res) return;

            this.value = this.modelUtilities.backend2spice(this.model.module, this.fieldname, res);
        });
    }
}
