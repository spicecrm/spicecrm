/**
 * @module ModuleSpiceMap
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, IterableDiffers, OnDestroy, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from "../../../services/metadata.service";
import {modellist} from "../../../services/modellist.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {MapCenterI, MapOptionsI, RecordComponentConfigI, RecordI} from "../interfaces/spicemap.interfaces";
import {model} from "../../../services/model.service";
import {Subscription} from "rxjs";
import {navigationtab} from "../../../services/navigationtab.service";
import {broadcast} from "../../../services/broadcast.service";

/** @ignore */
const ANIMATIONS = [
    trigger('animatepanel', [
        transition(':enter', [
            style({right: '-320px', overflow: 'hidden'}),
            animate('.5s', style({right: '0px'})),
            style({overflow: 'unset'})
        ]),
        transition(':leave', [
            style({overflow: 'hidden'}),
            animate('.5s', style({right: '-320px'}))
        ])
    ])
];

/**
 * renders a list of records on google maps
 */
@Component({
    selector: 'spice-google-maps-list',
    templateUrl: './src/include/spicemap/templates/spicegooglemapslist.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: ANIMATIONS
})
export class SpiceGoogleMapsList implements OnInit, OnDestroy {

    /**
     * save the editing radius value to handle radius changes
     */
    public editingRadius: boolean = false;

    /**
     * save the search around active value to toggle display the search functionality
     */
    public searchAroundActive: boolean = false;
    /**
     * longitude field name to be used for markers position
     */
    public lngName: string = 'longitude';
    /**
     * latitude field name to be used for markers position
     */
    public latName: string = 'latitude';
    /**
     * component config from metadata
     */
    public componentconfig: RecordComponentConfigI;
    /**
     * differentiate the records array changes
     */
    public subscription: Subscription = new Subscription();
    /**
     * map options will be passed to the spice google maps
     */
    protected mapOptions: MapOptionsI = {};
    /**
     * List of records to be displayed on the map as markers
     */
    protected records: RecordI[] = [];
    /**
     * to be highlighted on the map and re centered
     */
    protected focusedRecordId: string;
    /**
     * name of this component for load component config on extended components
     */
    protected componentName: string = 'SpiceGoogleMapsList';

    constructor(
        public language: language,
        public modelList: modellist,
        public metadata: metadata,
        public iterableDiffers: IterableDiffers,
        public cdRef: ChangeDetectorRef,
        public model: model,
        public navigationtab: navigationtab,
        public broadcast: broadcast
    ) {
    }

    /**
     * @return isLoading: boolean
     */
    get isLoading() {
        return this.modelList.isLoading;
    }

    /**
     * @return canLoadMore: boolean
     */
    get canLoadMore() {
        return this.modelList.listData.list.length < this.modelList.listData.totalcount;
    }

    /**
     * load the component configs from metatdata
     * initialize the model list
     */
    public ngOnInit() {
        this.loadComponentConfigs();
        this.subscribeToModelListChanges();
        this.subscribeToMapFocus();
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy() {
        this.subscription.unsubscribe();
        this.modelList.searchGeo = undefined;
    }

    /**
     * set records from list data
     */
    public setRecords() {
        this.records = (!this.latName || !this.lngName) ? [] : this.modelList.listData.list
            .filter(item => this.verifyLatLng({lat: item[this.latName], lng: item[this.lngName]}))
            .map(item => ({
                id: item.id,
                module: this.modelList.module,
                title: '' + item.summary_text,
                lng: +item[this.lngName],
                lat: +item[this.latName]
            }));
        this.cdRef.detectChanges();
    }

    /**
     * load the component config from metadata to save the default map options
     * set the component config locally if it is not set from the outside
     * define the latitude and longitude field names from the module defs
     * copy the component configs to the map options set the geo fields names
     */
    public loadComponentConfigs() {
        // if not defined from the component set get it from module config
        if (!this.componentconfig) {
            this.componentconfig = this.metadata.getComponentConfig(this.componentName, this.modelList.module);
        }

        if (!this.componentconfig) this.componentconfig = {};

        if (!(!!this.componentconfig.radiusPercentage) || isNaN(this.componentconfig.radiusPercentage)) {
            this.componentconfig.radiusPercentage = 80;
        }
        if (!this.componentconfig.directionTravelMode || ['DRIVING', 'WALKING', 'TRANSIT', 'BICYCLING'].indexOf(this.componentconfig.directionTravelMode) == -1) {
            this.componentconfig.directionTravelMode = 'DRIVING';
        }
        if (!(!!this.componentconfig.mapHeight)) {
            this.componentconfig.mapHeight = 300;
        }
        if (!(!!this.componentconfig.circleColor)) {
            this.componentconfig.circleColor = '#CA1B21';
        }
        if (!(!!this.componentconfig.filterCircleColor)) {
            this.componentconfig.filterCircleColor = '#1A73E8';
        }
        if (!(!!this.componentconfig.focusColor)) {
            this.componentconfig.focusColor = '#1A73E8';
        }

        this.setFirstMapOptionsChanged();

        this.setLatLngFieldsNames();
    }

    /**
     * set changed property for mapOptions to trigger change detections on the map
     */
    public setFirstMapOptionsChanged() {
        this.mapOptions = {
            ...this.componentconfig, changed: {
                showMyLocation: true,
                showCluster: true,
                markerWithModelPopover: true,
                directionTravelMode: true,
                focusColor: true,
            }
        };
    }

    /**
     * set search geo filter on modelList and reload the records list
     */
    public onRadiusChange(radius: number) {

        if (!!this.mapOptions.circle) {
            this.mapOptions.circle.radius = radius;
            this.cdRef.detectChanges();
        }
        if (this.editingRadius) return;

        this.modelList.searchGeo = {
            radius: radius,
            lat: this.mapOptions.circle.center.lat,
            lng: this.mapOptions.circle.center.lng
        };
        this.modelList.reLoadList(true).subscribe(() => {
            this.setRecords();
        });
    }

    /**
     * set search geo filter on modelList and reload the records list
     */
    public onCenterChange(center: MapCenterI) {
        this.mapOptions.circle.center = center;
    }

    /**
     * reset the map options with the changed object property set to true to force the map component to reload by property
     */
    public setMapOptionChanged(property: string) {
        this.mapOptions.changed = {[property]: true};
        this.mapOptions = {...this.mapOptions};
    }

    /**
     * check if the geo object latitude and longitude are correct
     * @param latLng
     */
    public verifyLatLng(latLng: { lat: number, lng: number }) {
        return !!latLng.lng && !isNaN(latLng.lng) && !!latLng.lat && !isNaN(latLng.lat);
    }

    /**
     * subscribe to map focus from the focus field and set focused record id
     */
    public subscribeToMapFocus() {
        this.subscription.add(this.broadcast.message$.subscribe(msg => {
            this.setFocusedRecordId(msg);
        }));
    }

    /**
     * set the latitude longitude fields names from module defs
     */
    private setLatLngFieldsNames() {
        const moduleDefs = this.metadata.getModuleDefs(this.modelList.module);
        if (!!moduleDefs && !!moduleDefs.ftsgeo) {
            this.lngName = moduleDefs.ftsgeo.longitude_field;
            this.latName = moduleDefs.ftsgeo.latitude_field;
        }
    }

    /**
     * set fixed circle data from the model list current list filter defs
     */
    private setFixedCircle() {
        const geoFilter = this.modelList.getFilterDefs().geography;

        if (!geoFilter || !this.verifyLatLng(geoFilter) || !geoFilter.radius || isNaN(geoFilter.radius)) {
            this.mapOptions.fixedCircle = undefined;
            return this.setMapOptionChanged('fixedCircle');
        }

        this.mapOptions.fixedCircle = {
            radius: geoFilter.radius,
            center: {
                lng: geoFilter.lng,
                lat: geoFilter.lat
            },
            color: this.componentconfig.filterCircleColor
        };

        this.setMapOptionChanged('fixedCircle');
    }

    /**
     * subscribe to model list type and data reloaded changes to reset records
     */
    private subscribeToModelListChanges() {
        this.subscription.add(this.modelList.listtype$.subscribe(() => {
            this.setRecords();
        }));
        this.subscription.add(this.modelList.listDataChanged$.subscribe(() => {
            this.setRecords();
            this.setFixedCircle();
        }));
    }

    /**
     * load more records
     */
    private loadMore() {
        this.modelList.loadMoreList();
    }

    /**
     * toggle search around to draw/remove the circle on the map
     */
    private toggleSearchAround() {
        this.searchAroundActive = !this.searchAroundActive;
        if (!this.searchAroundActive) {
            this.mapOptions.circle = undefined;
            this.editingRadius = false;
            this.modelList.searchGeo = undefined;
            this.modelList.reLoadList(true);
        } else {
            this.mapOptions.circle = {
                center: null,
                draggable: true,
                editable: true,
                radius: 5,
                radiusPercentage: this.componentconfig.radiusPercentage,
                color: this.componentconfig.circleColor
            };
            this.startRadiusEditing();
        }
        this.setMapOptionChanged('circle');
    }

    /**
     * set editing radius to true
     */
    private startRadiusEditing() {
        this.editingRadius = true;
    }

    /**
     * set editing radius to false
     */
    private cancelEditingRadius() {
        this.editingRadius = false;
    }

    /**
     * call confirm circle changes and stop editing radius
     */
    private confirmRadiusInput() {
        this.editingRadius = false;
        this.setMapOptionChanged('circleRadius');
    }

    /**
     * set the focused record from geo data field broadcast
     * @param msg
     */
    private setFocusedRecordId(msg: { messagedata: any, messagetype: string }) {
        if (msg.messagetype != 'map.focus' || !msg.messagedata || !msg.messagedata.modelId || this.focusedRecordId == msg.messagedata.modelId ||
            (msg.messagedata.tabId == 'main' && !!this.navigationtab.tabid) || (msg.messagedata.tabId != 'main' && this.navigationtab.tabid != msg.messagedata.tabId)) {
            return;
        }

        this.focusedRecordId = msg.messagedata.modelId;
    }
}
