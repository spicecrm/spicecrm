/**
 * @module ModuleSpiceMap
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    IterableDiffer,
    IterableDiffers,
    OnInit
} from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from "../../../services/metadata.service";
import {modellist} from "../../../services/modellist.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {mapOptionsI, RecordI} from "../interfaces/spicemap.interfaces";

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
export class SpiceGoogleMapsList implements OnInit {

    /**
     * longitude field name to be used for markers position
     */
    public lngName: string = 'longitude';
    /**
     * latitude field name to be used for markers position
     */
    public latName: string = 'latitude';
    /**
     * map options will be passed to the spice google maps
     */
    protected mapOptions: mapOptionsI = {};
    /**
     * List of records to be displayed on the map as markers
     */
    protected records: RecordI[] = [];
    /**
     * name of this component for load component config on extended components
     */
    protected componentName: string = 'SpiceGoogleMapsList';
    /**
     * component config from metadata
     */
    public componentconfig: mapOptionsI;
    /**
     * differentiate the records array changes
     */
    private recordsDiffer: IterableDiffer<any>;

    constructor(
        public language: language,
        public modelList: modellist,
        public metadata: metadata,
        public iterableDiffers: IterableDiffers,
        public cdr: ChangeDetectorRef,
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
        this.initialize();
    }

    /**
     * check for any changes on the record
     */
    public ngDoCheck() {
        this.handleRecordChanges();
    }

    /**
     * set records from list data
     */
    public setRecords() {
        this.records = (!this.latName || !this.lngName) ? [] : this.modelList.listData.list
            .filter(item => !!item[this.latName] && !isNaN(item[this.latName]) && !!item[this.lngName] && !isNaN(item[this.lngName]))
            .map(item => ({
                id: item.id,
                module: this.modelList.module,
                title: '' + item.summary_text,
                lng: +item[this.lngName],
                lat: +item[this.latName]
            }));
        this.cdr.detectChanges();
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

        if (!this.componentconfig.hasOwnProperty('showMyLocation')) {
            this.componentconfig.showMyLocation = false;
        }
        if (!this.componentconfig.hasOwnProperty('showCluster')) {
            this.componentconfig.showCluster = true;
        }
        if (!this.componentconfig.hasOwnProperty('markerWithModelPopover')) {
            this.componentconfig.markerWithModelPopover = true;
        }
        if (!this.componentconfig.hasOwnProperty('defaultRadius') || isNaN(this.componentconfig.defaultRadius)) {
            this.componentconfig.defaultRadius = 10;
        }
        if (!this.componentconfig.directionTravelMode || ['DRIVING','WALKING','TRANSIT','BICYCLING'].indexOf(this.componentconfig.directionTravelMode) == -1) {
            this.componentconfig.directionTravelMode = 'DRIVING';
        }

        this.mapOptions = {...this.componentconfig};

        const moduleDefs = this.metadata.getModuleDefs(this.modelList.module);
        if (!!moduleDefs && !!moduleDefs.ftsgeo) {
            this.lngName = moduleDefs.ftsgeo.longitude_field;
            this.latName = moduleDefs.ftsgeo.latitude_field;
        }
    }

    /**
     * reset records on if changed
     */
    private handleRecordChanges() {
        if (this.recordsDiffer.diff(this.modelList.listData.list)) {
            this.setRecords();
        }
    }

    /**
     * set iterable differs on the loaded list records to reduce change detection trigger
     * load the list data
     */
    private initialize() {
        this.recordsDiffer = this.iterableDiffers.find([]).create(null);
        this.modelList.loadlimit = 20;
        this.modelList.getListData();
    }

    /**
     * load more records
     */
    private loadMore() {
        this.modelList.loadMoreList();
    }
}
