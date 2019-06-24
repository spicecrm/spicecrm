/**
 * @module ObjectComponents
 */
import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit,
    ViewChild,
    ViewContainerRef,
    NgZone
} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {model} from "../../services/model.service";

/**
 * the component that is rendered as part of an actionset and renders the actionset item
 */
@Component({
    selector: "object-action-container-item",
    templateUrl: "./src/objectcomponents/templates/objectactioncontaineritem.html"
})
export class ObjectActionContainerItem implements AfterViewInit {
    /**
     * a viewcontainer ref to the container itself so the action set item can render the component from the config in this element
     */
    @ViewChild("actioncontainer", {read: ViewContainerRef, static: true}) private actioncontainer: ViewContainerRef;

    /**
     * an Input parameter with the action item from the actionset items defined in the metadata
     */
    @Input() public actionitem: any;

    /**
     * an emitter that emits if the action was executed. This fires up through the acitonset item container as well
     */
    @Output() public actionemitter: EventEmitter<any> = new EventEmitter<any>();

    /**
     * a reference to the individual component that was rendered in the conatinerrf as part of the actionset item config
     */
    private componentref: any;

    /**
     * defines standrd actions and their compoenntes that can be used in actionset items
     */
    private standardActions = {
        NEW: "ObjectActionNewButton",
        DUPLICATE: "ObjectActionDuplicateButton",
        NEWRELATED: "ObjectActionNewrelatedButton",
        EDIT: "ObjectActionEditButton",
        DELETE: "ObjectActionDeleteButton",
        AUDIT: "ObjectActionAuditlogButton",
        IMPORT: "ObjectActionImportButton",
        MAIL: "ObjectActionBeanToMailButton",
        PRINT: "ObjectActionOutputBeanButton",
        SELECT: "ObjectActionSelectButton"
    }

    /**
     * @ignore
     */
    private stable: boolean = false;

    /**
     * @ignore
     */
    private stableSub: any;

    constructor(private language: language, private metadata: metadata, private model: model, private ngZone: NgZone) {
    }

    get id() {
        return this.actionitem.id;
    }

    get disabled() {
        if (this.stable && this.componentref) {
            return this.componentref.instance.disabled ? true : false;
        } else {
            return true;
        }
    }

    public ngAfterViewInit() {
        this.metadata.addComponent(this.actionitem.action ? this.standardActions[this.actionitem.action] : this.actionitem.component, this.actioncontainer).subscribe(componentref => {
            componentref.instance.parent = this.model;
            componentref.instance.actionconfig = this.actionitem.actionconfig;
            if (componentref.instance.actionemitter) {
                componentref.instance.actionemitter.subscribe(event => {
                    this.actionemitter.emit(event);
                });
            }

            // add the componentn and handle visibility
            this.componentref = componentref;
        });


        // ugly workaround to detect once the first stable
        // change detection run is done and then start returning the poroper disabled valued
        this.stableSub = this.ngZone.onStable.subscribe(stable => {
            this.stable = true;
            this.stableSub.unsubscribe();
        });
    }

    public execute() {
        if (this.componentref && this.componentref.instance.execute) this.componentref.instance.execute();
    }
}
