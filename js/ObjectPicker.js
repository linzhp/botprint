/**
 * @author Zhongpeng Lin
 */

function ObjectPicker(mouseEvent, stage, camera) {
	var x, y;
	if (mouseEvent.pageX || mouseEvent.pageY) {
		x = mouseEvent.pageX;
		y = mouseEvent.pageY;
	} else {
		x = mouseEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = mouseEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	// Depending of the fact that stage.offsetParent == body
	if(!stage.offsetParent instanceof HTMLBodyElement)
	{
		console.error("stage's parent is not document.body!");
	}
	x -= stage.offsetLeft;
	y -= stage.offsetTop;
	var v = new THREE.Vector3 (x / stage.width * 2 - 1, -y / stage.height * 2 + 1, 0.5);
	projector.unprojectVector (v, camera);
	this.ray = new THREE.Ray (camera.position, v.subSelf (camera.position).normalize ());
}

ObjectPicker.prototype.pickFromArray = function(array) {
	debugger;
	var intersects = this.ray.intersectObjects(array);
	if(intersects.length > 0) {
		return intersects[0];
	} else{
		return null;
	}
};

ObjectPicker.prototype.pick = function(object){
	var intersects = ray.intersectObject(object);
	if(intersects.length > 0) {
		return intersects[0];
	} else{
		return null;
	}
};



