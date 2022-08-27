import SpiceContextPad from './SpiceContextPad.js';
import SpicePalette from './SpicePalette.js';
import SpiceRenderer from './SpiceRenderer.js';

export var init = {
  __init__: [ 'spiceContextPad', 'spicePalette', 'spiceRenderer' ],
  spiceContextPad: [ 'type', SpiceContextPad ],
  spicePalette: [ 'type', SpicePalette ],
  spiceRenderer: [ 'type', SpiceRenderer ],
}

export var spiceContextPad = SpiceContextPad;

