/**
 * @module ModuleSalesDocs
 */
import {Component, OnInit, Injector, SkipSelf} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";

declare var _: any;

@Component({
    templateUrl: "../templates/salesvoucherredeemmodal.html",
    providers: [model, view]
})
export class SalesVoucherRedeemModal {

    /**
     * reference to the modal itself to be able to close it
     */
    public self: any;

    /**
     * the componentset to be rendered
     */
    public componentset: string;

    constructor(public metadata: metadata, public view: view, public model: model, @SkipSelf() public parent: model) {

        this.view.isEditable = true;
        this.view.setEditMode();
        this.view.displayLinks = false;

        this.model.module = 'SalesVoucherRedemptions';
        this.model.initialize(this.parent);

        let componentConfig = this.metadata.getComponentConfig('ObjectRecordDetails', this.model.module);
        this.componentset = componentConfig.componentset;
    }

    /**
     * returns when the redemtpion amount is larger than the open amount
     */
    get overspent() {
        return this.model.getField('redemption_amount') > this.parent.getField('voucher_value_open');
    }

    public close() {
        this.self.destroy();
    }

    public save() {
        if(!this.overspent && this.model.validate()) {
            this.model.save().subscribe(saved => {
                this.parent.getData(false);
                this.self.destroy();
            });
        }
    }

}
