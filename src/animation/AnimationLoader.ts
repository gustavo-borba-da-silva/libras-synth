import * as THREE from "three";

export class AnimationLoader {


    loadAnimationSequence = (model: THREE.Object3D) => {

        const animationMixer = new THREE.AnimationMixer(model);

        // Try to see if the animation is constructable using animation mixers.
        // (Probably not, since I have to make the transitions smoother than the standard does)

    }
    

}