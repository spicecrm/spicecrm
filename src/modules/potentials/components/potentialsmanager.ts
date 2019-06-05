/**
 * @module ModuleEmails
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {configurationService} from "../../../services/configuration.service";

import {language} from "../../../services/language.service";
import {ObjectRelatedList} from '../../../ObjectComponents/components/objectrelatedlist';
import {relatedmodels} from "../../../services/relatedmodels.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ObjectRelatedCardHeader} from "../../../objectcomponents/components/objectrelatedcardheader";

@Component({
    templateUrl: "./src/modules/potentials/templates/potentialsmanager.html",
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
    @ViewChild(ObjectRelatedCardHeader) private cardheaders: ObjectRelatedCardHeader;

    /**
     * holds the curent compüanycode as filter criteria for the list
     */
    private _companyCode: string;

    constructor(
        public language: language,
        public metadata: metadata,
        public relatedmodels: relatedmodels,
        public model: model,
        private configuration: configurationService
    ) {
        super(language, metadata, relatedmodels, model);

    }


    get companyCode() {
        return this._companyCode;
    }

    set companyCode(companyCode) {
        this._companyCode = companyCode;
        this.relatedmodels.fieldfilters = {companycode_id: this._companyCode};
        this.loadRelated();
    }


    public ngOnInit() {
        super.ngOnInit();

        // get the company codes and set the first by default
        let companyCodes = this.configuration.getData('companycodes');
        if (companyCodes && companyCodes.length > 0) {
            companyCodes.sort((a, b) => a.name > b.name ? -1 : 1);
            this._companyCode = companyCodes[0].id;
            this.relatedmodels.fieldfilters = {companycode_id: this._companyCode};
        }

        this.loadRelated();
    }

    /**
     * a helper function to determine if the card shoudl be hidden based on the modelstate or the ACL check
     */
    get hidden() {
        return !this.checkModelState() || !this.aclAccess();
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

        return this.relatedmodels.count > 0 || this.isloading;
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
     * checks if the user has Access per ACL rights
     */
    public aclAccess() {
        if (this.module) {
            return this.metadata.checkModuleAcl(this.module, "list");
        } else {
            return false;
        }
    }

    /**
     * overwirte from relatedmodels
     */
    public ngAfterViewInit() {
        // this.loadRelated();
    }

}
