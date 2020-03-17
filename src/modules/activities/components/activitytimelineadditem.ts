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

/**
 * @ignore
 */
declare var moment: any;

/**
 * a component that is a generic container for adding items as part of the activitiy add container
 */
@Component({
    selector: 'activitytimeline-add-item',
    templateUrl: './src/modules/activities/templates/activitytimelineadditem.html',
    providers: [model, view]
})
export class ActivityTimelineAddItem implements OnInit, OnDestroy {

    /**
     * @ignore
     *
     * the componentconfig that is added whent eh component is added
     */
    private componentconfig: any = {};

    /**
     * the fieldset for the header. Pulled from the componentnconfig for the component and the module
     */
    private headerFieldSet: string = '';

    /**
     * the fieldset for the body. Pulled from the componentnconfig for the component and the module
     */
    private bodyFieldSet: string = '';

    /**
     * the position for the utility buttons (cancel, expand, dock)
     */
    private utilityButtonsPosition: string = 'bottom';

    /**
     * @ignore
     *
     * indicator if the panel is expanded or not
     */
    public isExpanded: boolean = false;

    /**
     * @ignore
     *
     * a handler to the parent subscription
     */
    private parentSubscription: any;

    constructor(public metadata: metadata, public activitiytimeline: activitiytimeline, public model: model, public view: view, public language: language, public modal: modal, public dockedComposer: dockedComposer, public ViewContainerRef: ViewContainerRef) {
    }

    /**
     * @ignore
     */
    public ngOnInit() {
        // initialize the model
        this.model.module = this.module;

        // subscribe to the parent models data Observable
        // name is not necessarily loaded
        this.parentSubscription = this.activitiytimeline.parent.data$.subscribe(data => {
            // if we still have the same model .. update
            if (data.id == this.model.data.parent_id) {
                this.model.data.parent_name = data.summary_text;
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
    private initializeModule() {
        this.model.module = this.module;
        // SPICEUI-2
        this.model.id = undefined;
        this.model.initializeModel(this.activitiytimeline.parent);

        // set start editing here as well so we can block navigating away
        this.model.startEdit(false);
    }

    /**
     * the trigger when the header fieldset or any item therein in focused and the item is expanded
     */
    private onHeaderClick() {
        if (!this.isExpanded) {
            this.isExpanded = true;
            this.initializeModule();
        }
    }

    /**
     * expands the item and renders it in a modal undocking it from the activity tiemline container
     */
    private expand() {
        this.modal.openModal('GlobalDockedComposerModal', true, this.ViewContainerRef.injector);
    }

    /**
     * docks the model to the docked composer and removes it from the activity timeline container
     */
    private dock() {
        this.dockedComposer.addComposer(this.model.module, this.model);
        this.isExpanded = false;
    }

    /**
     * cancels and collapses the container
     */
    private cancel() {
        this.model.cancelEdit();
        this.isExpanded = false;
    }

    /**
     * catches when a custom action has been fired.Closes the container and resets the model
     *
     * @param event the event fired from teh custom action
     */
    private handleaction(event) {
        this.initializeModule();
        this.view.setEditMode();
        this.isExpanded = false;
    }
}
