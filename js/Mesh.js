/**
 * @author Zhongpeng Lin
 */

THREE.Mesh.prototype.onDrag = function(offset) {
	this.position.addSelf(offset);
};
