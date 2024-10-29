/**
 * @module ModulePotentials
 */
import {ChangeDetectorRef, Component, OnInit, ViewChild} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {currency} from "../../../services/currency.service";
import {backend} from "../../../services/backend.service";
import {userpreferences} from "../../../services/userpreferences.service";
import {configurationService} from "../../../services/configuration.service";

import {language} from "../../../services/language.service";
import {ObjectRelatedList} from '../../../objectcomponents/components/objectrelatedlist';
import {relatedmodels} from "../../../services/relatedmodels.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ObjectRelatedCardHeader} from "../../../objectcomponents/components/objectrelatedcardheader";

@Component({
    selector: "potentials-manager",
    templateUrl: "../templates/potentialsmanager.html",
    providers: [relatedmodels],
    animations: [
        trigger('displaycard', [
            transition(':enter', [
                style({opacity: 0, height: '0px', overflow: 'hidden'}),
                animate('.5s', style({height: '*', opacity: 1})),
                style({overflow: 'unset'})
            ]),
            transition(':leave', [
                style({overflow: 'hidden'}),
                animate('.5s', style({height: '0px', opacity: 0}))
            ])
        ])
    ],
})
export class PotentialsManager extends ObjectRelatedList implements OnInit {

    /**
     * a selector for the Header in teh card. This will trigger the open or collapsed stated
     */
    @ViewChild(ObjectRelatedCardHeader, {static: false}) public cardheaders: ObjectRelatedCardHeader;

    /**
     * holds the curent compüanycode as filter criteria for the list
     */
    public _companyCode: string;

    /**
     * holds the revenues in all productgropups for this accounts and companycode
     */
    public cc_revenues: any[] = [];

    /**
     * an indicator that the revenues are loading
     */
    public cc_revenues_loading: boolean = true;

    /**
     * holds an array of currencies
     */
    public currencies: any[] = [];

    constructor(
        public language: language,
        public metadata: metadata,
        public relatedmodels: relatedmodels,
        public model: model,
        public configuration: configurationService,
        public backend: backend,
        public currency: currency,
        public userpreferences: userpreferences,
        public cdref: ChangeDetectorRef
    ) {
        super(language, metadata, relatedmodels, model, cdref);

        this.currencies = this.currency.getCurrencies();

    }


    get companyCode() {
        return this._companyCode;
    }

    set companyCode(companyCode) {
        this._companyCode = companyCode;
        this.relatedmodels.fieldfilters = {companycode_id: this._companyCode};
        this.loaded = false;
        this.loadRelated();

        // load the revenues
        this.getRevenues();
    }


    public ngOnInit() {
        // loads the config
        this.loadConfig();

        // Initialize the related Model Service
        this.initializeRelatedModelService();

        // load more items
        this.relatedmodels.loaditems = 50;

        // get the company codes and set the first by default
        let companyCodes = this.configuration.getData('companycodes');
        if (companyCodes && companyCodes.length > 0) {
            companyCodes.sort((a, b) => a.name > b.name ? -1 : 1);
            if (this.userpreferences.companyCodeId) {
                this._companyCode = this.userpreferences.companyCodeId;
            } else {
                this._companyCode = companyCodes[0].id;
            }
            // set the related models filter
            this.relatedmodels.fieldfilters = {companycode_id: this._companyCode};

            // load all revenues
            this.getRevenues();
        }

        // load related items
        this.loadRelated();
    }

    /**
     * loads the revenues for the companycde
     */
    public getRevenues() {
        this.cc_revenues = [];
        this.cc_revenues_loading = true;
        this.backend.getRequest("module/Accounts/" + this.model.id + "/related/potentials/revenues/" + this._companyCode ).subscribe(revenues => {
            this.cc_revenues = revenues;
            this.cc_revenues_loading = false;
        });
    }


    /**
     * a helper function to determine if the card shoudl be hidden based on the modelstate or the ACL check
     */
    get hidden() {
        return !this.checkModelState() || !this.aclAccess;
    }

    /**
     * a helper function to determine if the list is loading
     */
    get isloading() {
        return this.relatedmodels.isloading;
    }

    /**
     * a helper to get if we have related models and the state is open
     */
    get isopen() {
        if (this.cardheaders && !this.cardheaders.isopen) {
            return false;
        }

        return this.relatedmodels.count > 0 || this.cc_revenues.length > 0 || this.isloading;
    }

    /**
     * checks the model state if a requiredmodelstate is set in the componentconfig
     */
    public checkModelState() {
        if (this.componentconfig.requiredmodelstate && !this.model.checkModelState(this.componentconfig.requiredmodelstate)) {
            return false;
        }

        // by default return true
        return true;
    }

    /**
     * overwirte from relatedmodels
     */
    public ngAfterViewInit() {
        // this.loadRelated();
    }


    /**
     * helper to get the currency symbol
     */
    get currencySymbol(): string {
        let currencyid = -99;
        return this.currency.getCurrencySymbol(currencyid);
    }

    /**
     * a simpel function to return a aprsed money value
     */
    public parseCurrencyValue(fieldval) {
        if (fieldval === undefined) return '';
        let val = parseFloat(fieldval);
        if (isNaN(val)) return '';
        return this.currencySymbol + ' ' + this.userpreferences.formatMoney(val);
    }

    /**
     * checks if a potential exists or can be added
     *
     * @param productgroup_id the id of the prodzuctgroup of this record
     */
    public canAddPotential(productgroup_id) {
        // if related models are loading disable buttons
        if (this.relatedmodels.isloading) return false;

        // otherewise check if we have a record
        let related = this.relatedmodels.items.find(record => record.productgroup_id == productgroup_id);
        if (related) {
            return false;
        } else {
            return true;
        }
    }

}
