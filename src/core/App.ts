import * as THREE from 'three';
import * as MODEL_LOADER from '../loaders/ModelLoader.ts'


export class App {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    renderer = new THREE.WebGLRenderer();
    timer = new THREE.Timer();
    model_path = '../../public/models/Clara/CLARA.glb'


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

        const groundMesh = new THREE.Mesh( new THREE.PlaneGeometry(100, 100), new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false }));
        groundMesh.rotation.x = - Math.PI / 2;
        groundMesh.receiveShadow = true;
        this.scene.add(groundMesh);

        var model = MODEL_LOADER.ModelLoader.loadAvatar(this.model_path);

        
        
        /* 
        -   Load 3d model
        -   Apply AnimationPlayer
        -   await the phrase to be formed via concatenative synthesis
        
        */


    }


    animate = () => {
        requestAnimationFrame(this.animate);
        const delta = this.timer.getDelta();
        this.renderer.render(this.scene, this.camera);
    }

}
