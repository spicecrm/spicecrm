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
     * the tree array as required for the system tree
     *
     * [
     *   {
     *     id: string,
     *     parent_id: string,
     *     parent_sequence: number,
     *     name: string,
     *     clickable: boolean
     *   }
     * ]
     */
    public apiTree: any[] = [];

    /**
     * holds the methods for the selected API node in the tree
     */
    public apiMethods: any[] = [];

    /**
     * a filter string to search by
     */
    public _apiFilter: string;

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
        this.loadEndpoints();
    }

    /**
     * getter for the current api filter
     */
    get apiFilter() {
        return this._apiFilter;
    }

    /**
     * setter for the current api filter
     * also resets the selection and also the complete tree
     *
     * @param value
     */
    set apiFilter(value) {
        this._apiFilter = value;

        // reset the methods
        this.apiMethods = [];

        // rebuild the tree with the searchterm
        this.buildTree();
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
                this.apiEndpoints.sort((a, b) => a.route.replace('{', '').localeCompare(b.route.replace('{', '')));

                this.buildTree();

                this.loading = false;
                // this.parse();

            },
            err => {
                this.toast.sendToast('Error Loading Routes', 'error');
                this.loading = false;
            }
        );
    }

    /**
     * builds the tree and applies a filter if required
     * @private
     */
    private buildTree() {
        // reset the api tree
        this.apiTree = [];
        // indicate that we are loading
        this.loading = true;
        // if applicable filter and process the tree
        for (let apiendpoint of this.apiEndpoints.filter(a => !this._apiFilter || (this.apiFilter && a.route.toLowerCase().indexOf(this._apiFilter.toLowerCase()) >= 0))) {
            if (!apiendpoint.route) continue;

            if (!this.apiTree.find(a => a.route == apiendpoint.route)) {
                this.addRouteToTree(apiendpoint.route);
            }
        }
        this.loading = false;
    }

    /**
     * adds a route item to the tree and returns the id of the new generated item
     *
     * @param route
     * @private
     */
    private addRouteToTree(route) {
        let parentID = this.getPartentId(route);
        let itemId = this.getRouteId(route);

        this.apiTree.push({
            id: itemId,
            name: route != '/' ? route.split('/').pop() : route,
            route: route,
            parent_id: parentID,
            parent_sequence: this.apiTree.filter(a => a.parent_id == parentID).length,
            clickable: true
        });
        return itemId;
    }

    /**
     * tries to find a praten id recursively. If no parent record is found
     * @param route
     * @private
     */
    private getPartentId(route: string) {
        // spöits the route in pieces
        let routeItems = route.substring(1).split('/');

        // removes the last entry in the item to get the parent route
        routeItems.pop();

        // checks that we have a parent record .. otherwise we are at the top
        if (routeItems.length == 0) return undefined;

        // join the parent route again
        let parentRoute = '/' + routeItems.join('/');

        // try to find the parent in the tree if not add it add
        let parentItem = this.apiTree.find(a => a.route == parentRoute);
        if (parentItem) {
            return parentItem.id;
        } else {
            return this.addRouteToTree(parentRoute);
        }
    }

    /**
     * checks if an item in the tree array exists for the route .. if not returns a new id otherwise the id of the reocrd
     *
     * @param route
     * @private
     */
    private getRouteId(route) {
        return this.apiTree.find(a => a.route == route) ? this.apiTree.find(a => a.route == route).id : this.modelutilities.generateGuid();
    }

    /**
     * select the active API .. fired when the secltion in the tree changes
     *
     * @param selectedId
     * @private
     */
    public selectAPI(selectedId: string) {
        this.apiMethods = this.apiEndpoints.filter(e => e.route == this.apiTree.find(t => t.id == selectedId).route);
    }

    /**
     * returns the methods for a route
     *
     * @param route
     * @param method
     */
    public getMethodParameters(route: string, method: string, source: 'path'|'query'|'body') {
        let parameters =[];
        let apiEndpoint: any = this.apiEndpoints.find(e => e.route == route && e.method == method);

        if(!apiEndpoint.parameters) return [];

        for(let paramName in apiEndpoint.parameters){
            let param = {...apiEndpoint.parameters[paramName]};

            // only if the in matches
            if(param.in != source) continue;

            // add thename and add to the params array
            param.name = paramName;
            parameters.push(param);
        }

        // return a sorted array
        return parameters.sort((a, b) => a.name.localeCompare(b.name));
    }

}

