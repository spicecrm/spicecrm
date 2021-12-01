/**
 * @module ObjectComponents
 */
import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChildren,
    QueryList,
    OnInit,
    OnChanges, AfterViewInit, NgZone, ChangeDetectorRef
} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {model} from "../../services/model.service";
import {ObjectActionContainerItem} from "./objectactioncontaineritem";

/**
 * a container that renders an actionset with the buttons in teh actionset
 */
@Component({
    selector: "object-action-container",
    templateUrl: "../templates/objectactioncontainer.html"
})
export class ObjectActionContainer implements OnChanges, AfterViewInit {
    /**
     * reference to the container item where the indivvidual components can be rendered into dynamically
     */
    @ViewChildren(ObjectActionContainerItem) public actionitemlist: QueryList<ObjectActionContainerItem>;

    /**
     * ToDo: ???
     */
    @Input() public containerclass: string = 'slds-button-group';

    /**
     * set to true to display the primary buttons as icons if the item supports this
     */
    @Input() public displayasicon: boolean = false;

    /**
     * the id of the actionset to be rendered
     */
    @Input() public actionset: string = "";

    /**
     * an array with the main action items. Allothers are rendered in the overflow
     */
    public mainactionitems: any[] = [];

    /**
     * the overflow action items
     */
    public addactionitems: any[] = [];

    /**
     * an event emitter that emits if an action is triggered in the actionset. Tis is usefuly if custom actionitems are used or if you want to subscribe in your application to an event from an actionset and trigger additonal actions once the action has been selected
     */
    @Output() public actionemitter: EventEmitter<any> = new EventEmitter<any>();

    /**
     * @ignore
     */
    public stable: boolean = false;

    /**
     * @ignore
     */
    public stableSub: any;

    constructor(public language: language, public metadata: metadata, public model: model, public ngZone: NgZone, public cdRef: ChangeDetectorRef) {
    }

    public ngOnChanges() {
        let actionitems = this.metadata.getActionSetItems(this.actionset);
        this.mainactionitems = [];
        this.addactionitems = [];
        let initial = true;

        for (let actionitem of actionitems) {
            if (initial || actionitem.singlebutton == '1') {
                this.mainactionitems.push({
                    disabled: true,
                    id: actionitem.id,
                    sequence: actionitem.sequence,
                    action: actionitem.action,
                    component: actionitem.component,
                    actionconfig: actionitem.actionconfig
                });
                initial = false;
            } else {
                this.addactionitems.push({
                    disabled: true,
                    id: actionitem.id,
                    sequence: actionitem.sequence,
                    action: actionitem.action,
                    component: actionitem.component,
                    actionconfig: actionitem.actionconfig
                });
            }
        }
    }


    public ngAfterViewInit(): void {
        // ugly workaround to detect once the first stable
        // change detection run is done and then start returning the poroper disabled valued
        this.stableSub = this.ngZone.onStable.subscribe(stable => {
            this.stable = true;
            this.stableSub.unsubscribe();
            this.cdRef.detectChanges();
        });
    }

    get opendisabled() {
        let disabled = true;
        this.addactionitems.some(actionitem => {
            if (this.isDisabled(actionitem.id) === false) {
                disabled = false;
                return true;
            }
        });
        return disabled;
    }

    get hasAddItems() {
        return this.addactionitems.length > 0;
    }

    public disabledhandler(id, disabled) {
        setTimeout(() => {
            this.mainactionitems.some((actionitem: any) => {
                if (actionitem.id == id) {
                    actionitem.disabled = disabled;
                    return true;
                }
            });

            this.addactionitems.some((actionitem: any) => {
                if (actionitem.id == id) {
                    actionitem.disabled = disabled;
                    return true;
                }
            });
        });
    }

    /**
     * a getter for additonal classes.
     * Considers the actonconfig and the hidden attribute
     *
     * @param actionitem the actionitem
     */
    public addclasses(actionitem) {
        let addclasses = actionitem.actionconfig.addclasses;
        if (this.isHidden(actionitem.id)) {
            addclasses += ' slds-hide';
        }
        return addclasses;
    }

    /**
     * determines based on the action ID if the component embedded in the container item is disabled
     *
     * @param actionid the action id
     */
    public isDisabled(actionid) {
        let disabled = true;
        if (this.actionitemlist) {
            this.actionitemlist.some((actionitem: any) => {
                if (actionitem.id == actionid) {
                    disabled = actionitem.disabled;
                    return true;
                }
            });
        }
        return disabled;
    }

    /**
     * determines based on the action ID if the component embedded in the container item is hidden
     *
     * @param actionid the action id
     */
    public isHidden(actionid) {
        if (!this.stable) return false;

        let hidden = false;
        if (this.actionitemlist) {
            let actionitem = this.actionitemlist.find(actionitem => actionitem.id == actionid);
            if (actionitem) hidden = actionitem.hidden;
        }
        return hidden;
    }


    public propagateclick(actionid) {
        this.actionitemlist.some(actionitem => {
            if (actionitem.id == actionid) {
                if (!actionitem.disabled) actionitem.execute();
                return true;
            }
        });
    }

    public emitaction(event) {
        this.actionemitter.emit(event);
    }
}
