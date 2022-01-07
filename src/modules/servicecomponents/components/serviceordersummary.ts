/**
 * @module ServiceComponentsModule
 */
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {Component} from "@angular/core";
import {language} from "../../../services/language.service";


@Component({
    selector: 'serviceorder-summary',
    templateUrl: '../templates/serviceordersummary.html',
    providers: [view]
})
export class ServiceOrderSummaryComponent
{

    constructor(
        public model:model,
        public view:view,
        public language:language,
    )
    {
        this.view.isEditable = false;
    }
}
