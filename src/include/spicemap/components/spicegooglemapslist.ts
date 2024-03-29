/**
 * @module ModuleSpiceMap
 */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, IterableDiffers, OnDestroy, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from "../../../services/metadata.service";
import {modellist} from "../../../services/modellist.service";
import {MapCenterI, MapOptionsI, RecordComponentConfigI, RecordI} from "../interfaces/spicemap.interfaces";
import {model} from "../../../services/model.service";
import {Subscription} from "rxjs";
import {broadcast} from "../../../services/broadcast.service";
import {navigation} from "../../../services/navigation.service";
import {ListTypeI} from "../../../services/interfaces.service";

/**
 * renders a list of records on google maps
 */
@Component({
    selector: 'spice-google-maps-list',
    templateUrl: '../templates/spicegooglemapslist.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpiceGoogleMapsList implements OnInit, AfterViewInit, OnDestroy {

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
    @Input() public componentconfig: RecordComponentConfigI;
    /**
     * differentiate the records array changes
     */
    public subscriptions: Subscription = new Subscription();
    /**
     * to be highlighted on the map and re centered
     */
    public focusedRecordId: string;
    /**
     * map options will be passed to the spice google maps
     */
    public mapOptions: MapOptionsI = {};
    /**
     * List of records to be displayed on the map as markers
     */
    public records: RecordI[] = [];

    constructor(
        public language: language,
        public modelList: modellist,
        public metadata: metadata,
        public iterableDiffers: IterableDiffers,
        public cdRef: ChangeDetectorRef,
        public model: model,
        public navigation: navigation,
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
        this.subscribeToBroadcastMessages();
    }

    /**
     * set map option changed to rebuild circle
     */
    public ngAfterViewInit(): void {
        this.setMapOptionChanged('circle');
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
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
            this.componentconfig = this.metadata.getComponentConfig('SpiceGoogleMapsList', this.modelList.module);
        }

        if (!this.componentconfig) this.componentconfig = {};

        if (!(!!this.componentconfig.radiusPercentage) || isNaN(this.componentconfig.radiusPercentage)) {
            this.componentconfig.radiusPercentage = 80;
        }
        if (!this.componentconfig.directionTravelMode || ['DRIVING', 'WALKING', 'TRANSIT', 'BICYCLING'].indexOf(this.componentconfig.directionTravelMode) == -1) {
            this.componentconfig.directionTravelMode = 'DRIVING';
        }
        if (!(!!this.componentconfig.mapHeight)) {
            this.componentconfig.mapHeight = 500;
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

        this.setMapOptionsFromComponentConfig();

        this.setLatLngFieldsNames();
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
        if (!this.mapOptions.circle) return;
        this.mapOptions.circle.center = center;
    }

    /**
     * reset the map options with the changed object property set to true to force the map component to reload by property
     */
    public setMapOptionChanged(property: string) {
        this.mapOptions.changed = {[property]: true};
        this.mapOptions = {...this.mapOptions};
        this.cdRef.detectChanges();
    }

    /**
     * check if the geo object latitude and longitude are correct
     * @param latLng
     */
    public verifyLatLng(latLng: { lat: number, lng: number }) {
        return !!latLng.lng && !isNaN(latLng.lng) && !!latLng.lat && !isNaN(latLng.lat);
    }

    /**
     * set the focused record from map.focus broadcast message
     * or recenter the map and start the search around if the message record is not found on the map
     * @param msg
     */
    public handleBroadcastMessage(msg: { messagedata: any, messagetype: string }) {
        if ((msg.messagetype != 'map.focus' && msg.messagetype != 'map.defocus') || !msg.messagedata || !msg.messagedata.record || this.navigation.activeTab != msg.messagedata.tabId) {
            return;
        }
        this.focusedRecordId = undefined;
        this.cdRef.detectChanges();

        if (msg.messagetype == 'map.defocus') {
            this.mapOptions.circle = undefined;
            this.searchAroundActive = false;
            this.setMapOptionChanged('circle');

        } else {
            const focusedRecord = this.records.find((record: RecordI) => record.id == msg.messagedata.record.id);
            if (!focusedRecord) {
                this.mapOptions.circle = {
                    center: {
                        lat: msg.messagedata.record.data[this.latName],
                        lng: msg.messagedata.record.data[this.lngName],
                    },
                    draggable: true,
                    editable: true,
                    radius: null,
                    radiusPercentage: this.componentconfig.radiusPercentage,
                    color: this.componentconfig.circleColor
                };

                this.searchAroundActive = true;
                this.startRadiusEditing(true);
                this.setMapOptionChanged('circle');
            } else {
                this.focusedRecordId = focusedRecord.id;
            }
        }
        this.cdRef.detectChanges();
    }

    /**
     * subscribe to map focus from the focus field and set focused record id
     */
    public subscribeToBroadcastMessages() {
        this.subscriptions.add(
            this.broadcast.message$.subscribe(msg => {
                this.handleBroadcastMessage(msg);
            })
        );
    }

    /**
     * set map options from component config
     */
    public setMapOptionsFromComponentConfig() {
        this.mapOptions = {
            showCluster: this.componentconfig.showCluster,
            markerWithModelPopover: this.componentconfig.markerWithModelPopover,
            popoverComponent: this.componentconfig.popoverComponent,
            focusColor: this.componentconfig.focusColor,
            showMyLocation: this.componentconfig.showMyLocation,
        };
    }

    /**
     * set the latitude longitude fields names from module defs
     */
    public setLatLngFieldsNames() {
        const moduleDefs = this.metadata.getModuleDefs(this.modelList.module);
        if (!!moduleDefs && !!moduleDefs.ftsgeo) {
            this.lngName = moduleDefs.ftsgeo.longitude_field;
            this.latName = moduleDefs.ftsgeo.latitude_field;
        }
    }

    /**
     * set fixed circle data from the model list current list filter defs
     */
    public setFixedCircle() {
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
    public subscribeToModelListChanges() {
        this.subscriptions.add(this.modelList.listType$.subscribe(newType => {
            this.handleListTypeChange(newType);
        }));
        this.subscriptions.add(this.modelList.listDataChanged$.subscribe(() => {
            this.setRecords();
            this.setFixedCircle();
        }));
    }

    /**
     * handle the list type change to reload the data only if for this component to prevent possible actions after destroy
     * @param newType
     * @private
     */
    public handleListTypeChange(newType: ListTypeI) {
        if (newType.listcomponent != 'SpiceGoogleMapsList') return;
        this.setRecords();
    }

    /**
     * load more records
     */
    public loadMore() {
        this.modelList.loadMoreList();
    }

    /**
     * toggle search around to draw/remove the circle on the map
     */
    public toggleSearchAround() {
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
                radius: null,
                radiusPercentage: this.componentconfig.radiusPercentage,
                color: this.componentconfig.circleColor
            };
            this.startRadiusEditing(true);
        }
        this.setMapOptionChanged('circle');
    }

    /**
     * set editing radius to true
     */
    public startRadiusEditing(silent?: boolean) {
        this.editingRadius = true;
        this.mapOptions.circle.editable = true;
        this.mapOptions.circle.draggable = true;

        if (!silent) {
            this.setMapOptionChanged('circleEditable');
        }
    }

    /**
     * set editing radius to false
     */
    public cancelEditingRadius() {
        this.editingRadius = false;
        this.mapOptions.circle.editable = false;
        this.mapOptions.circle.draggable = false;

        this.setMapOptionChanged('circleEditable');
    }

    /**
     * call confirm circle changes and stop editing radius
     */
    public confirmRadiusInput() {
        this.cancelEditingRadius();
        this.setMapOptionChanged('circleRadius');
    }
}
