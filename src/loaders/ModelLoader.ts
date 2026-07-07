import { GLTFLoader } from "three/examples/jsm/Addons.js";


export class ModelLoader {
    
    static async loadAvatar(path: string) {
        
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(path);
        
        return gltf.scene;
    }
}