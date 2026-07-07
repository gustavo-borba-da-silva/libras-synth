import * as THREE from 'three';
import { ModelLoader } from '../loaders/ModelLoader';


export class App {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    renderer = new THREE.WebGLRenderer();
    timer = new THREE.Timer();
    model_path = "/models/Clara.glb";


    async start() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.scene.background = new THREE.Color(0xa0a0a0);
        this.scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

        const hemilight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
        hemilight.position.set(0, 20, 0);
        this.scene.add(hemilight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 3);
        dirLight.position.set(3,10,10);
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 2;
        dirLight.shadow.camera.bottom = -2;
        dirLight.shadow.camera.left = -2;
        dirLight.shadow.camera.right = 2;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 40;
        this.scene.add(dirLight);

        this.camera.position.set(0, 3, 5);
        this.camera.lookAt(0, 1, 0);

        const groundMesh = new THREE.Mesh( new THREE.PlaneGeometry(100, 100), new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false }));
        groundMesh.rotation.x = - Math.PI / 2;
        groundMesh.receiveShadow = true;
        this.scene.add(groundMesh);

        

        const model = await ModelLoader.loadAvatar(this.model_path);
        console.log(model)


        const placeholder = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({
                color: 0xff00ff,
                wireframe: false
            })
        );

        this.scene.add(model? model : placeholder);

        
        
        /* 
        -   Load 3d model
        -   Apply AnimationPlayer
        -   await the phrase to be formed via concatenative synthesis
        
        */


    }

}
