import {Injectable, SkipSelf} from "@angular/core";
import {language} from "../../../services/language.service";
import {userpreferences} from "../../../services/userpreferences.service";
import {session} from "../../../services/session.service";
import {backend} from "../../../services/backend.service";
import {Subject} from "rxjs";

declare var moment: any;

/**
 * handle the landscape svg
 */
@Injectable()
export class emailsService {

    constructor(
        private language: language,
        private backend: backend,
        private userpreferences: userpreferences,
        private session: session,
    ) {

    }

    public composeReplyContent(email, action: 'reply'|'fwd' = "reply") {
        let retSubject = new Subject<any>();
        let actionLabel = action == 'fwd' ? 'LBL_FW' : 'LBL_RE';
        this.backend.getRequest(`module/Emails/${email.id}/body/html`).subscribe({
            next: (body) => {
                // set the email-history into the body
                retSubject.next({
                    name: this.language.getLabel(actionLabel) + email.getField('name'),
                    body: '<br><br><br>' + this.buildHistoryText(email, body.html)
                });
            }, error: () => {
                retSubject.next({
                    name: this.language.getLabel(actionLabel) + email.getField('name'),
                    body: '<br><br><br>' + this.buildHistoryText(email, email.getField('body'))
                });
            }
        })
        return retSubject.asObservable();
    }

    /**
     * generate the email-history-text and return it
     */
    private buildHistoryText(email, emailbody: string) {

        let datetime = new moment.utc(email.getField('date_sent')).tz(this.session.getSessionData('timezone') || moment.tz.guess(true));
        let hdate = datetime ? datetime.format(this.userpreferences.getDateFormat()) : "";
        let htime = datetime ? datetime.format(this.userpreferences.getTimeFormat()) : "";

        let historytext = "";
        historytext += "<br><br>";
        historytext += "<div data-spice-reply-quote='' class='spicecrm_reply_quote'>";
        historytext += "<div dir='ltr' class='crm_attr'>";
        historytext += "<b>" + this.language.getLabel('LBL_FROM') + ":</b> <a href='mailto:" + email.getField('from_addr') + "'>" + email.getField('from_addr') + "</a>";
        historytext += "<br>";
        historytext += "<b>" + this.language.getLabel('LBL_DATE_SENT') + ":</b> " + hdate + " " + htime;
        historytext += "<br>";
        historytext += "<b>" + this.language.getLabel('LBL_TO') + ":</b> " + email.getField('to_addrs');
        historytext += "<br>";
        historytext += "<b>" + this.language.getLabel('LBL_SUBJECT') + ":</b> " + email.getField('name');
        historytext += "<br><br>";
        historytext += "</div>";

        historytext += '<blockquote class="crm_quote" style="margin:0px 0px 0px 0.8ex;border-left:1px solid rgb(204,204,204);padding-left:1ex">';

        const body: string = emailbody.replace('data-signature=""', '').replace('data-spice-temp-quote=""', '');

        if (this.textIsHtml(body)) {
            const containerDiv = document.createElement('html');
            containerDiv.innerHTML = body;
            const bodyTag = containerDiv.getElementsByTagName('body')[0];
            historytext += bodyTag ? bodyTag.innerHTML : body;
            containerDiv.remove();

        } else {
            historytext += body.replace(/\n|\r/g, '<br>');
        }

        historytext += '</blockquote>';

        historytext += '</div>';

        return historytext;
    }

    /**
     * check if you can find out that the text is html
     * it is the case when we find a body end tag
     * @param text
     */
    public textIsHtml(text) {
        if(!text) return false;
        const regexToCheck = [/<\/body>/gi, /<\/html>/gi, /<\/div>/gi, /<\/p>/gi];
        regexToCheck.forEach(regex => {
            if(text.search(regex) > -1){
                return true;
            }
        });
        return false;
    }
}
