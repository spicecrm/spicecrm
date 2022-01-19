/**
 * @module ModuleSpiceMap
 */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    IterableDiffers,
    NgZone,
    OnInit,
    Renderer2
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
import {InputRadioOptionI} from "../../../systemcomponents/interfaces/systemcomponents.interfaces";
import {toast} from "../../../services/toast.service";
import {navigation} from "../../../services/navigation.service";

/** @ignore */
declare var _: any;

/**
 * render a google map with model list service which enables searching around and use the navigation service
 */
@Component({
    selector: 'spice-google-maps-record',
    templateUrl: '../templates/spicegooglemapsrecord.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpiceGoogleMapsRecord extends SpiceGoogleMapsList implements OnInit, AfterViewInit {
    /**
     * routes array to be rendered on the map by the direction service
     */
    public routes: [RoutePointI[]?] = [];
    /**
     * map options will be passed to the spice google maps
     */
    public mapOptions: MapOptionsI = {};
    /**
     * to be used for the radio button group inputs
     */
    public useMapForOptions: InputRadioOptionI[] = [
        {
            icon: 'search',
            value: 'search',
        },
        {
            icon: 'travel_and_places',
            value: 'direction'
        }
    ];
    /**
     * to be used for the radio button group inputs
     */
    public directionStartOptions: InputRadioOptionI[] = [
        {
            value: 'myLocation',
            label: 'LBL_MY_LOCATION'
        },
        {
            value: 'office',
            label: 'LBL_OFFICE'
        },
        {
            value: 'address',
            label: 'LBL_ADDRESS'
        }
    ];
    /**
     * if true ignore the map height from component config to adjust the map height to parent height.
     */
    @Input() public autoMapHeight: boolean = false;
    /**
     * save the google places search term
     */
    public directionResult: DirectionResultI;
    /**
     * save the unit system for the distance measuring
     */
    public unitSystem: 'IMPERIAL' | 'METRIC' = 'METRIC';
    /**
     * save timeout of the search term
     */
    public searchTimeout: number;
    /**
     * save timeout of the search term
     */
    public isLoadingDirection: boolean = false;
    /**
     * save full screen on/off
     */
    public isFullScreenOn: boolean = false;
    /**
     * to show/hide option buttons on the map
     */
    public showUseMapOptions: boolean = true;

    constructor(
        public language: language,
        public modelList: modellist,
        public metadata: metadata,
        public backend: backend,
        public iterableDiffers: IterableDiffers,
        public cdRef: ChangeDetectorRef,
        public zone: NgZone,
        public session: session,
        public model: model,
        public elementRef: ElementRef,
        public renderer: Renderer2,
        public broadcast: broadcast,
        public navigation: navigation,
        public toast: toast,
        public userpreferences: userpreferences,
    ) {
        super(language, modelList, metadata, iterableDiffers, cdRef, model, navigation, broadcast);
    }

    /**
     * show/hide use map options and set the default use map for value
     * @param options
     */
    @Input('useMapOptions') set applyUseMapOptions(options: { direction: boolean, search: boolean }) {
        this.showUseMapOptions = options.search && options.direction;
        this._useMapFor = options.search ? 'search' : 'direction';
    }

    /**
     * used to display the suitable tools for the selected map use
     */
    public _useMapFor: 'search' | 'direction' = 'search';

    /**
     * returns the search term
     */
    get useMapFor(): 'search' | 'direction' {
        return this._useMapFor;
    }

    /**
     * reset the map options for the map use purpose from the component config
     * reset the direction start type
     * reset the map records
     *
     * @param value
     */
    set useMapFor(value: 'search' | 'direction') {

        if (this.isLoadingDirection || this.modelList.isLoading) return;

        this._useMapFor = value;

        this.records = [];
        this.directionStartType = undefined;
        this.directionResult = undefined;

        this.adjustMap();
    }

    /**
     * returns the search term
     */
    get mapHeight(): string {
        return (!this.isFullScreenOn && !this.autoMapHeight) ? this.componentconfig.mapHeight + 'px' : this._useMapFor == 'search' ? '50%' : '100%';
    }

    /**
     * save the search term
     */
    public _listSearchTerm: string = '';

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
    public _directionStartType: 'myLocation' | 'office' | 'address';

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
        return this.modelList.moduleAggregates;
    }

    /**
     * set the distance unit system from preferences
     * call parent on init
     */
    public ngOnInit() {
        this.setDistanceUnitSystemFromPreferences();
        super.ngOnInit();
    }

    /**
     * adjust the map by the use purpose
     * reset use map for to render the appropriate items on the map
     */
    public ngAfterViewInit() {
        this.adjustMap();
        super.ngAfterViewInit();
    }

    /**
     * set records from model list results or set the focused record for direction search.
     */
    public setRecords() {
        if (this.useMapFor == 'search') {
            super.setRecords();
        }
    }

    /**
     * subscribe to broadcast message to reset the distance unit system and recenter the map
     */
    public handleBroadcastMessage(msg) {
        switch (msg.messagetype) {
            case 'userpreferences.save':
                this.unitSystem = this.userpreferences.toUse.distance_unit_system || 'METRIC';
                if (!!this.directionResult) {
                    this.directionResult.distance.text = this.convertDistanceToString(this.directionResult.distance.value);
                }
                break;
            case 'model.save':
                if (msg.messagedata.module == this.model.module) {
                    this.adjustMap();
                }
                break;
        }
        super.handleBroadcastMessage(msg);
        this.cdRef.detectChanges();
    }

    /**
     * subscribe to user preferences save and update the distance text
     * set the distance unit system from user preferences for the direction service result
     */
    public setDistanceUnitSystemFromPreferences() {
        this.unitSystem = this.userpreferences.toUse.distance_unit_system || 'METRIC';
    }

    /**
     * convert distance to string with the unit on measure
     * @param distance
     */
    public convertDistanceToString(distance: number): string {

        if (this.unitSystem == 'IMPERIAL') {
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
     * check if the route entries are correct
     * @param routePoint
     */
    public verifyPlaceLatLng(routePoint: RoutePointI): boolean {
        return (!!routePoint.placeId) || this.verifyLatLng((routePoint as any));
    }

    /**
     * adjust the map options and pass it through
     */
    public adjustMap() {
        if (this._useMapFor == 'search') {
            this.setCenterFromModel();
            this.setMapOptionsForSearchUse();
        } else {
            this.setMapOptionsForDirectionUse();
            this.setRecordsFromModel(this.componentconfig.focusColor);
        }
    }

    /**
     * set focused record from model
     */
    public setRecordsFromModel(color?) {
        this.records = [{
            id: this.model.id,
            module: this.model.module,
            title: '' + this.model.getField('summary_text'),
            lng: +this.model.getField(this.lngName),
            lat: +this.model.getField(this.latName),
            color: color
        }];
        this.cdRef.detectChanges();
    }

    /**
     * set the map map options for the search use
     */
    public setMapOptionsForSearchUse() {
        this.mapOptions = {
            showCluster: this.componentconfig.showCluster,
            markerWithModelPopover: this.componentconfig.markerWithModelPopover,
            popoverComponent: this.componentconfig.popoverComponent,
            focusColor: this.componentconfig.focusColor,
            // should be define first by setCenterFromModel
            circle: this.mapOptions.circle,
            changed: {
                showCluster: true,
                markerWithModelPopover: true,
                circle: true
            }
        };
        this.cdRef.detectChanges();
    }

    /**
     * set the map map options for the direction use
     */
    public setMapOptionsForDirectionUse() {
        this.mapOptions = {
            showCluster: false,
            markerWithModelPopover: false,
            circle: undefined,
            directionTravelMode: this.componentconfig.directionTravelMode,
            unitSystem: this.unitSystem,
            changed: {
                showCluster: true,
                markerWithModelPopover: true,
                circle: true,
                directionTravelMode: true,
                unitSystem: true,
            }
        };
        this.cdRef.detectChanges();
    }

    /**
     * reset the map circle
     * set the records from the model data
     * set circle center from record geo data
     */
    public setCenterFromModel() {
        this.mapOptions.circle = {
            center: {
                lng: +this.model.getField(this.lngName),
                lat: +this.model.getField(this.latName)
            },
            radius: undefined,
            radiusPercentage: this.componentconfig.radiusPercentage,
            color: this.componentconfig.circleColor,
            editable: true
        };
        if (!this.verifyLatLng(this.mapOptions.circle.center)) {
            this.mapOptions.circle = undefined;
        }
    }

    /**
     * define route and verify it
     * set the mapOptions routes to trigger the map route rendering
     * @param directionStart
     */
    public setMapRoute(directionStart: RoutePointI) {

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
    public defineMapRouteFromSearchAddress(details) {

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
    public defineMapRouteFromUserAddress() {

        this.isLoadingDirection = true;

        this.backend.get('Users', this.session.authData.userId, 'details').subscribe((user: any) => {
            if (!user || !(!!user.address_street) || !(!!user.address_postalcode) || !(!!user.address_city)) {
                this.toast.sendToast(this.language.getLabel('MSG_NO_OFFICE_ADDRESSE_DEFINED'), 'error');
                this.routes = [];
                this.isLoadingDirection = false;
                return this.cdRef.detectChanges();
            }
            const userAddress = `${user.address_street}, ${user.address_postalcode} ${user.address_city}, ${user.address_country}`;

            this.backend.getRequest(`channels/groupware/gsuite/places/autocomplete/${encodeURIComponent(userAddress)}`)
                .subscribe((res: any) => {
                    if (!!res.predictions && res.predictions.length > 0) {
                        const directionStart: RoutePointI = {placeId: res.predictions[0].place_id};
                        this.setMapRoute(directionStart);
                    } else {
                        this.routes = [];
                        this.isLoadingDirection = false;
                        this.cdRef.detectChanges();
                    }
                });
        });
    }

    /**
     * define map route from my location
     */
    public defineMapRouteFromMyLocation() {
        if (navigator.geolocation) {
            this.isLoadingDirection = true;
            navigator.geolocation.getCurrentPosition((position) => {
                const directionStart = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                this.setMapRoute(directionStart);
            }, () => {
                this.routes = [];
                this.isLoadingDirection = false;
                this.cdRef.detectChanges();
            });
        }
    }

    /**
     * build route start and destination
     * @param directionStart
     */
    public buildRoute(directionStart: RoutePointI): RoutePointI[] {
        return [
            directionStart,
            {
                lat: +this.model.getField(this.latName),
                lng: +this.model.getField(this.lngName)
            }
        ];
    }

    /**
     * set model list search term
     */
    public triggerSearch() {
        this.zone.run(() => {
            this.modelList.searchTerm = this.listSearchTerm;
            this.modelList.reLoadList();
        });
    }

    /**
     * set the direction result
     * @param result
     */
    public setDirectionResult(result: DirectionResultI) {
        this.isLoadingDirection = false;
        this.directionResult = result;
        this.cdRef.detectChanges();
    }

    /**
     * cross browser toggle full screen mode
     */
    public toggleFullScreen(elementRef) {
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

    /**
     * listen to input range mouse down to handle triggering the map change on mouse up
     * @param inputRangeElement
     */
    public onRangeMouseDown(inputRangeElement: HTMLInputElement) {
        const mouseListener = this.renderer.listen(inputRangeElement, 'mouseup', () => {
            this.setMapOptionChanged('circleRadius');
            mouseListener();
        });
    }
}
