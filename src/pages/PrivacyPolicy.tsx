import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { useEdit } from "@/contexts/EditContext";
import { InlineEdit } from "@/components/ui/inline-edit";

const sections = [
  {
    key: "info_collect",
    heading: "Information We Collect",
    body: "We may collect basic contact details you provide, such as your name, email address, phone number, and delivery address, as well as order history and payment information processed by our third-party payment providers. We also collect limited technical information, like browser type and pages visited, to improve our site.",
  },
  {
    key: "how_use",
    heading: "How We Use Information",
    body: "We use your information to process orders, respond to inquiries, send order confirmations and updates, improve our menu and service, and comply with legal obligations. We do not sell your personal information.",
  },
  {
    key: "sharing",
    heading: "Sharing",
    body: "We share information only with service providers who help us operate the business (such as payment processors and delivery partners) and when required by law. These partners are permitted to use your information only as needed to perform their services.",
  },
  {
    key: "cookies",
    heading: "Cookies",
    body: "Our site may use cookies and similar technologies to remember preferences and understand how the site is used. You can disable cookies in your browser, though some features may not work as expected.",
  },
  {
    key: "choices",
    heading: "Your Choices",
    body: "You may contact us to request access to, correction of, or deletion of your personal information, subject to legal requirements. You may also unsubscribe from marketing emails at any time.",
  },
  {
    key: "contact",
    heading: "Contact",
    body: "If you have questions about this Privacy Policy, please contact us through the information provided on our website.",
  },
];

const PrivacyPolicy = () => {
  const { isEditing, getDraftValue, updateDraft } = useEdit();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Privacy Policy | Chick Rocks"
        description="How Chick Rocks collects, uses and protects information when you visit chickrocksusa.com or place an order at any of our Queens locations."
        path="/privacy"
      />
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <InlineEdit
          id="privacy_title"
          as="h1"
          className="text-4xl font-heading text-primary mb-2 block"
          isEditing={isEditing}
          value={getDraftValue("privacy_title", "Privacy Policy")}
          onChange={(v) => updateDraft("privacy_title", v)}
        />
        <InlineEdit
          id="privacy_updated"
          as="p"
          className="text-sm text-muted-foreground mb-8 block"
          isEditing={isEditing}
          value={getDraftValue("privacy_updated", "Last updated: January 1, 2026")}
          onChange={(v) => updateDraft("privacy_updated", v)}
        />

        <div className="space-y-6 text-foreground text-base leading-relaxed">
          <InlineEdit
            id="privacy_intro"
            as="p"
            className="block"
            isEditing={isEditing}
            multiline
            value={getDraftValue(
              "privacy_intro",
              "Chick Rocks (\"we\", \"us\", or \"our\") operates this website and our restaurant locations. This Privacy Policy explains how we collect, use, and protect information when you visit our website or place an order with us."
            )}
            onChange={(v) => updateDraft("privacy_intro", v)}
          />

          {sections.map((section) => {
            const headingKey = `privacy_${section.key}_heading`;
            const bodyKey = `privacy_${section.key}_body`;
            return (
              <section key={section.key}>
                <InlineEdit
                  id={headingKey}
                  as="h2"
                  className="text-2xl font-semibold mb-2 block"
                  isEditing={isEditing}
                  value={getDraftValue(headingKey, section.heading)}
                  onChange={(v) => updateDraft(headingKey, v)}
                />
                <InlineEdit
                  id={bodyKey}
                  as="p"
                  className="block"
                  isEditing={isEditing}
                  multiline
                  value={getDraftValue(bodyKey, section.body)}
                  onChange={(v) => updateDraft(bodyKey, v)}
                />
              </section>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
