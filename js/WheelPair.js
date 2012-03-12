/**
 * @author Zhongpeng Lin
 */
WheelPair.prototype = new THREE.Mesh();
WheelPair.prototype.constructor = WheelPair;
function WheelPair(wheelGeometry) {
	this.wheelGeometry = wheelGeometry;
	this.buildGeometry();
	THREE.Mesh.call( this, this.geometry, new THREE.MeshLambertMaterial());
}

WheelPair.prototype.buildGeometry = function() {
	var width = 50;
	var axle = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, width, 50, 50, false),
		new THREE.MeshBasicMaterial());
	axle.rotation.z = Math.PI/2;
	var wheel1 = new Wheel(this.wheelGeometry);
	wheel1.setPosition(width*0.5, 0, 0);
	var wheel2 = new Wheel(this.wheelGeometry);
	wheel2.setRotation(0, Math.PI, 0);
	wheel2.setPosition(-width*0.5, 0, 0);
	
	var combined = new THREE.Geometry();
	THREE.GeometryUtils.merge(combined, wheel1);
	THREE.GeometryUtils.merge(combined, wheel2);
	THREE.GeometryUtils.merge(combined, axle);
	this.geometry = combined;
}

WheelPair.prototype.setWidth = function(width) {
	this.width = width;
}



