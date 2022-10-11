/**
 * @module ModuleCampaigns
 */
import {Component, EventEmitter, Injector, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {Subscription} from "rxjs";
import {modal} from "../../../services/modal.service";
import {modellist} from "../../../services/modellist.service";
import {view} from "../../../services/view.service";

@Component({
    selector: 'event-registration-modal-type',
    templateUrl: '../templates/eventregistrationmodaltype.html',
    providers: [modellist]
})
export class EventRegistrationModalType {

    @ViewChild('tablecontent', {read: ViewContainerRef, static: true}) public tablecontent: ViewContainerRef;

    constructor(public language: language, public injector: Injector, public modal: modal, public modellist: modellist) {

    }

}
