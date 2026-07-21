import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";


export interface LoadedAvatar {
    scene: THREE.Group;
    skeleton: THREE.Skeleton;
}

export class ModelLoader {
    
    static async loadAvatar(path: string): Promise<LoadedAvatar> {
        
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(path);
        
        let skeleton : THREE.Skeleton | undefined;

        gltf.scene.traverse((obj) => {
            if (obj instanceof THREE.SkinnedMesh) {
                skeleton = obj.skeleton;
            }
        })

        if (!skeleton) {
            throw new Error("Deu ruim no esqueleto");
        }

        return {
            scene: gltf.scene,
            skeleton
        };
    }
}