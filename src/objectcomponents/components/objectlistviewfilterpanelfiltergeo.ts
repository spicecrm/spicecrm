/**
 * @module ObjectComponents
 */

import {
    ComponentFactoryResolver, Component, ViewChild, ViewContainerRef, Input, Output, ElementRef, forwardRef, EventEmitter
} from '@angular/core';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';

declare var _: any;

@Component({
    selector: 'object-listview-filter-panel-filter-geo',
    templateUrl: './src/objectcomponents/templates/objectlistviewfilterpanelfiltergeo.html'
})
export class ObjectListViewFilterPanelFilterGeo {

    /**
     * the geogrpahy
     */
    @Input('geography') private geography: any = {};

    /**
     * the change output
     */
    @Output('geographyChange') private geographyChange: EventEmitter<any> = new EventEmitter<any>();

    constructor(private model: model, private modal: modal, private language: language, private metadata: metadata) {

    }

    /**
     *  a getter to get if the geo search is enabled or not
     */
    get geoEnabled() {
        if (this.model && this.model.module) {
            return this.metadata.getModuleDefs(this.model.module).ftsgeo;
        } else {
            return false;
        }
    }

    /**
     * a function that handöles the click registered by the renderer
     */
    private onClick() {
        this.modal.openModal('SpiceMapSelector').subscribe(mapModal => {

            if (this.hasGeogrpahy) {
                mapModal.instance.lat = this.geography.lat;
                mapModal.instance.lng = this.geography.lng;
                mapModal.instance._radius = this.geography.radius;
                mapModal.instance.address = this.geography.address;
            }

            mapModal.instance.geoSearchemitter.subscribe(geodata => {
                if (!geodata) {
                    this.geography = {};
                } else {
                    this.geography.radius = geodata.radius;
                    this.geography.lat = geodata.lat;
                    this.geography.lng = geodata.lng;
                    this.geography.address = geodata.address;
                }
                this.geographyChange.emit(this.geography);
            });
        });
    }

    get hasGeogrpahy() {
        return !_.isEmpty(this.geography);
    }

    get geodata() {
        return this.hasGeogrpahy ? this.geography.radius + 'km around ' + this.geography.address : 'no geodata set';
    }
}
