/**
 * @module ObjectComponents
 */
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Injector,
    Input,
    NgZone,
    Output,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {model} from "../../services/model.service";
import {Subscription} from "rxjs";

/**
 * the component that is rendered as part of an actionset and renders the actionset item
 */
@Component({
    selector: "object-action-container-item",
    templateUrl: "../templates/objectactioncontaineritem.html"
})
export class ObjectActionContainerItem implements AfterViewInit {
    /**
     * an Input parameter with the action item from the actionset items defined in the metadata
     */
    @Input() public actionitem: any;

    /**
     * passes on that the item shoudl diosplay as icon if the button supports that
     */
    @Input() public displayasicon: boolean = false;

    /**
     * an emitter that emits if the action was executed. This fires up through the acitonset item container as well
     */
    @Output() public actionemitter: EventEmitter<any> = new EventEmitter<any>();

    /**
     * a viewcontainer ref to the container itself so the action set item can render the component from the config in this element
     */
    @ViewChild("actioncontainer", {read: ViewContainerRef, static: true}) public actioncontainer: ViewContainerRef;

    /**
     * a reference to the individual component that was rendered in the conatinerrf as part of the actionset item config
     */
    public componentref: any;

    public subscriptions: Subscription = new Subscription();


    /**
     * defines standrd actions and their compoenntes that can be used in actionset items
     */
    public standardActions = {
        NEW: "ObjectActionNewButton",
        DUPLICATE: "ObjectActionDuplicateButton",
        NEWRELATED: "ObjectActionNewrelatedButton",
        EDIT: "ObjectActionEditButton",
        DELETE: "ObjectActionDeleteButton",
        AUDIT: "ObjectActionAuditlogButton",
        IMPORT: "SpiceImporterImportButton",
        MAIL: "ObjectActionBeanToMailButton",
        PRINT: "ObjectActionOutputBeanButton",
        SELECT: "ObjectActionSelectButton",
        OPEN: "ObjectActionOpenButton",
        CANCEL: "ObjectActionCancelButton",
        SAVE: "ObjectActionSaveButton",
        SAVERELATED: "ObjectActionSaveRelatedButton"
    };
    /**
     * @ignore
     */
    public stable: boolean = false;

    /**
     * @ignore
     */
    public stableSub: any;

    constructor(public language: language,
                public metadata: metadata,
                public model: model,
                public ngZone: NgZone,
                public injector: Injector,
                public cdr: ChangeDetectorRef) {
    }

    get id() {
        return this.actionitem.id;
    }

    get disabled() {
        if (this.stable && this.componentref) {
            return !!this.componentref.instance.disabled;
        } else {
            return true;
        }
    }

    get hidden() {
        if (this.stable && this.componentref) {
            return !!this.componentref.instance.hidden;
        } else {
            return true;
        }
    }

    /*
    * @addComponent actionitem.component | actionitem.action to actioncontainer
    * @pass parent
    * @pass actionconfig
    * @subscribe actionemitter
    * @set componentref
    * @set stableSub
    * @set stable
    */
    public ngAfterViewInit() {
        this.metadata.addComponent(this.actionitem.action ? this.standardActions[this.actionitem.action] : this.actionitem.component, this.actioncontainer, this.injector).subscribe(componentref => {
            componentref.instance.parent = this.model;
            componentref.instance.actionconfig = this.actionitem.actionconfig;
            componentref.instance.displayasicon = this.displayasicon;

            // emit the componentRef action emitter event
            if (componentref.instance.actionemitter) {
                this.subscriptions.add(
                    componentref.instance.actionemitter.subscribe(event => {
                        this.actionemitter.emit(event);
                    })
                );
            }

            // add the component and handle visibility
            this.componentref = componentref;
            // use ChangeDetectorRef.detectChanges to force the app to detect the changes
            // this prevents angular change detection error "ExpressionChangedAfterItHasBeenCheckedError"
            this.cdr.detectChanges();
        });


        // ugly workaround to detect once the first stable
        // change detection run is done and then start returning the poroper disabled valued
        this.stableSub = this.ngZone.onStable.subscribe(stable => {
            this.stable = true;
            this.stableSub.unsubscribe();
        });
    }

    /*
    * @unsubscribe subscriptions
    */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /*
    * @call componentref.execute if exists
    */
    public execute() {
        if (this.componentref && this.componentref.instance.execute) this.componentref.instance.execute();
    }
}
