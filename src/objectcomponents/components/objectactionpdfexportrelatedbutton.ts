/**
 * @module ObjectComponents
 */
import {Component, Injector, OnInit, SkipSelf} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {relatedmodels} from "../../services/relatedmodels.service";
import {backend} from "../../services/backend.service";
import {modal} from "../../services/modal.service";
import {view} from "../../services/view.service";

@Component({
    selector: "object-action-pdfexportrelated-button",
    templateUrl: "../templates/objectactionpdfexportrelatedbutton.html",
    providers: [model]
})
export class ObjectActionPdfExportRelatedButton implements OnInit {

    public disabled: boolean = true;

    /**
     * if set to true didpslay teh button as icon
     */
    public displayasicon: boolean = false;

    /**
     * if there are existing templates for the give module, display the action
     */
    public hidden: boolean = true;

    constructor(public parent: model,
                public metadata: metadata,
                public model: model,
                public relatedmodels: relatedmodels,
                public injector: Injector,
                public backend: backend,
                public modal: modal
    ) {}

    public ngOnInit() {
        this.model.module = this.relatedmodels.relatedModule;
        if (this.model.module && this.metadata.checkModuleAcl(this.model.module, "create")) {
            this.disabled = false;
        }

        this.backend.getRequest('module/OutputTemplates/formodule/' + this.relatedmodels.relatedModule, {}).subscribe(res => {
            if(res.length > 0) {
                this.hidden = false;
            }
        })
    }

    public execute() {
        this.modal.openModal('ObjectActionRelatedOutputPdfModal', true, this.injector)
    }
}