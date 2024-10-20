import { useGLTF, useAnimations, Preload } from '@react-three/drei';
import { useEffect } from 'react';

export function FishModel2() {
  // Load mô hình cá và các animations từ file GLTF
  const { scene, animations } = useGLTF('/models/koi2/scene.gltf'); // Đường dẫn GLTF cho mô hình koi 2
  const { actions } = useAnimations(animations, scene);

  // Kích hoạt animation khi component được mount
  useEffect(() => {
    let timeout;
    if (actions && actions['MorphBake']) {
      const action = actions['MorphBake'];
      action.play(); // Phát animation
      action.setEffectiveTimeScale(3); 
      // Dừng animation sau 6 giây
       timeout = setTimeout(() => {
        action.paused = true; // Tạm dừng animation
        action.time = 5.8; // Thiết lập thời gian dừng tại giây 5.8
      }, 5800);

      // Cleanup khi component unmount
      return () => {
        if (timeout) clearTimeout(timeout);
        if (actions && actions['MorphBake']) {
          actions['MorphBake'].stop(); // Dừng hoàn toàn action khi component unmount
        }
    
      };
    }
  }, [actions]);

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

  // Trả về mô hình 3D với scale và rotation tùy chỉnh
  return (
    <>
      <primitive object={scene} scale={0.3} rotation={[Math.PI / 2.7, -0.4, 0.2]} />

    </>
  );
}
