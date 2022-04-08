/**
 * @module AdminComponentsModule
 */
import {Component, OnInit, OnDestroy} from '@angular/core';
import {administrationapiinspectorService} from "../services/administrationapiinspector.service";

@Component({
    selector: 'administration-api-inspector-details',
    templateUrl: '../templates/administrationapiinspectordetails.html',
    providers:[administrationapiinspectorService]
})

export class AdministrationAPIInspectorDetails {

    /**
     * reference to the modal self
     * @private
     */
    public self: any;

    /**
     * the reference to the endpoint we are displaying
     */
    public endpoint: any = {};

    public close() {
        this.self.destroy();
    }


}
