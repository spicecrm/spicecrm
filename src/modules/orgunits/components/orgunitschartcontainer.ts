/**
 * @module ModuleOrgunits
 */
import {
    Component,
    OnInit,
    SkipSelf
} from '@angular/core';
import {model} from '../../../services/model.service';
import {relatedmodels} from "../../../services/relatedmodels.service";
import {metadata} from "../../../services/metadata.service";

/**
 * renders a container for related org charts
 */
@Component({
    selector: 'orgunits-chart-container',
    templateUrl: '../templates/orgunitschartcontainer.html',
    providers: [model, relatedmodels],
    standalone: false
})
export class OrgunitsChartContainer implements OnInit {


    constructor(
        public metadata: metadata,
        @SkipSelf() public parent: model,
        public model: model,
        public relatedmodels: relatedmodels
    ) {
    }

    public ngOnInit() {
        // set the model
        this.model.module = 'OrgCharts';

        // set the parent data
        this.relatedmodels.module = this.parent.module;
        this.relatedmodels.id = this.parent.id;
        this.relatedmodels.model = this.parent;
        this.relatedmodels.loaditems = -99;

        // set the related data
        this.relatedmodels.relatedModule = this.model.module;

        // load the org charts
        this.getOrgCharts();
    }

    private getOrgCharts(){
        this.relatedmodels.getData().subscribe({
            // select the first item
            next: () => {
                if(this.relatedmodels.items.length == 1) this.orgChartId = this.relatedmodels.items[0].id;
            }
        })
    }

    get orgChartId(){
        return this.model.id;
    }

    set orgChartId(id){
        if(id) {
            let modelData = this.relatedmodels.items.find(r => r.i == id);
            this.model.id = id;
            this.model.initialize();
            this.model.setData(modelData);
        } else {
            this.model.id = undefined;
        }
    }

    get canAdd(){
        return this.metadata.checkModuleAcl(this.model.module, 'create');
    }

    public addOrgChart(){
        this.model.id = undefined;
        this.model.initializeModel();
        this.model.addModel(undefined, this.parent).subscribe({
            next: (added) => {
                this.getOrgCharts();
            }
        })
    }

}
