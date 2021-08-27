/**
 * @module ModuleProjects
 */
import {Injectable} from "@angular/core";
import {backend} from "../../../services/backend.service";
import {modelutilities} from "../../../services/modelutilities.service";

@Injectable()
export class projectwbsHierarchy {

    /**
     * the id of the project
     */
    public project_id: string = "";

    /**
     * the plain list of members
     */
    public members: any[] = [];

    /**
     * the list with the embedded project wbs elements structured by hirarchy
     */
    public membersList: any[] = [];

    /**
     * indicates that we are loading
     */
    public isloading: boolean = false;

    constructor(private backend: backend, private modelutilities: modelutilities) {
    }

    /**
     * loads thge hirearchy
     * @param project_id
     * @param expanded
     */
    public loadHierarchy(project_id = this.project_id, expanded = false) {

        // if we are in a loading process already dont load twice
        if(this.isloading) return;

        // set to loading
        this.isloading = true;

        // build the expended members list
        let membersExpanded: any[] = [];
        for (let member of this.members) {
            if (member.expanded) {
                membersExpanded.push(member.id);
            }
        }

        // reset members
        this.members = [];
        this.membersList = [];

        // get the WBS Elements

        this.backend.getRequest(`module/Projects/${project_id}/wbshierarchy`).subscribe(members => {
            for (let member of members) {
                this.members.push({
                    parent_id: member.parent_id,
                    id: member.id,
                    member_count: member.member_count,
                    expanded: membersExpanded.indexOf(member.id) >= 0 ? true : false,
                    summary_text: member.summary_text,
                    data: this.modelutilities.backendModel2spice("ProjectWBSs", member.data)
                });
            }

            this.members.sort((a, b) => {
                // no dates set
                if (a.data.date_start == "" && b.data.date_start == "") {
                    return a.data.name > b.data.name ? -1 : 1;
                }

                // second object does not have a date
                if (b.data.date_start == "") {
                    return -1;
                }

                // first objects does not have a date
                if (a.data.date_start == "") {
                    return 1;
                }

                // all have a date
                return a.data.date_start.isBefore(b.data.date_start) ? 1 : -1;
            });

            // rebuild the members list
            this.rebuildMembersList();

            // loading completed
            this.isloading = false;
        });
    }

    /**
     * expand a node
     *
     * @param id
     */
    public expand(id) {
        this.members.some(thisMember => {
            if (thisMember.id === id) {
                thisMember.expanded = true;
                return true;
            }
        });
        this.rebuildMembersList();
    }

    /**
     * collapse a node
     *
     * @param id
     */
    public collapse(id) {
        this.members.some(thisMember => {
            if (thisMember.id === id) {
                thisMember.expanded = false;

                return true;
            }
        });
        this.rebuildMembersList();
    }

    /**
     * rebuilds teh structured list from a flat list
     */
    public rebuildMembersList() {
        this.membersList = [];
        for (let member of this.members) {
            if (!member.parent_id) {
                this.membersList.push({
                    level: 1,
                    id: member.id,
                    parent_id: "",
                    member_count: parseInt(member.member_count, 10),
                    summary_text: member.summary_text,
                    data: member.data,
                    expanded: member.expanded
                });

                if (member.expanded) {
                    this.buildMembersList(member.id, 1);
                }
            }
        }
    }

    /**
     * recursive function to build the panel tree
     *
     * @param parent_id
     * @param level
     */
    public buildMembersList(parent_id, level = 0) {
        for (let member of this.members) {
            if (member.parent_id == parent_id) {
                this.membersList.push({
                    level: level + 1,
                    id: member.id,
                    parent_id: parent_id,
                    member_count: parseInt(member.member_count, 10),
                    summary_text: member.summary_text,
                    data: member.data,
                    expanded: member.expanded
                });

                // if expanded add the children
                if (member.expanded) {
                    this.buildMembersList(member.id, level + 1);
                }
            }
        }
    }
}
