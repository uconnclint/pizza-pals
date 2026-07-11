window.GAME_ASSETS = window.GAME_ASSETS || {};
window.GAME_ASSETS.scenes = {
  shopBg: `<svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shopBg-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FFEFD2"/>
        <stop offset="1" stop-color="#FFE1B6"/>
      </linearGradient>
      <linearGradient id="shopBg-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#9BE3EC"/>
        <stop offset="1" stop-color="#CFF4F5"/>
      </linearGradient>
      <radialGradient id="shopBg-sun" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#FFE07A"/>
        <stop offset="1" stop-color="#FFC93C"/>
      </radialGradient>
    </defs>
    <!-- walls -->
    <rect x="0" y="0" width="1200" height="800" fill="url(#shopBg-wall)"/>
    <!-- floor -->
    <rect x="0" y="640" width="1200" height="160" fill="#E9B77E"/>
    <rect x="0" y="640" width="1200" height="34" fill="#D89A32"/>
    <!-- big arched window -->
    <g>
      <rect x="440" y="120" width="320" height="360" rx="18" fill="#C98A4B"/>
      <path d="M470 300 a130 130 0 0 1 260 0 v168 a10 10 0 0 1 -10 10 h-240 a10 10 0 0 1 -10 -10 z" fill="url(#shopBg-sky)" stroke="#4A2E24" stroke-width="10" stroke-linejoin="round"/>
      <!-- sun peeking upper-left -->
      <circle cx="512" cy="248" r="42" fill="url(#shopBg-sun)" stroke="#4A2E24" stroke-width="8"/>
      <circle cx="500" cy="242" r="5" fill="#4A2E24"/>
      <circle cx="524" cy="242" r="5" fill="#4A2E24"/>
      <path d="M502 262 q10 10 20 0" fill="none" stroke="#4A2E24" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="490" cy="262" rx="8" ry="5" fill="#FFB3A7" opacity="0.55"/>
      <ellipse cx="534" cy="262" rx="8" ry="5" fill="#FFB3A7" opacity="0.55"/>
      <!-- clouds -->
      <g fill="#FFFFFF" stroke="#4A2E24" stroke-width="6" stroke-linejoin="round">
        <path d="M600 300 q6 -30 40 -26 q14 -26 46 -12 q26 -2 22 24 q18 10 -2 24 h-96 q-24 -10 -10 -34z"/>
        <path d="M486 360 q4 -22 30 -20 q10 -18 34 -8 q20 0 16 20 h-84 q-14 -6 4 -12z"/>
      </g>
      <!-- window sill -->
      <rect x="452" y="464" width="296" height="26" rx="8" fill="#B77C3C" stroke="#4A2E24" stroke-width="8"/>
    </g>
    <!-- pennant bunting -->
    <g stroke="#4A2E24" stroke-width="5">
      <path d="M40 70 Q600 150 1160 70" fill="none"/>
    </g>
    <g stroke="#4A2E24" stroke-width="6" stroke-linejoin="round">
      <path d="M90 82 l40 4 l-24 44 z" fill="#FF9EC4"/>
      <path d="M190 92 l40 3 l-23 45 z" fill="#7ED6DF"/>
      <path d="M300 100 l40 2 l-22 45 z" fill="#FFC93C"/>
      <path d="M900 100 l40 -2 l-18 46 z" fill="#A78BFA"/>
      <path d="M1000 92 l40 -3 l-17 46 z" fill="#5FBF63"/>
      <path d="M1090 82 l40 -4 l-15 46 z" fill="#FF6B6B"/>
    </g>
    <!-- string lights -->
    <g stroke="#4A2E24" stroke-width="4">
      <path d="M40 40 Q600 96 1160 40" fill="none"/>
    </g>
    <g stroke="#4A2E24" stroke-width="3">
      <circle cx="150" cy="55" r="8" fill="#FFD855"/>
      <circle cx="360" cy="66" r="8" fill="#FFA94D"/>
      <circle cx="600" cy="70" r="8" fill="#FF9EC4"/>
      <circle cx="840" cy="66" r="8" fill="#7ED6DF"/>
      <circle cx="1050" cy="55" r="8" fill="#5FBF63"/>
    </g>
    <!-- framed pizza picture (left) -->
    <g transform="translate(150 190)">
      <rect x="0" y="0" width="180" height="150" rx="14" fill="#FFF8EC" stroke="#4A2E24" stroke-width="10"/>
      <rect x="16" y="16" width="148" height="118" rx="10" fill="#7ED6DF"/>
      <circle cx="90" cy="76" r="52" fill="#F2B84B" stroke="#4A2E24" stroke-width="8"/>
      <circle cx="90" cy="76" r="40" fill="#FFD855"/>
      <circle cx="70" cy="62" r="9" fill="#E8503A"/>
      <circle cx="106" cy="66" r="9" fill="#E8503A"/>
      <circle cx="86" cy="94" r="9" fill="#E8503A"/>
      <path d="M64 100 q6 -8 14 -2" fill="none" stroke="#3E9D4C" stroke-width="5" stroke-linecap="round"/>
    </g>
    <!-- menu chalkboard (right) -->
    <g transform="translate(880 180)">
      <rect x="0" y="0" width="190" height="230" rx="16" fill="#C98A4B" stroke="#4A2E24" stroke-width="10"/>
      <rect x="16" y="16" width="158" height="198" rx="10" fill="#3C4B45"/>
      <text x="95" y="52" font-family="'Arial Rounded MT Bold','Comic Sans MS',sans-serif" font-weight="900" font-size="26" fill="#FFD855" text-anchor="middle">MENU</text>
      <g stroke="#FFF8EC" stroke-width="5" stroke-linecap="round">
        <path d="M34 84 h122"/>
        <path d="M34 116 h100"/>
        <path d="M34 148 h122"/>
        <path d="M34 180 h86"/>
      </g>
      <circle cx="150" cy="176" r="14" fill="#FF9EC4" stroke="#FFF8EC" stroke-width="4"/>
    </g>
    <!-- potted plant (right floor) -->
    <g transform="translate(1050 470)">
      <g fill="#5FBF63" stroke="#4A2E24" stroke-width="8" stroke-linejoin="round">
        <path d="M60 150 q-46 -20 -40 -84 q30 8 40 54z"/>
        <path d="M60 150 q46 -20 40 -84 q-30 8 -40 54z"/>
        <path d="M60 150 q-6 -70 0 -110 q10 40 0 110z" fill="#3E9D4C"/>
      </g>
      <path d="M22 150 h76 l-10 60 h-56 z" fill="#FF9EC4" stroke="#4A2E24" stroke-width="8" stroke-linejoin="round"/>
      <rect x="16" y="140" width="88" height="20" rx="8" fill="#FF6B6B" stroke="#4A2E24" stroke-width="8"/>
    </g>
    <!-- soft floor shadow -->
    <ellipse cx="600" cy="660" rx="260" ry="30" fill="#D89A32" opacity="0.4"/>
  </svg>`,
  counter: `<svg viewBox="0 0 1200 220" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="counter-face" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#B87B3E"/>
        <stop offset="1" stop-color="#A96B33"/>
      </linearGradient>
    </defs>
    <!-- face -->
    <path d="M0 60 Q0 34 30 34 L1170 34 Q1200 34 1200 60 L1200 220 L0 220 Z" fill="url(#counter-face)" stroke="#4A2E24" stroke-width="10" stroke-linejoin="round"/>
    <!-- wood top edge -->
    <path d="M0 60 Q0 30 30 30 L1170 30 Q1200 30 1200 60 L1200 78 L0 78 Z" fill="#C98A4B" stroke="#4A2E24" stroke-width="10" stroke-linejoin="round"/>
    <rect x="0" y="72" width="1200" height="8" fill="#A96B33" opacity="0.5"/>
    <!-- subtle wood grain -->
    <g stroke="#8F551F" stroke-width="3" stroke-linecap="round" opacity="0.4" fill="none">
      <path d="M120 110 q40 20 0 40"/>
      <path d="M340 120 q30 16 0 36"/>
      <path d="M980 108 q-36 22 0 44"/>
      <path d="M760 150 q28 14 0 34"/>
      <path d="M200 176 h60"/>
      <path d="M900 178 h70"/>
    </g>
    <!-- PIZZA PALS heart emblem in the middle -->
    <g transform="translate(600 132)">
      <path d="M0 40 C-46 6 -34 -34 0 -14 C34 -34 46 6 0 40 Z" fill="#FF6B6B" stroke="#4A2E24" stroke-width="9" stroke-linejoin="round"/>
      <path d="M-16 -6 q-6 -8 -12 -2" fill="none" stroke="#FFF8EC" stroke-width="6" stroke-linecap="round" opacity="0.8"/>
      <text x="0" y="6" font-family="'Arial Rounded MT Bold','Comic Sans MS',sans-serif" font-weight="900" font-size="15" fill="#FFF8EC" text-anchor="middle">PIZZA</text>
      <text x="0" y="24" font-family="'Arial Rounded MT Bold','Comic Sans MS',sans-serif" font-weight="900" font-size="15" fill="#FFF8EC" text-anchor="middle">PALS</text>
    </g>
  </svg>`,
  kitchenBg: `<svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="kitchenBg-top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#B7EAF0"/>
        <stop offset="1" stop-color="#DAF6F7"/>
      </linearGradient>
    </defs>
    <!-- wall base -->
    <rect x="0" y="0" width="1200" height="800" fill="#FFEAD0"/>
    <!-- checker tiles (upper wall) -->
    <g>
      <rect x="0" y="0" width="1200" height="470" fill="#FFF3E0"/>
      <g fill="#FFDCC0">
        <rect x="0" y="0" width="120" height="120"/><rect x="240" y="0" width="120" height="120"/><rect x="480" y="0" width="120" height="120"/><rect x="720" y="0" width="120" height="120"/><rect x="960" y="0" width="120" height="120"/>
        <rect x="120" y="120" width="120" height="120"/><rect x="360" y="120" width="120" height="120"/><rect x="600" y="120" width="120" height="120"/><rect x="840" y="120" width="120" height="120"/><rect x="1080" y="120" width="120" height="120"/>
        <rect x="0" y="240" width="120" height="120"/><rect x="240" y="240" width="120" height="120"/><rect x="480" y="240" width="120" height="120"/><rect x="720" y="240" width="120" height="120"/><rect x="960" y="240" width="120" height="120"/>
        <rect x="120" y="360" width="120" height="110"/><rect x="360" y="360" width="120" height="110"/><rect x="600" y="360" width="120" height="110"/><rect x="840" y="360" width="120" height="110"/><rect x="1080" y="360" width="120" height="110"/>
      </g>
      <g stroke="#F1C9A6" stroke-width="3">
        <path d="M0 120 h1200 M0 240 h1200 M0 360 h1200"/>
        <path d="M120 0 v470 M240 0 v470 M360 0 v470 M480 0 v470 M600 0 v470 M720 0 v470 M840 0 v470 M960 0 v470 M1080 0 v470"/>
      </g>
    </g>
    <!-- shelf with topping jars (upper left) -->
    <g transform="translate(70 150)">
      <rect x="0" y="130" width="300" height="20" rx="8" fill="#C98A4B" stroke="#4A2E24" stroke-width="8"/>
      <!-- jar 1 -->
      <g transform="translate(24 40)">
        <rect x="0" y="0" width="70" height="90" rx="16" fill="#FF9EC4" stroke="#4A2E24" stroke-width="7"/>
        <rect x="6" y="0" width="58" height="26" rx="10" fill="#E8503A"/>
        <rect x="14" y="-14" width="42" height="20" rx="8" fill="#B87B3E" stroke="#4A2E24" stroke-width="6"/>
      </g>
      <!-- jar 2 -->
      <g transform="translate(114 34)">
        <rect x="0" y="0" width="70" height="96" rx="16" fill="#FFD855" stroke="#4A2E24" stroke-width="7"/>
        <rect x="6" y="0" width="58" height="26" rx="10" fill="#5FBF63"/>
        <rect x="14" y="-14" width="42" height="20" rx="8" fill="#B87B3E" stroke="#4A2E24" stroke-width="6"/>
      </g>
      <!-- jar 3 -->
      <g transform="translate(204 44)">
        <rect x="0" y="0" width="70" height="86" rx="16" fill="#A78BFA" stroke="#4A2E24" stroke-width="7"/>
        <rect x="6" y="0" width="58" height="26" rx="10" fill="#7C5CE0"/>
        <rect x="14" y="-14" width="42" height="20" rx="8" fill="#B87B3E" stroke="#4A2E24" stroke-width="6"/>
      </g>
    </g>
    <!-- window with plant (upper right) -->
    <g transform="translate(830 90)">
      <rect x="0" y="0" width="280" height="230" rx="16" fill="#C98A4B" stroke="#4A2E24" stroke-width="10"/>
      <rect x="18" y="18" width="244" height="194" rx="8" fill="url(#kitchenBg-top)"/>
      <path d="M18 18 h244 M140 18 v194 M18 115 h244" stroke="#B77C3C" stroke-width="8"/>
      <!-- cloud -->
      <path d="M60 70 q4 -20 30 -16 q10 -14 30 -4 q18 0 14 20 h-74 q-14 -8 0 -0z" fill="#FFFFFF" stroke="#4A2E24" stroke-width="5" stroke-linejoin="round"/>
      <!-- sill plant -->
      <rect x="20" y="196" width="240" height="22" rx="8" fill="#B77C3C" stroke="#4A2E24" stroke-width="8"/>
      <g transform="translate(180 150)">
        <g fill="#5FBF63" stroke="#4A2E24" stroke-width="6" stroke-linejoin="round">
          <path d="M28 46 q-28 -10 -24 -46 q18 6 24 30z"/>
          <path d="M28 46 q28 -10 24 -46 q-18 6 -24 30z"/>
        </g>
        <path d="M8 46 h40 l-6 22 h-28z" fill="#FF6B6B" stroke="#4A2E24" stroke-width="6" stroke-linejoin="round"/>
      </g>
    </g>
    <!-- hanging utensils (center-top, above clean zone edge) -->
    <g transform="translate(500 130)" stroke="#4A2E24" stroke-width="6" stroke-linecap="round">
      <rect x="-90" y="-16" width="200" height="12" rx="6" fill="#B77C3C"/>
      <!-- spatula -->
      <g transform="translate(-50 0)">
        <path d="M0 0 v70" stroke="#8F551F"/>
        <rect x="-14" y="66" width="28" height="34" rx="8" fill="#FF9EC4"/>
      </g>
      <!-- ladle -->
      <g transform="translate(0 0)">
        <path d="M0 0 v66" stroke="#8F551F"/>
        <path d="M-16 66 a16 14 0 0 0 32 0z" fill="#7ED6DF"/>
      </g>
      <!-- whisk -->
      <g transform="translate(56 0)">
        <path d="M0 0 v60" stroke="#8F551F"/>
        <path d="M0 60 q-14 20 0 34 q14 -14 0 -34 M0 60 q-6 22 0 34 M0 60 q14 20 0 34 q-14 -14 0 -34" fill="none" stroke="#FFC93C"/>
      </g>
    </g>
    <!-- clean wooden worktop (center-bottom 2/3) -->
    <rect x="0" y="470" width="1200" height="330" fill="#E5B877"/>
    <rect x="0" y="470" width="1200" height="26" fill="#C98A4B"/>
    <path d="M0 496 h1200" stroke="#4A2E24" stroke-width="8"/>
    <g stroke="#D0A060" stroke-width="3" opacity="0.45" fill="none">
      <path d="M120 560 q60 16 0 40"/>
      <path d="M1040 560 q-60 16 0 40"/>
      <path d="M80 700 h120"/>
      <path d="M1000 700 h120"/>
    </g>
    <!-- charm prop left: stack of plates -->
    <g transform="translate(70 610)">
      <ellipse cx="60" cy="150" rx="70" ry="16" fill="#FF9EC4" stroke="#4A2E24" stroke-width="7"/>
      <ellipse cx="60" cy="128" rx="70" ry="16" fill="#FFD855" stroke="#4A2E24" stroke-width="7"/>
      <ellipse cx="60" cy="106" rx="70" ry="16" fill="#7ED6DF" stroke="#4A2E24" stroke-width="7"/>
    </g>
    <!-- charm prop right: flour bag -->
    <g transform="translate(1010 566)">
      <path d="M20 40 q-16 -30 40 -30 q56 0 40 30 l6 130 q0 14 -14 14 h-64 q-14 0 -14 -14z" fill="#FFF8EC" stroke="#4A2E24" stroke-width="8" stroke-linejoin="round"/>
      <text x="60" y="120" font-family="'Arial Rounded MT Bold','Comic Sans MS',sans-serif" font-weight="900" font-size="22" fill="#C98A4B" text-anchor="middle">FLOUR</text>
      <ellipse cx="60" cy="150" rx="10" ry="8" fill="#FFB3A7" opacity="0.55"/>
    </g>
  </svg>`,
  oven: `<svg viewBox="0 0 520 560" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="oven-glowGrad" cx="0.5" cy="1" r="0.9">
        <stop offset="0" stop-color="#FF9A3C"/>
        <stop offset="0.5" stop-color="#8A4A1E"/>
        <stop offset="1" stop-color="#3A241C"/>
      </radialGradient>
      <linearGradient id="oven-dome" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#D9633F"/>
        <stop offset="1" stop-color="#B14A2A"/>
      </linearGradient>
      <linearGradient id="oven-doorGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FFE07A"/>
        <stop offset="1" stop-color="#F2B84B"/>
      </linearGradient>
    </defs>
    <!-- base -->
    <rect x="60" y="440" width="400" height="100" rx="30" fill="#A96B33" stroke="#4A2E24" stroke-width="12" stroke-linejoin="round"/>
    <rect x="60" y="440" width="400" height="30" fill="#8F551F" opacity="0.5"/>
    <!-- chimney + heart smoke -->
    <rect x="380" y="40" width="54" height="70" rx="12" fill="#B14A2A" stroke="#4A2E24" stroke-width="10" stroke-linejoin="round"/>
    <rect x="372" y="30" width="70" height="24" rx="10" fill="#D9633F" stroke="#4A2E24" stroke-width="10" stroke-linejoin="round"/>
    <path d="M407 18 C393 4 375 22 407 40 C439 22 421 4 407 18 Z" fill="#FFF8EC" stroke="#4A2E24" stroke-width="7" stroke-linejoin="round" opacity="0.9"/>
    <!-- dome -->
    <path d="M60 300 a200 200 0 0 1 400 0 v150 a20 20 0 0 1 -20 20 h-360 a20 20 0 0 1 -20 -20 z" fill="url(#oven-dome)" stroke="#4A2E24" stroke-width="12" stroke-linejoin="round"/>
    <!-- one darker shade on lower/side third -->
    <path d="M60 380 v70 a20 20 0 0 0 20 20 h360 a20 20 0 0 0 20 -20 v-70 z" fill="#9C3F22" opacity="0.5"/>
    <!-- lighter highlight blob on top -->
    <path d="M150 190 a120 110 0 0 1 170 -40 q-90 -6 -170 40z" fill="#E8825C" opacity="0.7"/>
    <!-- cream trim band -->
    <rect x="70" y="410" width="380" height="30" rx="14" fill="#FFF3E0" stroke="#4A2E24" stroke-width="10"/>
    <g fill="#FF9EC4" stroke="#4A2E24" stroke-width="4">
      <circle cx="120" cy="425" r="7"/><circle cx="200" cy="425" r="7"/><circle cx="320" cy="425" r="7"/><circle cx="400" cy="425" r="7"/>
    </g>
    <!-- arched opening x=90..430 y=210..440 -->
    <path d="M90 440 v-60 a170 170 0 0 1 340 0 v60 a12 12 0 0 1 -12 12 h-316 a12 12 0 0 1 -12 -12 z" fill="#3A241C" stroke="#4A2E24" stroke-width="12" stroke-linejoin="round"/>
    <!-- warm glow at bottom of opening -->
    <path d="M104 438 v-56 a156 156 0 0 1 312 0 v56 a8 8 0 0 1 -8 8 h-296 a8 8 0 0 1 -8 -8 z" fill="url(#oven-glowGrad)"/>
    <!-- analog dial/knob -->
    <g transform="translate(470 360)">
      <circle cx="0" cy="0" r="30" fill="#FFC93C" stroke="#4A2E24" stroke-width="10"/>
      <circle cx="0" cy="0" r="12" fill="#FFF8EC" stroke="#4A2E24" stroke-width="5"/>
      <path d="M0 -6 v-16" stroke="#4A2E24" stroke-width="6" stroke-linecap="round"/>
    </g>
    <!-- door group LAST, covers arched opening -->
    <g class="oven-door">
      <path d="M90 440 v-60 a170 170 0 0 1 340 0 v60 a12 12 0 0 1 -12 12 h-316 a12 12 0 0 1 -12 -12 z" fill="url(#oven-doorGrad)" stroke="#4A2E24" stroke-width="12" stroke-linejoin="round"/>
      <path d="M100 400 a160 160 0 0 1 130 -100 q-90 20 -130 100z" fill="#FFF3E0" opacity="0.5"/>
      <!-- round glass window (semi-transparent so pizza shows) -->
      <circle cx="260" cy="360" r="92" fill="#FFD855" fill-opacity="0.25" stroke="#4A2E24" stroke-width="12"/>
      <circle cx="260" cy="360" r="92" fill="none" stroke="#B87B3E" stroke-width="4"/>
      <path d="M210 320 a70 70 0 0 1 40 -34" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" opacity="0.6"/>
      <!-- handle bar -->
      <rect x="150" y="470" width="220" height="26" rx="13" fill="#C98A4B" stroke="#4A2E24" stroke-width="10"/>
      <circle cx="160" cy="483" r="6" fill="#8F551F"/>
      <circle cx="360" cy="483" r="6" fill="#8F551F"/>
    </g>
  </svg>`,
  logo: `<svg viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="logo-slice" cx="0.5" cy="0.2" r="0.9">
        <stop offset="0" stop-color="#FFE07A"/>
        <stop offset="1" stop-color="#F2B84B"/>
      </radialGradient>
    </defs>
    <!-- sparkles -->
    <g fill="#FFC93C" stroke="#4A2E24" stroke-width="5" stroke-linejoin="round">
      <path d="M70 70 l10 26 l26 10 l-26 10 l-10 26 l-10 -26 l-26 -10 l26 -10 z"/>
      <path d="M740 120 l7 18 l18 7 l-18 7 l-7 18 l-7 -18 l-18 -7 l18 -7 z"/>
      <path d="M690 40 l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6 l14 -6 z"/>
    </g>
    <!-- PIZZA word -->
    <text x="60" y="150" font-family="'Arial Rounded MT Bold','Comic Sans MS',sans-serif" font-weight="900" font-size="120" stroke="#4A2E24" stroke-width="12" paint-order="stroke" fill="#FF6B6B" letter-spacing="2">
      <tspan dy="0" rotate="-8" fill="#FF6B6B">P</tspan><tspan dy="10" rotate="6" fill="#FFA94D">i</tspan><tspan dy="-8" rotate="-5" fill="#FFD855">z</tspan><tspan dy="8" rotate="7" fill="#5FBF63">z</tspan><tspan dy="-6" rotate="-6" fill="#7ED6DF">a</tspan>
    </text>
    <!-- highlight ticks on PIZZA -->
    <g stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity="0.8" fill="none">
      <path d="M78 78 q10 -8 20 0"/>
      <path d="M300 84 q10 -8 20 0"/>
    </g>
    <!-- PALS word -->
    <text x="150" y="278" font-family="'Arial Rounded MT Bold','Comic Sans MS',sans-serif" font-weight="900" font-size="120" stroke="#4A2E24" stroke-width="12" paint-order="stroke" fill="#A78BFA" letter-spacing="2">
      <tspan dy="6" rotate="-6" fill="#A78BFA">P</tspan><tspan dy="-8" rotate="7" fill="#FF9EC4">a</tspan><tspan dy="8" rotate="-5" fill="#74B9FF">l</tspan><tspan dy="-6" rotate="6" fill="#FFA94D">s</tspan><tspan dy="6" rotate="10" fill="#FF6B6B">!</tspan>
    </text>
    <g stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity="0.8" fill="none">
      <path d="M168 210 q10 -8 20 0"/>
      <path d="M300 214 q10 -8 20 0"/>
    </g>
    <!-- winking pizza-slice mascot beside the words (upper right) -->
    <g transform="translate(560 150)">
      <!-- slice -->
      <path d="M0 -70 C60 -60 90 20 60 90 L-60 90 C-90 20 -60 -60 0 -70 Z" fill="url(#logo-slice)" stroke="#4A2E24" stroke-width="10" stroke-linejoin="round"/>
      <!-- crust -->
      <path d="M-60 90 L60 90 C48 118 -48 118 -60 90 Z" fill="#F2B84B" stroke="#4A2E24" stroke-width="10" stroke-linejoin="round"/>
      <!-- cheese drip highlight -->
      <path d="M-40 -30 q40 -14 80 0" fill="none" stroke="#FFF3E0" stroke-width="7" stroke-linecap="round" opacity="0.7"/>
      <!-- pepperoni -->
      <circle cx="-22" cy="-4" r="12" fill="#E8503A" stroke="#4A2E24" stroke-width="5"/>
      <circle cx="26" cy="20" r="12" fill="#E8503A" stroke="#4A2E24" stroke-width="5"/>
      <circle cx="-6" cy="46" r="10" fill="#E8503A" stroke="#4A2E24" stroke-width="5"/>
      <!-- face: winking eyes -->
      <path d="M-30 6 q8 -12 18 0" fill="none" stroke="#4A2E24" stroke-width="7" stroke-linecap="round"/>
      <g>
        <ellipse cx="20" cy="4" rx="12" ry="14" fill="#FFF8EC" stroke="#4A2E24" stroke-width="6"/>
        <circle cx="22" cy="6" r="6" fill="#4A2E24"/>
        <circle cx="19" cy="2" r="2.4" fill="#FFFFFF"/>
      </g>
      <!-- smile -->
      <path d="M-14 34 q14 18 34 4" fill="none" stroke="#4A2E24" stroke-width="7" stroke-linecap="round"/>
      <!-- blush -->
      <ellipse cx="-26" cy="34" rx="10" ry="6" fill="#FFB3A7" opacity="0.55"/>
      <ellipse cx="40" cy="34" rx="10" ry="6" fill="#FFB3A7" opacity="0.55"/>
    </g>
  </svg>`
};
