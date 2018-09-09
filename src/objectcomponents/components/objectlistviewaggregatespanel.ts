import {
    Component, ElementRef
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';

@Component({
    selector: 'object-listview-aggregates-panel',
    templateUrl: './app/objectcomponents/templates/objectlistviewaggregatespanel.html'
})
export class ObjectListViewAggregatesPanel
{

    constructor(
        private elementRef: ElementRef,
        private language: language,
        private metadata: metadata,
        private modellist: modellist,
    ) {

    }

    getPanelStyle() {
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100vh - ' + rect.top + 'px)'
        }
    }

    getAggregates()
    {
        let aggArray = [];
        for (let aggregate in this.modellist.searchAggregates) {
            if (this.modellist.searchAggregates.hasOwnProperty(aggregate)) {
                aggArray.push(this.modellist.searchAggregates[aggregate]);
            }
        }

        return aggArray;
    }

    clearAggregates(){
        this.modellist.removeAllAggregates();
    }
}