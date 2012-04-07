/**
 * @author Zhongpeng Lin
 */

function ScaleXController(object) {
	this.object = object;
	this.arrow = new Arrow();
	
	arrow.onDrag = function(offset) {
		var newX = this.arrow.position.x + offset.x;
		this.object.setScaleX(this.object.scale.x * newX / this.arrow.position.x);
		this.arrow.position.x = newX;
	};
	
	// Decide arrow position and orientation
	arrow.position.x = object.boundRadius + 10;
	arrow.rotation.z = Math.PI / 2;
	
	object.add(arrow);
}