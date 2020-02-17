/**
 * @module ModuleScrum
 */
import {Component, OnDestroy} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {modellist} from '../../../services/modellist.service';
import {model} from "../../../services/model.service";

@Component({
    selector: 'scrum-main',
    templateUrl: './src/modules/scrum/templates/scrummain.html',
})
export class ScrumMain implements OnDestroy {

    /**
     * the element reference for the content of the view
     */

    private modellistsubscribe: any = {};

    private focus: string = null;

    constructor(private metadata: metadata, private modellist: modellist, private model: model) {

        this.modellistsubscribe = this.modellist.listtype$.subscribe(newType => this.loadList());

        this.loadList();

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

