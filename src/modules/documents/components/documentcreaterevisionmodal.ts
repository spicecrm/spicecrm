/**
 * @module ModuleDocuments
 */
import {Component, Directive, EventEmitter, Input, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {trigger, transition, animate, style, state} from '@angular/animations';

import {ObjectActionOutputBeanModal} from "../../../modules/outputtemplates/components/objectactionoutputbeanmodal";
import {broadcast} from "../../../services/broadcast.service";
import {outputModalService} from "../../outputtemplates/services/outputmodal.service";

@Component({
    selector: 'object-action-output-bean-modal',
    templateUrl: './src/modules/documents/templates/documentcreaterevisionmodal.html',
    providers: [view],

})
export class DocumentCreateRevisionModal extends ObjectActionOutputBeanModal {

    constructor(
        public language: language,
        public model: model,
        public metadata: metadata,
        public modal: modal,
        public view: view,
        public backend: backend,
        public sanitizer: DomSanitizer,
        public viewContainerRef: ViewContainerRef,
        public outputModalService: outputModalService
    ) {
        super(language, model, metadata, modal, view, backend, outputModalService, sanitizer, viewContainerRef);
    }

    public create() {
        this.handBack.emit({name: this.selected_template.name, content: this.contentForHandBack});
        this.close();
    }

}
