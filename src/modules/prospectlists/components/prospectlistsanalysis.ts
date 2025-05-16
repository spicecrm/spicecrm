import {Component, OnInit, SkipSelf} from '@angular/core';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {Router} from "@angular/router";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: 'prospect-lists-analysis',
    templateUrl: '../templates/prospectlistsanalysis.html'
})

export class ProspectListsAnalysis implements OnInit{

    /**
     * the component config
     *
     * @private
     */
    public componentconfig: any = {};

    /**
     * an indicator that we are loading
     */
    public isLoading:boolean = false;

    /**
     * the loaded results
     */
    public results: {related_type: string, num: number}[] = [];

    constructor(
        public model: model,
        public language: language
    ) {
    }

    get canRefresh(){
        return this.componentconfig.enablereload;
    }

    /**
     * get the prospect list entries count
     */
    public ngOnInit() {
        this.loadData();
    }

    public loadData(){
        this.isLoading = true;
        this.results = [];
        this.model.backend.getRequest(`module/ProspectLists/${this.model.id}/count`, {detailed: true}).subscribe({
            next: (results) => {
                this.results = results;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

}