# Vita — tibbi sayt

Azərbaycanca, mobil uyğun Next.js 16 saytı. Yüklənmiş beş video 467 WebP kadra bölünüb. İlk hissədə stetoskoplu video göstərilir; kadrlar səhifənin sürüşdürmə mövqeyinə uyğun dəyişir.

## Başlatmaq

Node.js 20.9 və ya daha yeni versiya tələb olunur. Node.js 24 ilə yoxlanılıb.

```sh
npm ci
npm run dev
```

## İstehsal versiyası

```sh
npm run build
npm start
```

## Videolar və animasiya

Orijinal videolar `assets/videos/`, hazır kadrlar `public/frames/` qovluğundadır. Kadrları yenidən hazırlamaq üçün FFmpeg quraşdırılıbsa `npm run media` işlədin. Saytı başlatmaq üçün kadrları yenidən hazırlamaq lazım deyil.

`components/FrameSequence.jsx` sürüşdürmə ilə canvas üzərində kadrları dəyişir. Kadrlar görünüşə yaxınlaşanda yüklənir və yaddaş istifadəsi məhdudlaşdırılır. Azaldılmış hərəkət seçimi aktiv olduqda animasiya dayandırılır.

## Qəbul forması

Forma yalnız nümayiş üçündür: daxil edilən sorğu bu cihazın `localStorage` yaddaşında saxlanır. Klinikaya göndərilmir və təsdiqlənmiş qəbul hesab olunmur. Real qəbul üçün ayrıca server və bildiriş inteqrasiyası tələb olunur. Saytda bu məhdudiyyət açıq göstərilir.
