/**
 * @module ModuleReportsDesigner
 */
import {Component, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {ReportsDesignerService} from '../services/reportsdesigner.service';
import {modal} from "../../../services/modal.service";

@Component({
    selector: 'reports-designer-visualize-item-google-maps',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignervisualizeitemgooglemaps.html'
})
export class ReportsDesignerVisualizeItemGoogleMaps implements OnInit {

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
     * show selectModule modal and assign the value from response
     */
    private searchPeripheryModule() {
        this.modal.openModal('ReportsDesignerSelectModuleModal')
            .subscribe(modalRef => {
                modalRef.instance.response.subscribe(response => {
                    if (response) {
                        this.properties.googlemaps.kreportgooglemapscircledesignermodule = response.module;
                    }
                });
            });
    }

    private clearPeripheryModule() {
        this.properties.googlemaps.kreportgooglemapscircledesignermodule = '';
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
