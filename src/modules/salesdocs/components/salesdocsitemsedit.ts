/**
 * @module ModuleSalesDocs
 */
import {
    Component,
    ElementRef,
    Injector
} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {configurationService} from '../../../services/configuration.service';
import {backend} from '../../../services/backend.service';
import {modal} from '../../../services/modal.service';
import {userpreferences} from '../../../services/userpreferences.service';

@Component({
    selector: 'salesdocs-items-edit',
    templateUrl: './src/modules/salesdocs/templates/salesdocsitemsedit.html'
})
export class SalesDocsItemsEdit {

    private items: any[] = [];
    private itemSubscription: any = undefined;
    // private taxcategories: any[] = [];
    private voucher_code: any = '';
    private voucher: any = {};

    constructor(private language: language, private backend: backend, private elementRef: ElementRef, private model: model, private userpreferences: userpreferences, private view: view, private configuration: configurationService, private modal: modal, private injector: Injector) {
        try {
            this.buildItems();
        } catch (e) {
            this.itemSubscription = this.model.data$.subscribe(data => {
                this.buildItems();
                this.itemSubscription.unsubscribe();
            });
        }

        /*
        let taxcategories = this.configurationService.getData('taxcategories');
        if (taxcategories === false) {
            this.backend.getRequest('SalesDocs/taxcategories').subscribe((taxcategories: any) => {
                this.configurationService.setData('salesdoctaxcategories', taxcategories);
                this.taxcategories = taxcategories;
            });
        } else {
            this.taxcategories = taxcategories;
        }
        */
    }

    get taxcategories() {
        return this.configuration.getData('salesdoctaxcategories');
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

    /**
     * returns the proper display name for the line from the item. Differentiating between product and product variant
     *
     * @param item
     */
    private displayname(item) {
        if (item.product_id) {
            return item.product_name;
        } else {
            return item.productvariant_name;
        }
    }

    private getUOMLabel(item) {
        let uoms = this.configuration.getData('uomunits');
        let unit = uoms.find(uom => uom.id == item.uom_id);
        if (unit) {
            return this.language.getLabel(unit.label);
        } else {
            return item.uom_id;
        }
    }

    private buildItems() {

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

    private getTaxPercentage(taxcategory) {
        let taxpercentage = 0;

        this.taxcategories.some(record => {
            if (record.taxcategoryid == taxcategory) {
                taxpercentage = parseInt(record.taxpercentage, 10);
                return true;
            }
        });

        return taxpercentage;
    }

    private recalculate() {
        for (let item of this.items) {
            if (parseFloat(item.quantity) && parseFloat(item.amount_net_per_uom)) {
                item.amount_net = parseFloat(item.quantity) * parseFloat(item.amount_net_per_uom);

                let taxpercentage = this.getTaxPercentage(item.tax_category);

                item.amount_gross = item.amount_net * (100 + taxpercentage) / 100;
                item.tax_amount = item.amount_net * taxpercentage / 100;

            } else {
                item.amount_net = 0;
                item.amount_gross = 0;
                item.tax_amount = 0;
            }
        }
    }

    private formatNumber(number) {
        return this.userpreferences.formatMoney(parseFloat(number));
    }

    private deleteItem(itemid) {
        // delete (this.model.data.salesdocitems.beans[itemid]);
        this.items.find(item => item.id == itemid).deleted = 1;
    }

    private addProduct() {
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = 'Products';
            selectModal.instance.multiselect = true;
            selectModal.instance.selectedItems.subscribe(items => {
                this.handleAddProducts(items);
            });
        });
    }

    private addProductVariant() {
        this.modal.openModal('SalesDocsItemsAddProduct').subscribe(addProductModal => {
            addProductModal.instance.items = this.items;
            addProductModal.instance.addproduct.subscribe(variants => {
                    this.handleAddProductVariant(variants);
                }
            );
        });
    }

    private getNextItemNr() {
        let lastitemnr = 0;
        for (let item of this.items) {
            let thisitemNr = parseInt(item.itemnr, 10);
            if (thisitemNr > lastitemnr) {
                lastitemnr = thisitemNr;
            }
        }

        return lastitemnr + 10;
    }

    private handleAddProductVariant(variants) {
        if (variants !== false) {
            let data = variants.product;
            let newItem = {
                id: this.model.generateGuid(),
                parentitem_id: variants.parentitem_id,
                productvariant_id: data.object.id,
                productvariant_name: data.object.data.name,
                name: data.object.data.name,
                deleted: 0,
                salesdoc_id: this.model.id,
                tax_category: 'V2',
                quantity: 1,
                itemnr: this.getNextItemNr(),
                uom_id: data.object.data.base_uom_id,
                amount_net_per_uom: data.object.data.std_price,
                purchase_price: data.object.data.purchase_price,
            };

            // this.items.push(newItem);

            // add to the bean as well
            if (!this.model.data.salesdocitems) {
                this.model.data.salesdocitems = {
                    beans: {}
                };
            }

            this.model.data.salesdocitems.beans[newItem.id] = newItem;

            this.buildItems();
        }

        this.recalculate();
    }

    private handleAddProducts(products) {
        if (!this.model.data.salesdocitems) {
            this.model.data.salesdocitems = {
                beans: {}
            };
        }

        let nextItemNr = this.getNextItemNr();

        for (let product of products) {
            let newItem = {
                id: this.model.generateGuid(),
                product_id: product.id,
                product_name: product.name,
                name: product.name,
                deleted: 0,
                salesdoc_id: this.model.id,
                tax_category: 'V20',
                quantity: 1,
                itemnr: nextItemNr,
                uom_id: product.base_uom_id,
                amount_net_per_uom: product.std_price,
                purchase_price: product.purchase_price,
            };

            this.model.data.salesdocitems.beans[newItem.id] = newItem;

            // add 10 to te item number
            nextItemNr = nextItemNr + 10;
        }

        this.buildItems();

        this.recalculate();
    }

    private toggleIcon(expanded) {
        return expanded ? 'chevronup' : 'chevrondown';
    }

    private toggleText(id) {
        this.items.some(item => {
            if (item.id == id) {
                item.expanded = !item.expanded;
                return true;
            }
        });
    }

    private checkVoucherCode() {
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

    /**
     * called to add an Item
     */
    private addItem() {
        this.modal.openModal('SalesDocsItemsAddTypeSelector', true, this.injector).subscribe(addItemModal => {
            addItemModal.instance.itemTypeSelected.subscribe(itemType => {
                if (itemType) {
                    // get the item type data
                    let itemTypes = this.configuration.getData('salesdocitemtypes');
                    let itemTypeDetails = itemTypes.find(thisItemType => thisItemType.name == itemType);
                    if (itemTypeDetails) {
                        this.modal.openModal(itemTypeDetails.addmodalcomponent, true, this.injector).subscribe(addModal => {
                            addModal.instance.additem.subscribe(item => {
                                // add the item
                                this.handleAddItem(item);
                            });
                        });
                    }
                }
            });
        });
    }

    private handleAddItem(itemData) {

        let newItem = {
            id: this.model.generateGuid(),
            deleted: 0,
            salesdoc_id: this.model.id,
            tax_category: 'V2',
            quantity: 1,
            itemnr: this.getNextItemNr(),
        };

        itemData.id = this.model.generateGuid();
        itemData.deleted = 0;
        itemData.salesdoc_id = this.model.id;
        itemData.tax_category = 'V20';
        itemData.quantity = 1;
        itemData.itemnr = this.getNextItemNr();

        // this.items.push(newItem);

        // add to the bean as well
        if (!this.model.data.salesdocitems) {
            this.model.data.salesdocitems = {
                beans: {}
            };
        }

        this.model.data.salesdocitems.beans[itemData.id] = itemData;

        this.buildItems();

        this.recalculate();
    }

}
