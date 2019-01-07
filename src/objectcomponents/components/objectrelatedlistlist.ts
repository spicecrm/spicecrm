import {Component, AfterViewInit, OnInit, OnDestroy} from "@angular/core";
import {relatedmodels} from "../../services/relatedmodels.service";
import {model} from "../../services/model.service";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";

@Component({
    selector: "object-relatedlist-list",
    templateUrl: "./src/objectcomponents/templates/objectrelatedlistlist.html",
    providers: [relatedmodels]
})
export class ObjectRelatedlistList implements OnInit, OnDestroy, AfterViewInit {
    public activeTab: number = 0;
    public componentconfig: any = {};
    public listfields: any[] = [];
    public fieldset: string = "";
    public editcomponentset: string = "";
    public module: string = "";

    constructor(
        public language: language,
        public metadata: metadata,
        public relatedmodels: relatedmodels,
        public model: model,
    ) {
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;
    }

    get isloading() {
        return this.relatedmodels.isloading;
    }

    get panelTitle() {

        if (!this.componentconfig.title) {
            this.componentconfig.title = this.language.getModuleName(this.componentconfig.object);
        }
        return this.componentconfig.title ? this.componentconfig.title : "";
    }

    get hidden() {
        return !this.checkModelState() || !this.aclAccess();
    }

    public checkModelState() {
        if (this.componentconfig.requiredmodelstate && !this.model.checkModelState(this.componentconfig.requiredmodelstate)) {
            return false;
        }

        // by default return true
        return true;
    }

    public aclAccess() {
        return this.metadata.checkModuleAcl(this.module, "list");
    }

    public loadRelated() {
        if(!this.aclAccess()) return;
        this.relatedmodels.relatedModule = this.componentconfig.object;
        this.relatedmodels.getData();
    }

    public ngOnInit() {
        this.fieldset = this.componentconfig.fieldset;
        this.listfields = this.metadata.getFieldSetFields(this.fieldset);
        this.module = this.componentconfig.object;
        if (this.componentconfig.link) {
            this.relatedmodels.linkName = this.componentconfig.link;
        }

        if (this.componentconfig.items) {
            this.relatedmodels.loaditems = this.componentconfig.items;
        }

        if (this.componentconfig.modulefilter) {
            this.relatedmodels.modulefilter = this.componentconfig.modulefilter;
        }

        /*
        if(this.componentconfig.editable) {
            this.editable = this.componentconfig.editable;
        }
        */

        if (this.componentconfig.editcomponentset) {
            this.editcomponentset = this.componentconfig.editcomponentset;
        }

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
}
