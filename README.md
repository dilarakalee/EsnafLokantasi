🍳 Ramazan Esnaf Simülatör
Bu proje, oyuncuların sipariş hazırladığı, malzemeleri doğradığı ve pişirdiği tarayıcı tabanlı bir mutfak/restoran simülasyonudur. Oyunun en büyük teknik özelliklerinden biri, hiçbir harici ses dosyasına (mp3, wav vb.) ihtiyaç duymadan tüm ses efektlerinin tarayıcının Web Audio API'si kullanılarak gerçek zamanlı sentezlenmesidir (Procedural Audio).

✨ Öne Çıkan Özellikler
🔊 Dinamik ve Prosedürel Ses Tasarımı (Zero-Dependency Audio)
Oyun motorunun ses katmanı tamamen baştan yazılarak uzman seviyesinde elektronik sentez (Electronic Synthesis) altyapısı kurulmuştur:

🔪 Tok Doğrama Sesi: Rastgele gürültüler yerine; alçak frekanslı, anında düşen sine dalgası (ahşap vurma) ve lowpass filtreden geçmiş klik sesinin (bıçak darbesi) eşzamanlı senteziyle oluşturulmuş gerçekçi doğrama hissiyatı.

🍳 Kızgın Yağ Cızırtısı (Sizzle): Highpass ve peaking biquad filtrelerle şekillendirilmiş özel gürültü dalgaları sayesinde tavaya et veya sebze atıldığında çıkan çıtır çıtır kızarma efekti.

💥 Ramazan Topu (Deep Boom): Yavaşça alçalan Triangle sub-bass dalgası ve gür bir yankılanma (reverb) ile tasarlanmış, göğüste hissedilen derin patlama efekti.

🚶 Müşteri Ayak Sesleri: Dükkana giren müşteriler için tasarlanmış pes ve boğuk çift adım sesleri.

🍽️ Etkileşimli Tabak ve Hata Yönetimi
Oyuncu deneyimini (UX) artırmak ve sipariş hatalarını tolere edebilmek için dinamik tabak yönetimi eklenmiştir:

Seçici Vurgulama: Tabağa eklenen malzemelerin üzerine fare ile gelindiğinde kırmızımsı bir çerçeve ve büyüme animasyonu (Hover effect) devreye girer.

Kolay İptal: Yanlış eklenen malzeme üzerine tıklandığında tabaktan silinir.

Görsel ve İşitsel Geri Bildirim: Çöpe atma işlemi sırasında özel bir ses efekti çalar ve ekranda "Çöpe Atıldı" şeklinde bir bildirim (Toast/UI Alert) belirir. Bu sayede tüm tabağı sıfırlamaya gerek kalmadan sadece hatalı işlem geri alınabilir.

💻 Kullanılan Teknolojiler
HTML5 & CSS3: Modern ve duyarlı kullanıcı arayüzü, hover ve büyüme animasyonları.

JavaScript (ES6+): Temel oyun mantığı ve DOM manipülasyonları.

Web Audio API: Oscillator'lar, Biquad Filter'lar ve Gain Node'lar ile harici dosya bağımlılığı olmayan prosedürel ses sentezi.

🚀 Kurulum ve Çalıştırma
Oyun tamamen tarayıcı tabanlı olduğu için herhangi bir paket yöneticisine veya derleyiciye ihtiyaç duymaz.

Projeyi bilgisayarınıza klonlayın:

Proje dizinine gidin ve index.html dosyasını favori tarayıcınızda açın (veya VS Code Live Server eklentisini kullanın).

Seslerin doğru çalışabilmesi için tarayıcının ses çalma politikaları (Autoplay Policy) gereği sayfayla etkileşime girmeyi (tıklamayı) unutmayın!
