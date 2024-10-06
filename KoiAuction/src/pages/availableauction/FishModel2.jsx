import { useGLTF, useAnimations } from '@react-three/drei';
import { useEffect } from 'react';

export function FishModel2() {
  // Load mô hình cá và các animations từ file GLTF
  const { scene, animations } = useGLTF('/models/koi2/scene.gltf'); 
  const { actions } = useAnimations(animations, scene);

  // Kích hoạt animation khi component được mount
  useEffect(() => {
    if (actions && actions['MorphBake']) {
      const action = actions['MorphBake'];

      action.setEffectiveTimeScale(2); // Tăng tốc độ phát gấp đôi
      action.play(); // Kích hoạt animation
      const timeout = setTimeout(() => {
        action.paused = true; // Dừng animation sau 2 giây
        action.time = 5.8; // Thiết lập thời gian dừng tại giây thứ 2
      }, 6000); // 2000ms = 2 giây

      // Xóa bộ đếm thời gian khi component unmount
      return () => clearTimeout(timeout);
    }
  }, [actions]);

  // Điều chỉnh góc độ với thuộc tính rotation
  return <primitive object={scene} scale={0.3} rotation={[Math.PI / 2.7, -0.4, 0.2]} />;
}
