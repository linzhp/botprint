/**
 * @author Zhongpeng Lin
 */

function ScaleXController(object) {
	this.object = object;
	arrow = new Arrow();
	
	arrow.onDrag = function(offset) {
		var newX = arrow.position.x + offset.x;
		object.setScaleX(object.scale.x * newX / arrow.position.x);
		arrow.position.x = newX;
	};
	
	// Decide arrow position and orientation
	arrow.position.x = object.boundRadius + 10;
	arrow.rotation.z = Math.PI * 3 / 2;
	
	object.add(arrow);
}