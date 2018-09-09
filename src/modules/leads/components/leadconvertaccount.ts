import {
    Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ViewContainerRef,
    OnInit
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {navigation} from '../../../services/navigation.service';
import {model} from '../../../services/model.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {fts} from '../../../services/fts.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'lead-convert-account',
    templateUrl: './src/modules/leads/templates/leadconvertaccount.html',
    providers: [view, model]
})
export class LeadConvertAccount implements AfterViewInit, OnInit {
    @ViewChild('detailcontainer', {read: ViewContainerRef}) detailcontainer: ViewContainerRef;

    @Input() lead: any = {};

    // outputs for the interaction with the process
    @Output() account: EventEmitter<model> = new EventEmitter<model>();
    @Output() createaccount: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() selectedaccount: EventEmitter<any> = new EventEmitter<any>();

    initialized: boolean = false;
    componentSet: string = '';
    componentconfig: any = {};
    componentRefs: any = [];

    createAccount: boolean = false;

    get create() {
        return this.createAccount;
    }

    set create(value) {
        this.createAccount = value;
        this.createaccount.emit(value);
    }

    selectedAccount: any = undefined;
    matchedAccounts: Array<any> = [];

    constructor(private view: view, private metadata: metadata, private model: model, private modelutilities: modelutilities, private fts: fts) {

        // initialize the model
        this.model.module = 'Accounts';
        this.model.initializeModel();

        // initialize the view
        this.view.isEditable = true;
        this.view.setEditMode();

    }

    ngOnInit() {
        this.lead.data$.subscribe(data => {
            if (data.account_name !== '') {

                this.fts.searchByModules(this.modelutilities.cleanAccountName(data.account_name), ['Accounts']).subscribe(res => {
                    this.matchedAccounts = res.Accounts.hits;
                    if (this.matchedAccounts.length === 0)
                        this.create = true;
                });

                this.model.data.name = data.account_name;
                this.model.data.website = data.website;

                this.model.data.billing_address_street = data.primary_address_street;
                this.model.data.billing_address_city = data.primary_address_city;
                this.model.data.billing_address_postalcode = data.primary_address_postalcode;
                this.model.data.billing_address_state = data.primary_address_state;
                this.model.data.billing_address_country = data.primary_address_country;

                //this.account.emit(this.model);
            }
        });
        this.account.emit(this.model);
    }

    ngAfterViewInit() {
        this.initialized = true;
        this.buildContainer();
    }

    buildContainer() {
        // Close any already open dialogs
        // this.container.clear();
        for (let component of this.componentRefs) {
            component.destroy();
        }

        let componentconfig = this.metadata.getComponentConfig('ObjectRecordDetails', this.model.module);
        for (let panel of this.metadata.getComponentSetObjects(componentconfig.componentset)) {
            this.metadata.addComponent(panel.component, this.detailcontainer).subscribe(componentRef => {
                componentRef.instance['componentconfig'] = panel.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }
    }

    selectAccount(event) {
        this.selectedAccount = event;
        this.selectedaccount.emit(event);
    }

    unlinkAccount() {
        this.selectedAccount = undefined;
        this.selectedaccount.emit(undefined);
    }
}