/**
 * @module WorkbenchModule
 */
import {Component} from "@angular/core";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {view} from "../../services/view.service";
import {configurationService} from "../../services/configuration.service";
import {Router} from "@angular/router";
import {fieldGeneric} from "../../objectfields/components/fieldgeneric";

@Component({
    templateUrl: "./src/workbench/templates/mailboxestransportsenum.html",
})
export class MailboxesTransportsEnum extends fieldGeneric {

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private configuration: configurationService) {
        super(model, view, language, metadata, router);
    }

    public getValue(): string {
        let retval = this.configuration.getData('mailboxtransports').find(e => e.name == this.value);
        if (retval) {
            return this.language.getLabel(retval.label);
        } else {
            return this.value;
        }
    }

    get transportoptions() {
        return this.configuration.getData('mailboxtransports');
    }
}
