/**
 * @module AddComponentsModule
 */
import {
    Component,
    AfterViewInit,
    ViewChild,
    ViewContainerRef,
    NgZone, EventEmitter
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {libloader} from '../../../services/libloader.service';

/**
 * @ignore
 */
declare var google: any;

@Component({
    selector: 'spice-map-selector',
    templateUrl: './src/include/spicemap/templates/spicemapselector.html'
})
export class SpiceMapSelector implements AfterViewInit {
    @ViewChild('mapelement', {read: ViewContainerRef, static: true}) private mapelement: ViewContainerRef;
    @ViewChild('headerinput', {read: ViewContainerRef, static: true}) private headerinput: ViewContainerRef;

    public self: any;

    private map: any = {};
    private circle: any = {};

    private lat: any;
    private lng: any;
    private _radius = 10;

    private searchterm: string = '';

    private geoSearchemitter: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private zone: NgZone,
        private language: language,
        private metadata: metadata,
        private libloader: libloader
    ) {

    }

    get radius() {
        return this._radius;
    }

    set radius(newradius) {
        this._radius = newradius;
        if (this.circle) {
            this.circle.setRadius(this._radius * 1000);
        }
    }

    public ngAfterViewInit() {
        this.libloader.loadLib('maps.googleapis').subscribe(
            (next) => {
                navigator.geolocation.getCurrentPosition(position => {
                    this.lat = position.coords.latitude;
                    this.lng = position.coords.longitude;
                    this.renderMap();
                }, () => {
                    this.renderMap();
                });
            }
        );
    }

    private renderMap() {
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
            streetViewControl: false,
            zoom: 11,
            minZoom: 8
        });

        this.circle = new google.maps.Circle({
            strokeColor: 'red',
            fillColor: '#dddddd',
            fillOpacity: 0.5,
            strokeWeight: 2,
            clickable: true,
            draggable: true,
            editable: true,
            zIndex: 1,
            map: this.map,
            center: center,
            radius: this._radius * 1000
        });

        google.maps.event.addListener(this.circle, 'center_changed', () => {
            this.lat = this.circle.getCenter().lat();
            this.lng = this.circle.getCenter().lng();
        });
        google.maps.event.addListener(this.circle, 'radius_changed', () => {
            this._radius = Math.round(this.circle.getRadius() / 100) / 10;
        });
    }

    /**
     * close the modal window
     */
    private close() {
        this.self.destroy();
    }

    /**
     * set the data
     */
    private set() {
        this.geoSearchemitter.emit({
            radius: this._radius,
            lat: this.lat,
            lng: this.lng
        });
        this.close();
    }

    /**
     * clear the search value
     */
    private clear() {
        this.geoSearchemitter.emit(false);
        this.close();
    }

    /**
     * fired from teh google places search input
     *
     * @param details the details on the address
     */
    private setDetails(details) {
        this.map.setCenter({lat: details.address.latitude, lng: details.address.longitude});
        this.circle.setCenter({lat: details.address.latitude, lng: details.address.longitude});
    }

    /**
     * caclulate the proper style for the map container
     */
    get mapStyle() {
        let rect = this.headerinput.element.nativeElement.getBoundingClientRect();
        return {
            width: '100%',
            height: 'calc(100% - ' + this.headerinput.element.nativeElement.getBoundingClientRect().height + 'px)'
        };
    }


}
