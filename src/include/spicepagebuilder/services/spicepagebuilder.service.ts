import {Injectable} from "@angular/core";

@Injectable()
export class SpicePageBuilderService {
    /**
     * page structure object
     */
    public page: { containers, style, type } = {
        style: {'background-color': 'grey'},
        type: 'page',
        containers: [
            {
                type: 'container',
                style: {
                    'background-color': '#C7FFD6',
                    'padding': '.25rem'
                },
                sections: []
            }
        ]
    };

    public dropListGroup: any;
}
