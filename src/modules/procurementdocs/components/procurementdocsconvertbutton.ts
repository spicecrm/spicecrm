/**
 * @module ModuleProcurementDocs
 */
import {Component, Injector, OnDestroy} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {configurationService} from "../../../services/configuration.service";
import {Subscription} from "rxjs";

declare var _: any;

@Component({
    selector: 'procurement-docs-convert-button',
    templateUrl: "../templates/procurementdocsconvertbutton.html"
})
export class ProcurementDocsConvertButton implements OnDestroy {

    /**
     * the state of the button
     */
    public disabled: boolean = true;

    /**
     * component subscriptions
     */
    public subscriptions: Subscription = new Subscription();

    constructor(public metadata: metadata,
                public model: model,
                public modal: modal,
                public configuration: configurationService,
                public injector: Injector) {

        this.subscriptions.add(
            this.model.data$.subscribe(data => {
                this.determineState();
            })
        );
    }

    /**
     * unsubscribe from any still open subscription
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * determine the state of the button on model changes
     */
    public determineState(): void {
        // check that user can create a procurementdoc
        if (!this.metadata.checkModuleAcl('ProcurementDocs', 'create')) {
            this.disabled = true;
            return;
        }

        // check that we can copy from teh procurementdoc type
        // flow is defined
        let flowData = this.configuration.getData('procurementdoctypesflow');
        if(!flowData?.find(f => f.from == this.model.getFieldValue('procurementdoctype'))){
            this.disabled = true;
            return;
        }

        // otherwise, we are good to go
        this.disabled = false;
    }

    /**
     * execute when the button is clicked
     */
    public execute() {

        this.modal.openModal('ProcurementDocsConvertSelectType', true, this.injector);
    }

}
