/**
 * @module ModuleProspects
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

/**
 * manages the prospect to account conversion giving the user the option to link to an account
 * also includes the duplicate check to find potential already created accounts
 */
@Component({
    selector: "prospect-convert-account",
    templateUrl: "../templates/prospectconvertaccount.html",
    providers: [view, model],
    standalone: false
})
export class ProspectConvertAccount implements AfterViewInit, OnInit {
    /**
     * the content container the component set for the account edit is rendered in
     */
    @ViewChild("detailcontainer", {read: ViewContainerRef, static: true}) public detailcontainer: ViewContainerRef;

    /**
     * emits the model that has been created
     */
    @Output() public account: EventEmitter<model> = new EventEmitter<model>();


    /**
     * the component config
     */
    public componentconfig: any ;

    /**
     *
     */
    public isLoading: boolean;

    /**
     * references to the components rendered in the view
     */
    public componentRefs = [];

    /**
     * the account selected if there is one
     * picked from the matched duplicates
     */
    public selectedAccount: any = undefined;

    /**
     * internal value for the checkbox allowing the user to select if he wants to link the prospect to an account or not
     */
    public _linktoaccount: boolean = true;


    constructor(public view: view, public metadata: metadata, @SkipSelf() public prospect: model, public model: model, public modelutilities: modelutilities, public fts: fts, public language: language) {

    }

    public ngOnInit() {
        this.initializeFromProspect();
    }

    public ngAfterViewInit() {
        this.buildContainer();
    }

    /**
     * initializes the account from the prospect using th ecopy rules
     * Also subscribes to the model data$ and updates the prospects account_id and account_linked_name if the model data changes
     */
    public initializeFromProspect() {
        // initialize the model
        this.model.module = "Accounts";

        // initialize the view
        this.view.isEditable = true;
        this.view.setEditMode();

        // if (this.prospect.getField('account_name')) {
            this.model.id = null;
            this.model.initialize(this.prospect);
            this._linktoaccount = true;
        // }

        if (this._linktoaccount) {
            this.account.emit(this.model);
        }

        // subscribe to the model data to get the account id and name
        this.model.data$.subscribe(data => {
            if(this._linktoaccount && (this.prospect.getField('account_id') != data.id || this.prospect.getField('account_linked_name') != data.name) ) {
                this.prospect.setFields({
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
            this.prospect.setFields({
                account_id: undefined
            });
        } else {
            this.account.emit(this.model);
        }
    }

    /**
     * builds the container and renders the data
     */
    public buildContainer() {
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
    public selectAccount(accountdata) {
        this.selectedAccount = accountdata;

        this.model.id = accountdata.id;
        this.model.isNew = false;
        this.model.setData(accountdata);
        this.prospect.setFields({
            account_id: this.model.id,
            account_linked_name: this.model.getField('name')
        });
        this.view.isEditable = false;

    }

    /**
     * then the user unlinks the account
     */
    public unlinkAccount() {
        this.selectedAccount = undefined;

        this.buildContainer();

        this.initializeFromProspect();
    }
}
