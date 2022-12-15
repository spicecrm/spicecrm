import {Component, ComponentRef, SkipSelf} from '@angular/core';
import {model} from "../../services/model.service";
import {metadata} from "../../services/metadata.service";
import {backend} from "../../services/backend.service";
import {modelutilities} from "../../services/modelutilities.service";
import {modellist} from "../../services/modellist.service";

@Component({
    selector: 'global-header-document-revisions-modal',
    templateUrl: '../templates/globalheaderdocumentrevisionsmodal.html'
})
export class GlobalHeaderDocumentRevisionsModal {

    public self;

    public componentconfig: any;

    constructor() {
        null
    }

    // Close the modal.
    public closeModal() {
        this.self.destroy();
    }
}
