/**
 * @module ServiceComponentsModule
 */
import {Component} from "@angular/core";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";

@Component({
    selector: 'sign-serviceorder-modal',
    templateUrl: '../templates/signserviceordermodal.html',
    providers: [model, view],
})
export class SignServiceOrderModalComponent {
    // needed for selfdestruction... will be set on creation...
    public self: any;

    constructor(
        public model: model,
        public view: view,
        public language: language,
    ) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public setModel(model: model) {
        this.model.id = model.id;
        this.model.module = model.module;
        this.model.setData(model.data, false);
    }

    public cancel() {
        this.self.destroy();
    }

    public onModalEscX() {
        this.cancel();
    }

    public accept() {
        this.model.setField('serviceorder_status', 'signed');
        this.model.save();

        this.self.destroy();
    }
}
