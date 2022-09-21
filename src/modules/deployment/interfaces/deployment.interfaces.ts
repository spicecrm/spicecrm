export interface LandscapeItemI {
    id: string;
    name?: {
        text: string,
        position: {x: number, y: number}
    };
    type: 'item' | 'connector';
    path?: {
        line: string,
        arrow: string
    };
    items?: {source: string, target: string};
    position?: {
        left: number, top: number
    }
    style?: {
        left?: string;
        top?: string;
        width?: string;
        height?: string;
    }
}
