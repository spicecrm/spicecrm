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
import {configurationService} from '../../../services/configuration.service';
import {backend} from '../../../services/backend.service';
import {modal} from '../../../services/modal.service';
import { userpreferences } from '../../../services/userpreferences.service';

@Component({
    selector: 'salesdocs-items-edit',
    templateUrl: './src/modules/salesdocs/templates/salesdocsitemsedit.html'
})
export class SalesDocsItemsEdit {

    items: Array<any> = [];
    itemSubscription: any = undefined;
    taxcategories: Array<any> = [];
    voucher_code: any = '';
    voucher: any = {};

    constructor(private language: language, private backend: backend, private elementRef: ElementRef, private model: model, private userpreferences: userpreferences, private view: view, private configurationService: configurationService, private modal: modal) {
        try {
            this.buildItems();
        } catch (e) {
            this.itemSubscription = this.model.data$.subscribe(data => {
                this.buildItems();
                this.itemSubscription.unsubscribe();
            })
        }

        let taxcategories = this.configurationService.getData('taxcategories');
        if (taxcategories === false) {
            this.backend.getRequest('SalesDocs/taxcategories').subscribe((taxcategories: any) => {
                this.configurationService.setData('taxcategories', taxcategories);
                this.taxcategories = taxcategories;
            })
        } else {
            this.taxcategories = taxcategories;
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
        if (this.voucher.voucher_type == 'amount') {
            total -= parseFloat(this.voucher.voucher_value);
        }
        if (this.voucher.voucher_type == 'percentage') {
            total -= (total / 100 * parseFloat(this.voucher.voucher_value));
        }
        return total;
    }

    get voucher_value() {
        let ret = '';
        if (this.voucher.voucher_type == 'percentage') {
            ret = this.voucher.voucher_value + '%';
        }
        return ret;
    }

    get voucher_sum() {
        let ret = '';
        if (this.voucher.voucher_type == 'amount') {
            ret = this.formatNumber(parseFloat(this.voucher.voucher_value));
        }
        if (this.voucher.voucher_type == 'percentage') {
            ret = this.formatNumber(this.totalgross / 100 * parseFloat(this.voucher.voucher_value));
        }
        return ret;
    }

    buildItems() {

        this.items = [];

        if (this.model.data.salesdocitems && this.model.data.salesdocitems.beans) {
            for (let itemid in this.model.data.salesdocitems.beans) {
                this.items.push(this.model.data.salesdocitems.beans[itemid]);
            }

            this.items.sort((a, b) => {
                return a.itemnr > b.itemnr ? 1 : -1;
            });
        }

        if (this.model.data.salesvouchers) {
            for (let voucherid in this.model.data.salesvouchers.beans) {
                this.voucher = this.model.data.salesvouchers.beans[voucherid];
                this.voucher_code = this.model.data.salesvouchers.beans[voucherid].name;
            }
        }
    }

    getTaxPercentage(taxcategory) {
        let taxpercentage = 0;

        this.taxcategories.some(record => {
            if (record.taxcategoryid == taxcategory) {
                taxpercentage = parseInt(record.taxpercentage);
                return true;
            }
        });

        return taxpercentage;
    }

    recalculate() {
        for (let item of this.items) {
            if (parseFloat(item.quantity) && parseFloat(item.amount_net_per_uom)) {
                item.amount_net = parseFloat(item.quantity) * parseFloat(item.amount_net_per_uom);

                let taxpercentage = this.getTaxPercentage(item.tax_category)

                item.amount_gross = item.amount_net * (100 + taxpercentage) / 100;
                item.tax_amount = item.amount_net * taxpercentage / 100;

            } else {
                item.amount_net = 0;
                item.amount_gross = 0;
                item.tax_amount = 0;
            }
        }
    }

    formatNumber(number) {
        return this.userpreferences.formatMoney(parseFloat(number));
    }

    deleteItem(itemid) {
        delete(this.model.data.salesdocitems.beans[itemid]);
        this.items.some((item, index) => {
            if (item.id == itemid) {
                this.items.splice(index, 1);
                return true;
            }
        })
    }

    addProduct() {
        this.modal.openModal('SalesDocsItemsAddProduct').subscribe(addProductModal => {
            addProductModal.instance.items = this.items;
            addProductModal.instance.addproduct.subscribe(event => {
                    this.handleAddProduct(event)
                }
            );
        })
    }

    getNextItemNr() {
        let lastitemnr = 0;
        for (let item of this.items) {
            let thisitemNr = parseInt(item.itemnr);
            if (thisitemNr > lastitemnr)
                lastitemnr = thisitemNr;
        }

        return lastitemnr + 10;
    }

    handleAddProduct(eventData) {
        if (eventData !== false) {
            let data = eventData.product;
            let newItem = {
                id: this.model.generateGuid(),
                parentitem_id: eventData.parentitem_id,
                productvariant_id: data.object.id,
                productvariant_name: data.object.data.name,
                name: data.object.data.name,
                deleted: 0,
                salesdoc_id: this.model.id,
                tax_category: 'V2',
                quantity: 1,
                itemnr: this.getNextItemNr(),
                uom: data.object.data.base_uom,
                amount_net_per_uom: data.object.data.std_price,
                purchase_price: data.object.data.purchase_price,
            };

            // this.items.push(newItem);

            // add to the bean as well
            if (!this.model.data.salesdocitems) {
                this.model.data.salesdocitems = {
                    beans: {}
                }
            }

            this.model.data.salesdocitems.beans[newItem.id] = newItem;

            this.buildItems();
        }

        this.recalculate();
    }

    toggleIcon(expanded) {
        return expanded ? 'chevronup' : 'chevrondown';
    }

    toggleText(id) {
        this.items.some(item => {
            if (item.id == id) {
                item.expanded = !item.expanded;
                return true;
            }
        })
    }

    checkVoucherCode() {
        if (this.voucher_code.length > 0) {
            let params = {
                fields: JSON.stringify([
                    "voucher_type",
                    "voucher_value",
                    "id",
                    "name"
                ]),
                whereclause: " salesvouchers.salesdoc_id IS NULL AND salesvouchers.name = '" + this.voucher_code + "'",
                start: 0,
                size: 1
            };

            // check if the code is valid
            this.backend.getRequest('module/SalesVouchers', params).subscribe((vouchers: any) => {
                if (vouchers.list.length > 0 && vouchers.list[0].name == this.voucher_code) {
                    this.voucher = {
                        voucher_type: vouchers.list[0].voucher_type,
                        voucher_value: vouchers.list[0].voucher_value
                    };

                    let newItem = {
                        id: vouchers.list[0].id,
                        deleted: 0,
                        salesdoc_id: this.model.id
                    };
                    // add to the bean as well
                    if (!this.model.data.salesvouchers) {
                        this.model.data.salesvouchers = {
                            beans: {}
                        }
                    }

                    this.model.data.salesvouchers.beans[newItem.id] = newItem;
                } else {
                    this.voucher = {};
                }
            });
        }
    }
}