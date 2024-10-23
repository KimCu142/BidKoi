import { useGLTF, useAnimations } from '@react-three/drei';
import { useEffect } from 'react';

export function FishModel2() {
  // Load mô hình cá và các animations từ file GLTF
  const { scene, animations } = useGLTF('/models/koi2/scene.gltf'); // Đường dẫn GLTF cho mô hình koi 2
  const { actions } = useAnimations(animations, scene);

  // Giải phóng tài nguyên WebGL khi component unmount
  useEffect(() => {
    return () => {
      if (scene) {
        scene.traverse((object) => {
          if (object.isMesh) {
            object.geometry.dispose(); // Giải phóng geometry
            if (Array.isArray(object.material)) {
              object.material.forEach((mat) => mat.dispose()); // Giải phóng material nếu là mảng
            } else if (object.material.isMaterial) {
              object.material.dispose(); // Giải phóng material đơn
            }
          }
        });
      }
    };
  }, [scene]);

  // Kích hoạt animation khi component được mount
  useEffect(() => {
    if (actions && actions['MorphBake']) {
      const action = actions['MorphBake'];
      action.play(); // Phát animation
      action.setEffectiveTimeScale(3); // Điều chỉnh tốc độ animation
      return () => {
        if (actions && actions['MorphBake']) {
          actions['MorphBake'].stop(); // Dừng animation khi component unmount
        }
      };
    }
  }, [actions]);

  // Trả về mô hình 3D với scale và rotation tùy chỉnh
  return (
    <>
      <primitive object={scene} scale={0.3} rotation={[Math.PI / 2.7, -0.4, 0.2]} />
    </>
  );
}
