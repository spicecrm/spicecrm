/**
 * @module ModuleProcurementDocs
 */
import {Component, OnInit, SkipSelf} from "@angular/core";
import {backend} from "../../../services/backend.service";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";

declare var _: any;

@Component({
    selector: 'procurement-docs-convert-modal',
    templateUrl: "../templates/procurementdocsconvertmodal.html",
    providers: [model]
})
export class ProcurementDocsConvertModal {

    /**
     * referenec to self added from teh modal service
     * @private
     */
    public self: any;

    /**
     * the targetdata loaded from the backend that is supposed to be created as new procurementdoc
     */
    public targetData: any;

    constructor(public model: model, @SkipSelf() public parent: model, public modal: modal, public backend: backend) {
    }

    public close() {
        this.self.destroy();
    }

    public convert() {
        this.model.module = 'ProcurementDocs';
        let newdata = {};
        for(let field in this.targetData.ProcurementDoc){
            if(!_.isEmpty(this.targetData.ProcurementDoc[field])){
                newdata[field] = this.targetData.ProcurementDoc[field];
            }
        }
        this.model.addModel(null, null, newdata);

        // add the items to the model
        this.model.data.procurementdocitems = {
            beans: {}
        };

        let itemnr = 10;
        for (let procurementdocitem of this.targetData.ProcurementDocItems) {
            if(procurementdocitem._selected) {
                procurementdocitem.id = this.model.utils.generateGuid();
                procurementdocitem.itemnr = itemnr;
                this.model.data.procurementdocitems.beans[procurementdocitem.id] = {...procurementdocitem};
                itemnr = itemnr + 10;
            }
        }

        this.close();
    }

}
