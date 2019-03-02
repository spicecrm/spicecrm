/**
 * @module ObjectComponents
 */
import {
     Component, ViewChild, ViewContainerRef
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {activitiyTimeLineService} from '../../services/activitiytimeline.service';

/**
* @ignore
*/
declare var moment: any;

@Component({
    templateUrl: './src/objectcomponents/templates/objectactivitiytimelinesummary.html',
    providers: [activitiyTimeLineService, model]
})
export class ObjectActivitiyTimelineSummary {
    @ViewChild('listContainer', {read: ViewContainerRef}) private listContainer: ViewContainerRef;

    private componentRefs: any[] = [];

    private activitymodule: string;
    private activityid: string;
    private activitydata: any;

    constructor(private metadata: metadata, private parent: model, private language: language, private activitiyTimeLineService: activitiyTimeLineService, private activatedRoute: ActivatedRoute) {
        this.activatedRoute.params.subscribe(params => this.initialize(params));
    }

    get activities() {
        return this.activitiyTimeLineService.activities.History.list;
    }

    private initialize(params: any) {
        // get the bean details
        this.parent.module = params.module;
        this.parent.id = params.id;
        this.parent.getData(true, '', true);

        this.activitiyTimeLineService.parent = this.parent;
        this.activitiyTimeLineService.defaultLimit = 25;
        this.activitiyTimeLineService.modules = ['History'];
        this.activitiyTimeLineService.reload();
    }

    private onScroll(e) {
        let element = this.listContainer.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            if (this.activitiyTimeLineService.canLoadMore('History')) {
                this.activitiyTimeLineService.getMoreTimeLineData('History', 20);
            }
        }
    }

    private getDate(activity) {

        let dateField = 'date_start';
        switch (activity.module) {
            case 'Tasks':
                dateField = 'date_due';
                break;
            case 'Emails':
            case 'Notes':
                dateField = 'date_entered';
                break;
        }

        let date: Date = new moment(Date.parse(activity.data[dateField]));
        return date.format('DD.MM.YYYY');
    }

    private setActivitiy(activity) {
        this.activitymodule = activity.module;
        this.activityid = activity.id;
        this.activitydata = activity.data;
    }
}