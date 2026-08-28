"""Generate Hatim Slami resume PDF for the portfolio."""
from pathlib import Path

from fpdf import FPDF

OUT = Path(__file__).resolve().parent.parent / "assets" / "Hatim_Resume.pdf"


class Resume(FPDF):
    def __init__(self):
        super().__init__(format="A4", unit="mm")
        self.set_auto_page_break(auto=True, margin=14)
        self.set_margins(16, 14, 16)

    def section(self, title: str):
        self.ln(2.5)
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(13, 148, 136)
        self.cell(0, 6, title.upper(), new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(13, 148, 136)
        self.set_line_width(0.4)
        y = self.get_y()
        self.line(self.l_margin, y, self.w - self.r_margin, y)
        self.ln(2.5)
        self.set_text_color(17, 24, 39)
        self.set_x(self.l_margin)

    def job(self, role: str, meta: str, bullets: list[str]):
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(17, 24, 39)
        self.multi_cell(0, 5, role, new_x="LMARGIN", new_y="NEXT")
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(92, 113, 104)
        self.multi_cell(0, 4.5, meta, new_x="LMARGIN", new_y="NEXT")
        self.set_text_color(31, 41, 55)
        self.set_font("Helvetica", "", 9)
        for b in bullets:
            self.multi_cell(0, 4.4, f"- {b}", new_x="LMARGIN", new_y="NEXT")
        self.ln(1.2)

    def project(self, name: str, line: str):
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "B", 9.5)
        self.set_text_color(17, 24, 39)
        self.multi_cell(0, 4.5, name, new_x="LMARGIN", new_y="NEXT")
        self.set_font("Helvetica", "", 9)
        self.set_text_color(31, 41, 55)
        self.multi_cell(0, 4.3, line, new_x="LMARGIN", new_y="NEXT")
        self.ln(0.8)


def build():
    pdf = Resume()
    pdf.add_page()

    pdf.set_font("Helvetica", "B", 22)
    pdf.set_text_color(17, 24, 39)
    pdf.cell(0, 9, "Hatim Slami", new_x="LMARGIN", new_y="NEXT")

    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(13, 148, 136)
    pdf.multi_cell(
        0,
        5,
        "Python (Django) & Full-Stack Web Developer | Information Engineer",
        new_x="LMARGIN",
        new_y="NEXT",
    )

    pdf.set_font("Helvetica", "", 8.5)
    pdf.set_text_color(92, 113, 104)
    pdf.multi_cell(
        0,
        4.2,
        "hatimslami81@gmail.com  |  0936317358  |  linkedin.com/in/hatim-slami",
        new_x="LMARGIN",
        new_y="NEXT",
    )

    pdf.section("Professional Summary")
    pdf.set_font("Helvetica", "", 9.5)
    pdf.set_text_color(31, 41, 55)
    pdf.multi_cell(
        0,
        4.5,
        "Information Engineer and Full-Stack Web Developer specializing in robust backend systems "
        "with Python & Django REST Framework, React frontends, and production WordPress / WooCommerce "
        "platforms. Experience shipping multi-role marketplace APIs, realtime GPS tracking, JWT/OTP auth, "
        "and high-converting business websites.",
        new_x="LMARGIN",
        new_y="NEXT",
    )

    pdf.section("Experience")

    pdf.job(
        "Backend Engineer - Valley Order",
        "Jibran | Multi-role delivery marketplace",
        [
            "Built production API for Customer / Provider / Captain / Admin on Django REST, Daphne/Channels, PostgreSQL, and Redis.",
            "Implemented OTP SMS auth, dynamic delivery pricing, FCM notifications, coupons, and full order lifecycle.",
            "Designed hybrid live GPS tracking with NestJS Socket.io sidecar sharing JWT and Postgres.",
            "Delivered landing/legal/support APIs, OpenAPI docs, Jazzmin ops, Docker dual-env Dev/Prod, and GitHub Actions CI/CD.",
        ],
    )

    pdf.job(
        "Python & Django Programmer",
        "APIs | Databases | Backend tools",
        [
            "Developed RESTful APIs and database schemas with clean models and JWT-ready auth patterns.",
            "Built maintainable service layers and backend tooling in Python and Django.",
        ],
    )

    pdf.job(
        "Website Creator & Designer - Adam Events",
        "WordPress | adamevents.net",
        [
            "Designed and delivered interactive WordPress event platforms with conversion-focused UX (Elementor Pro).",
        ],
    )

    pdf.job(
        "Developer - Ademixvet",
        "ademixvet.com",
        [
            "Custom WordPress infrastructure, frontend adjustments, and production technical optimizations.",
        ],
    )

    pdf.job(
        "React Frontend Developer",
        "Restaurant & product UIs | giamaharanigroup.com",
        [
            "Built React frontends for restaurant experiences: digital menus, bilingual UI, promos, WhatsApp ordering.",
        ],
    )

    pdf.job(
        "Website Developer - Digital Arabic",
        "gulf-private.com | kochreal.com | asamena.org | ademixvet.com",
        [
            "Built and maintained WordPress / WooCommerce platforms with migrations, security hardening, and speed optimization.",
        ],
    )

    pdf.section("Selected Projects")
    pdf.project(
        "Valley Order - valley-order.com",
        "Marketplace backend: JWT/OTP, catalog, checkout, dynamic pricing, FCM, hybrid realtime tracking (Django + NestJS).",
    )
    pdf.project(
        "Boma Platform - boma.sy",
        "Syrian e-commerce store for BOMA electrical appliances (kitchen, home, personal care) on WordPress/WooCommerce, integrated with a Flutter mobile app.",
    )
    pdf.project(
        "Adam Events - adamevents.net",
        "WordPress events & conference website with dynamic layouts and booking-oriented flows.",
    )
    pdf.project(
        "Gia Restaurant - giamaharanigroup.com",
        "React restaurant site (Bogor): digital menu, promos, bilingual UI, WhatsApp ordering.",
    )
    pdf.project(
        "Digital Arabic sites",
        "Gulf Private, Koch Real, ASAMENA, Ademixvet - WordPress delivery for real-estate, infrastructure, and association platforms.",
    )

    pdf.section("Skills")
    pdf.set_text_color(31, 41, 55)
    skills = [
        (
            "Backend: ",
            "Python, Django, Django REST, Channels, NestJS, Node.js, REST APIs, PostgreSQL, Redis, MySQL, SQLite",
        ),
        (
            "Frontend / CMS: ",
            "React, JavaScript, HTML5, CSS3, WordPress, Elementor Pro, WooCommerce, Flutter, Responsive Design",
        ),
        (
            "Tools: ",
            "Git/GitHub, Docker, Nginx, GitHub Actions, Postman, Site Migration, Security Auditing, Web Maintenance",
        ),
    ]
    for label, value in skills:
        pdf.set_x(pdf.l_margin)
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_text_color(17, 24, 39)
        pdf.write(4.5, label)
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(31, 41, 55)
        pdf.write(4.5, value)
        pdf.ln(5.2)

    pdf.section("Education")
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(17, 24, 39)
    pdf.multi_cell(0, 5, "Bachelor's Degree - Information Engineering", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(92, 113, 104)
    pdf.multi_cell(0, 4.5, "Al-Ittihad Private University", new_x="LMARGIN", new_y="NEXT")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(OUT))
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    build()
