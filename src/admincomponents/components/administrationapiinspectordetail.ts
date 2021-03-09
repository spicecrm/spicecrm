import {Component, OnChanges, Injector,Input, SimpleChanges} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {modal} from '../../services/modal.service';
import {classNames} from "@angular/cdk/schematics";
import {administrationapiinspectorService} from "../services/administrationapiinspector.service";


@Component({
    selector: 'administration-api-inspector-detail',
    templateUrl: './src/admincomponents/templates/administrationapiinspectordetail.html',
    providers: [administrationapiinspectorService]
})

export class AdministrationApiInspectorDetail implements OnChanges {

    /**
     * reference to the modal self
     * @private
     */
    private self: any;
    @Input() public detailSource: any;
    public sanitizedSource: any = [];


    /**
     * the reference to the endpoint we are displaying
     */

    constructor(
        private toast: toast,
        private modal: modal,
        private injector: Injector,
        private apiinspector: administrationapiinspectorService
    ) {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        console.log(typeof(this.detailSource),this.detailSource);
    }


}
