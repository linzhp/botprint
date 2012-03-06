/* Author: AugmentedDesignLab */

// sort of like global variables
var stage,
stats,
camera,
scene,
renderer,
mouseX = 0,
mouseY = 0,
material,
inputImage,
stageCenterX,
stageCenterY,
canvas,
context,
imageWidth,
imageHeight,
stageWidth,
stageHeight,
enableMouseMove = false;
var coordScene = new THREE.Scene();
var projector = new THREE.Projector();
var sx = 0, sy = 0;
var rotation = 1;

var controller;

// vars accessible only by GUI
var GUIOptions  = function() {
	this.stageSize 	   = 0.8;
    // TODO add rotate left, right, up, and down...
	this.autoRotate    = false;
};

var chassis_selection = function(){
    this.styles   = [];
    //this.explode = function() { ... }
    // this function will have images....
}


var wheels_selection = function(){
    this.message = 'wheels.selection';
    //this.explode = function() { ... }
    // this function will have images....
}



function saveImage() {
	render();
	window.open(renderer.domElement.toDataURL("image/png"));
}

var guiOptions = new GUIOptions();
var ch = new chassis_selection();
var whe = new wheels_selection();


var gui = new dat.GUI({ autoPlace: false });
document.getElementById('controls-container').appendChild(gui.domElement );
var settings = gui.addFolder('General');
settings.add(guiOptions, 'stageSize',0.6,1,.1).onChange(doLayout);
settings.add(this, 'saveImage').name('Save Design');
//settings.open();

var chassis = gui.addFolder('Chassis');

var wheels = gui.addFolder('Wheels');
wheels.add(whe, 'message');



/**
 * Init page
 */
$(document).ready( function() {

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

	$("#loadSample").click( function() {
		loadSample();
	});
	
    //init mouse listeners
	$("#stage").mousemove( onMouseMove);
	$(window).mousewheel( onMouseWheel);
	$(window).keydown(onKeyDown);
	$(window).mousedown( function() {
		enableMouseMove = true;
	});
	$(window).mouseup( function() {
	    enableMouseMove = false;
	});
	
    //init stats
	stats = new Stats();
    // Align bottom-left
    stats.getDomElement().style.position = 'absolute';
    stats.getDomElement().style.left = '0px';
    stats.getDomElement().style.bottom = '0px';
    
    statscontainer = document.getElementById("fps-container");
    
    statscontainer.appendChild(stats.getDomElement());

	doLayout();

	if (!Detector.webgl) {
		$("#overlay").empty();
		Detector.addGetWebGLMessage({
			parent: document.getElementById("overlay")
		});

	} else {
		initWebGL();
	}

});

function initWebGL() {


	//init camera
    camera = new THREE.PerspectiveCamera( 45, 16/9, 1, 10000 );
    camera.position.y = 30;

    //camera.position.z = -1000;
	scene = new THREE.Scene();
    scene.add(camera);
    coordScene.fog = new THREE.FogExp2(0xEEEEEE, 0.0035);

    var lineGeo = new THREE.Geometry();
      lineGeo.vertices.push(
        v(-500, 0, 0), v(500, 0, 0), v(50,0,0), v(45,5,0), v(50,0,0), v(45,-5,0),
        v(0, -500, 0), v(0, 500, 0), v(0,50,0), v(5,45,0), v(0,50,0), v(-5,45,0),
        v(0, 0, -500), v(0, 0, 500), v(0,0,50), v(5,0,45), v(0,0,50), v(-5,0,45)
      );

    var lineMat = new THREE.LineBasicMaterial({color: 0x888888, lineWidth: 1});
    var line = new THREE.Line(lineGeo, lineMat);
    line.type = THREE.Lines;
    coordScene.add(line);  

    var light = new THREE.SpotLight(0xFFFFFF);
    light.position.set(150, 200, 300);
    light.castShadow = true;
    scene.add(light);

    var backlight = new THREE.PointLight(0x333366);
    backlight.position.set(-150, -200, -300);
    scene.add(backlight);

    var ambient = new THREE.AmbientLight(0x808080);
    scene.add(ambient);

	//init renderer
    if(!renderer){

        renderer = new THREE.WebGLRenderer({
		    antialias: true,
		    clearAlpha: 1,
		    sortObjects: false,
		    sortElements: false
	    });
    }


	doLayout();
    stage.appendChild(renderer.domElement);

    doController();
    controller.createNew();
	animate();
    camera.position.x = Math.cos(rotation)*50;
    camera.position.z = Math.sin(rotation)*160;
}

function doController(){
    controller = new THREE.Object3D();
    controller.objects = [];
    controller.scene   = scene;
    controller.gui     = chassis;
    controller.color   = 0xFFFFFF;
    controller.createNew = function() {
        // hide the overlay and then append the rendering of the chassis
        $("#overlay").hide();
        if(!renderer){
	        renderer = new THREE.WebGLRenderer({
		        antialias: true,
		        clearAlpha: 1,
		        sortObjects: false,
		        sortElements: false
	        });
        }
        
        // default chassis is rectangular
        var cube = new THREE.Mesh(
          new THREE.CubeGeometry(20,20,20),
          new THREE.MeshPhongMaterial({color: 0xFFFFFF})
        );
        cube.castShadow = cube.receiveShadow = true;
        this.scene.add(cube);
        this.objects.push(cube);
        this.setCurrent(cube);
    };    

    controller.setCurrent = function(current) {
        if (this.current)
          //this.current.materials[0].ambient.setHex(0x000000);
        this.current = current;
        if (this.current) {
          //this.current.materials[0].ambient.setHex(0x888800);
          this.x.setValue(current.position.x);
          this.y.setValue(current.position.y);
          this.z.setValue(current.position.z);
          this.sX.setValue(current.scale.x);
          this.sY.setValue(current.scale.y);
          this.sZ.setValue(current.scale.z);
        }
    };

    // we could do a proxy to control only the currently selected object.
    controller.proxy = function(propertyChain) {
        var controller = this;
        var tgt = controller;
        for (var i=0; i<propertyChain.length-1; i++) {
          tgt = tgt[propertyChain[i]];
        }
        var last = propertyChain[propertyChain.length-1];
        return this.gui.add(tgt, last).onChange(function(v) {
          var t = controller.current;
          for (var i=0; i<propertyChain.length-1; i++) {
            t = t[propertyChain[i]];
          }
          t[last] = v;
        });
    }


    controller.x = controller.proxy(['position', 'x']).min(-50).max(50);
    controller.y = controller.proxy(['position', 'y']).min(-50).max(50);
    controller.z = controller.proxy(['position', 'z']).min(-50).max(50);

    controller.sX = controller.proxy(['scale', 'x']).min(0.1).max(6).step(0.1).name('Width');
    controller.sY = controller.proxy(['scale', 'y']).min(0.1).max(6).step(0.1).name('Height');
    controller.sZ = controller.proxy(['scale', 'z']).min(0.1).max(6).step(0.1).name('Depth');

    chassis.add(controller, 'createNew');
    chassis.open();
}

function createChassis() {}

function onImageLoaded() {

	// load image into canvas pixels
    // TODO implement me
}

function onMouseMove(event) {
	if (enableMouseMove) {
		mouseX = event.pageX - stageCenterX;
		mouseY = event.pageY - stageCenterY;
	}
}

function onMouseWheel(e,delta) {
	//guiOptions.scale += delta * 0.1;
	//limit
	//guiOptions.scale = Math.max(guiOptions.scale, .1);
	//guiOptions.scale = Math.min(guiOptions.scale, 10);
}

function onKeyDown(evt) {
	//save on 'S' key
	if (event.keyCode == '83') {
		saveImage();
	}
}

function animate() {
	requestAnimationFrame(animate);
	render();
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

	if (guiOptions.stageSize === 1) {
		stageHeight = $('#container').outerHeight();
	}
	$('#stage').width(stageWidth);
	$('#stage').height(stageHeight);

	//Center stage div inside window
	$('#stage').css({
		left: Math.max((containerWidth - stageWidth)/2 + controlsWidth,controlsWidth),
		top: (winHeight - stageHeight)/2,
		visibility:"visible"
	});

	//set webgl size
	if (renderer) {
		renderer.setSize(stageWidth, stageHeight);
		camera.aspect = stageWidth / stageHeight;
		camera.updateProjectionMatrix();
	}

	stageCenterX = $('#stage').offset().left + stageWidth / 2;
	stageCenterY = window.innerHeight / 2
}


function loadSample() {
	inputImage = new Image();
	inputImage.src = ("img/vermeer.jpg");

	inputImage.onload = function() {
		onImageLoaded();
	};
}

function v(x,y,z){ 
    return new THREE.Vertex(new THREE.Vector3(x,y,z)); 
}
