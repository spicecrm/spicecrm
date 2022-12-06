import {Component, ComponentRef, SkipSelf} from '@angular/core';
import {model} from "../../services/model.service";
import {metadata} from "../../services/metadata.service";
import {backend} from "../../services/backend.service";
import {modelutilities} from "../../services/modelutilities.service";
import {modellist} from "../../services/modellist.service";

@Component({
    selector: 'global-header-document-revisions-modal',
    templateUrl: '../templates/globalheaderdocumentrevisionsmodal.html',
    providers: [model]
})
export class GlobalHeaderDocumentRevisionsModal {

    public self: ComponentRef<GlobalHeaderDocumentRevisionsModal>;

    public componentconfig: any;

    constructor(public model: model, public metadata: metadata, public backend: backend, @SkipSelf() public eventModel: model, public modelutilities: modelutilities, public modellist: modellist) {
        this.model.module = 'EventRegistrations';
        this.model.initialize();
        this.model.startEdit();
    }

    // Close the modal.
    public closeModal() {
        this.self.destroy();
    }

    // Escape pressed or [x] clicked.
    public onModalEscX() {
        this.closeModal();
    }
}
