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
    OnChanges, AfterViewInit, NgZone, ChangeDetectorRef, KeyValueDiffer, ElementRef
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
     * set to true to disable the complete actioncontainer
     */
    @Input() disabled: boolean = false;

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
     * an event emitter that emits if an action is triggered in the actionset. Tis is usefuly if custom actionitems are used or if you want to subscribe in your application to an event from an actionset and trigger additonal actions once the action has been selected
     */
    @Output() public actionemitter: EventEmitter<any> = new EventEmitter<any>();

    /**
     * @ignore
     */
    public stable: boolean = false;
    /**
     * holds the horizontal view boolean
     */
    public horizontalView: boolean = false;

    /**
     * @ignore
     */
    public stableSub: any;
    /**
     * holds the groups
     */
    public groups: {name: string, sequence: number, hidden: boolean, items: any[]}[] = [];
    /**
     * holds grouped value
     */
    public grouped: 'vertical' | 'horizontal' | 'no';

    constructor(public language: language, public metadata: metadata, public model: model, public ngZone: NgZone, public cdRef: ChangeDetectorRef) {
    }

    public ngDoCheck() {
        if (!this.stable) return;

        this.groups.forEach(group => {
            group.hidden = this.actionitemlist.filter(i =>  (i.actionitem.actionconfig?.group == group.name || !i.actionitem.actionconfig?.group && group.name == 'undefined') && !i.hidden).length == 0;
        })
    }

    /**
     * build the action groups
     * @private
     */
    private buildItems() {

        const actionItems = this.metadata.getActionSetItems(this.actionset)
            .sort((a, b) => a.sequence > b.sequence ? 1 : -1);

        this.mainactionitems = [];
        let initial = true;
        this.groups = [];
        const groupsObj: {[key: string]: {name: string, sequence: number, hidden: boolean, items: any[]}} = {};

        for (const item of actionItems) {

            const actionItem = {
                disabled: true,
                id: item.id,
                sequence: item.sequence,
                action: item.action,
                component: item.component,
                actionconfig: item.actionconfig
            };

            if (initial || item.singlebutton == '1') {
                this.mainactionitems.push(actionItem);
                initial = false;
            } else {

                if (!this.isHidden(item.id)) {
                    const group = ['horizontal', 'vertical'].indexOf(this.grouped) > -1 && !!item.actionconfig?.group ? item.actionconfig?.group : 'undefined';
                    if (!groupsObj[group]) {
                        groupsObj[group] = {
                            name: group,
                            sequence: group == 'undefined' ? 1000 : Object.keys(groupsObj).length +1,
                            items: [actionItem],
                            hidden: false
                        };
                    } else {
                        groupsObj[group].items.push(actionItem);
                    }
                }
            }
        }

        this.groups = Object.values(groupsObj).sort((a,b) => a.sequence > b.sequence ? 1 : -1);
    }

    public ngOnChanges() {
        this.grouped = this.metadata.getActionSet(this.actionset)?.grouped;
        this.buildItems();
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
        this.groups.some(group => group.items.some(actionitem => {
            if (this.isDisabled(actionitem.id) === false) {
                disabled = false;
                return true;
            }
        }));
        return disabled;
    }

    get hasAddItems() {
        return this.groups.some(group => group.items.length > 0);
    }

    /**
     * a getter for additonal classes.
     * Considers the actonconfig and the hidden attribute
     *
     * @param actionitem the actionitem
     * @param buttonsize
     * @param isFirst
     * @param isLast
     */
    public addclasses(actionitem, buttonsize?: string, isFirst?: boolean | undefined, isLast?: boolean | undefined) {
        let addclasses = actionitem.actionconfig.addclasses;
        if (this.isHidden(actionitem.id)) {
            addclasses += ' slds-hide';
        }

        // change class for listitems
        if(actionitem.displayasicon || actionitem.singlebutton) {
            if(isFirst && isLast) {
                addclasses += ' ';
            } else if(isFirst && !isLast) {
                addclasses += ' slds-button_first ';
            } else if(!isFirst && isLast) {
                addclasses += ' slds-button_last ';
            } else if(!isFirst && !isLast) {
                addclasses += ' slds-button_middle ';
            }
        }

        // set buttonsize
        if(buttonsize) {
            addclasses +=  ' slds-button--icon-' + buttonsize;
        }

        return addclasses;
    }

    /**
     * determines based on the action ID if the component embedded in the container item is disabled
     *
     * @param actionid the action id
     */
    public isDisabled(actionid) {
        // if the container is disabled all items are disabled automatically
        if(this.disabled) return true;
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

    /**
     * determines based on the action ID if the component embedded in the container item is hidden
     *
     * @param name
     * @param groupItemsContainer
     */
    public isGroupHidden(name: string, groupItemsContainer: HTMLElement) {

        if (!this.stable) return false;

        return Array.from(groupItemsContainer.children).filter(c => !c.classList.contains('slds-hide')).length == 0;
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
