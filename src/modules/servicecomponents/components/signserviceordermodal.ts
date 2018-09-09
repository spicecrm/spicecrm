import {Component} from "@angular/core";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";

@Component({
    selector: 'sign-serviceorder-modal',
    templateUrl: 'app/modules/servicecomponents/templates/signserviceordermodal.html',
    providers: [model,view],
})
export class SignServiceOrderModalComponent
{
    // needed for selfdestruction... will be set on creation...
    self;

    constructor(
        private model:model,
        private view:view,
        private language:language,
    )
    {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    setModel(model:model) {
        this.model.id = model.id;
        this.model.module = model.module;
        this.model.data = model.data;
    }

    cancel()
    {
        this.self.destroy();
    }

    onModalEscX() {
        this.cancel();
    }

    accept()
    {
        this.model.data.serviceorder_status = 'signed';
        this.model.save();

        this.self.destroy();
    }
}