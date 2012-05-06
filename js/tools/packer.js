/**
 * A very simple ternary tree based bin packing algorithm for generating chassis
 * Author(s): huascarsanchez
 * Date: 3/10/12 - 4:59 PM
 */

Packer = function(width, height, depth) {
	this.init(width, height, depth);
};

Packer.prototype = {
	init: function(width, height, depth){
		this.root = {x: 0, y: 0, z: 0, width: width, height: height, depth: depth };
	},

	fit: function(blocks) {
		var n, node, block;
		for(n = 0; n < blocks.length; n++){
			block = blocks[n];
			if(node = this.findNode(this.root, block.width, block.height, block.depth)){
				block.fit = this.splitNode(node, block.width, block.height, block.depth);
			}
		}
	},

	findNode: function(root, width, height, depth) {
		if(root.used){
			return this.findNode(root.right, width, height, depth) ||
				this.findNode(root.down, width, height, depth) ||
				this.findNode(root.center, width, height, depth);
		} else if ((width <= root.width) && (height <= root.height) && (depth <= root.depth)) {
			return root;
		} else {
			return null; // nothing found...
		}
	},

	splitNode: function(node, width, height, depth){
		node.used = true;
		node.down  = {
			x: node.x,
			y: node.y + height,
			z: node.z,
			width: node.width,
			height: node.height - height,
			depth: node.depth
		};
		node.right = {
			x: node.x + width,
			y: node.y,
			z: node.z,
			width: node.width - width,
			height: height,
			depth: node.depth
		};

		node.center = {
			x: node.x,
			y: node.y,
			z: node.z + depth,
			width: node.width,
			height: height,
			depth: node.depth - depth
		};
		return node;
	}
};