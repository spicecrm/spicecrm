/**
 * @module ModuleSpiceAttachments
 */
import {
    Component, Injector
} from '@angular/core';
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {Router} from "@angular/router";

/**
 * renders a bar with quick add sysmbols to be rendered in the model popover
 */
@Component({
    selector: 'field-spice-attachments-count',
    templateUrl: '../templates/fieldspiceattachmentscount.html'
})
export class fieldSpiceAttachmentsCount extends fieldGeneric {

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public injector: Injector) {
        super(model, view, language, metadata, router);
    }

    get popovercomponentset() {
        return this.fieldconfig.popovercomponentset;
    }

}
