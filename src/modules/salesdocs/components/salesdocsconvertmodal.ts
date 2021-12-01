/**
 * @module ModuleSalesDocs
 */
import {Component, OnInit, SkipSelf} from "@angular/core";
import {backend} from "../../../services/backend.service";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";

declare var _: any;

@Component({
    templateUrl: "../templates/salesdocsconvertmodal.html",
    providers: [model]
})
export class SalesDocsConvertModal {

    /**
     * referenec to self added from teh modal service
     * @private
     */
    public self: any;

    /**
     * the targetdata loaded from the backend that is supposed to be created as new salesdoc
     */
    public targetData: any;

    constructor(public model: model, @SkipSelf() public parent: model, public modal: modal, public backend: backend) {
    }

    public close() {
        this.self.destroy();
    }

    public convert() {
        this.model.module = 'SalesDocs';
        let newdata = {};
        for(let field in this.targetData.SalesDoc){
            if(!_.isEmpty(this.targetData.SalesDoc[field])){
                newdata[field] = this.targetData.SalesDoc[field];
            }
        }
        this.model.addModel(null, null, newdata);

        // add the items to the model
        this.model.data.salesdocitems = {
            beans: {}
        };

        let itemnr = 10;
        for (let salesdocitem of this.targetData.SalesDocItems) {
            if(salesdocitem._selected) {
                salesdocitem.id = this.model.utils.generateGuid();
                salesdocitem.itemnr = itemnr;
                this.model.data.salesdocitems.beans[salesdocitem.id] = {...salesdocitem};
                itemnr = itemnr + 10;
            }
        }

        this.close();
    }

}
