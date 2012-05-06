/**
 * chassis generation logic
 * Author(s): huascarsanchez
 * Date: 3/11/12 - 11:08 AM
 */


Chassis = function(width, height, depth) { /*these criteria re needed to constraint the total area
	of the generated chassis..
*/
	this.init(width, height, depth);
};

Chassis.prototype = {
	init: function(width, height, depth){
		this.root = {x: 0, y: 0, z: 0, width: width, height: height, depth: depth };
	},

	expand: function(object) {
		object.scale.x = Math.random() * 2 + 1;
		object.scale.y =  Math.floor(Math.random() * 2);
		object.scale.z = Math.random() * 2 + 1;
	},

	generate: function(geometry, material){
		/**
		 * TODO fix this ...I am not sure why It is not working..
		 */
		var group;
		var mergedGeometry = new THREE.Geometry();
		var blocks = this.spawnN(geometry, 10);
		for ( var o = 0; v < blocks.length; o ++ ) {
			var block = blocks[o];
			THREE.GeometryUtils.merge(mergedGeometry, block);
		}

		mergedGeometry.computeFaceNormals();
		group	= new THREE.Mesh( mergedGeometry, material );
		group.matrixAutoUpdate = false;
		group.updateMatrix();

		return group;
	},

	position: function(vertex){
		var offset = Math.floor(Math.random() * 2);
		vertex.position.x *= offset;
		vertex.position.y *= offset;
		vertex.position.z *= offset;
	},

	spawnN: function(geometry, n){
		/**
		 * TODO fix this ...I am not sure why It is not working..
		 */
		var blocks = [];
		for(var i = 0; i < n; i++){
			var each = this.spawn(geometry);
			blocks.push(each);
		}
		return blocks;
	},

	spawn: function(geometry) {
		var material = new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff, morphTargets: true } );
		var mesh;
		for(var i = 0; i < geometry.vertices.length; i++){
			var vertices = [];
			for ( var v = 0; v < geometry.vertices.length; v ++ ) {
				vertices.push( new THREE.Vertex( geometry.vertices[ v ].position.clone() ) );
				if(v === i){
					this.position(vertices[ vertices.length - 1 ]);
				}
			}

			geometry.morphTargets.push( { name: "target" + i, vertices: vertices });
			mesh = new THREE.Mesh( geometry, material );

			var lo = 0;
			var hi = mesh.morphTargetInfluences.length - 1;
			if (lo <= hi) {
				var mid = lo + (hi - lo)/2;
				// random index from 1 to mid
				var toMid = Math.floor(Math.random() * mid);
				mesh.morphTargetInfluences[toMid] = Math.floor(Math.random() * 10)/10;
				// random index from mid to hi
				var fromMid = Math.floor(Math.random() * hi) + mid;
				mesh.morphTargetInfluences[fromMid]= Math.floor(Math.random() * 10)/10;
			}

			mesh.castShadow = mesh.receiveShadow = true;
			this.expand(mesh);
		}

		return mesh;

	}
};