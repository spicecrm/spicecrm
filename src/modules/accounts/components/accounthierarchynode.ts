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
    templateUrl: "./src/modules/accounts/templates/accounthierarchynode.html",
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
    private loading: boolean = false;

    constructor(private view: view, private language: language, private metadata: metadata, private accountHierarchy: accountHierarchy, private model: model) {
        this.view.displayLabels = false;
    }

    public ngOnInit() {
        this.model.module = "Accounts";
        this.model.id = this.nodedata.id;
        this.model.data.summary_text = this.nodedata.summary_text;

        // copy fields
        for (let field of this.fields) {
            this.model.data[field.field] = this.nodedata.data[field.field];
        }

        // copy acl
        this.model.data.acl = this.nodedata.data.acl;
    }

    /**
     * expands/collapses a node and loads the data
     */
    private expandNode() {
        if (this.nodedata.expanded) {
            this.accountHierarchy.collapse(this.nodedata.id);
        } else {
            this.loading = true;
            this.accountHierarchy.expand(this.nodedata.id);
        }
    }

    /**
     * simple getter for the icosn if openeded or closed
     */
    private getIcon() {
        switch (this.nodedata.expanded) {
            case false:
                return "chevronright";
            case true:
                return "chevrondown";
        }
    }
}