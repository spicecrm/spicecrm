import {Component, OnInit} from '@angular/core';
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {Router} from "@angular/router";
import {session} from "../../../services/session.service";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'prospectlists-last-member-modification-field',
    templateUrl: '../templates/prospectlistslastmembermodificationfield.html'
})
export class ProspectlistsLastMemberModificationField extends fieldGeneric implements OnInit {

    public isLoading: boolean = true;

    public lastMemberModificationModule: string;

    public lastMemberModificationId: string;

    public modificatedOnDate: string;

    public isDeleted: string;

    public lastMemberModificationName: string;

    constructor(public model: model,
                public view: view,
                public backend: backend,
                public session: session,
                public language: language,
                public metadata: metadata,
                public router: Router,) {
        super(model, view, language, metadata, router)
    }

    public ngOnInit() {
        this.backend.getRequest(`module/ProspectLists/${this.model.id}/lastmembermodification`).subscribe({
            next: (res) => {
                this.lastMemberModificationModule = res.prospect_list_data.modificated_memeber_module;
                this.lastMemberModificationId = res.prospect_list_data.modificated_memeber_id;
                this.modificatedOnDate = res.prospect_list_data.date_modified;
                this.isDeleted = res.prospect_list_data.deleted;
                this.lastMemberModificationName = res.modified_member_name;
                this.isLoading = false;
            }
        })
    }

    get modificationDescriptionLabel() {
        if (this.isDeleted == '1') {
            return 'LBL_TARGETLIST_MEMBER_REMOVED'
        }

        return 'LBL_TARGETLIST_MEMBER_ADDED'
    }

    get formatedDate() {
        let timeZone = this.session.getSessionData('timezone');
        let pDateTime = typeof timeZone == 'string' && timeZone.length > 0 ? moment.utc(this.modificatedOnDate).tz(timeZone) : moment(this.modificatedOnDate);
        return pDateTime.format('DD.MM.YYYY HH:mm');
    }

    get moduleLabel() {
        return 'LBL_' + this.lastMemberModificationModule.toUpperCase();
    }
}