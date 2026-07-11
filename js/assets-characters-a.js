window.GAME_ASSETS = window.GAME_ASSETS || {};
window.GAME_ASSETS.characters = window.GAME_ASSETS.characters || {};

window.GAME_ASSETS.characters.pip = {
  name: 'Pip',
  species: 'kid',
  accent: '#FF9EC4',
  voice: { rate: 1.05, pitch: 1.5 },
  greetings: ['Hi hi hi! Pizza time! ✨', 'Ooh ooh, I am SO hungry!', 'Yay, my favorite shop!'],
  orderLines: ['Can I please have {ORDER}?', 'I would love {ORDER}!'],
  happyLines: ['Best pizza EVER!', 'Yum yum yum!', 'My tummy is so happy! ✨'],
  svg: `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#4A2E24" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
      <ellipse cx="100" cy="228" rx="46" ry="12" fill="#FF9EC4"/>
      <path d="M62 232 L62 168 Q100 150 138 168 L138 232 Z" fill="#7ED6DF"/>
      <ellipse cx="55" cy="188" rx="12" ry="16" fill="#F7E3B8"/>
      <ellipse cx="145" cy="182" rx="12" ry="16" fill="#F7E3B8"/>
      <circle cx="100" cy="98" r="58" fill="#F7E3B8"/>
      <path d="M42 96 Q100 34 158 96 Q158 62 100 52 Q42 62 42 96 Z" fill="#A96B33"/>
      <circle cx="42" cy="96" r="20" fill="#A96B33"/>
      <circle cx="158" cy="96" r="20" fill="#A96B33"/>
      <circle cx="42" cy="118" r="12" fill="#FF9EC4" stroke-width="4"/>
      <circle cx="158" cy="118" r="12" fill="#FF9EC4" stroke-width="4"/>
    </g>
    <g stroke="#4A2E24" stroke-width="4" stroke-linejoin="round">
      <path d="M70 172 L70 232 M100 158 L100 232 M130 172 L130 232" stroke="#3FBAC6" fill="none"/>
    </g>
    <g class="eye">
      <ellipse cx="80" cy="98" rx="15" ry="18" fill="#FFF8EC" stroke="#4A2E24" stroke-width="5"/>
      <circle cx="82" cy="100" r="9" fill="#4A2E24"/>
      <circle cx="78" cy="95" r="3.5" fill="#FFF8EC"/>
      <circle cx="85" cy="104" r="1.8" fill="#FFF8EC"/>
    </g>
    <g class="eye">
      <ellipse cx="120" cy="98" rx="15" ry="18" fill="#FFF8EC" stroke="#4A2E24" stroke-width="5"/>
      <circle cx="122" cy="100" r="9" fill="#4A2E24"/>
      <circle cx="118" cy="95" r="3.5" fill="#FFF8EC"/>
      <circle cx="125" cy="104" r="1.8" fill="#FFF8EC"/>
    </g>
    <path d="M66 78 Q80 70 92 78" fill="none" stroke="#4A2E24" stroke-width="4" stroke-linecap="round"/>
    <path d="M108 78 Q120 70 134 78" fill="none" stroke="#4A2E24" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="66" cy="120" rx="10" ry="7" fill="#FFB3A7" opacity="0.55"/>
    <ellipse cx="134" cy="120" rx="10" ry="7" fill="#FFB3A7" opacity="0.55"/>
    <g class="mouth-normal">
      <path d="M82 122 Q100 138 118 122 Q100 130 82 122 Z" fill="#E8503A" stroke="#4A2E24" stroke-width="5" stroke-linejoin="round"/>
    </g>
    <g class="mouth-happy" style="display:none">
      <path d="M78 118 Q100 150 122 118 Q100 130 78 118 Z" fill="#E8503A" stroke="#4A2E24" stroke-width="5" stroke-linejoin="round"/>
      <path d="M90 138 Q100 148 110 138 Z" fill="#FF6B6B"/>
    </g>
    <path d="M100 46 Q96 34 104 30" fill="none" stroke="#4A2E24" stroke-width="4" stroke-linecap="round"/>
    <circle cx="105" cy="27" r="5" fill="#FFC93C" stroke="#4A2E24" stroke-width="3"/>
  </svg>`
};

window.GAME_ASSETS.characters.barks = {
  name: 'Sir Barksalot',
  species: 'puppy',
  accent: '#FFA94D',
  voice: { rate: 0.95, pitch: 1.2 },
  greetings: ['Greetings, noble chef!', 'A quest for pizza, I seek!', 'Woof! I mean... good day! 🐾'],
  orderLines: ['A knight requests {ORDER}, please!', 'Bring forth {ORDER}!'],
  happyLines: ['A feast for the realm!', 'Victory tastes like cheese!', 'Huzzah! So tasty! 🐾'],
  svg: `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#4A2E24" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
      <ellipse cx="100" cy="228" rx="44" ry="12" fill="#FFA94D"/>
      <path d="M60 232 L64 176 Q100 158 136 176 L140 232 Z" fill="#F2B84B"/>
      <ellipse cx="40" cy="118" rx="17" ry="30" fill="#D89A32" transform="rotate(-18 40 118)"/>
      <ellipse cx="160" cy="118" rx="17" ry="30" fill="#D89A32" transform="rotate(18 160 118)"/>
      <circle cx="100" cy="104" r="56" fill="#F2B84B"/>
      <ellipse cx="100" cy="128" rx="34" ry="28" fill="#F7E3B8"/>
      <path d="M46 78 Q100 52 154 78 Q154 60 100 56 Q46 60 46 78 Z" fill="#C0C6CC"/>
      <rect x="52" y="50" width="96" height="20" rx="10" fill="#C0C6CC"/>
      <ellipse cx="100" cy="46" rx="14" ry="10" fill="#FF6B6B"/>
      <ellipse cx="100" cy="138" rx="12" ry="9" fill="#4A2E24"/>
    </g>
    <g class="eye">
      <ellipse cx="80" cy="100" rx="14" ry="17" fill="#FFF8EC" stroke="#4A2E24" stroke-width="5"/>
      <circle cx="82" cy="102" r="8.5" fill="#4A2E24"/>
      <circle cx="78" cy="97" r="3.5" fill="#FFF8EC"/>
      <circle cx="85" cy="106" r="1.8" fill="#FFF8EC"/>
    </g>
    <g class="eye">
      <ellipse cx="120" cy="100" rx="14" ry="17" fill="#FFF8EC" stroke="#4A2E24" stroke-width="5"/>
      <circle cx="122" cy="102" r="8.5" fill="#4A2E24"/>
      <circle cx="118" cy="97" r="3.5" fill="#FFF8EC"/>
      <circle cx="125" cy="106" r="1.8" fill="#FFF8EC"/>
    </g>
    <ellipse cx="64" cy="128" rx="9" ry="6" fill="#FFB3A7" opacity="0.55"/>
    <ellipse cx="136" cy="128" rx="9" ry="6" fill="#FFB3A7" opacity="0.55"/>
    <g class="mouth-normal">
      <path d="M100 148 L100 160" fill="none" stroke="#4A2E24" stroke-width="5" stroke-linecap="round"/>
      <path d="M100 160 Q84 166 76 154" fill="none" stroke="#4A2E24" stroke-width="5" stroke-linecap="round"/>
      <path d="M100 160 Q116 166 124 154" fill="none" stroke="#4A2E24" stroke-width="5" stroke-linecap="round"/>
    </g>
    <g class="mouth-happy" style="display:none">
      <path d="M74 152 Q100 182 126 152 Q100 162 74 152 Z" fill="#4A2E24" stroke="#4A2E24" stroke-width="5" stroke-linejoin="round"/>
      <path d="M90 168 Q100 180 110 168 Z" fill="#FF6B6B"/>
    </g>
    <line x1="52" y1="42" x2="52" y2="30" stroke="#4A2E24" stroke-width="4" stroke-linecap="round"/>
    <path d="M52 30 L64 34 L52 40 Z" fill="#FF6B6B" stroke="#4A2E24" stroke-width="3" stroke-linejoin="round"/>
  </svg>`
};

window.GAME_ASSETS.characters.beep = {
  name: 'Beep-Bop',
  species: 'robot',
  accent: '#7ED6DF',
  voice: { rate: 1.0, pitch: 0.9 },
  greetings: ['BEEP! Hello, human friend!', 'BOOP. I am ready to eat!', 'SYSTEM: hungry = TRUE 🤖'],
  orderLines: ['REQUEST: {ORDER}, please!', 'LOADING order: {ORDER}!'],
  happyLines: ['PIZZA.EXE = HAPPY!', 'YUM DETECTED! BEEP!', 'BATTERY FULL OF JOY! 🤖'],
  svg: `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="beep-screenGrad" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stop-color="#BFF3F7"/>
        <stop offset="100%" stop-color="#3FBAC6"/>
      </radialGradient>
    </defs>
    <g stroke="#4A2E24" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
      <ellipse cx="100" cy="228" rx="44" ry="12" fill="#3FBAC6"/>
      <rect x="60" y="168" width="80" height="66" rx="20" fill="#7ED6DF"/>
      <ellipse cx="48" cy="192" rx="12" ry="16" fill="#3FBAC6"/>
      <ellipse cx="152" cy="192" rx="12" ry="16" fill="#3FBAC6"/>
      <circle cx="100" cy="106" r="58" fill="#7ED6DF"/>
      <path d="M46 130 Q100 152 154 130 L154 148 Q100 168 46 148 Z" fill="#3FBAC6" stroke="none"/>
      <rect x="66" y="80" width="68" height="52" rx="14" fill="url(#beep-screenGrad)"/>
    </g>
    <g stroke="#4A2E24" stroke-width="3">
      <circle cx="58" cy="74" r="3" fill="#4A2E24"/>
      <circle cx="142" cy="74" r="3" fill="#4A2E24"/>
      <circle cx="54" cy="132" r="3" fill="#4A2E24"/>
      <circle cx="146" cy="132" r="3" fill="#4A2E24"/>
      <rect x="82" y="176" width="36" height="16" rx="4" fill="#3FBAC6"/>
    </g>
    <g class="eye">
      <rect x="74" y="92" width="20" height="24" rx="8" fill="#FFF8EC" stroke="#4A2E24" stroke-width="4"/>
      <circle cx="84" cy="104" r="7" fill="#4A2E24"/>
      <circle cx="81" cy="100" r="3" fill="#FFF8EC"/>
      <circle cx="87" cy="108" r="1.5" fill="#FFF8EC"/>
    </g>
    <g class="eye">
      <rect x="106" y="92" width="20" height="24" rx="8" fill="#FFF8EC" stroke="#4A2E24" stroke-width="4"/>
      <circle cx="116" cy="104" r="7" fill="#4A2E24"/>
      <circle cx="113" cy="100" r="3" fill="#FFF8EC"/>
      <circle cx="119" cy="108" r="1.5" fill="#FFF8EC"/>
    </g>
    <rect x="62" y="106" width="10" height="8" rx="3" fill="#FF6B6B" opacity="0.7"/>
    <rect x="128" y="106" width="10" height="8" rx="3" fill="#FF6B6B" opacity="0.7"/>
    <g class="mouth-normal">
      <path d="M84 122 Q100 130 116 122" fill="none" stroke="#4A2E24" stroke-width="4" stroke-linecap="round"/>
    </g>
    <g class="mouth-happy" style="display:none">
      <rect x="82" y="118" width="36" height="14" rx="6" fill="#FFF8EC" stroke="#4A2E24" stroke-width="4"/>
      <line x1="92" y1="118" x2="92" y2="132" stroke="#4A2E24" stroke-width="3"/>
      <line x1="100" y1="118" x2="100" y2="132" stroke="#4A2E24" stroke-width="3"/>
      <line x1="108" y1="118" x2="108" y2="132" stroke="#4A2E24" stroke-width="3"/>
    </g>
    <line x1="100" y1="48" x2="100" y2="26" stroke="#4A2E24" stroke-width="5" stroke-linecap="round"/>
    <circle cx="100" cy="20" r="9" fill="#FFC93C" stroke="#4A2E24" stroke-width="5"/>
    <circle cx="96" cy="16" r="2.5" fill="#FFF8EC"/>
  </svg>`
};

window.GAME_ASSETS.characters.mo = {
  name: 'Mo',
  species: 'monster',
  accent: '#A78BFA',
  voice: { rate: 0.9, pitch: 0.8 },
  greetings: ['Hewwo, tiny friend!', 'Mo hungry... Mo happy!', 'Ooooh, smells yummy! 💜'],
  orderLines: ['Mo want {ORDER}, pretty please?', 'Can Mo have {ORDER}?'],
  happyLines: ['Mo LOVE it! Nom nom!', 'So good! Mo do happy dance!', 'Yummy yummy tummy! 💜'],
  svg: `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#4A2E24" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
      <ellipse cx="100" cy="230" rx="52" ry="12" fill="#7C5CE0"/>
      <path d="M46 232 Q34 150 60 110 Q100 78 140 110 Q166 150 154 232 Z" fill="#A78BFA"/>
      <path d="M46 232 Q40 190 52 170 Q100 196 148 170 Q160 190 154 232 Z" fill="#7C5CE0" stroke="none"/>
      <path d="M60 88 Q54 60 74 58 Q82 72 78 92 Z" fill="#A78BFA"/>
      <path d="M140 88 Q146 60 126 58 Q118 72 122 92 Z" fill="#A78BFA"/>
      <circle cx="70" cy="58" r="7" fill="#FFF8EC"/>
      <circle cx="130" cy="58" r="7" fill="#FFF8EC"/>
      <ellipse cx="52" cy="150" rx="14" ry="20" fill="#7C5CE0" transform="rotate(-20 52 150)"/>
      <ellipse cx="148" cy="150" rx="14" ry="20" fill="#7C5CE0" transform="rotate(20 148 150)"/>
    </g>
    <path d="M60 120 Q100 116 140 120" fill="none" stroke="#7C5CE0" stroke-width="5" stroke-linecap="round" opacity="0.6"/>
    <path d="M64 100 Q100 96 136 100" fill="none" stroke="#7C5CE0" stroke-width="4" stroke-linecap="round" opacity="0.5"/>
    <g class="eye">
      <circle cx="100" cy="108" r="34" fill="#FFF8EC" stroke="#4A2E24" stroke-width="6"/>
      <circle cx="100" cy="112" r="18" fill="#7C5CE0" stroke="#4A2E24" stroke-width="3"/>
      <circle cx="100" cy="112" r="9" fill="#4A2E24"/>
      <circle cx="92" cy="103" r="6" fill="#FFF8EC"/>
      <circle cx="107" cy="119" r="3" fill="#FFF8EC"/>
    </g>
    <path d="M74 82 Q100 74 126 82" fill="none" stroke="#4A2E24" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="60" cy="150" rx="11" ry="8" fill="#FFB3A7" opacity="0.55"/>
    <ellipse cx="140" cy="150" rx="11" ry="8" fill="#FFB3A7" opacity="0.55"/>
    <g class="mouth-normal">
      <path d="M66 150 Q100 178 134 150 Q100 164 66 150 Z" fill="#E8503A" stroke="#4A2E24" stroke-width="6" stroke-linejoin="round"/>
      <path d="M112 150 L118 138 L124 152 Z" fill="#FFF8EC" stroke="#4A2E24" stroke-width="3" stroke-linejoin="round"/>
    </g>
    <g class="mouth-happy" style="display:none">
      <path d="M58 146 Q100 194 142 146 Q100 168 58 146 Z" fill="#E8503A" stroke="#4A2E24" stroke-width="6" stroke-linejoin="round"/>
      <path d="M78 178 Q100 190 122 178 Z" fill="#FF6B6B"/>
      <path d="M112 146 L118 132 L124 148 Z" fill="#FFF8EC" stroke="#4A2E24" stroke-width="3" stroke-linejoin="round"/>
    </g>
  </svg>`
};

window.GAME_ASSETS.characters.zizzy = {
  name: 'Zizzy',
  species: 'alien',
  accent: '#5FBF63',
  voice: { rate: 1.1, pitch: 1.4 },
  greetings: ['Zizzy comes in peace!', 'Earth food?! WOW!', 'Take me to your pizza! 🛸'],
  orderLines: ['On my planet we love {ORDER}!', 'I wish to try {ORDER}, please!'],
  happyLines: ['Earth food is AMAZING!', 'Zizzy has three happy eyes!', 'Beaming this home! So good! 🛸'],
  svg: `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#4A2E24" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
      <ellipse cx="100" cy="228" rx="56" ry="16" fill="#B7B0C9"/>
      <ellipse cx="100" cy="222" rx="60" ry="14" fill="#C6C0D6"/>
      <path d="M62 224 L66 176 Q100 158 134 176 L138 224 Z" fill="#5FBF63"/>
      <ellipse cx="100" cy="176" rx="40" ry="14" fill="#3E9D4C"/>
      <ellipse cx="50" cy="150" rx="12" ry="18" fill="#3E9D4C" transform="rotate(-16 50 150)"/>
      <ellipse cx="150" cy="150" rx="12" ry="18" fill="#3E9D4C" transform="rotate(16 150 150)"/>
      <path d="M56 116 Q52 66 100 56 Q148 66 144 116 Q100 142 56 116 Z" fill="#5FBF63"/>
      <path d="M60 122 Q100 140 140 122 Q100 136 60 122 Z" fill="#3E9D4C" stroke="none"/>
    </g>
    <g stroke="#4A2E24" stroke-width="4" stroke-linecap="round">
      <path d="M74 60 Q66 30 52 22" fill="none"/>
      <path d="M126 60 Q134 30 148 22" fill="none"/>
    </g>
    <circle cx="50" cy="20" r="7" fill="#FFC93C" stroke="#4A2E24" stroke-width="4"/>
    <circle cx="150" cy="20" r="7" fill="#FFC93C" stroke="#4A2E24" stroke-width="4"/>
    <g class="eye">
      <ellipse cx="100" cy="42" rx="13" ry="16" fill="#FFF8EC" stroke="#4A2E24" stroke-width="5"/>
      <circle cx="100" cy="44" r="7" fill="#4A2E24"/>
      <circle cx="97" cy="40" r="3" fill="#FFF8EC"/>
      <circle cx="103" cy="48" r="1.4" fill="#FFF8EC"/>
    </g>
    <g class="eye">
      <ellipse cx="80" cy="76" rx="14" ry="17" fill="#FFF8EC" stroke="#4A2E24" stroke-width="5"/>
      <circle cx="81" cy="78" r="8" fill="#4A2E24"/>
      <circle cx="78" cy="73" r="3.2" fill="#FFF8EC"/>
      <circle cx="84" cy="82" r="1.5" fill="#FFF8EC"/>
    </g>
    <g class="eye">
      <ellipse cx="120" cy="76" rx="14" ry="17" fill="#FFF8EC" stroke="#4A2E24" stroke-width="5"/>
      <circle cx="121" cy="78" r="8" fill="#4A2E24"/>
      <circle cx="118" cy="73" r="3.2" fill="#FFF8EC"/>
      <circle cx="124" cy="82" r="1.5" fill="#FFF8EC"/>
    </g>
    <ellipse cx="66" cy="102" rx="9" ry="6" fill="#FFB3A7" opacity="0.55"/>
    <ellipse cx="134" cy="102" rx="9" ry="6" fill="#FFB3A7" opacity="0.55"/>
    <g class="mouth-normal">
      <path d="M82 104 Q100 118 118 104 Q100 110 82 104 Z" fill="#3E9D4C" stroke="#4A2E24" stroke-width="5" stroke-linejoin="round"/>
    </g>
    <g class="mouth-happy" style="display:none">
      <path d="M78 100 Q100 132 122 100 Q100 112 78 100 Z" fill="#3E9D4C" stroke="#4A2E24" stroke-width="5" stroke-linejoin="round"/>
      <path d="M90 120 Q100 130 110 120 Z" fill="#FF6B6B"/>
    </g>
  </svg>`
};
