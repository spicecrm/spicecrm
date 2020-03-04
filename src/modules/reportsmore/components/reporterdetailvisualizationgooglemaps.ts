/**
 * @module ModuleReportsMore
 */
import {AfterViewInit, Component, NgZone, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {libloader} from '../../../services/libloader.service';

/**
 * @ignore
 */
declare let google: any;
/**
 * @ignore
 */
declare let _: any;

@Component({
    selector: 'reporter-detail-visualization-google-maps',
    templateUrl: './src/modules/reportsmore/templates/reporterdetailvisualizationgooglemaps.html'
})
export class ReporterDetailVisualizationGoogleMaps implements AfterViewInit {

    public vizdata: any;
    @ViewChild('mapContainer', {read: ViewContainerRef, static: false}) private mapContainer: ViewContainerRef;
    @ViewChild('legendContainer') private legendContainer: TemplateRef<any>;
    private map: any = {};

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
     */
    public ngAfterViewInit() {
        this.libLoader.loadLib('maps.googleapis').subscribe(() => this.renderMap());
    }

    /**
     * render google map
     */
    private renderMap() {
        this.zone.runOutsideAngular(() => {
            this.map = new google.maps.Map(this.mapContainer.element.nativeElement, {
                center: {lat: 48.183607, lng: 16.321538},
                zoom: 11
            });
            if (!!this.vizdata) {
                this.setMarkers();
                if (!!this.vizdata.data.data.mapaddins.legend.display) {
                    this.setLegendFromTemplate();
                }
            }
        });
    }

    /**
     * define the legend for the map
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
        this.vizdata.data.data.pinpoints.forEach(item => {
            if (!(!!item.latitude) || !(!!item.longitude)) return;
            const marker = new google.maps.Marker({
                position: {lat: +item.latitude, lng: +item.longitude},
                map: this.map,
                animation: google.maps.Animation.DROP,
                icon: {
                    path: `M7.8,1.3L7.8,1.3C6-0.4,3.1-0.4,1.3,1.3c-1.8,1.7-1.8,4.6-0.1,6.3c0,0,0,0,0.1,0.1l3.2,3.2l3.2-3.2C9.6,6,9.6,3.2,7.8,1.3`,
                    strokeColor: '#fff',
                    fillColor: '#' + item.colorLabel,
                    fillOpacity: 1,
                    scale: 2
                }
            });
            const infoWindow = new google.maps.InfoWindow({
                content: item.info
            });
            marker.addListener('click', () => {
                infoWindow.open(this.map, marker);
            });
        });
    }
}
