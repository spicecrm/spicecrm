import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChildren,
    QueryList,
    OnInit,
    ChangeDetectorRef, AfterViewInit, AfterContentInit, PipeTransform, Pipe, OnChanges
} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {model} from "../../services/model.service";
import {ObjectActionContainerItem} from "./objectactioncontaineritem";


@Component({
    selector: "object-action-container",
    templateUrl: "./src/objectcomponents/templates/objectactioncontainer.html"
})
export class ObjectActionContainer implements OnChanges {
    @ViewChildren(ObjectActionContainerItem) private actionitemlist: QueryList<ObjectActionContainerItem>;

    @Input() private actionset: string = "";
    public mainactionitems: any[] = [];
    private addactionitems: any[] = [];
    @Output() public actionemitter: EventEmitter<any> = new EventEmitter<any>();

    private isOpen: boolean = false;

    constructor(private language: language, private metadata: metadata, private model: model, private changeDetectorRef: ChangeDetectorRef) {
    }

    public ngOnChanges() {
        let actionitems = this.metadata.getActionSetItems(this.actionset);
        this.mainactionitems = [];
        this.addactionitems = [];
        let initial = true;

        for (let actionitem of actionitems) {
            if (initial) {
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

    private toggleOpen() {
        this.isOpen = !this.isOpen;
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

    private disabledhandler(id, disabled) {
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

    private isDisabled(actionid) {
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

    private propagateclick(actionid) {
        this.actionitemlist.some(actionitem => {
            if (actionitem.id == actionid) {
                if (!actionitem.disabled) actionitem.execute();
                return true;
            }
        });
    }

    private emitaction(event) {
        this.actionemitter.emit(event);
    }
}
