/**
 * @module ObjectComponents
 */
import {Component, OnInit, SkipSelf} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {BonusCardNewButton} from "./bonuscardnewbutton";
import {modelutilities} from "../../../services/modelutilities.service";

@Component({
    selector: "bonus-cards-new-related-button",
    templateUrl: "./src/modules/bonusprograms/templates/bonuscardnewrelatedbutton.html",
    providers: [model]
})
export class BonusCardNewRelatedButton extends BonusCardNewButton {

    /**
     * set to true to disabled the button .. based on the ACL Check fdor the model
     */
    public disabled: boolean = true;

    constructor(public language: language,
                public metadata: metadata,
                public modal: modal,
                public toast: toast,
                public backend: backend,
                public model: model,
                @SkipSelf() public parentModel: model,
                public modelUtilities: modelutilities,
                private relatedModels: relatedmodels) {
        super(language, metadata, modal, toast, backend, model, parentModel, modelUtilities);

    }

    /**
     * add a new card with the program
     */
    public addNew(program: { id: string, name: string }) {

        this.model.id = undefined;
        let presets;

        if (!!program) {
            presets = {
                bonusprogram_id: program.id,
                bonusprogram_name: program.name,
            };
        }

        if (!this.parentModel.data.id) {
            this.parentModel.data.id = this.parentModel.id;
        }

        this.model.addModel('', this.parentModel, presets).subscribe(response => {
            if (response != false) {
                this.relatedModels.addItems([response]);
            }
        });
    }
}
