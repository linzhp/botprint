/**
 * @author Zhongpeng Lin
 */

WheelsSelection = function() {
	this.width = 50;
	//this.explode = function() { ... }
	// this function will have images....
}

WheelsSelection.prototype.addWheel = function() {
	var wheelLoader = new THREE.BinaryLoader(true);
	wheelLoader.load('js/obj/veyron_wheel_bin.js', buildWheelPair);
}

buildWheelPair = function(wheelGeometry) {
	var pair = new WheelPair(wheelGeometry);
	controller.scene.add(pair);
	controller.objects.push(pair);
}
