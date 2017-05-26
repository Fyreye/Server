/**
 * Represents an RGBA color. Values should normally be in the range [0.0, 1.0].
 * @constructor
 * @param {Number} r - red value (default 0.0)
 * @param {Number} g - green value (default 0.0)
 * @param {Number} b - blue value (default 0.0)
 * @param {Number} a - alpha value (default 1.0)
 */
function Color(r, g, b, a)
{
	this.r = (r ? r : 0.0);
	this.g = (g ? g : 0.0);
	this.b = (b ? b : 0.0);
	this.a = (a ? a : 1.0);
}

/**
 * Interpolates a color value within an isoceles triangle based on an
 * x, y offset from the lower left corner.  The base of the triangle is 
 * always aligned with the bottom of the canvas.
 * @param {Number} x - offset from left side
 * @param {Number} y - offset from bottom
 * @param {Number} base - base of triangle
 * @param {Number} height - height of triangle
 * @param {Color[]} colors - colors of the three corners, counterclockwise 
 *   from lower left
 * @return {Color} interpolated color at offset (x, y)
 */
function findRGB(x, y, width, height, colors)
{
	var topX = width/2;   var topY = height;
	var rightX = width;   var rightY = 0;
	var base = 0;
	var out = new Color(0.0,0.0,0.0,0.0);
	
    var areaT = width * heigth / 2;
	
	var areas = [0.0,0.0,0.0];
	var areas[0] = abs((x*(topY-rightY) + topX*(rightY-y) + rightX*(y-topY))/2);
	var areas[1] = abs((base(topY-y) + topX*(y-base) + x*(base-topY))/2);
	var areas[2] = abs((base*(y-rightY) + x*(rightY-base) + rightX*(base-y))/2);
    
	for(var i = 0; i<colors.length; i++){
		out.r += colors[i].r * (areas[i]/areaT);
		out.g += colors[i].g * (areas[i]/areaT);
		out.b += colors[i].b * (areas[i]/areaT);
		out.a += colors[i].a * (areas[i]/areaT);
		
	}
	
	return out;
	
}

