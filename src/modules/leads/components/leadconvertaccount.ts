/**
 * @module ModuleLeads
 */
import {
    Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ViewContainerRef,
    OnInit, SkipSelf
} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {fts} from "../../../services/fts.service";
import {view} from "../../../services/view.service";
import {language} from '../../../services/language.service';

@Component({
    selector: "lead-convert-account",
    templateUrl: "./src/modules/leads/templates/leadconvertaccount.html",
    providers: [view, model]
})
export class LeadConvertAccount implements AfterViewInit, OnInit {
    @ViewChild("detailcontainer", {read: ViewContainerRef, static: true}) private detailcontainer: ViewContainerRef;

    // outputs for the interaction with the process
    @Output() private account: EventEmitter<model> = new EventEmitter<model>();
    @Output() private selectedaccount: EventEmitter<any> = new EventEmitter<any>();

    private initialized: boolean = false;
    private componentSet: string = "";
    private componentconfig: any = {};
    private componentRefs: any = [];
    private createAccount: boolean = false;


    public selectedAccount: any = undefined;

    private _linktoaccount: boolean = true;


    constructor(private view: view, private metadata: metadata, @SkipSelf() private lead: model, private model: model, private modelutilities: modelutilities, private fts: fts, private language: language) {

    }

    public ngOnInit() {
        this.initializeFromLead();
    }

    public ngAfterViewInit() {
        this.initialized = true;
        this.buildContainer();
    }

    public initializeFromLead() {
        // initialize the model
        this.model.module = "Accounts";

        // initialize the view
        this.view.isEditable = true;
        this.view.setEditMode();

        if (this.lead.getField('account_name')) {
            this.model.id = null;
            this.model.initialize(this.lead);
            this._linktoaccount = true;
        }

        if (this._linktoaccount) {
            this.account.emit(this.model);
        }

        // subscribe to the model data to get the account id and name
        this.model.data$.subscribe(data => {
            if(this._linktoaccount && (this.lead.getField('account_id') != data.id || this.lead.getField('account_linked_name') != data.name) ) {
                this.lead.setFields({
                    account_id: this.model.id,
                    account_linked_name: this.model.getField('name')
                });
            }
        });

    }

    /**
     * getter for the link checkbox
     */
    get linktoaccount() {
        return this._linktoaccount;
        this.account.emit(this.model);
    }

    /**
     * setter for the link checkbox
     *
     * @param value
     */
    set linktoaccount(value) {
        this._linktoaccount = value;

        if (value == false) {
            this.account.emit(null);
            this.lead.setFields({
                account_id: undefined
            });
        } else {
            this.account.emit(this.model);
        }
    }

    /**
     * builds the container and renders the data
     */
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

    /**
     * when a duplicate is found and selected
     *
     * @param accountdata
     */
    private selectAccount(accountdata) {
        this.selectedAccount = accountdata;

        this.model.id = accountdata.id;
        this.model.isNew = false;
        this.model.data = this.model.utils.backendModel2spice('Accounts', accountdata);
        this.lead.setFields({
            account_id: this.model.id,
            account_linked_name: this.model.getField('name')
        });
        this.view.isEditable = false;

        this.selectedaccount.emit(this.model);
    }

    /**
     * then the user unlinks the account
     */
    private unlinkAccount() {
        this.selectedAccount = undefined;
        this.selectedaccount.emit(undefined);

        this.buildContainer();

        this.initializeFromLead();
    }
}
