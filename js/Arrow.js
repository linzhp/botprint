Arrow.prototype = new THREE.Mesh();
Arrow.prototype.constructor = Arrow;

function Arrow() {
	var shaft = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 3, 50, 50, false),
		new THREE.MeshBasicMaterial());
	shaft.position.y = -1.5;
		
	var head = new THREE.Mesh(new THREE.CylinderGeometry(0, 3, 6, 50, 50, false),
		new THREE.MeshBasicMaterial());
	head.position.y = 3;
		
	this.geometry = new THREE.Geometry();
	THREE.GeometryUtils.merge(this.geometry, shaft);
	THREE.GeometryUtils.merge(this.geometry, head);


	THREE.Mesh.call( this, this.geometry, new THREE.MeshLambertMaterial());
}
