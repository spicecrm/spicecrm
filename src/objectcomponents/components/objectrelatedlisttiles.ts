import {Component, AfterViewInit, OnInit} from '@angular/core';
import {relatedmodels} from '../../services/relatedmodels.service';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {Router}   from '@angular/router';

@Component({
    selector: 'object-relatedlist-tiles',
    templateUrl: './src/objectcomponents/templates/objectrelatedlisttiles.html',
    providers: [relatedmodels]
})
export class ObjectRelatedlistTiles implements OnInit, AfterViewInit {
    activeTab: number = 0;
    componentconfig: any = {};
    displayitems: number = 5;
    module: string = '';

    constructor(private language: language, private relatedmodels: relatedmodels, private model: model, private metadata: metadata, private router: Router) {
        this.relatedmodels.module = this.model.module
        this.relatedmodels.id = this.model.id
    }

    get hidden(){
        return !this.checkModelState() || !this.aclAccess();
    }

    checkModelState(){
        if(this.componentconfig.requiredmodelstate && !this.model.checkModelState(this.componentconfig.requiredmodelstate)){
            return false;
        }

        // by default return true
        return true;
    }

    aclAccess(){
        return this.metadata.checkModuleAcl(this.module, 'list');
    }

    loadRelated() {
        this.relatedmodels.relatedModule = this.componentconfig.object;
        this.relatedmodels.getData();
    }

    ngOnInit() {
        this.module = this.componentconfig.object;

        // set the name of the link if it is set
        if(this.componentconfig.link)
            this.relatedmodels.linkName = this.componentconfig.link;
    }

    ngAfterViewInit() {
        this.loadRelated();

    }

    addSelectedItems(items) {
        this.relatedmodels.addItems(items);
    }

}