import {Component, Input, OnInit} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";
import {ServiceOrderEffortItem} from "./serviceordereffortitem";

@Component({
    selector: "[serviceorder-effort-confirmation-item]",
    templateUrl: "../templates/serviceordereffortconfirmationitem.html",
    providers: [model, view]
})
export class ServiceOrderEffortConfirmationItem extends ServiceOrderEffortItem implements OnInit  {


    /**
     * the columns to be displayed
     */
    public fieldsetItems: any[] = [];

    constructor(
        public metadata: metadata,
        public language: language,
        public model: model,
        public view: view
    ) {
        super(metadata, language, model, view);
    }

    /**
     * set the configuration
     */
    public setConfig() {
        let config = this.metadata.getComponentConfig('ServiceOrderEffortConfirmationPanel', this.serviceorder.module);
        if (config.fieldset) {
            this.fieldsetItems = this.metadata.getFieldSetItems(config.fieldset);
        }
    }


    /**
     * enable detele only for the items added in the confirmation
     */
    get candelete() {
        return this.model.data.confirmadded;
    }

}
