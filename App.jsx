import React, { useState, useEffect } from 'react';
import { Plus, X, ChefHat, Search, Utensils, AlertCircle, Check, ArrowRight, Clock, Gauge, Sparkles, Loader2, Share2, Copy } from 'lucide-react';

// Genişləndirilmiş Resept Bazası (Statik)
const RECIPE_DATABASE = [
  {
    id: 1,
    name: "Dovğa",
    category: "Azərbaycan Mətbəxi",
    ingredients: ["qatıq", "düyü", "göyərti", "yumurta", "un", "noxud"],
    instructions: "1. Qatığı un və yumurta ilə yaxşıca çalın.\n2. Düyünü əlavə edib ocağa qoyun.\n3. Qaynayana qədər taxta qaşıqla dayanmadan qarışdırın (yoxsa çürüyər).\n4. Qaynayan kimi doğranmış göyərtiləri və əvvəlcədən bişmiş noxudu əlavə edin.\n5. Bir az qaynadıqdan sonra duzu əlavə edib ocaqdan götürün.",
    difficulty: "Orta",
    time: "40 dəq",
    image: "🥣"
  },
  {
    id: 2,
    name: "Pomidor-Yumurta",
    category: "Səhər Yeməyi",
    ingredients: ["pomidor", "yumurta", "kərə yağı", "duz", "istiot"],
    instructions: "1. Pomidorların qabığını soyub kub şəklində doğrayın.\n2. Tavada yağı qızdırın və pomidorları əlavə edin.\n3. Pomidorlar suyunu çəkib pörtlənənə qədər bişirin.\n4. Yumurtaları bir qabda çırpın və ya birbaşa tavanın içinə vurun.\n5. Duz və istiot vurub qarışdırın, yumurta bişənə qədər gözləyin.",
    difficulty: "Asan",
    time: "15 dəq",
    image: "🍳"
  },
  {
    id: 3,
    name: "Yarpaq Dolması",
    category: "Azərbaycan Mətbəxi",
    ingredients: ["mal əti", "düyü", "soğan", "üzüm yarpağı", "nanə", "şüyüd", "duz", "istiot"],
    instructions: "1. Əti çəkin, soğan və göyərtiləri xırda doğrayıb qarışdırın.\n2. Düyünü yuyub ətə əlavə edin, ədviyyatları vurun.\n3. Üzüm yarpaqlarını qaynar suda pörtlədin.\n4. İçliyi yarpaqlara bükün.\n5. Qazana yığıb üzərinə çıxana qədər su tökün və vam odda bişirin.",
    difficulty: "Çətin",
    time: "90 dəq",
    image: "🍃"
  },
  {
    id: 4,
    name: "Südlü Plov",
    category: "Azərbaycan Mətbəxi",
    ingredients: ["düyü", "süd", "kərə yağı", "duz", "zəfəran", "kişmiş", "qaysı"],
    instructions: "1. Düyünü yuyun.\n2. Südü qazana töküb qaynadırın, düyünü əlavə edin.\n3. Düyü südü çəkib bişənə qədər qarışdırın.\n4. Dəmə qoyarkən üzərinə ərinmiş kərə yağı və zəfəran şirəsi gəzdirin.\n5. Süfrəyə verərkən yanında quru meyvələr qoya bilərsiniz.",
    difficulty: "Orta",
    time: "45 dəq",
    image: "🍚"
  },
  {
    id: 5,
    name: "Kükü",
    category: "Səhər Yeməyi",
    ingredients: ["yumurta", "göyərti", "kərə yağı", "duz", "qoz"],
    instructions: "1. Göyərtiləri (kəvər, keşniş, şüyüd) təmizləyib xırda doğrayın.\n2. Yumurtaları, duzu və istiotu əlavə edib yaxşıca qarışdırın.\n3. İstəyə görə xırdalanmış qoz əlavə edin.\n4. Tavada yağı qızdırın və qarışımı tökün.\n5. Alt hissəsi qızardıqdan sonra çevirib digər üzünü də bişirin.",
    difficulty: "Asan",
    time: "20 dəq",
    image: "🌿"
  },
  {
    id: 6,
    name: "Bozbaş",
    category: "Azərbaycan Mətbəxi",
    ingredients: ["mal əti", "kartof", "noxud", "soğan", "tomat pastası", "nanə qurusu"],
    instructions: "1. Əti sümüklü şəkildə doğrayıb suda qaynadın, kəfini yığın.\n2. Ət bişənə yaxın isladılmış noxudu əlavə edin.\n3. Soğanı yağda qovurub tomat pastası ilə qarışdırın, bulyona əlavə edin.\n4. Kartofları soyub bütöv və ya böyük doğrayıb yeməyə salın.\n5. Hazır olana yaxın duz, istiot və nanə qurusu səpin.",
    difficulty: "Orta",
    time: "60 dəq",
    image: "🥘"
  },
  {
    id: 7,
    name: "Kartof Qızartması",
    category: "Qəlyanaltı",
    ingredients: ["kartof", "duru yağ", "duz", "ketçup", "mayonez"],
    instructions: "1. Kartofları soyun və uzunsov formada doğrayın.\n2. Kartofları soyuq suda yuyub nişastasını təmizləyin və kağız dəsmalla qurudun.\n3. Tavada bol yağı qızdırın.\n4. Kartofları qızıl rəng alana qədər qızardın.\n5. İsti ikən duzlayın.",
    difficulty: "Asan",
    time: "20 dəq",
    image: "🍟"
  },
  {
    id: 8,
    name: "Toyuq Çığırtması",
    category: "Azərbaycan Mətbəxi",
    ingredients: ["toyuq əti", "soğan", "pomidor", "yumurta", "kərə yağı", "limon"],
    instructions: "1. Toyuq ətini hissələrə bölüb qaynadın və ya yağda qızardın.\n2. Soğanı aypara şəklində doğrayıb qızardın.\n3. Pomidorları doğrayıb soğanın üzərinə əlavə edin, sous halına gələnə qədər bişirin.\n4. Toyuqları tavanın içinə düzün.\n5. Yumurtaları çırpıb yeməyin üzərinə gəzdirin və qapağı bağlayın.",
    difficulty: "Orta",
    time: "50 dəq",
    image: "🍗"
  }
];

const COMMON_INGREDIENTS = [
  "Yumurta", "Kartof", "Pomidor", "Soğan", "Düyü", 
  "Qatıq", "Mal əti", "Toyuq əti", "Göyərti", "Un", "Süd"
];

// Gemini API Helper
const callGemini = async (prompt) => {
  // API Key .env faylından oxunur
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; 
  
  if (!apiKey) {
    console.warn("API Key tapılmadı! Zəhmət olmasa .env faylını yoxlayın.");
    return null;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export default function App() {
  const [myIngredients, setMyIngredients] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("match"); // 'match' or 'all'
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Modal üçün state
  
  // AI States
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiError, setAiError] = useState("");
  
  // Notification State
  const [notification, setNotification] = useState("");

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  // Ərzaq əlavə etmə funksiyası
  const addIngredient = (ing) => {
    const formattedIng = ing.toLowerCase().trim();
    if (formattedIng && !myIngredients.includes(formattedIng)) {
      setMyIngredients([...myIngredients, formattedIng]);
    }
    setInputValue("");
  };

  const removeIngredient = (ing) => {
    setMyIngredients(myIngredients.filter(i => i !== ing));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addIngredient(inputValue);
    }
  };

  // Paylaşma funksiyası
  const handleShareApp = async () => {
    const shareText = "Soyuducu Şefi - Bu gün nə bişirim dərdi yoxdur! 🍳\nEvdəki ərzaqları yaz, sənə uyğun resepti tap.";
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Soyuducu Şefi',
          text: shareText,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      showNotification("Tətbiq haqqında məlumat kopyalandı! 📋");
    }
  };

  // AI ilə Resept Yarat
  const generateAiRecipe = async () => {
    if (myIngredients.length === 0) {
      setAiError("Zəhmət olmasa ən azı bir ərzaq seçin.");
      setTimeout(() => setAiError(""), 3000);
      return;
    }

    setIsAiGenerating(true);
    setAiError("");

    const prompt = `
      Mən bir "Soyuducu Şefi" tətbiqiyəm. İstifadəçinin əlində bu ərzaqlar var: ${myIngredients.join(", ")}.
      Bu ərzaqlardan istifadə edərək (və ya evdə tapılması asan olan əlavələrlə) yaradıcı və dadlı bir yemək resepti fikirləş.
      
      Cavabı YALNIZ aşağıdakı JSON formatında ver, başqa heç bir mətn yazma. JSON valid olmalıdır.
      
      {
        "id": "ai-${Date.now()}",
        "name": "Yeməyin Adı",
        "category": "AI Şefin Tövsiyəsi ✨",
        "ingredients": ["ərzaq 1", "ərzaq 2"],
        "instructions": "1. Addım 1\n2. Addım 2...",
        "difficulty": "Asan/Orta/Çətin",
        "time": "XX dəq",
        "image": "🥘",
        "matchPercentage": 100,
        "isAiGenerated": true,
        "matchingIngredients": ${JSON.stringify(myIngredients)},
        "missingIngredients": []
      }
    `;

    try {
      const result = await callGemini(prompt);
      if (result) {
        const cleanJson = result.replace(/```json|```/g, "").trim();
        const recipe = JSON.parse(cleanJson);
        setSelectedRecipe(recipe);
      } else {
        throw new Error("Resept alına bilmədi");
      }
    } catch (e) {
      setAiError("AI Şef hal-hazırda məşğuldur, bir az sonra yenidən yoxlayın.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Reseptləri analiz edən funksiya
  const analyzeRecipes = () => {
    return RECIPE_DATABASE.map(recipe => {
      const matchingIngredients = recipe.ingredients.filter(rIng => 
        myIngredients.some(myIng => rIng.includes(myIng) || myIng.includes(rIng))
      );
      
      const missingIngredients = recipe.ingredients.filter(rIng => 
        !myIngredients.some(myIng => rIng.includes(myIng) || myIng.includes(rIng))
      );

      const matchPercentage = Math.round((matchingIngredients.length / recipe.ingredients.length) * 100);

      return {
        ...recipe,
        matchPercentage,
        matchingIngredients,
        missingIngredients
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
  };

  const results = analyzeRecipes();
  const displayResults = activeTab === 'match' 
    ? results.filter(r => r.matchPercentage > 0) 
    : results;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-xl z-50 animate-fadeIn flex items-center gap-2">
          <Check className="w-4 h-4 text-green-400" />
          {notification}
        </div>
      )}

      {/* Header */}
      <header className="bg-emerald-600 text-white p-6 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white p-2 rounded-full">
              <ChefHat className="text-emerald-600 w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Soyuducu Şefi <span className="text-xs bg-emerald-500 px-2 py-0.5 rounded-full border border-emerald-400">AI Powered ✨</span>
              </h1>
              <p className="text-emerald-100 text-sm hidden sm:block">Bu gün nə bişirim dərdi yoxdur!</p>
            </div>
          </div>
          <button 
            onClick={handleShareApp}
            className="bg-emerald-700 hover:bg-emerald-800 p-2.5 rounded-full transition-colors"
            title="Tətbiqi Paylaş"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
        
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <label className="block text-gray-700 font-medium mb-3">
            Soyuducuda nələr var?
          </label>
          
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Məsələn: Yumurta, Pomidor..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            </div>
            <button 
              onClick={() => addIngredient(inputValue)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Əlavə et</span>
            </button>
          </div>

          {/* Quick Tags */}
          <div className="mb-6">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">Tez seçim:</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_INGREDIENTS.map((ing) => (
                <button
                  key={ing}
                  onClick={() => addIngredient(ing)}
                  disabled={myIngredients.includes(ing.toLowerCase())}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                    myIngredients.includes(ing.toLowerCase())
                      ? 'bg-emerald-100 border-emerald-200 text-emerald-700 opacity-50 cursor-default'
                      : 'bg-gray-50 border-gray-200 hover:border-emerald-400 hover:text-emerald-600'
                  }`}
                >
                  {ing}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Ingredients */}
          {myIngredients.length > 0 && (
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 flex justify-between items-start">
              <div className="flex flex-wrap gap-2">
                {myIngredients.map((ing, index) => (
                  <span key={index} className="flex items-center gap-1 bg-white text-emerald-800 px-3 py-1.5 rounded-full shadow-sm text-sm border border-emerald-100 font-medium animate-fadeIn">
                    {ing}
                    <button onClick={() => removeIngredient(ing)} className="hover:text-red-500 ml-1">
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Chef Banner - Always Visible */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="w-32 h-32" />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-300" /> 
                Axtardığınız resepti tapa bilmədiniz?
              </h2>
              <p className="text-indigo-100 text-sm max-w-md">
                AI Şef sizin seçdiyiniz ərzaqlara (və ya evdə ola biləcək əlavələrə) uyğun tamamilə unikal resept hazırlaya bilər.
              </p>
            </div>
            <button 
              onClick={generateAiRecipe}
              disabled={isAiGenerating}
              className="bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-lg font-bold shadow-md transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAiGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Düşünürəm...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> AI Resept Yarat
                </>
              )}
            </button>
          </div>
          {aiError && (
             <div className="mt-4 bg-red-500/20 border border-red-200/30 text-white p-3 rounded-lg text-sm animate-fadeIn">
               {aiError}
             </div>
          )}
        </div>

        {/* Results Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-emerald-600" />
              Təklif Edilən Reseptlər
            </h2>
            
            <div className="flex bg-gray-200 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('match')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'match' ? 'bg-white shadow-sm text-emerald-700' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Mümkün olanlar
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'all' ? 'bg-white shadow-sm text-emerald-700' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Bütün Menyu
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayResults.length > 0 ? (
              displayResults.map((recipe) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  myIngredients={myIngredients} 
                  onViewRecipe={() => setSelectedRecipe(recipe)}
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-white rounded-xl border-2 border-dashed border-gray-200">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700">Hələ ki, standart resept tapılmadı</h3>
                <p className="text-gray-500 mt-1">Siyahını artırın və ya yuxarıdakı <span className="font-bold text-indigo-600">AI Şef</span> düyməsini yoxlayın!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
          showNotification={showNotification}
        />
      )}
    </div>
  );
}

// Resept Kartı Komponenti
function RecipeCard({ recipe, onViewRecipe }) {
  const isHighMatch = recipe.matchPercentage >= 75;
  const isMediumMatch = recipe.matchPercentage >= 40 && recipe.matchPercentage < 75;
  const isAi = recipe.isAiGenerated;

  return (
    <div className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full ${isAi ? 'border-indigo-200 ring-2 ring-indigo-100' : 'border-gray-100'}`}>
      <div className={`relative h-32 flex items-center justify-center text-4xl cursor-pointer ${isAi ? 'bg-indigo-50' : 'bg-emerald-50'}`} onClick={onViewRecipe}>
        {recipe.image}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold text-white shadow-sm ${
          isAi ? 'bg-indigo-500' : (isHighMatch ? 'bg-green-500' : isMediumMatch ? 'bg-yellow-500' : 'bg-gray-400')
        }`}>
          {isAi ? '✨ AI Özəl' : `${recipe.matchPercentage}% Uyğunluq`}
        </div>
        <div className="absolute bottom-2 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-600 flex items-center gap-1">
          <Clock className="w-3 h-3" /> {recipe.time} • {recipe.difficulty}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className={`mb-1 text-xs font-bold uppercase tracking-wide ${isAi ? 'text-indigo-600' : 'text-emerald-600'}`}>
          {recipe.category}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight cursor-pointer hover:text-emerald-700" onClick={onViewRecipe}>
          {recipe.name}
        </h3>
        
        {!isAi && recipe.missingIngredients.length > 0 && recipe.matchPercentage > 0 && (
          <div className="mb-4 bg-orange-50 border border-orange-100 rounded-lg p-3 text-sm">
            <div className="flex items-center gap-1.5 text-orange-700 font-semibold mb-1">
              <AlertCircle className="w-4 h-4" />
              Çatışmayanlar:
            </div>
            <div className="text-gray-600 leading-snug">
              {recipe.missingIngredients.join(", ")}
            </div>
          </div>
        )}

        <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
          {recipe.instructions}
        </p>

        <button 
          onClick={onViewRecipe}
          className={`w-full mt-auto py-2.5 rounded-lg text-sm font-medium border transition-colors flex items-center justify-center gap-2 group ${
            isAi 
            ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200' 
            : 'bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 border-gray-200 hover:border-emerald-200'
          }`}
        >
          Tam Reseptə Bax
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

// Modal Komponenti (Tam ekran resept görüntüsü)
function RecipeModal({ recipe, onClose, showNotification }) {
  const [aiTip, setAiTip] = useState("");
  const [isTipLoading, setIsTipLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const getAiTip = async () => {
    setIsTipLoading(true);
    setAiTip("");
    
    // API Key .env faylından oxunur
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; 

    const prompt = `
      Mənə "${recipe.name}" yeməyi haqqında qısa, faydalı bir mətbəx sirri və ya bu yeməyi daha dadlı etmək üçün bir tövsiyə ver.
      Azərbaycan dilində, səmimi və qısa olsun (maksimum 2 cümlə).
    `;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );
      const data = await response.json();
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (result) setAiTip(result);
    } catch (e) {
      setAiTip("Bağışlayın, məsləhət ala bilmədim.");
    } finally {
      setIsTipLoading(false);
    }
  };

  const handleShareRecipe = async () => {
    const text = `🍳 ${recipe.name}\n\n📝 Tərkibi: ${recipe.ingredients.join(", ")}\n\n👩‍🍳 Hazırlanması:\n${recipe.instructions}\n\n"Soyuducu Şefi" tətbiqi ilə tapıldı.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.name,
          text: text,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      showNotification("Resept kopyalandı! Dostlarına göndər 😋");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn">
        
        {/* Modal Header Image */}
        <div className={`relative h-48 flex items-center justify-center text-6xl ${recipe.isAiGenerated ? 'bg-indigo-100' : 'bg-emerald-100'}`}>
          {recipe.image}
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={handleShareRecipe}
              className="bg-white/50 hover:bg-white p-2 rounded-full transition-colors text-gray-700"
              title="Resepti Paylaş"
            >
              <Share2 className="w-6 h-6" />
            </button>
            <button 
              onClick={onClose}
              className="bg-white/50 hover:bg-white p-2 rounded-full transition-colors text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
            <h2 className="text-3xl font-bold">{recipe.name}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm font-medium">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {recipe.time}</span>
              <span className="flex items-center gap-1"><Gauge className="w-4 h-4" /> {recipe.difficulty}</span>
              <span>{recipe.category}</span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          {/* Status & AI Tip Section */}
          <div className="flex flex-col gap-4">
             {/* Match Status */}
             {!recipe.isAiGenerated && (
               <div className={`p-4 rounded-xl border ${recipe.matchPercentage === 100 ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                  <div className="text-sm font-bold uppercase tracking-wider mb-2 opacity-70">
                    Vəziyyət
                  </div>
                  <div className="text-lg font-medium">
                    {recipe.matchPercentage === 100 ? (
                      <span className="flex items-center gap-2 text-green-700">
                        <Check className="w-5 h-5" /> Hər şeyiniz var!
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-orange-700">
                        <AlertCircle className="w-5 h-5" /> Bəzi ərzaqlar çatmır
                      </span>
                    )}
                  </div>
               </div>
             )}

             {/* AI Tip Box */}
             <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-indigo-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> AI Məsləhəti
                  </h4>
                  {!aiTip && !isTipLoading && (
                    <button 
                      onClick={getAiTip}
                      className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full hover:bg-indigo-700 transition-colors"
                    >
                      Məsləhət Al
                    </button>
                  )}
                </div>
                
                {isTipLoading ? (
                  <div className="flex items-center gap-2 text-indigo-500 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Şef düşünür...
                  </div>
                ) : aiTip ? (
                  <p className="text-indigo-700 text-sm italic">"{aiTip}"</p>
                ) : (
                  <p className="text-indigo-400 text-xs">Bu yeməyi daha ləzzətli etmək üçün AI Şefdən sirr soruşun.</p>
                )}
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Ingredients List */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-emerald-600" />
                Tərkibi
              </h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ing, idx) => {
                  let isMissing = false;
                  if (!recipe.isAiGenerated && recipe.matchingIngredients) {
                     const hasIt = recipe.matchingIngredients.some(m => ing.includes(m) || m.includes(ing));
                     isMissing = !hasIt;
                  }
                  
                  return (
                    <li key={idx} className="flex items-start gap-3 p-2 rounded hover:bg-gray-50">
                      <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${isMissing ? 'bg-red-400' : 'bg-emerald-500'}`} />
                      <span className={isMissing ? 'text-gray-500 line-through decoration-red-300' : 'text-gray-800 font-medium'}>
                        {ing}
                      </span>
                      {isMissing && <span className="text-xs text-red-500 font-medium ml-auto">Yoxdur</span>}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-emerald-600" />
                Hazırlanması
              </h3>
              <div className="space-y-4">
                {recipe.instructions.split('\n').map((step, idx) => (
                  <div key={idx} className="flex gap-3 text-gray-700 text-sm leading-relaxed">
                   <p>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Bağla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}