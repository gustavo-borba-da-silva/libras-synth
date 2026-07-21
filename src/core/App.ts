import * as THREE from 'three';
import { ModelLoader } from '../loaders/ModelLoader';
import { OrbitControls } from 'three/examples/jsm/Addons.js';


export class App {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    renderer = new THREE.WebGLRenderer();
    timer = new THREE.Timer();
    model_path = "public/models/CLARA.glb";
    orbitControls = new OrbitControls(this.camera, this.renderer.domElement);

    async start() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        //  --------ILUMINAÇÃO---------

        this.scene.background = new THREE.Color(0xa0a0a0);
        this.scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

        const hemilight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
        hemilight.position.set(0, 20, 0);
        this.scene.add(hemilight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(3,10,10);
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 2;
        dirLight.shadow.camera.bottom = -2;
        dirLight.shadow.camera.left = -2;
        dirLight.shadow.camera.right = 2;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 40;
        this.scene.add(dirLight);


        //  --------CÂMERA---------
        this.camera.position.set(0, 1.45, 0.8);

        this.orbitControls.target.set( 0, 1.5, 0 );
        this.orbitControls.enableDamping = true;
        this.orbitControls.enablePan = false;
        this.orbitControls.maxPolarAngle = Math.PI/2 - 0.05;
        this.orbitControls.update();

        //  --------CHÃO---------

        const groundMesh = new THREE.Mesh( new THREE.PlaneGeometry(100, 100), new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false }));
        groundMesh.rotation.x = - Math.PI / 2;
        groundMesh.receiveShadow = true;
        this.scene.add(groundMesh);

        


        const placeholder = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({
                color: 0xff00ff,
                wireframe: false
            })
        );

        const model = await ModelLoader.loadAvatar(this.model_path);

        this.scene.add(model.scene? model.scene : placeholder);

        this.animate();


        /* 
        -   Load 3d model
        -   Apply AnimationPlayer
        -   await the phrase to be formed via concatenative synthesis
        
        */


    }

    animate = () => {
    requestAnimationFrame(this.animate);

    this.orbitControls.update();
    this.renderer.render(this.scene, this.camera);

}

}
