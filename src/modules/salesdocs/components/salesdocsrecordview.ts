/**
 * @module ModuleSalesDocs
 */
import {
    Component
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";
import {model} from "../../../services/model.service";
import {configurationService} from "../../../services/configuration.service";
import {salesdocrecord} from "../services/salesdocrecord";

/**
 * a specific recordview for the SalesDocs
 */
@Component({
    selector: 'salesdocs-record-view',
    templateUrl: '../templates/salesdocsrecordview.html',
    providers: [salesdocrecord]
})
export class SalesDocsRecordView {

    public initialized: boolean = false;

    /**
     * the rendered doc type
     */
    public _salesdoctype: string;

    /**
     * the componentset to render above the items
     */
    public headerComponentset: string = '';

    /**
     * teh compopnentset to render below the items
     */
    public footerComponentset: string = '';

    constructor(public metadata: metadata, public language: language, public view: view, public model: model, public configuration: configurationService, public salesdocrecord: salesdocrecord) {
        this.model.data$.subscribe(recordData => {
            let docType = this.model.getField('salesdoctype');
            if (docType && docType != this._salesdoctype) {
                this.renderViewForDocType();
            } else if (!docType) {
                this.renderDefaultView();
            }
        });

        this.salesdocrecord.salesDoc = this.model;

    }


    /**
     * renders the view once receivede
     */
    public renderViewForDocType() {
        let docTypes = this.configuration.getData('salesdoctypes');
        if (docTypes && docTypes.find(docType => docType.name == this.model.getField('salesdoctype'))) {
            let docType = docTypes.find(docType => docType.name == this.model.getField('salesdoctype'));
            this.headerComponentset = docType.headercomponentset;
            this.footerComponentset = docType.footercomponentset;

            // check if displayOnly
            /*
            if(docType.displayonly == '1'){
                this.view.isEditable = false;
                this.model.acl.edit = false;
            }
             */
        }

        if (!this.headerComponentset || !this.footerComponentset) {
            let defaultConfig = this.metadata.getComponentConfig('SalesDocsRecordView', 'SalesDocs');
            if (!this.headerComponentset) this.headerComponentset = defaultConfig.headercomponentset;
            if (!this.footerComponentset) this.footerComponentset = defaultConfig.footercomponentset;
        }
        this.initialized = true;
    }

    /**
     * renders a default view
     */
    public renderDefaultView() {
        let componentConf = this.metadata.getComponentConfig('SalesDocsRecordView', this.model.module);
        this.headerComponentset = componentConf.headercomponentset;
        this.footerComponentset = componentConf.footercomponentset;
        this.initialized = true;
    }

}
