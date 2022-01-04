/**
 * @module ModuleSalesDocs
 */
import {Component, OnInit, Injector, SkipSelf} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";

declare var _: any;

@Component({
    templateUrl: "../templates/salesvoucherredeembutton.html",

})
export class SalesVoucherRedeemButton {

    public actionconfig: any = {};

    constructor(public language: language, public metadata: metadata, public parentmodel: model, public modal: modal, public injector: Injector) {

    }

    /**
     * execute when the button is clicked
     */
    public execute() {
        this.modal.openModal( 'SalesVoucherRedeemModal', true, this.injector);
    }

    /**
     * disable if open value is less than 0 or the voucher is not yet paid
     */
    get disabled() {
        return !(this.parentmodel.getField('voucher_value_open') > 0 && this.parentmodel.getField('voucher_status') == 'paid');
    }

}
