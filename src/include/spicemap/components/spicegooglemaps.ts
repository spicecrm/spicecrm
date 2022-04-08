/**
 * @module ModuleSpiceMap
 */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    EventEmitter, Injector,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    Output,
    Renderer2,
    SimpleChanges,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {libloader} from '../../../services/libloader.service';
import {metadata} from "../../../services/metadata.service";
import {footer} from "../../../services/footer.service";
import {toast} from "../../../services/toast.service";
import {DirectionResultI, MapCenterI, MapCircleI, MapOptionsI, RecordI, RoutePointI} from "../interfaces/spicemap.interfaces";

/** @ignore */
declare var _: any;
/** @ignore */
declare var google: any;
/** @ignore */
declare var MarkerClusterer: any;

/**
 * This renders a google map and display the given records on the map as markers and it also renders a circle on the map
 * if the center is defined, then it emits the radius on change which can be useful for filtering purpose.
 * In addition it provides a direction service to measure distance and calculate duration between the given center and a selected marker
 * The map uses a provided cluster library to group markers on a certain narrow distance between markers for better preview.
 * Including a spice module popover which pops up on marker click.
 */
@Component({
    selector: 'spice-google-maps',
    templateUrl: '../templates/spicegooglemaps.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SpiceGoogleMaps implements OnChanges, AfterViewInit, OnDestroy {
    /**
     * map options
     */
    @Input() public options: MapOptionsI;
    /**
     * List of records to be displayed on the map as markers
     */
    @Input() public records: RecordI[] = [];
    /**
     * used for the focused marker to be highlighted on the map
     */
    @Input() public focusedRecordId: string;
    /**
     * routes array to be rendered on the map by the direction service
     */
    @Input() public routes: [RoutePointI[]?] = [];
    /**
     * emit the radius of the search circle
     */
    @Output() public radiusChange = new EventEmitter<number>();
    /**
     * emit the radius of the search circle
     */
    @Output() public centerChange = new EventEmitter<MapCenterI>();
    /**
     * emit the result of the direction service on click event
     */
    @Output() public directionChange = new EventEmitter<DirectionResultI>();
    /**
     * emit when the map is fully loaded and ready for zooming or panning
     */
    @Output() public mapIdleChange = new EventEmitter<boolean>();
    /**
     * google.maps.Circle instance of the circle drawn on the map
     */
    public fixedCircle: any;
    /**
     * view container reference of the div element where the map should be rendered
     */
    @ViewChild('mapContainer', {read: ViewContainerRef, static: false}) public mapContainer: ViewContainerRef;
    /**
     * google.maps.Map instance of the rendered map
     */
    public map: any;
    /**
     * google.maps.Circle instance of the circle drawn on the map
     */
    public circle: any;
    /**
     * popover component reference
     */
    public popoverComponentRef = null;
    /**
     * google.maps.LatLngBounds instance to fit the map zoom and position to markers or the defined center
     */
    public mapBounds: any;
    /**
     * google.maps.Marker[] all rendered markers on the map
     */
    public markers: any[] = [];
    /**
     * google.maps.Marker the rendered marker for my location
     */
    public myLocationMarker: any;
    /**
     * MarkerClusterer instance to group markers on a narrow distance between markers
     */
    public markerCluster: any;
    /**
     * event listener for the center control rendered on the map
     */
    public centerControlListener: any;
    /**
     * google.maps.DirectionsService instance to calculate distance and duration between markers
     */
    public directionsService: any;
    /**
     * google.maps.DirectionsRenderer[] array instance to render the routes on the map
     */
    public directionsRenderers: any[] = [];
    /**
     * google.maps.Marker to save the focused marker to be removed on changes
     */
    public focusedMarker: any;
    /**
     * to ensure that the map is ready to handle panning and drawing actions
     */
    public isMapIdled: boolean = false;

    constructor(
        public language: language,
        public model: model,
        public libLoader: libloader,
        public footer: footer,
        public metadata: metadata,
        public renderer: Renderer2,
        public zone: NgZone,
        public injector: Injector,
        public toast: toast
    ) {
    }

    /**
     * define the map markers on records change
     * handle the options change
     */
    public ngOnChanges(changes: SimpleChanges) {

        if (!this.isMapIdled) return;

        this.zone.runOutsideAngular(() => {

            if (!!changes.records) {
                this.setMarkers();
            }
            if (!!changes.focusedRecordId) {
                this.setFocusedMarker();
            }
            if (!!changes.routes) {
                this.renderRoutes();
            }
            if (!!changes.options) {
                this.handleOptionsChange();
            }
        });
    }

    /**
     * load the necessary google libraries
     */
    public ngAfterViewInit() {
        this.loadNecessaryLibraries();
    }

    /**
     * remove all event listeners from all google maps instances
     */
    public ngOnDestroy(): void {
        google.maps.event.clearInstanceListeners(this.map);
        this.clearMarkers();
        this.clearMyLocationMarker();
        this.removeReCenterControlListener();
        this.removeCircle();
        this.removeFixedCircle();
        this.closePopover();
        this.clearFocusedMarker();
    }

    /**
     * convert distance to string with the unit on measure
     * @param distance
     */
    public convertDistanceToString(distance: number) {

        if (this.options.unitSystem == 'IMPERIAL') {
            const feetDistance = distance * 3.2808;
            if (feetDistance > 5280) {
                const roundedMileDistance = Math.pow(+(feetDistance / 5280).toFixed(1), 1);
                return roundedMileDistance + ' mile';
            }
            return Math.round(feetDistance) + ' ft';
        } else if (distance > 1000) {
            const roundedKilometerDistance = Math.pow(+(distance / 1000).toFixed(1), 1);
            return roundedKilometerDistance + ' km';
        }

        return distance + ' m';
    }

    /**
     * generate marker color
     * @param color
     */
    public generateMarkerColor(color: string) {
        return {
            path: `M 0,0 L -43.3,-75 A 50 50 1 1 1 43.30,-75 L 0,0 z`,
            strokeColor: '#fff',
            strokeWeight: 1,
            fillOpacity: 1,
            scale: .25,
            anchor: {x: 4.5, y: 5},
            fillColor: color.indexOf('#') == 0 ? color : '#' + color
        };
    }

    /**
     * check if a fixed or a normal circle should be created and set the appropriate property name
     * clear the circle from the map if it is already defined
     * reverse the circle geo code when its center is undefined
     * create google maps circle with the given options
     * set the circle listeners
     */
    public createCircle(isFixed?: boolean) {

        if (!(window as any).google) return;

        const circleKeyName: 'circle' | 'fixedCircle' = !isFixed ? 'circle' : 'fixedCircle';

        if (!!this[circleKeyName]) {
            this.removeCircle(circleKeyName);
        }

        let mapCenter: MapCenterI = this.options[circleKeyName].center;

        if (!mapCenter || !this.verifyLatLng(mapCenter)) {
            mapCenter = {
                lat: this.map.getCenter().lat(),
                lng: this.map.getCenter().lng()
            }
            ;
            this.reverseGeoCode(mapCenter);
            this.options[circleKeyName].center = mapCenter;
        }

        this[circleKeyName] = new google.maps.Circle(
            this.generateCircleOptions(this.options[circleKeyName], isFixed)
        );

        if (!isFixed) {
            this.setCircleListeners();
            this.map.setCenter(mapCenter);
        }
    }

    /**
     * check if the geo object latitude and longitude are correct
     * @param latLng
     */
    public verifyLatLng(latLng: { lat: number, lng: number }) {
        return !!latLng.lng && !isNaN(latLng.lng) && !!latLng.lat && !isNaN(latLng.lat);
    }

    /**
     * generate circle options from input options circle
     * @param optionsCircle
     * @param isFixed
     */
    public generateCircleOptions(optionsCircle: MapCircleI, isFixed?: boolean) {

        let radius = (optionsCircle.radius || 5) * 1000;
        const percentage = optionsCircle.radiusPercentage || 80;

        if (!optionsCircle.radius && !isFixed && !!this.map.getBounds() && percentage && !isNaN(percentage)) {
            radius = this.setRadiusFromMapDimensions(percentage);
        }

        return {
            strokeColor: optionsCircle.color,
            fillOpacity: 0,
            strokeWeight: 2,
            clickable: false,
            editable: optionsCircle.editable,
            draggable: optionsCircle.draggable,
            zIndex: 1,
            map: this.map,
            center: optionsCircle.center,
            radius: radius
        };
    }

    /**
     * set radius from map dimensions
     * @param percentage
     */
    public setRadiusFromMapDimensions(percentage: number) {

        const spherical = google.maps.geometry.spherical,
            cor1 = this.map.getBounds().getNorthEast(),
            cor2 = this.map.getBounds().getSouthWest(),
            cor3 = new google.maps.LatLng(cor2.lat(), cor1.lng()),
            cor4 = new google.maps.LatLng(cor1.lat(), cor2.lng()),
            width = spherical.computeDistanceBetween(cor1, cor4),
            height = spherical.computeDistanceBetween(cor1, cor3),
            length = height < width ? height : width,
            radius = (length / 2) * (percentage / 100);

        this.zone.run(() =>
            this.radiusChange.emit(Math.round(radius / 100) / 10)
        );
        return radius;
    }

    /**
     * set the focused marker color and recenter the map
     */
    public setFocusedMarker() {

        this.clearFocusedMarker();

        this.markers.some(marker => {
            if (marker.id == this.focusedRecordId) {
                const hexColor = this.options.focusColor || '#1A73E8';
                marker.setIcon(
                    this.generateMarkerColor(hexColor)
                );

                // remove the marker from the clusterer
                if (!!this.markerCluster) {
                    this.markerCluster.removeMarker(marker);
                    marker.setMap(this.map);
                }

                this.mapBounds = new google.maps.LatLngBounds();
                this.mapBounds.extend(marker.position);

                this.fitMapBounds();

                this.focusedMarker = marker;
                return true;
            }
        });
    }

    /**
     * clear focused marker from map if there is no focus or reset the icon if the focus changed
     */
    public clearFocusedMarker() {

        if (!this.focusedMarker) return;

        if (!!this.markerCluster) {
            this.markerCluster.removeMarker(this.focusedMarker);
            this.markerCluster.addMarker(this.focusedMarker);
        }
        this.focusedMarker.setIcon(
            !!this.focusedMarker.defaultColor ? this.generateMarkerColor(this.focusedMarker.defaultColor) : null
        );


        this.focusedMarker = undefined;
    }

    /**
     * handle the option changes to adjust the map view and clear the disabled elements from the map
     */
    public handleOptionsChange() {

        if (!this.options.fixedCircle) {
            this.removeFixedCircle();
        } else if (!!this.options.changed.fixedCircle) {
            this.clearRoutes();
            this.createFixedCircle();
        }

        if (!this.options.circle) {
            this.removeCircle();
        } else if (!!this.options.changed.circle) {
            this.clearRoutes();
            this.createCircle();
        } else if (!!this.options.changed.circleRadius) {

            this.circle.setRadius(this.options.circle.radius * 1000);

        } else if (!!this.options.changed.circleCenter) {

            this.circle.setCenter(this.options.circle.center);

        } else if (!!this.options.changed.circleEditable) {

            this.circle.setEditable(this.options.circle.editable);
            this.circle.setDraggable(this.options.circle.draggable);
        }

        if (!this.options.showCluster) {
            this.removeMarkerClusterMarkers();
        } else if (!!this.options.changed.showCluster) {
            this.setMarkerCluster();
        }

        if (!this.options.showMyLocation) {
            this.clearMyLocationMarker();
        } else if (!!this.options.changed.showMyLocation) {
            this.setCurrentLocationMarker();
        }
    }

    /**
     * initialize the direction service if needed
     * define start, destination and waypoints for each route
     * call renderRoute on each passed route
     */
    public renderRoutes() {

        this.removeCircle();
        this.removeFixedCircle();

        if (!(window as any).google || this.routes.length == 0) {
            return this.clearRoutes();
        }

        if (!this.directionsService) {
            this.directionsService = new google.maps.DirectionsService();
        }


        this.routes.forEach(route => {
            if (route.length < 2) return;

            const start = route.splice(0, 1)[0];
            const destination = route.splice(route.length - 1, 1)[0];

            this.renderRoute(start, destination, route);
        });
    }

    /**
     * set direction on the map from the center to the target
     * create a direction renderer instance and render the route on the map
     * calculate the direction data and emit it
     */
    public renderRoute(start, destination, waypoints) {
        this.directionsService.route(
            {
                origin: start,
                destination: destination,
                waypoints: waypoints,
                travelMode: this.options.directionTravelMode || 'DRIVING',
                unitSystem: google.maps.UnitSystem[(this.options.unitSystem || 'METRIC')]
            },
            (response, status) => {
                if (status === 'OK') {
                    const directionsRenderer = new google.maps.DirectionsRenderer();
                    directionsRenderer.setMap(this.map);
                    directionsRenderer.setDirections(response);
                    this.directionsRenderers.push(directionsRenderer);
                    this.clearMarkers();

                    const directionData: DirectionResultI = this.calculateDirectionData(response.routes);
                    this.zone.run(() =>
                        this.directionChange.emit(directionData)
                    );
                } else {
                    // Directions request failed due to
                    this.toast.sendToast(`${this.language.getLabel('MSG_DIRECTION_REQUEST_FAILED')} ${status}`, 'error');
                    this.zone.run(() =>
                        this.directionChange.emit(null)
                    );
                }
            });

    }

    /**
     * clear the direction routes from the map
     */
    public clearRoutes() {
        if (this.directionsRenderers.length == 0) return;
        this.directionsRenderers.forEach(renderer => renderer.setMap(null));
        this.directionsRenderers = [];
    }

    /**
     * remove re-center controll listener
     */
    public removeReCenterControlListener() {
        if (!!this.centerControlListener) {
            this.centerControlListener();
            this.centerControlListener = null;
        }
    }

    /**
     * load google maps library and call renderMap method
     * load cluster library and set the marker clusterer if the direction service is inactive
     */
    public loadNecessaryLibraries() {
        this.libLoader.loadLib('maps.googleapis').subscribe(() => {
            this.zone.runOutsideAngular(() => this.renderMap());
            this.libLoader.loadLib('MarkerClustererPlus')
                .subscribe(() => this.setMarkerCluster());
        });
    }

    /**
     * initialize and render google map
     * add click event listener to close any open popover
     * set the map zoom if center is set
     * set the map center if center is set
     * initialize the direction service if direction is active
     * create circle if center is set
     * define re-center action and render it on the map
     * set map markers from records
     */
    public renderMap() {

        this.map = new google.maps.Map(
            this.mapContainer.element.nativeElement,
            {
                center: {lat: 48.168588, lng: 16.346818},
                zoom: 11,
                streetViewControl: false,
                fullscreenControl: false
            }
        );

        this.mapBounds = new google.maps.LatLngBounds();

        google.maps.event.addListener(this.map, 'click', () => this.closePopover());

        google.maps.event.addListenerOnce(this.map, 'idle', () => {

            this.isMapIdled = true;

            if (this.options.showMyLocation) {
                this.setCurrentLocationMarker();
            }

            if (!!this.options.fixedCircle) {

                if (this.options.fixedCircle.center) {
                    this.map.setCenter(this.options.fixedCircle.center);
                }
                this.createFixedCircle();
            }

            if (!!this.options.circle) {

                if (this.options.circle.center) {
                    this.map.setCenter(this.options.circle.center);
                }
                this.createCircle();

            }

            this.setMarkers();
        });

        this.defineReCenterControl();

        if (!!this.routes && this.routes.length > 0) {
            this.directionsService = new google.maps.DirectionsService();
        }
    }

    /**
     * set current location marker
     */
    public setCurrentLocationMarker() {

        this.clearMyLocationMarker();

        if (!!(window as any).google && !!navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {

                const markerData: any = {
                    map: this.map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        strokeColor: '#fff',
                        strokeWeight: 2,
                        fillOpacity: 1,
                        fillColor: '#CA1B21'
                    },
                    position: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                };
                this.myLocationMarker = new google.maps.Marker(markerData);

            });
        }
    }

    /**
     * clear my location marker from the map
     */
    public clearMyLocationMarker() {
        if (!this.myLocationMarker) return;
        this.myLocationMarker.setMap(null);
        google.maps.event.clearInstanceListeners(this.myLocationMarker);
        this.myLocationMarker = undefined;
    }

    /**
     * define re-center control element
     * add click event listener to the control to either fit the map bounds or reset the map to the center
     * append the re-center control to the map controls
     */
    public defineReCenterControl() {

        const controlDiv = document.createElement('div');
        controlDiv.title = this.language.getLabel('LBL_RE_CENTER');
        controlDiv.classList.add('spice-google-maps-control-recenter');
        const controlImg = document.createElement('div');
        controlImg.classList.add('spice-google-maps-control-recenter-icon');
        controlDiv.appendChild(controlImg);

        this.centerControlListener = this.renderer.listen(controlDiv, 'click', () => {
            if (!this.options.circle) {
                this.fitMapBounds();
            } else {
                this.map.setCenter(this.circle.getCenter());
            }
        });
        this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
    }

    /**
     * fit the map bounds with less zoom if we have only one marker
     */
    public fitMapBounds() {
        this.map.setOptions({maxZoom: 14});

        this.map.fitBounds(this.mapBounds);

        this.map.setOptions({maxZoom: null});
    }

    /**
     * initialize MarkerClusterer and add markers to it
     */
    public setMarkerCluster() {

        if (!(window as any).MarkerClusterer || this.markers.length == 0 || this.routes.length > 0) return;
        this.removeMarkerClusterMarkers();

        if (!this.markerCluster) {
            this.markerCluster = new MarkerClusterer(this.map, this.markers,
                {imagePath: 'vendor/google-maps/MarkerClustererPlus/images/m'});
        } else {
            this.markerCluster.addMarkers(this.markers);
        }
    }

    /**
     * remove the marker cluster markers
     */
    public removeMarkerClusterMarkers() {
        if (!this.markerCluster) return;
        this.markerCluster.clearMarkers();
    }

    /**
     * call create circle with fixed flag
     */
    public createFixedCircle() {
        this.zone.runOutsideAngular(() =>
            this.createCircle(true)
        );
    }

    /**
     * add radius change listener to reset the circle radius and emit it
     * add center change listener to reset the circle center and emit it
     */
    public setCircleListeners() {

        this.circle.addListener('radius_changed', () => {
            this.zone.run(() =>
                this.radiusChange.emit(Math.round(this.circle.getRadius() / 100) / 10)
            );
        });

        this.circle.addListener('center_changed', () => {
            if (this.circle.getCenter().toString() !== this.options.circle.center.toString()) {
                if (!this.options.circle.draggable || !this.options.circle.editable) {
                    this.zone.runOutsideAngular(() =>
                        this.createCircle()
                    );
                } else {
                    this.reverseGeoCode({
                        lat: this.circle.getCenter().lat(),
                        lng: this.circle.getCenter().lng()
                    });
                }
            }

        });
    }

    /**
     * reverse geo code to address
     */
    public reverseGeoCode(latLng: { lat: number, lng: number }) {

        let geoCoder = new google.maps.Geocoder();

        geoCoder.geocode({
            location: latLng
        }, (results, status) => {
            if (status !== 'OK') return;

            this.zone.run(() =>
                this.centerChange.emit({
                    address: results[0].formatted_address,
                    ...latLng
                })
            );
        });
    }

    /**
     * removes the drawn fixed circle from the map
     */
    public removeFixedCircle() {
        this.removeCircle('fixedCircle');
    }

    /**
     * removes the drawn circle from the map
     */
    public removeCircle(circleKeyName: string = 'circle') {

        if (!this[circleKeyName]) return;

        this[circleKeyName].setMap(null);
        google.maps.event.clearInstanceListeners(this[circleKeyName]);
        this[circleKeyName] = undefined;
    }

    /**
     * clear the direction rendered on the map
     * remove marker cluster markers
     * remove markers from the map
     */
    public clearMarkers() {

        this.removeMarkerClusterMarkers();
        this.markers.forEach(marker => {
            marker.setMap(null);
            google.maps.event.clearInstanceListeners(marker);
        });
        this.markers = [];

        if (!this.options.circle) {
            // reset map zoom if we zoomed too close
            this.map.setZoom(11);
        }
    }

    /**
     * clear rendered markers
     * define marker data for each record
     * define a colored marker icon for each record if its color is set
     * create marker for each record
     * push the marker position to map bounds to reposition and re-zoom on all markers later
     * add click event listener for each marker to either set direction if both direction and center are active or open popover if it is active
     * push each marker to markers array
     * set marker cluster if it is active and the direction service is inactive
     * if the center is not set, fit the map bounds to all rendered markers
     */
    public setMarkers() {
        if (!this.map) return;

        this.mapBounds = new google.maps.LatLngBounds();
        this.clearMarkers();

        this.records.forEach(item => {

            if (!this.verifyLatLng(item)) return;

            const markerData: any = {
                id: item.id,
                map: this.map,
                title: !!item.title ? item.title : '',
                animation: google.maps.Animation.DROP,
                position: {lat: +item.lat, lng: +item.lng}
            };

            if (!!item.color) {
                markerData.icon = this.generateMarkerColor(item.color);
            }
            const marker = new google.maps.Marker(markerData);
            marker.defaultColor = item.color;
            this.mapBounds.extend(marker.position);

            if (this.options.markerWithModelPopover) {
                marker.addListener('click', (e) => {
                    this.zone.run(() => this.renderPopover(item.id, item.module, e));
                });
            }

            this.markers.push(marker);
        });

        if (this.options.showCluster) {
            this.setMarkerCluster();
        }

        if (!this.options.circle) {
            this.fitMapBounds();
        }
    }

    /**
     * calculate Direction object from direction result
     * @param routes: DirectionResult
     */
    public calculateDirectionData(routes): DirectionResultI {
        let distance = {value: 0, text: ''};
        let duration = 0;
        routes.forEach(route => {
            route.legs.forEach(leg => {
                distance.value += leg.distance.value;
                duration += leg.duration.value;
            });
        });

        distance.text = this.convertDistanceToString(distance.value);

        return {
            distance, duration: {
                minutes: Math.round(((duration / 3600) - Math.floor(duration / 3600)) * 60),
                hours: Math.floor(duration / 3600)
            }
        };
    }

    /**
     * close the marker popover
     */
    public closePopover() {
        if (!!this.popoverComponentRef) {
            this.zone.run(() =>
                this.popoverComponentRef.instance.closePopover(true)
            );
        }
    }

    /**
     * close any opened popover
     * render ObjectModelPopover and pass the necessary data
     * set local popover component reference
     */
    public renderPopover(id: string, module: string, markerClickEvent) {

        this.closePopover();

        let markerElement;

        _.toArray(markerClickEvent).some(item => {
            if (item instanceof MouseEvent) {
                markerElement = item.target;
                return true;
            }
        });

        if (!markerElement) return;

        const popoverComponent = !this.options.popoverComponent ? 'ObjectModelPopover' : this.options.popoverComponent;

        this.metadata.addComponent(popoverComponent, this.footer.footercontainer, this.injector).subscribe(
            popover => {
                popover.instance.popoverid = id;
                popover.instance.popovermodule = module;
                popover.instance.parentElementRef = {nativeElement: markerElement};
                popover.changeDetectorRef.detectChanges();
                this.popoverComponentRef = popover;
            }
        );
    }
}
