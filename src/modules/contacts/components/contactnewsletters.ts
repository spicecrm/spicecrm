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
 * @module ModuleContacts
 */
import {Component} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {language} from "../../../services/language.service";

@Component({
    selector: "contact-newsletters",
    templateUrl: "./src/modules/contacts/templates/contactnewsletters.html"
})
export class ContactNewsletters {

    private rawResult: any = {};
    private availableNewsLetters: any[] = [];
    private subscribedNewsLetters: any[] = [];

    private selectedAvailable: any[] = [];
    private selectedSubscribed: any[] = [];

    private multiselect: boolean = false;

    public self: any = {};

    constructor(private language: language, private backend: backend, private metadata: metadata, private model: model) {
        // get the newsletters
        this.backend.getRequest("module/Contacts/" + this.model.id + "/newsletters/subscriptions" ).subscribe((results: any) => {

            // keep the raw result for the save
            this.rawResult = results;

            // an array for the campaigns sorted from the results
            let campaigns: any = {};

            // sort the campaigns anmd lists
            for (let campaignList of results.news_type_list_arr) {
                switch (campaignList.list_type) {
                    case "default":
                        if (!campaigns[campaignList.campaign_id]) {
                            campaigns[campaignList.campaign_id] = {name: campaignList.name};
                            campaigns[campaignList.campaign_id].defaultList = campaignList.prospect_list_id;
                        }
                        break;
                    case "exempt":
                        if (!campaigns[campaignList.campaign_id]) {
                            campaigns[campaignList.campaign_id] = {name: campaignList.name};
                        }
                        campaigns[campaignList.campaign_id].exemptList = campaignList.prospect_list_id;
                        break;
                }
            }

            // find the ones where the contact is linked to
            for (let plEntry of results.current_plp_arr) {
                for (let campaignId in campaigns) {
                    if (campaigns[campaignId].defaultList == plEntry.prospect_list_id) {
                        this.subscribedNewsLetters.push({
                            id: campaignId,
                            summary_text: campaigns[campaignId].name,
                            defaultList: campaigns[campaignId].defaultList,
                            exemptList: campaigns[campaignId].exemptList
                        });

                        delete(campaigns[campaignId]);
                    } else if (campaigns[campaignId].defaultList == plEntry.prospect_list_id) {
                        this.availableNewsLetters.push({
                            id: campaignId,
                            summary_text: campaigns[campaignId].name,
                            defaultList: campaigns[campaignId].defaultList,
                            exemptList: campaigns[campaignId].exemptList
                        });
                        delete(campaigns[campaignId]);
                    }
                }
            }

            // all remaining are available
            for (let campaignId in campaigns) {
                this.availableNewsLetters.push({
                    id: campaignId,
                    summary_text: campaigns[campaignId].name,
                    defaultList: campaigns[campaignId].defaultList,
                    exemptList: campaigns[campaignId].exemptList
                });
                delete(campaigns[campaignId]);
            }
        });
    }

    private closePopup() {
        this.self.destroy();
    }

    private keypressed(event) {
        // check the control key to enable MultiSelect
        if (event.type === "keydown" && event.key === "Control" && this.multiselect === false) {
            this.multiselect = true;
        }

        if (event.type === "keyup" && event.key === "Control" && this.multiselect === true) {
            this.multiselect = false;
        }
    }

    private isSelected(pool, id) {
        switch (pool) {
            case "available":
                if (this.selectedAvailable.indexOf(id) >= 0) {
                    return true;
                } else {
                    return false;
                }
            case "subscribed":
                if (this.selectedSubscribed.indexOf(id) >= 0) {
                    return true;
                } else {
                    return false;
                }
        }
    }

    private selectNewsletter(pool, id) {
        switch (pool) {
            case "available":
                if (this.multiselect === false) {
                    this.selectedAvailable = [id];
                } else {
                    if (this.selectedAvailable.indexOf(id) >= 0) {
                        this.selectedAvailable.splice(this.selectedAvailable.indexOf(id), 1);
                    } else {
                        this.selectedAvailable.push(id);
                    }
                }
                break;
            case "subscribed":
                if (this.multiselect === false) {
                    this.selectedSubscribed = [id];
                } else {
                    if (this.selectedSubscribed.indexOf(id) >= 0) {
                        this.selectedSubscribed.splice(this.selectedSubscribed.indexOf(id), 1);
                    } else {
                        this.selectedSubscribed.push(id);
                    }
                }
                break;
        }
    }

    private subscribe() {
        this.selectedAvailable.forEach((item) => {
            this.availableNewsLetters.some((targetitem, targetindex) => {
                if (item == targetitem.id) {
                    this.subscribedNewsLetters.push(this.availableNewsLetters.splice(targetindex, 1)[0]);
                    return true;
                }
            });
        });
        this.selectedAvailable = [];
    }

    private unsubscribe() {
        this.selectedSubscribed.forEach((item) => {
            this.subscribedNewsLetters.some((targetitem, targetindex) => {
                if (item == targetitem.id) {
                    this.availableNewsLetters.push(this.subscribedNewsLetters.splice(targetindex, 1)[0]);
                    return true;
                }
            });
        });
        this.selectedSubscribed = [];
    }

    private save() {
        let postBody = {
            subscribed: this.subscribedNewsLetters,
            unsubscribed: this.availableNewsLetters
        };
        this.backend.postRequest("module/Contacts/"  + this.model.id + "/newsletters/subscriptions", {}, postBody).subscribe((results: any) => {
            this.closePopup();
        });
    }
}
