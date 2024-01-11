import {Component, OnChanges, OnInit} from "@angular/core";
import {fieldToggle} from "../../../objectfields/components/fieldtoggle";
import {toast} from "../../../services/toast.service";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {Router} from "@angular/router";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {modal} from "../../../services/modal.service";

@Component({
    selector: 'field-sendgrid-blacklist',
    templateUrl: '../templates/fieldsendgridblacklist.html',

})
export class fieldSendgridBlacklist extends fieldToggle {

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public modal: modal,
        public backend: backend
    ) {
        super(model, view, language, metadata, router, modal);
    }

    get disabled(): boolean {
        return !this.model.checkAccess('sendgrid_blacklist');
    }

    public setValue(value: boolean): void {
        this.model.setField(this.fieldname, value);
        if(this.fieldconfig.autoSave) this.save();
        this.backend.postRequest(`/channels/emarketing/sendgrid/suppressions/${this.model.id}/global`);

    }

}