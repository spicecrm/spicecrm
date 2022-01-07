/**
 * @module AddComponentsModule
 */
import {
    Component,
    AfterViewInit,
    ViewChild,
    ViewContainerRef,
    NgZone
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {backend} from '../../../services/backend.service';
import {libloader} from '../../../services/libloader.service';
import {Router} from '@angular/router';

/**
 * @ignore
 */
declare var google: any;

@Component({
    selector: 'spice-map',
    templateUrl: '../templates/spicemap.html'
})
export class SpiceMap implements AfterViewInit {
    @ViewChild('mapelement', {read: ViewContainerRef, static: true}) public mapelement: ViewContainerRef;

    public componentconfig: any = {};
    public map: any = {};
    public circle: any = {};
    public mousedown: boolean = false;
    public mapBoundaries: any = {};
    public modelMarker: any = {};
    public surroundingFunction: any = {};
    public surroundingMarkers: any[] = [];
    public surroundingObjects: any[] = [];

    public listfields: any[] = [];

    constructor(
        public zone: NgZone,
        public language: language,
        public model: model,
        public modelutilities: modelutilities,
        public backend: backend,
        public router: Router,
        public metadata: metadata,
        public libloader: libloader
        // public libloader: libloader
    ) {

    }

    public getListFields() {
        return this.metadata.getFieldSetFields(this.componentconfig.fieldset);
    }

    public ngAfterViewInit() {
        this.libloader.loadLib('maps.googleapis').subscribe(
            (next) => {
                this.renderMap();
            }
        );
    }

    get latField() {
        return this.componentconfig.key && this.componentconfig.key != '' ? this.componentconfig.key + '_address_latitude' : 'address_latitude';
    }

    get lngField() {
        return this.componentconfig.key && this.componentconfig.key != '' ? this.componentconfig.key + '_address_longitude' : 'address_longitude';
    }

    get lat() {
        return this.model.getField(this.latField);
    }

    get lng() {
        return this.model.getField(this.lngField);
    }

    public renderMap() {
        let center = {lat: 48.2, lng: 16.3};
        if (this.lng && this.lat) {
            center = {
                lat: this.lat,
                lng: this.lng
            };
        }
        // this.map = new google.maps.Map(document.getElementById(this.mapId), {
        this.map = new google.maps.Map(this.mapelement.element.nativeElement, {
            center: center,
            scrollwheel: true,
            zoom: 14,
            minZoom: 8
        });

        // add the element on the map
        if (this.lng && this.lat) {
            this.modelMarker = new google.maps.Marker({
                position: center,
                map: this.map,
                // icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                icon: 'https://maps.google.com/mapfiles/ms/micons/red-dot.png',
                title: this.model.getField('summary_text')
            });
        }

        this.map.addListener('bounds_changed', () => {
            this.mapBoundaries = this.map.getBounds();
            if (this.surroundingFunction) {
                window.clearTimeout(this.surroundingFunction);
            }
            this.surroundingFunction = window.setTimeout(() => this.getSurrounding(), 500);
        });
        /*
        this.circle = new google.maps.Circle({
            strokeColor: 'red',
            fillColor: '#dddddd',
            fillOpacity: 0.5,
            strokeWeight: 1,
            clickable: true,
            draggable: true,
            editable: true,
            zIndex: 1,
            map: this.map,
            center: center,
            radius: 1000
        });

        google.maps.event.addListener(this.circle, 'mousedown', () => {
            this.mousedown = true;
        });
        google.maps.event.addListener(this.circle, 'mouseup', () => {
            this.mousedown = false;
        });
        google.maps.event.addListener(this.circle, 'center_changed', () => {
            if(!this.mousedown) console.log('center',this.circle.getCenter());
        });
        google.maps.event.addListener(this.circle, 'radius_changed', () => {
            if(!this.mousedown) console.log('radius', this.circle.getRadius());
        });
        */
    }

    public reCenter() {
        this.map.setCenter(this.modelMarker.position);
    }

    public isApiLoaded(): boolean {
        return (window as any).google && (window as any).google.maps;
    }

    public getSurrounding() {

        // clear all curent markers
        for (let marker of this.surroundingMarkers) {
            marker.setMap(null);
        }
        this.surroundingMarkers = [];

        // get boundaries
        let ne = this.mapBoundaries.getNorthEast();
        let sw = this.mapBoundaries.getSouthWest();

        let searchfields = {
            join: 'AND',
            conditions: [
                {
                    field: 'id',
                    operator: '<>',
                    value: this.model.id
                }, {
                    field: this.lngField,
                    operator: '<',
                    value: ne.lng()
                }, {
                    field: this.latField,
                    operator: '<',
                    value: ne.lat()
                }, {
                    field: this.lngField,
                    operator: '>',
                    value: sw.lng()
                }, {
                    field: this.latField,
                    operator: '>',
                    value: sw.lat()
                }
            ]
        };

        let params = {
            searchfields: JSON.stringify(searchfields),
            fields: JSON.stringify(['id', 'name', this.lngField, this.latField])
        };

        this.backend.getRequest('module/' + this.model.module, params).subscribe((response: any) => {
            for (let itemIndex in response.list) {
                for (let fieldName in response.list[itemIndex]) {
                    response.list[itemIndex][fieldName] = this.modelutilities.backend2spice(this.model.module, fieldName, response.list[itemIndex][fieldName]);
                }


                let thisMarker = new google.maps.Marker({
                    position: {
                        lat: response.list[itemIndex][this.latField],
                        lng: response.list[itemIndex][this.lngField]
                    },
                    map: this.map,
                    title: response.list[itemIndex].summary_text,
                    icon: 'http://maps.google.com/mapfiles/ms/micons/green.png',
                    sugarId: response.list[itemIndex].id,
                    sugarModule: this.model.module,
                });

                this.surroundingMarkers.push(thisMarker)
            }

            this.surroundingObjects = response.list;

            // trigger change detection
            this.zone.run(() => {
            });
        });

    }

    public mouseOver(id) {
        this.surroundingMarkers.some(marker => {
            if (marker.sugarId === id) {
                marker.setIcon('http://maps.google.com/mapfiles/ms/micons/yellow-dot.png')
                return true;
            }
        });
    }

    public mouseOut(id) {
        this.surroundingMarkers.some(marker => {
            if (marker.sugarId === id) {
                marker.setIcon('http://maps.google.com/mapfiles/ms/micons/green.png')
                return true;
            }
        });
    }
}
