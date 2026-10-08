'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, ArrowDown, Plus, HeartPulse, Stethoscope, Activity, ShieldCheck, Check, X, Menu, Leaf } from 'lucide-react';
import FrameSequence from './FrameSequence';

const services = [
  { number: '01', icon: Stethoscope, name: 'Ümumi müayinə', note: 'Sağlamlığınızın bütöv mənzərəsi', detail: 'Şikayətlərinizin dinlənməsi, ümumi baxış və ehtiyaclarınıza uyğun müayinə planının hazırlanması.' },
  { number: '02', icon: HeartPulse, name: 'Kardiologiya', note: 'Ürəyiniz üçün diqqətli yanaşma', detail: 'Ürək-damar sağlamlığı ilə bağlı konsultasiya, risklərin qiymətləndirilməsi və uyğun müayinələrin planlaşdırılması.' },
  { number: '03', icon: Activity, name: 'Diaqnostika', note: 'Aydın cavablar, doğru istiqamət', detail: 'Həkim tövsiyəsinə əsasən laborator və instrumental müayinələrin seçilməsi, nəticələrin birlikdə izahı.' },
  { number: '04', icon: Leaf, name: 'Profilaktik qayğı', note: 'Sabahın sağlamlığı bu gündən', detail: 'Yaşınıza və həyat tərzinizə uyğun profilaktik müayinələr, qidalanma və gündəlik vərdişlər üzrə tövsiyələr.' },
];
const questions = [
  ['İlk müayinəyə necə hazırlaşmalıyam?', 'Əvvəlki müayinələrin nəticələrini və istifadə etdiyiniz dərmanların siyahısını hazırlayın. Ac gəlmək lazım olub-olmadığını seçdiyiniz müayinə üzrə öncədən dəqiqləşdirin.'],
  ['Hansı xidmətin mənə uyğun olduğunu bilmirəm.', 'Ümumi müayinədən başlaya bilərsiniz. Şikayətləriniz qiymətləndirildikdən sonra uyğun ixtisas və müayinələr barədə istiqamət veriləcək.'],
  ['Qəbul sorğusu necə işləyir?', 'Formada xidmət və sizə uyğun günü seçin. Bu nümayiş saytında sorğu yalnız cihazınızda saxlanılır; klinikaya göndərilmir və təsdiqlənmiş qəbul hesab olunmur.'],
  ['Müayinə nəticələrimi necə başa düşə bilərəm?', 'Nəticələrinizi həkimlə birlikdə müzakirə edin. Tək bir göstərici diaqnoz üçün kifayət etməyə bilər; nəticələr ümumi sağlamlıq vəziyyətinizlə birlikdə qiymətləndirilir.'],
];

function Brand({ light = false }) {
  return <a href="#home" className={`brand ${light ? 'brand-light' : ''}`} aria-label="Vita ana səhifə"><span className="brand-mark"><Plus size={23} strokeWidth={2.6} /></span><span>vita<span className="brand-dot">.</span></span></a>;
}

function Appointment({ service, onClose }) {
  const dialogRef = useRef(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current.querySelector('button').focus();
    const onKey = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const nodes = [...dialogRef.current.querySelectorAll('button, input, select, textarea, a[href]')].filter(n => !n.disabled);
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', onKey); previous?.focus(); };
  }, [onClose]);
  function submit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (!/^\+?[\d\s()-]{9,20}$/.test(data.phone)) { setError('Telefon nömrəsini düzgün daxil edin.'); return; }
    try { localStorage.setItem('vita-appointment', JSON.stringify({ ...data, createdAt: new Date().toISOString() })); setSaved(true); }
    catch { setError('Brauzer yaddaşına yazmaq mümkün olmadı. Yaddaş icazəsini yoxlayın.'); }
  }
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Baku', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  return <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}><div className="appointment-modal" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="appointment-title">
    <button className="modal-close icon-button" onClick={onClose} aria-label="Pəncərəni bağla"><X /></button>
    {saved ? <div className="form-success" role="status"><span className="success-icon"><Check size={32} /></span><p className="eyebrow">NÖVBƏTİ ADDIM</p><h2 id="appointment-title">Sorğunuz saxlanıldı.</h2><p>Məlumatlarınız bu cihazda saxlanıldı. Bu nümayiş saytıdır — sorğu klinikaya göndərilməyib və qəbul təsdiqlənməyib.</p><button className="button button-green" onClick={onClose}>Sayta qayıt <ArrowRight size={18} /></button></div> : <>
      <p className="eyebrow">ÖZÜNÜZƏ VAXT AYIRIN</p><h2 id="appointment-title">İlk addımı<br /><em>birlikdə ataq.</em></h2><p className="modal-intro">Sizə uyğun xidməti və günü seçin.</p>
      <form onSubmit={submit}>
        <label>Ad və soyad<input name="name" autoComplete="name" placeholder="Adınız və soyadınız" required minLength={3} maxLength={80} /></label>
        <div className="form-grid"><label>Telefon nömrəsi<input name="phone" type="tel" autoComplete="tel" placeholder="+994 __ ___ __ __" required /></label><label>Uyğun gün<input name="date" type="date" required min={today} /></label></div>
        <label>Xidmət<select name="service" defaultValue={service || 'Ümumi müayinə'}>{services.map(s => <option key={s.name}>{s.name}</option>)}</select></label>
        <p className="form-note">Nümayiş formasıdır. Sorğu yalnız bu cihazda saxlanılır, klinikaya göndərilmir.</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button-green form-submit" type="submit">Sorğunu saxla <ArrowUpRight size={19} /></button>
      </form>
    </>}
  </div></div>;
}

export default function MedicalSite() {
  const heroRef = useRef(null), servicesRef = useRef(null), approachRef = useRef(null), careRef = useRef(null), teamRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const closeAppointment = useRef(() => setAppointment(null)).current;
  const openAppointment = service => { setSelectedService(null); setMenuOpen(false); setAppointment(service || 'Ümumi müayinə'); };

  useEffect(() => {
    const items = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); } }), { threshold: .1 });
    items.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return <>
    <a className="skip-link" href="#main">Əsas məzmuna keç</a>
    <header className="site-header"><div className="header-inner"><Brand />
      <nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'} aria-label="Əsas naviqasiya">
        {[['Xidmətlər', '#xidmetler'], ['Yanaşmamız', '#yanasma'], ['Komandamız', '#komanda'], ['Suallarınız', '#suallar']].map(([title, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{title}</a>)}
      </nav>
      <button className="header-appointment" onClick={() => openAppointment()}>Qəbula yazılın <ArrowUpRight size={17} /></button>
      <button className="mobile-menu icon-button" aria-expanded={menuOpen} aria-label={menuOpen ? 'Menyunu bağla' : 'Menyunu aç'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
    </div></header>

    <main id="main">
      <section className="hero-scroll" id="home" ref={heroRef}>
        <div className="hero-stage">
          <FrameSequence name="stethoscope" hero sectionRef={heroRef} className="hero-media" label="Stetoskopunu taxan həkim; səhifə sürüşdükcə görüntü hərəkət edir" />
          <div className="hero-wash" />
          <div className="hero-inner container">
            <div className="hero-content"><span className="availability"><span /> HƏR ADDIMDA SİZİN YANINIZDA</span>
              <h1>Sağlamlığınıza<br />bir az daha<br /><em>qayğı.</em><span className="heading-spark">✳</span></h1>
              <p>Özünüzü yaxşı hiss etmək kiçik bir addımla başlayır.<br className="desktop-break" /> Biz o addımı sizinlə birlikdə atırıq.</p>
              <div className="hero-actions"><button className="button button-green" onClick={() => openAppointment()}>Qəbul üçün yazılın <ArrowUpRight size={19} /></button><a className="text-link" href="#xidmetler">Bizi tanıyın <ArrowRight size={18} /></a></div>
              <div className="hero-reassurance"><ShieldCheck size={17} /><span>Diqqətli yanaşma. Fərdi qayğı. Aydın cavablar.</span></div>
            </div>
            <div className="doctor-note"><span className="note-icon"><HeartPulse size={21} /></span><div><strong>Sizi dinləməklə başlayırıq.</strong><span>Çünki hər insanın hekayəsi fərqlidir.</span></div></div>
            <div className="hero-bottom"><a href="#xidmetler" className="scroll-hint"><span className="scroll-circle"><ArrowDown size={15} /></span>Qayğını kəşf edin</a><div className="hero-progress"><span>01</span><div><i /></div><span>05</span></div><span className="hero-bottom-note">SAĞLAMLIQ, İNSANDAN BAŞLAYIR.</span></div>
          </div>
          <div className="vertical-caption">SİZİN SAĞLAMLIĞINIZ. BİZİM DİQQƏTİMİZ.</div>
        </div>
      </section>

      <div className="values-strip"><div className="container values-inner"><span><Stethoscope size={21} /> Fərdi müayinə</span><i /><span><ShieldCheck size={21} /> Etibarlı yanaşma</span><i /><span><HeartPulse size={21} /> Davamlı qayğı</span><i /><span><Leaf size={21} /> Sağlam sabah</span></div></div>

      <section className="services-section section-pad" id="xidmetler" ref={servicesRef}><div className="container">
        <div className="section-top reveal"><div><p className="eyebrow"><span /> XİDMƏTLƏRİMİZ</p><h2>Ehtiyacınız olan qayğı.<br /><em>Sizə uyğun şəkildə.</em></h2></div><p className="section-description">Sadə bir konsultasiyadan ətraflı müayinəyə qədər — sağlamlığınızın hər mərhələsində yanınızdayıq.</p></div>
        <div className="services-layout"><div className="service-list">{services.map(s => <button key={s.number} className="service-row reveal" onClick={() => setSelectedService(selectedService === s.name ? null : s.name)} aria-expanded={selectedService === s.name} aria-controls={`service-${s.number}`}>
          <span className="service-number">{s.number}</span><span className="service-icon"><s.icon size={25} strokeWidth={1.5} /></span><span className="service-copy"><strong>{s.name}</strong><span>{s.note}</span>{selectedService === s.name && <span className="service-detail" id={`service-${s.number}`}>{s.detail}</span>}</span><span className="service-arrow">{selectedService === s.name ? <X size={19} /> : <ArrowUpRight size={21} />}</span>
        </button>)}<button className="text-link services-cta" onClick={() => openAppointment(selectedService)}>Sizə uyğun qəbulu seçin <ArrowRight size={18} /></button></div>
          <div className="consultation-card reveal"><FrameSequence name="consultation" sectionRef={servicesRef} label="Planşetlə müayinə nəticələrini nəzərdən keçirən həkim" /><div className="consultation-caption"><span className="tiny-star">✳</span><p>Hər sualınız<br /><em>diqqətə layiqdir.</em></p></div><span className="media-tag"><span /> SİZİ DİNLƏYİRİK</span></div>
        </div>
      </div></section>

      <section className="approach-scroll" id="yanasma" ref={approachRef}><div className="approach-stage"><div className="container approach-layout">
        <div className="approach-media"><FrameSequence name="guidance" sectionRef={approachRef} label="Müayinə prosesini izah edən həkim" /><div className="image-corner"><span>V</span> qayğı ilə.</div><span className="outline-orbit" /></div>
        <div className="approach-content"><p className="eyebrow"><span /> YANAŞMAMIZ</p><h2>Sadəcə müayinə deyil.<br /><em>Birlikdə bir yol.</em></h2><p className="body-copy">Sağlamlığınız haqqında qərarlar aydın və rahat olmalıdır. Hər mərhələni izah edir, sizi dinləyir və sizinlə birlikdə planlaşdırırıq.</p>
          <div className="steps">{[['01', 'Əvvəlcə sizi dinləyirik', 'Şikayətləriniz, suallarınız və gözləntiləriniz bizim üçün önəmlidir.'], ['02', 'Birlikdə aydınlaşdırırıq', 'Ehtiyacınıza uyğun müayinəni seçir, nəticələri sadə dildə izah edirik.'], ['03', 'Yanınızda olmağa davam edirik', 'Fərdi tövsiyələr və növbəti addımlar ilə qayğımız davam edir.']].map(([n,t,d]) => <div className="step" key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div></div>)}</div>
        </div>
      </div></div></section>

      <section className="care-section" ref={careRef}><div className="container care-layout"><div className="care-content reveal"><p className="eyebrow"><span /> İNSAN YÖNÜMLÜ QAYĞI</p><h2>Özünüzü rahat hiss edin.<br /><em>Burada siz önəmlisiniz.</em></h2><p className="body-copy">Bəzən ən yaxşı başlanğıc səmimi bir söhbətdir. Sual verməkdən çəkinməyin. Biz hər cavabı səbirlə, hər addımı diqqətlə paylaşırıq.</p><button className="button button-light" onClick={() => openAppointment()}>İlk addımı atın <ArrowUpRight size={18} /></button><div className="care-signature"><span className="signature-line" /><span>Vita komandası</span></div></div><div className="care-media"><FrameSequence name="care" sectionRef={careRef} label="Gülümsəyərək başı ilə təsdiqləyən həkim" /><span className="care-orbit">✳</span></div></div></section>

      <section className="team-section section-pad" id="komanda" ref={teamRef}><div className="container"><div className="section-top reveal"><div><p className="eyebrow"><span /> BİR KOMANDA, BİR MƏQSƏD</p><h2>Qayğının arxasında<br /><em>insanlar var.</em></h2></div><p className="section-description">Fərqli baxışlar, ortaq bir yanaşma: sizi dinləmək, anlamaq və sağlamlığınıza birlikdə qayğı göstərmək.</p></div><div className="team-image"><FrameSequence name="team" sectionRef={teamRef} label="Birlikdə dayanan üç həkimdən ibarət komanda" /><div className="team-overlay"><span className="team-tag">BİRLİKDƏ DAHA GÜCLÜ</span><p>Sizin üçün.<br /><em>Birlikdə.</em></p><span className="team-symbol">✳</span></div></div><div className="team-bottom"><p>Diqqət. Əməkdaşlıq. İnsanlıq.</p><a className="text-link" href="#yanasma">Yanaşmamızı kəşf edin <ArrowUpRight size={17} /></a></div></div></section>

      <section className="faq-section section-pad" id="suallar"><div className="container faq-layout"><div className="reveal"><p className="eyebrow"><span /> SUALLARINIZ VAR?</p><h2>Aydın cavablar.<br /><em>Rahat bir başlanğıc.</em></h2><p className="body-copy">İlk addımdan əvvəl bilməli olduqlarınız.</p><div className="faq-decoration"><Plus size={60} strokeWidth={.7} /></div></div><div className="faq-list">{questions.map(([q,a],i) => <div className={`faq-item ${openFaq === i ? 'faq-open' : ''}`} key={q}><button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i} aria-controls={`faq-${i}`}><span>{q}</span><Plus size={20} /></button><div id={`faq-${i}`} hidden={openFaq !== i}><p>{a}</p></div></div>)}</div></div></section>

      <section className="final-cta"><div className="container cta-inner"><div><p className="eyebrow">BU GÜN ÖZÜNÜZÜ SEÇİN</p><h2>Yaxşı hiss etmək üçün<br /><em>yaxşı bir başlanğıc.</em></h2></div><button className="cta-circle" onClick={() => openAppointment()}><ArrowUpRight size={32} strokeWidth={1.4} /><span>Qəbula<br />yazılın</span></button><span className="cta-watermark">✳</span></div></section>
    </main>

    <footer className="footer"><div className="container footer-top"><div><Brand /><p>Sağlamlığınıza bir az daha qayğı.</p></div><div className="footer-nav"><a href="#xidmetler">Xidmətlər</a><a href="#yanasma">Yanaşmamız</a><a href="#komanda">Komandamız</a><a href="#suallar">Suallarınız</a></div><a className="back-top" href="#home">Yuxarı qayıt <ArrowUpRight size={17} /></a></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Vita. Qayğı ilə hazırlanıb.</span><span>Nümayiş saytıdır. Tibbi məsləhəti əvəz etmir.</span><span>AZ <span className="language-dot" /></span></div></footer>
    {appointment && <Appointment service={appointment} onClose={closeAppointment} />}
  </>;
}
