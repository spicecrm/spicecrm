/**
 * @module ObjectComponents
 */
import {
    Component, Input, OnInit,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import {Router} from '@angular/router';
import {Subject, Observable} from 'rxjs';

import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {toast} from "../../../services/toast.service";
import {ActionActivityCloseButton} from "./actionactivityclosebutton";

/**
 * renders a modal window to show a fieldset with the close-options;
 * The shown fieldset and actionset is configurated in the button (example: ActionActivityCloseButton)
 * The fields what are setted are configurated in the "module configuration"
 */
@Component({
    templateUrl: './src/modules/activities/templates/activityclosemodal.html',
    providers: [view]
})
export class ActivityCloseModal implements OnInit {
    /**
     * a reference to the modal content to have a reference to scrolling
     */
    @ViewChild('modalContent', {read: ViewContainerRef}) private modalContent: ViewContainerRef;
    /**
     * the componentconfig that gets passed in when the modal is created
     */
    private componentconfig: any = {};
    /**
     * the actionset items to be rendered in the modal
     */
    private actionSetItems: any = [];

    /**
     * the new values for the model
     */
    private newValueFields: any = [];

    /**
     * ToDo: add documentation what we need this for
     */
    private actionSubject: Subject<any> = new Subject<any>();
    private action$: Observable<any> = new Observable<any>();

    @Input() public preventGoingToRecord = false;

    /**
     * a reference to the modal itself so the modal cann close itself
     */
    private self: any = {};

    constructor(
        private router: Router,
        private language: language,
        private model: model,
        private view: view,
        private metadata: metadata,
        private modal: modal,
        private toast: toast
    ) {
        this.view.isEditable = true;
        this.view.setEditMode();

        this.action$ = this.actionSubject.asObservable();
    }

    public ngOnInit() {
        this.componentconfig = this.metadata.getComponentConfig(this.constructor.name, this.model.module);
        this.actionSetItems = this.metadata.getActionSetItems(this.componentconfig.actionset);

        this.newValueFields = this.componentconfig.newValueFields;

        this.setNewValues();
    }

    private emitaction(event) {
        if(event) {
            this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED") + ".", "success");
        }
        this.self.destroy();
    }

    private closeModal() {
        // cancel Edit
        this.model.cancelEdit();

        // emit that we saved;
        this.actionSubject.next(false);
        this.actionSubject.complete();

        // destroy the component
        this.self.destroy();
    }

    private setNewValues() {
        this.newValueFields = JSON.parse(this.newValueFields);
        for(let newValueField of this.newValueFields) {
            this.model.setField(newValueField.name, newValueField.value);
        }
    }
}
