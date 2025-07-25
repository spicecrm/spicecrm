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
    templateUrl: '../templates/prospectlistslastmembermodificationfield.html',
    standalone: false
})
export class ProspectlistsLastMemberModificationField extends fieldGeneric implements OnInit {

    public isLoading: boolean = true;

    public modificationDate: string;

    public modifiedBy: any;

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
                this.modificationDate = res.date_modified;
                this.modifiedBy = res.modified_by;
                this.isLoading = false;
            }
        })
    }

    get formatedDate() {
        let timeZone = this.session.getSessionData('timezone');
        let pDateTime = typeof timeZone == 'string' && timeZone.length > 0 ? moment.utc(this.modificationDate).tz(timeZone) : moment(this.modificationDate);
        return pDateTime.isValid() ? pDateTime.format('DD.MM.YYYY HH:mm') : null;
    }
}