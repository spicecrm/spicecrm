/**
 * @module AdminComponentsModule
 */
import {Component, OnInit, OnDestroy} from '@angular/core';
import {administrationapiinspectorService} from "../services/administrationapiinspector.service";

@Component({
    selector: 'administration-api-inspector-details',
    templateUrl: './src/admincomponents/templates/administrationapiinspectordetails.html',
    providers:[administrationapiinspectorService]
})

export class AdministrationAPIInspectorDetails {

    /**
     * reference to the modal self
     * @private
     */
    private self: any;

    /**
     * the reference to the endpoint we are displaying
     */
    public endpoint: any = {};

    private close() {
        this.self.destroy();
    }


}
