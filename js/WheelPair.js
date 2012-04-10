/**
 * @author Zhongpeng Lin
 */
WheelPair.prototype = new THREE.Mesh();
WheelPair.prototype.constructor = WheelPair;
function WheelPair(wheelGeometry) {
	this.wheel1 = new Wheel(wheelGeometry);
	this.wheel2 = new Wheel(wheelGeometry);
	this.wheel2.setRotation(0, Math.PI, 0);

	this.width = 50;
	this.build();

	new WidthController(this);
	this.position.set(10, 10, 10);	
}

WheelPair.prototype.build = function() {
	var axle = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, this.width, 50, 50, false),
		new THREE.MeshBasicMaterial());
	axle.rotation.z = Math.PI/2;

	this.wheel1.setPosition(this.width*0.5, 0, 0);
	this.wheel2.setPosition(-this.width*0.5, 0, 0);
	
	var combined = new THREE.Geometry();
	THREE.GeometryUtils.merge(combined, this.wheel1);
	THREE.GeometryUtils.merge(combined, this.wheel2);
	THREE.GeometryUtils.merge(combined, axle);

	THREE.Mesh.call( this, combined, new THREE.MeshLambertMaterial());
	debugger;
};

WheelPair.prototype.setWidth = function(width) {
	this.width = width;
	this.build();
};

WheelPair.prototype.getWidth = function() {
	return this.width;
};



