/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/include/spicemap/templates/spicegooglemapsrecordcontainer.html',
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
    protected hasGeoData: boolean = false;

    constructor(private model: model,
                private cdRef: ChangeDetectorRef,
                private broadcast: broadcast,
                private modelList: modellist,
                private metadata: metadata) {

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
    private initializeModelList() {
        // set usecahce to false
        this.modelList.usecache = false;
        // set the module in an embedded mode so not the full list is loaded
        this.modelList.setModule(this.model.module, true);

        // set the container component so we
        this.modelList.listcomponent = 'SpiceGoogleMapsRecordContainer';
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
    private subscribeToModelChanges() {
        this.subscription = this.broadcast.message$.subscribe(msg => {
            if (msg.messagetype == 'model.save' && msg.messagedata.module === this.model.module) {
                this.checkModelHasGeoData();
            }
        });
    }

    /**
     * check if model has geo data
     */
    private checkModelHasGeoData() {
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
