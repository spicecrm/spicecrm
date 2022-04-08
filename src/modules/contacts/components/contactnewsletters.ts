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
    templateUrl: "../templates/contactnewsletters.html"
})
export class ContactNewsletters {

    public rawResult: any = {};
    public availableNewsLetters: any[] = [];
    public subscribedNewsLetters: any[] = [];

    public selectedAvailable: any[] = [];
    public selectedSubscribed: any[] = [];

    public multiselect: boolean = false;

    public self: any = {};

    constructor(public language: language, public backend: backend, public metadata: metadata, public model: model) {
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

    public closePopup() {
        this.self.destroy();
    }

    public keypressed(event) {
        // check the control key to enable MultiSelect
        if (event.type === "keydown" && event.key === "Control" && this.multiselect === false) {
            this.multiselect = true;
        }

        if (event.type === "keyup" && event.key === "Control" && this.multiselect === true) {
            this.multiselect = false;
        }
    }

    public isSelected(pool, id) {
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

    public selectNewsletter(pool, id) {
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

    public subscribe() {
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

    public unsubscribe() {
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

    public save() {
        let postBody = {
            subscribed: this.subscribedNewsLetters,
            unsubscribed: this.availableNewsLetters
        };
        this.backend.postRequest("module/Contacts/"  + this.model.id + "/newsletters/subscriptions", {}, postBody).subscribe((results: any) => {
            this.closePopup();
        });
    }
}
