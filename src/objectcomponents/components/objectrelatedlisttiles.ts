import {Component, AfterViewInit, OnInit, ViewChildren, QueryList} from '@angular/core';
import {relatedmodels} from '../../services/relatedmodels.service';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {Router} from '@angular/router';
import {ObjectRelatedlistHeader} from "./objectrelatedlistheader";

@Component({
    selector: 'object-relatedlist-tiles',
    templateUrl: './src/objectcomponents/templates/objectrelatedlisttiles.html',
    providers: [relatedmodels]
})
export class ObjectRelatedlistTiles implements OnInit, AfterViewInit {

    @ViewChildren(ObjectRelatedlistHeader) private listheaders: QueryList<ObjectRelatedlistHeader>;

    private activeTab: number = 0;
    private componentconfig: any = {};
    private displayitems: number = 5;
    private module: string = '';

    constructor(private language: language, private relatedmodels: relatedmodels, private model: model, private metadata: metadata, private router: Router) {
        this.relatedmodels.module = this.model.module
        this.relatedmodels.id = this.model.id;
    }

    get hidden() {
        return !this.checkModelState() || !this.aclAccess();
    }

    get isopen() {
        if (this.listheaders && !this.listheaders.first.isopen) {
            return false;
        }

        return this.relatedmodels.count > 0;
    }

    private checkModelState() {
        if (this.componentconfig.requiredmodelstate && !this.model.checkModelState(this.componentconfig.requiredmodelstate)) {
            return false;
        }

        // by default return true
        return true;
    }

    private aclAccess() {
        return this.metadata.checkModuleAcl(this.module, 'list');
    }

    private loadRelated() {
        this.relatedmodels.relatedModule = this.componentconfig.object;
        this.relatedmodels.getData();
    }

    public ngOnInit() {
        this.module = this.componentconfig.object;

        // set the name of the link if it is set
        if (this.componentconfig.link) {
            this.relatedmodels.linkName = this.componentconfig.link;
        }

        if (this.componentconfig.modulefilter) {
            this.relatedmodels.modulefilter = this.componentconfig.modulefilter;
        }
    }

    public ngAfterViewInit() {
        this.loadRelated();

    }

    private addSelectedItems(items) {
        this.relatedmodels.addItems(items);
    }

}