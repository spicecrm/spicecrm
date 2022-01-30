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
    NgZone, ChangeDetectorRef
} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {model} from "../../services/model.service";

/**
 * the component that is rendered as part of an actionset and renders the actionset item
 */
@Component({
    selector: "global-navigation-menu-item-action-container",
    templateUrl: "../templates/globalnavigationmenuitemactioncontainer.html"
})
export class GlobalNavigationMenuItemActionContainer implements AfterViewInit {


    /**
     * a viewcontainer ref to the container itself so the action set item can render the component from the config in this element
     */
    @ViewChild("actioncontainer", {read: ViewContainerRef, static: true})public actioncontainer: ViewContainerRef;

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
   public componentref: any;

    /**
     * defines standrd actions and their compoenntes that can be used in actionset items
     */
   public standardActions = {
        NEW: "GlobalNavigationMenuItemActionNew",
        ROUTE: "GlobalNavigationMenuItemActionRoute"
    };
    /**
     * @ignore
     */
   public stable: boolean = false;

    /**
     * @ignore
     */
   public stableSub: any;

    constructor(public language: language,public metadata: metadata,public model: model,public ngZone: NgZone,public cdr: ChangeDetectorRef) {
    }

    /**
     * returns the id of the action item
     */
    get id() {
        return this.actionitem.id;
    }

    /**
     * getter for the disabled state of the embedded component
     */
    get disabled() {
        if (this.componentref) {
            return this.componentref.instance.disabled ? true : false;
        } else {
            return true;
        }
    }

    /**
     * getter for the hidden state of the embedded component
     */
    get hidden() {
        if (this.componentref) {
            return this.componentref.instance.hidden ? true : false;
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
            // use ChangeDetectorRef.detectChanges to force the app to detect the changes
            // this prevents angular change detection error "ExpressionChangedAfterItHasBeenCheckedError"
            this.cdr.detectChanges();
        });
    }

    public execute() {
        if (this.componentref && this.componentref.instance.execute) this.componentref.instance.execute();
    }
}
