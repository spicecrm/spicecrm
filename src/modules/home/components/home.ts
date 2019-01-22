import {
    Component
} from '@angular/core';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {metadata} from '../../../services/metadata.service';

// import 'hammerjs';

@Component({
    templateUrl: './src/modules/home/templates/home.html',
})
export class Home {
    private componentconfig: any = {};
    private isOpen: boolean = true;

    constructor(private broadcast: broadcast, private navigation: navigation, private metadata: metadata) {
        // set theenavigation paradigm
        this.navigation.setActiveModule('Home');

        // get config
        let componentconfig = this.metadata.getComponentConfig('Home', 'Home');
        if (componentconfig && componentconfig.HomeAssistant) {
            this.componentconfig = componentconfig.HomeAssistant;
        }
    }

    get displayHomeAssistant() {
        // only if screen size is bigger than medium
        if (window.innerWidth < 1024) return false;

        // check if assistant is enabled at all
        if (this.componentconfig.HomeAssistant !== undefined) {
            return this.componentconfig.HomeAssistant;
        }
        return true;
    }

    private toggleOpen() {
        this.isOpen = !this.isOpen;
    }
}
