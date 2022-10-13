export interface LandscapeItemI {
    id: string;
    name?: {
        text: string,
        position: { x: number, y: number }
    };
    type: 'item' | 'connector';
    data?: any;
    path?: {
        line: string,
        sourceArrow: string,
        targetArrow: string
    };
    items?: {
        source: {
            id: string,
            hasArrow: boolean,
        },
        target: {
            id: string,
            hasArrow: boolean,
        }
    };
    position?: {
        x: number, y: number
    }
    style?: {
        left?: string;
        top?: string;
        width?: string;
        height?: string;
    }
}

/**
 * Item box points to be used for connection
 */
export interface LandscapeItemPoints {
    topLeft: { x: number, y: number };
    topCenter: { x: number, y: number };
    topRight: { x: number, y: number };
    rightMiddle: { x: number, y: number };
    rightBottom: { x: number, y: number };
    bottomCenter: { x: number, y: number };
    bottomLeft: { x: number, y: number };
    leftMiddle: { x: number, y: number };
}

export interface DeploymentPackageI {
    id: string;
    name: string;
    description: string;
    source_system_name: string;
    source_system: string;
    extensions: string;
    packages: string;
    package: string;
    /**
     * '0' => 'created',
     * '1' => 'in progress',
     * '2' => 'completed',
     * '3' => 'in test',
     * '4' => 'delivered',
     * '5' => 'fetched',
     * '6' => 'deployed',
     * '7' => 'released'
     */
    rpstatus: '0' | '1'| '2'| '3'| '4'| '5'| '6'| '7';
}
