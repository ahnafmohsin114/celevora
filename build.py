#!/usr/bin/env python3
"""
Build script for the Celevora static site.
Assembles each page from shared header/footer partials + a per-page <main> body
stored in _partials/bodies/<page>.html, then writes the final HTML to the
project root. Run: python3 build.py
"""
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
PARTIALS = os.path.join(ROOT, "_partials")
BODIES = os.path.join(PARTIALS, "bodies")

with open(os.path.join(PARTIALS, "header.html"), encoding="utf-8") as f:
    HEADER = f.read()

with open(os.path.join(PARTIALS, "footer.html"), encoding="utf-8") as f:
    FOOTER = f.read()

HEAD_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title}</title>
<meta name="description" content="{description}" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css" />
</head>
<body>
"""

FOOT_TEMPLATE = """
<script src="assets/js/main.js"></script>
{extra_scripts}</body>
</html>
"""

# (filename, <title>, <meta description>, extra_scripts)
PAGES = [
    ("events.html", "Browse Events | Celevora", "Discover curated weddings, corporate events, concerts and more on Celevora.", ""),
    ("vendors.html", "Browse Vendors | Celevora", "Verified decorators, caterers, photographers and more, rated by real customers.", ""),
    ("venues.html", "Browse Venues | Celevora", "Halls, rooftops, gardens and conference centers for every kind of event.", ""),
    ("vendor-details.html", "Royal Decor Studio | Celevora", "View packages, gallery and reviews for Royal Decor Studio on Celevora.", ""),
    ("event-details.html", "Dream Wedding | Celevora", "Full details, inclusions and reviews for the Dream Wedding package on Celevora.", ""),
    ("venue-details.html", "Grand Pavilion Hall | Celevora", "View amenities, capacity and pricing for Grand Pavilion Hall on Celevora.", ""),
    ("checkout.html", "Checkout | Celevora", "Confirm your booking details and choose a payment method.", ""),
    ("payment-success.html", "Payment Successful | Celevora", "Your booking has been confirmed.", ""),
    ("payment-fail.html", "Payment Failed | Celevora", "There was an issue processing your payment.", ""),
    ("login.html", "Login | Celevora", "Log in to your Celevora account.", ""),
    ("register.html", "Sign Up | Celevora", "Create your Celevora account.", ""),
    ("vendor-register.html", "Become a Vendor | Celevora", "Register your business on Celevora and start receiving bookings.", ""),
    ("about.html", "About Us | Celevora", "Learn more about Celevora's mission to simplify event planning.", ""),
    ("contact.html", "Contact Us | Celevora", "Get in touch with the Celevora team.", ""),
    ("pricing.html", "Pricing | Celevora", "Simple, transparent pricing plans for vendors on Celevora.", ""),
    ("faq.html", "FAQ | Celevora", "Frequently asked questions about Celevora.", ""),
    ("terms.html", "Terms & Conditions | Celevora", "Celevora's terms and conditions of use.", ""),
    ("privacy.html", "Privacy Policy | Celevora", "Celevora's privacy policy.", ""),
    ("wishlist.html", "My Wishlist | Celevora", "Vendors and events you've saved.", ""),
    ("bookings.html", "My Bookings | Celevora", "Track the status of your event bookings.", ""),
    ("customer-dashboard.html", "Customer Dashboard | Celevora", "Manage your bookings, wishlist and profile.", ""),
    ("vendor-dashboard.html", "Vendor Dashboard | Celevora", "Manage your services, packages, bookings and earnings.", ""),
    ("admin-dashboard.html", "Admin Dashboard | Celevora", "Platform overview, users, vendors and bookings.", ""),
]

def build():
    os.makedirs(BODIES, exist_ok=True)
    built, skipped = [], []
    for filename, title, desc, extra in PAGES:
        body_path = os.path.join(BODIES, filename)
        if not os.path.exists(body_path):
            skipped.append(filename)
            continue
        with open(body_path, encoding="utf-8") as f:
            body = f.read()

        html = (
            HEAD_TEMPLATE.format(title=title, description=desc)
            + HEADER
            + body
            + FOOTER
            + FOOT_TEMPLATE.format(extra_scripts=extra)
        )

        out_path = os.path.join(ROOT, filename)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(html)
        built.append(filename)

    print(f"Built {len(built)} pages: {', '.join(built)}")
    if skipped:
        print(f"Skipped (no body found yet): {', '.join(skipped)}")

if __name__ == "__main__":
    build()