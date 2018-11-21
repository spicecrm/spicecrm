import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit,
    ViewChild,
    ViewContainerRef,
    OnInit,
    HostListener,
    NgZone
} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {broadcast} from "../../services/broadcast.service";
import {model} from "../../services/model.service";

@Component({
    selector: "object-action-container-item",
    templateUrl: "./src/objectcomponents/templates/objectactioncontaineritem.html"
})
export class ObjectActionContainerItem implements AfterViewInit {
    @ViewChild("actioncontainer", {read: ViewContainerRef}) private actioncontainer: ViewContainerRef;

    @Input() public actionitem: any;
    @Output() public actionemitter: EventEmitter<any> = new EventEmitter<any>();

    private componentref: any;
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
    private stable: boolean = false;
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
