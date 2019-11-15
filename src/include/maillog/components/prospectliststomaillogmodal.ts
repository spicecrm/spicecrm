/**
 * @module MailLogModule
 */

import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modellist} from '../../../services/modellist.service';
import {modal} from '../../../services/modal.service';
import {toast} from "../../../services/toast.service";
/**
 * modal onInit() == setsyncusers profiles are syncronized
 */
@Component({
    selector: 'prospectlists-to-maillog-modal',
    templateUrl: './src/include/maillog/templates/prospectliststomaillogmodal.html',
    providers: [model]
})
export class ProspectListsToMailLogModal {

    private self: any = {};
    private targetlistname: string = '';

    private close() {
        this.self.destroy();
    }

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modellist: modellist,
        private modal: modal,
        private injector: Injector
    ) {}



}
