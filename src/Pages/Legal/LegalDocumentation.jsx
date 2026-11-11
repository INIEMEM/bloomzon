import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Input, Skeleton, message, Alert } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  AdminWorkspaceShell,
  SummaryCard,
} from "../BloomzonAdmin/shared";
import { getLegalContent, updateLegalContent } from "../../api/admin";
import { MainContext } from "../../Context/MainContext";
import "../Admin/adminWorkspace.css";
import "../Dashboard/dashboard.css";

const { TextArea } = Input;

const legalDocuments = {
  terms: {
    eyebrow: "Legal",
    title: "Terms & Conditions",
    subtitle:
      "Define platform usage rules, seller obligations, prohibited conduct, dispute handling, and marketplace accountability boundaries.",
    highlights: [
      { label: "Coverage", value: "Marketplace", helper: "Buyer, seller, and admin-facing usage terms." },
      { label: "Priority", value: "Critical", helper: "Primary contract surface for platform operations." },
      { label: "Review cadence", value: "Quarterly", helper: "Revalidate after policy, pricing, or product changes." },
    ],
    sections: [
      {
        heading: "Account & access rules",
        copy:
          "Set clear requirements for account ownership, truthful registration data, multi-account restrictions, and conditions for suspension or termination by Bloomzon administrators.",
      },
      {
        heading: "Orders, fees, and liabilities",
        copy:
          "Define how orders are accepted, how seller subscriptions and commissions apply, and where Bloomzon’s liability ends for inventory, delivery, or third-party conduct.",
      },
      {
        heading: "Enforcement & disputes",
        copy:
          "Document how moderation, fraud intervention, refund exceptions, and escalation timelines are handled when policy violations or customer disputes arise.",
      },
    ],
  },
  privacy: {
    eyebrow: "Legal",
    title: "Privacy Policy",
    subtitle:
      "Describe what personal data is collected, why it is processed, who can access it, and how retention and deletion requests are handled.",
    highlights: [
      { label: "Data scope", value: "PII + commerce", helper: "Profiles, orders, payments, support, and device data." },
      { label: "Retention", value: "Policy-driven", helper: "Retention varies by operational and compliance need." },
      { label: "Risk area", value: "High", helper: "Admin access should stay auditable and least-privilege." },
    ],
    sections: [
      {
        heading: "Collection & processing",
        copy:
          "Explain how Bloomzon collects buyer, seller, and admin data across registration, KYC, catalog, support, and transaction workflows.",
      },
      {
        heading: "Sharing & security",
        copy:
          "State where information is shared with payment, logistics, analytics, and compliance partners and what protections exist around internal admin access.",
      },
      {
        heading: "Rights & deletion",
        copy:
          "Capture export, correction, opt-out, and deletion flows for GDPR, CCPA, or country-specific privacy obligations.",
      },
    ],
  },
  cookies: {
    eyebrow: "Legal",
    title: "Cookie Policy",
    subtitle:
      "Clarify how browser storage, tracking technologies, and session controls support authentication, analytics, personalization, and fraud prevention.",
    highlights: [
      { label: "Session controls", value: "Required", helper: "Login, security, and checkout state depend on them." },
      { label: "Analytics", value: "Optional", helper: "Traffic and performance measurement should remain configurable." },
      { label: "Consent", value: "Regional", helper: "Country-specific consent rules may vary." },
    ],
    sections: [
      {
        heading: "Necessary storage",
        copy:
          "Cover essential cookies and storage keys used for authentication, CSRF protection, localization, and cart continuity.",
      },
      {
        heading: "Measurement & personalization",
        copy:
          "List analytics, experimentation, or preference-related storage categories and what business outcome each category supports.",
      },
      {
        heading: "Consent management",
        copy:
          "Document when consent is required, how preferences are changed, and how admins should verify compliance by country or user segment.",
      },
    ],
  },
  refunds: {
    eyebrow: "Legal",
    title: "Refund & Return Policy",
    subtitle:
      "Set the policy baseline for refunds, exchanges, damaged-item claims, cancellation windows, and evidence requirements across services.",
    highlights: [
      { label: "Applies to", value: "Orders", helper: "Physical goods, food, service exceptions, and disputes." },
      { label: "Approvals", value: "Controlled", helper: "Sensitive refunds should stay traceable in admin flows." },
      { label: "SLA linkage", value: "Yes", helper: "Delivery and seller response timelines influence outcomes." },
    ],
    sections: [
      {
        heading: "Eligibility windows",
        copy:
          "Define which order types qualify for returns or refunds, how long customers have to initiate claims, and what exclusions apply.",
      },
      {
        heading: "Evidence & review",
        copy:
          "Specify proof requirements such as photos, delivery events, chat history, or damaged-item reports before an admin approves a case.",
      },
      {
        heading: "Settlement impact",
        copy:
          "Explain how approved refunds affect commissions, seller payouts, chargebacks, and ledger reporting.",
      },
    ],
  },
  country: {
    eyebrow: "Legal",
    title: "Country Compliance",
    subtitle:
      "Track legal and operational policy differences by market, including VAT handling, restricted goods, document requirements, and local service rules.",
    highlights: [
      { label: "Scope", value: "Multi-country", helper: "Use this for country-specific controls and exceptions." },
      { label: "Governance", value: "Ops + Legal", helper: "Operational switches should follow legal review." },
      { label: "Feature tie-in", value: "Strong", helper: "Feature flags and policy enforcement often vary by country." },
    ],
    sections: [
      {
        heading: "Market-specific restrictions",
        copy:
          "Document country-by-country product restrictions, identity checks, ad limitations, and compliance obligations for regulated service lines.",
      },
      {
        heading: "Tax & remittance notes",
        copy:
          "Capture VAT, withholding, seller documentation, and remittance notes that admins need when reviewing payouts or exports.",
      },
      {
        heading: "Escalation controls",
        copy:
          "List the countries or scenarios where operational decisions should be escalated to compliance or legal review before action is taken.",
      },
    ],
  },
  notifications: {
    eyebrow: "Legal",
    title: "Notification Policy",
    subtitle:
      "Define what transactional, marketing, and compliance notifications can be sent, what consent is required, and how messages are logged.",
    highlights: [
      { label: "Channels", value: "Email, push, SMS", helper: "Operational use should stay permission-aware." },
      { label: "Consent", value: "Required", helper: "Especially important for marketing or promotional messaging." },
      { label: "Auditability", value: "Needed", helper: "Admin-triggered notices should remain traceable." },
    ],
    sections: [
      {
        heading: "Transactional messaging",
        copy:
          "Clarify which order, payment, support, and security messages are required for service delivery and can bypass marketing consent rules.",
      },
      {
        heading: "Promotional messaging",
        copy:
          "Define opt-in requirements, unsubscribe handling, quiet hours, and abuse controls for campaign or seller-driven notifications.",
      },
      {
        heading: "Admin-triggered alerts",
        copy:
          "Describe when administrators may send manual notices, what templates are approved, and what records must be retained for compliance.",
      },
    ],
  },
};

const legalDocLinks = [
  { key: "terms", label: "Terms & Conditions", path: "/dashboard/legal/terms" },
  { key: "privacy", label: "Privacy Policy", path: "/dashboard/legal/privacy" },
  { key: "cookies", label: "Cookie Policy", path: "/dashboard/legal/cookies" },
  { key: "refunds", label: "Refund & Return Policy", path: "/dashboard/legal/refunds" },
  { key: "country", label: "Country Compliance", path: "/dashboard/legal/country" },
  { key: "notifications", label: "Notification Policy", path: "/dashboard/legal/notifications" },
];

export const LegalHubPage = () => {
  const navigate = useNavigate();

  return (
    <AdminWorkspaceShell
      eyebrow="Legal"
      title="Legal Documentation"
      subtitle="Centralize policy references for marketplace governance, privacy, compliance, and user-facing legal content."
    >
      <div className="dashboard-link-grid">
        {legalDocLinks.map((document) => (
          <button
            key={document.key}
            className="dashboard-link-card"
            type="button"
            onClick={() => navigate(document.path)}
          >
            <span className="dashboard-link-card__title">{document.label}</span>
            <span className="dashboard-link-card__copy">
              Open the admin-facing documentation workspace for this policy area.
            </span>
          </button>
        ))}
      </div>
    </AdminWorkspaceShell>
  );
};

export const LegalDocumentPage = ({ documentKey }) => {
  const { token } = useContext(MainContext);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const defaultDoc = legalDocuments[documentKey] || legalDocuments.terms;

  const loadContent = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getLegalContent(token, documentKey);
      
      if (result.success && result.data) {
        let contentData;
        try {
          contentData = JSON.parse(result.data.content);
        } catch (e) {
          contentData = { sections: [{ heading: "Content", copy: result.data.content }] };
        }
        
        form.setFieldsValue({
          sections: contentData.sections || defaultDoc.sections
        });
      } else {
        form.setFieldsValue({
          sections: defaultDoc.sections
        });
      }
    } catch (err) {
      setError("Failed to load dynamic content. Showing defaults.");
      form.setFieldsValue({
        sections: defaultDoc.sections
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, [documentKey]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      
      const payload = {
        title: defaultDoc.title,
        content: JSON.stringify({ sections: values.sections })
      };

      const result = await updateLegalContent(token, documentKey, payload);
      
      if (result.success) {
        message.success("Legal documentation updated successfully.");
      } else {
        message.error(result.message || "Failed to update documentation.");
      }
    } catch (err) {
      message.error("Please fix form errors before saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminWorkspaceShell
      eyebrow={defaultDoc.eyebrow}
      title={defaultDoc.title}
      subtitle={defaultDoc.subtitle}
      actions={
        <Button onClick={() => navigate("/dashboard/legal")}>
          Back to legal hub
        </Button>
      }
    >
      <div className="admin-kpi-grid" style={{ marginBottom: 18 }}>
        {defaultDoc.highlights.map((item) => (
          <SummaryCard
            key={item.label}
            label={item.label}
            value={item.value}
            helper={item.helper}
          />
        ))}
      </div>

      {error && <Alert type="warning" message={error} style={{ marginBottom: 18 }} showIcon />}

      <div className="admin-panel admin-panel--soft">
        <div className="admin-panel__body">
          <div className="admin-panel__header" style={{ marginBottom: 24 }}>
            <div>
              <h2 className="admin-panel__title">Edit Documentation</h2>
              <p className="admin-panel__subtitle">
                Update the sections below. Changes are saved to the database and will reflect platform-wide.
              </p>
            </div>
            <Button 
              type="primary" 
              loading={saving} 
              onClick={handleSave}
              style={{ background: "#41CCC7", borderColor: "#41CCC7" }}
            >
              Save All Changes
            </Button>
          </div>

          {loading ? (
            <Skeleton active />
          ) : (
            <Form form={form} layout="vertical">
              <Form.List name="sections">
                {(fields, { add, remove }) => (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} style={{ paddingBottom: 24, borderBottom: '1px solid #f0f0f0', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                           <span style={{ fontWeight: 700, color: '#4b5563' }}>Section {name + 1}</span>
                           <Button 
                             type="link" 
                             danger 
                             icon={<DeleteOutlined />} 
                             onClick={() => remove(name)}
                           >
                             Remove Section
                           </Button>
                        </div>
                        <Form.Item
                          {...restField}
                          name={[name, 'heading']}
                          label="Section Heading"
                          rules={[{ required: true, message: 'Missing heading' }]}
                        >
                          <Input style={{ fontWeight: 600, fontSize: 16 }} />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'copy']}
                          label="Section Content"
                          rules={[{ required: true, message: 'Missing content' }]}
                        >
                          <TextArea rows={6} />
                        </Form.Item>
                      </div>
                    ))}
                    <Button 
                      type="dashed" 
                      onClick={() => add()} 
                      block 
                      icon={<PlusOutlined />}
                      style={{ height: 50, borderStyle: 'dashed', borderWidth: 2 }}
                    >
                      Add New Section
                    </Button>
                  </div>
                )}
              </Form.List>
            </Form>
          )}
        </div>
      </div>
    </AdminWorkspaceShell>
  );
};
