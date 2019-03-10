/**
 * @module ObjectComponents
 */
import {AfterViewInit, Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {modal} from '../../services/modal.service';
import {dockedComposer} from '../../services/dockedcomposer.service';
import {activitiyTimeLineService} from '../../services/activitiytimeline.service';

/**
 * @ignore
 */
declare var moment: any;

/**
 * a component that is a generic container for adding items as part of the activitiy add container
 */
@Component({
    selector: 'object-activitiytimeline-add-item',
    templateUrl: './src/objectcomponents/templates/objectactivitytimelineadditem.html',
    providers: [model, view]
})
export class ObjectActivitiyTimelineAddItem implements OnInit, OnDestroy {

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
     * @ignore
     *
     * indicator if the panel is expanded or not
     */
    private isExpanded: boolean = false;

    /**
     * @ignore
     *
     * a handler to the parent subscription
     */
    private parentSubscription: any;

    constructor(private metadata: metadata, private activitiyTimeLineService: activitiyTimeLineService, private model: model, private view: view, private language: language, private modal: modal, private dockedComposer: dockedComposer, private ViewContainerRef: ViewContainerRef) {
    }

    /**
     * @ignore
     */
    public ngOnInit() {
        // initialize the model
        this.model.module = this.module;

        // subscribe to the parent models data Observable
        // name is not necessarily loaded
        this.parentSubscription = this.activitiyTimeLineService.parent.data$.subscribe(data => {
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
    }

    /**
     * @ignore
     *
     * cancels the subscription on the parent
     */
    public ngOnDestroy(): void {
        this.parentSubscription.unsubscribe();
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
     * initializes the model when the item is expanded
     */
    private initializeModule() {
        this.model.module = this.module;
        // SPICEUI-2
        this.model.id = this.model.generateGuid();
        this.model.initializeModel(this.activitiyTimeLineService.parent);
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
        this.isExpanded = false;
    }

    /**
     * catches when a custom action has been fired.Closes the container and resets the model
     *
     * @param event the event fired from teh custom action
     */
    handleaction(event) {
        this.initializeModule();
        this.isExpanded = false;
    }
}
