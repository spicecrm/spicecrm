/**
 * @module ServiceComponentsModule
 */
import {Component} from "@angular/core";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";

@Component({
    selector: 'sign-serviceorder-modal',
    templateUrl: './src/modules/servicecomponents/templates/signserviceordermodal.html',
    providers: [model, view],
})
export class SignServiceOrderModalComponent {
    // needed for selfdestruction... will be set on creation...
    private self: any;

    constructor(
        private model: model,
        private view: view,
        private language: language,
    ) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    private setModel(model: model) {
        this.model.id = model.id;
        this.model.module = model.module;
        this.model.data = model.data;
    }

    private cancel() {
        this.self.destroy();
    }

    private onModalEscX() {
        this.cancel();
    }

    private accept() {
        this.model.data.serviceorder_status = 'signed';
        this.model.save();

        this.self.destroy();
    }
}
