import {
    Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ViewContainerRef,
    OnInit
} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {metadata} from "../../../services/metadata.service";
import {navigation} from "../../../services/navigation.service";
import {model} from "../../../services/model.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {fts} from "../../../services/fts.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";

@Component({
    selector: "lead-convert-account",
    templateUrl: "./src/modules/leads/templates/leadconvertaccount.html",
    providers: [view, model]
})
export class LeadConvertAccount implements AfterViewInit, OnInit {
    @ViewChild("detailcontainer", {read: ViewContainerRef}) private detailcontainer: ViewContainerRef;

    @Input() private  lead: any = {};

    // outputs for the interaction with the process
    @Output() private account: EventEmitter<model> = new EventEmitter<model>();
    @Output() private createaccount: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() private selectedaccount: EventEmitter<any> = new EventEmitter<any>();

    private initialized: boolean = false;
    private componentSet: string = "";
    private componentconfig: any = {};
    private componentRefs: any = [];
    private createAccount: boolean = false;


    public selectedAccount: any = undefined;
    public matchedAccounts: Array<any> = [];

    get create() {
        return this.createAccount;
    }

    set create(value) {
        this.createAccount = value;
        this.createaccount.emit(value);
    }


    constructor(private view: view, private metadata: metadata, private model: model, private modelutilities: modelutilities, private fts: fts) {

        // initialize the model
        this.model.module = "Accounts";
        this.model.initializeModel();

        // initialize the view
        this.view.isEditable = true;
        this.view.setEditMode();

    }

    public ngOnInit() {
        this.lead.data$.subscribe(data => {
            if (data.account_name !== "") {

                this.fts.searchByModules(this.modelutilities.cleanAccountName(data.account_name), ["Accounts"]).subscribe(res => {
                    this.matchedAccounts = res.Accounts.hits;
                    if (this.matchedAccounts.length === 0) {
                        this.create = true;
                    }
                });

                this.model.data.name = data.account_name;
                this.model.data.website = data.website;

                this.model.data.billing_address_street = data.primary_address_street;
                this.model.data.billing_address_city = data.primary_address_city;
                this.model.data.billing_address_postalcode = data.primary_address_postalcode;
                this.model.data.billing_address_state = data.primary_address_state;
                this.model.data.billing_address_country = data.primary_address_country;
            }
        });
        this.account.emit(this.model);
    }

    public ngAfterViewInit() {
        this.initialized = true;
        this.buildContainer();
    }

    private buildContainer() {
        // Close any already open dialogs
        for (let component of this.componentRefs) {
            component.destroy();
        }

        let componentconfig = this.metadata.getComponentConfig("ObjectRecordDetails", this.model.module);
        for (let panel of this.metadata.getComponentSetObjects(componentconfig.componentset)) {
            this.metadata.addComponent(panel.component, this.detailcontainer).subscribe(componentRef => {
                componentRef.instance.componentconfig = panel.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }
    }

    private selectAccount(event) {
        this.selectedAccount = event;
        this.selectedaccount.emit(event);
    }

    private unlinkAccount() {
        this.selectedAccount = undefined;
        this.selectedaccount.emit(undefined);
    }
}
