import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";


export class ModelLoader {
    
    static async loadAvatar(path: string) {
        
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(path);
        
        let SkinnedMesh: THREE.SkinnedMesh | null = null;

        gltf.scene.traverse(obj => {
            if (obj instanceof THREE.SkinnedMesh) {
                SkinnedMesh = obj;
            }
        })

        return SkinnedMesh;
    }
}