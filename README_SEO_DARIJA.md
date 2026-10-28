# Deutsch Lernen SEO V7 — دليل بالدارجة

## شنو تزاد؟
- 6 صفحات جديدة مفيدة لمحركات البحث: دليل قواعد الألمانية، الحروف والنطق، der/die/das، تصريف الأفعال، Perfekt، وأدوات الاستفهام.
- عناوين ووصف Meta وCanonical وOpen Graph وTwitter Cards وJSON-LD لكل صفحة تعليمية.
- `sitemap.xml` مرتب فيه غير الصفحات التعليمية القابلة للفهرسة. صفحة الخصوصية و404 ماشي فـ sitemap.
- صفحة `404.html` مفهومة وروابط داخلية متبادلة بين الأدلة.
- تحسينات accessibility/focus وتحقق محلي بـ `tools/check_seo.py`.
- ملفات A1/A2/B1 باقية فـ `private-pdfs/` خارج `public/` حتى ما تتنشرش كملفات عامة.
- ضفت `private-pdfs/` إلى `.gitignore` حتى ما تترفعش بالغلط إلى مستودع Git. احتفظ بالنسخة الأصلية محلياً إلى أن ترفعها إلى Supabase Storage الخاص.

## طريقة النشر على Netlify
1. فك الضغط على المشروع الكامل.
2. تأكد أن Root directory ديال المشروع هو نفس المجلد اللي فيه `netlify.toml` و`package.json`.
3. Build command: `npm install --no-audit --no-fund`، Publish directory: `public`، Functions directory: `netlify/functions`.
4. خاص إعداد متغيرات Supabase فـ Netlify Environment variables باش تسجيل الدخول والتنزيل الخاص يخدمو: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `SUPABASE_PRIVATE_BUCKET`. لا تحط المفتاح السري داخل `public/config.js` ولا تشاركو.
5. رفع PDFs إلى bucket خاص بنفس الأسماء الموجودة فـ `netlify/functions/protected-download.mjs`، وضبط سياسات التخزين على private.
6. انشر الموقع، ثم اختبر الصفحة الرئيسية، الصفحات الجديدة، وظيفة 404، وتسجيل الدخول/تنزيل PDF.

## SEO بعد النشر
1. تأكد من أن `https://deutsch-yn.netlify.app/sitemap.xml` و`/robots.txt` كيترجعو بـ 200. إذا كان عندك دومين آخر، بدل الدومين فـ canonicals وOpen Graph وrobots وsitemap قبل النشر.
2. ضف الموقع في Google Search Console وتحقق من الملكية.
3. أرسل `https://deutsch-yn.netlify.app/sitemap.xml` من خانة Sitemaps.
4. استعمل URL Inspection باش تشوف واش Google يقدر يفتح الصفحات.
5. راقب Clicks وImpressions وCTR كل أسبوع، وزد محتوى جديد مفيد على أساس الأسئلة اللي كيبان أن الناس كيقلبو عليها. ما كاينش ضمان لترتيب معين أو عدد زوار معين.

## التحقق محلياً
من المجلد الرئيسي: `python3 tools/check_seo.py`

## ملاحظات مهمة
- الدومين المستعمل فـ canonicals حالياً هو `https://deutsch-yn.netlify.app/` اعتماداً على الإعداد السابق. تأكد أنه هو الدومين النهائي المنشور.
- HTML وJavaScript اللي كيوصل للمتصفح ما يمكنش إخفاؤه بالكامل. حماية المحتوى الخاص كتحتاج Supabase Storage private + Function والتحقق من جلسة المستخدم.
- محتوى الموقع تدريبي وما كيمنحش شهادة رسمية.


V8: تم إضافة واجهة متعددة اللغات (العربية، الإنجليزية، الفرنسية، الإسبانية، البرتغالية) وقاموس عبارات مترجم. المحتوى التعليمي التفصيلي لا يزال بلغته الأصلية.

## تسجيل الدخول الحقيقي عبر Google / Facebook (Meta) / Apple

الواجهة فيها أزرار OAuth حقيقية عبر Supabase Auth؛ ماشي أزرار شكلية. لكن ما تقدرش تخدم قبل ما يفعّل مالك الموقع كل مزوّد ويحطّ بيانات OAuth ديالو فـ Supabase. ما تحطّش Client Secret فـ `public/config.js` ولا فـ GitHub.

### 1) إعداد Supabase
1. افتح Supabase Dashboard ثم Authentication → URL Configuration.
2. خلي Site URL هو رابط موقعك النهائي، مثلاً `https://deutsch-yn.netlify.app`، وزد نفس الرابط ضمن Redirect URLs المسموح بها.
3. من Authentication → Sign In / Providers فعّل Google أو Facebook أو Apple اللي بغيت تدعم.

### 2) Google
1. من Google Cloud Console أنشئ OAuth Client من النوع Web application.
2. أضف دومين الموقع إلى Authorized JavaScript origins.
3. انسخ Callback URL اللي كيعطيه Supabase فصفحة Google provider؛ شكله غالباً `https://<PROJECT_REF>.supabase.co/auth/v1/callback` وأضفه ضمن Authorized redirect URIs.
4. ضع Google Client ID وClient Secret في صفحة Google provider داخل Supabase ثم Save.

### 3) Facebook / Meta
1. أنشئ تطبيقاً في Meta for Developers وأضف Facebook Login.
2. فعّل صلاحيات `public_profile` و`email` حسب إعدادات Meta.
3. أضف Callback URL الظاهر في Supabase إلى Valid OAuth Redirect URIs في Facebook Login.
4. خذ App ID وApp Secret وأدخلهما داخل Supabase → Authentication → Providers → Facebook. لا تنشر App Secret.

### 4) Apple (اختياري)
فعّل Apple provider فقط إذا عندك إعداد Apple Developer اللازم (Services ID/Key/Team حسب إعداد Supabase). إذا ما كملتيش الإعداد، زر Apple غادي يرجّع خطأ من المزود. تقدر تخفيه مؤقتاً من `public/index.html` إذا ما بغيتيش تدعمو.

### 5) Instagram
ما ضفتش زر تسجيل دخول Instagram كأنه يعمل، لأن Instagram ماشي من مزوّدي تسجيل الدخول المباشرين المدرجين افتراضياً في Supabase Auth. استعمل Facebook Login (Meta) لتسجيل الدخول الاجتماعي، أو جهّز مزود OAuth/OIDC مخصص فقط إذا عندك خدمة هوية متوافقة فعلاً.

### 6) اختبار قبل الإطلاق
- جرّب إنشاء حساب بالبريد، وفعّل رابط التحقق من البريد.
- جرّب Google وFacebook بعد تفعيل كل provider في Supabase.
- في Meta، أثناء وضع Development، ممكن فقط حسابات الاختبار/الأدوار المضافة للتطبيق تنجح.
- جرّب تسجيل الخروج، ثم الدخول من جديد. جرّب فتح PDF بدون حساب وتأكد أن السيرفر يرفضه.
- لا تضع `SUPABASE_SECRET_KEY` ولا Google/Facebook client secrets في ملفات `public/`.
