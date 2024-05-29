/**
 * @module ObjectComponents
 */
import {
    Component, EventEmitter, Input, OnInit, Optional, Output,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import {Router} from '@angular/router';
import {Subject, Subscription} from 'rxjs';

import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {modalwindow} from "../../../services/modalwindow.service";
import {navigationtab} from "../../../services/navigationtab.service";
import {backend} from "../../../services/backend.service";
import { session } from '../../../services/session.service';
import { userpreferences } from '../../../services/userpreferences.service';
import { field } from '../../../objectfields/components/field';

declare var moment;

/**
 * renders a modal window to add or edit an object record
 */
@Component({
    templateUrl: '../templates/eventbookingaddmodal.html',
    providers: [view, modalwindow]
})
export class EventBookingAddModal implements OnInit {

    @Output() public action: EventEmitter<any> = new EventEmitter<any>();

    /**
     * all selected beans
     */
    @Input() public capacityType: any = [];

    /**
     * a reference to the modal content to have a reference to scrolling
     */
    @ViewChild('modalContent', {read: ViewContainerRef, static: true}) public modalContent: ViewContainerRef;
    /**
     * the componentconfig that gets passed in when the modal is created
     */
    public componentconfig: any;

    /**
     * the actionset items to be rendered in the modal
     */
    public actionSetItems: any = [];


    public datestartfieldconfig: any = [];

    /**
     * ToDo: add documentation what we need this for
     */
    public actionSubject: Subject<any> = new Subject<any>();

    @Input() public preventGoingToRecord = false;

    public subscriptions: Subscription = new Subscription();

    public disabledSaveButton: boolean = true;

    /**
     * a reference to the modal itself so the modal cann close itself
     */
    public self: any = {};

    constructor(
        public router: Router,
        public language: language,
        public model: model,
        public view: view,
        public metadata: metadata,
        public modal: modal,
        public modalwindow: modalwindow,
        @Optional() public navigationtab: navigationtab,
        public backend: backend,
        public session: session,
        public userpreferences: userpreferences
    ) {
        // view is editable
        this.view.isEditable = true;

        // do not follow links
        this.view.displayLinks = false;

        // set the edit mode
        this.view.setEditMode();

        // start editing
        this.model.startEdit();

    }

    public ngOnInit() {
        if(!this.componentconfig) {
            this.componentconfig = this.metadata.getComponentConfig(this.constructor.name, this.model.module);
        }
        this.actionSetItems = this.metadata.getActionSetItems(this.componentconfig.actionset);

        // set the reference to self ..
        // helper service so buttons can destroy the window
        this.modalwindow.self = this.self;

        this.modelChangesSubscriber();
        this.model.resetFieldMessages('parent_name');
    }

    public modelChangesSubscriber() {
        this.subscriptions.add(this.model.observeFieldChanges('parent_id').subscribe({next: (value) => {
            if(value) {

                let utc_date_start = (new moment(this.model.getFieldValue('date_start'))).utc().format("YYYY-MM-DD HH:mm:ss");
                // check if user is available
                this.subscriptions.add(
                    this.backend.getRequest('module/EventCapacityTypes/' + this.capacityType.id + '/check/' + utc_date_start + '/' + this.model.getFieldValue('parent_type') + '/' + value).subscribe({next: (res) => {
                        if(res.success == true) {
                            this.disabledSaveButton = false;
                            this.model.resetFieldMessages('parent_name');
                        }
                    }, error: (error) => {
                            let fieldMessage: string;
                            this.disabledSaveButton = true;
                            if ( error.error.error.errorCode === 'alreadyBookingInFuture' ) {
                                const date = new moment.utc( error.error.error.details.bookingOn ).tz( this.session.getSessionData('timezone') || moment.tz.guess(true));
                                fieldMessage = this.language.getLabelFormatted( 'LBL_ALREADY_BOOKING_IN_FUTURE_W_DATE', [date.format( this.userpreferences.getDateFormat() )] );
                            } else {
                                fieldMessage = this.language.getLabel(error.error.error.lbl);
                            }
                            this.model.setFieldMessage('error', fieldMessage, 'parent_name', 'parent_name');
                    }})
                );
            } else {
                this.disabledSaveButton = true;
                this.model.resetFieldMessages('parent_name');
            }
        }
        }));
    }

    /**
     * unsubscribe from the broadcast
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public closeModal() {
        // cancel Edit
        this.model.cancelEdit();

        // emit that we saved;
        this.actionSubject.next(false);
        this.actionSubject.complete();

        // destroy the component
        this.self.destroy();
    }

    /**
     * a getter for the modal header which text shoudl be displayed
     */
    get modalHeader() {
        return this.model.module != '' ? this.language.getModuleName(this.model.module, true) : '';
    }

    /**
     * returns the grow entry from teh componentconfig
     */
    get grow() {
        return this.componentconfig.grow;
    }

    /*
    * @set saving
    * @emit 'save' by actionemitter
    * @call model.endEdit
    * @setViewMode
    */
    public saveBooking() {
        if (this.model.isSaving) return;
        this.disabledSaveButton = true;

        if (this.model.validate()) {
            this.subscriptions.add( this.model.save(true).subscribe( {
                next: saved => {
                    this.model.endEdit();
                    this.view.setViewMode();
                    this.action.emit( this.model );
                    this.closeModal();
                },
                error: () => this.disabledSaveButton
            }));
        }
    }

}
