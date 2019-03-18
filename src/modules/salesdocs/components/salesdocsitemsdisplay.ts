/**
 * @module ModuleSalesDocs
 */
import {
    Component,
    ElementRef
} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import { userpreferences } from '../../../services/userpreferences.service';

@Component({
    selector: 'salesdocs-items-display',
    templateUrl: './src/modules/salesdocs/templates/salesdocsitemsdisplay.html'
})
export class SalesDocsItemsDisplay {

    items: Array<any> = [];
    itemSubscription: any = undefined;
    voucher: any = {};

    constructor(private language: language, private backend: backend, private elementRef: ElementRef, private model: model, private userpreferences: userpreferences, private view: view) {
        try {
            this.buildItems();
            this.itemSubscription = this.model.data$.subscribe(data => {
                this.buildItems();
                this.itemSubscription.unsubscribe();
            })
        } catch (e) {
            this.itemSubscription = this.model.data$.subscribe(data => {
                this.buildItems();
                this.itemSubscription.unsubscribe();
            })
        }
    }

    buildItems() {
        this.items = [];
        for (let itemid in this.model.data.salesdocitems.beans) {
            this.items.push(this.model.data.salesdocitems.beans[itemid]);
        }

        this.items.sort((a, b) => {
            return a.itemnr > b.itemnr ? 1 : -1;
        });

        if(this.model.data.salesvouchers) {
            for (let voucherid in this.model.data.salesvouchers.beans) {
                this.voucher = this.model.data.salesvouchers.beans[voucherid];
            }
        }
    }

    get totalnet() {
        let total = 0;
        for (let item of this.items) {
            total += parseFloat(item.amount_net);
        }
        return total;
    }

    get totalgross() {
        let total = 0;
        for (let item of this.items) {
            total += parseFloat(item.amount_gross);
        }
        return total;
    }

    get totalgross2() {
        let total = 0;
        for (let item of this.items) {
            total += parseFloat(item.amount_gross);
        }
        if(this.voucher.voucher_type == 'amount'){
            total -= parseFloat(this.voucher.voucher_value);
        }
        if(this.voucher.voucher_type == 'percentage'){
            total -= (total / 100 * parseFloat(this.voucher.voucher_value));
        }
        return total;
    }

    get voucher_value(){
        let ret = '';
        if(this.voucher.voucher_type == 'percentage'){
            ret = this.voucher.voucher_value +'%';
        }
        return ret;
    }
    get voucher_sum(){
        let ret = '';
        if(this.voucher.voucher_type == 'amount'){
            ret = this.formatNumber(parseFloat(this.voucher.voucher_value));
        }
        if(this.voucher.voucher_type == 'percentage'){
            ret = this.formatNumber(this.totalgross / 100 * parseFloat(this.voucher.voucher_value));
        }
        return ret;
    }

    formatNumber(number) {
        return this.userpreferences.formatMoney(parseFloat(number));
    }

    getParentItemNr(parentitemid){
        if(parentitemid) {
            for (let item of this.items) {
                if (item.id = parentitemid) {
                    return item.itemnr;
                }
            }
        }

        return '';
    }

}