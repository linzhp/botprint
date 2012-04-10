/**
 * Controller to adjust width of an object, expecting the object has getWidth and setWidth methods.
 * "width" here means the span along the x axis in the object's local coordinate system.'
 * 
 * @author Zhongpeng Lin
 */

function WidthController(object) {
	arrow = new Arrow();
	
	arrow.onDrag = function(offset) {
		var newX = arrow.position.x + offset.x;
		object.setWidth((newX - 10)*2);
		arrow.position.x = newX;
	};
	
	// Decide arrow position and orientation
	arrow.position.x = object.getWidth() / 2 + 10;
	arrow.rotation.z = Math.PI * 3 / 2;
	
	object.add(arrow);
	controller.objects.push(arrow);
}

