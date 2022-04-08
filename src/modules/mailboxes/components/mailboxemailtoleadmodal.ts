/**
 * @module ModuleMailboxes
 */
import {AfterViewInit, Component, HostBinding, Input, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";

@Component({
    providers: [model, view],
    templateUrl: "../templates/mailboxemailtoleadmodal.html",
})
export class MailboxEmailToLeadModal implements OnInit, AfterViewInit {

    @ViewChild("detailcontainer", {read: ViewContainerRef, static: true}) public detailcontainer: ViewContainerRef;

    public email: any = null;
    public self: any = null;

    public componentRefs: Array<any> = [];

    public leadFields: Array<string> = [
        "first_name",
        "last_name",
        "department",
        "account_name",
        "phone_mobile",
        "phone_work",
        "email1",
        "primary_address_street",
        "primary_address_city",
        "primary_address_postalcode",
        "primary_address_country",
        "description",
    ];

    constructor(
        public language: language,
        public metadata: metadata,
        public view: view,
        public model: model
    ) {
        this.model.module = "Leads";

    }

    public ngOnInit() {
        this.model.initializeModel(this.email);

        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngAfterViewInit(){
        this.buildContainer();
    }

    public closeModal(){
        this.self.destroy();
    }

    public buildContainer() {
        // reset any rendered component
        for (let component of this.componentRefs) {
            component.destroy();
        }
        this.componentRefs = [];

        let componentconfig = this.metadata.getComponentConfig("ObjectRecordDetails", this.model.module);
        for (let panel of this.metadata.getComponentSetObjects(componentconfig.componentset)) {
            this.metadata.addComponent(panel.component, this.detailcontainer).
            subscribe(componentRef => {
                componentRef.instance["componentconfig"] = panel.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }
    }

    public setField(fieldData){
        this.model.setField(fieldData.field, fieldData.value);
    }

    public saveLead(){
        this.model.save().subscribe(lead => {
            this.closeModal();
        });
    }

}
