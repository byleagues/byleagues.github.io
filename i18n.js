/* Merkezi çeviri sözlüğü + dil değiştirici (sayfa yenilemeden çalışır).
   Dil tercihi localStorage'da ve ?lang= parametresinde saklanır. */
(() => {
  const STORAGE_KEY = "byleagues-lang";
  const DEFAULT_LANG = "tr";
  const SUPPORTED = ["tr", "en"];

  const dict = {
    tr: {
      "meta.title": "ByLeagues | Minecraft Geliştirme ve Sunucu Yönetimi",
      "meta.description": "ByLeagues: Java ve Paper/Spigot ile Minecraft eklentileri, Discord botları ve sunucu yönetimi üzerine çalışmalar ve deneyimler.",
      "nav.label": "Ana menü",
      "nav.profile": "Hakkımda",
      "nav.skills": "Teknolojiler",
      "nav.projects": "Deneyimlerim",
      "nav.contact": "İletişim",
      "nav.open": "Menüyü aç",
      "nav.close": "Menüyü kapat",
      "theme.toggle": "Açık/koyu tema değiştir",
      "lang.label": "Dil",
      "social.label": "Sosyal medya linkleri",
      "social.github": "GitHub",
      "social.discord": "Discord",
      "social.mail": "Mail",
      "hero.hi": "Merhaba, ben",
      "hero.name": "Yusuf,",
      "hero.role": "Minecraft Geliştiricisiyim.",
      "hero.text": "Java ve Paper/Spigot ile Minecraft sunucuları için özel sistemler, Discord botları geliştiriyorum. Sunucu ve topluluk yönetiminde de aktif rol alıyorum.",
      "hero.work": "Projelerimi İncele",
      "hero.contact": "İletişime Geç",
      "about.title": "Hakkımda",
      "about.tagline": "Geliştirme ve topluluk yönetimi.",
      "about.lead1": "Sunucular için",
      "about.lead2": "işe yarayan",
      "about.lead3": "sistemler geliştiriyorum.",
      "about.p1": "Java ile Minecraft eklentileri ve <strong>Discord botları</strong> geliştiriyorum. Çalışmalarımda sunucunun ihtiyaçlarına ve günlük kullanımına odaklanıyorum.",
      "about.p2": "MC-TR Forum'da moderatör ekibi şefi, InfernoMC'de yöneticiyim. Teknik geliştirmeyi ekip koordinasyonu ve oyuncu deneyimiyle birlikte ele alıyorum.",
      "about.years": "Yıllık deneyim",
      "about.jobs": "Tamamlanan iş",
      "expertise.title": "Uzmanlık Alanlarım",
      "expertise.lead": "Geliştirme ve yönetimde odaklandığım alanlar.",
      "expertise.plugins.title": "Minecraft Plugin Development",
      "expertise.plugins.desc": "Java ve Paper/Spigot API ile sunucuya özel eklenti ve sistemler geliştiriyorum.",
      "expertise.server.title": "Minecraft Server Management",
      "expertise.server.desc": "Sunucu operasyonları, ekip koordinasyonu ve oyuncu deneyimi süreçlerini yönetiyorum.",
      "expertise.bots.title": "Discord Bot Development",
      "expertise.bots.desc": "Discord.js ile moderasyon, güvenlik ve topluluk yönetimi botları geliştiriyorum.",
      "expertise.web.title": "Web Interface Development",
      "expertise.web.desc": "Okunabilir, responsive ve kullanımı kolay web arayüzleri hazırlıyorum.",
      "skills.title": "Kullandığım Teknolojiler",
      "exp.title": "Deneyimlerim",
      "exp.lead": "Forum ve Minecraft sunucularında üstlendiğim yönetim görevleri.",
      "work.title": "Geliştirme Çalışmalarım",
      "work.lead": "Minecraft, Discord ve web arayüzlerinde geliştirdiğim sistemler.",
      "planned.title": "Planlanan Çalışmalar",
      "planned.lead": "Henüz yayına alınmamış girişim.",
      "exp.mctr.date": "2026 - Günümüz",
      "exp.mctr.cat": "Forum",
      "exp.mctr.title": "MC-TR Forum",
      "exp.mctr.desc": "MC-TR forum sitesinde moderatör ekibi şefi olarak kullanıcı düzeni, ekip koordinasyonu ve forum içi süreçlerde aktif rol alıyorum.",
      "exp.mctr.tag0": "Moderatör Ekibi Şefi",
      "exp.mctr.tag1": "Topluluk Düzeni",
      "exp.inferno.date": "2026 - Günümüz",
      "exp.inferno.cat": "Minecraft",
      "exp.inferno.title": "InfernoMC",
      "exp.inferno.desc": "InfernoMC, Minecraft sunucusunda yönetici olarak sunucu düzeni, ekip koordinasyonu ve oyuncu deneyimi tarafında süreçleri yönetiyorum.",
      "exp.inferno.tag0": "Yönetici",
      "exp.inferno.tag1": "Sunucu Operasyonu",
      "exp.inferno.tag2": "Ekip Koordinasyonu",
      "exp.web.date": "2026 - Günümüz",
      "exp.web.cat": "Web Tasarımı",
      "exp.web.title": "Portfolio Web Tasarımları",
      "exp.web.desc": "Kişisel portfolyo siteleri için arayüz tasarımı ve responsive web geliştirme üzerine çalışıyorum.",
      "exp.web.tag0": "Arayüz Tasarımı",
      "exp.web.tag1": "Responsive Web",
      "exp.tox.date": "2025 - 2026",
      "exp.tox.cat": "Minecraft",
      "exp.tox.title": "ToxCraft Sunucusu",
      "exp.tox.desc": "ToxCraft sunucusunda üst yönetim ekibinde yer aldım; ekip işleyişi, topluluk yönetimi ve sunucu içi operasyonlarda çalıştım.",
      "exp.tox.tag0": "Üst Yönetim",
      "exp.tox.tag1": "Topluluk Yönetimi",
      "exp.tox.tag2": "Oyuncu Deneyimi",
      "exp.studio.date": "Yakında",
      "exp.studio.cat": "Studio",
      "exp.studio.title": "Tox Studio",
      "exp.studio.desc": "Discord botları, plugin paketleri ve sunuculara yönelik hazır sistemler üzerine konumlanacak yeni proje.",
      "exp.studio.tag0": "Discord Botları",
      "exp.studio.tag1": "Plugin Paketleri",
      "exp.studio.tag2": "Hazır Sistemler",
      "exp.plugins.date": "2021 - Günümüz",
      "exp.plugins.cat": "Development",
      "exp.plugins.title": "Özel Eklenti ve Paket Geliştirme",
      "exp.plugins.desc": "Minecraft sunucuları için özel eklenti ve paket geliştirme üzerine çalışıyorum.",
      "exp.plugins.tag0": "Özel Eklentiler",
      "exp.plugins.tag1": "Plugin Paketleri",
      "exp.bots.date": "2020 - Günümüz",
      "exp.bots.cat": "Development",
      "exp.bots.title": "Özel Discord Botları",
      "exp.bots.desc": "Moderasyon, guard, topluluk yönetimi ve Minecraft sunucularıyla bağlantılı özel Discord bot sistemleri geliştirdim.",
      "exp.bots.tag0": "Discord.js",
      "exp.bots.tag1": "Guard Sistemleri",
      "exp.bots.tag2": "Plugin İşleri",
      "contact.title": "Hızlı İletişim",
      "contact.sub": "Birlikte çalışmak ister misin?",
      "contact.openProfile": "Profili aç",
      "contact.lead": "Projeni ya da yorumunu kısaca gönder. Dönüş yapabilmem için mail adresini yazman yeterli.",
      "form.name": "İsim",
      "form.namePh": "Adın veya marka adın",
      "form.email": "Mail Adresi",
      "form.message": "Proje / Yorum",
      "form.messagePh": "Nasıl bir proje için çalışmak istiyorsun?",
      "form.submit": "Mailime Gönder",
      "form.sending": "Gönderiliyor…",
      "form.success": "Mesajın gönderildi. En kısa sürede dönüş yapacağım.",
      "form.error": "Mesaj gönderilemedi. Lütfen biraz sonra tekrar dene.",
      "form.network": "Bağlantı hatası. İnternetini kontrol edip tekrar dene.",
      "form.required": "Bu alan zorunludur.",
      "form.invalidEmail": "Lütfen geçerli bir mail adresi gir.",
      "form.privacy": "Bu formdaki bilgiler mesajını iletmek için Web3Forms'a gönderilir.",
      "footer.text": "Minecraft geliştirme, Discord botları ve sunucu yönetimi üzerine çalışmalarım.",
      "footer.sections": "Bölümler",
      "footer.home": "Ana Sayfa",
      "footer.rights": "• Tüm hakları saklıdır.",
      "top.label": "Yukarı çık",
      "discord.dialog": "Discord profili",
      "discord.avatar": "Discord profil fotoğrafı",
      "discord.add": "Ekle",
      "discord.back": "Geri Dön"
    },
    en: {
      "meta.title": "ByLeagues | Minecraft Development & Server Management",
      "meta.description": "ByLeagues: Minecraft plugins with Java and Paper/Spigot, Discord bots, and server management experience.",
      "nav.label": "Main menu",
      "nav.profile": "About",
      "nav.skills": "Technologies",
      "nav.projects": "Experience",
      "nav.contact": "Contact",
      "nav.open": "Open menu",
      "nav.close": "Close menu",
      "theme.toggle": "Toggle light/dark theme",
      "lang.label": "Language",
      "social.label": "Social links",
      "social.github": "GitHub",
      "social.discord": "Discord",
      "social.mail": "Email",
      "hero.hi": "Hi, I'm",
      "hero.name": "Yusuf,",
      "hero.role": "a Minecraft Developer.",
      "hero.text": "I build custom Minecraft systems with Java and Paper/Spigot, along with Discord bots. I also work in server and community management.",
      "hero.work": "Explore My Work",
      "hero.contact": "Get in Touch",
      "about.title": "About Me",
      "about.tagline": "Development and community management.",
      "about.lead1": "I build",
      "about.lead2": "practical systems",
      "about.lead3": "for Minecraft servers.",
      "about.p1": "I develop Minecraft plugins in Java and build <strong>Discord bots</strong>. My work focuses on what servers need in day-to-day use.",
      "about.p2": "I lead the moderator team at MC-TR Forum and manage InfernoMC. I bring development, team coordination, and player experience together.",
      "about.years": "Years of experience",
      "about.jobs": "Completed jobs",
      "expertise.title": "Areas of Expertise",
      "expertise.lead": "Where I focus my development and management work.",
      "expertise.plugins.title": "Minecraft Plugin Development",
      "expertise.plugins.desc": "I build custom plugins and systems for servers with Java and the Paper/Spigot API.",
      "expertise.server.title": "Minecraft Server Management",
      "expertise.server.desc": "I manage server operations, team coordination, and player experience.",
      "expertise.bots.title": "Discord Bot Development",
      "expertise.bots.desc": "I build moderation, security, and community management bots with Discord.js.",
      "expertise.web.title": "Web Interface Development",
      "expertise.web.desc": "I create readable, responsive web interfaces that are easy to use.",
      "skills.title": "Technologies I Use",
      "exp.title": "Experience",
      "exp.lead": "Management roles I have held in forums and Minecraft servers.",
      "work.title": "Development Work",
      "work.lead": "Systems I have built for Minecraft, Discord, and the web.",
      "planned.title": "Planned Work",
      "planned.lead": "An initiative that has not launched yet.",
      "exp.mctr.date": "2026 - Present",
      "exp.mctr.cat": "Forum",
      "exp.mctr.title": "MC-TR Forum",
      "exp.mctr.desc": "As head of the moderator team on the MC-TR forum, I take an active role in user order, team coordination and in-forum processes.",
      "exp.mctr.tag0": "Head of Moderators",
      "exp.mctr.tag1": "Community Order",
      "exp.inferno.date": "2026 - Present",
      "exp.inferno.cat": "Minecraft",
      "exp.inferno.title": "InfernoMC",
      "exp.inferno.desc": "As an administrator on the InfernoMC Minecraft server, I manage processes around server order, team coordination and player experience.",
      "exp.inferno.tag0": "Administrator",
      "exp.inferno.tag1": "Server Operations",
      "exp.inferno.tag2": "Team Coordination",
      "exp.web.date": "2026 - Present",
      "exp.web.cat": "Web Design",
      "exp.web.title": "Portfolio Website Design",
      "exp.web.desc": "I work on interface design and responsive development for personal portfolio websites.",
      "exp.web.tag0": "Interface Design",
      "exp.web.tag1": "Responsive Web",
      "exp.tox.date": "2025 - 2026",
      "exp.tox.cat": "Minecraft",
      "exp.tox.title": "ToxCraft Server",
      "exp.tox.desc": "I was part of the senior management team on the ToxCraft server, working on team workflow, community management and in-server operations.",
      "exp.tox.tag0": "Senior Management",
      "exp.tox.tag1": "Community Management",
      "exp.tox.tag2": "Player Experience",
      "exp.studio.date": "Coming soon",
      "exp.studio.cat": "Studio",
      "exp.studio.title": "Tox Studio",
      "exp.studio.desc": "A new project focused on Discord bots, plugin packs and ready-made systems for servers.",
      "exp.studio.tag0": "Discord Bots",
      "exp.studio.tag1": "Plugin Packs",
      "exp.studio.tag2": "Ready-made Systems",
      "exp.plugins.date": "2021 - Present",
      "exp.plugins.cat": "Development",
      "exp.plugins.title": "Custom Plugin & Pack Development",
      "exp.plugins.desc": "I work on custom plugin and pack development for Minecraft servers.",
      "exp.plugins.tag0": "Custom Plugins",
      "exp.plugins.tag1": "Plugin Packs",
      "exp.bots.date": "2020 - Present",
      "exp.bots.cat": "Development",
      "exp.bots.title": "Custom Discord Bots",
      "exp.bots.desc": "I developed custom Discord bot systems for moderation, guard, community management and Minecraft server integration.",
      "exp.bots.tag0": "Discord.js",
      "exp.bots.tag1": "Guard Systems",
      "exp.bots.tag2": "Plugin Work",
      "contact.title": "Quick Contact",
      "contact.sub": "Would you like to work together?",
      "contact.openProfile": "Open profile",
      "contact.lead": "Send a short note about your project or feedback. Just leave your email address so I can get back to you.",
      "form.name": "Name",
      "form.namePh": "Your name or brand name",
      "form.email": "Email address",
      "form.message": "Project / Message",
      "form.messagePh": "What kind of project would you like to work on?",
      "form.submit": "Send to my email",
      "form.sending": "Sending…",
      "form.success": "Your message has been sent. I'll get back to you soon.",
      "form.error": "The message could not be sent. Please try again later.",
      "form.network": "Connection error. Check your internet and try again.",
      "form.required": "This field is required.",
      "form.invalidEmail": "Please enter a valid email address.",
      "form.privacy": "The details in this form are sent to Web3Forms to deliver your message.",
      "footer.text": "My work in Minecraft development, Discord bots, and server management.",
      "footer.sections": "Sections",
      "footer.home": "Home",
      "footer.rights": "• All rights reserved.",
      "top.label": "Back to top",
      "discord.dialog": "Discord profile",
      "discord.avatar": "Discord profile picture",
      "discord.add": "Add",
      "discord.back": "Go Back"
    }
  };

  const normalize = value => (SUPPORTED.includes(value) ? value : null);

  const readInitialLang = () => {
    let fromUrl = null;
    try {
      fromUrl = normalize(new URLSearchParams(window.location.search).get("lang"));
    } catch (_) {}
    if (fromUrl) return fromUrl;
    try {
      const stored = normalize(window.localStorage.getItem(STORAGE_KEY));
      if (stored) return stored;
    } catch (_) {}
    return DEFAULT_LANG;
  };

  let current = readInitialLang();

  const t = (key, lang = current) => (dict[lang] && dict[lang][key]) || dict[DEFAULT_LANG][key] || key;

  const apply = lang => {
    current = lang;
    const root = document.documentElement;
    root.lang = lang;

    document.title = t("meta.title");
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("meta.description"));

    document.querySelectorAll("[data-i18n]").forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-html]").forEach(el => {
      el.innerHTML = t(el.dataset.i18nHtml);
    });
    // data-i18n-attr="aria-label:key;title:key2"
    document.querySelectorAll("[data-i18n-attr]").forEach(el => {
      el.dataset.i18nAttr.split(";").forEach(pair => {
        const [attr, key] = pair.split(":").map(part => part.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });

    document.querySelectorAll(".lang-btn").forEach(btn => {
      const active = btn.dataset.lang === lang;
      btn.setAttribute("aria-pressed", String(active));
      btn.classList.toggle("is-active", active);
    });

    document.dispatchEvent(new CustomEvent("languagechange", { detail: { lang } }));
  };

  const setLang = (lang, { persist = true } = {}) => {
    const next = normalize(lang);
    if (!next) return;
    apply(next);
    if (!persist) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch (_) {}
    try {
      const url = new URL(window.location.href);
      if (next === DEFAULT_LANG) url.searchParams.delete("lang");
      else url.searchParams.set("lang", next);
      window.history.replaceState(null, "", url.href);
    } catch (_) {}
  };

  window.i18n = { t, setLang, get lang() { return current; } };

  const init = () => {
    apply(current);
    document.querySelectorAll(".lang-btn").forEach(btn => {
      btn.addEventListener("click", () => setLang(btn.dataset.lang));
    });
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
