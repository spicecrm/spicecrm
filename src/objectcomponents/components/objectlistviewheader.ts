/**
 * @module ObjectComponents
 */
import {Component, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {modellist} from '../../services/modellist.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
    selector: 'object-listview-header',
    templateUrl: './src/objectcomponents/templates/objectlistviewheader.html',
    animations: [
        trigger('animatepanel', [
            transition(':enter', [
                style({right: '-320px', overflow: 'hidden'}),
                animate('.5s', style({right: '0px'})),
                style({overflow: 'unset'})
            ]),
            transition(':leave', [
                style({overflow: 'hidden'}),
                animate('.5s', style({right: '-320px'}))
            ])
        ])
    ]
})
export class ObjectListViewHeader implements OnDestroy {
    @Input() private parentconfig: any = [];
    private actionSet: any = {};
    private searchTimeOut: any;
    private panelButtonState: string = '';
    private listTypeSubscription: any;
    private moduleName: string = '';

    constructor(private metadata: metadata, private activatedRoute: ActivatedRoute, private router: Router, private modellist: modellist, private language: language, private model: model, private modal: modal) {
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
                this.modellist.reLoadList();
                break;
            default:
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.searchTimeOut = window.setTimeout(() => this.modellist.reLoadList(), 1000);
                break;
        }
    }

    /**
     *  a getter to get if the geo search is enabled or not
     */
    get geoDisabled() {
        if (this.model && this.model.module) {
            return !this.metadata.getModuleDefs(this.model.module).ftsgeo;
        } else {
            return true;
        }
    }

    /**
     * getter if the searhc geo is set
     */
    get geoSet() {
        return this.modellist.searchGeo ? true : false;
    }

    /**
     * opens the geo selector
     */
    private openGeo() {
        this.modal.openModal('SpiceMapSelector').subscribe(mapModal => {
            if (this.modellist.searchGeo) {
                mapModal.instance.lat = this.modellist.searchGeo.lat;
                mapModal.instance.lng = this.modellist.searchGeo.lng;
                mapModal.instance._radius = this.modellist.searchGeo.radius;
            }
            mapModal.instance.geoSearchemitter.subscribe(geodata => {
                if (!geodata) {
                    this.modellist.searchGeo = undefined;
                    this.modellist.reLoadList();
                } else {
                    this.modellist.searchGeo = {
                        radius: geodata.radius,
                        lat: geodata.lat,
                        lng: geodata.lng
                    };
                    this.modellist.reLoadList();
                }
            });
        });
    }

}
