# إعداد الدخول بجوجل وفيسبوك وApple

الأزرار ديال Google وFacebook وApple مربوطة بـ Supabase Auth عبر `signInWithOAuth`. ماشي تسجيل وهمي، ولكن خصك تهيّئ كل Provider فـ Supabase بالـ Client ID وClient Secret الخاصين بك قبل ما يعمل.

- Supabase → Authentication → URL Configuration: ضبط Site URL وإضافة `https://deutsch-yn.netlify.app` إلى Redirect URLs (بدّلها بالدومين ديالك إذا مختلف).
- Supabase → Authentication → Sign In / Providers: فعّل Google وFacebook، وApple اختياري.
- Google: أنشئ Web OAuth client وأضف callback URL ديال Supabase كما هو معروض في لوحة Supabase إلى Authorized redirect URIs.
- Meta: أنشئ تطبيقاً في Meta for Developers، فعّل Facebook Login و`email` permission، ثم أضف callback URL ديال Supabase إلى Valid OAuth Redirect URIs.
- لا تدخل أي Client Secret في `public/config.js` ولا ترسله في الدردشة. الأسرار ديال مزودي الهوية كتدخل في لوحة Supabase فقط.
- Instagram ما مدعومش كـ provider مباشر قياسي في Supabase Auth؛ لذلك ما زدناش زر Instagram مضلل. Facebook Login هو خيار Meta المناسب هنا.
- بعد تفعيل providers، انشر المشروع مجدداً واختبر من متصفح خاص/خارج جلسة المالك.
