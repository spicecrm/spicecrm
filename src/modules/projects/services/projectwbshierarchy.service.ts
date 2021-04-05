/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

        this.backend.getRequest("ProjectWBSsHierarchy/" + project_id).subscribe(members => {
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
