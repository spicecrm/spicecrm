/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

/**
 * display and manage unit conversions and set the base unit of measure.
 */
@Component({
    selector: 'product-uom-conversions',
    templateUrl: './src/modules/products/templates/productuomconversions.html',
})

export class ProductUOMConversions implements OnInit {
    /**
     * holds the unit of measure units
     */
    public uomUnits: any[] = [];
    /**
     * boolean true if all units are used
     */
    public noUnits: boolean = false;
    /**
     * holds the base uom field name
     */
    private fieldBaseUom: string;
    /**
     * holds the base uom field id
     */
    private fieldBaseUomId: string;
    /**
     * holds the component  config
     */
    private componentconfig: any = {};

    constructor(private language: language,
                private metadata: metadata,
                private model: model,
                private backend: backend,
                private configuration: configurationService,
                private view: view) {
    }

    /**
     * @return the uom conversions value
     */
    get uomConversions(): any[] {
        let conversions = this.model.getField('uomconversions');
        return conversions && conversions.beans ? _.toArray(conversions.beans).filter(bean => bean.deleted == '0' || bean.deleted === false) : [];
    }

    /**
     * @return the base uom
     */
    get baseUom(): any {
        return this.uomUnits.find(unit => unit.id == this.model.getField(this.fieldBaseUomId));
    }

    /**
     * @return the base uom name
     */
    get baseUomName(): string {
        return this.model.getField(this.fieldBaseUom);
    }

    /**
     * @return can add boolean
     */
    get canAdd(): boolean {
        return this.baseUom && !this.noUnits;
    }

    get editMode() {
        return this.view.isEditMode();
    }

    /**
     * @return is editable boolean
     */
    get editable() {
        return this.model.checkAccess('edit') && this.view.isEditable;
    }

    /**
     * get the uom field defs
     * get the uom units from the configuration
     * clone the parent uom conversions
     */
    public ngOnInit() {
        this.getUomFieldDefs();
        this.getUomUnits();
        this.cloneParentConversions();
    }

    /**
     * set the base unit of measure
     * @param id
     */
    private setBaseUom(id: string) {
        let unit = this.uomUnits.find(unit => unit.id == id);
        this.model.setField(this.fieldBaseUom, !!unit ? unit.label : '');
        this.model.setField(this.fieldBaseUomId, !!unit ? unit.id : '');
    }

    /**
     * @return the filtered uom units
     * @param conversion
     */
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

    /**
     * set the uom field defs from config
     */
    private getUomFieldDefs() {
        this.fieldBaseUom = this.componentconfig.baseuomfield || this.fieldBaseUom;
        let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldBaseUom);
        this.fieldBaseUomId = fieldDefs && fieldDefs.id_name ? fieldDefs.id_name : this.fieldBaseUomId;
    }

    /**
     * loads the uom units from the configuration service
     */
    private getUomUnits() {
        this.uomUnits = this.configuration.getData('uomunits') || [];
    }

    /**
     * clone the parent uom conversions
     */
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

    /**
     * add a new conversion
     */
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

    /**
     * delete conversion
     * @param id
     */
    private deleteConversion(id: string) {
        this.model.data.uomconversions.beans[id].deleted = '1';
    }

    /**
     * get conversion display label
     * @param conversionUom
     */
    private getConversionUomLabel(conversionUom) {
        let uom = this.uomUnits.find(unit => unit.id == conversionUom);
        return uom ? this.language.getLabel(uom.label) : '';
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return item.id
     */
    private trackByFn(index, item) {
        return item.id;
    }
}
