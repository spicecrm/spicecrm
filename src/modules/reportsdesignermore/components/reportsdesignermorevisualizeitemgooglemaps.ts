/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleReportsDesignerMore
 */
import {Component, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {modal} from "../../../services/modal.service";
import {ReportsDesignerService} from "../../../modules/reportsdesigner/services/reportsdesigner.service";

@Component({
    selector: 'reports-designer-more-visualize-item-google-maps',
    templateUrl: './src/modules/reportsdesignermore/templates/reportsdesignermorevisualizeitemgooglemaps.html'
})
export class ReportsDesignerMoreVisualizeItemGoogleMaps implements OnInit {

    constructor(private language: language,
                private model: model,
                private modal: modal,
                private reportsDesignerService: ReportsDesignerService) {

    }

    get listFields() {
        return this.reportsDesignerService.listFields;
    }

    /**
     * @return properties: object
     */
    get properties() {
        return this.model.getField('visualization_params')[this.reportsDesignerService.visualizeActiveLayoutItem];
    }

    /**
     * @return colors: object[]
     */
    get themeColors() {
        const theme = this.reportsDesignerService.visualizeColorTheme
            .find(color => color.id == this.properties.googlemaps.kreportgooglemapscolorset);
        return !!theme ? theme.colors : [];
    }

    /**
     * @return colors: object[]
     */
    get colorOptions() {
        return this.reportsDesignerService.visualizeColorTheme;
    }

    public ngOnInit() {
        this.initializeProperties();
    }

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    protected trackByFnIndex(index, item) {
        return index;
    }

    /**
     * set the initial plugin properties data and load the context options
     */
    private initializeProperties() {
        if (this.properties.googlemaps && this.properties.googlemaps.uid) return;
        this.properties.googlemaps = {
            uid: this.reportsDesignerService.generateGuid(),
            kreportgooglemapstatitude: '',
            kreportgooglemapslongitude: '',
            geocodeby: {
                gctype: 'LATLONG'
            },
            kreportgooglemapstitle: '',
            kreportgooglemapsinfo: '',
            kreportgooglemapscluster: true,
            kreportgooglemapscolorset: 'spice',
            kreportgooglemapscolorcriteria: '',
            kreportgooglemapslegend: false,
            kreportgooglemapsspiderfy: false,
            kreportgooglemapsrouteplanner: false,
            kreportgooglemapsrouteplannerwaypointlabel: '',
            kreportgooglemapsrouteplannerwaypointaddress: '',
            kreportgooglemapsrouteplannerwayptgcby: 'address',
            kreportgooglemapscircledesigner: false,
            kreportgooglemapscircledesignermodule: '',
            kreportgooglemapscircledesignerdisplayfields: 'id|name|billing_address_street, billing_address_postalcode, billing_address_city'
        };
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return index
     */
    private trackByFn(index, item) {
        return item.fieldid;
    }
}
