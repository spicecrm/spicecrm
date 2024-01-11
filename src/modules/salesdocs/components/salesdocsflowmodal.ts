/**
 * @module ModuleSalesDocs
 */
import {Component, Input, OnDestroy, OnInit, SkipSelf} from "@angular/core";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

/**
 * a modal in the context of a salesdoc to dsiplay the full docuiment flow on header and items level
 */
@Component({
    selector: 'salesdocs-flow-modal',
    templateUrl: "../templates/salesdocsflowmodal.html",
})
export class SalesDocsFlowModal implements OnInit, OnDestroy {

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
     * an object with the successors per documentid
     *
     * @private
     */
    public itemsuccessors: any = {};

    /**
     * the salesdocs that are in the flow mapped
     *
     * @private
     */
    public salesdocitems: any = {};

    /**
     * the structure transpiled to an array with rows to be displayed in the table
     *
     * @private
     */
    public rows: any[] = [];

    /**
     * the structure transpiled to an array with rows to be displayed in the table
     *
     * @private
     */
    public itemrows: any[] = [];

    /**
     * the fields to be displayed per the fieldset
     * @private
     */
    public fields: any[];

    /**
     * the fields to be displayed per the fieldset for the itemized view
     *
     * @private
     */
    public itemfields: any[];

    /**
     * indicates that we are loading the flow
     */
    public loading: boolean = true;

    public _itemid: string;

    /**
     * holds the subscriptions
     */
    public subscriptions: Subscription = new Subscription();

    constructor(public metadata: metadata, public model: model, public backend: backend, public router: Router) {
        let componentConfig = this.metadata.getComponentConfig('SalesDocsFlowModal', 'SalesDocs');
        this.fields = this.metadata.getFieldSetFields(componentConfig.fieldset);
        this.itemfields = this.metadata.getFieldSetFields(componentConfig.itemfieldset);
    }

    /**
     * load the flow
     */
    public ngOnInit() {
        this.loadDocumentFlow();

        this.subscriptions.add(
            this.router.events.subscribe({
                next: (e) => {
                    this.close();
                }
            })
        )
    }

    /**
     * kill the subscrioptions on Destroy
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * getter for the item numbers
     */
    get items(){
        return  this.model.data.salesdocitems?.beans ? Object.values(this.model.data.salesdocitems.beans).map((i: any) => {
            return {
                id: i.id,
                itemnr:i.itemnr
            };
        }) : [];
    }

    /**
     * getter for the itemid
     */
    get itemid(){
        return this._itemid;
    }

    /**
     * setter for the item id that also trigghers the reload
     *
     * @param id
     */
    set itemid(id){
        this._itemid = id;
        if(this._itemid) {
            this.loadDocumentItemsFlow();
        }
    }

    /**
     * load th document flow from the backend
     *
     * @private
     */
    public loadDocumentFlow() {
        this.loading = true;
        this.backend.getRequest(`module/SalesDocs/${this.model.id}/flow`).subscribe({
            next: (res) => {
                this.successors = res.successors;
                this.salesdocs = res.salesdocs;
                this.buildTable();
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    /**
     * load th document flow from the backend
     *
     * @private
     */
    public loadDocumentItemsFlow() {
        this.loading = true;
        this.backend.getRequest(`module/SalesDocs/${this.model.id}/flow/${this._itemid}`).subscribe({
            next: (res) => {
                this.itemsuccessors = res.successors;
                this.salesdocitems = res.salesdocitems;
                this.buildItemsTable()
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    /**
     * tries to find all documents that have no successors and thus shopudkl be the starting points for the tree
     *
     * @private
     */
    public determineTopDocs(): any[] {
        let docs = [];
        for (let doc in this.salesdocs) {
            if(!this.isSucessor(doc)) docs.push(doc);
        }
        return docs;
    }

    /**
     * checks if the doc with the given id is successor of any other doc
     * @param doc
     * @private
     */
    private isSucessor(doc){
        let docFound = false;
        for (let s in this.successors) {
            if (this.successors[s].indexOf(doc) >= 0) {
                docFound = true;
                break;
            }
        }

        return docFound;
    }

    /**
     * transfors the successor objects to a table with the proper levels
     *
     * @private
     */
    public buildTable() {
        this.rows = [];
        let topDocs = this.determineTopDocs();
        topDocs.forEach(topDoc => {
            this.rows.push({
                level: 1,
                model: this.salesdocs[topDoc]
            });
            this.addSuccessors(topDoc, 2);
        })
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
     * tries to find all documents that have no successors and thus shopudkl be the starting points for the tree
     *
     * @private
     */
    public determineTopItems(): any[] {
        let items = [];
        for (let item in this.salesdocitems) {
            if(!this.isSucessorItem(item)) items.push(item);
        }
        return items;
    }

    /**
     * checks if the item with the given id is successor of any other item
     *
     * @param doc
     * @private
     */
    private isSucessorItem(item){
        let itemFound = false;
        for (let s in this.itemsuccessors) {
            if (this.itemsuccessors[s].indexOf(item) >= 0) {
                itemFound = true;
                break;
            }
        }

        return itemFound;
    }

    /**
     * transfors the successor objects to a table with the proper levels
     *
     * @private
     */
    public buildItemsTable() {
        this.itemrows = [];
        let topItems = this.determineTopItems();
        topItems.forEach(topItem => {
            this.itemrows.push({
                level: 1,
                model: this.salesdocitems[topItem]
            });
            this.addItemSuccessors(topItem, 2);
        })
    }


    /**
     * recursive function to add a successor
     *
     * @param id
     * @param level
     * @private
     */
    public addItemSuccessors(id, level) {
        for (let item of this.getSalesDocItemSuccessors(id)) {
            this.itemrows.push({
                level: level,
                model: this.salesdocitems[item]
            });
            this.addSuccessors(item, level + 1);
        }
    }

    /**
     * find and return the successors if there are any
     *
     * @param id
     * @private
     */
    public getSalesDocItemSuccessors(id?: string) {
        if (!id) id = this.model.id;

        return this.itemsuccessors[id] ? this.itemsuccessors[id] : [];
    }


    /**
     * close the modal
     * @private
     */
    public close() {
        this.self.destroy();
    }

}
