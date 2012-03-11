/**
 * @author Zhongpeng Lin
 */

WheelsSelection = function() {
	this.message = 'wheels.selection';
	//this.explode = function() { ... }
	// this function will have images....
}

WheelsSelection.prototype.addWheel = function() {
	var wheelLoader = new THREE.BinaryLoader(true);
	wheelLoader.load('js/obj/veyron_wheel_bin.js', buildWheelPair);
}

buildWheelPair = function(wheelGeometry) {
	var axle = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 50, 50, 50, false),
		new THREE.MeshLambertMaterial({color: 0x00ff00}));
	axle.rotation.z = Math.PI/2;
	var wheel1 = new Wheel(wheelGeometry);
	wheel1.setPosition(25, 0, 0);
	var wheel2 = new Wheel(wheelGeometry);
	wheel2.setRotation(0, Math.PI, 0);
	wheel2.setPosition(-25, 0, 0);
	controller.scene.add(wheel1);
	controller.objects.push(wheel1);
	controller.scene.add(wheel2);
	controller.objects.push(wheel2);
	controller.scene.add(axle);
	controller.objects.push(axle);
}
