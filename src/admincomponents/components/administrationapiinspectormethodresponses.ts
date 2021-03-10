import {Component, Input, OnChanges} from '@angular/core';
import {administrationapiinspectorService} from "../services/administrationapiinspector.service";

/**
 * renders a table for the responses
 */
@Component({
    selector: 'administration-api-inspector-method-responses',
    templateUrl: './src/admincomponents/templates/administrationapiinspectormethodresponses.html'
})
export class AdministrationapiinspectorMethodResponses implements OnChanges {

    /**
     * the responses
     *
     * @private
     */
    private response: any[];

    /**
     * the api method as input
     *
     * @private
     */
    @Input() private apimethod: any;


    constructor(
        private apiinspector: administrationapiinspectorService
    ) {
    }

    public ngOnChanges() {
       this.response = this.apiinspector.getMethodResponses(this.apimethod.route,this.apimethod.method);
    }

}
