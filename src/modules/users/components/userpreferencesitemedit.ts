import {Component, Input} from "@angular/core";
import {language} from "../../../services/language.service";
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {userpreferences} from "../../../services/userpreferences.service";
import {currency} from '../../../services/currency.service';
import {Subject} from "rxjs";
import {session} from '../../../services/session.service';
import {model} from '../../../services/model.service';

declare var _: any;
declare var moment: any;

@Component({
    selector: "user-preferences-item-edit",
    templateUrl: "./src/modules/users/templates/userpreferencesitemedit.html"
})
export class UserPreferencesItemEdit {

    constructor(private view: view) {
    }

}
