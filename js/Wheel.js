/**
 * @author Zhongpeng Lin
 */

Wheel.prototype = new THREE.Mesh();
Wheel.prototype.constructor = Wheel;
function Wheel(geometry) {
	THREE.Mesh.call( this,  geometry, new THREE.MeshLambertMaterial({color:0x333333}));
	
	this.setScale(0.3);
}

Wheel.prototype.setScale = function(s) {
	this.scale.set(s, s, s);
}

Wheel.prototype.setPosition = function(x, y, z) {
	this.geometry.computeBoundingBox();
	var bb = this.geometry.boundingBox;
	this.position.set(x-Math.cos(this.rotation.y)*Math.cos(this.rotation.z)*this.scale.x*(bb.max.x+bb.min.x)*0.5,
		       y-Math.cos(this.rotation.x)*Math.cos(this.rotation.z)*this.scale.y*(bb.max.y+bb.min.y)*0.5,
		       z-Math.cos(this.rotation.y)*Math.cos(this.rotation.x)*this.scale.z*(bb.max.z+bb.min.z)*0.5);
}

Wheel.prototype.setRotation = function(x, y, z) {
	this.rotation.set(x, y, z);
}
