import {Component, Input, OnChanges} from '@angular/core';
import {administrationapiinspectorService} from "../services/administrationapiinspector.service";

/**
 * renders a table for the parameters
 */
@Component({
    selector: 'administration-api-inspector-method-parameters',
    templateUrl: './src/admincomponents/templates/administrationapiinspectormethodparameters.html'
})
export class AdministrationApiInspectorMethodParameters implements OnChanges {

    /**
     * the parameters
     *
     * @private
     */
    private parameters: any[];

    /**
     * the api method as input
     *
     * @private
     */
    @Input() private apimethod: any;

    /**
     * the path to filter by
     *
     * @private
     */
    @Input() private in: 'path' | 'query' | 'body';

    /**
     * if this is set the component will render inputs for the paramaters to allow the usage of this as part of the testing
     */
    @Input() public parameterCollector: any;

    constructor(
        private apiinspector: administrationapiinspectorService
    ) {
    }

    public ngOnChanges() {
        this.parameters = this.apiinspector.getMethodParameters(this.apimethod.route, this.apimethod.method, this.in);
    }

}
