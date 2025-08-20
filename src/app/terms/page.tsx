import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsAndConditions() {
  return (
    <div className="flex flex-col min-h-screen text-gray-200 bg-black">
      <Navbar />
      <main className="flex-1 px-6 md:px-16 py-12 max-w-5xl mx-auto pt-40">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center text-white">
          Terms & Conditions
        </h1>
        <p className="text-center text-sm text-gray-400 mb-8">
          Last updated: 10 Aug 2025
        </p>

        <div className="space-y-10 text-justify leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
            <p>
              Welcome to <strong>DigiCraft Marketplace</strong>, operated under the tradename DigiCraft Technologies. These Terms & Conditions (hereinafter “Terms”) govern your use of our website and services. By using our platform, you acknowledge that you have read, understood, and agree to be legally bound by these Terms. If you do not agree, you must discontinue use of our services immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Eligibility</h2>
            <p>
              You must be at least 18 years of age and legally capable of entering into contracts under applicable laws to access and use our services. By using DigiCraft Marketplace, you confirm that you meet these eligibility requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Services Offered</h2>
            <p>
              DigiCraft Marketplace offers pre-built, customizable, and resellable software solutions. These include portfolios, e-commerce stores, landing pages, club websites, and cultural showcases. Services are structured into four packages: Base, Plus, Pro, and Ultimate. DigiCraft Technologies reserves the right to add, remove, or modify service offerings at its sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Ownership & Code Sharing Policy</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Base Plan:</strong> Branding & content updates. <u>No source code</u> provided; limited to hosted deployment only.</li>
              <li><strong>Plus Plan:</strong> Base + UI/UX tweaks. <u>No source code</u> provided.</li>
              <li><strong>Pro Plan:</strong> Plus + feature updates & priority support. <u>No source code</u> provided.</li>
              <li><strong>Ultimate Plan:</strong> Full build from scratch with complete ownership rights. <u>Full source code and deployment rights transferred</u> to the client upon final payment.</li>
            </ul>
            <p className="mt-3">
              For all plans other than Ultimate, DigiCraft Technologies retains full ownership of source code, intellectual property, and related assets. Clients are prohibited from requesting, reverse engineering, or attempting to extract code under Base, Plus, or Pro plans.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Payment & Refund Policy</h2>
            <p>
              All fees are payable upfront and in full before project commencement. Payments are strictly non-refundable, except in cases where DigiCraft Technologies fails to deliver the agreed service. Chargebacks, fraudulent disputes, or payment reversals will result in immediate service suspension and potential legal action.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. License & Usage Restrictions</h2>
            <p>
              Clients purchasing Base, Plus, or Pro packages are granted a non-exclusive, non-transferable, revocable license to use the hosted solution. Redistribution, resale, sublicensing, or unauthorized sharing of the software or related assets is strictly forbidden. Any violation will result in immediate termination of service and legal enforcement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Customization & Support</h2>
            <p>
              Support and customization vary by package. Pro and Ultimate plans include priority support, while Base and Plus are limited to deployment assistance only. DigiCraft Technologies reserves the right to determine the scope, method, and timeline of support.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Intellectual Property Rights</h2>
            <p>
              Except under the Ultimate Plan, all intellectual property rights, including but not limited to code, templates, documentation, and assets, remain the sole property of DigiCraft Technologies. Unauthorized reproduction, modification, or commercial exploitation is prohibited and may result in civil or criminal penalties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Confidentiality</h2>
            <p>
              All communications, project details, and deliverables shared between DigiCraft Technologies and the client are confidential. Clients must not disclose or share proprietary information without written consent. Breach of confidentiality may result in termination of services and legal action.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Limitation of Liability</h2>
            <p>
              DigiCraft Technologies is not liable for any indirect, incidental, or consequential damages arising from the use or inability to use our services. We are not responsible for data loss, downtime, third-party failures, or business interruption. Liability, if proven, shall not exceed the total amount paid by the client for the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">11. Termination</h2>
            <p>
              DigiCraft Technologies reserves the right to suspend or terminate services immediately if a client violates these Terms, engages in unlawful activities, or misuses our intellectual property. No refunds will be issued in such cases.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">12. Governing Law & Jurisdiction</h2>
            <p>
              These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the competent courts located in Jamshedpur, Jharkhand.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">13. Amendments</h2>
            <p>
              DigiCraft Technologies may revise these Terms at any time without prior notice. Continued use of our services after such changes constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">14. Contact Information</h2>
            <p>For inquiries regarding these Terms & Conditions, contact us:</p>
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
