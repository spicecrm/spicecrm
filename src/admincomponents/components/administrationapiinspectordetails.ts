/**
 * @module AdminComponentsModule
 */
import {Component, OnInit} from '@angular/core';


@Component({
    templateUrl: './src/admincomponents/templates/administrationapiinspectordetails.html'
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
