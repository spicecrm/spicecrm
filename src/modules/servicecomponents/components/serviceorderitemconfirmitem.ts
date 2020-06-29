import {Component, Input, OnInit, Output, EventEmitter} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";
import {ServiceOrderItemPanel} from "./serviceorderitempanel";
import {ServiceOrderItemItem} from "./serviceorderitemitem";

@Component({
    selector: "[serviceorder-item-confirm-item]",
    templateUrl: "./src/modules/servicecomponents/templates/serviceorderitemconfirmitem.html",
    providers: [model, view]
})
export class ServiceOrderItemConfirmItem extends ServiceOrderItemItem {

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
        let config = this.metadata.getComponentConfig('ServiceOrderItemConfirmationPanel', this.serviceorder.module);
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
