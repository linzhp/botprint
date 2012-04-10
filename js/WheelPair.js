/**
 * @author Zhongpeng Lin
 */
WheelPair.prototype = new THREE.Object3D();
WheelPair.prototype.constructor = WheelPair;
function WheelPair(wheelGeometry) {
	this.wheel1 = new Wheel(wheelGeometry);
	this.wheel2 = new Wheel(wheelGeometry);
	this.wheel2.setRotation(0, Math.PI, 0);

	this.width = 50;
	this.build();

	this.add(this.wheel1);
	this.add(this.wheel2);
	new WidthController(this);
	this.position.set(10, 10, 10);	
}

WheelPair.prototype.build = function() {
	if(this.axle){
		this.remove(this.axle);		
	}
	this.axle = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, this.width, 50, 50, false),
		new THREE.MeshBasicMaterial());
	this.axle.rotation.z = Math.PI/2;
	this.add(this.axle);

	this.wheel1.setPosition(this.width*0.5, 0, 0);
	this.wheel2.setPosition(-this.width*0.5, 0, 0);
};

WheelPair.prototype.setWidth = function(width) {
	this.width = width;
	this.build();
};

WheelPair.prototype.getWidth = function() {
	return this.width;
};


