/**
 * @module ModuleScrum
 */
import {Component, ViewChild, ViewContainerRef, OnDestroy, ViewChildren, QueryList} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {layout} from '../../../services/layout.service';
import {modellist} from '../../../services/modellist.service';

@Component({
    selector: 'scrum-main',
    templateUrl: './src/modules/scrum/templates/scrummain.html',
})
export class ScrumMain implements OnDestroy {

    /**
     * the element reference for the content of the view
     */
    @ViewChild('tablecontent', {read: ViewContainerRef, static: true}) private tablecontent: ViewContainerRef;

    /**
     * the subscription to the modellist
     */
    private modellistsubscribe: any = undefined;

    /**
     * the componentconfig
     */
    public componentconfig: any = {};


    /**
     * returns if the listservic eis loading
     */
    get isloading() {
        return this.modellist.isLoading;
    }

    constructor(private router: Router, private metadata: metadata, private modellist: modellist, private language: language, private layout: layout) {

        // get the confih
        this.componentconfig = this.metadata.getComponentConfig('ObjectList', this.modellist.module);

        // set the limit for the loading
        this.modellist.loadlimit = 50;

        // load the list and initialize from sesson data if this is set
        // this.loadList(true);

        // subscribe to changes of the listtype
        // this.modellistsubscribe = this.modellist.listtype$.subscribe(newType => this.switchListtype());
    }

    /**
     * unsubscribe from the modellist subscription
     */
    public ngOnDestroy() {
        this.modellistsubscribe.unsubscribe();
    }
}

