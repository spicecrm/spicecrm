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
    private availableNewsLetters: Array<any> = [];
    private subscribedNewsLetters: Array<any> = [];

    private selectedAvailable: Array<any> = [];
    private selectedSubscribed: Array<any> = [];

    private multiselect: boolean = false;

    public self: any = {};

    constructor(private language: language, private backend: backend, private metadata: metadata, private model: model) {
        // get the newsletters
        this.backend.getRequest("newsletters/subscriptions/" + this.model.id).subscribe((results: any) => {

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
                        })

                        delete(campaigns[campaignId]);
                    } else if (campaigns[campaignId].defaultList == plEntry.prospect_list_id) {
                        this.availableNewsLetters.push({
                            id: campaignId,
                            summary_text: campaigns[campaignId].name,
                            defaultList: campaigns[campaignId].defaultList,
                            exemptList: campaigns[campaignId].exemptList
                        })
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
                })
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
        })
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
        })
        this.selectedSubscribed = [];
    }

    private save() {
        let postBody = {
            subscribed: this.subscribedNewsLetters,
            unsubscribed: this.availableNewsLetters
        };
        this.backend.postRequest("newsletters/subscriptions/" + this.model.id, {}, postBody).subscribe((results: any) => {
            this.closePopup();
        });
    }
}