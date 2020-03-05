/**
 * @module ModuleReportsMore
 */
import {AfterViewInit, Component, NgZone, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {libloader} from '../../../services/libloader.service';

/** @ignore */
declare let google: any;
/** @ignore */
declare let MarkerClusterer: any;
/** @ignore */
declare let OverlappingMarkerSpiderfier: any;
/** @ignore */
declare let _: any;

@Component({
    selector: 'reporter-detail-visualization-google-maps',
    templateUrl: './src/modules/reportsmore/templates/reporterdetailvisualizationgooglemaps.html'
})
export class ReporterDetailVisualizationGoogleMaps implements AfterViewInit {

    public vizdata: any;
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
     * google maps pin markers arry
     */
    protected markers: any[] =  [];

    constructor(
        private language: language,
        private model: model,
        private libLoader: libloader,
        private zone: NgZone
    ) {
    }

    /**
     * @return isApiLoaded: boolean
     */
    get isApiLoaded(): boolean {
        return (window as any).google && (window as any).google.maps;
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
            this.renderMap();
            if (!!this.vizdata.data.data.mapaddins.cluster) {
                this.libLoader.loadLib('MarkerClustererPlus').subscribe(() => this.setMarkerCluster());
            } else if (!!this.vizdata.data.data.mapaddins.spiderfy) {
                this.libLoader.loadLib('OverlappingMarkerSpiderfier').subscribe(() => this.setMarkerSpiderfier());
            }
        });
    }

    /**
     * render google map and set the markers from report results
     * set legend if active
     */
    private renderMap() {
        this.zone.runOutsideAngular(() => {
            this.map = new google.maps.Map(this.mapContainer.element.nativeElement);
            this.infoWindow = new google.maps.InfoWindow();

            // close popup window on map click
            google.maps.event.addListener(this.map, 'click', () => this.infoWindow.close());

            if (!!this.vizdata) {
                this.setMarkers();

                if (!!this.vizdata.data.data.mapaddins.legend.display) {
                    this.setLegendFromTemplate();
                }
            }
        });
    }

    /**
     * set maker cluster
     */
    private setMarkerCluster() {
        const markerCluster = new MarkerClusterer(this.map, this.markers,
            {imagePath: 'vendor/google-maps/MarkerClustererPlus/images/m'});
    }

    /**
     * set maker spiderfier and add markers to speiderfy
     */
    private setMarkerSpiderfier() {
        const oms = new OverlappingMarkerSpiderfier(this.map,
            {
                markersWontMove: true,
                markersWontHide: true,
                keepSpiderfied: true
            });
        this.markers.forEach(marker => {
            oms.addMarker(marker, () => {
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
     * set markers from report result records
     */
    private setMarkers() {
        this.markers = [];
        const mapBounds = new google.maps.LatLngBounds();
        const iconData = {
            path: `M7.8,1.3L7.8,1.3C6-0.4,3.1-0.4,1.3,1.3c-1.8,1.7-1.8,4.6-0.1,6.3c0,0,0,0,0.1,0.1l3.2,3.2l3.2-3.2C9.6,6,9.6,3.2,7.8,1.3`,
            strokeColor: '#fff',
            fillOpacity: 1,
            fillColor: '',
            scale: 2,
            anchor: {x: 4.5,y: 5}
        };

        this.vizdata.data.data.pinpoints.forEach(item => {

            iconData.fillColor = '#' + item.colorLabel;
            const markerData: any = {
                map: this.map,
                position: null,
                title: !!item.title ? item.title : '',
                icon: iconData,
                info: !!item.info ? item.info : '',
                animation: google.maps.Animation.DROP
            };
            // set popup window content
            this.infoWindow.setContent(markerData.info);

            // set the marker position either from the geo data or from address by mapGeoCoder
            if (!!item.latitude && !!item.longitude) {
                markerData.position = {lat: +item.latitude, lng: +item.longitude};
                this.createMarker(markerData, mapBounds);
            }
        });
    }

    /**
     * create a marker from the given markerData and push it to markers array
     * add info window to the marker and fit the map bounds
     * @param markerData: object
     * @param mapBounds: google.maps.LatLngBounds
     */
    private createMarker(markerData, mapBounds) {
        const marker = new google.maps.Marker(markerData);
        marker.addListener('click', () => {
            this.infoWindow.close();
            // if spiderfy is active it will add its own listener
            if (!(window as any).OverlappingMarkerSpiderfier) {
                this.infoWindow.open(this.map, marker);
            }
        });
        this.markers.push(marker);
        mapBounds.extend(marker.position);
        this.map.fitBounds(mapBounds);
    }
}
