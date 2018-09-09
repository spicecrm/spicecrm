import {Component, AfterViewInit, OnInit, OnDestroy} from '@angular/core';
import {relatedmodels} from '../../services/relatedmodels.service';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-relatedlist-list',
    templateUrl: './src/objectcomponents/templates/objectrelatedlistlist.html',
    providers: [relatedmodels]
})
export class ObjectRelatedlistList implements OnInit, OnDestroy, AfterViewInit
{
    activeTab: number = 0;
    componentconfig: any = {};
    listfields: Array<any> = [];
    fieldset: string = '';
    editcomponentset: string = '';
    module: string = '';
    //editable: boolean = false;

    constructor(
        private language: language,
        private metadata: metadata,
        private relatedmodels: relatedmodels,
        private model: model,
    ) {
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id
    }

    get isloading(){
        return this.relatedmodels.isloading;
    }

    get panelTitle(){
        //try module name if no title available
        if(!this.componentconfig.title) this.componentconfig.title = this.language.getModuleName(this.componentconfig.object);
        return this.componentconfig.title ? this.componentconfig.title : '';
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
        this.fieldset = this.componentconfig.fieldset;
        this.listfields = this.metadata.getFieldSetFields(this.fieldset);
        this.module = this.componentconfig.object;
        if(this.componentconfig.link)
            this.relatedmodels.linkName = this.componentconfig.link;

        if(this.componentconfig.items)
            this.relatedmodels.loaditems = this.componentconfig.items;

        /*
        if(this.componentconfig.editable) {
            this.editable = this.componentconfig.editable;
        }
        */

        if(this.componentconfig.editcomponentset) {
            this.editcomponentset = this.componentconfig.editcomponentset;
        }

        if(this.componentconfig.sortfield){
            this.relatedmodels.sort.sortfield = this.componentconfig.sortfield;
            this.relatedmodels.sort.sortdirection = this.componentconfig.sortdirection ? this.componentconfig.sortdirection : 'ASC'
        }
    }

    get editable(){
        try {
            return this.componentconfig.editable && this.model.data.acl.edit;
        } catch(e){
            return false;
        }
    }

    ngAfterViewInit()
    {
        this.loadRelated();
    }

    ngOnDestroy(){
        // need to stop all subscrptions on my service
        this.relatedmodels.stopSubscriptions();
    }

    addSelectedItems(items){
        this.relatedmodels.addItems(items);
    }
}