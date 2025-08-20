import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen text-gray-200 bg-black">
      <Navbar />
      <main className="flex-1 px-6 md:px-16 py-12 max-w-5xl mx-auto pt-40">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center text-white">
          Privacy Policy
        </h1>
        <p className="text-center text-sm text-gray-400 mb-8">
          Last updated: 10 Aug 2025
        </p>

        <div className="space-y-10 text-justify leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
            <p>
              At <strong>DigiCraft Marketplace</strong>, operated under DigiCraft Technologies, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you interact with our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
            <p>We may collect the following personal information when you interact with our website or contact us:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Name:</strong> To personalize communication and identify you.</li>
              <li><strong>Email Address:</strong> To respond to inquiries, provide updates, and deliver requested information.</li>
              <li><strong>Phone Number:</strong> To contact you directly regarding your request or project.</li>
              <li><strong>Message/Inquiry Details:</strong> To better understand your needs and provide appropriate assistance.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
            <p>Your personal information will be used strictly for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Responding to inquiries and providing requested information.</li>
              <li>Improving our services and customer experience.</li>
              <li>Sending administrative updates or notifications related to your request.</li>
              <li>Complying with legal obligations, if required.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Data Sharing & Disclosure</h2>
            <p>
              DigiCraft Technologies does not sell, rent, or trade your personal data to third parties. We may only share information in the following cases:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>When required by law, regulation, or legal process.</li>
              <li>To protect our rights, safety, or property.</li>
              <li>With trusted service providers who assist in operating our business, bound by confidentiality agreements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no online transmission or storage system can be guaranteed 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary to fulfill the purposes described in this Privacy Policy, unless a longer retention period is required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request corrections to inaccurate or incomplete data.</li>
              <li>Request deletion of your personal data, subject to legal requirements.</li>
              <li>Withdraw consent to data processing at any time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of such external sites. We encourage you to review their policies before providing any personal data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Updates to This Policy</h2>
            <p>
              DigiCraft Technologies may update this Privacy Policy periodically. Any changes will be reflected on this page, and continued use of our services after updates indicates your acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or how your data is handled, please contact us:</p>
            <ul className="mt-2 space-y-1">
              <li>📧 Email: <a href="mailto:hello@digicraft.one" className="text-blue-600 hover:underline">hello@digicraft.one</a></li>
              <li>📞 Phone: +91 8299797516 | +91 6203785043</li>
              <li>🌐 Website: <a href="https://marketplace.digicraft.one" className="text-blue-600 hover:underline">marketplace.digicraft.one</a></li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
