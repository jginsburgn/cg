class Bunny extends THREE.Object3D {
    constructor() {
        super();
        this.loadObj();
    }

    loadObj() {
        new THREE.OBJLoader().load(
            './Stanford_Bunny_OBJ-JPG/20180310_KickAir8P_UVUnwrapped_Stanford_Bunny.obj',
            obj => {
                const texture = new THREE.TextureLoader().load(
                    './Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_g005c.jpg'
                );
                obj.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        child.material.map = texture;
                    }
                    child.castShadow = true;
                });
                obj.castShadow = true;
                obj.scale.set(2, 2, 2);
                obj.position.set(0, 0, 0);
                this.add(obj);
            }
        );
    }

}