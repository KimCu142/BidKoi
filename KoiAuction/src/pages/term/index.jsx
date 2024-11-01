import React from "react";
import styles from "./index.module.scss";
import { motion } from "framer-motion";

function Terms() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };
  return (
    <body>
      <div className={styles.appShell}>
        <div className={styles.Content}>
          <main className={styles.pageContent}>
            <section className={styles.privacyPolicySection}>
              <div className={styles.privacyPolicyContainer}>
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  Terms of Service Agreement for BidKoi.com
                </motion.h1>

                <motion.ol
                  className={styles.policyList}
                  variants={containerVariants}
                >
                  <motion.li
                    className={styles.sectionTitle}
                    variants={itemVariants}
                  >
                    Acceptance of Terms
                  </motion.li>
                  <motion.h3
                    className={styles.sectionDescription}
                    variants={itemVariants}
                  >
                    {
                      'By using AuctionKoi.com ("the Site"), you agree to be bound by the following Terms of Service ("the Terms"). These Terms apply to all users of the Site and govern your access and use of the Site and the services provided therein, including the koi auction services. If you do not agree to these Terms, you must discontinue your use of the Site and services.'
                    }
                  </motion.h3>

                  <motion.li
                    className={styles.sectionTitle}
                    variants={itemVariants}
                  >
                    Registration
                  </motion.li>
                  <motion.h3
                    className={styles.sectionDescription}
                    variants={itemVariants}
                  >
                    To access certain features of the Site and participate in
                    koi auctions, you will need to register an account with
                    AuctionKoi.com. By registering, you warrant that you have
                    provided true and accurate information and agree to keep
                    your account information up-to-date.
                  </motion.h3>

                  <motion.div variants={containerVariants}>
                    <motion.li
                      className={styles.sectionTitle}
                      variants={itemVariants}
                    >
                      Compliance with Applicable Laws
                    </motion.li>
                    <motion.h3
                      className={styles.sectionDescription}
                      variants={itemVariants}
                    >
                      As we offer our services to users across various states in
                      the United States, it is your responsibility to ensure
                      compliance with all applicable local, state, and federal
                      laws and regulations when using our Site and services.
                    </motion.h3>
                  </motion.div>

                  <motion.div variants={containerVariants}>
                    <motion.li
                      className={styles.sectionTitle}
                      variants={itemVariants}
                    >
                      Bidding and Auction Terms
                    </motion.li>
                    <motion.h3
                      className={styles.sectionDescription}
                      variants={itemVariants}
                    >
                      All bids placed on our Site are final and binding. Upon
                      winning a koi auction, you are obligated to make a payment
                      for the koi won, according to the terms set out below.
                    </motion.h3>
                  </motion.div>

                  <motion.li
                    className={styles.sectionTitle}
                    variants={itemVariants}
                  >
                    Payment Terms
                  </motion.li>
                  <motion.h3
                    className={styles.sectionDescription}
                    variants={itemVariants}
                  >
                    Payments for koi won in auction must be made within 48 hours
                    of the auction&apos;s completion. If payment is not received
                    within 7 business days of the auction&apos;s completion, we
                    reserve the right to cancel the transaction and the koi may
                    not be guaranteed to ship.
                  </motion.h3>

                  <motion.li
                    className={styles.sectionTitle}
                    variants={itemVariants}
                  >
                    Shipping and Delivery
                  </motion.li>
                  <motion.h3
                    className={styles.sectionDescription}
                    variants={itemVariants}
                  >
                    Koi purchased on our Site will be shipped and received in
                    accordance with the associated Breeder&apos;s best practices
                    and quarantine procedures. We will make every effort to
                    ensure the safe and timely arrival of your koi, but we
                    cannot guarantee their survival during shipping and
                    receiving from Japan as well as shipping from our US
                    facility to the winner.
                  </motion.h3>

                  <motion.li
                    className={styles.sectionTitle}
                    variants={itemVariants}
                  >
                    Credits and Guarantees
                  </motion.li>
                  <motion.h3
                    className={styles.sectionDescription}
                    variants={itemVariants}
                  >
                    In the unfortunate event that your koi dies during shipping
                    and receiving from Japan, you will be provided with a credit
                    towards future purchases on our Site. Once the koi has been
                    imported into the United States, we do not offer any further
                    guarantees, refunds, or credits for the koi purchased.
                  </motion.h3>

                  <motion.li
                    className={styles.sectionTitle}
                    variants={itemVariants}
                  >
                    Indemnification
                  </motion.li>
                  <motion.h3
                    className={styles.sectionDescription}
                    variants={itemVariants}
                  >
                    You agree to indemnify, defend, and hold harmless
                    AuctionKoi.com, its affiliates, and their respective
                    officers, employees, and agents from any and all claims,
                    losses, or damages arising out of your breach of these Terms
                    or your use of the Site or services.
                  </motion.h3>

                  <motion.li
                    className={styles.sectionTitle}
                    variants={itemVariants}
                  >
                    Governing Law and Jurisdiction
                  </motion.li>
                  <motion.h3
                    className={styles.sectionDescription}
                    variants={itemVariants}
                  >
                    These Terms shall be governed by and construed in accordance
                    with the laws of the United States, without regard to
                    principles of conflict of laws. Any disputes arising from or
                    relating to these Terms, the Site, or services shall be
                    resolved by a court of competent jurisdiction in the United
                    States.
                  </motion.h3>

                  <motion.li
                    className={styles.sectionTitle}
                    variants={itemVariants}
                  >
                    Modifications to Terms
                  </motion.li>
                  <motion.h3
                    className={styles.sectionDescription}
                    variants={itemVariants}
                  >
                    We reserve the right to modify these Terms at any time
                    without prior notice. Your continued use of the Site and our
                    services will signify your acceptance of the updated Terms.
                  </motion.h3>

                  <motion.li
                    className={styles.sectionTitle}
                    variants={itemVariants}
                  >
                    Contact Us
                  </motion.li>
                  <motion.h3
                    className={styles.sectionDescription}
                    variants={itemVariants}
                  >
                    If you have any questions or concerns regarding this Privacy
                    Policy or our practices, please contact us at:
                  </motion.h3>
                  <motion.ul
                    className={styles.contactInfo}
                    variants={containerVariants}
                  >
                    {[
                      { text: "BidKoi.com" },
                      { text: "Select Koi Inc." },
                      { text: "2253 Boyds Creek Hwy" },
                      { text: "Sevierville, TN 36876" },
                      {
                        text: "+1 (865)-437-9242",
                        link: "tel:+1 (865)-437-9242",
                      },
                      {
                        text: "contact@auctionkoi.com",
                        link: "mailto:contact@auctionkoi.com",
                      },
                    ].map((item, index) => (
                      <motion.li key={index} variants={itemVariants}>
                        {item.link ? (
                          <a href={item.link}>{item.text}</a>
                        ) : (
                          item.text
                        )}
                      </motion.li>
                    ))}
                  </motion.ul>

                  <motion.h3
                    className={styles.closingMessage}
                    variants={itemVariants}
                  >
                    Thank you for choosing BidKoi.com for your koi fish
                    purchase. We take your privacy seriously and are committed
                    to providing a secure and enjoyable experience.
                  </motion.h3>
                </motion.ol>
              </div>
            </section>
          </main>
        </div>
      </div>
    </body>
  );
}

export default Terms;
