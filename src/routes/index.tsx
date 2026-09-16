import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  HeartHandshake,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import livingRoom from "@/assets/vclean-living-room.jpg";
import kitchen from "@/assets/vclean-kitchen.jpg";
import office from "@/assets/vclean-office.jpg";
import bathroomBefore from "@/assets/vclean-bathroom-before.jpg";
import bathroomAfter from "@/assets/vclean-bathroom-after.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VClean Solutions | Professional Cleaning Luton" },
      {
        name: "description",
        content:
          "Professional home and office cleaning in Luton and nearby areas. Vetted crews, eco-friendly products and a 100% satisfaction guarantee.",
      },
      { property: "og:title", content: "VClean Solutions | Every space, wiped spotless." },
      {
        property: "og:description",
        content: "Professional cleaning from £25 per hour across Bedfordshire, Buckinghamshire and Hertfordshire.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VCleanPage,
});

type Service = {
  name: string;
  short: string;
  rate: number;
  icon: typeof Sparkles;
  frequency: string;
  checklist: string[];
};

const services: Service[] = [
  { name: "Residential Cleaning", short: "A reliable reset for calm, comfortable homes.", rate: 22, icon: Sparkles, frequency: "Weekly or fortnightly", checklist: ["Kitchen surfaces & appliances", "Bathrooms sanitised", "Dusting throughout", "Vacuuming & mopping", "Bins emptied"] },
  { name: "Office & Commercial", short: "Quietly thorough care for productive workplaces.", rate: 26, icon: Building2, frequency: "Daily or weekly", checklist: ["Desks & shared surfaces", "Kitchens & washrooms", "Floors & entrance areas", "Touchpoint disinfection", "Waste removal"] },
  { name: "Deep Cleaning", short: "A meticulous, room-by-room top-to-bottom clean.", rate: 28, icon: ShieldCheck, frequency: "Every 3–6 months", checklist: ["Skirting & door frames", "Inside cupboards", "Limescale treatment", "Behind movable furniture", "Detailed kitchen degrease"] },
  { name: "Move-In / Move-Out", short: "Leave one home beautifully and enter the next fresh.", rate: 30, icon: ArrowRight, frequency: "At every move", checklist: ["Inside cupboards & wardrobes", "Appliance interiors", "Fixtures & fittings", "Complete floor care", "Final inspection"] },
  { name: "Carpet & Upholstery", short: "Fabric-safe extraction that revives every fibre.", rate: 32, icon: Sparkles, frequency: "Every 6–12 months", checklist: ["Pre-treatment", "Spot stain treatment", "Hot water extraction", "Deodorising", "Fabric-safe finish"] },
  { name: "Window Cleaning", short: "Streak-free clarity, inside and out.", rate: 24, icon: Sparkles, frequency: "Every 4–8 weeks", checklist: ["Interior glass", "Exterior glass", "Frames & sills", "Streak-free polish", "Accessible skylights"] },
  { name: "Post-Construction", short: "Fine-detail finishing after the builders leave.", rate: 32, icon: Building2, frequency: "After renovation", checklist: ["Fine dust removal", "Paint spot treatment", "Cabinet interiors", "Glass & frames", "Full floor clean"] },
  { name: "Disinfection & Turnover", short: "Fast, hygienic resets between guests or tenants.", rate: 28, icon: Leaf, frequency: "Every turnover", checklist: ["High-touch disinfection", "Kitchen & bathroom reset", "Linen change", "Supply check", "Photo-ready finish"] },
];

const addOns = [
  ["Oven Deep Scrub", 35],
  ["Fridge & Freezer", 25],
  ["Interior Windows", 30],
  ["Carpet Steam", 40],
  ["Balcony", 25],
  ["Hypoallergenic Eco Kit", 10],
] as const;

const reviews = [
  { name: "Rachel M.", location: "Luton", service: "Home cleaning", quote: "The whole house felt lighter. Thoughtful, punctual and genuinely spotless — even the details I usually miss." },
  { name: "Daniel K.", location: "Dunstable", service: "Move-out", quote: "Our move-out clean was immaculate. The agent commented on it, and our full deposit came straight back." },
  { name: "Sofia P.", location: "Harpenden", service: "Deep clean", quote: "A lovely team and an exceptional deep clean. Everything felt cared for rather than simply rushed through." },
  { name: "James H.", location: "Milton Keynes", service: "Office", quote: "Reliable every week, flexible around our team, and the office is always ready before the first person arrives." },
  { name: "Claire T.", location: "Hitchin", service: "Carpet care", quote: "I thought the hallway carpet was beyond saving. It looks fresh, smells clean and dried surprisingly quickly." },
];

const features = [
  { icon: BadgeCheck, title: "Vetted & insured", text: "DBS-checked cleaners you can trust in your space." },
  { icon: Leaf, title: "Kinder products", text: "100% eco-friendly, hypoallergenic cleaning options." },
  { icon: HeartHandshake, title: "Our promise", text: "Not delighted? We return and re-clean for free." },
  { icon: ShieldCheck, title: "Clear pricing", text: "Transparent hourly rates with zero hidden fees." },
  { icon: CalendarDays, title: "Built around you", text: "One-off or recurring cleans, seven days a week." },
];

const heroCards = [
  { image: livingRoom, title: "Home, reset", label: "Residential", className: "md:translate-y-10" },
  { image: kitchen, title: "Details, perfected", label: "Deep cleaning", className: "" },
  { image: office, title: "Ready for work", label: "Commercial", className: "md:translate-y-16" },
];

const revealPresets = ["Gourmet Kitchen", "Luxury En-Suite", "Living Room Reset", "Corporate Workspace"];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function VCleanPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [serviceDetail, setServiceDetail] = useState<Service | null>(null);
  const [selectedService, setSelectedService] = useState<Service>(services[0] ?? { name: "Residential Cleaning", short: "A reliable reset for calm, comfortable homes.", rate: 22, icon: Sparkles, frequency: "Weekly or fortnightly", checklist: [] });
  const [hours, setHours] = useState(3);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [postcode, setPostcode] = useState("");
  const [coverage, setCoverage] = useState<{ ok: boolean; message: string; detail: string } | null>(null);
  const [reveal, setReveal] = useState(52);
  const [revealPreset, setRevealPreset] = useState(revealPresets[1]);
  const [confirmed, setConfirmed] = useState(false);

  const total = useMemo(() => {
    const extras = addOns.filter(([name]) => selectedAddOns.includes(name)).reduce((sum, [, price]) => sum + price, 0);
    return selectedService.rate * hours + extras;
  }, [selectedService, hours, selectedAddOns]);

  const checkPostcode = (value = postcode) => {
    const normalised = value.trim().toUpperCase().replace(/\s/g, "");
    const prefix = normalised.match(/^[A-Z]{1,2}\d{1,2}/)?.[0] ?? "";
    if (["LU1", "LU2", "LU3", "LU4", "LU5", "LU6"].some((p) => prefix.startsWith(p))) {
      setCoverage({ ok: true, message: "You're in our Priority Zone", detail: "Typical crew arrival: 30–45 minutes · Priority tier" });
    } else if (["MK", "AL", "HP", "SG", "WD"].some((p) => prefix.startsWith(p))) {
      setCoverage({ ok: true, message: "Good news — we cover your area", detail: "Typical crew arrival: 45–75 minutes · Standard tier" });
    } else {
      setCoverage({ ok: false, message: "Let's check this one personally", detail: "Call us and we'll confirm the nearest available crew." });
    }
  };

  const selectForBooking = (service: Service) => {
    setSelectedService(service);
    setServiceDetail(null);
    window.setTimeout(() => scrollTo("book"), 100);
  };

  const submitBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConfirmed(true);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <button className="flex items-center gap-3" onClick={() => scrollTo("home")} aria-label="VClean Solutions home">
            <BrandMark />
            <span className="leading-none"><strong className="block font-display text-lg">VClean</strong><span className="text-[10px] font-semibold uppercase text-muted-foreground">Solutions</span></span>
          </button>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            {[ ["Services", "services"], ["Why Us", "why-us"], ["Before/After", "results"], ["Areas", "areas"], ["Reviews", "reviews"], ["Book Now", "book"] ].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id ?? "home")} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">{label}</button>
            ))}
          </nav>
          <div className="hidden items-center gap-3 xl:flex">
            <a href="tel:+447429099670" className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold"><Phone className="size-4 text-accent" />+44 7429 099670</a>
            <Button size="lg" onClick={() => scrollTo("book")}>Get Instant Quote <ArrowRight /></Button>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</Button>
        </div>
        {menuOpen && <nav className="border-t border-border bg-background px-5 py-5 lg:hidden">{[["Services", "services"], ["Why Us", "why-us"], ["Before/After", "results"], ["Areas", "areas"], ["Reviews", "reviews"], ["Book Now", "book"]].map(([label, id]) => <button key={id} onClick={() => { scrollTo(id ?? "home"); setMenuOpen(false); }} className="block w-full border-b border-border py-3 text-left font-semibold">{label}</button>)}</nav>}
      </header>

      <section id="home" className="relative bg-hero pt-32 pb-24 text-primary-foreground md:pt-40 md:pb-32">
        <div className="hero-grid absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="animate-fade-up">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-xs font-bold uppercase"><Sparkles className="size-4 text-mint" /> Professional Cleaning Services</div>
              <h1 className="max-w-3xl font-display text-5xl leading-[0.98] sm:text-6xl lg:text-7xl">Every space,<br/><span className="text-mint">wiped spotless.</span></h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-primary-foreground/75 sm:text-lg">VClean Solutions handles the cleaning so you don't have to — homes, offices, move-outs, and everything in between. Vetted crews, eco-friendly products, and a guarantee we stand behind.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="h-13 bg-mint px-7 text-primary hover:bg-mint/90" onClick={() => scrollTo("book")}>Book a Clean <ArrowRight /></Button>
                <Button size="lg" variant="outline" className="h-13 border-primary-foreground/25 bg-primary-foreground/5 px-7 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={() => scrollTo("book")}>Calculate Instant Quote</Button>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-primary-foreground/80"><span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-mint" /> DBS-checked teams</span><span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-mint" /> Fully insured</span><span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-mint" /> Eco-friendly</span></div>
            </div>
            <div className="relative grid h-[470px] grid-cols-3 gap-3 sm:gap-5">
              {heroCards.map((card, i) => <article key={card.title} className={`group relative h-[390px] overflow-hidden rounded-lg shadow-2xl animate-float-${i + 1} ${card.className}`}><img src={card.image} alt={card.title} width={1200} height={912} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /><div className="absolute inset-x-0 bottom-0 bg-image-fade p-3 sm:p-5"><span className="text-[10px] font-bold uppercase text-mint">{card.label}</span><h2 className="mt-1 font-display text-base sm:text-xl">{card.title}</h2></div></article>)}
              <div className="absolute -bottom-2 left-[30%] flex items-center gap-3 rounded-md bg-card p-3 text-card-foreground shadow-xl"><span className="grid size-9 place-items-center rounded-full bg-accent/15 text-accent"><Star className="size-4 fill-current" /></span><span><strong className="block text-sm">4.9 exceptional</strong><small className="text-muted-foreground">from 280+ reviews</small></span></div>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 border-y border-primary-foreground/15 md:grid-cols-4">
            {[["4.9★", "average rating"], ["280+", "verified reviews"], ["100%", "satisfaction guarantee"], ["£25/hr", "starting rate"]].map(([value, label]) => <div key={label} className="border-primary-foreground/15 px-3 py-6 md:border-r md:last:border-r-0"><strong className="font-display text-3xl text-mint">{value}</strong><span className="mt-1 block text-xs uppercase text-primary-foreground/55">{label}</span></div>)}
          </div>
        </div>
      </section>

      <section id="why-us" className="scroll-mt-24 border-b border-border bg-card py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="The VClean standard" title="Care you can feel in every room." copy="Trusted people, considered products and a promise that leaves no room for compromise." />
          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">{features.map(({ icon: Icon, title, text }) => <article key={title} className="bg-card p-6"><span className="mb-8 grid size-11 place-items-center rounded-md bg-accent/10 text-accent"><Icon /></span><h3 className="font-display text-lg">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></article>)}</div>
          <div className="mt-9 flex flex-wrap items-center justify-between gap-4 rounded-md bg-primary px-6 py-5 text-primary-foreground"><p className="font-display text-xl">10+ years in business. Replies in under 24 hours.</p><a href="tel:+447429099670" className="inline-flex items-center gap-2 text-sm font-bold text-mint"><Phone className="size-4" /> Speak to our team</a></div>
        </div>
      </section>

      <section id="services" className="scroll-mt-20 bg-soft py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><SectionHeading eyebrow="Services & pricing" title="Precisely the clean you need." copy="Clear hourly rates, thoughtful service, zero surprises." /><p className="rounded-md border border-border bg-card px-4 py-3 text-sm"><span className="text-muted-foreground">General services start from</span> <strong className="text-primary">£25 per hour</strong></p></div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => { const Icon = service.icon; return <article key={service.name} className="group flex min-h-72 flex-col rounded-lg border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl"><div className="flex items-start justify-between"><span className="grid size-11 place-items-center rounded-md bg-primary text-primary-foreground"><Icon /></span><span className="text-xs font-bold text-muted-foreground">0{index + 1}</span></div><h3 className="mt-8 font-display text-xl">{service.name}</h3><p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{service.short}</p><div className="mt-6 flex items-center justify-between border-t border-border pt-4"><span><strong className="font-display text-2xl">£{service.rate}</strong><small className="text-muted-foreground"> /hr</small></span><Button variant="ghost" size="icon" onClick={() => setServiceDetail(service)} aria-label={`View ${service.name} details`}><ChevronRight /></Button></div></article>; })}
          </div>
        </div>
      </section>

      <section id="results" className="scroll-mt-20 bg-background py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
          <div><SectionHeading eyebrow="Before / After" title="The difference is in the detail." copy="Drag across a recent transformation to see what a meticulous VClean finish looks like." /><div className="mt-8 flex flex-wrap gap-2">{revealPresets.map((preset) => <Button key={preset} size="sm" variant={preset === revealPreset ? "default" : "outline"} onClick={() => setRevealPreset(preset)}>{preset}</Button>)}</div><div className="mt-8 rounded-md border border-border bg-soft p-5"><div className="flex items-center gap-3"><Sparkles className="text-accent" /><div><strong className="block">{revealPreset}</strong><span className="text-sm text-muted-foreground">A complete detail clean, finished and inspected.</span></div></div></div></div>
          <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-muted shadow-2xl" aria-label={`${revealPreset} before and after comparison`}>
            <img src={bathroomBefore} alt={`${revealPreset} before cleaning`} width={1200} height={800} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${reveal}%` }}><img src={bathroomAfter} alt={`${revealPreset} after cleaning`} width={1200} height={800} loading="lazy" className="absolute inset-y-0 left-0 h-full max-w-none object-cover" style={{ width: "min(100vw, 760px)" }} /></div>
            <div className="absolute inset-y-0 w-0.5 bg-card shadow-xl" style={{ left: `${reveal}%` }}><span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-card text-primary shadow-xl">↔</span></div>
            <span className="absolute left-4 top-4 rounded-sm bg-primary/85 px-3 py-1 text-xs font-bold text-primary-foreground">AFTER</span><span className="absolute right-4 top-4 rounded-sm bg-primary/85 px-3 py-1 text-xs font-bold text-primary-foreground">BEFORE</span>
            <input type="range" min="8" max="92" value={reveal} onChange={(e) => setReveal(Number(e.target.value))} className="absolute inset-0 h-full w-full cursor-col-resize opacity-0" aria-label="Move before and after comparison" />
          </div>
        </div>
      </section>

      <section id="areas" className="scroll-mt-20 bg-primary py-24 text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <div><p className="section-eyebrow text-mint">Local teams, ready when you are</p><h2 className="mt-4 max-w-xl font-display text-4xl sm:text-5xl">Is VClean already near you?</h2><p className="mt-5 max-w-lg leading-7 text-primary-foreground/70">We cover homes and workplaces across Bedfordshire, Buckinghamshire and Hertfordshire, seven days a week.</p><div className="mt-8 flex flex-wrap gap-2 text-sm">{["Bedfordshire", "Buckinghamshire", "Hertfordshire"].map((area) => <span key={area} className="rounded-full border border-primary-foreground/20 px-4 py-2">{area}</span>)}</div></div>
          <div className="rounded-lg bg-card p-6 text-card-foreground shadow-2xl sm:p-8"><label htmlFor="area-postcode" className="font-display text-xl">Check your postcode</label><p className="mt-2 text-sm text-muted-foreground">Try LU1, LU5, MK45 or AL5.</p><div className="mt-5 flex flex-col gap-3 sm:flex-row"><input id="area-postcode" value={postcode} onChange={(e) => setPostcode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && checkPostcode()} placeholder="Enter postcode" className="h-12 min-w-0 flex-1 rounded-md border border-input bg-background px-4 uppercase outline-none focus:ring-2 focus:ring-ring" /><Button className="h-12" onClick={() => checkPostcode()}>Check coverage</Button></div>{coverage && <div className={`mt-5 rounded-md border p-4 ${coverage.ok ? "border-accent/30 bg-accent/10" : "border-gold/40 bg-gold/10"}`}><strong className="flex items-center gap-2">{coverage.ok ? <CheckCircle2 className="text-accent" /> : <Phone className="text-gold" />}{coverage.message}</strong><p className="mt-1 text-sm text-muted-foreground">{coverage.detail}</p></div>}</div>
        </div>
      </section>

      <section id="reviews" className="scroll-mt-20 bg-soft py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><SectionHeading eyebrow="Verified reviews" title="Loved locally." copy="Real words from clients who trust VClean with their spaces." /><div className="flex items-center gap-3"><strong className="font-display text-4xl">4.9</strong><div><Stars /><small className="text-muted-foreground">280+ reviews</small></div></div></div></div>
        <div className="review-track mt-12 flex w-max gap-4 px-4">{[...reviews, ...reviews].map((review, index) => <article key={`${review.name}-${index}`} className="w-[320px] shrink-0 rounded-lg border border-border bg-card p-6 sm:w-[390px]"><div className="flex items-center justify-between"><Stars /><BadgeCheck className="size-5 text-accent" /></div><blockquote className="mt-7 font-display text-xl leading-8">“{review.quote}”</blockquote><div className="mt-8 flex items-end justify-between border-t border-border pt-4"><span><strong className="block">{review.name}</strong><small className="text-muted-foreground">{review.location}</small></span><span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">{review.service}</span></div></article>)}</div>
      </section>

      <section id="book" className="scroll-mt-20 bg-background py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8"><SectionHeading eyebrow="Instant quote" title="Your spotless space starts here." copy="Tell us what you need and see your estimate update instantly." />
          <form onSubmit={submitBooking} className="mt-12 grid overflow-hidden rounded-lg border border-border bg-card shadow-xl lg:grid-cols-[1fr_340px]">
            <div className="space-y-10 p-5 sm:p-9">
              <FormStep number="01" title="Choose a service"><div className="grid gap-3 sm:grid-cols-2">{services.map((service) => <label key={service.name} className={`cursor-pointer rounded-md border p-4 transition ${selectedService.name === service.name ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-accent"}`}><input type="radio" name="service" value={service.name} checked={selectedService.name === service.name} onChange={() => setSelectedService(service)} className="sr-only" /><span className="flex items-center justify-between gap-3 text-sm font-semibold"><span>{service.name}</span><span>£{service.rate}/hr</span></span></label>)}</div></FormStep>
              <FormStep number="02" title="Property size / estimated time"><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[[2, "Studio / small"], [3, "1–2 bedrooms"], [4, "3–4 bedrooms"], [6, "Large / office"]].map(([value, label]) => <label key={value} className={`cursor-pointer rounded-md border p-4 text-center ${hours === value ? "border-accent bg-accent/10" : "border-border"}`}><input type="radio" name="hours" value={value} checked={hours === value} onChange={() => setHours(Number(value))} className="sr-only" /><strong className="block font-display text-xl">{value} hrs</strong><small className="text-muted-foreground">{label}</small></label>)}</div></FormStep>
              <FormStep number="03" title="Useful add-ons"><div className="grid gap-3 sm:grid-cols-2">{addOns.map(([name, price]) => { const active = selectedAddOns.includes(name); return <label key={name} className={`flex cursor-pointer items-center justify-between rounded-md border p-4 ${active ? "border-accent bg-accent/10" : "border-border"}`}><input type="checkbox" checked={active} onChange={() => setSelectedAddOns(active ? selectedAddOns.filter((item) => item !== name) : [...selectedAddOns, name])} className="sr-only" /><span className="flex items-center gap-3 text-sm font-medium"><span className={`grid size-5 place-items-center rounded-sm border ${active ? "border-accent bg-accent text-accent-foreground" : "border-input"}`}>{active && <Check className="size-3" />}</span>{name}</span><strong>+£{price}</strong></label>; })}</div></FormStep>
              <FormStep number="04" title="Your address"><div className="grid gap-3 sm:grid-cols-[0.45fr_1fr]"><input required placeholder="Postcode" value={postcode} onChange={(e) => setPostcode(e.target.value)} onBlur={() => postcode && checkPostcode()} className="form-field uppercase" /><input required placeholder="Address line" className="form-field" /></div>{coverage && <p className={`mt-3 flex items-center gap-2 text-sm font-semibold ${coverage.ok ? "text-accent" : "text-destructive"}`}>{coverage.ok ? <CheckCircle2 className="size-4" /> : <MapPin className="size-4" />}{coverage.message}</p>}</FormStep>
              <FormStep number="05" title="Preferred time"><div className="grid gap-3 sm:grid-cols-2"><label><span className="mb-2 block text-xs font-bold uppercase text-muted-foreground">Date</span><input required type="date" className="form-field" /></label><label><span className="mb-2 block text-xs font-bold uppercase text-muted-foreground">Arrival window</span><select required className="form-field"><option>9:00 AM – 11:00 AM</option><option>11:00 AM – 1:00 PM</option><option>1:00 PM – 3:00 PM</option><option>3:00 PM – 5:00 PM</option></select></label></div></FormStep>
              <FormStep number="06" title="Contact details"><div className="grid gap-3 sm:grid-cols-2"><input required name="name" placeholder="Full name" className="form-field" /><input required type="tel" placeholder="Phone number" className="form-field" /><input required type="email" placeholder="Email address" className="form-field sm:col-span-2" /></div></FormStep>
            </div>
            <aside className="bg-primary p-6 text-primary-foreground sm:p-8 lg:sticky lg:top-20 lg:h-fit"><p className="text-xs font-bold uppercase text-mint">Your instant estimate</p><h3 className="mt-3 font-display text-2xl">{selectedService.name}</h3><div className="mt-8 space-y-4 border-y border-primary-foreground/15 py-6 text-sm"><p className="flex justify-between"><span className="text-primary-foreground/65">Cleaning time</span><strong>{hours} hours</strong></p><p className="flex justify-between"><span className="text-primary-foreground/65">Hourly rate</span><strong>£{selectedService.rate}</strong></p><p className="flex justify-between"><span className="text-primary-foreground/65">Add-ons</span><strong>{selectedAddOns.length || "None"}</strong></p></div><div className="mt-6 flex items-end justify-between"><span className="text-sm text-primary-foreground/65">Estimated total</span><strong className="font-display text-4xl text-mint">£{total}</strong></div><p className="mt-3 text-xs leading-5 text-primary-foreground/55">Final price is confirmed after we review your booking details.</p><Button type="submit" className="mt-8 h-13 w-full bg-mint text-primary hover:bg-mint/90">Request this clean <ArrowRight /></Button><p className="mt-4 text-center text-xs text-primary-foreground/55">No payment required today</p></aside>
          </form>
        </div>
      </section>

      <footer className="bg-ink py-16 text-primary-foreground"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="grid gap-10 border-b border-primary-foreground/15 pb-12 md:grid-cols-2 lg:grid-cols-4"><div><div className="flex items-center gap-3"><BrandMark /><strong className="font-display text-xl">VClean Solutions</strong></div><p className="mt-5 max-w-xs text-sm leading-6 text-primary-foreground/60">Professional cleaning for homes and workplaces. Every space, wiped spotless.</p><div className="mt-5 flex items-center gap-2 text-gold"><Stars /><span className="text-xs text-primary-foreground/60">4.9 from 280+ reviews</span></div></div><FooterGroup title="Contact"><a href="tel:+447429099670"><Phone />+44 7429 099670</a><a href="mailto:vcleansolutions.co@gmail.com"><Mail />vcleansolutions.co@gmail.com</a><span><MapPin />Luton, Bedfordshire, UK</span></FooterGroup><FooterGroup title="Opening hours"><span><Clock3 />Mon – Sun</span><span className="pl-6">9:00 AM – 6:00 PM</span><span><BadgeCheck />Replies within 24 hours</span></FooterGroup><FooterGroup title="Service areas"><span>Bedfordshire</span><span>Buckinghamshire</span><span>Hertfordshire</span></FooterGroup></div><div className="flex flex-col justify-between gap-3 pt-7 text-xs text-primary-foreground/45 sm:flex-row"><span>© 2026 VClean Solutions. All rights reserved.</span><span>Vetted crews · Fully insured · Satisfaction guaranteed</span></div></div></footer>

      {serviceDetail && <div className="fixed inset-0 z-50 grid place-items-center bg-overlay p-4" role="dialog" aria-modal="true" aria-labelledby="service-title" onMouseDown={(e) => e.currentTarget === e.target && setServiceDetail(null)}><div className="relative w-full max-w-xl rounded-lg bg-card p-7 shadow-2xl sm:p-9"><Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => setServiceDetail(null)} aria-label="Close service details"><X /></Button><p className="section-eyebrow">From £{serviceDetail.rate} / hour</p><h2 id="service-title" className="mt-3 pr-10 font-display text-3xl">{serviceDetail.name}</h2><p className="mt-3 text-muted-foreground">{serviceDetail.short}</p><div className="mt-7 rounded-md bg-soft p-5"><p className="text-xs font-bold uppercase text-muted-foreground">Every clean includes</p><ul className="mt-4 grid gap-3 sm:grid-cols-2">{serviceDetail.checklist.map((item) => <li key={item} className="flex items-center gap-2 text-sm"><CheckCircle2 className="size-4 text-accent" />{item}</li>)}</ul></div><p className="mt-5 flex items-center gap-2 text-sm"><CalendarDays className="size-4 text-accent" /><strong>Recommended:</strong> {serviceDetail.frequency}</p><Button size="lg" className="mt-7 w-full" onClick={() => selectForBooking(serviceDetail)}>Select for booking <ArrowRight /></Button></div></div>}

      {confirmed && <div className="fixed inset-0 z-50 grid place-items-center bg-overlay p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><div className="w-full max-w-md rounded-lg bg-card p-8 text-center shadow-2xl"><span className="mx-auto grid size-16 place-items-center rounded-full bg-accent/10 text-accent"><CheckCircle2 className="size-8" /></span><p className="section-eyebrow mt-6">Request received</p><h2 id="confirm-title" className="mt-3 font-display text-3xl">Your clean is nearly booked.</h2><p className="mt-4 leading-7 text-muted-foreground">We’ll contact you within 24 hours to confirm your {selectedService.name.toLowerCase()} and estimated total of £{total}.</p><div className="mt-6 rounded-md bg-soft p-4 text-sm"><strong>{hours} hours · {selectedAddOns.length} add-ons</strong><span className="mt-1 block text-muted-foreground">VClean Solutions, Luton</span></div><Button className="mt-7 w-full" onClick={() => setConfirmed(false)}>Done</Button></div></div>}
    </main>
  );
}

function BrandMark() { return <span className="relative grid size-10 place-items-center rounded-md bg-accent text-accent-foreground"><Sparkles className="size-5" /><span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-current bg-mint" /></span>; }

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) { return <div className="max-w-2xl"><p className="section-eyebrow">{eyebrow}</p><h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">{title}</h2><p className="mt-4 max-w-xl leading-7 text-muted-foreground">{copy}</p></div>; }

function Stars() { return <span className="flex gap-0.5 text-gold" aria-label="5 out of 5 stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-4 fill-current" />)}</span>; }

function FormStep({ number, title, children }: { number: string; title: string; children: React.ReactNode }) { return <fieldset><legend className="mb-5 flex items-center gap-3 font-display text-xl"><span className="text-xs font-bold text-accent">{number}</span>{title}</legend>{children}</fieldset>; }

function FooterGroup({ title, children }: { title: string; children: React.ReactNode }) { return <div><h3 className="mb-5 text-xs font-bold uppercase text-mint">{title}</h3><div className="flex flex-col gap-3 text-sm text-primary-foreground/65 [&_a]:flex [&_a]:items-center [&_a]:gap-2 [&_a]:transition-colors [&_a:hover]:text-mint [&_span]:flex [&_span]:items-center [&_span]:gap-2 [&_svg]:size-4">{children}</div></div>; }