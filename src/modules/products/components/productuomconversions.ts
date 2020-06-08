/**
 * @module ModuleProducts
 */
import {Component, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {configurationService} from "../../../services/configuration.service";
import {backend} from "../../../services/backend.service";

declare var _;
declare var moment: any;

@Component({
    selector: 'product-uom-conversions',
    templateUrl: './src/modules/products/templates/productuomconversions.html',
})

export class ProductUOMConversions implements OnInit {
    public uomUnits: any[] = [];
    public noUnits: boolean = false;
    private fieldBaseUom: string;
    private fieldBaseUomId: string;
    private componentconfig: any = {};

    constructor(private language: language,
                private metadata: metadata,
                private model: model,
                private backend: backend,
                private configuration: configurationService,
                private view: view) {
    }

    get uomConversions() {
        let conversions = this.model.getField('uomconversions');
        return conversions && conversions.beans ? _.toArray(conversions.beans).filter(bean => bean.deleted == '0' || bean.deleted === false) : [];
    }

    get baseUom() {
        return this.uomUnits.find(unit => unit.id == this.model.getField(this.fieldBaseUomId));
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
        return this.model.checkAccess('edit') && this.view.isEditable;
    }

    public ngOnInit() {
        this.getUomFieldDefs();
        this.getUomUnits();
        this.cloneParentConversions();
    }

    private setBaseUom(id) {
        let unit = this.uomUnits.find(unit => unit.id == id);
        if (!unit) return;
        this.model.setField(this.fieldBaseUom, unit.label);
        this.model.setField(this.fieldBaseUomId, unit.id);
    }

    private filteredUomUnits(conversion) {
        let filteredUom = this.uomUnits.filter(unit => {
            let sameBaseUom = this.baseUom && ((this.baseUom.id == unit.id) || ((unit.dimensions != 'none') && (this.baseUom.dimensions == unit.dimensions)));
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

    /**
     * loads the uomunits from the configureation service
     */
    private getUomUnits() {
        this.uomUnits = this.configuration.getData('uomunits');
    }

    private cloneParentConversions() {
        if (this.model.isNew && this.uomConversions.length > 0) {
            let originalConversions = this.model.data.uomconversions.beans;
            let clonedConversions = {};
            _.each(originalConversions, conversion => {
                conversion.id = this.model.generateGuid();
                clonedConversions[conversion.id] = conversion;
            });
            this.model.data.uomconversions.beans = clonedConversions;
        }
    }

    private addConversion() {
        if (!this.canAdd) return;
        this.view.setEditMode();
        let guid = this.model.generateGuid();
        if (!this.model.getFieldValue('uomconversion')) {
            this.model.data.uomconversions = { beans:{} };
        }
        this.model.data.uomconversions.beans[guid] = {
            id: guid,
            quantity: '1',
            conversion_factor: '',
            uom_unit: '',
            reference_uom_unit: this.baseUom.id,
            deleted: '0',
            assigned_user_id: this.model.getFieldValue('assigned_user_id')
        };
    }

    private deleteConversion(id) {
        this.model.data.uomconversions.beans[id].deleted = '1';
    }

    private getConversionUomLabel(conversionUom) {
        let uom = this.uomUnits.find(unit => unit.id == conversionUom);
        return uom ? this.language.getLabel(uom.label) : '';
    }

    private trackByFn(index, item) {
        return item.id;
    }
}
