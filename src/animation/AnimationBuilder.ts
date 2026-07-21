import * as THREE from "three";
import { ModelLoader } from "../loaders/ModelLoader";


export interface JSONAnimation {
    fps: number;
    bones: Record<string, [number, number, number, number][]>;
}

export interface BuiltAnimation {
    gloss: string;
    frameCount: number;
    fps: number;
    bones: Map<string, THREE.Quaternion[]>;
}

export class AnimationBuilder {

    static build(gloss: string, rawJson: JSONAnimation) : BuiltAnimation {
        const bones = new Map<string, THREE.Quaternion[]>;
        let maxFrameCount = 0;


        for (const [boneName, frames] of Object.entries(rawJson.bones)) {
            const quaternions: THREE.Quaternion[] = new Array(frames.length);

            for (let i = 0; i < frames.length; i++) {
                const [x, y, z, w] = frames[i];
                quaternions[i] = new THREE.Quaternion(x, y, z, w).normalize();
            }

            bones.set(boneName, quaternions);
            maxFrameCount = Math.max(maxFrameCount, frames.length);
        }
        
        return {
            gloss,
            fps: rawJson.fps,
            frameCount: maxFrameCount,
            bones,
        };
    }

}