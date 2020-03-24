/**
 * @module ModuleSpiceMap
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
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
import {DirectionResultI, mapOptionsI, RoutePointI} from "../interfaces/spicemap.interfaces";
import {backend} from "../../../services/backend.service";
import {session} from "../../../services/session.service";

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
    protected mapOptions: mapOptionsI = {};
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

    constructor(
        public language: language,
        public modelList: modellist,
        public metadata: metadata,
        public backend: backend,
        public iterableDiffers: IterableDiffers,
        public cdr: ChangeDetectorRef,
        public zone: NgZone,
        public session: session,
        public model: model
    ) {
        super(language, modelList, metadata, iterableDiffers, cdr);
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
            this.mapOptions = {...this.componentconfig};
            this.directionResult = undefined;
            this.setCenterFromModel();
            this.setRecords();
        } else {
            this.setMapOptionsForDirectionUse();
            this.records = [];
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
     * set the mapOption.center from the record
     */
    public ngOnInit() {
        this.setComponentName();
        this.initializeModelList();
        super.ngOnInit();
        this.setCenterFromModel();
    }

    /**
     * check if the route entries are correct
     * @param routePoint
     */
    protected verifyPlaceLatLng(routePoint: RoutePointI) {
        return (!!routePoint.placeId) || (!!routePoint.lng && !isNaN(routePoint.lng) && !!routePoint.lat && !isNaN(routePoint.lat));
    }

    /**
     * set the module for the module list service and activate cache
     */
    private initializeModelList() {
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
            center: undefined,
            directionTravelMode: this.componentconfig.directionTravelMode
        };
    }

    /**
     * set circle center from record geo data
     */
    private setCenterFromModel() {
        this.mapOptions.center = {
            lng: +this.model.getField(this.lngName),
            lat: +this.model.getField(this.latName)
        };
        if (!this.verifyPlaceLatLng(this.mapOptions.center)) {
            this.mapOptions.center = undefined;
        }
    }

    /**
     * set search geo filter on modelList and reload the records list
     */
    private onRadiusChange(radius: number) {
        this.modelList.searchGeo = {
            radius: radius,
            lat: this.model.getField(this.latName),
            lng: this.model.getField(this.lngName)
        };
        this.modelList.reLoadList().subscribe(() => {
            this.setRecords();
        });
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
        this.cdr.detectChanges();
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
            this.modelList.getListData();
        });
    }

    /**
     * set the direction result
     * @param result
     */
    private setDirectionResult(result: DirectionResultI) {
        this.isLoadingDirection = false;
        this.directionResult = result;
        this.cdr.detectChanges();
    }
}
