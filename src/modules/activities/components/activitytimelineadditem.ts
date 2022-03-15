/**
 * @module ModuleActivities
 */
import {AfterViewInit, Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {modal} from '../../../services/modal.service';
import {dockedComposer} from '../../../services/dockedcomposer.service';
import {activitiytimeline} from '../../../services/activitiytimeline.service';
import {modelattachments} from "../../../services/modelattachments.service";

/**
 * @ignore
 */
declare var moment: any;
declare var _: any;

/**
 * a component that is a generic container for adding items as part of the activitiy add container
 */
@Component({
    selector: 'activitytimeline-add-item',
    templateUrl: '../templates/activitytimelineadditem.html',
    providers: [model, view]
})
export class ActivityTimelineAddItem implements OnInit, OnDestroy {

    /**
     * @ignore
     *
     * the componentconfig that is added whent eh component is added
     */
    public componentconfig: any = {};

    /**
     * the fieldset for the header. Pulled from the componentnconfig for the component and the module
     */
    public headerFieldSet: string = '';

    /**
     * the fieldset for the body. Pulled from the componentnconfig for the component and the module
     */
    public bodyFieldSet: string = '';

    /**
     * the position for the utility buttons (cancel, expand, dock)
     */
    public utilityButtonsPosition: string = 'bottom';

    /**
     * @ignore
     *
     * indicator if the panel is expanded or not
     */
    public isExpanded: boolean = false;

    /**
     * set top true if the module can expand into a global docked composer modal
     * checked if the config exists
     */
    public canExpand: boolean = false;

    /**
     * set top true if the module can be docked into a composer
     * checked if the config exists
     */
    public canDock: boolean = false;

    /**
     * @ignore
     *
     * a handler to the parent subscription
     */
    public parentSubscription: any;

    constructor(public metadata: metadata, public activitiytimeline: activitiytimeline, public model: model, public view: view, public language: language, public modal: modal, public dockedComposer: dockedComposer, public ViewContainerRef: ViewContainerRef) {
    }

    /**
     * @ignore
     */
    public ngOnInit() {
        // initialize the model
        this.model.module = this.module;
        this.model.initializeModel();

        // subscribe to the parent models data Observable
        // name is not necessarily loaded
        this.parentSubscription = this.activitiytimeline.parent.data$.subscribe(data => {
            // if we still have the same model .. update
            if (data.id == this.model.getField('parent_id')) {
                this.model.setField('parent_name', data.summary_text);
            }
        });

        // set view to editbale and edit mode
        this.view.isEditable = true;
        this.view.setEditMode();

        // get the fields
        this.headerFieldSet = this.componentconfig.headerfieldset;
        this.bodyFieldSet = this.componentconfig.bodyfieldset;

        // position for buttons
        if(this.componentconfig.utilitybuttonsposition) {
            this.utilityButtonsPosition = this.componentconfig.utilitybuttonsposition;
        }

        // check if the model can expand in a GlobalDockedComposerModal
        this.checkCanExpand();

        // check if the model can be docked into a GlobalDockedComposer
        this.checkCanDock();
    }

    /**
     * @ignore
     *
     * cancels the subscription on the parent
     */
    public ngOnDestroy(): void {
        if (this.parentSubscription) this.parentSubscription.unsubscribe();
    }

    /**
     * getter for the module from the componentconfig
     */
    get module() {
        return this.componentconfig.module;
    }

    /**
     * getter for the actionset fromn the config
     */
    get actionset() {
        return this.componentconfig.actionset;
    }

    /**
     * returns if attachments are allowed. Then displays the attachment panel
     */
    get allowattachments() {
        return this.componentconfig.allowattachments === true ? true : false;
    }

    /**
     * initializes the model when the item is expanded
     */
    public initializeModule() {
        this.model.module = this.module;
        // SPICEUI-2
        this.model.id = undefined;
        this.model.initializeModel(this.activitiytimeline.parent);

    }

    /**
     * the trigger when the header fieldset or any item therein in focused and the item is expanded
     */
    public onHeaderClick() {
        if (!this.isExpanded) {
            this.isExpanded = true;
            this.initializeModule();

            // set start editing here as well so we can block navigating away
            this.model.startEdit(false);
        }
    }

    /**
     * checks if a GlobalDockedComposermodal is availabe for the module and thus the modal can be opened.
     */
    public checkCanExpand() {
        this.canExpand = !_.isEmpty(this.metadata.getComponentConfig('GlobalDockedComposerModal', this.model.module));
    }

    /**
     * expands the item and renders it in a modal undocking it from the activity tiemline container
     */
    public expand() {
        this.dockedComposer.addComposer(this.model.module, this.model, true);
        // this.modal.openModal('GlobalDockedComposerModal', true, this.ViewContainerRef.injector);
        this.isExpanded = false;
        this.initializeModule();
    }


    /**
     * checks if a GlobalDockedComposermodal is availabe for the module and thus the modal can be opened.
     */
    public checkCanDock() {
        this.canDock = !_.isEmpty(this.metadata.getComponentConfig('GlobalDockedComposer', this.model.module));
    }

    /**
     * docks the model to the docked composer and removes it from the activity timeline container
     */
    public dock() {
        this.dockedComposer.addComposer(this.model.module, this.model);
        this.isExpanded = false;
        this.initializeModule();
    }

    /**
     * cancels and collapses the container
     */
    public cancel() {
        this.model.cancelEdit();
        this.isExpanded = false;
        this.initializeModule();
    }

    /**
     * catches when a custom action has been fired.Closes the container and resets the model
     *
     * @param event the event fired from teh custom action
     */
    public handleaction(event) {
        this.initializeModule();
        this.view.setEditMode();
        this.isExpanded = false;
    }
}
