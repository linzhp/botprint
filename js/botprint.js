/* Author: AugmentedDesignLab */

// sort of like global variables
var stage, stats, camera, scene, renderer, mouseX = 0, mouseY = 0, material, inputImage, stageCenterX, stageCenterY, canvas, context, imageWidth, imageHeight, stageWidth, stageHeight, enableMouseMove = false, plane, curPoint;

// tracked ones
var coordScene = new THREE.Scene();
var projector = new THREE.Projector();
var paused = false;
var last;
var down = false;
var sx = 0, sy = 0;
var rotation = 1;

var controller;
var debug = false;
var cube;


// vars accessible only by GUI
var GUIOptions = function() {
	this.stageSize = 0.8;
	// TODO add rotate left, right, up, and down...
	this.autoRotate = false;
};
var ChassisSelection = function() {
	this.styles = [];
	//this.explode = function() { ... }
	// this function will have images....
}
var WheelsSelection = function() {
	this.message = 'wheels.selection';
	//this.explode = function() { ... }
	// this function will have images....
}
function saveImage() {
	render();
	window.open(renderer.domElement.toDataURL("image/png"));
}

var guiOptions = new GUIOptions();
var ch = new ChassisSelection();
var whe = new WheelsSelection();

var gui = new dat.GUI({
	autoPlace : false
});
document.getElementById('controls-container').appendChild(gui.domElement);
var settings = gui.addFolder('General');
settings.add(guiOptions, 'stageSize', 0.6, 1, .1).onChange(doLayout);
settings.add(this, 'saveImage').name('Save Design');

var chassis = gui.addFolder('Chassis');

var wheels = gui.addFolder('Wheels');
wheels.add(whe, 'message');

/**
 * Init page
 */
$(document).ready(function() {

	$(window).bind('resize', doLayout);

	//init image drag and drop
	window.addEventListener('dragover', function(event) {
		event.preventDefault();
		// TODO implement me
	}, false);

	window.addEventListener('drop', function(event) {
		event.preventDefault();
		// TODO implement me

	}, false);
	// stop the user getting a text cursor
	document.onselectstart = function() {
		return false;
	};
	stage = document.getElementById("stage");

	$("#loadSample").click(function() {
		loadSample();
	});

    window.addEventListener('keyup', function(e) {
      // Hide on 'H'
      if (e.keyCode == 72) {
        debug = !debug;
      }
    }, false);


	//init stats
	stats = new Stats();
	// Align bottom-left
	stats.getDomElement().style.position = 'absolute';
	stats.getDomElement().style.left = '0px';
	stats.getDomElement().style.bottom = '0px';
	statscontainer = document.getElementById("fps-container");

	statscontainer.appendChild(stats.getDomElement());

	doLayout();

	if(!Detector.webgl) {
		$("#overlay").empty();
		Detector.addGetWebGLMessage({
			parent : document.getElementById("overlay")
		});

	} else {
        // hide the overlay and then append the rendering of the chassis
		$("#overlay").hide();
		initWebGL();
	}

});
function getRay(mouseEvent) {
	var x, y;
	if(mouseEvent.pageX || mouseEvent.pageY) {
		x = mouseEvent.pageX;
		y = mouseEvent.pageY;
	} else {
		x = mouseEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = mouseEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	// Depending of the fact that stage.offsetParent == body
	x -= stage.offsetLeft;
	y -= stage.offsetTop;
	var v = new THREE.Vector3(x / stageWidth * 2 - 1, -y / stageHeight * 2 + 1, 0.5);
	projector.unprojectVector(v, camera);
	var ray = new THREE.Ray(camera.position, v.subSelf(camera.position).normalize());
	return ray;
}

function initWebGL() {
	// init WebGL renderer
	if(!renderer) {
		renderer = new THREE.WebGLRenderer({
			antialias : true
		});
		renderer.setSize(stageWidth, stageHeight);
		renderer.autoClear = false;

		renderer.domElement.addEventListener('mousemove', onMouseMove, false);
		renderer.domElement.addEventListener('mousedown', onMouseDown, false);
		renderer.domElement.addEventListener('mouseup', onMouseUp, false);
		stage.appendChild(renderer.domElement);
	}
	//init camera
	camera = new THREE.PerspectiveCamera(45, stageWidth / stageHeight, 1, 10000);
	camera.position.y = 30;
	camera.position.x = 30;
	camera.position.z = 100;
	scene = new THREE.Scene();
	scene.add(camera);
	coordScene.fog = new THREE.FogExp2(0xEEEEEE, 0.0035);

	var lineGeo = new THREE.Geometry();
	lineGeo.vertices.push(v(-500, 0, 0), v(500, 0, 0), v(50, 0, 0), v(45, 5, 0), v(50, 0, 0), v(45, -5, 0), v(0, -500, 0), v(0, 500, 0), v(0, 50, 0), v(5, 45, 0), v(0, 50, 0), v(-5, 45, 0), v(0, 0, -500), v(0, 0, 500), v(0, 0, 50), v(5, 0, 45), v(0, 0, 50), v(-5, 0, 45));

	var lineMat = new THREE.LineBasicMaterial({
		color : 0x888888,
		lineWidth : .01
	});
	var line = new THREE.Line(lineGeo, lineMat);
	line.type = THREE.Lines;
	coordScene.add(line);

    doController();

	var light = new THREE.SpotLight(0xFFFFFF);
	light.position.set(150, 200, 300);
	light.castShadow = true;
	scene.add(light);

	var backlight = new THREE.PointLight(0x333366);
	backlight.position.set(-150, -200, -300);
	scene.add(backlight);

	var ambient = new THREE.AmbientLight(0x808080);
	scene.add(ambient);

	doLayout();
	// Add invisible plane to detect mouse movement offset
	plane = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 8, 8), new THREE.MeshBasicMaterial({
		color : 0x000000,
		opacity : 0.25,
		transparent : true,
		wireframe : true
	}));
	plane.lookAt(camera.position);
	plane.visible = false;
	scene.add(plane);

	// used for animating this stuff
	last = new Date().getTime();


	animate();
}

function doController() {
	controller = new THREE.Object3D();
	controller.objects = [];
	controller.scene = scene;
	controller.gui = chassis;
	controller.color = 0xFFFFFF;
	controller.createNew = function() {
		// default chassis is rectangular
		var cube = new THREE.Mesh(new THREE.CubeGeometry(20, 20, 20), new THREE.MeshPhongMaterial({
			color : Math.random() * 0xFFFFFF
		}));
		cube.castShadow = cube.receiveShadow = true;
		this.scene.add(cube);
		this.objects.push(cube);
		this.setCurrent(cube);
	};

	controller.setCurrent = function(current) {
		this.current = current;
		if(this.current) {
			this.current.material.ambient.setHex(0x888800);
			this.x.setValue(current.position.x);
			this.y.setValue(current.position.y);
			this.z.setValue(current.position.z);
			this.sX.setValue(current.scale.x);
			this.sY.setValue(current.scale.y);
			this.sZ.setValue(current.scale.z);
		}
	};

	controller.x = chassis.add(controller.position, 'x').min(-50).max(50).onChange(function(v) {
		controller.current.position.x = v;
	});

	controller.y = chassis.add(controller.position, 'y').min(-50).max(50).onChange(function(v) {
		controller.current.position.y = v;
	});

	controller.z = chassis.add(controller.position, 'z').min(-50).max(50).onChange(function(v) {
		controller.current.position.z = v;
	});

	controller.sX = chassis.add(controller.position, 'x').min(0.1).max(6).step(0.1).name('Width').onChange(function(v) {
		controller.current.scale.x = v;
	});

	controller.sY = chassis.add(controller.position, 'y').min(0.1).max(6).step(0.1).name('Height').onChange(function(v) {
		controller.current.scale.y = v;
	});

	controller.sZ = chassis.add(controller.position, 'z').min(0.1).max(6).step(0.1).name('Depth').onChange(function(v) {
		controller.current.scale.z = v;
	});
	// we could do a proxy to control only the currently selected object.
	chassis.add(controller, 'createNew');
	controller.createNew();
	chassis.open();
}

function createChassis() {
}

function onImageLoaded() {

	// load image into canvas pixels
	// TODO implement me
}

function onMouseDown(ev) {
	ev.preventDefault();
	down = true;
    sx = ev.clientX;
    sy = ev.clientY;
	var ray = getRay(ev);
	var intersects;
	intersects = ray.intersectObjects(controller.objects);
	if(intersects.length > 0) {
		controller.setCurrent(intersects[0].object);
	}
}

function onMouseMove(ev) {
	if (down) {
	  var dx = ev.clientX - sx;
	  var dy = ev.clientY - sy;
	  rotation += dx/100;
	  camera.position.x = Math.cos(rotation)*150;
	  camera.position.z = Math.sin(rotation)*150;
	  camera.position.y += dy;
	  sx += dx;
	  sy += dy;
	}
}

function onMouseUp(ev) {
	down = false;
}

function animate() {
	if(!paused) {
		last = new Date().getTime();
		var gl = renderer.getContext();
		renderer.clear();
		camera.lookAt(scene.position);
		renderer.render(scene, camera);
		if(debug) {
			renderer.render(coordScene, camera);
		}

	}
	requestAnimationFrame(animate);
	stats.update();
}

function render() {
	renderer.render(scene, camera);
}

function doLayout() {
	var winHeight, winWidth, controlsWidth, containerWidth;

	//get dims
	winHeight = window.innerHeight ? window.innerHeight : $(window).height();
	winWidth = window.innerWidth ? window.innerWidth : $(window).width();
	controlsWidth = $('#controls').outerWidth();

	//set container size
	$('#container').height(parseInt(winHeight));
	$('#container').width(parseInt(winWidth) - parseInt(controlsWidth));
	containerWidth = $('#container').outerWidth();

	//set stage size as fraction of window size
	//use letterbox dimensions unless 100%
	stageWidth = containerWidth * guiOptions.stageSize;
	stageHeight = containerWidth * guiOptions.stageSize * 9 / 16;

	if(guiOptions.stageSize === 1) {
		stageHeight = $('#container').outerHeight();
	}
	$('#stage').width(stageWidth);
	$('#stage').height(stageHeight);

	//Center stage div inside window
	$('#stage').css({
		left : Math.max((containerWidth - stageWidth) / 2 + controlsWidth, controlsWidth),
		top : (winHeight - stageHeight) / 2,
		visibility : "visible"
	});
	
	//update webgl size
	if (renderer) {
		renderer.setSize(stageWidth, stageHeight);
        if(camera){
		    camera.aspect = stageWidth / stageHeight;
		    camera.updateProjectionMatrix();
        }
	}

	stageCenterX = $('#stage').offset().left + stageWidth / 2;
	stageCenterY = window.innerHeight / 2;
}

function loadSample() {
	inputImage = new Image();
	inputImage.src = ("img/vermeer.jpg");

	inputImage.onload = function() {
		onImageLoaded();
	};
}

function v(x, y, z) {
	return new THREE.Vertex(new THREE.Vector3(x, y, z));
}
