/**
 * @module ModuleScrum
 */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {modellist} from '../../../services/modellist.service';
import {model} from "../../../services/model.service";
import {scrum} from "../services/scrum.service";

@Component({
    selector: 'scrum-main',
    templateUrl: './src/modules/scrum/templates/scrummain.html',
    providers: [scrum]
})
export class ScrumMain implements OnInit, OnDestroy {

    private modellistsubscribe: any = {};

    private focus: string = null;

    constructor(private scrum: scrum, private metadata: metadata, private modellist: modellist, private model: model) {
        this.modellistsubscribe = this.modellist.listtype$.subscribe(newType => this.loadList());
        this.loadList();
    }

    public ngOnInit(): void {
        this.scrum.currentid.subscribe(selectedObjID => this.focus = selectedObjID);
    }

    private loadList() {
        this.focus = null;
        // this.modellist.setSortField('sequence', 'ASC', false);
        this.modellist.getListData();
    }

    private selectComponent(id) {
        this.focus = id;
    }
    public ngOnDestroy() {
        this.modellistsubscribe.unsubscribe();
    }
}

