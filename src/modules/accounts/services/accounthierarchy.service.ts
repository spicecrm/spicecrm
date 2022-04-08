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

    constructor(public backend: backend) {
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
