import React from "react";
import styles from "./index.module.scss";

const logos = [
  {
    name: "NND",
    src: "https://firebasestorage.googleapis.com/v0/b/bidkoi-16827.appspot.com/o/breeder_logo%2Fnnd-logo.png?alt=media&token=2d912e6f-d996-4503-9413-663a07e1939a",
  },
  {
    name: "Marushin",
    src: "https://firebasestorage.googleapis.com/v0/b/bidkoi-16827.appspot.com/o/breeder_logo%2Fmarushin-logo.png?alt=media&token=60482d9d-32e1-4827-a6c1-e9ab3241a41c",
  },
  {
    name: "Sakai",
    src: "https://firebasestorage.googleapis.com/v0/b/bidkoi-16827.appspot.com/o/breeder_logo%2Fsakai-logo.png?alt=media&token=c8f515b6-52b3-4aaa-9f48-5d37a0b285b7",
  },
  {
    name: "Isa",
    src: "https://firebasestorage.googleapis.com/v0/b/bidkoi-16827.appspot.com/o/breeder_logo%2Fisa-logo.png?alt=media&token=7493e683-d01f-4090-a903-d9150305e3b5",
  },
  {
    name: "Maruhiro",
    src: "https://firebasestorage.googleapis.com/v0/b/bidkoi-16827.appspot.com/o/breeder_logo%2Fmaruhiro-logo.png?alt=media&token=25732091-cedc-4c63-ac96-1e3d0a9b8a73",
  },
  {
    name: "Torazo",
    src: "https://firebasestorage.googleapis.com/v0/b/bidkoi-16827.appspot.com/o/breeder_logo%2Ftorazo-logo.png?alt=media&token=cb085e1b-74e3-42ae-91f8-172abd6ac1aa",
  },
  {
    name: "Shinoda",
    src: "https://firebasestorage.googleapis.com/v0/b/bidkoi-16827.appspot.com/o/breeder_logo%2Fshinoda-logo.png?alt=media&token=9e4a873a-219f-47fa-9c91-0996128d78aa",
  },
  {
    name: "Kanno",
    src: "https://firebasestorage.googleapis.com/v0/b/bidkoi-16827.appspot.com/o/breeder_logo%2Fkanno-logo.png?alt=media&token=2f166597-3062-4518-a993-5c88e18180ca",
  },
  {
    name: "Dainichi",
    src: "https://firebasestorage.googleapis.com/v0/b/bidkoi-16827.appspot.com/o/breeder_logo%2Fdainichi-logo.png?alt=media&token=172e7958-1f9c-4ef2-b0d7-93b77ac8493c",
  },
  {
    name: "Omosako",
    src: "https://firebasestorage.googleapis.com/v0/b/bidkoi-16827.appspot.com/o/breeder_logo%2Fomosako-logo.png?alt=media&token=c886d950-43ed-480c-b107-899198fc5f3c",
  },
  {
    name: "Izumiya",
    src: "https://firebasestorage.googleapis.com/v0/b/bidkoi-16827.appspot.com/o/breeder_logo%2Fizumiya-logo.png?alt=media&token=f95914d2-47dc-4a77-b06c-0acdd861c333",
  },
  {
    name: "Marudo",
    src: "https://firebasestorage.googleapis.com/v0/b/bidkoi-16827.appspot.com/o/breeder_logo%2Fmarudo-logo.png?alt=media&token=efca44ad-70e7-4b6d-887b-2857a3626fb5",
  },
  {
    name: "Marujyu",
    src: "https://firebasestorage.googleapis.com/v0/b/bidkoi-16827.appspot.com/o/breeder_logo%2Fmarujyu-logo.png?alt=media&token=83944beb-bf3c-4455-9114-321e6db9b805",
  },
  {
    name: "Shintaro",
    src: "https://firebasestorage.googleapis.com/v0/b/bidkoi-16827.appspot.com/o/breeder_logo%2Fshintaro-logo.png?alt=media&token=971e6e11-725f-44f2-a0e6-bc1ec59a0bed",
  },
];

const BreederLogo = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logoGrid}>
        {logos.map((logo, index) => (
          <div key={index} className={styles.logoCard}>
            <img className={styles.logoImg} src={logo.src} alt={logo.name} />
            <span className={styles.logoName}>{logo.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BreederLogo;
