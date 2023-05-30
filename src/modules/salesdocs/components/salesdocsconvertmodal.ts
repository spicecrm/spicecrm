/**
 * @module ModuleSalesDocs
 */
import {Component, OnInit, Optional, SkipSelf} from "@angular/core";
import {backend} from "../../../services/backend.service";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {navigation} from "../../../services/navigation.service";
import {navigationtab} from "../../../services/navigationtab.service";

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

    constructor(public model: model, @SkipSelf() public parent: model, public modal: modal, public backend: backend, public navigation: navigation, @Optional() public navigationtab: navigationtab,) {
    }

    public close() {
        this.self.destroy();
    }

    public convert() {
        this.model.module = 'SalesDocs';
        this.model.id = this.model.utils.generateGuid();
        this.model.initialize();

        let newdata = {};
        for(let field in this.targetData.SalesDoc){
            if(!_.isEmpty(this.targetData.SalesDoc[field])){
                newdata[field] = this.targetData.SalesDoc[field];
            }
        }

        // this.model.addModel(null, null, newdata);
        this.model.setFields(newdata);

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

        // build the tab url
        let taburl = `module/${this.model.module}/new/${this.model.id}`;
        if(this.navigationtab) taburl = `tab/${this.navigationtab.tabid}/${taburl}`;

        // open a new tab
        this.navigation.addObjectTab({
            path: (this.navigationtab ? 'tab/:tabid/' : '') + 'module/:module/new/:id',
            parentid: this.navigationtab?.tabid,
            params: {module: this.model.module, id: this.model.id, tabid: this.navigationtab?.tabid},
            id: this.model.utils.generateGuid(),
            active: true,
            pinned: false,
            enablesubtabs: false,
            url: taburl,
            tabdata: {
                module: this.model.module,
                id: this.model.id,
                data: this.model.data
            }
        })

        this.close();
    }

}
