import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase";

const uploadBidderFile = async (file) => {
  const storageRef = ref(storage, `bidderImg/${file.name}`);
  // lưu cái file này lên firebase
  const response = await uploadBytes(storageRef, file);
  // => lấy cái đường dẫn đến file vừa tạo
  const downloadURL = await getDownloadURL(response.ref);
  return downloadURL;
};

export default uploadBidderFile;
