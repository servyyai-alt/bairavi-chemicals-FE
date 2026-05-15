import { Link, useLocation } from 'react-router-dom';

const policies = {
  '/privacy-policy': {
    title: 'Privacy Policy',
    intro:
      'This Privacy Policy explains how Vallal Food collects, uses, and protects customer information when you use our website, place orders, or contact our team.',
    sections: [
      {
        heading: 'Information We Collect',
        points: [
          'We may collect your name, phone number, email address, delivery address, and account details when you register or place an order.',
          'We may record order history, wishlist activity, support messages, and basic device or browser information to improve website performance.',
          'Payment transactions may be processed through third-party providers, and we do not store full payment card details on our servers.'
        ]
      },
      {
        heading: 'How We Use Information',
        points: [
          'We use customer data to process orders, coordinate delivery, respond to support requests, and send important service updates.',
          'Information may also be used to improve product availability, website experience, and customer communication.',
          'We do not sell personal information to outside parties.'
        ]
      },
      {
        heading: 'Data Protection',
        points: [
          'We take reasonable administrative and technical steps to protect your information from unauthorized access or misuse.',
          'Only authorized personnel and trusted service partners may access data needed to operate the service.'
        ]
      }
    ]
  },
  '/terms-and-conditions': {
    title: 'Terms & Conditions',
    intro:
      'These Terms & Conditions govern your use of the Vallal Food website, account features, and ordering services.',
    sections: [
      {
        heading: 'Use of the Website',
        points: [
          'You agree to provide accurate account, delivery, and contact information when using this website.',
          'You must not misuse the website, attempt unauthorized access, or interfere with normal site operation.',
          'Product availability, pricing, and delivery coverage may change without prior notice.'
        ]
      },
      {
        heading: 'Orders and Pricing',
        points: [
          'Orders are subject to confirmation, stock availability, and serviceability of the delivery location.',
          'We reserve the right to update prices, product descriptions, packaging details, or quantity limits when needed.',
          'If an issue affects your order after placement, our team may contact you to confirm changes or provide a replacement or refund option.'
        ]
      },
      {
        heading: 'Account Responsibility',
        points: [
          'You are responsible for maintaining the confidentiality of your account credentials.',
          'Any activity performed through your account is treated as your responsibility unless reported promptly as unauthorized.'
        ]
      }
    ]
  },
  '/refund-cancellation-policy': {
    title: 'Refund / Cancellation Policy',
    intro:
      'This policy explains when orders can be cancelled and how refunds are handled for Vallal Food purchases.',
    sections: [
      {
        heading: 'Order Cancellation',
        points: [
          'Orders may be cancelled before dispatch or delivery processing begins, subject to operational status.',
          'Once perishable items are packed or out for delivery, cancellation may be limited or unavailable.',
          'To request cancellation, customers should contact support as early as possible.'
        ]
      },
      {
        heading: 'Refund Eligibility',
        points: [
          'Refunds may be offered for missing items, damaged goods, wrong deliveries, failed deliveries caused by our side, or verified quality concerns.',
          'Refund requests should be raised within a reasonable time after delivery so our team can review the issue.',
          'Approved refunds are processed back to the original payment method or as otherwise communicated by support.'
        ]
      },
      {
        heading: 'Non-Refund Situations',
        points: [
          'Refunds may be declined for issues caused by incorrect address details, repeated failed customer contact, or delays outside our reasonable control.',
          'Minor variation in shape, color, or natural appearance of fresh produce does not automatically qualify for refund.'
        ]
      }
    ]
  },
  '/safety-guidelines': {
    title: 'Safety Guidelines',
    intro:
      'These Safety Guidelines are intended to support safe ordering, handling, and delivery of food and grocery products from Vallal Food.',
    sections: [
      {
        heading: 'Customer Safety',
        points: [
          'Please provide correct delivery details and ensure someone is available to receive perishable products on time.',
          'Inspect packages at delivery and report any visible damage, leakage, or missing items promptly.',
          'Store temperature-sensitive items appropriately after receipt.'
        ]
      },
      {
        heading: 'Food Handling',
        points: [
          'Wash fresh produce before use and follow normal kitchen hygiene practices for preparation and storage.',
          'Consume packaged or prepared items before the indicated expiry or recommended use period.',
          'If you suspect spoilage or contamination, do not consume the item and contact support immediately.'
        ]
      },
      {
        heading: 'Platform Safety',
        points: [
          'Customers should protect account passwords, avoid sharing OTPs, and verify official communication channels before acting on payment or delivery requests.',
          'Any suspicious website activity, fraud concerns, or account misuse should be reported to our team immediately.'
        ]
      }
    ]
  },
  '/user-verification-policy': {
    title: 'User Verification Policy',
    intro:
      'This User Verification Policy explains how Vallal Food may verify customers, accounts, and orders to maintain service quality and reduce misuse.',
    sections: [
      {
        heading: 'Verification Checks',
        points: [
          'We may verify phone numbers, email addresses, delivery details, or order information before processing certain orders.',
          'Additional confirmation may be requested for unusual activity, high-value orders, repeated failed deliveries, or account recovery requests.'
        ]
      },
      {
        heading: 'Why Verification Matters',
        points: [
          'Verification helps protect customers from unauthorized use, reduces fraudulent orders, and supports reliable delivery.',
          'It also helps our team resolve address or contact issues before dispatch.'
        ]
      },
      {
        heading: 'Failure to Verify',
        points: [
          'If required verification cannot be completed, we may delay, cancel, or hold an order until the information is confirmed.',
          'Users who repeatedly provide false or misleading information may have ordering privileges limited or suspended.'
        ]
      }
    ]
  }
};

const policyLinks = [
  ['/privacy-policy', 'Privacy Policy'],
  ['/terms-and-conditions', 'Terms & Conditions'],
  ['/refund-cancellation-policy', 'Refund / Cancellation Policy'],
  ['/safety-guidelines', 'Safety Guidelines'],
  ['/user-verification-policy', 'User Verification Policy']
];

export default function PolicyPage() {
  const { pathname } = useLocation();
  const policy = policies[pathname];

  if (!policy) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Legal</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">{policy.title}</h1>
        <p className="mt-4 text-base leading-7 text-gray-600">{policy.intro}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-6">
          {policy.sections.map(section => (
            <section key={section.heading} className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900">{section.heading}</h2>
              <div className="mt-4 space-y-3 text-gray-600 leading-7">
                {section.points.map(point => (
                  <p key={point}>{point}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="card p-6 h-fit">
          <h2 className="text-lg font-semibold text-gray-900">Company Policies</h2>
          <div className="mt-4 space-y-3">
            {policyLinks.map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className={`block rounded-xl px-4 py-3 text-sm transition-colors ${
                  pathname === to
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
