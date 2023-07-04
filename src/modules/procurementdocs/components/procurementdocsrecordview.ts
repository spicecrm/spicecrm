/**
 * @module ModuleProcurementDocs
 */
import {Component} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";
import {model} from "../../../services/model.service";
import {configurationService} from "../../../services/configuration.service";
import {procurementdocrecord} from "../services/procurementdocrecord";

/**
 * a specific recordview for the ProcurementDocs
 */
@Component({
    selector: 'procurement-docs-record-view',
    templateUrl: '../templates/procurementdocsrecordview.html',
    providers: [procurementdocrecord]
})
export class ProcurementDocsRecordView {

    public initialized: boolean = false;

    /**
     * the rendered doc type
     */
    public _procurementdoctype: string;

    /**
     * the componentset to render above the items
     */
    public headerComponentset: string = '';

    /**
     * teh compopnentset to render below the items
     */
    public footerComponentset: string = '';

    /**
     * the componentset to render the items
     */
    public itemsComponentset: string = '';


    constructor(public metadata: metadata, public language: language, public view: view, public model: model, public configuration: configurationService, public procurementdocrecord: procurementdocrecord) {
        this.model.data$.subscribe(recordData => {
            let docType = this.model.getField('procurementdoctype');
            if (docType && docType != this._procurementdoctype) {
                this.renderViewForDocType();
            } else if (!docType) {
                this.renderDefaultView();
            }
        });

        this.procurementdocrecord.procurementDoc = this.model;

    }


    /**
     * renders the view once receivede
     */
    public renderViewForDocType() {
        let docTypes = this.configuration.getData('procurementdoctypes');
        if (docTypes && docTypes.find(docType => docType.name == this.model.getField('procurementdoctype'))) {
            let docType = docTypes.find(docType => docType.name == this.model.getField('procurementdoctype'));
            this.headerComponentset = docType.headercomponentset;
            this.footerComponentset = docType.footercomponentset;
            this.itemsComponentset = docType.itemscomponentset;

            // check if displayOnly
            /*
            if(docType.displayonly == '1'){
                this.view.isEditable = false;
                this.model.acl.edit = false;
            }
             */
        }

        if (!this.headerComponentset || !this.footerComponentset || !this.itemsComponentset) {
            let defaultConfig = this.metadata.getComponentConfig('ProcurementDocsRecordView', 'ProcurementDocs');
            if (!this.headerComponentset) this.headerComponentset = defaultConfig.headercomponentset;
            if (!this.footerComponentset) this.footerComponentset = defaultConfig.footercomponentset;
            if (!this.itemsComponentset) this.itemsComponentset = defaultConfig.itemscomponentset;
        }
        this.initialized = true;
    }

    /**
     * renders a default view
     */
    public renderDefaultView() {
        let componentConf = this.metadata.getComponentConfig('ProcurementDocsRecordView', this.model.module);
        this.headerComponentset = componentConf.headercomponentset;
        this.footerComponentset = componentConf.footercomponentset;
        this.itemsComponentset = componentConf.itemscomponentset;
        this.initialized = true;
    }

}
