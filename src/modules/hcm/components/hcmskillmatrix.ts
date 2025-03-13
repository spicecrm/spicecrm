import {ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {modellist} from "../../../services/modellist.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {navigation} from "../../../services/navigation.service";
import {broadcast} from "../../../services/broadcast.service";
import {configurationService} from "../../../services/configuration.service";
import {backend} from "../../../services/backend.service";
import {Subscription} from "rxjs";

declare var _: any;

@Component({
    selector: 'hcm-skill-matrix',
    templateUrl : '../templates/hcmskillmatrix.html'
})

export class HCMSkillMatrix implements OnInit, OnDestroy{

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
     * holds the skills per employee as set in the system
     */
    public employeeSkills: any = {};

    /**
     * the sort fields
     */
    public sortfields: any[] = [];

    /**
     * the number of records displayed
     */
    public displayedRecords = 5;

    /**
     * the index of the first record
     */
    public firstRecord = 0;

    constructor(
        public modellist: modellist,
        public metadata: metadata,
        public changeDetectorRef: ChangeDetectorRef,
        public model: model,
        public navigation: navigation,
        public broadcast: broadcast,
        public config: configurationService,
        public backend: backend
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

        // get the skills
        this.buildSkills();

        // get the sort fields
        this.loadSortFields();

        // subvscribe to the brioadcast when the categories are loaded
        this.subscriptions.add(
            this.broadcast.message$.subscribe( message => {
                if (message.messagetype === 'categories.loaded' && message.messagedata === this.treeid) {
                    this.buildTreeNodes();
                    this.changeDetectorRef.detectChanges();
                }
            })
        )

        /**
         * add a subscription if the listdata changes
         */
        this.subscriptions.add(
            this.modellist.listDataChanged$.subscribe({
                next:() => {
                    this.buildSkills();
                }
            })
        )
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private buildTreeNodes(){
        let categories = this.config.getData('categories');
        let rawNodes = categories[this.treeid];
        this.buildTreeNodesForParent(rawNodes, '');
    }

    get displayRecords(){
        return this.modellist.listData.list.slice(this.firstRecord, this.firstRecord + this.displayedRecords);
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

    /**
     * a function to load and build the skills for the employees in focus
     *
     * @private
     */
    private buildSkills(preserve = false){

        let employeeIds = []; this.displayRecords.map(e => e.id);
        if(preserve){
            employeeIds = this.displayRecords.filter(r => !this.employeeSkills[r.id]).map(e => e.id);
        } else {
            employeeIds = this.displayRecords.map(e => e.id);
            this.employeeSkills = {};
        }

        if(employeeIds.length > 0) {
            this.backend.postRequest('module/HCMSkills/foremployees/byIDs', [], {employeeIds}).subscribe({
                next: (s) => {
                    for(let employee in s){
                        this.employeeSkills[employee] = s[employee];
                    }
                }
            })
        }
    }

    /**
     * checks an individual skills vs the loaded skills for an employee
     *
     * @param employeeId
     * @param skill
     */
    public checkSkill(employeeId:string, skill: string[]){
        return !!this.employeeSkills[employeeId]?.find(r => r.hcmskilltypecategory_id1 == skill[0] && r.hcmskilltypecategory_id2 == skill[1] && r.hcmskilltypecategory_id3 == skill[2] && r.hcmskilltypecategory_id4 == skill[3]);
    }

    /**
     * loads the sortfields from the fts configuration
     * @private
     */
    public loadSortFields() {
        let moduleDefs = this.metadata.getModuleDefs(this.modellist.module);
        if(moduleDefs.ftssortable){
            this.sortfields = moduleDefs.ftssortable.map(field => field.field);
        }
    }

    /**
     * getter for the sortfield
     */
    get sortField() {
        return !_.isEmpty(this.modellist.sortArray) ? this.modellist.sortArray[0].sortfield : 'select';
    }

    /**
     * sets the sortfield and pushes it to the sortArray of the modellist
     * @param field
     */
    set sortField(field: string) {
        !_.isEmpty(this.modellist.sortArray) ? this.modellist.sortArray[0].sortfield = field :
            this.modellist.sortArray.push({
                sortfield: field,
                sortdirection: this.sortDirection
            });
    }

    /**
     * getter for the sortdirection
     */
    get sortDirection() {
        return !_.isEmpty(this.modellist.sortArray) ? this.modellist.sortArray[0].sortdirection : 'ASC';
    }

    /**
     * setter for the sortdirection
     */
    set sortDirection(direction: string) {
        this.modellist.sortArray[0].sortdirection = direction;
    }

    public displayNext(){
        if(this.firstRecord + this.displayedRecords < this.modellist.listData.totalcount) {
            // check if we shoudl load more
            this.firstRecord++;
            if(this.firstRecord + this.displayedRecords > this.modellist.listData.list.length){
                this.modellist.loadMoreList();
            } else {
                this.buildSkills(true);
            }
        }
    }

    public displayPrevious() {
        if(this.firstRecord > 0){
            this.firstRecord--;
            this.buildSkills(true);
        }
    }

}
