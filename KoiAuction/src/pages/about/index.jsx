/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import styles from "./index.module.scss";
import { motion } from "framer-motion";
import Header from "../../components/header";
import DropDown from "../../components/dropdown";
import DainichiUSALogo from "../../components/logo/dainichiusaLogo";
import SelectkoiLogo from "../../components/logo/selectkoiLogo";
import SelectpondsLogo from "../../components/logo/selectpondsLogo";
import Footer from "../../components/footer";

function AboutUs() {
  const [isExpanded, setIsExpanded] = useState(null);

  const toggleAccordion = (index) => {
    setIsExpanded((prev) => (prev === index ? null : index)); // Đóng nếu đã mở, mở nếu đang đóng
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`Đã sao chép: ${text}`);
    } catch (error) {
      console.error("Không thể sao chép văn bản: ", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <body>
      <div className={styles.appShell}>
        <main className={styles.pageContent}>
          <div>
            <section className={styles.welcomeSection}>
              <motion.div
                className={styles.card}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                custom={1}
              >
                <header className={styles.cardHeader}>
                  Welcome to BidKoi.com!
                </header>
                <div className={styles.cardContent}>
                  <p>
                    BidKoi.com is proud to be your premier destination for
                    Japanese Koi auctions in the VietNam. Our platform is
                    dedicated to connecting Koi enthusiasts and collectors with
                    reputable breeders from Japan, offering an exceptional
                    selection of exquisite Japanese Koi.
                  </p>
                  <p></p>
                  <p>
                    With a deep passion for the artistry and beauty of Koi, we
                    have created an online marketplace that brings together the
                    finest breeders and the most discerning buyers. Our auctions
                    provide a unique opportunity for Koi enthusiasts to acquire
                    top-quality fish directly from renowned breeders in Japan,
                    all from the comfort of their own homes.
                  </p>
                </div>
              </motion.div>

              <div className={styles.accordion}>
                <motion.header
                  className={styles.accordionHeader}
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  custom={2}
                >
                  Frequently Asked Questions
                </motion.header>

                {/* Item 1 */}

                <motion.div
                  className={styles.accordionItem}
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  custom={3}
                >
                  <button
                    className={styles.accordionControl}
                    aria-expanded={isExpanded === 0}
                    onClick={() => toggleAccordion(0)}
                  >
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 512 512"
                      style={{ enableBackground: "new 0 0 512 512" }}
                      xmlSpace="preserve"
                      aria-hidden="true"
                      width="1.75rem"
                      height="1.75rem"
                    >
                      <circle
                        style={{ fill: "#F0F0F0" }}
                        cx="256"
                        cy="256"
                        r="256"
                      ></circle>
                      <circle
                        style={{ fill: "#D80027" }}
                        cx="256"
                        cy="256"
                        r="111.304"
                      ></circle>
                    </svg>
                    <p className={styles.accordionText}>
                      How do Breeder/Japan auctions work?
                    </p>
                    <div
                      className={`${styles.caretIcon} ${
                        isExpanded === 0 ? styles.rotate : ""
                      }`}
                    >
                      <DropDown />
                    </div>
                  </button>
                  <div
                    className={styles.accordionPanel}
                    style={{ display: isExpanded === 0 ? "block" : "none" }}
                    aria-hidden={isExpanded !== 0}
                  >
                    <p>
                      During a breeder auction, koi are not yet in the United
                      States and are still in Japan. Koi that are won are then
                      shipped to the United States, quarantined for 4+ weeks by
                      regulation, and shipped via Delta Cargo to the buyer. The
                      buyer is responsible for all shipping and handling fees
                      which are invoiced post auction. We will contact you via
                      phone or email to arrange a preferred shipping time,
                      location, and payment.
                    </p>
                  </div>
                </motion.div>

                {/* Item 2 */}

                <motion.div
                  className={styles.accordionItem}
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  custom={4}
                >
                  <button
                    className={styles.accordionControl}
                    aria-expanded={isExpanded === 1}
                    onClick={() => toggleAccordion(1)}
                  >
                    <svg
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      viewBox="0 0 512 512"
                      style={{ enableBackground: "new 0 0 512 512" }}
                      xmlSpace="preserve"
                      aria-hidden="true"
                      width="1.75rem"
                      height="1.75rem"
                    >
                      <circle
                        style={{ fill: "#D80027" }}
                        cx="256"
                        cy="256"
                        r="256"
                      ></circle>
                      <polygon
                        style={{ fill: "#FFDA44" }}
                        points="256,133.565 283.628,218.594 373.033,218.594 300.702,271.144 328.33,356.174 256,303.623 
      183.67,356.174 211.298,271.144 138.968,218.594 228.372,218.594"
                      ></polygon>
                    </svg>
                    <p className={styles.accordionText}>
                      How do In-House/VietNam auctions work?
                    </p>
                    <div
                      className={`${styles.caretIcon} ${
                        isExpanded === 1 ? styles.rotate : ""
                      }`}
                    >
                      <DropDown />
                    </div>
                  </button>
                  <div
                    className={styles.accordionPanel}
                    style={{ display: isExpanded === 1 ? "block" : "none" }}
                    aria-hidden={isExpanded !== 1}
                  >
                    <p>
                      During an In-House auction, Japanese koi are already in
                      the United States and are ready to be shipped to the buyer
                      shortly after an auction has completed. The buyer is
                      responsible for all shipping and handling fees which are
                      invoiced post auction. We will contact you via phone or
                      email to arrange a preferred shipping time, location, and
                      payment.
                    </p>
                  </div>
                </motion.div>

                {/* Item 3 */}

                <motion.div
                  className={styles.accordionItem}
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  custom={5}
                >
                  <button
                    className={styles.accordionControl}
                    aria-expanded={isExpanded === 2}
                    onClick={() => toggleAccordion(2)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1.75rem"
                      height="1.75rem"
                      viewBox="0 0 24 24"
                      className="iconify iconify--majesticons"
                    >
                      <path
                        fill="none"
                        stroke="#D4163C"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 8l8-5l4 2.5M4 8v8l8 5M4 8l4 2.5m4 2.5l8-5m-8 5v8m0-8l-4-2.5M20 8v8l-8 5m8-13l-4-2.5m-8 5l8-5"
                      />
                    </svg>
                    <p className={styles.accordionText}>
                      How does shipping work and how much does it cost?
                    </p>
                    <div
                      className={`${styles.caretIcon} ${
                        isExpanded === 2 ? styles.rotate : ""
                      }`}
                    >
                      <DropDown />
                    </div>
                  </button>
                  <div
                    className={styles.accordionPanel}
                    style={{ display: isExpanded === 2 ? "block" : "none" }}
                    aria-hidden={isExpanded !== 2}
                  >
                    <p>
                      When you win a koi, we will reach out to you to schedule a
                      shipping date for which the default method is Delta Cargo.
                      Shipping costs vary depending on the size of the koi and
                      the type of auction you are participating in. A deposit
                      will be charged per koi won at the end of each auction to
                      cover the cost of shipping which varies from shipment to
                      shipment. The deposit amount will be $250 for Japanese
                      Breeder auctions and $130 for In-House auctions. Shipping
                      costs are assessed post-auction and any additional fees or
                      refunds will be invoiced seperately.
                    </p>
                  </div>
                </motion.div>

                {/* Item 4 */}

                <motion.div
                  className={styles.accordionItem}
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  custom={6}
                >
                  <button
                    className={styles.accordionControl}
                    aria-expanded={isExpanded === 3}
                    onClick={() => toggleAccordion(3)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1.75rem"
                      height="1.75rem"
                      viewBox="0 0 24 24"
                      className="iconify iconify--majesticons"
                    >
                      <path
                        fill="none"
                        stroke="#D4163C"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12h4l3 7l4-14l3 7h4"
                      />
                    </svg>
                    <p className={styles.accordionText}>
                      What happens if my koi passes away in transit?
                    </p>
                    <div
                      className={`${styles.caretIcon} ${
                        isExpanded === 3 ? styles.rotate : ""
                      }`}
                    >
                      <DropDown />
                    </div>
                  </button>
                  <div
                    className={styles.accordionPanel}
                    style={{ display: isExpanded === 3 ? "block" : "none" }}
                    aria-hidden={isExpanded !== 3}
                  >
                    <p>
                      If your koi passes away in transit from a Breeder to the
                      US or in quarantine at our facility, you will be credited
                      the amount paid for your loss to your auctionkoi.com
                      account to bid on future auctions. In the event your koi
                      passes away in transit from our US location to your
                      location, the cost of the Koi is unfortunately not
                      normally able to be refunded or credited.
                    </p>
                  </div>
                </motion.div>

                {/* Item 5 */}

                <motion.div
                  className={styles.accordionItem}
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  custom={7}
                >
                  <button
                    className={styles.accordionControl}
                    aria-expanded={isExpanded === 4}
                    onClick={() => toggleAccordion(4)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1.75rem"
                      height="1.75rem"
                      viewBox="0 0 24 24"
                      className="iconify iconify--majesticons"
                    >
                      <g
                        fill="none"
                        stroke="#D4163C"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      >
                        <path d="M19 22v-7.1a7 7 0 0 0-2.052-4.95L14.998 8v6.587c0 .89-1.077 1.337-1.707.707L11.996 14c-.5-.5-1.701-.8-2.502 0s-.5 2 0 2.5l5.504 5.5"></path>
                        <path d="M11 2h2a2 2 0 0 1 2 2v2m-4-4c0 1.333.8 4 4 4m-4-4H9m6 4v6M5 12v2a2 2 0 0 0 2 2h2c0-1.333-.8-4-4-4m0 0V6m4-4H7a2 2 0 0 0-2 2v2m4-4c0 1.333-.8 4-4 4"></path>
                        <circle
                          cx="10"
                          cy="9"
                          r="1"
                          transform="rotate(90 10 9)"
                        ></circle>
                      </g>
                    </svg>
                    <p className={styles.accordionText}>
                      When are payments due after an auction?
                    </p>
                    <div
                      className={`${styles.caretIcon} ${
                        isExpanded === 4 ? styles.rotate : ""
                      }`}
                    >
                      <DropDown />
                    </div>
                  </button>
                  <div
                    className={styles.accordionPanel}
                    style={{ display: isExpanded === 4 ? "block" : "none" }}
                    aria-hidden={isExpanded !== 4}
                  >
                    <p>
                      Payments are due within 48 hours of an auction ending. We
                      will attempt to charge your payment method on file
                      automatically, if the payment fails we may contact you via
                      phone or email to arrange payment. If payment is not
                      recieved, auctionkoi.com reserves the right to cancel your
                      order and re-list the koi for auction.
                    </p>
                  </div>
                </motion.div>

                {/* Item 6 */}

                <motion.div
                  className={styles.accordionItem}
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  custom={8}
                >
                  <button
                    className={styles.accordionControl}
                    aria-expanded={isExpanded === 5}
                    onClick={() => toggleAccordion(5)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1.75rem"
                      height="1.75rem"
                      viewBox="0 0 24 24"
                      className="iconify iconify--majesticons"
                    >
                      <g
                        fill="none"
                        stroke="#D4163C"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="9"></circle>
                        <path d="M12 7v3.764a2 2 0 0 0 1.106 1.789L16 14"></path>
                      </g>
                    </svg>
                    <p className={styles.accordionText}>
                      How long can I expect to wait before my koi is shipped?
                    </p>
                    <div
                      className={`${styles.caretIcon} ${
                        isExpanded === 5 ? styles.rotate : ""
                      }`}
                    >
                      <DropDown />
                    </div>
                  </button>
                  <div
                    className={styles.accordionPanel}
                    style={{ display: isExpanded === 5 ? "block" : "none" }}
                    aria-hidden={isExpanded !== 5}
                  >
                    <p>
                      For Breeder auctions, please expect to wait 6-8+ weeks
                      before your koi is shipped to you. This is due to the koi
                      being prepared and shipped from Japan to the US, then
                      quarantined for 4+ weeks by regulation before shipping
                      again to your location. For In-House auctions, please
                      expect to wait 1-2 weeks before your koi is shipped to you
                      after an auction has ended. We will contact you via phone
                      or email to arrange a preferred shipping time, location,
                      and payment when the shipment is prepared.
                    </p>
                  </div>
                </motion.div>

                {/* Item 7 */}

                <motion.div
                  className={styles.accordionItem}
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  custom={9}
                >
                  <button
                    className={styles.accordionControl}
                    aria-expanded={isExpanded === 6}
                    onClick={() => toggleAccordion(6)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1.75rem"
                      height="1.75rem"
                      viewBox="0 0 24 24"
                      className="iconify iconify--majesticons"
                    >
                      <path
                        fill="none"
                        stroke="#D4163C"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 19v-8.5a1 1 0 0 0-.4-.8l-7-5.25a1 1 0 0 0-1.2 0l-7 5.25a1 1 0 0 0-.4.8V19a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1"
                      ></path>
                    </svg>
                    <p className={styles.accordionText}>
                      Do you offer boarding if I can not recieve my koi right
                      away?
                    </p>
                    <div
                      className={`${styles.caretIcon} ${
                        isExpanded === 6 ? styles.rotate : ""
                      }`}
                    >
                      <DropDown />
                    </div>
                  </button>
                  <div
                    className={styles.accordionPanel}
                    style={{ display: isExpanded === 6 ? "block" : "none" }}
                    aria-hidden={isExpanded !== 6}
                  >
                    <p>
                      Yes, boarding is avaliable for an additional fee. If you
                      would like to board your fish for the winter time, we will
                      hold them in our mud pond for $50/month per fish. Koi fish
                      in the mud pond can not then be harvested again until the
                      spring time. If you are wishing to board your koi for a
                      shorter period of time, we also offer indoor boarding for
                      $75/month per koi which can then be shipped at any time.
                    </p>
                  </div>
                </motion.div>

                {/* Item 8 */}

                <motion.div
                  className={styles.accordionItem}
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  custom={10}
                >
                  <button
                    className={styles.accordionControl}
                    aria-expanded={isExpanded === 7}
                    onClick={() => toggleAccordion(7)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1.75rem"
                      height="1.75rem"
                      viewBox="0 0 24 24"
                      className="iconify iconify--majesticons"
                    >
                      <path
                        fill="none"
                        stroke="#D4163C"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 14c0 4-7 7-7 7s-7-3-7-7V5c1.5.167 5 0 7-2c2 2 5.5 2.167 7 2zm-7-5v3m0 3v-3m0 0h3m-3 0H9"
                      ></path>
                    </svg>
                    <p className={styles.accordionText}>
                      Is there bid sniping protection?
                    </p>
                    <div
                      className={`${styles.caretIcon} ${
                        isExpanded === 7 ? styles.rotate : ""
                      }`}
                    >
                      <DropDown />
                    </div>
                  </button>
                  <div
                    className={styles.accordionPanel}
                    style={{ display: isExpanded === 7 ? "block" : "none" }}
                    aria-hidden={isExpanded !== 7}
                  >
                    <p>
                      Yes, bids made in the final 5 minutes of the auction will
                      add 5 minutes to the time remaining to bid for that
                      specific koi.
                    </p>
                  </div>
                </motion.div>

                {/* Item 9 */}

                <motion.div
                  className={styles.accordionItem}
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  custom={11}
                >
                  <button
                    className={styles.accordionControl}
                    aria-expanded={isExpanded === 8}
                    onClick={() => toggleAccordion(8)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1.75rem"
                      height="1.75rem"
                      viewBox="0 0 24 24"
                      className="iconify iconify--majesticons"
                    >
                      <g
                        fill="none"
                        stroke="#D4163C"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      >
                        <path d="M21 9V4l-6 4l-6-4l-6 4v12l6-4l1 .667"></path>
                        <path d="M21 15c0 2.611-4 6-4 6s-4-3.389-4-6s1.79-4 4-4s4 1.389 4 4m-4 .001"></path>
                      </g>
                    </svg>
                    <p className={styles.accordionText}>
                      I am outside of the VietNam. Am I still eligible to bid?
                    </p>
                    <div
                      className={`${styles.caretIcon} ${
                        isExpanded === 8 ? styles.rotate : ""
                      }`}
                    >
                      <DropDown />
                    </div>
                  </button>
                  <div
                    className={styles.accordionPanel}
                    style={{ display: isExpanded === 8 ? "block" : "none" }}
                    aria-hidden={isExpanded !== 8}
                  >
                    <p>
                      Currently we are only able to ship auction koi to
                      locations within the VietNam. We are working on expanding
                      our shipping capabilities to other countries in the
                      future. In the meantime, please check out our parent site
                      SelectKoi.com and contact us to see if we are able to ship
                      to your location and discuss any additional requirements.
                    </p>
                  </div>
                </motion.div>
              </div>
            </section>

            <motion.section
              className={styles.contactSection}
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              custom={12}
            >
              <header className={styles.sectionHeader}>Contact Us</header>
              <div className={styles.contactInfo}>
                <div className={styles.contactBox}>
                  <a href="tel:8658767474" className={styles.contactItem}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1.25rem"
                      height="1.25rem"
                      viewBox="0 0 24 24"
                      className="iconify iconify--majesticons"
                    >
                      <path
                        fill="none"
                        stroke="#15171f"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 18.675c1.93.83 4.242 1.325 7 1.325v-4l-4-1zm0 0C9.159 17.023 6.824 14.045 5.5 11m0 0C4.4 8.472 4 5.898 4 4h4l1 4z"
                      ></path>
                    </svg>
                    <span className={styles.contactText}>
                      +1 (865) 876-7474
                    </span>
                  </a>
                  <button
                    className={styles.btnIcon}
                    tabIndex="-1"
                    onClick={() => copyToClipboard("+1 (865) 876-7474")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1.25rem"
                      height="1.25rem"
                      viewBox="0 0 24 24"
                      className="iconify iconify--majesticons"
                    >
                      <path
                        fill="none"
                        stroke="#15171f"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M8 5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v0M8 5a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v0"
                      />
                    </svg>
                  </button>
                </div>
                <div className={styles.contactBox}>
                  <a
                    href="mailto:contact@bidkoi.com"
                    className={styles.contactItem}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1.25rem"
                      height="1.25rem"
                      viewBox="0 0 24 24"
                      className="iconify iconify--majesticons"
                    >
                      <path
                        fill="none"
                        stroke="#15171f"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 9l3.75 3a2 2 0 0 0 2.5 0L17 9m4 8V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2"
                      ></path>
                    </svg>
                    <span className={styles.contactText}>
                      contact@bidkoi.com
                    </span>
                  </a>
                  <button
                    className={styles.btnIcon}
                    tabIndex="-1"
                    onClick={() => copyToClipboard("contact@bidkoi.com")}
                  >
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1.25rem"
                      height="1.25rem"
                      viewBox="0 0 24 24"
                      className="iconify iconify--majesticons"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M8 5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v0M8 5a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.section>
          </div>
          {/* ============================== sponssor ================================ */}

          <motion.div
            className={styles.container}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            custom={13}
          >
            <h1 className={styles.title}>Check out our other sites!</h1>
            <div className={styles.logoCloud}>
              {/* Link to dainichiusa.com */}
              <a
                href="https://dainichiusa.com"
                target="_blank"
                rel="noreferrer"
                className={styles.logoItem1}
              >
                <span className={styles.logo}>
                  <DainichiUSALogo className={styles.detailLogo} />
                </span>
              </a>

              {/* Link to selectkoi.com */}
              <a
                href="https://selectkoi.com"
                target="_blank"
                rel="noreferrer"
                className={styles.logoItem2}
              >
                <span className={styles.logo}>
                  <SelectkoiLogo className={styles.detailLogo} />
                </span>
              </a>

              {/* Link to selectponds.com */}
              <a
                href="https://selectponds.com"
                target="_blank"
                rel="noreferrer"
                className={styles.logoItem3}
              >
                <span className={styles.logo}>
                  <SelectpondsLogo className={styles.detailLogo} />
                </span>
              </a>
            </div>
          </motion.div>
        </main>
      </div>
    </body>
  );
}

export default AboutUs;
