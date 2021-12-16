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
    templateUrl: '../templates/spicemapselector.html'
})
export class SpiceMapSelector implements AfterViewInit {
    /**
     * elementref to the map element so the rendered vor the map can be attached
     */
    @ViewChild('mapelement', {read: ViewContainerRef, static: true}) public mapelement: ViewContainerRef;

    /**
     * the header input element so we can calculate the proper height for the map element that goiogle maps can render in properly
     */
    @ViewChild('headerinput', {read: ViewContainerRef, static: true}) public headerinput: ViewContainerRef;

    /**
     * reference to self as the modal window
     */
    public self: any;

    /**
     * reference to the map object
     */
    public map: any = {};

    /**
     * reference to the circle object drawn on the map
     */
    public circle: any = {};

    /**
     * the current set latitude
     */
    public lat: any;

    /**
     * he current set longitude
     */
    public lng: any;

    /**
     * the internal held radius
     */
    public _radius = 10;

    /**
     * the reverse geocoded address
     */
    public address: string;

    /**
     * the searchterm in the window
     */
    public searchterm: string = '';

    /**
     * the emitter emitting the results
     */
    public geoSearchemitter: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        public zone: NgZone,
        public language: language,
        public metadata: metadata,
        public libloader: libloader
    ) {

    }

    get radius() {
        return this._radius ? this._radius : 10;
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
                if (!this.lat && !this.lng) {
                    navigator.geolocation.getCurrentPosition(position => {
                        this.lat = position.coords.latitude;
                        this.lng = position.coords.longitude;
                        this.renderMap();
                        this.reverseGeoCode();
                    }, () => {
                        this.renderMap();
                    });
                } else {
                    this.renderMap();
                }
            }
        );
    }

    public renderMap() {

        // set the initial center
        let center = {
            lat: this.lat,
            lng: this.lng
        };

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
            if (this.lat != this.circle.getCenter().lat() && this.lng != this.circle.getCenter().lng()) {
                this.lat = this.circle.getCenter().lat();
                this.lng = this.circle.getCenter().lng();
                this.reverseGeoCode();
            }
        });
        google.maps.event.addListener(this.circle, 'radius_changed', () => {
            this._radius = Math.round(this.circle.getRadius() / 100) / 10;
        });

        // reverse geocode teh address
        this.reverseGeoCode();
    }

    /**
     * reverse gecode the current address to get
     */
    public reverseGeoCode() {
        let geoCoder = new google.maps.Geocoder();
        geoCoder.geocode({location: {lat: this.lat, lng: this.lng}}, (results, status) => {
            this.address = results[0].formatted_address;
        });
    }

    /**
     * close the modal window
     */
    public close() {
        this.self.destroy();
    }

    /**
     * set the data
     */
    public set() {
        this.geoSearchemitter.emit({
            radius: this._radius,
            lat: this.lat,
            lng: this.lng,
            address: this.address
        });
        this.close();
    }

    /**
     * clear the search value
     */
    public clear() {
        this.geoSearchemitter.emit(false);
        this.close();
    }

    /**
     * fired from thew google places search input
     *
     * @param details the details on the address
     */
    public setDetails(details) {
        // set the geocodes and address
        this.lat = details.address.latitude;
        this.lng = details.address.longitude;
        this.address = [details.name, details.formatted_address].join(', ');

        // recenter the mep and set the circle
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
