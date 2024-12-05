/**
 * @module ModuleSalesDocs
 */
import {Component, OnInit, Injector, SkipSelf} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {ObjectActionNewButton} from "../../../objectcomponents/components/objectactionnewbutton";
import {navigation} from "../../../services/navigation.service";

declare var _: any;

@Component({
    selector: 'sales-docs-new-button',
    templateUrl: "../../../objectcomponents/templates/objectactionnewbutton.html",
    providers: [model]
})
export class SalesdocsNewButton extends ObjectActionNewButton implements OnInit {

    public actionconfig: any = {};

    constructor(public language: language, public metadata: metadata, public model: model, @SkipSelf() public parentmodel: model, public modal: modal, public injector: Injector, public navigation: navigation) {
        super(language, metadata, model, parentmodel, injector);

        this.model.module = 'SalesDocs';
    }

    /**
     * execute when the button is clicked
     */
    public execute() {
        if (_.isEmpty(this.actionconfig)) {
            this.actionconfig = this.metadata.getComponentConfig('SalesdocsNewButton', this.model.module);
        }

        this.model.id = "";
        this.model.initialize(this.parentmodel);

        if (this.actionconfig.defaultsalesdoctype) {
            this.model.setField('salesdoctype', this.actionconfig.defaultsalesdoctype);
        }

        if(this.actionconfig.salesdocparty){
            this.model.setField('salesdocparty', this.actionconfig.salesdocparty);
        }

        if(this.actionconfig.salesdoccategory){
            this.model.setField('salesdoccategory', this.actionconfig.salesdoccategory);
        }


         this.modal.openModal(this.actionconfig.modalcomponent ? this.actionconfig.modalcomponent : 'SalesDocsAddBasics', true, this.injector);
    }

}
