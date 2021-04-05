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
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, IterableDiffers, OnDestroy, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from "../../../services/metadata.service";
import {modellist} from "../../../services/modellist.service";
import {MapCenterI, MapOptionsI, RecordComponentConfigI, RecordI} from "../interfaces/spicemap.interfaces";
import {model} from "../../../services/model.service";
import {Subscription} from "rxjs";
import {broadcast} from "../../../services/broadcast.service";
import {navigation} from "../../../services/navigation.service";

/**
 * renders a list of records on google maps
 */
@Component({
    selector: 'spice-google-maps-list',
    templateUrl: './src/include/spicemap/templates/spicegooglemapslist.html',
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
    protected mapOptions: MapOptionsI = {};
    /**
     * List of records to be displayed on the map as markers
     */
    protected records: RecordI[] = [];

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
        this.modelList.reLoadList();
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
    private subscribeToBroadcastMessages() {
        this.subscriptions.add(
            this.broadcast.message$.subscribe(msg => {
                this.handleBroadcastMessage(msg);
            })
        );
    }

    /**
     * set map options from component config
     */
    private setMapOptionsFromComponentConfig() {
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
        this.subscriptions.add(this.modelList.listtype$.subscribe(() => {
            this.setRecords();
        }));
        this.subscriptions.add(this.modelList.listDataChanged$.subscribe(() => {
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
    private startRadiusEditing(silent?: boolean) {
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
    private cancelEditingRadius() {
        this.editingRadius = false;
        this.mapOptions.circle.editable = false;
        this.mapOptions.circle.draggable = false;

        this.setMapOptionChanged('circleEditable');
    }

    /**
     * call confirm circle changes and stop editing radius
     */
    private confirmRadiusInput() {
        this.cancelEditingRadius();
        this.setMapOptionChanged('circleRadius');
    }
}
