/**
 * @module WorkbenchModule
 */
import {Component, ViewChild, ViewContainerRef,EventEmitter} from "@angular/core";
import {backend} from "../../../services/backend.service";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    templateUrl: "../templates/requestfeedbackmodal.html",
})
export class RequestFeedbackModal {

    public self: any = {};
    private containerComponents: any[] = [];
    private fieldset: string = '';
    private fieldsetitems: any[];
    @ViewChild("detailscontent", {read: ViewContainerRef, static: true}) private detailscontent: ViewContainerRef;

    constructor(
        private backend: backend,
        private language: language,
        private metadata: metadata,
        private model: model
    ) {}

    private close() {
        this.self.destroy();
    }

    public onModalEscX() {
        this.close();
    }

    private buildContainer() {

        this.destroyContainer();

        // get componentset
        let componentconfig = this.metadata.getComponentConfig("OeamtcSendEmailModal", this.model.module);
        let viewComponentSet = componentconfig.componentset;
        for (let component of this.metadata.getComponentSetObjects(viewComponentSet)) {
            this.metadata.addComponent(component.component, this.detailscontent).subscribe(componentRef => {
                componentRef.instance["componentconfig"] = component.componentconfig ? component.componentconfig : {};
                this.containerComponents.push(componentRef);
            });
        }

        // load the fieldset
        this.fieldset = componentconfig.fieldset;
        if (this.fieldset) {
            this.fieldsetitems = this.metadata.getFieldSetFields(this.fieldset);
        }

    }

    private destroyContainer() {
        for (let containerComponent of this.containerComponents) {
            containerComponent.destroy();
        }
        this.containerComponents = [];
    }
}
