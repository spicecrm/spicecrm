import {Component, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {modellist} from '../../services/modellist.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';

@Component({
    selector: 'object-listview-header',
    templateUrl: './src/objectcomponents/templates/objectlistviewheader.html'
})
export class ObjectListViewHeader implements OnDestroy {
    @Input() private parentconfig: any = [];
    @Output() private headerevent = new EventEmitter<any>();
    private actionSet: any = {};
    private searchTimeOut: any;
    private panelButtonState: string = '';
    private listTypeSubscription: any;
    private moduleName: string = '';

    constructor(private metadata: metadata, private activatedRoute: ActivatedRoute, private router: Router, private modellist: modellist, private language: language, private model: model) {
        /*
        this.activatedRoute.params.subscribe(params => {
            this.moduleName = params['module'];
        });
        */

        this.listTypeSubscription = this.modellist.listtype$.subscribe(list => {
            this.configChange();
        })

        let componentconfig = this.metadata.getComponentConfig('ObjectListViewHeader', this.model.module);
        this.actionSet = componentconfig.actionset;
    }

    public ngOnDestroy(): void {
        this.listTypeSubscription.unsubscribe();
    }

    private configChange() {
        // in case filtering is not allowed .. hide the filterpanel
        if (this.panelButtonState === 'filter' && this.filterDisabled()) this.panelButtonState = '';

        if (this.panelButtonState === 'aggregates' && this.aggregatesDisabled()) this.panelButtonState = '';
    }


    private setPanelButton(state) {
        if (this.panelButtonState === state) {
            this.panelButtonState = '';
        } else {
            this.panelButtonState = state;
        }

    }


    private changeList(event) {
        this.headerevent.emit({event: 'changelist', list: event});
    }

    private getPanelButtonClass(state) {
        if (state === this.panelButtonState) {
            return 'slds-is-selected';
        } else {
            return '';
        }
    }

    private getFilterPanelStyle() {
        return {
            right: (this.panelButtonState === 'filter' ? '0px' : '-320px')
        };
    }

    private getAggregatesPanelStyle() {
        return {
            right: (this.panelButtonState === 'aggregates' ? '0px' : '-320px')
        };
    }

    private filterDisabled() {
        return !(this.modellist.filterEnabled());
    }

    private aggregatesDisabled() {
        return !(this.modellist.aggregatesEnabled());
    }

    private onKeyUp(_e) {
        // handle the key pressed
        switch (_e.key) {
            case 'Enter':
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);

                this.modellist.reLoadList()
                break;
            default:
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.searchTimeOut = window.setTimeout(() => this.modellist.reLoadList(), 1000);
                break;
        }
    }
}
