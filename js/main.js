let camera, scene, renderer;
let cube;
const AMOUNT = 4; //cantidad de recuadros a visualizar

            init();
            
function init() {

    const ASPECT_RATIO = window.innerWidth / window.innerHeight;

    const WIDTH = ( window.innerWidth / AMOUNT ) * window.devicePixelRatio;
    const HEIGHT = ( window.innerHeight / AMOUNT ) * window.devicePixelRatio;

    const cameras = [];

    for ( let y = 0; y < AMOUNT; y ++ ) {

        for ( let x = 0; x < AMOUNT; x ++ ) {

            const subcamera = new THREE.PerspectiveCamera( 30, ASPECT_RATIO, 0.1, 10 ); //tamaño del cilindro
            subcamera.viewport = new THREE.Vector4( Math.floor( x * WIDTH ), Math.floor( y * HEIGHT ), Math.ceil( WIDTH ), Math.ceil( HEIGHT ) );
            subcamera.position.x = ( x / AMOUNT ) - 0.5;
            subcamera.position.y = 0.5 - ( y / AMOUNT );
            subcamera.position.z = 1.5;
            subcamera.position.multiplyScalar( 2 );
            subcamera.lookAt( 0, 0, 0 );
            subcamera.updateMatrixWorld();
            cameras.push( subcamera );

        }

    }

    camera = new THREE.ArrayCamera( cameras );
    camera.position.z = 3;

    scene = new THREE.Scene();

    scene.add( new THREE.AmbientLight( 0x222244 ) );

    const light = new THREE.DirectionalLight();
    light.position.set( 0.5, 0.5, 1 );
    light.castShadow = true;
    light.shadow.camera.zoom = 4; // tighter shadow map
    scene.add( light );

    const geometryBackground = new THREE.PlaneGeometry( 100, 100 );
    const materialBackground = new THREE.MeshPhongMaterial( { color: 0x6da9df } ); //color de fondo

    const background = new THREE.Mesh( geometryBackground, materialBackground );
    background.receiveShadow = true;
    background.position.set( 0, 0, - 1 );
    scene.add( background );

    const geometry = new THREE.BoxGeometry();  //figura geometrica
    const material = new THREE.MeshPhongMaterial( { color: 0x68927b } ); //color del cilindro

    cube = new THREE.Mesh( geometry, material );


    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add( cube );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    document.body.appendChild( renderer.domElement );

    //

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    const ASPECT_RATIO = window.innerWidth / window.innerHeight;
    const WIDTH = ( window.innerWidth / AMOUNT ) * window.devicePixelRatio;
    const HEIGHT = ( window.innerHeight / AMOUNT ) * window.devicePixelRatio;

    camera.aspect = ASPECT_RATIO;
    camera.updateProjectionMatrix();

    for ( let y = 0; y < AMOUNT; y ++ ) {

        for ( let x = 0; x < AMOUNT; x ++ ) {

            const subcamera = camera.cameras[ AMOUNT * y + x ];

            subcamera.viewport.set(
                Math.floor( x * WIDTH ),
                Math.floor( y * HEIGHT ),
                Math.ceil( WIDTH ),
                Math.ceil( HEIGHT ) );

            subcamera.aspect = ASPECT_RATIO;
            subcamera.updateProjectionMatrix();

        }

    }

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.03;
    cube.rotation.y += 0.03;

    renderer.render(scene, camera);
};

animate();