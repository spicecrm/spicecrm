/**
 * @module ModuleProjects
 */
import {Injectable} from "@angular/core";
import {backend} from "../../../services/backend.service";
import {modelutilities} from "../../../services/modelutilities.service";

@Injectable()
export class projectwbsHierarchy {

    public project_id: string = "";
    public requestedFields: Array<any> = [];
    public members: Array<any> = [];
    public membersList: Array<any> = [];

    constructor(private backend: backend, private modelutilities: modelutilities) {
    }

    public  loadHierarchy(project_id = this.project_id, expanded = false) {
        let addfields = [];

        for (let field of this.requestedFields) {
            addfields.push(field.field);
        }

        let membersExpanded: Array<any> = [];
        for(let member of this.members){
            if(member.expanded){
                membersExpanded.push(member.id);
            }
        }

        // reset members
        this.members = [];

        // get the WBS Elements
        this.backend.getRequest("ProjectWBSsHierarchy/" + project_id + "/" + JSON.stringify(addfields)).subscribe(members => {
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
                if (a.data.start_date == "" && b.data.start_date == "") {
                    return a.data.name > b.data.name ? -1 : 1;
                }

                // second object does not have a date
                if (b.data.start_date == "") {
                    return -1;
                }

                // first objects does not have a date
                if (a.data.start_date == "") {
                    return 1;
                }

                // all have a date
                return a.data.start_date.isBefore(b.data.start_date) ? 1 : -1;
            });

            this.rebuildMembersList();
        });
    }

    public expand(id) {
        this.members.some(thisMember => {
            if (thisMember.id === id) {
                thisMember.expanded = true;
                return true;
            }
        });
        this.rebuildMembersList();
    }

    public collapse(id) {
        this.members.some(thisMember => {
            if (thisMember.id === id) {
                thisMember.expanded = false;

                return true;
            }
        });
        this.rebuildMembersList();
    }

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
