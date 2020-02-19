/**
 * @module ModuleScrum
 */
import {Component, OnDestroy} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {modellist} from '../../../services/modellist.service';
import {model} from "../../../services/model.service";
import {scrumtree} from "../services/scrum.service";

@Component({
    selector: 'scrum-main',
    templateUrl: './src/modules/scrum/templates/scrummain.html',
    providers: [scrumtree]
})
export class ScrumMain implements OnDestroy {

    /**
     * modellist service subscription instance
     */
    private modellistsubscribe: any = {};

    constructor(private scrum: scrumtree, private metadata: metadata, private modellist: modellist, private model: model) {
        // subscribe to modellist
        this.modellistsubscribe = this.modellist.listtype$.subscribe(newType => this.loadList());
        this.loadList();
    }

    /**
     * load the list data
     */
    private loadList() {
        // this.modellist.setSortField('sequence', 'ASC', false);
        this.modellist.getListData();
    }

    /**
     * unsubscribe from modellist service
     */
    public ngOnDestroy() {
        this.modellistsubscribe.unsubscribe();
    }
}

