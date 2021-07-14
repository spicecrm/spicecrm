/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleAccounts
 */
import {Injectable} from "@angular/core";
import {backend} from "../../../services/backend.service";

import {Subject, Observable} from "rxjs";


@Injectable()
export class accountHierarchy {

    public parentId: string = "";
    public requestedFields: Array<any> = [];
    public members: Array<any> = [];
    public membersList: Array<any> = [];

    constructor(private backend: backend) {
    }

    public loadHierachy(parent_id = this.parentId, expand = false): Observable<boolean> {

        let retSubject = new Subject<boolean>();

        let addfields = [];
        for (let field of this.requestedFields) {
            addfields.push(field.field);
        }

        this.backend.getRequest(`module/Accounts/${parent_id}/hierarchy/${JSON.stringify(addfields)}`).subscribe(members => {
            for (let member of members) {
                this.members.push({
                    parent_id: parent_id,
                    id: member.id,
                    member_count: member.member_count,
                    expanded: false,
                    loaded: false,
                    summary_text: member.summary_text,
                    data: member.data
                });
            }

            // set the noe data
            this.members.some(thisMember => {
                if (thisMember.id === parent_id) {
                    thisMember.loaded = true;
                    if (expand) {
                        thisMember.expanded = true;
                    }
                    return true;
                }
            });

            this.rebuildMembersList();

            retSubject.next(true);
            retSubject.complete();
        });
        return retSubject.asObservable();
    }

    public expand(id) {
        this.members.some(thisMember => {
            if (thisMember.id === id) {
                if(thisMember.loaded) {
                    thisMember.expanded = true;
                } else {
                    this.loadHierachy(id, true);
                }
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
        this.buildMembersList();
    }

    public buildMembersList(parentId = this.parentId, level = 0) {
        for (let member of this.members) {
            if (member.parent_id == parentId) {
                this.membersList.push({
                    level: level + 1,
                    id: member.id,
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
