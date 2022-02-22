/**
 * @module ModuleAccounts
 */
import {Component, AfterViewInit, OnInit, OnDestroy, Input} from "@angular/core";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {accountHierarchy} from "../services/accounthierarchy.service";

/**
 * dsiplays a line int he node tree for the account hierarchy
 */
@Component({
    selector: "[account-hierarchy-node]",
    templateUrl: "../templates/accounthierarchynode.html",
    providers: [model, view],
    host: {
        "[attr.aria-level]": "nodedata.level"
    }
})
export class AccountHierarchyNode implements OnInit {
    /**
     * the data for the node that is rendered as model
     */
    @Input() public nodedata: any = {};

    /**
     * the fields to be displayed as per the config and fieldset
     */
    @Input() public fields: any[] = [];

    /**
     * indicator if loading
     */
    public loading: boolean = false;

    constructor(public view: view, public language: language, public metadata: metadata, public accountHierarchy: accountHierarchy, public model: model) {
        this.view.displayLabels = false;
    }

    public ngOnInit() {
        this.model.module = "Accounts";
        this.model.id = this.nodedata.id;
        this.model.setData(this.nodedata.data);
    }

    /**
     * expands/collapses a node and loads the data
     */
    public expandNode() {
        if (this.nodedata.expanded) {
            this.accountHierarchy.collapse(this.nodedata.id);
        } else {
            this.loading = true;
            this.accountHierarchy.expand(this.nodedata.id);
        }
    }

    /**
     * simple getter for the icons if openeded or closed
     */
    public getIcon() {
        switch (this.nodedata.expanded) {
            case false:
                return "chevronright";
            case true:
                return "chevrondown";
        }
    }
}
