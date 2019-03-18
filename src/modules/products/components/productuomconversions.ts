import {Component, OnDestroy, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {session} from "../../../services/session.service";
import {Subscription} from "rxjs";

declare var _;

@Component({
    selector: 'product-uom-conversions',
    templateUrl: './src/modules/products/templates/productuomconversions.html',
})

export class ProductUOMConversions implements OnInit, OnDestroy {
    public uomUnits: any[] = [];
    public baseUom: any;
    public noUnits: boolean = false;
    private fieldBaseUom: string;
    private fieldBaseUomId: string;
    private componentconfig: any = {};
    private subscription: Subscription = new Subscription();

    constructor(private language: language,
                private metadata: metadata,
                private model: model,
                private backend: backend,
                private session: session,
                private view: view) {
    }

    get uomConversions() {
        let conversions = this.model.getField('uomconversions');
        return conversions && conversions.beans ? _.toArray(conversions.beans).filter(bean => bean.deleted == '0') : [];
    }

    get baseUomName() {
        return this.model.getField(this.fieldBaseUom);
    }

    get canAdd() {
        return this.baseUom && !this.noUnits;
    }

    get editMode() {
        return this.view.isEditMode();
    }

    get editable() {
        return this.view.isEditable;
    }

    public ngOnInit() {
        this.getUomFieldDefs();
        this.getUomUnits();
        this.getBaseUom();
        this.checkBaseUomDisabled();
        this.modelSubscriber();
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private filteredUomUnits(conversion) {
        let filteredUom = this.uomUnits.filter(unit => {
            let sameBaseUom = (this.baseUom.id == unit.id) || ( (unit.dimensions != 'none') && (this.baseUom.dimensions == unit.dimensions) );
            let definedInConversions = this.uomConversions
                .some(c => {
                    if (conversion.id != c.id ) {
                        let exists = unit.id == c.uom_unit;
                        let cUnit = this.uomUnits.find(u => u.id == c.uom_unit);
                        let hasSameDimensions = cUnit && unit.dimensions != 'none' && cUnit.dimensions ? unit.dimensions == cUnit.dimensions : false;
                        return  exists || hasSameDimensions;
                    }
                    return false;
                });
            return !definedInConversions && !sameBaseUom;
        });
        this.noUnits = filteredUom.length == 1;
        return filteredUom;
    }

    private getUomFieldDefs() {
        this.fieldBaseUom = this.componentconfig.baseuomfield || this.fieldBaseUom;
        let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldBaseUom);
        this.fieldBaseUomId = fieldDefs && fieldDefs.id_name ? fieldDefs.id_name : this.fieldBaseUomId;
    }

    private getUomUnits() {
        let fields = ['id', 'label', 'dimensions'];
        let params = {limit: -1};
        this.backend.getList('UOMUnits', 'name', 'ASC', fields, params)
            .subscribe((res: any) => {
                if (res && res.list) {
                    this.uomUnits = res.list;
                }
            });
    }

    private getBaseUom() {
        if (!this.fieldBaseUomId) {
            return;
        }
        let baseUomId = this.model.getField(this.fieldBaseUomId);
        if (baseUomId) {
            this.backend.get('UOMUnits', baseUomId).subscribe(baseUom => this.baseUom = baseUom);
        }
    }

    private checkBaseUomDisabled() {
        let fieldStati = this.model.getFieldStati(this.fieldBaseUom);
        fieldStati.disabled = this.uomConversions.length > 0;
        this.model.setFieldStati(this.fieldBaseUom, fieldStati);
    }

    private modelSubscriber() {
        this.subscription = this.model.data$.subscribe(data => {
            this.getBaseUom();
        });
    }

    private addConversion() {
        this.view.setEditMode();
        this.model.startEdit();
        let guid = this.model.generateGuid();
        this.model.data.uomconversions.beans[guid] = {
            id: guid,
            quantity: '1',
            conversion_factor: '',
            uom_unit: '',
            reference_uom_unit: this.baseUom.id,
            deleted: '0',
            assigned_user_id: this.session.authData.userId
        };
        this.checkBaseUomDisabled();
    }

    private deleteConversion(id) {
        this.model.data.uomconversions.beans[id].deleted = '1';
        this.checkBaseUomDisabled();
    }

    private getConversionUomLabel(conversionUom) {
        let uom = this.uomUnits.find(unit => unit.id == conversionUom);
        return uom ? this.language.getLabel(uom.label) : '';
    }

    private trackByFn(index, item) {
        return item.id;
    }
}
