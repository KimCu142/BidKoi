import { useGLTF, useAnimations } from '@react-three/drei';
import { useEffect } from 'react';

export function FishModel() {
  // Load mô hình cá và các animations từ file GLTF
  const { scene, animations } = useGLTF('/models/koi_3/scene.gltf'); // Đường dẫn tương đối từ thư mục public
  const { actions } = useAnimations(animations, scene);

  // Kích hoạt animation khi component được mount
  useEffect(() => {
    if (actions && actions['Take 001']) {
      const action = actions['Take 001'];

      // Chạy animation và dừng ở giây thứ 2
      action.play();

      // Tạo một bộ đếm thời gian để dừng animation ở giây thứ 2
      const timeout = setTimeout(() => {
        action.paused = true; // Dừng animation sau 2 giây
        action.time = 5.8; // Thiết lập thời gian dừng tại giây thứ 2
      }, 6000); // 2000ms = 2 giây

      // Xóa bộ đếm thời gian khi component unmount
      return () => clearTimeout(timeout);
    }
  }, [actions]);

  // Điều chỉnh góc độ với thuộc tính rotation
  return <primitive object={scene} scale={0.0005} rotation={[Math.PI / 3, -0.4, 0.2]} />;
}
