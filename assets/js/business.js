/* ============================================================
   BUSINESS CONFIGURATION — edit here once, the whole site updates.
   Clean Water Movers is a Nairobi-based movers and transport company
   (house moving, office relocation, furniture and goods transport),
   with water tanker delivery offered as a secondary service.
   ============================================================ */
const BUSINESS = {
  name: "Clean Water Movers",
  tagline: "Movers & Transport",
  location: "Nairobi & Kiambu County, Kenya",
  siteUrl: "https://www.cleanwatermovers.shop",
  phoneDisplay: "0720 792 185",
  phoneDial: "+254720792185",
  whatsapp: "254720792185",
  email: "njugunagodffrey@gmail.com",
};

/* Prefilled WhatsApp messages by enquiry type. {loc} is filled in automatically. */
const WA_MESSAGES = {
  quote: "Hi Clean Water Movers, I'd like a moving quote{loc}.",
  house: "Hi Clean Water Movers, I'd like a quote for house moving{loc}.",
  office: "Hi Clean Water Movers, I'd like a quote for office relocation{loc}.",
  furniture: "Hi Clean Water Movers, I'd like a quote for furniture moving{loc}.",
  relocation: "Hi Clean Water Movers, I'd like to enquire about relocation services{loc}.",
  transport: "Hi Clean Water Movers, I'd like to enquire about goods transport{loc}.",
  water: "Hi Clean Water Movers, I need water delivery{loc}. I'd like to get a quote.",
  general: "Hi Clean Water Movers, I'd like to enquire about your moving and transport services{loc}.",
};

function waLink(kind, location) {
  const template = WA_MESSAGES[kind] || WA_MESSAGES.general;
  const msg = template.replace("{loc}", location ? ` in ${location}` : "");
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(msg)}`;
}

function initBusinessLinks() {
  document.querySelectorAll("[data-wa]").forEach((el) => {
    const loc = el.getAttribute("data-wa-location") || window.PAGE_LOCATION || "";
    el.setAttribute("href", waLink(el.getAttribute("data-wa"), loc));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
  document.querySelectorAll("[data-call]").forEach((el) => el.setAttribute("href", `tel:${BUSINESS.phoneDial}`));
  document.querySelectorAll("[data-phone-text]").forEach((el) => { el.textContent = BUSINESS.phoneDisplay; });
  document.querySelectorAll("[data-email]").forEach((el) => {
    el.setAttribute("href", `mailto:${BUSINESS.email}`);
    if (el.hasAttribute("data-fill-text")) el.textContent = BUSINESS.email;
  });
}

document.addEventListener("DOMContentLoaded", initBusinessLinks);
