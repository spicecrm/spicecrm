/**
 * @module AdminComponentsModule
 */
import {Injectable, Injector} from '@angular/core';
import {Subject, Observable, Subscription} from 'rxjs';

import {backend} from '../../services/backend.service';
import {classNames} from "@angular/cdk/schematics";
import {toast} from '../../services/toast.service';
import {modelutilities} from '../../services/modelutilities.service';
import {start} from "repl";


@Injectable()

export class administrationapiinspectorService {

    /**
     * indicates that we are loading
     *
     * @public
     */
    public loading: boolean = false;

    /**
     * holds all the endpoints
     *
     * @public
     */

    public apiEndpoints: any[] = [];

    /**
     * holds the endpoints after they are nested
     *
     * @public
     */
    public finalArray = {};

    /**
     * hold all items after they are flattend for the systemtree
     *
     * @public
     */
    public flattendArray = [];


    /**
     * the current selected API
     *
     * @public
     */
    public selectedAPI;

    constructor(
        public backend: backend,
        public toast: toast,
        public injector: Injector,
        private modelutilities: modelutilities
    ) {
    }

    /**
     * loads all available endpoints from the backend
     *
     * @public
     */
    public loadEndpoints() {
        this.loading = true;
        this.backend.getRequest('routes').subscribe(
            routes => {
                this.apiEndpoints = routes;
                this.apiEndpoints.sort((a, b) => a.route.replace('{','').localeCompare(b.route.replace('{','')));
                this.loading = false;
                this.parse();

            },
            err => {
                this.toast.sendToast('Error Loading Routes', 'error');
                this.loading = false;
            }
        );
    }

    /**
     * recursively goes through all endpoint entrys and nests them
     * @param segments
     * @param startArray
     * @param routeInfo
     * @param level
     * @param parentId
     */
    public populateArray(segments, startArray, routeInfo, level, parentId) {
        segments.forEach(segment => {
            if (startArray.hasOwnProperty(segment) === false) {
                startArray[segment] = {
                    id: this.modelutilities.generateGuid(),
                    parentId: parentId,
                    level: level,
                    methods:[],
                    subroutes: {},
                };
            }
            if (segments.length === 1) {
                // routeInfo = this.parseRoute(routeInfo);
                startArray[segment].methods.push(routeInfo);
            }
            segments.shift();
            this.populateArray(segments, startArray[segment].subroutes, routeInfo, level + 1, startArray[segment].id);

        });
    }

    /**
     * routeinfo überschreiben
     * flattens the methods for the systemtree
     * aufteilen der subobjects als eigenen eintrag im array
     */

    public parseRoute(routeInfo) {
        let subRoutes = [];
        for (const key in routeInfo) {

                subRoutes.push({
                    class: routeInfo[key].class,
                    description: routeInfo[key].description,
                    extension: routeInfo[key].extension,
                    function: routeInfo[key].function,
                    method: routeInfo[key].method,
                    options:  routeInfo[key].options,
                    parameters: routeInfo[key].parameters,
                    requestBody: routeInfo[key].requestBody,
                    responses: routeInfo[key].responses,
                    route: routeInfo[key].route,
                    summary: routeInfo[key].summary
                });

        }
        return subRoutes;
    }

    /**
     * apiEndrooints is a nested object first is the place in the object then comes the original object
     * edits the array for the tree view
     * @public
     */

    public parse() {
        this.apiEndpoints.forEach(routeInfo => {
            const segments = routeInfo.route.split("/");
            this.populateArray(segments.slice(1), this.finalArray, routeInfo, 0, null);
        });
        this.flattendArray = this.flatten(this.finalArray);
    }


    /**
     * flattens the object and converts it to an array for the sytemtree
     * @param data
     */

    public flatten(data, arr = []) {
        let i=0;
        for (const key in data) {
            arr.push({
                    id: data[key].id,
                    parent_id: data[key].parentId,
                    parent_sequence: i,
                    name: key,
                    clickable: true,
                    methods: data[key].methods,
                    extension: data[key].extension,
                    function: data[key].function
                });

            if (Object.keys(data[key]).length > 0) {
                this.flatten(data[key].subroutes, arr);
            }
            i++;
        }
        return arr;
    }
    
    /**
     * select the active API .. fired when the secltion in the tree changes
     *
     * @param selectedId
     * @private
     */
    public selectAPI(selectedId: string) {
        this.selectedAPI = this.flattendArray.find(a => a.id == selectedId);
    }

}

