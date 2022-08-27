/**
 * @module ModuleOrgunits
 */
import {AfterViewInit, Component, ElementRef, Input, OnInit, SkipSelf, ViewChild} from '@angular/core';
import {orgunitsViewService} from "../services/orgunitsview.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";


/**
 * renders a view with an org chart based on the org units
 */
@Component({
    selector: 'orgunits-chart-view-box-add',
    templateUrl: '../templates/orgunitschartviewboxadd.html',
    providers: [model]
})
export class OrgunitsChartViewBoxAdd {

    constructor(public oview: orgunitsViewService, public backend: backend, public modal: modal, public model: model, @SkipSelf() public parent: model) {
    }

    public add(){
        this.modal.openModal('OrgunitsChartViewBoxAddOptions').subscribe(
            modalref => {
                modalref.instance.selection.subscribe({
                    next: (selection) => {
                        switch(selection){
                            case 'addorgunit':
                                this.model.module = 'OrgUnits';
                                this.model.initialize();
                                this.model.addModel(null, this.parent, {
                                    parent_id: this.parent.id,
                                    parent_name: this.parent.getField('name'),
                                    orgchart_id: this.oview.orgChart.id,
                                    orgchart_name: this.oview.orgChart.getField('name'),
                                }).subscribe({
                                    next: (data) => {
                                        this.oview.orgunits.push(data);
                                    }
                                });
                                break;
                            case 'addorgchart':
                                this.model.module = 'OrgCharts';
                                this.model.initialize();
                                this.model.addModel(null, this.parent, {
                                    parent_id: this.oview.orgChart.getField('parent_id'),
                                    parent_type: this.oview.orgChart.getField('parent_type'),
                                    parent_name: this.oview.orgChart.getField('parent_name'),
                                    orgchart_id: this.oview.orgChart.id,
                                    orgchart_name: this.oview.orgChart.getField('name'),
                                    orgunit_id: this.parent.id,
                                    orgunit_name: this.parent.getField('name')
                                }).subscribe({
                                    next: (data) => {
                                        this.oview.orgcharts.push(data);
                                    }
                                });
                                break;
                            case 'selectorgunit':
                                this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
                                    selectModal.instance.module = 'OrgUnits';
                                    selectModal.instance.multiselect = false;

                                    selectModal.instance.selectedItems.subscribe(items => {
                                        let awaitModal = this.modal.await('LBL_LOADING');
                                        this.backend.putRequest(`module/OrgCharts/${this.oview.orgChart.id}/orgunit/${this.parent.id}/${items[0].id}`).subscribe({
                                            next: (res) => {
                                                this.oview.loadOrgUnits().subscribe({
                                                    next: (loaded) => {
                                                        awaitModal.emit(true);
                                                    },
                                                    error: () => {
                                                        awaitModal.emit(true);
                                                    }
                                                });
                                            },
                                            error: () => {
                                                awaitModal.emit(true);
                                            }
                                        })
                                    });
                                });
                                break;
                            case 'selectorgchart':
                                this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
                                    selectModal.instance.module = 'OrgCharts';
                                    selectModal.instance.multiselect = false;

                                    selectModal.instance.selectedItems.subscribe(items => {
                                        // this.addSelectedItems(items);
                                    });
                                });
                                break;
                        }
                    }
                })
            }
        )
    }
}
