/**
 * @module ModuleSalesDocs
 */
import {Component, Input, OnInit, SkipSelf} from "@angular/core";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";

/**
 * a modal in the context of a salesdoc to dsiplay the full docuiment flow on header and items level
 */
@Component({
    selector: 'salesdocs-flow-modal',
    templateUrl: "../templates/salesdocsflowmodal.html",
})
export class SalesDocsFlowModal implements OnInit {

    /**
     * referenec to self added from teh modal service
     * @private
     */
    public self: any;

    /**
     * an object with the successors per documentid
     *
     * @private
     */
    public successors: any = {};

    /**
     * the salesdocs that are in the flow mapped
     *
     * @private
     */
    public salesdocs: any = {};

    /**
     * the structure transpiled to an array with rows to be displayed in the table
     *
     * @private
     */
    public rows: any[] = [];

    /**
     * the fields to be displayed per the fieldset
     * @private
     */
    public fields: any[];

    constructor(public metadata: metadata, public model: model, public backend: backend) {
        let componentConfig = this.metadata.getComponentConfig('SalesDocsFlowModal', 'SalesDocs');
        this.fields = this.metadata.getFieldSetFields(componentConfig.fieldset);
    }

    /**
     * load the flow
     */
    public ngOnInit() {
        this.loadDocumentFlow();
    }

    /**
     * load th document flow from the backend
     *
     * @private
     */
    public loadDocumentFlow() {
        this.backend.getRequest(`module/SalesDocs/${this.model.id}/flow`).subscribe(res => {
            this.successors = res.successors;
            this.salesdocs = res.salesdocs;
            this.buildTable();
        });
    }

    /**
     * tries to find a document that has no successors and thus shopudkl be the starting point for the tree
     *
     * @private
     */
    public determineTopDoc() {
        for (let doc in this.salesdocs) {
            let docFound = false;
            for (let s in this.successors) {
                if (this.successors[s].indexOf(doc) >= 0) {
                    docFound = true;
                    break;
                }
            }
            if (!docFound) {
                return doc;
            }
        }
    }

    /**
     * transfors the successor objects to a table with the proper levels
     *
     * @private
     */
    public buildTable() {

        this.rows = [];
        let topDoc = this.determineTopDoc();
        this.rows.push({
            level: 1,
            model: this.salesdocs[topDoc]
        });
        this.addSuccessors(topDoc, 2);
    }

    /**
     * recursive function to add a successor
     *
     * @param id
     * @param level
     * @private
     */
    public addSuccessors(id, level) {
        for (let doc of this.getSalesDocSuccessors(id)) {
            this.rows.push({
                level: level,
                model: this.salesdocs[doc]
            });
            this.addSuccessors(doc, level + 1);
        }
    }

    /**
     * find and return the successors if there are any
     *
     * @param id
     * @private
     */
    public getSalesDocSuccessors(id?: string) {
        if (!id) id = this.model.id;

        return this.successors[id] ? this.successors[id] : [];
    }

    /**
     * close the modal
     * @private
     */
    public close() {
        this.self.destroy();
    }

}
