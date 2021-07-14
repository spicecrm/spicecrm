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
 * @module AdminComponentsModule
 */
import {Injectable, Injector} from '@angular/core';
import {Subject, Observable, Subscription} from 'rxjs';

import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {modelutilities} from '../../services/modelutilities.service';

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
     * the selected API
     *
     * @private
     */
    public selectedApi: any;

    /**
     * holds the methods for the selected API node in the tree
     */
    public apiMethods: any[] = [];

    /**
     * indicates that also all submehtods of a given route are displayed
     *
     * @private
     */
    private _apiSubMethods: boolean = true;

    /**
     * a filter string to search by
     */
    private _apiFilter: string;

    /**
     * filter variable for all unauthorized routes
     */

    private _apiFilterUnauthorized: boolean = false;

    /**
     * filter variable for all admin only routes
     */

    private _apiFilterAdminOnly: boolean = false;

    /**
     * filter variable for all admin only routes
     */

    private _apiFilterValidatedOnly: boolean = false;

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

        // rebuild the tree with the searchterm
        this.buildTree();
    }

    /**
     * getter for the current api filter
     */
    get apiFilterUnauthorized() {
        return this._apiFilterUnauthorized;
    }

    /**
     * setter for the current api filter
     * also resets the selection and also the complete tree
     *
     * @param value
     */
    set apiFilterUnauthorized(value) {
        this._apiFilterUnauthorized = value;

        // can only be unauthorized or admin - mutually exclusive
        if(this._apiFilterUnauthorized) this._apiFilterAdminOnly = false;

        // rebuild the tree with the searchterm
        this.buildTree();
    }

    /**
     * getter for the current api filter
     */
    get apiFilterAdminOnly() {
        return this._apiFilterAdminOnly;
    }

    /**
     * setter for the current api filter
     * also resets the selection and also the complete tree
     *
     * @param value
     */
    set apiFilterAdminOnly(value) {
        this._apiFilterAdminOnly = value;

        // can only be unauthorized or admin - mutually exclusive
        if(this._apiFilterAdminOnly) this._apiFilterUnauthorized = false;

        // rebuild the tree with the searchterm
        this.buildTree();
    }

    /**
     * getter for the current api filter
     */
    get apiFilterValidatedOnly() {
        return this._apiFilterValidatedOnly;
    }

    /**
     * setter for the current api filter
     * also resets the selection and also the complete tree
     *
     * @param value
     */
    set apiFilterValidatedOnly(value) {
        this._apiFilterValidatedOnly = value;

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
        this.backend.getRequest('admin/routes').subscribe(
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
        // reset the methods
        this.apiMethods = [];
        // reset the api tree
        this.apiTree = [];
        // indicate that we are loading
        this.loading = true;
        // if applicable filter and process the tree
        for (let apiendpoint of this.apiEndpoints.filter(a => {
            // check for unauthorized in the options
            if (this._apiFilterUnauthorized  && a.options.noAuth !== true) {
                return false;
            }

            // check for adminonly
            if (this._apiFilterAdminOnly && a.options.adminOnly !== true) {
                return false;
            }

            // check for adminonly
            if (this._apiFilterValidatedOnly && a.options.validate === true) {
                return false;
            }

            // filter by searchterm
            return !this._apiFilter || a.route.toLowerCase().indexOf(this._apiFilter.toLowerCase()) >= 0;
        })) {
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
     * select the active API .. fired when the selection changes
     *
     * @param selectedId
     * @private
     */
    public selectAPI(selectedId: string) {
        this.selectedAPI = this.apiTree.find(t => t.id == selectedId);
        this.filterMethods();
    }

    /**
     * getter for the sleect submethods
     */
    get apiSubMethods() {
        return this._apiSubMethods;
    }

    /**
     * setter for the selectSubmethods that also refilters the methods
     *
     * @param value
     */
    set apiSubMethods(value) {
        this._apiSubMethods = value;
        this.filterMethods();
    }

    /**
     * filters the methods for the selected Endpoint
     * respects if all submethods shoudl be set or not
     *
     * @private
     */
    private filterMethods() {
        this.apiMethods = this.apiEndpoints.filter(e => this._apiSubMethods ? e.route.indexOf(this.selectedAPI.route) == 0 : e.route == this.selectedAPI.route);
    }

    /**
     * returns the methods for a route
     *
     * @param route
     * @param method
     */
    public getMethodParameters(route: string, method: string, source: 'path' | 'query' | 'body') {
        let parameters = [];
        let apiEndpoint: any = this.apiEndpoints.find(e => e.route == route && e.method == method);

        if (!apiEndpoint.parameters) return [];

        for (let paramName in apiEndpoint.parameters) {
            let param = {...apiEndpoint.parameters[paramName]};

            // only if the in matches
            if (param.in != source) continue;

            // add thename and add to the params array
            param.name = paramName;
            parameters.push(param);
        }

        // return a sorted array
        return parameters.sort((a, b) => a.name.localeCompare(b.name));
    }

    /**
     * returns the response for a route
     * @param route
     * @param method
     */
    public getMethodResponses(route: string, method: string) {
        let responses = [];
        let apiEndpoint: any = this.apiEndpoints.find(e => e.route == route && e.method == method);

        if (!apiEndpoint.responses) return [];

        for (let ResName in apiEndpoint.responses) {
            let res = {...apiEndpoint.responses[ResName]};

            // add thename and add to the params array
            res.name = ResName;
            responses.push(res);
        }
        return responses.sort((a, b) => a.name.localeCompare(b.name));
    }

    /**
     * returns the body requests for a route
     * @param route
     * @param method
     * @param type
     */
    public getMethodRequests(route: string, method: string, type: 'any' | 'bigInt' | 'boolean' | 'number' | 'null' | 'object' | 'string' | 'undefined') {
        let requests = [];
        let apiEndpoint: any = this.apiEndpoints.find(e => e.route == route && e.method == method);

        if (!apiEndpoint.requestBody) return [];

        for (let ReqName in apiEndpoint.requestBody) {
            let request = {...apiEndpoint.requestBody[ReqName]};


        }
        return requests.sort((a, b) => a.name.localeCompare(b.name));
    }



    /**
     * sets a fixed with for the method badge and a color for the type of method
     *
     * @param method
     * @private
     */
    public getMethodStyle(method) {

        let color = 'inherit';

        switch (method) {
            case 'get':
                color = '#05628a';
                break;
            case 'post':
                color = '#f38303';
                break;
            case 'put':
                color = '#41b658';
                break;
            case 'delete':
                color = '#d83a00';
                break;
        }

        return {
            width: '100px',
            color: '#ffffff',
            background: color
        };
    }

}

