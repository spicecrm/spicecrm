/**
 * Created by christian on 08.11.2016.
 */
import { Component, Input, Output,EventEmitter} from '@angular/core';
import { Router, ActivatedRoute }   from '@angular/router';
import { modellist } from '../../services/modellist.service';
import { language } from '../../services/language.service';
import { metadata } from '../../services/metadata.service';
import { model } from '../../services/model.service';

@Component({
    selector: 'object-listview-header',
    templateUrl: './app/objectcomponents/templates/objectlistviewheader.html'
})
export class ObjectListViewHeader {
    @Input() parentconfig: any = [];
    @Output() headerevent = new EventEmitter<any>();
    actionSet: any = {};

    panelButtonState: string = '';
    constructor(private metadata: metadata, private activatedRoute: ActivatedRoute,  private router: Router, private modellist: modellist, private language: language, private model: model) {
        /*
        this.activatedRoute.params.subscribe(params => {
            this.moduleName = params['module'];
        });
        */

        this.modellist.listtype$.subscribe(list => {
            this.configChange();
        })

        let componentconfig = this.metadata.getComponentConfig('ObjectListViewHeader', this.model.module);
        this.actionSet = componentconfig.actionset;
    }

    moduleName: string = '';

    private configChange(){
        // in case filtering is not allowed .. hide the filterpanel
        if(this.panelButtonState === 'filter' && this.filterDisabled())
            this.panelButtonState = '';

        if(this.panelButtonState === 'aggregates' && this.aggregatesDisabled())
            this.panelButtonState = '';
    }

    goImport(){
        this.router.navigate(['/module/' + this.model.module + '/import']);
    }

    setPanelButton(state){
        if(this.panelButtonState === state)
            this.panelButtonState = '';
        else
            this.panelButtonState = state;

    }


    changeList(event){
        this.headerevent.emit({event: 'changelist', list:event});
    }

    getPanelButtonClass(state){
        if(state === this.panelButtonState)
            return 'slds-is-selected';
        else
            return '';
    }

    getFilterPanelStyle(){
        return {
            right: (this.panelButtonState === 'filter' ? '0px' : '-320px')
        }
    }

    getAggregatesPanelStyle(){
        return {
            right: (this.panelButtonState === 'aggregates' ? '0px' : '-320px')
        }
    }

    filterDisabled(){
        return !(this.modellist.filterEnabled());
    }

    aggregatesDisabled(){
        return !(this.modellist.aggregatesEnabled());
    }

    onKeyUp(_e) {
        // handle the key pressed
        switch (_e.keyCode)
        {
            case 27: // esc
                this.modellist.searchTerm = '';
            case 13: // enter
                this.modellist.reLoadList();
                break;

        }
    }
}