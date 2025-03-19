import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {navigation} from "../../../services/navigation.service";
import {broadcast} from "../../../services/broadcast.service";
import {configurationService} from "../../../services/configuration.service";
import {backend} from "../../../services/backend.service";
import {Subscription} from "rxjs";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";

declare var _: any;

@Component({
    selector: 'hcm-skill-manager',
    templateUrl : '../templates/hcmskillmanager.html'
})

export class HCMSkillManager implements OnInit, OnDestroy{

    /**
     * reference to the modal
     */
    public self: any;

    /**
     * the id for the skills tree
     */
    public treeid: string;

    /**
     * indicates that the skills are loaded
     */
    public loaded: boolean = false;

    /**
     * holds all subscriptions for the component
     *
     * @private
     */
    private subscriptions: Subscription = new Subscription();

    /**
     * holds the computed tree nodes from the skills tree
     */
    public treeNodes: any[] = [];

    /**
     * the scopes
     */
    public hcmProfileScopes: any[] = [];

    constructor(
        public metadata: metadata,
        public changeDetectorRef: ChangeDetectorRef,
        public model: model,
        public relatedmodels: relatedmodels,
        public navigation: navigation,
        public broadcast: broadcast,
        public config: configurationService,
        public backend: backend,
        public modal: modal,
        public toast: toast
    ) {

    }

    public ngOnInit() {

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
                    this.changeDetectorRef.detectChanges();
                }
            })
        )

    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private buildTreeNodes(){
        let categories = this.config.getData('categories');
        let rawNodes = JSON.parse(JSON.stringify( categories[this.treeid]));
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
            r.required = this.isRequired(r.values);
            r.hcmjobprofilescope_id = this.getScopeID(r.values);
            r.skill_id = this.getSkillID(r.values);
            this.treeNodes.push(r);
            this.buildTreeNodesForParent(rawNodes, r.id, values.concat([r.node_key]));
        })
    }


    public isRequired(values){
        let skill = this.relatedmodels.items.find(i => i.hcmskilltypecategory_id1 == values[0] && i.hcmskilltypecategory_id2 == (values[1] ?? '') && i.hcmskilltypecategory_id3 == (values[2] ?? '') && i.hcmskilltypecategory_id4 == (values[3] ?? ''));
        return skill ? ( skill.mandatory_skill ? 'required' : 'optional') : undefined
    }

    public getScopeID(values){
        return this.relatedmodels.items.find(i => i.hcmskilltypecategory_id1 == values[0] && i.hcmskilltypecategory_id2 == (values[1] ?? '') && i.hcmskilltypecategory_id3 == (values[2] ?? '') && i.hcmskilltypecategory_id4 == (values[3] ?? ''))?.hcmjobprofilescope_id;
    }

    public getSkillID(values){
        return this.relatedmodels.items.find(i => i.hcmskilltypecategory_id1 == values[0] && i.hcmskilltypecategory_id2 == (values[1] ?? '') && i.hcmskilltypecategory_id3 == (values[2] ?? '') && i.hcmskilltypecategory_id4 == (values[3] ?? ''))?.id;
    }

    public close(){
        this.self.destroy();
    }

    get nodesToSave() {
        return this.treeNodes.filter(n => !!n.required || n.skill_id).map(n => {
            let skill: any = {};
            skill.id = n.skill_id;
            skill.hcmskilltypecategory_id1 = n.values[0];
            skill.hcmskilltypecategory_id2 = n.values[1];
            skill.hcmskilltypecategory_id3 = n.values[2];
            skill.hcmskilltypecategory_id4 = n.values[3];
            skill.required = n.required;
            skill.hcmjobprofilescope_id = n.hcmjobprofilescope_id;
            return skill;
        });
    }

    public save(){
        let saving = this.modal.await('LBL_SAVING');
        let nodes = this.nodesToSave;
        if(nodes.length > 0) {
            this.backend.postRequest(`module/HCMSkills/forhcmjobprofile/${this.model.id}`, {}, {skills: nodes}).subscribe({
                next: (res) => {
                    saving.emit(true);
                    this.relatedmodels.getData();
                    this.self.destroy();
                },
                error: () => {
                    this.toast.sendToast('LBL_ERROR_SAVING', 'error');
                    saving.emit(true);
                }
            })
        } else {
            this.self.destroy();
        }
    }

}
