/**
 * @module ModuleSpiceMap
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    IterableDiffers,
    NgZone,
    OnInit
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {metadata} from "../../../services/metadata.service";
import {modellist} from "../../../services/modellist.service";
import {SpiceGoogleMapsList} from "./spicegooglemapslist";
import {DirectionResultI, MapOptionsI, RoutePointI} from "../interfaces/spicemap.interfaces";
import {backend} from "../../../services/backend.service";
import {session} from "../../../services/session.service";
import {userpreferences} from "../../../services/userpreferences.service";
import {broadcast} from "../../../services/broadcast.service";

/** @ignore */
declare let _;

/**
 * render a google map with model list service which enables searching around and use the navigation service
 */
@Component({
    selector: 'spice-google-maps-record',
    templateUrl: './src/include/spicemap/templates/spicegooglemapsrecord.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [modellist]
})
export class SpiceGoogleMapsRecord extends SpiceGoogleMapsList implements OnInit {

    /**
     * routes array to be rendered on the map by the direction service
     */
    @Input() protected routes: [RoutePointI[]?] = [];
    /**
     * map options will be passed to the spice google maps
     */
    protected mapOptions: MapOptionsI = {};
    /**
     * save the google places search term
     */
    private directionResult: DirectionResultI;
    /**
     * save timeout of the search term
     */
    private searchTimeout: number;
    /**
     * save timeout of the search term
     */
    private isLoadingDirection: boolean = false;
    /**
     * save full screen on/off
     */
    private isFullScreenOn: boolean = false;

    constructor(
        public language: language,
        public modelList: modellist,
        public metadata: metadata,
        public backend: backend,
        public iterableDiffers: IterableDiffers,
        public cdr: ChangeDetectorRef,
        public zone: NgZone,
        public session: session,
        public model: model,
        public elementRef: ElementRef,
        public broadcast: broadcast,
        private userpreferences: userpreferences
    ) {
        super(language, modelList, metadata, iterableDiffers, cdr, model);
    }

    /**
     * used to display the suitable tools for the selected map use
     */
    private _useMapFor: 'search' | 'direction' = 'search';

    /**
     * returns the search term
     */
    get useMapFor() {
        return this._useMapFor;
    }

    /**
     * reset the map options for the map use purpose from the component config
     * reset the direction start type
     * reset the map records
     *
     * @param value
     */
    set useMapFor(value) {

        if (this.isLoadingDirection) return;

        this._useMapFor = value;
        this.directionStartType = undefined;
        if (value == 'search') {
            this.setFirstMapOptionsChanged();
            this.directionResult = undefined;
            this.setCenterFromModel();
            this.setRecords();
        } else {
            this.records = [{
                id: this.model.id,
                module: this.modelList.module,
                title: '' + this.model.data.summary_text,
                lng: +this.model.data[this.lngName],
                lat: +this.model.data[this.latName],
                color: this.componentconfig.focusColor
            }];
            this.setMapOptionsForDirectionUse();
        }
    }

    /**
     * save the search term
     */
    private _listSearchTerm: string = '';

    /**
     * returns the search term
     */
    get listSearchTerm(): string {
        return this._listSearchTerm;
    }

    /**
     * sets the search term on timeout if it is changed
     * @param value
     */
    set listSearchTerm(value: string) {
        window.clearTimeout(this.searchTimeout);

        if (value !== this._listSearchTerm) {
            this._listSearchTerm = value;
            this.zone.runOutsideAngular(() => {
                this.searchTimeout = window.setTimeout(() => this.triggerSearch(), 1000);
            });
        } else {
            this._listSearchTerm = value;
        }
    }

    /**
     * used to display the suitable input for the selected direction start option
     */
    private _directionStartType: 'myLocation' | 'office' | 'address';

    /**
     * returns the direction start type
     */
    get directionStartType() {
        return this._directionStartType;
    }

    /**
     * sets the direction start type
     * clears the google search term
     * define the route to the google maps route to start drawing the route
     * @param value
     */
    set directionStartType(value) {
        this._directionStartType = value;

        switch (value) {
            case 'myLocation':
                this.defineMapRouteFromMyLocation();
                break;
            case 'office':
                this.defineMapRouteFromUserAddress();
        }
    }

    /**
     * @return  listAggregates
     */
    get listAggregates(): any[] {
        return _.toArray(this.modelList.searchAggregates).filter(aggregate => aggregate !== 'tags');
    }

    /**
     * set the component name to load the component configuration for it
     * initialize the model list
     * call the parents initialize
     * set the map component height
     * set the distance unit system from preferences
     * set the mapOption.center from the record
     */
    public ngOnInit() {
        this.initializeModelList();
        this.setComponentName();
        super.ngOnInit();
        this.setDistanceUnitSystemFromPreferences();
        this.setCenterFromModel();
    }

    /**
     * subscribe to user preferences save and update the distance text
     * set the distance unit system from user preferences for the direction service result
     */
    protected setDistanceUnitSystemFromPreferences() {
        this.subscription = this.broadcast.message$.subscribe(msg => {
            if (msg.messagetype == 'userpreferences.save') {
                this.componentconfig.unitSystem = this.userpreferences.toUse.distance_unit_system || 'METRIC';
                this.setMapOptionsForDirectionUse();
                if (!!this.directionResult) {
                    this.directionResult.distance.text = this.convertDistanceToString(this.directionResult.distance.value);
                    this.cdRef.detectChanges();
                }
            }
        });
        this.componentconfig.unitSystem = this.userpreferences.toUse.distance_unit_system || 'METRIC';
    }

    /**
     * check if the route entries are correct
     * @param routePoint
     */
    protected verifyPlaceLatLng(routePoint: RoutePointI) {
        return (!!routePoint.placeId) || (!!routePoint.lng && !isNaN(routePoint.lng) && !!routePoint.lat && !isNaN(routePoint.lat));
    }

    /**
     * convert distance to string with the unit on measure
     * @param distance
     */
    protected convertDistanceToString(distance) {

        if (this.componentconfig.unitSystem == 'IMPERIAL') {
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
     * set the module for the module list service and activate cache
     */
    private initializeModelList() {
        this.modelList._listcomponent = 'SpiceGoogleMapsRecord';
        this.modelList.module = this.model.module;
        this.modelList.usecache = true;
    }

    /**
     * set componentName to load component config by the parent
     */
    private setComponentName() {
        this.componentName = 'SpiceGoogleMapsRecord';
    }

    private setMapOptionsForDirectionUse() {
        this.mapOptions = {
            showCluster: false,
            markerWithModelPopover: false,
            circle: undefined,
            directionTravelMode: this.componentconfig.directionTravelMode,
            unitSystem: this.componentconfig.unitSystem,
            changed: {
                showCluster: true,
                markerWithModelPopover: true,
                circle: true,
                directionTravelMode: true,
                unitSystem: true,
            }
        };
    }

    /**
     * set circle center from record geo data
     */
    private setCenterFromModel() {
        this.mapOptions.circle = {
            center: {
                lng: +this.model.getField(this.lngName),
                lat: +this.model.getField(this.latName)
            },
            radius: this.componentconfig.defaultRadius
        };
        if (!this.verifyPlaceLatLng(this.mapOptions.circle.center)) {
            return this.mapOptions.circle = undefined;
        }
        this.onRadiusChange(this.componentconfig.defaultRadius);

    }

    /**
     * define route and verify it
     * set the mapOptions routes to trigger the map route rendering
     * @param directionStart
     */
    private setMapRoute(directionStart: RoutePointI) {

        const route: RoutePointI[] = this.buildRoute(directionStart);

        if (!this.verifyPlaceLatLng(route[0]) || !this.verifyPlaceLatLng(route[1])) {
            return this.isLoadingDirection = false;
        }

        this.routes = [route];
        this.cdRef.detectChanges();
    }

    /**
     * define map route from search address
     * @param details the details on the address
     */
    private defineMapRouteFromSearchAddress(details) {
        if (this.directionStartType != 'address') return;

        this.isLoadingDirection = true;
        const directionStart = {
            lat: details.latitude,
            lng: details.longitude
        };
        this.setMapRoute(directionStart);
    }

    /**
     * define map route from user address
     */
    private defineMapRouteFromUserAddress() {

        this.isLoadingDirection = true;

        this.backend.get('Users', this.session.authData.userId, 'details').subscribe((user: any) => {
            if (!user) {
                return this.isLoadingDirection = false;
            }
            const userAddress = `${user.address_street}, ${user.address_postalcode} ${user.address_city}, ${user.address_country}`;

            this.backend.getRequest(`googleapi/places/autocomplete/${userAddress}`)
                .subscribe((res: any) => {
                    if (!!res.predictions && res.predictions.length > 0) {
                        const directionStart: RoutePointI = {placeId: res.predictions[0].place_id};
                        this.setMapRoute(directionStart);
                    } else {
                        this.isLoadingDirection = false;
                    }
                });
        });
    }

    /**
     * define map route from my location
     */
    private defineMapRouteFromMyLocation() {
        if (navigator.geolocation) {
            this.isLoadingDirection = true;
            navigator.geolocation.getCurrentPosition((position) => {
                const directionStart = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                this.setMapRoute(directionStart);
            }, () => this.isLoadingDirection = false);
        }
    }

    /**
     * build route start and destination
     * @param directionStart
     */
    private buildRoute(directionStart: RoutePointI): RoutePointI[] {
        return [
            directionStart,
            {
                lat: +this.model.getField(this.latName),
                lng: +this.model.getField(this.lngName)
            }
        ];
    }

    /**
     * set model list search term and reload list
     */
    private triggerSearch() {
        this.zone.run(() => {
            this.modelList.searchTerm = this.listSearchTerm;
        });
    }

    /**
     * set the direction result
     * @param result
     */
    private setDirectionResult(result: DirectionResultI) {
        this.isLoadingDirection = false;
        this.directionResult = result;
        this.cdRef.detectChanges();
    }

    /**
     * cross browser toggle full screen mode
     */
    private toggleFullScreen(elementRef) {
        this.zone.runOutsideAngular(() => {

            // define the full screen change handler
            document.onfullscreenchange = () => {
                this.isFullScreenOn = !!document.fullscreenElement;
                this.cdRef.detectChanges();
            };

            if (!this.isFullScreenOn) {
                if (elementRef.requestFullscreen) {
                    elementRef.requestFullscreen();
                } else if (elementRef.webkitRequestFullScreen) {
                    elementRef.webkitRequestFullScreen();
                } else if (elementRef.mozRequestFullscreen) {
                    elementRef.mozRequestFullscreen();
                } else if (elementRef.msRequestFullscreen) elementRef.msRequestFullscreen();
            } else {
                const documentRef = (document as any);
                if (documentRef.exitFullscreen) {
                    documentRef.exitFullscreen();
                } else if (documentRef.webkitExitFullscreen) {
                    documentRef.webkitExitFullscreen();
                } else if (documentRef.mozCancelFullScreen) {
                    documentRef.mozCancelFullScreen();
                } else if (documentRef.msExitFullscreen) documentRef.msExitFullscreen();
            }
        });
    }
}
