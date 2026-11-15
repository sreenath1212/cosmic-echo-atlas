import os
from fpdf import FPDF

class CosmicEchoPDF(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 9)
        self.set_text_color(100, 116, 139) # slate-500
        self.cell(0, 8, 'NASA Space Apps Challenge 2026 | Cosmic Echo Atlas', border=0, align='L')
        self.cell(0, 8, 'https://cosmic-echo-atlas-tau.vercel.app', border=0, align='R')
        self.ln(10)
        self.set_draw_color(226, 232, 240)
        self.set_line_width(0.3)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(6)

    def footer(self):
        self.set_y(-15)
        self.set_draw_color(226, 232, 240)
        self.set_line_width(0.3)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(148, 163, 184) # slate-400
        self.cell(0, 10, 'Cosmic Echo Atlas - Simpler Project Explanation | Page ' + str(self.page_no()) + ' of {nb}', align='C')

def create_pdf(output_path):
    pdf = CosmicEchoPDF(orientation='P', unit='mm', format='A4')
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.set_margins(18, 16, 18)
    
    # PAGE 1: TITLE & EXECUTIVE SUMMARY
    pdf.add_page()
    
    # Title Block
    pdf.set_font('Helvetica', 'B', 24)
    pdf.set_text_color(15, 23, 42) # slate-900
    pdf.cell(0, 12, 'Cosmic Echo Atlas', ln=True, align='L')
    
    pdf.set_font('Helvetica', 'B', 14)
    pdf.set_text_color(14, 116, 144) # cyan-700
    pdf.cell(0, 8, 'NASA SPHEREx Sky Blink Comparator & Planet X Hunter', ln=True, align='L')
    
    pdf.set_font('Helvetica', '', 10)
    pdf.set_text_color(71, 85, 105) # slate-600
    pdf.cell(0, 6, 'NASA International Space Apps Challenge 2026 | Challenge: "Planet X and SPHEREx"', ln=True, align='L')
    pdf.ln(4)
    
    # Links Box
    pdf.set_fill_color(248, 250, 252) # slate-50
    pdf.set_draw_color(203, 213, 225) # slate-300
    pdf.rect(pdf.l_margin, pdf.get_y(), pdf.w - 2 * pdf.l_margin, 28, 'DF')
    
    pdf.set_xy(pdf.l_margin + 5, pdf.get_y() + 4)
    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 6, 'Official Project Links:', ln=True)
    
    pdf.set_font('Helvetica', '', 9.5)
    pdf.set_text_color(3, 105, 161) # sky-700
    pdf.cell(32, 6, 'Live Web App: ')
    pdf.cell(0, 6, 'https://cosmic-echo-atlas-tau.vercel.app', link='https://cosmic-echo-atlas-tau.vercel.app', ln=True)
    
    pdf.cell(32, 6, 'GitHub Repo: ')
    pdf.cell(0, 6, 'https://github.com/sreenath1212/cosmic-echo-atlas', link='https://github.com/sreenath1212/cosmic-echo-atlas', ln=True)
    pdf.ln(8)
    
    # Executive Summary
    pdf.set_font('Helvetica', 'B', 13)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 8, 'Executive Summary: What is this project?', ln=True)
    
    pdf.set_font('Helvetica', '', 9.5)
    pdf.set_text_color(51, 65, 85)
    summary_text = (
        "Cosmic Echo Atlas is a web-based public astronomy observatory built for the NASA Space Apps Challenge 2026. "
        "It addresses the challenge 'Planet X and SPHEREx' by creating an interactive, accessible tool that allows anyone "
        "- from elementary students to professional astronomers - to detect how the sky changes over time.\n\n"
        "In 1930, 24-year-old astronomer Clyde Tombaugh discovered Pluto using a mechanical 'blink comparator' - rapidly alternating "
        "between two photographic glass plates to spot tiny shifts. Today, NASA's SPHEREx space telescope is scanning the entire sky in "
        "102 infrared wavelengths, generating petabytes of multi-epoch spectral images. Cosmic Echo Atlas brings the historic blink "
        "comparator into the modern web browser, connecting live to NASA/IPAC IRSA databases to let users hunt for asteroids, comets, "
        "and hypothetical trans-Neptunian bodies ('Planet X')."
    )
    pdf.multi_cell(0, 5.2, summary_text)
    pdf.ln(5)
    
    # The Core Problem & The Innovation
    pdf.set_font('Helvetica', 'B', 12)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 7, 'Why is this important? The "Space Detective" Problem', ln=True)
    
    pdf.set_font('Helvetica', '', 9.5)
    pdf.set_text_color(51, 65, 85)
    problem_text = (
        "Professional astronomical archives (like NASA IRSA) are powerful but overwhelming. Raw FITS files, coordinate systems (J2000 RA/Dec), "
        "and multi-extension data cubes require specialized software like DS9 or Python Astroquery. A normal person cannot easily explore them.\n\n"
        "Cosmic Echo Atlas solves this by turning real NASA data into an intuitive 'Spot the Difference' experience. "
        "Background stars are trillions of miles away and stay completely still. Objects orbiting our Sun (asteroids, comets, or outer planets) "
        "visibly jump across the screen over days, months, or years. By making this visual and gamified, anyone can experience the thrill of astronomical discovery."
    )
    pdf.multi_cell(0, 5.2, problem_text)
    pdf.ln(4)

    # PAGE 2: HOW IT WORKS & KEY FEATURES
    pdf.add_page()
    
    pdf.set_font('Helvetica', 'B', 14)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 8, 'Key Feature: The Planet X Hunter & Blink Comparator (/blink)', ln=True)
    pdf.ln(2)
    
    features = [
        ("1. Dual-Mode Comparison Engine", 
         "Users can switch between an Auto-Blink Flipbook (rapidly alternating between Photo 1 and Photo 2 every 0.3 to 0.8 seconds) and a Split Slider (dragging a dividing bar horizontally to compare overlapping scans)."),
        ("2. 'Detective Vision' (One-Click Hint Toggle)", 
         "For users who find it difficult to spot tiny pixel changes in starry fields, Detective Vision automatically highlights the moving object with high-contrast targeting rings and an arrow showing its trajectory across space, stating exactly how many degrees and miles it shifted."),
        ("3. Verified Real Discovery Presets", 
         "Includes 1-click verified multi-epoch targets: Asteroid 12 Victoria (Beginner - leaps across the frame in 4 days), Dwarf Planet Ceres (Intermediate - largest asteroid belt object), and Planet X Simulation (15-year baseline between NASA WISE 2010 and SPHEREx 2025)."),
        ("4. Live NASA IRSA Moving Object Search (MOST)", 
         "Users can type any asteroid or comet designation (e.g., Ceres, Victoria, Bamberga, Eros, 29P) to search NASA's live MOST database across 2025 SPHEREx survey scan paths."),
        ("5. Keplerian Planet X Orbit Simulator", 
         "Allows users to input hypothetical semi-major axis (AU), eccentricity (ovalness), and orbital tilt to simulate where a 9th planet would cross SPHEREx survey fields."),
        ("6. Citizen Science Discovery Certificate Modal", 
         "When a user spots a jumper and clicks 'I Found It!', the platform generates an official NASA Space Apps Citizen Science Discovery Certificate with observation timestamps, coordinates, and a copyable report.")
    ]
    
    for title, desc in features:
        pdf.set_font('Helvetica', 'B', 10)
        pdf.set_text_color(14, 116, 144)
        pdf.cell(0, 5.5, title, ln=True)
        pdf.set_font('Helvetica', '', 9)
        pdf.set_text_color(51, 65, 85)
        pdf.multi_cell(0, 4.8, desc)
        pdf.ln(2.5)

    pdf.ln(3)
    pdf.set_font('Helvetica', 'B', 13)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 7, 'Other Core Observatory Modules', ln=True)
    
    modules = [
        ("Module 04: SPHEREx Mission Portal (/spherex)", 
         "Comprehensive exploration of NASA's all-sky spectral survey: 102 spectral channels (0.75-5.0 um), DR1 Level 2 products, SPLICES 9M interstellar ice source catalog, and synthetic spectrophotometry lab."),
        ("Module 01: Interactive Sky Map (/explore)", 
         "Interactive celestial sphere visualization with constellation tracing, deep-sky nebulae, and messier catalog exploration."),
        ("Module 02: 13.8-Billion-Year Cosmic Timeline (/timeline)", 
         "Epoch-by-epoch animated scrubbable timeline from cosmic inflation to the modern era."),
        ("Module 03: Multi-Wavelength Spectrum Lab (/spectrum)", 
         "Visible vs infrared comparison demonstrating how infrared light penetrates cosmic dust clouds (e.g. Pillars of Creation).")
    ]
    
    for mod_title, mod_desc in modules:
        pdf.set_font('Helvetica', 'B', 9.5)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(0, 5, mod_title, ln=True)
        pdf.set_font('Helvetica', '', 9)
        pdf.set_text_color(71, 85, 105)
        pdf.multi_cell(0, 4.6, mod_desc)
        pdf.ln(1.5)

    # PAGE 3: ARCHITECTURE & TECHNICAL INTEGRATION
    pdf.add_page()
    
    pdf.set_font('Helvetica', 'B', 14)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 8, 'NASA Data Integration & Technical Architecture', ln=True)
    pdf.ln(2)
    
    pdf.set_font('Helvetica', '', 9.5)
    pdf.set_text_color(51, 65, 85)
    arch_intro = (
        "Cosmic Echo Atlas is not just a mockup - it is built on a high-performance modern web stack and connects "
        "directly to authentic NASA scientific data services:"
    )
    pdf.multi_cell(0, 5.2, arch_intro)
    pdf.ln(3)
    
    apis = [
        ("NASA/IPAC IRSA MOST API", 
         "Moving Object Search Tool calculates ephemerides and identifies SPHEREx Level 2 FITS scan paths covering moving targets."),
        ("NASA IRSA Image Back End (IBE)", 
         "Fetches uncompressed SPHEREx DR1 Multi-Extension FITS (MEF) cutouts directly using center coordinates and field-of-view parameters."),
        ("NASA SkyView Multi-Wavelength Engine", 
         "Renders calibrated near-infrared previews (WISE 3.4 um and 2MASS K-band) for instantaneous web display without requiring desktop FITS viewers."),
        ("IRSA Atlas Target Resolver", 
         "Resolves arbitrary celestial object names (asteroids, comets, stars) via SIMBAD/NED into J2000 equatorial coordinates.")
    ]
    
    for api_name, api_desc in apis:
        pdf.set_font('Helvetica', 'B', 9.5)
        pdf.set_text_color(14, 116, 144)
        pdf.cell(0, 5, api_name, ln=True)
        pdf.set_font('Helvetica', '', 9)
        pdf.set_text_color(51, 65, 85)
        pdf.multi_cell(0, 4.6, api_desc)
        pdf.ln(2)
        
    pdf.ln(2)
    pdf.set_font('Helvetica', 'B', 12)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 7, 'Tech Stack & Deployment Pipeline', ln=True)
    
    tech_items = [
        ("Framework & SSR", "TanStack Start + React 19 + Vite + Nitro server engine"),
        ("Styling & Design System", "Tailwind CSS v4 + Radix UI Primitives + Lucide Icons"),
        ("Imagery & Visuals", "Custom deep-space JWST-style panoramic background & 3D visualizations"),
        ("Testing & Quality", "100% TypeScript typecheck (0 errors) + Vitest automated test suite"),
        ("Hosting & CDN", "Continuous Deployment on Vercel with automatic Git branch synchronization")
    ]
    
    pdf.set_font('Helvetica', '', 9)
    for k, v in tech_items:
        pdf.set_font('Helvetica', 'B', 9)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(48, 5.5, k + ":")
        pdf.set_font('Helvetica', '', 9)
        pdf.set_text_color(71, 85, 105)
        pdf.cell(0, 5.5, v, ln=True)
        
    pdf.ln(5)
    pdf.set_font('Helvetica', 'B', 12)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 7, 'Space Apps Challenge Criteria Alignment', ln=True)
    
    criteria = (
        "- Challenge Goal: Build a tool to show how the sky changes over time using SPHEREx and infrared surveys.\n"
        "- Innovation: Combines the historic Tombaugh blink method with real SPHEREx DR1 infrared cubes and a 'Detective Vision' hint system.\n"
        "- Usability: Tested and formatted for universal accessibility - any student or judge can use it in under 30 seconds.\n"
        "- Scientific Integrity: Download links provided for original NASA Level 2 Multi-Extension FITS files on every observation."
    )
    pdf.set_font('Helvetica', '', 9)
    pdf.set_text_color(51, 65, 85)
    pdf.multi_cell(0, 4.8, criteria)
    
    # Save PDF
    pdf.output(output_path)
    print(f"PDF successfully written to: {output_path}")

if __name__ == '__main__':
    target = os.path.abspath('Cosmic_Echo_Atlas_Project_Explanation.pdf')
    create_pdf(target)
