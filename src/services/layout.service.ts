/**
 * @module services
 */
import {Injectable, EventEmitter} from '@angular/core';

/**
 * a helper service that supprts managing the layout dimensions. This is added where the mediaqueries are not suffieit because e.g. components are rendered differently depending on teh sreensize
 */
@Injectable()
export class layout {
    /**
     * holds the height of the header. The header can change with the layout changes and since the component is fixed other components need to adopt accordingly
     */
    public headerheight = 90;

    /**
     * returns the size of the screen in the proper size category
     *
     * >1024 => large
     * 768 - 1023 => medium
     * <768 => small
     */
    get screenwidth(): 'large' | 'medium' | 'small' {
        let width = window.innerWidth;
        if (width >= 1024) return 'large';
        if (width >= 768) return 'medium';
        return 'small';
    }
}
