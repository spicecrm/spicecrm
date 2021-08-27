import {AfterViewInit, Component, ViewChild, ViewContainerRef} from '@angular/core';
import {backend} from '../../services/backend.service';
import {libloader} from '../../services/libloader.service';
import {administrationapiinspectorService} from "../services/administrationapiinspector.service";

declare var js_beautify: any;

@Component({
    selector: 'administration-api-inspector-method-test',
    templateUrl: './src/admincomponents/templates/administrationapiinspectormethodtest.html'
})

export class AdministrationApiInspectorMethodTest implements AfterViewInit {

    /**
     * reference to the modal content
     *
     * @private
     */
    @ViewChild('modalcontent', {read: ViewContainerRef, static: true}) private modalcontent: ViewContainerRef;

    /**
     * reference to the table to calculate the height
     *
     * @private
     */
    @ViewChild('tabcontent', {read: ViewContainerRef, static: true}) private tabcontent: ViewContainerRef;

    /**
     * reference to the modal itself
     *
     * @private
     */
    private self: any;

    /**
     * the api endpoint as passed in fromt he test button
     */
    public apiMethod: any;

    /**
     * the active selected tab
     *
     * @private
     */
    private activetab: 'parameters' | 'request' | 'response' = 'parameters';

    /**
     * set to true when we are executing a test
     *
     * @private
     */
    private executing: boolean = false;

    /**
     * content for the tab to ensure proper scrolling
     * @private
     */
    private tabHeigth: number;

    /**
     * the response from the call
     *
     * @private
     */
    private response: any;

    /**
     * the parameter Collector passed to the paramaters component
     *
     * @private
     */
    private parameterCollector: any = {};

    constructor(
        private backend: backend,
        private libloader: libloader,
        private apiInspector: administrationapiinspectorService
    ) {
        this.libloader.loadLib('jsonbeautify');
    }

    /**
     * calculate the proper height for the table
     */
    public ngAfterViewInit() {
        let modalrect = this.modalcontent.element.nativeElement.getBoundingClientRect();
        let tabrect = this.tabcontent.element.nativeElement.getBoundingClientRect();
        this.tabHeigth = modalrect.height - tabrect.top + modalrect.top;
    }

    /**
     * returns the tab style for the proper height
     */
    get tabStyle() {
        return {
            height: this.tabHeigth + 'px'
        };
    }

    /**
     * executethe test with the defined parameters
     *
     * @private
     */
    private test() {
        this.executing = true;
        this.response = undefined;
        this.activetab = 'response';
        switch (this.apiMethod.method) {
            case 'get':
                this.backend.getRequest(this.buildRoute(), this.buildParams()).subscribe(
                    res => {
                        this.response = js_beautify(JSON.stringify(res));
                        this.executing = false;
                    },
                    err => {
                        this.response = js_beautify(JSON.stringify(err));
                    });
                break;
            case 'post':
                this.backend.postRequest(this.buildRoute(), this.buildParams(), this.buildBody()).subscribe(
                    res => {
                        this.response = js_beautify(JSON.stringify(res));
                        this.executing = false;
                    },
                    err => {
                        this.response = js_beautify(JSON.stringify(err));
                    });
                break;
        }
    }

    /**
     * ToDo: check that all path parameters and all otherwise required paramaters are in teh collector set
     *
     * @private
     */
    private checkParameters() {
        return true;
    }

    /**
     * parses the route and replaces all path parameters
     *
     * @private
     */
    private buildRoute() {
        let parsedRoute = this.apiMethod.route.substring(1);
        let pathParameters = this.apiInspector.getMethodParameters(this.apiMethod.route, this.apiMethod.method, 'path');
        for (let pathParameter of pathParameters) {
            parsedRoute = parsedRoute.replace(`{${pathParameter.name}}`, this.parameterCollector[pathParameter.name]);
        }
        return parsedRoute;
    }

    /**
     * buidls the body from teh parameters
     *
     * @private
     */
    private buildParams() {
        let params: any = {};
        let requestParameters = this.apiInspector.getMethodParameters(this.apiMethod.route, this.apiMethod.method, 'query');
        for (let requestParameter of requestParameters) {
            params[requestParameter.name] = this.parameterCollector[requestParameter.name];
        }
        return params;
    }

    /**
     * buidls the body from teh parameters
     *
     * @private
     */
    private buildBody() {
        let body: any = {};
        let bodyParameters = this.apiInspector.getMethodParameters(this.apiMethod.route, this.apiMethod.method, 'body');
        for (let bodyParameter of bodyParameters) {
            body[bodyParameter.name] = this.parameterCollector[bodyParameter.name];
        }
        return body;
    }

    private close() {
        this.self.destroy();
    }
}
