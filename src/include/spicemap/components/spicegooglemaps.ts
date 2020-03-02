/**
 * @module ModuleReportsMore
 */
import {AfterViewInit, Component, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {libloader} from '../../../services/libloader.service';

/**
 * @ignore
 */
declare var google: any;

@Component({
    selector: 'spice-google-maps',
    templateUrl: './src/include/spicemap/templates/spicegooglemaps.html'
})
export class SpiceGoogleMaps implements AfterViewInit {

    @ViewChild('mapContainer', {read: ViewContainerRef, static: false}) private mapContainer: ViewContainerRef;
    private map: any = {};

    constructor(
        private language: language,
        private model: model,
        private libLoader: libloader
    ) {}

    /**
     * @return isApiLoaded: boolean
     */
    get isApiLoaded(): boolean {
        return (window as any).google && (window as any).google.maps;
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
        this.map = new google.maps.Map(this.mapContainer.element.nativeElement, {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8
        });
    }
}
