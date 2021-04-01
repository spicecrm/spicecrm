/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleReportsMore
 */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    NgZone,
    OnDestroy,
    Renderer2,
    TemplateRef,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {libloader} from '../../../services/libloader.service';

/** @ignore */
declare var google: any;
/** @ignore */
declare var MarkerClusterer: any;
/** @ignore */
declare var OverlappingMarkerSpiderfier: any;
/** @ignore */
declare var _: any;

@Component({
    selector: 'reporter-detail-visualization-google-maps',
    templateUrl: './src/modules/reportsmore/templates/reporterdetailvisualizationgooglemaps.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterDetailVisualizationGoogleMaps implements AfterViewInit, OnDestroy {

    public vizdata: any;
    /**
     * google maps pin markers arry
     */
    protected markers: any[] = [];
    @ViewChild('mapContainer', {read: ViewContainerRef, static: false}) private mapContainer: ViewContainerRef;
    @ViewChild('legendContainer') private legendContainer: TemplateRef<any>;
    /**
     * google maps instance
     */
    private map: any = {};
    /**
     * popup window instance for markers
     */
    private infoWindow: any = {};
    /**
     * to ensure that the map is ready to handle panning and drawing actions
     */
    private isMapIdled: boolean = false;
    /**
     * to ensure that the map tiles are loaded to handle adding clusters
     */
    private tilesLoaded: boolean = false;
    /**
     * event listener for the center control rendered on the map
     */
    private centerControlListener: any;
    /**
     * google.maps.LatLngBounds instance to fit the map zoom and position to markers or the defined center
     */
    private mapBounds: any;

    constructor(
        private language: language,
        private model: model,
        private libLoader: libloader,
        private zone: NgZone,
        private renderer: Renderer2
    ) {
    }

    /**
     * @return legendItems: object[]
     */
    get legendItems() {
        return _.toArray(this.vizdata.data.data.mapaddins.legend.items);
    }

    /**
     * load google maps library
     * load cluster library if active
     * load spiderfy library if active
     */
    public ngAfterViewInit() {
        this.libLoader.loadLib('maps.googleapis').subscribe(() => {
            this.zone.runOutsideAngular(() =>
                this.renderMap()
            );
            if (!!this.vizdata.data.data.mapaddins.cluster) {
                this.libLoader.loadLib('MarkerClustererPlus').subscribe(() => {
                    this.zone.runOutsideAngular(() =>
                        this.setMarkerCluster()
                    );
                });
            } else if (!!this.vizdata.data.data.mapaddins.spiderfy) {
                this.libLoader.loadLib('OverlappingMarkerSpiderfier').subscribe(() => {
                    this.zone.runOutsideAngular(() =>
                        this.setMarkerSpiderfier()
                    );
                });
            }
        });

    }

    /**
     * remove all event listeners from all google maps instances
     */
    public ngOnDestroy(): void {
        google.maps.event.clearInstanceListeners(this.map);
        this.markers.forEach(marker => {
            google.maps.event.clearInstanceListeners(marker);
        });
        this.removeReCenterControlListener();
    }

    /**
     * remove re-center controll listener
     */
    private removeReCenterControlListener() {
        if (!!this.centerControlListener) {
            this.centerControlListener();
            this.centerControlListener = null;
        }
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
            this.fitMapBounds();
        });
        this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
    }

    /**
     * generate marker icon
     * @param color
     * @param letter
     */
    protected generateMarkerIcon(color: string, letter?: string) {
        const colorHex = color.indexOf('#') == 0 ? color : '#' + color;
        const textColor = color.indexOf('ffffff') > -1 ? '#404040' : '#ffffff';
        if (!letter) {
            return {
                path: `M 0,0 L -43.3,-75 A 50 50 1 1 1 43.30,-75 L 0,0 z`,
                strokeColor: textColor,
                strokeWeight: 1,
                fillOpacity: 1,
                scale: .25,
                anchor: {x: 4.5, y: 5},
                fillColor: colorHex
            };
        } else {
            return `data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20style%3D%22transform%3A%20scale%28.88%29%22%20%20width%3D%2243%22%20height%3D%2243%22%20viewBox%3D%220%200%2043%2043%22%3E%3Cpath%20fill%3D%22${
                colorHex.replace('#','%23')
            }%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221%22%20d%3D%22M34.305%2016.234c0%208.83-15.148%2028.158-15.148%2028.158S3.507%2025.065%203.507%2016.1c0-8.505%206.894-14.304%2015.4-14.304%208.504%200%2015.398%205.933%2015.398%2014.438z%22%20%2F%3E%3Ctext%20fill%3D%22${
                textColor.replace('#','%23')
            }%22%20style%3D%22font-family%3AArial%3Bfont-size%3A%2020px%22%20x%3D%2213%22%20y%3D%2222%22%3E${
                letter[0]
            }%3C%2Ftext%3E%3C%2Fsvg%3E`;
        }
    }

    /**
     * check if the geo object latitude and longitude are correct
     * @param latLng
     */
    protected verifyLatLng(latLng: { latitude: number, longitude: number }) {
        return !!latLng.longitude && !isNaN(latLng.longitude) && !!latLng.latitude && !isNaN(latLng.latitude);
    }

    /**
     * render google map and set the markers from report results
     * set legend if active
     */
    private renderMap() {

        this.map = new google.maps.Map(this.mapContainer.element.nativeElement,
            {
                center: {lat: 48.168588, lng: 16.346818},
                zoom: 11,
                streetViewControl: false
            });

        this.mapBounds = new google.maps.LatLngBounds();

        this.infoWindow = new google.maps.InfoWindow();

        // close popup window on map click
        google.maps.event.addListener(this.map, 'click', () => this.infoWindow.close());

        google.maps.event.addListenerOnce(this.map, 'tilesloaded', () => {
            this.tilesLoaded = true;
        });

        google.maps.event.addListenerOnce(this.map, 'idle', () => {

            this.isMapIdled = true;

            if (!!this.vizdata) {
                this.setMarkers();

                if (!!this.vizdata.data.data.mapaddins.legend.display) {
                    this.setLegendFromTemplate();
                }
            }
        });

        this.defineReCenterControl();
    }

    /**
     * initialize MarkerClusterer and add markers to it
     */
    private setMarkerCluster() {

        if (!this.isMapIdled || !(window as any).MarkerClusterer || this.markers.length == 0) return;

        const markerCluster = new MarkerClusterer(this.map, [],
            {imagePath: 'vendor/google-maps/MarkerClustererPlus/images/m'});

        if (!this.tilesLoaded) {
            google.maps.event.addListenerOnce(this.map, 'tilesloaded', () => {
                this.tilesLoaded = true;
                markerCluster.addMarkers(this.markers);
            });
        } else {
            markerCluster.addMarkers(this.markers);
        }
    }

    /**
     * set marker spiderfier and add markers to spiderfier
     */
    private setMarkerSpiderfier() {

        if (!this.isMapIdled || !(window as any).OverlappingMarkerSpiderfier || this.markers.length == 0) return;


        const markerSpiderfier = new OverlappingMarkerSpiderfier(this.map,
            {
                markersWontMove: true,
                markersWontHide: true,
                keepSpiderfied: true
            });

        this.markers.forEach(marker => {
            markerSpiderfier.addMarker(marker, () => {
                this.infoWindow.setContent(marker.info);
                this.infoWindow.open(this.map, marker);
            });
        });
    }

    /**
     * set legend for the map
     */
    private setLegendFromTemplate() {
        const templateRef = this.legendContainer.createEmbeddedView(null);
        templateRef.detectChanges();
        this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(templateRef.rootNodes[0]);
    }

    /**
     * define marker data for each record
     * define a colored marker icon for each record if its color is set
     * create marker for each record
     * push the marker position to map bounds to reposition and re-zoom on all markers later
     * push each marker to markers array
     * set marker cluster if it is active and the direction service is inactive
     * fit the map bounds to all rendered markers
     */
    private setMarkers() {

        this.mapBounds = new google.maps.LatLngBounds();

        this.vizdata.data.data.pinpoints.forEach(item => {

            if (!this.verifyLatLng(item)) return;

            const markerData: any = {
                id: item.id,
                map: this.map,
                title: !!item.title ? item.title : '',
                info: !!item.info ? item.info : '',
                animation: google.maps.Animation.DROP,
                position: {lat: +item.latitude, lng: +item.longitude},
            };

            if (!!item.color) {
                markerData.icon = this.generateMarkerIcon(item.color, item.text);
            }

            // set popup window content
            this.infoWindow.setContent(markerData.info);


            const marker = new google.maps.Marker(markerData);
            this.mapBounds.extend(marker.position);

            marker.addListener('click', () => {
                this.infoWindow.close();
                // if spiderfier is active it will add its own listener
                if (!(window as any).OverlappingMarkerSpiderfier) {
                    this.infoWindow.open(this.map, marker);
                }
            });

            this.markers.push(marker);
        });

        if (!!this.vizdata.data.data.mapaddins.cluster) {
            this.setMarkerCluster();
        } else if (!!this.vizdata.data.data.mapaddins.spiderfy) {
            this.setMarkerSpiderfier();
        }

        this.fitMapBounds();
    }

    /**
     * fit the map bounds with less zoom if we have only one marker
     */
    private fitMapBounds() {

        this.map.setOptions({maxZoom: 14});
        this.map.fitBounds(this.mapBounds);
        this.map.setOptions({maxZoom: null});

    }
}
