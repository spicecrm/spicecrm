/**
 * @module ObjectComponents
 */
import {
    Component,
    Input, OnInit, OnDestroy
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {activitiyTimeLineService} from '../../services/activitiytimeline.service';

@Component({
    selector: 'object-activitiytimeline',
    templateUrl: './src/objectcomponents/templates/objectactivitiytimeline.html',
    providers: [activitiyTimeLineService]
})
export class ObjectActivitiyTimeline implements OnInit, OnDestroy {

    @Input() private parentModule: string = '';
    @Input() private parentId: string = '';
    private componentconfig: any = {};

    public displayAddContainer: boolean = false;

    private displayaggregates = {
        Activities: false,
        History: false
    }

    constructor(private model: model, private language: language, private activitiyTimeLineService: activitiyTimeLineService, private activatedRoute: ActivatedRoute) {

    }

    /**
     * getter for the searchterm
     */
    get ftsSearchTerm() {
        return this.activitiyTimeLineService.filters.searchterm;
    }

    /**
     * setter for the searchterm. When entered will also start a reload
     *
     * @param searchterm the searchterm
     */
    set ftsSearchTerm(searchterm) {
        this.activitiyTimeLineService.filters.searchterm = searchterm;
        this.activitiyTimeLineService.reload();
    }

    public ngOnInit() {
        this.parentModule = this.model.module;
        this.parentId = this.model.id;

        this.activitiyTimeLineService.parent = this.model;

        if (!this.componentconfig.hideaddcontainer) {
            this.displayAddContainer = true;
        }

        if (this.componentconfig.usefts) this.activitiyTimeLineService.usefts = true;
        if (this.componentconfig.defaultentries) this.activitiyTimeLineService.defaultLimit = this.componentconfig.defaultentries;

    }

    public ngOnDestroy() {
        this.activitiyTimeLineService.stopSubscriptions();
    }

    public reload() {
        this.activitiyTimeLineService.getTimeLineData('Activities');
        this.activitiyTimeLineService.getTimeLineData('History');
    }

    public loadMore(module) {
        this.activitiyTimeLineService.getMoreTimeLineData(module, 5);
    }
}
