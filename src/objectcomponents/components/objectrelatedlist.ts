/**
 * @module ObjectComponents
 */
import {Component, AfterViewInit, OnInit, OnDestroy, Input} from "@angular/core";
import {relatedmodels} from "../../services/relatedmodels.service";
import {model} from "../../services/model.service";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";


@Component({
    selector: "object-related-list",
    templateUrl: "./src/objectcomponents/templates/objectrelatedlist.html",
    providers: [relatedmodels]
})
export class ObjectRelatedList implements OnInit, OnDestroy, AfterViewInit {

    @Input() public componentconfig: any = {};
    private listfields: any[] = [];
    private fieldset: string = "";
    private editcomponentset: string = "";
    public module: string = "";

    constructor(
        public language: language,
        public metadata: metadata,
        public relatedmodels: relatedmodels,
        public model: model
    ) {
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;

        // pass in the model
        this.relatedmodels.model = this.model;
    }

    /**
     * check if we can list and also if the user has access to the link field
     * the link field can be disabled using the field control in the acl object
     * if the link field is turned off .. the acl access is not granted
     */
    get aclAccess() {
        let linkField = this.relatedmodels.linkName != "" ? this.relatedmodels.linkName : this.relatedmodels.relatedModule.toLowerCase();
        return this.metadata.checkModuleAcl(this.module, "list") && this.model.checkFieldAccess(linkField);
    }

    public loadRelated() {
        if (!this.aclAccess) return;

        this.relatedmodels.getData();
    }

    public ngOnInit() {
        this.fieldset = this.componentconfig.fieldset;
        this.listfields = this.metadata.getFieldSetFields(this.fieldset);
        this.module = this.componentconfig.object;
        this.relatedmodels.relatedModule = this.componentconfig.object;

        this.relatedmodels.isonlyfiltered = this.componentconfig.isonlyfiltered;

        if (this.componentconfig.link) this.relatedmodels.linkName = this.componentconfig.link;

        if (this.componentconfig.sequencefield) {
            this.relatedmodels.sequencefield = this.componentconfig.sequencefield;
        } else if (this.relatedmodels._linkName && this.model.fields[this.relatedmodels._linkName] && this.model.fields[this.relatedmodels._linkName].sequence_field) {
            this.relatedmodels.sequencefield = this.model.fields[this.relatedmodels._linkName].sequence_field;
        }

        if (this.componentconfig.items) this.relatedmodels.loaditems = this.componentconfig.items;

        if (this.componentconfig.modulefilter) this.relatedmodels.modulefilter = this.componentconfig.modulefilter;

        /*
        if(this.componentconfig.editable) {
            this.editable = this.componentconfig.editable;
        }
        */

        if (this.componentconfig.editcomponentset) this.editcomponentset = this.componentconfig.editcomponentset;

        if (this.componentconfig.sortfield) {
            this.relatedmodels.sort.sortfield = this.componentconfig.sortfield;
            this.relatedmodels.sort.sortdirection = this.componentconfig.sortdirection ? this.componentconfig.sortdirection : "ASC";
        }

    }

    get editable() {
        try {
            return this.componentconfig.editable && this.model.data.acl.edit;
        } catch (e) {
            return false;
        }
    }

    get hideactions() {
        return this.componentconfig.hideactions;
    }

    public ngAfterViewInit() {
        this.loadRelated();
    }

    public ngOnDestroy() {
        // need to stop all subscrptions on my service
        this.relatedmodels.stopSubscriptions();
    }

    public addSelectedItems(items) {
        this.relatedmodels.addItems(items);
    }

    /**
     * returns the listitemactionset if one is defined
     */
    get listitemactionset() {
        return this.componentconfig && this.componentconfig.listitemactionset ? this.componentconfig.listitemactionset : '';
    }
}
