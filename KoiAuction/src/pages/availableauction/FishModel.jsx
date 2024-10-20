import { useGLTF, useAnimations, Preload } from '@react-three/drei';
import { useEffect } from 'react';

export function FishModel() {
  // Load mô hình cá và các animations từ file GLTF
  const { scene, animations } = useGLTF('/models/koi_3/scene.gltf'); // Đường dẫn tương đối từ thư mục public
  const { actions } = useAnimations(animations, scene);

  // Kích hoạt animation khi component được mount
  useEffect(() => {
    let timeout;
  
    if (actions && actions['Take 001']) {
      const action = actions['Take 001'];
      action.play();
  
      // Thiết lập bộ đếm thời gian để dừng animation
      timeout = setTimeout(() => {
        action.paused = true;
        action.time = 5.8; // Dừng ở thời điểm chính xác
      }, 5800);
    }
  
    return () => {
      if (timeout) clearTimeout(timeout); // Dọn dẹp timeout khi component unmount
      if (actions && actions['Take 001']) {
        actions['Take 001'].stop(); // Dừng hoàn toàn action khi component unmount
      }
    };
  }, [actions]);
  

  // Giải phóng tài nguyên WebGL khi component unmount
  useEffect(() => {
    return () => {
      if (scene) {
        scene.traverse((object) => {
          if (object.isMesh) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach((mat) => mat.dispose()); // Giải phóng tất cả các material
            } else if (object.material.isMaterial) {
              object.material.dispose(); // Giải phóng material đơn
            }
          }
        });
      }
    };
  }, [scene]);
  

  // Điều chỉnh góc độ với thuộc tính rotation
  return (
    <>
      <primitive object={scene} scale={0.0005} rotation={[Math.PI / 3, -0.4, 0.2]} />
      
    </>
  );
}
