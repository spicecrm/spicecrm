/**
 * @module ModuleSpiceMap
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {RecordComponentConfigI} from "../interfaces/spicemap.interfaces";
import {Subscription} from "rxjs";
import {broadcast} from "../../../services/broadcast.service";
import {modellist} from "../../../services/modellist.service";

/**
 * render a google map with model list service which enables searching around and use the navigation service
 */
@Component({
    selector: 'spice-google-maps-record-container',
    templateUrl: '../templates/spicegooglemapsrecordcontainer.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [modellist]
})
export class SpiceGoogleMapsRecordContainer implements OnInit, OnDestroy {
    /**
     * component config from metadata
     */
    public componentconfig: RecordComponentConfigI;
    /**
     * differentiate the records array changes
     */
    public subscription: Subscription = new Subscription();
    /**
     * save the has geo data value to hide/show map
     */
    public hasGeoData: boolean = false;

    constructor(public model: model,
                public cdRef: ChangeDetectorRef,
                public broadcast: broadcast,
                public modelList: modellist,
                public metadata: metadata) {

    }

    /**
     * initialize the model list
     * subscribe to model changes
     * check if the model has geo data
     */
    public ngOnInit(): void {
        this.initializeModelList();
        this.loadComponentConfigs();
        this.subscribeToModelChanges();
        this.checkModelHasGeoData();
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    /**
     * check if the geo object latitude and longitude are correct
     * @param latLng
     */
    public verifyLatLng(latLng: { lat: number, lng: number }) {
        return !!latLng.lng && !isNaN(latLng.lng) && !!latLng.lat && !isNaN(latLng.lat);
    }

    /**
     * set the module for the module list service and activate cache
     */
    public initializeModelList() {
        // set the module in an embedded mode so not the full list is loaded
        this.modelList.initialize(this.model.module, 'SpiceGoogleMapsRecordContainer');
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
            this.componentconfig = this.metadata.getComponentConfig('SpiceGoogleMapsRecordContainer', this.model.module);
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
    }

    /**
     * subscribe to model save to recheck the geo data
     */
    public subscribeToModelChanges() {
        this.subscription = this.broadcast.message$.subscribe(msg => {
            if (msg.messagetype == 'model.save' && msg.messagedata.module === this.model.module) {
                this.checkModelHasGeoData();
            }
        });
    }

    /**
     * check if model has geo data
     */
    public checkModelHasGeoData() {
        const moduleDefs = this.metadata.getModuleDefs(this.model.module);

        if (!!moduleDefs && !!moduleDefs.ftsgeo) {
            const lngName = moduleDefs.ftsgeo.longitude_field;
            const latName = moduleDefs.ftsgeo.latitude_field;

            this.hasGeoData = this.verifyLatLng({lat: this.model.getField(latName), lng: this.model.getField(lngName)});
        } else {
            this.hasGeoData = false;
        }
        this.cdRef.detectChanges();
    }
}
