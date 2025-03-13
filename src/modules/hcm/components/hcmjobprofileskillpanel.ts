import {ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {ObjectRelatedList} from "../../../objectcomponents/components/objectrelatedlist";
import {configurationService} from "../../../services/configuration.service";
import {Subscription} from "rxjs";
import {backend} from "../../../services/backend.service";
import {broadcast} from "../../../services/broadcast.service";

declare var _: any;

@Component({
    selector: 'hcm-jobprofile-skill-panel',
    templateUrl : '../templates/hcmjobprofileskillpanel.html',
    providers: [relatedmodels]
})
export class HCMJobProfileSkillPanel extends ObjectRelatedList {

    /**
     * the id for the skills tree
     */
    public treeid: string;

    /**
     * holds the computed tree nodes from the skills tree
     */
    public treeNodes: any[] = [];

    /**
     * holds all subscriptions for the component
     *
     * @private
     */
    private subscriptions: Subscription = new Subscription();

    constructor(
        public language: language,
        public metadata: metadata,
        public relatedmodels: relatedmodels,
        public model: model,
        public cdref: ChangeDetectorRef,
        public config: configurationService,
        public backend: backend,
        public broadcast: broadcast
    ) {
        super(language, metadata, relatedmodels, model, cdref)
    }

    public ngOnInit() {

        super.ngOnInit();

        // get the categories
        let categories = this.config.getData('categories');

        // first try to determine by module
        let moduleDefs = this.metadata.getModuleDefs('HCMSkills');

        if(moduleDefs.categorytrees){
            let r = moduleDefs.categorytrees.find(t => t.module_field == 'hcmskilltypecategory');
            if(r) {
                this.treeid = r.syscategorytree_id;
            } else {
                return;
            }
        }

        if (this.treeid && (!categories || !categories[this.treeid])) {
            if (!categories) categories = {};
            // set this in any case so we don't load multiple times
            categories[this.treeid] = [];
            this.config.setData('categories', categories);

            // load all categories which are needed to display the choosen categories...
            this.backend.getRequest(`configuration/spiceui/core/categorytrees/${this.treeid}/categorytreenodes`).subscribe(
                (res: any) => {
                    categories[this.treeid] = res;
                    this.config.setData('categories', categories);
                    // set to laoded
                    this.loaded = true;
                    // emit that the tree has been loaded
                    this.broadcast.broadcastMessage('categories.loaded', this.treeid);
                }
            );
        } else {
            this.buildTreeNodes();
            this.loaded = true;
        }


        // subvscribe to the brioadcast when the categories are loaded
        this.subscriptions.add(
            this.broadcast.message$.subscribe( message => {
                if (message.messagetype === 'categories.loaded' && message.messagedata === this.treeid) {
                    this.buildTreeNodes();
                    this.cdref.detectChanges();
                }
            })
        )

    }


    /**
     * returns only the filtered treenodes where we also have a skill
     */
    get filteredTreenodes(){
        return this.treeNodes.filter(n => {
            switch(n.values.length){
                case 1:
                    return this.relatedmodels.items.filter(i => i.hcmskilltypecategory_id1 == n.values[0]).length > 0;
                    break;
                case 2:
                    return this.relatedmodels.items.filter(i => i.hcmskilltypecategory_id1 == n.values[0] && i.hcmskilltypecategory_id2 == n.values[1]).length > 0;
                    break;
                case 3:
                    return this.relatedmodels.items.filter(i => i.hcmskilltypecategory_id1 == n.values[0] && i.hcmskilltypecategory_id2 == n.values[1] && i.hcmskilltypecategory_id3 == n.values[2]).length > 0;
                    break;
                case 4:
                    return this.relatedmodels.items.filter(i => i.hcmskilltypecategory_id1 == n.values[0] && i.hcmskilltypecategory_id2 == n.values[1] && i.hcmskilltypecategory_id3 == n.values[2] && i.hcmskilltypecategory_id4 == n.values[3]).length > 0;
                    break;
                default:
                    return false;
            }
        })
    }

    public isRequired(values){
        return this.relatedmodels.items.find(i => i.hcmskilltypecategory_id1 == values[0] && i.hcmskilltypecategory_id2 == (values[1] ?? '') && i.hcmskilltypecategory_id3 == (values[2] ?? '') && i.hcmskilltypecategory_id4 == (values[3] ?? ''))?.mandatory_skill;
    }

    public getScopeName(values){
        return this.relatedmodels.items.find(i => i.hcmskilltypecategory_id1 == values[0] && i.hcmskilltypecategory_id2 == (values[1] ?? '') && i.hcmskilltypecategory_id3 == (values[2] ?? '') && i.hcmskilltypecategory_id4 == (values[3] ?? ''))?.hcmjobprofilescope_name;
    }

    private buildTreeNodes(){
        let categories = this.config.getData('categories');
        let rawNodes = categories[this.treeid];
        this.buildTreeNodesForParent(rawNodes, '');
    }

    /**
     * a recursive function that builds the multi level skills tree
     * @param rawNodes
     * @param parentId
     * @param values
     * @private
     */
    private buildTreeNodesForParent(rawNodes: any[], parentId: string, values: number[] = []){
        let thisSubNodes = rawNodes.filter(r => r.parent_id == parentId);
        thisSubNodes.forEach(r => {
            let newNode = {...r};
            r.level = values.length;
            r.values = values.concat([r.node_key])
            this.treeNodes.push(r);
            this.buildTreeNodesForParent(rawNodes, r.id, values.concat([r.node_key]));
        })
    }

}
