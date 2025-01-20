/**
 * @module ModuleSalesDocs
 */
import {Component, OnInit, SkipSelf, Injector} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";

/**
 * renders a modal window to select the type to convert a salesdocument to
 * this is defined in the syssalesdoctypesflow
 */
@Component({
    templateUrl: "../templates/salesdocsconvertselecttype.html",
})
export class SalesDocsConvertSelectType {

    /**
     * reference to self added from teh modal service
     * @private
     */
    public self: any;

    /**
     * the available target types
     * @private
     */
    public targetTypes: any[] = [];

    public selectedType: string;

    constructor(
        public metadata: metadata,
        public model: model,
        public modal: modal,
        public configuration: configurationService,
        public backend: backend,
        public injector: Injector
    ) {
        this.determineTargets();
    }

    /**
     * loads teh target types from the flow
     * @private
     */
    public determineTargets() {
        let types = this.configuration.getData('salesdoctypes');
        let flows = this.configuration.getData('salesdoctypesflow');
        for (let target of flows.filter(f => f.from == this.model.getFieldValue('salesdoctype'))) {
            let type = types.find(t => t.name == target.to);
            if(type.aclaction && !this.metadata.checkModuleAcl('SalesDocs', type.aclaction)) continue;
            this.targetTypes.push({
                type: target.to,
                label: type ? type.vname : target.to
            });
        }

        // set the first as selectd
        this.selectedType = this.targetTypes[0].type;
    }

    /**
     * closes the modal
     *
     * @private
     */
    public close() {
        this.self.destroy();
    }

    /**
     * converts the salesdoc
     *
     * @private
     */
    public convert() {
        let loadmodal = this.modal.await('loading');
        this.backend.getRequest(`module/SalesDocs/${this.model.id}/convert/${this.selectedType}`).subscribe(
            targetData => {
                loadmodal.emit(true);
                this.modal.openModal('SalesDocsConvertModal', true, this.injector).subscribe(modalref => {
                    modalref.instance.targetData = targetData;
                });
                this.close();
            },
            err => {
                loadmodal.emit(true);
            });
    }

}
