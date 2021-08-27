/**
 * @module ServiceComponentsModule
 */
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {Component} from "@angular/core";
import {language} from "../../../services/language.service";


@Component({
    selector: 'serviceorder-summary',
    templateUrl: './src/modules/servicecomponents/templates/serviceordersummary.html',
    providers: [view]
})
export class ServiceOrderSummaryComponent
{

    constructor(
        private model:model,
        private view:view,
        private language:language,
    )
    {
        this.view.isEditable = false;
    }
}