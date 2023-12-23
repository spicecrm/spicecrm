/**
 * @module ObjectComponents
 */
import {
    Component,
    Input,
    Output,
    EventEmitter,
    Injector,
    ViewChild,
    ViewContainerRef,
    AfterViewInit, OnChanges
} from '@angular/core';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {metadata} from '../../services/metadata.service';

/**
 * the container for the item in the list. Can be seleted by the angular selector and also handle the click on the element and propagate the click to the actionable function on the item
 */
@Component({
    selector: 'object-status-network-button-item',
    templateUrl: '../templates/objectstatusnetworkbuttonitem.html'
})
export class ObjectStatusNetworkButtonItem implements AfterViewInit, OnChanges {

    /**
     * a viewcontainer ref to the container itself so the action set item can render the component from the config in this element
     */
    @ViewChild("componentcontainer", {
        read: ViewContainerRef,
        static: true
    }) public componentcontainer: ViewContainerRef;

    /**
     * the item
     */
    @Input() public item: any = {};

    /**
     * the rendered action component if there is one rendered
     */
    public actioncomponent: any;

    public initialized: boolean = false;

    constructor(public language: language, public metadata: metadata, public modal: modal, public model: model, public injector: Injector) {

    }

    /**
     * a getter called from the button to triger the click
     */
    get id() {
        return this.item.id;
    }

    /**
     * checks if we have a component
     */
    get hasComponent() {
        return this.item.status_component && this.item.status_component != '';
    }

    /**
     * render the component if we have a status component
     */
    public ngAfterViewInit(): void {
        if (this.hasComponent && this.componentcontainer) {
            this.metadata.addComponent(this.item.status_component, this.componentcontainer, this.injector).subscribe(actioncomponent => {
                this.actioncomponent = actioncomponent.instance;
                actioncomponent.instance.item = this.item;
            });
        }

        this.initialized = true;
    }

    public ngOnChanges(): void {
        if(this.actioncomponent) {
            this.actioncomponent.self.destroy();
            this.actioncomponent = null;
        }
        if (this.initialized && this.hasComponent) {
            this.metadata.addComponent(this.item.status_component, this.componentcontainer, this.injector).subscribe(actioncomponent => {
                this.actioncomponent = actioncomponent.instance;
                actioncomponent.instance.item = this.item;
            });
        }
    }

    /**
     * public function to set the status .. triggered by the li of the element embedding
     *
     * first prompts if a prompt message is set, then excutes
     */
    public setStatus(statusfield) {
        if (this.item.prompt_label) {
            this.modal.confirm(this.language.getLabel(this.item.prompt_label, '', 'long'), this.language.getLabel(this.item.prompt_label, '')).subscribe(response => {
                if (response) {
                    this.executeChange(statusfield);
                }
            });
        } else {
            this.executeChange(statusfield);
        }
    }

    /**
     * executes the change on the embedded component or on the item itself
     * executes the model editing in silent mode
     *
     * @param statusfield
     */
    public executeChange(statusfield) {
        if(this.actioncomponent && this.actioncomponent.execute) {
            this.actioncomponent.execute();
        } else {
            this.model.startEdit(true, false);
            this.model.setField(statusfield, this.item.status_to);
            if (this.model.validate()) {
                this.model.save();
            } else {
                this.model.edit();
            }
        }
    }
}
