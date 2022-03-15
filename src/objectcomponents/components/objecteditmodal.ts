/**
 * @module ObjectComponents
 */
import {
    Component, Input, OnInit, Optional,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import {Router} from '@angular/router';
import {Subject, Observable} from 'rxjs';

import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';
import {modalwindow} from "../../services/modalwindow.service";
import {navigationtab} from "../../services/navigationtab.service";

/**
 * renders a modal window to add or edit an object record
 */
@Component({
    templateUrl: '../templates/objecteditmodal.html',
    providers: [view, modalwindow]
})
export class ObjectEditModal implements OnInit {
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

    /**
     * ToDo: add documentation what we need this for
     */
    public actionSubject: Subject<any> = new Subject<any>();

    /**
     * this emits the data ... is referenced from the modal save button that handles this
     */
    public action$: Observable<any> = new Observable<any>();

    /**
     * local copy of the dfuplicates from the model
     */
    public duplicates: any[] = [];

    /**
     * indicates if the user has chosen to display duplicates.
     */
    public showDuplicates: boolean = false;

    /**
     * set if the known duplicates table should be shown
     */
    public showDuplicatesTable: boolean = false;

    @Input() public preventGoingToRecord = false;

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
    ) {
        // view is editable
        this.view.isEditable = true;

        // do not follow links
        this.view.displayLinks = false;

        // set the edit mode
        this.view.setEditMode();

        // start editing
        this.model.startEdit();

        this.action$ = this.actionSubject.asObservable();
    }

    public ngOnInit() {
        if(!this.componentconfig) {
            this.componentconfig = this.metadata.getComponentConfig(this.constructor.name, this.model.module);
        }

        this.actionSetItems = this.metadata.getActionSetItems(this.componentconfig.actionset);

        // set the reference to self ..
        // helper service so buttons can destroy the window
        this.modalwindow.self = this.self;
    }

    get actionset() {
        return this.componentconfig.actionset;
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

    /**
     * handles the event emitted by the actionset
     *
     * @param event
     */
    public handleAction(event) {
        switch (event) {
            case 'savegodetail':
                this.actionSubject.next(event);
                this.model.goDetail(this.navigationtab?.tabid);
                break;
            case 'save':
                this.actionSubject.next(event);
                break;
            default:
                this.actionSubject.next(false);
        }
        this.actionSubject.complete();
        this.self.destroy();
    }


    /**
     * returns if the duplicate check iss enabled for the module. Used for the visiblity of he duplicates button in the view
     */
    get duplicateCheckEnabled() {
        return this.model.isNew && this.metadata.getModuleDuplicatecheck(this.model.module);
    }

}
