import React from "react";
import styles from "./index.module.scss";
import { motion } from "framer-motion";

function PrivacyPolicy() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Speed up the stagger for a faster reveal
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 }, // Start a bit lower
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6, // Longer duration for smoothness
        ease: "easeOut", // Smooth easing
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
                  Privacy Policy for BidKoi.com
                </motion.h1>

                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  <motion.h3
                    className={styles.auctionInfo}
                    variants={itemVariants}
                  >
                    BidKoi.com (&quot;us&quot;, &quot;we&quot;, or
                    &quot;our&quot;) is a koi auction website owned and operated
                    by Select Koi Inc., a US-based company. Our website,
                    <a className="link" href="auctionkoi.com">
                      BidKoi.com
                    </a>
                    , is designed to provide a platform for customers to bid on
                    and purchase koi fish from reputable Japanese breeders.
                  </motion.h3>
                  <motion.h3
                    className={styles.auctionInfo}
                    variants={itemVariants}
                  >
                    Your privacy is our top priority. This Privacy Policy
                    applies to all the services provided by
                    <a className="link" href="auctionkoi.com">
                      BidKoi.com
                    </a>
                    , and describes the types of information we collect, how it
                    is used, and your rights to update, modify or delete your
                    personal information.
                  </motion.h3>
                  <motion.h3
                    className={styles.auctionInfo}
                    variants={itemVariants}
                  >
                    By using our services, you consent to the collection, use,
                    and disclosure of your information as outlined in this
                    Privacy Policy.
                  </motion.h3>

                  <motion.ol
                    className={styles.policyList}
                    variants={containerVariants}
                  >
                    <motion.li
                      className={styles.sectionTitle}
                      variants={itemVariants}
                    >
                      Information We Collect
                    </motion.li>
                    <motion.h3
                      className={styles.sectionDescription}
                      variants={itemVariants}
                    >
                      When you register for an account on BidKoi.com, we collect
                      the following information to deliver our services to you:
                    </motion.h3>
                    <motion.ul
                      className={styles.infoList}
                      variants={containerVariants}
                    >
                      {[
                        "Your name",
                        "Mailing Address",
                        "Email Address",
                        "Contact phone number",
                        "Billing and payment information",
                      ].map((item, index) => (
                        <motion.li key={index} variants={itemVariants}>
                          {item}
                        </motion.li>
                      ))}
                    </motion.ul>

                    <motion.li
                      className={styles.sectionTitle}
                      variants={itemVariants}
                    >
                      How We Use Your Information
                    </motion.li>
                    <motion.h3
                      className={styles.sectionDescription}
                      variants={itemVariants}
                    >
                      We use your personal data in the following ways:
                    </motion.h3>
                    <motion.ul
                      className={styles.infoList}
                      variants={containerVariants}
                    >
                      {[
                        "To manage and maintain your account",
                        "To process and fulfill koi purchases, including payment processing and shipping",
                        "To send transactional emails, such as order confirmations, shipping notifications, and payment-related information",
                        "To send promotional and marketing emails, if you have opted into our email system",
                        "To communicate any changes or updates to our services or policies",
                        "To improve and analyze the performance of our website",
                      ].map((item, index) => (
                        <motion.li key={index} variants={itemVariants}>
                          {item}
                        </motion.li>
                      ))}
                    </motion.ul>

                    <motion.div variants={containerVariants}>
                      <motion.li
                        className={styles.sectionTitle}
                        variants={itemVariants}
                      >
                        Sharing your information
                      </motion.li>
                      <motion.h3
                        className={styles.sectionDescription}
                        variants={itemVariants}
                      >
                        We do not sell or share your personal information with
                        third parties, except when necessary to fulfill our
                        services, as follows:
                      </motion.h3>
                      <motion.ul
                        className={styles.infoList}
                        variants={containerVariants}
                      >
                        {[
                          "We share your payment information with our payment processor, solely for the purpose of processing your payment transactions.",
                          "We share your shipping information with our chosen courier or postal services for delivering the Koi fish you have purchased.",
                        ].map((item, index) => (
                          <motion.li key={index} variants={itemVariants}>
                            {item}
                          </motion.li>
                        ))}
                      </motion.ul>
                    </motion.div>

                    <motion.div variants={containerVariants}>
                      <motion.li
                        className={styles.sectionTitle}
                        variants={itemVariants}
                      >
                        Your Choices and Rights
                      </motion.li>
                      <motion.h3
                        className={styles.sectionDescription}
                        variants={itemVariants}
                      >
                        You may update, modify, or delete your personal
                        information or deactivate your AuctionKoi.com account at
                        any time by sending us a request to our customer
                        support.
                      </motion.h3>
                      <motion.h3
                        className={styles.sectionDescription}
                        variants={itemVariants}
                      >
                        You may choose to unsubscribe from our marketing emails
                        by following the &quot;unsubscribe&quot; link or
                        instructions provided in our promotional emails or by
                        contacting our customer support.
                      </motion.h3>
                    </motion.div>

                    <motion.li
                      className={styles.sectionTitle}
                      variants={itemVariants}
                    >
                      Data Security
                    </motion.li>
                    <motion.h3
                      className={styles.sectionDescription}
                      variants={itemVariants}
                    >
                      We have implemented and maintain appropriate security
                      measures to protect your personal data from unauthorized
                      access, alteration, disclosure, or destruction. However,
                      no method of data storage or transmission is 100% secure,
                      thus we cannot guarantee absolute security.
                    </motion.h3>

                    <motion.li
                      className={styles.sectionTitle}
                      variants={itemVariants}
                    >
                      Children&apos;s Privacy
                    </motion.li>
                    <motion.h3
                      className={styles.sectionDescription}
                      variants={itemVariants}
                    >
                      AuctionKoi.com is not intended for use by individuals
                      under the age of 18. We do not knowingly collect personal
                      data from minors. If you become aware that a child has
                      provided us with personal data, please contact us
                      immediately, and we will take steps to delete such
                      information from our system.
                    </motion.h3>

                    <motion.li
                      className={styles.sectionTitle}
                      variants={itemVariants}
                    >
                      Updates to this Privacy Policy
                    </motion.li>
                    <motion.h3
                      className={styles.sectionDescription}
                      variants={itemVariants}
                    >
                      We may update the Privacy Policy from time to time, and
                      any changes will be posted on this page. We encourage you
                      to review this Privacy Policy periodically to stay
                      informed about how we are protecting your information.
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
                      If you have any questions or concerns regarding this
                      Privacy Policy or our practices, please contact us at:
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
                </motion.div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </body>
  );
}

export default PrivacyPolicy;
