/**
 * @module ModuleSpiceMap
 */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    IterableDiffers,
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
import {mapOptionsI, RecordI, DirectionResultI, RoutePointI} from "../interfaces/spicemap.interfaces";

/** @ignore */
declare var google: any;
/** @ignore */
declare let MarkerClusterer: any;

/**
 * This renders a google map and display the given records on the map as markers and it also renders a circle on the map
 * if the center is defined, then it emits the radius on change which can be useful for filtering purpose.
 * In addition it provides a direction service to measure distance and calculate duration between the given center and a selected marker
 * The map uses a provided cluster library to group markers on a certain narrow distance between markers for better preview.
 * Including a spice module popover which pops up on marker click.
 */
@Component({
    selector: 'spice-google-maps',
    templateUrl: './src/include/spicemap/templates/spicegooglemaps.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SpiceGoogleMaps implements OnChanges, AfterViewInit, OnDestroy {
    /**
     * map options
     */
    @Input() protected options: mapOptionsI;
    /**
     * List of records to be displayed on the map as markers
     */
    @Input() protected records: RecordI[] = [];
    /**
     * routes array to be rendered on the map by the direction service
     */
    @Input() protected routes: [RoutePointI[]?] = [];
    /**
     * emit the radius of the search circle
     */
    @Output() protected radiusChange = new EventEmitter<number>();
    /**
     * emit the result of the direction service on click event
     */
    @Output() protected directionChange = new EventEmitter<DirectionResultI>();
    /**
     * view container reference of the div element where the map should be rendered
     */
    @ViewChild('mapContainer', {read: ViewContainerRef, static: false}) private mapContainer: ViewContainerRef;
    /**
     * google.maps.Map instance of the rendered map
     */
    private map: any;
    /**
     * google.maps.Circle instance of the circle drawn on the map
     */
    private circle: any;
    /**
     * popover component reference
     */
    private popoverComponentRef = null;
    /**
     * google.maps.LatLngBounds instance to fit the map zoom and position to markers or the defined center
     */
    private mapBounds: any;
    /**
     * google.maps.Marker[] all rendered markers on the map
     */
    private markers: any[] = [];
    /**
     * google.maps.Marker the rendered marker for my location
     */
    private myLocationMarker: any;
    /**
     * MarkerClusterer instance to group markers on a narrow distance between markers
     */
    private markerCluster: any;
    /**
     * event listener for the center control rendered on the map
     */
    private centerControlListener: any;
    /**
     * google.maps.DirectionsService instance to calculate distance and duration between markers
     */
    private directionsService: any;
    /**
     * google.maps.DirectionsRenderer[] array instance to render the routes on the map
     */
    private directionsRenderers: any[] = [];

    constructor(
        private language: language,
        private model: model,
        private libLoader: libloader,
        private footer: footer,
        private metadata: metadata,
        private renderer: Renderer2,
        private iterableDiffers: IterableDiffers,
        private zone: NgZone,
        private toast: toast,
    ) {
    }

    /**
     * define the map markers on records change
     * handle the options change
     */
    public ngOnChanges(changes: SimpleChanges) {
        if (!!changes.records) {
            this.setMarkers();
        }
        if (!!changes.routes) {
            this.renderRoutes();
        }
        if (!!changes.options) {
            this.handleOptionsChange();
        }
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
    }

    /**
     * handle the option changes to adjust the map view and clear the disabled elements from the map
     */
    private handleOptionsChange() {
        if (!this.options.center) {
            this.removeCircle();
        } else {
            this.clearRoutes();
            this.createCircle();
        }

        if (!this.options.showCluster) {
            this.removeMarkerClusterMarkers();
        } else {
            this.setMarkerCluster();
        }

        if (!this.options.showMyLocation) {
            this.clearMyLocationMarker();
        } else {
            this.setCurrentLocationMarker();
        }
    }

    /**
     * initialize the direction service if needed
     * define start, destination and waypoints for each route
     * call renderRoute on each passed route
     */
    private renderRoutes() {

        this.removeCircle();

        if (!(window as any).google || this.routes.length == 0) return;

        if (!this.directionsService) {
            this.directionsService = new google.maps.DirectionsService();
        }

        this.clearRoutes();

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
    private renderRoute(start, destination, waypoints) {
        this.directionsService.route(
            {
                origin: start,
                destination: destination,
                waypoints: waypoints,
                travelMode: this.options.directionTravelMode || 'DRIVING'
            },
            (response, status) => {
                if (status === 'OK') {
                    const directionsRenderer = new google.maps.DirectionsRenderer();
                    directionsRenderer.setMap(this.map);
                    directionsRenderer.setDirections(response);
                    this.directionsRenderers.push(directionsRenderer);

                    const directionData: DirectionResultI = this.calculateDirectionData(response.routes);
                    this.directionChange.emit(directionData);
                } else {
                    // Directions request failed due to
                    this.toast.sendToast(`${this.language.getLabel('MSG_DIRECTION_REQUEST_FAILED')} ${status}`, 'error');
                    this.directionChange.emit(null);
                }
            });

    }

    /**
     * clear the direction routes from the map
     */
    private clearRoutes() {
        if (this.directionsRenderers.length == 0) return;
        this.directionsRenderers.forEach(renderer => renderer.setMap(null));
        this.directionsRenderers = [];
    }

    /**
     * remove re-center controll listener
     */
    private removeReCenterControlListener() {
        if (!!this.centerControlListener) {
            this.centerControlListener();
        }
    }

    /**
     * load google maps library and call renderMap method
     * load cluster library and set the marker clusterer if the direction service is inactive
     */
    private loadNecessaryLibraries() {
        this.libLoader.loadLib('maps.googleapis').subscribe(() => {
            this.renderMap();
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
    private renderMap() {
        this.zone.runOutsideAngular(() => {
            this.map = new google.maps.Map(this.mapContainer.element.nativeElement, {streetViewControl: false});

            google.maps.event.addListener(this.map, 'click', () => this.closePopover());

            if (!!this.options.center) {
                this.map.setZoom(11);
                this.map.setCenter(this.options.center);

                if (!!this.routes) {
                    this.directionsService = new google.maps.DirectionsService();
                }

                if (this.options.showMyLocation) {
                    this.setCurrentLocationMarker();
                }

                this.createCircle();
            }

            this.mapBounds = new google.maps.LatLngBounds();

            this.defineReCenterControl();
            this.setMarkers();
        });
    }

    /**
     * set current location marker
     */
    private setCurrentLocationMarker() {

        this.clearMyLocationMarker();

        if (!!(window as any ).google && !!navigator.geolocation) {
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

    private clearMyLocationMarker() {
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
    private defineReCenterControl() {
        const controlDiv = document.createElement('div');
        controlDiv.title = this.language.getLabel('LBL_RE_CENTER');
        controlDiv.classList.add('spice-google-maps-control-recenter');
        const controlImg = document.createElement('div');
        controlImg.classList.add('spice-google-maps-control-recenter-icon');
        controlDiv.appendChild(controlImg);
        this.centerControlListener = this.renderer.listen(controlDiv, 'click', () => {
            if (!this.options.center) {
                this.map.fitBounds(this.mapBounds);
            } else {
                this.map.setCenter(this.options.center);
            }
        });
        this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
    }

    /**
     * initialize MarkerClusterer and add markers to it
     */
    private setMarkerCluster() {
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
    private removeMarkerClusterMarkers() {
        if (!this.markerCluster) return;
        this.markerCluster.removeMarkers(this.markers);
    }

    /**
     * clear the circle from the map if it is already defined
     * create google maps circle with the given options
     * add radius change listener to reset the circle radius and emit it
     * add center change listener to prevent prevent changing the center by recreating the circle if the center changes
     */
    private createCircle() {
        if (!!this.circle) {
            this.removeCircle();
        }
        if (!(window as any).google) return;

        this.circle = new google.maps.Circle({
            strokeColor: '#CA1B21',
            fillOpacity: 0,
            strokeWeight: 2,
            clickable: false,
            editable: true,
            zIndex: 1,
            map: this.map,
            center: this.options.center,
            radius: (this.options.defaultRadius || 5) * 1000
        });

        this.circle.addListener('radius_changed', () => {
            this.options.radius = Math.round(this.circle.getRadius() / 100) / 10;
            this.radiusChange.emit(this.options.radius);
        });

        this.circle.addListener('center_changed', () => {
            if (this.circle.getCenter().toString() !== this.options.center.toString()) {
                this.createCircle();
            }
        });
    }

    /**
     * removes the drawn circle from the map
     */
    private removeCircle() {
        if (!this.circle) return;

        this.circle.setMap(null);
        google.maps.event.clearInstanceListeners(this.circle);
        this.circle = undefined;
    }

    /**
     * clear the direction rendered on the map
     * remove marker cluster markers
     * remove markers from the map
     */
    private clearMarkers() {

        this.clearRoutes();
        this.removeMarkerClusterMarkers();
        this.markers.forEach(marker => {
            marker.setMap(null);
            google.maps.event.clearInstanceListeners(marker);
        });
        this.markers = [];
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
    private setMarkers() {
        if (!this.map) return;

        this.zone.runOutsideAngular(() => {

            this.clearMarkers();

            this.records.forEach(item => {
                if (!(!!item.lat) || !(!!item.lng)) return;

                const markerData: any = {
                    map: this.map,
                    title: !!item.title ? item.title : '',
                    animation: google.maps.Animation.DROP,
                    position: {lat: +item.lat, lng: +item.lng}
                };

                if (!!item.color) {
                    markerData.icon = {
                        path: `M7.8,1.3L7.8,1.3C6-0.4,3.1-0.4,1.3,1.3c-1.8,1.7-1.8,4.6-0.1,6.3c0,0,0,0,0.1,0.1l3.2,3.2l3.2-3.2C9.6,6,9.6,3.2,7.8,1.3`,
                        strokeColor: '#fff',
                        fillOpacity: 1,
                        scale: 2,
                        anchor: {x: 4.5, y: 5},
                        fillColor: '#' + item.color
                    };
                }
                const marker = new google.maps.Marker(markerData);
                this.mapBounds.extend(marker.position);

                marker.addListener('click', (e) => {
                    if (this.options.markerWithModelPopover) {
                        this.zone.run(() => this.renderPopover(item.id, item.module, e));
                    }
                });

                this.markers.push(marker);
            });

            if (this.options.showCluster) {
                this.setMarkerCluster();
            }
            if (!this.options.center) {
                this.map.fitBounds(this.mapBounds);
            }
        });
    }

    /**
     * calculate Direction object from direction result
     * @param routes: DirectionResult
     */
    private calculateDirectionData(routes): DirectionResultI {
        let distance = 0;
        let duration = 0;
        routes.forEach(route => {
            route.legs.forEach(leg => {
                distance += leg.distance.value;
                duration += leg.duration.value;
            });
        });
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
    private closePopover() {
        if (!!this.popoverComponentRef) {
            this.zone.run(() => this.popoverComponentRef.instance.closePopover(true));
        }
    }

    /**
     * close any opened popover
     * render ObjectModelPopover and pass the necessary data
     * set local popover component reference
     */
    private renderPopover(id: string, module: string, markerClickEvent) {
        this.zone.run(() => {
            this.closePopover();
            this.metadata.addComponent('ObjectModelPopover', this.footer.footercontainer).subscribe(
                popover => {
                    popover.instance.popoverid = id;
                    popover.instance.popovermodule = module;
                    popover.instance.parentElementRef = {nativeElement: markerClickEvent.tb.target};
                    popover.changeDetectorRef.detectChanges();
                    this.popoverComponentRef = popover;
                }
            );
        });
    }
}
