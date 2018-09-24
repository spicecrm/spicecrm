import {Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ViewContainerRef, Optional} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {broadcast} from "../../services/broadcast.service";
import {model} from "../../services/model.service";

@Component({
    selector: "object-action-container",
    templateUrl: "./src/objectcomponents/templates/objectactioncontainer.html"
})
export class ObjectActionContainer implements AfterViewInit {
    @ViewChild("actioncontainer", {read: ViewContainerRef}) private actioncontainer: ViewContainerRef;

    @Input() private actionset: string = "";
    @Output() private actionemitter: EventEmitter<any> = new EventEmitter<any>();

    constructor(private language: language, private metadata: metadata, private model: model) {
    }

    public ngAfterViewInit() {
        let actionitems = this.metadata.getActionSetItems(this.actionset);
        if (actionitems) {
            for (let actionitem of actionitems) {
                if (actionitem.action) {
                    switch (actionitem.action) {
                        case "NEW":
                            if (this.metadata.checkModuleAcl(this.model.module, "create")) {
                                this.metadata.addComponent("ObjectActionNewButton", this.actioncontainer);
                            }
                            break;
                        case "DUPLICATE":
                            if (this.metadata.checkModuleAcl(this.model.module, "create")) {
                                this.metadata.addComponent("ObjectActionDuplicateButton", this.actioncontainer).subscribe(comp => {
                                    comp.instance.parent = this.model;
                                });
                            }
                            break;
                        case "NEWRELATED":
                            this.metadata.addComponent("ObjectActionNewrelatedButton", this.actioncontainer).subscribe(comp => {
                                comp.instance.parent = this.model;
                            });
                            break;
                        case "EDIT":
                            this.metadata.addComponent("ObjectActionEditButton", this.actioncontainer);
                            break;
                        case "DELETE":
                            this.metadata.addComponent("ObjectActionDeleteButton", this.actioncontainer);
                            break;
                        case "IMPORT":
                            if (this.metadata.checkModuleAcl(this.model.module, "import")) {
                                this.metadata.addComponent("ObjectActionImportButton", this.actioncontainer);
                            }
                            break;
                        case "AUDIT":
                            this.metadata.addComponent("ObjectActionAuditlogButton", this.actioncontainer);
                            break;
                        case "MAIL":
                            this.metadata.addComponent("ObjectActionBeanToMailButton", this.actioncontainer);
                            break;
                        case "SELECT":
                            this.metadata.addComponent("ObjectActionSelectButton", this.actioncontainer).subscribe(componentRef => {
                                componentRef.instance.actionconfig = actionitem.actionconfig;
                            });
                            break;
                    }
                } else {
                    this.metadata.addComponent(actionitem.component, this.actioncontainer).subscribe(buttonref => {
                        buttonref.instance.actionconfig = actionitem.actionconfig;
                        if (buttonref.instance.actionemitter) {
                            buttonref.instance.actionemitter.subscribe(event => {
                                this.actionemitter.emit(event);
                            });
                        }
                    });
                }
            }
        }
    }
}