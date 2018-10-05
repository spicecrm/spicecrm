import {CommonModule} from "@angular/common";
import {
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    EventEmitter,
    Injectable,
    Input,
    NgModule,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Renderer,
    Renderer2,
    SimpleChanges,
    ViewChild,
    ViewContainerRef,
} from "@angular/core";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes, Router, ActivatedRoute} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";

import {Subject, Observable} from "rxjs";

import {loginService, loginCheck} from "../../services/login.service";
import {metadata, aclCheck} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {modal} from "../../services/modal.service";
import {modellist} from "../../services/modellist.service";
import {relatedmodels} from "../../services/relatedmodels.service";
import {modelutilities} from "../../services/modelutilities.service";
import {helper} from "../../services/helper.service";
import {language} from "../../services/language.service";
import {broadcast} from "../../services/broadcast.service";
import {navigation} from "../../services/navigation.service";
import {backend} from "../../services/backend.service";
import {session} from "../../services/session.service";
import {footer} from "../../services/footer.service";
import {assistant} from "../../services/assistant.service";
import {view} from "../../services/view.service";
import {popup} from "../../services/popup.service";
import {toast} from "../../services/toast.service";
import {fts} from "../../services/fts.service";
import {configurationService} from "../../services/configuration.service";
import {VersionManagerService} from "../../services/versionmanager.service";

import {DirectivesModule} from "../../directives/directives";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {GlobalUtilityComponents} from "../../globalutilitycomponents/globalutilitycomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {ObjectFields} from "../../objectfields/objectfields";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import /*embed*/ {mailboxesEmails} from "./services/mailboxesemail.service";

import /*embed*/ {MailboxManager} from "./components/mailboxmanager";
import /*embed*/ {MailboxManagerHeader} from "./components/mailboxmanagerheader";
import /*embed*/ {MailboxManagerEmails} from "./components/mailboxmanageremails";
import /*embed*/ {MailboxManagerEmail} from "./components/mailboxmanageremail";
import /*embed*/ {MailboxmanagerEmailDetails} from "./components/mailboxmanageremaildetails";
import /*embed*/ {MailboxEmailToLeadButton} from "./components/mailboxemailtoleadbutton";
import /*embed*/ {MailboxEmailToLeadModal} from "./components/mailboxemailtoleadmodal";
import /*embed*/ {MailboxEmailToLeadEmailText} from "./components/mailboxemailtoleademailtext";
import /*embed*/ { MailboxesDashlet } from "./components/mailboxesdashlet"

@NgModule({
    declarations: [
        MailboxManager,
        MailboxManagerHeader,
        MailboxManagerEmails,
        MailboxManagerEmail,
        MailboxmanagerEmailDetails,
        MailboxEmailToLeadButton,
        MailboxEmailToLeadModal,
        MailboxEmailToLeadEmailText,
        MailboxesDashlet
    ],
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        GlobalUtilityComponents,
        DirectivesModule,
    ],
})
export class ModuleMailboxes {
    readonly version = "1.0";
    readonly build_date = "/*build_date*/";

    constructor(private vms: VersionManagerService) {
        this.vms.registerModule(this);
    }
}