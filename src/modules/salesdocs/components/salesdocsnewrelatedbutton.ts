import {Component, Injector, SkipSelf} from '@angular/core';
import {ObjectActionNewrelatedButton} from "../../../objectcomponents/components/objectactionnewrelatedbutton";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";

declare var _;

@Component({
    selector: 'sales-docs-new-related-button',
    templateUrl: "../../../objectcomponents/templates/objectactionnewbutton.html",
    providers: [model]
})
export class SalesDocsNewRelatedButton extends ObjectActionNewrelatedButton {
    /**
     * holds the action configurations
     */
    public actionconfig: any = {};

    constructor(@SkipSelf() public parent: model, public language: language, public metadata: metadata, public model: model, public relatedmodels: relatedmodels, public injector: Injector, public modal: modal) {

        super(parent, language, metadata, model, relatedmodels, injector);

        this.model.module = 'SalesDocs';
    }

    /**
     * execute when the button is clicked
     */
    public execute() {
        if (_.isEmpty(this.actionconfig)) {
            this.actionconfig = this.metadata.getComponentConfig('SalesdocsNewButton', this.model.module);
        }

        this.model.id = "";
        this.model.initialize(this.parent);

        if (this.actionconfig.defaultsalesdoctype) {
            this.model.setField('salesdoctype', this.actionconfig.defaultsalesdoctype);
        }

        if (this.actionconfig.salesdocparty) {
            this.model.setField('salesdocparty', this.actionconfig.salesdocparty);
        }

        if (this.actionconfig.salesdoccategory) {
            this.model.setField('salesdoccategory', this.actionconfig.salesdoccategory);
        }

        this.modal.openModal(this.actionconfig.modalcomponent ? this.actionconfig.modalcomponent : 'SalesDocsAddBasics', true, this.injector);
    }
}