window.GAME_ASSETS = window.GAME_ASSETS || {};
window.GAME_ASSETS.characters = window.GAME_ASSETS.characters || {};

/* =========================================================================
   Captain Whiskers — orange tabby pirate cat
   ========================================================================= */
window.GAME_ASSETS.characters.whiskers = {
  name: 'Captain Whiskers',
  species: 'pirate cat',
  accent: '#FF6B6B',
  voice: { rate: 0.95, pitch: 0.9 },
  greetings: ['Ahoy there, matey! 🏴', 'Arr, welcome aboard!', 'Land ho, a pizza port!'],
  orderLines: ['Arr! Bring me {ORDER}!', 'I be wantin\' {ORDER}, matey!'],
  happyLines: ['Shiver me tummy, yum!', 'Best treasure ever, arr!', 'Me belly says thank ye!'],
  svg: `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="whiskers-shirtClip"><path d="M52 152 Q52 136 72 133 L128 133 Q148 136 148 152 L154 232 L46 232 Z"/></clipPath>
  </defs>
  <!-- paws -->
  <circle cx="50" cy="176" r="16" fill="#FFA94D" stroke="#4A2E24" stroke-width="6"/>
  <circle cx="150" cy="176" r="16" fill="#FFA94D" stroke="#4A2E24" stroke-width="6"/>
  <!-- striped sailor shirt -->
  <path d="M52 152 Q52 136 72 133 L128 133 Q148 136 148 152 L154 232 L46 232 Z" fill="#FFF8EC" stroke="#4A2E24" stroke-width="6" stroke-linejoin="round"/>
  <g clip-path="url(#whiskers-shirtClip)">
    <rect x="40" y="150" width="120" height="15" fill="#FF6B6B"/>
    <rect x="40" y="180" width="120" height="15" fill="#FF6B6B"/>
    <rect x="40" y="210" width="120" height="15" fill="#FF6B6B"/>
  </g>
  <!-- ears -->
  <path d="M62 62 L58 26 Q84 40 92 58 Z" fill="#FFA94D" stroke="#4A2E24" stroke-width="6" stroke-linejoin="round"/>
  <path d="M138 62 L142 26 Q116 40 108 58 Z" fill="#FFA94D" stroke="#4A2E24" stroke-width="6" stroke-linejoin="round"/>
  <path d="M68 52 L66 36 Q78 44 82 54 Z" fill="#FF9EC4"/>
  <path d="M132 52 L134 36 Q122 44 118 54 Z" fill="#FF9EC4"/>
  <!-- head -->
  <ellipse cx="100" cy="92" rx="50" ry="46" fill="#FFA94D" stroke="#4A2E24" stroke-width="6"/>
  <!-- tabby stripes -->
  <path d="M100 50 L100 66" stroke="#E8843A" stroke-width="6" stroke-linecap="round"/>
  <path d="M84 52 L88 68" stroke="#E8843A" stroke-width="5" stroke-linecap="round"/>
  <path d="M116 52 L112 68" stroke="#E8843A" stroke-width="5" stroke-linecap="round"/>
  <path d="M52 92 L66 90" stroke="#E8843A" stroke-width="5" stroke-linecap="round"/>
  <path d="M148 92 L134 90" stroke="#E8843A" stroke-width="5" stroke-linecap="round"/>
  <!-- soft cheek shade -->
  <ellipse cx="100" cy="120" rx="40" ry="18" fill="#E8843A" opacity="0.35"/>
  <!-- eye patch pushed UP on forehead -->
  <path d="M64 60 Q100 44 138 62" fill="none" stroke="#4A2E24" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="122" cy="60" rx="15" ry="13" fill="#4A2E24"/>
  <ellipse cx="122" cy="59" rx="9" ry="7" fill="#3B2018"/>
  <!-- eyes -->
  <g class="eye">
    <ellipse cx="82" cy="94" rx="14" ry="16" fill="#FFF8EC" stroke="#4A2E24" stroke-width="6"/>
    <circle cx="84" cy="96" r="8" fill="#3E9D4C"/>
    <circle cx="84" cy="96" r="4" fill="#4A2E24"/>
    <circle cx="80" cy="91" r="3.5" fill="#FFF8EC"/>
    <circle cx="87" cy="100" r="1.6" fill="#FFF8EC"/>
  </g>
  <g class="eye">
    <ellipse cx="118" cy="94" rx="14" ry="16" fill="#FFF8EC" stroke="#4A2E24" stroke-width="6"/>
    <circle cx="118" cy="96" r="8" fill="#3E9D4C"/>
    <circle cx="118" cy="96" r="4" fill="#4A2E24"/>
    <circle cx="114" cy="91" r="3.5" fill="#FFF8EC"/>
    <circle cx="121" cy="100" r="1.6" fill="#FFF8EC"/>
  </g>
  <!-- nose -->
  <path d="M94 108 L106 108 L100 116 Z" fill="#FF6B6B" stroke="#4A2E24" stroke-width="4" stroke-linejoin="round"/>
  <!-- blush -->
  <ellipse cx="70" cy="112" rx="10" ry="7" fill="#FFB3A7" opacity="0.55"/>
  <ellipse cx="130" cy="112" rx="10" ry="7" fill="#FFB3A7" opacity="0.55"/>
  <!-- whiskers -->
  <path d="M52 108 L30 104" stroke="#4A2E24" stroke-width="3" stroke-linecap="round"/>
  <path d="M52 116 L30 118" stroke="#4A2E24" stroke-width="3" stroke-linecap="round"/>
  <path d="M148 108 L170 104" stroke="#4A2E24" stroke-width="3" stroke-linecap="round"/>
  <path d="M148 116 L170 118" stroke="#4A2E24" stroke-width="3" stroke-linecap="round"/>
  <!-- mouths -->
  <g class="mouth-normal">
    <path d="M100 116 Q100 124 92 126" fill="none" stroke="#4A2E24" stroke-width="4" stroke-linecap="round"/>
    <path d="M100 116 Q100 124 108 126" fill="none" stroke="#4A2E24" stroke-width="4" stroke-linecap="round"/>
  </g>
  <g class="mouth-happy" style="display:none">
    <path d="M84 116 Q100 138 116 116 Q100 126 84 116 Z" fill="#4A2E24" stroke="#4A2E24" stroke-width="4" stroke-linejoin="round"/>
    <path d="M90 124 Q100 132 110 124 Z" fill="#FF9EC4"/>
  </g>
  <!-- tricorn hat -->
  <path d="M52 44 Q60 16 100 18 Q140 16 148 44 Q100 34 52 44 Z" fill="#3B2E5A" stroke="#4A2E24" stroke-width="6" stroke-linejoin="round"/>
  <path d="M46 46 Q100 30 154 46 Q100 56 46 46 Z" fill="#2E2448" stroke="#4A2E24" stroke-width="6" stroke-linejoin="round"/>
  <path d="M92 30 L100 22 L108 30 L104 40 L96 40 Z" fill="#FFC93C" stroke="#4A2E24" stroke-width="3" stroke-linejoin="round"/>
  <!-- parrot-mouse on shoulder -->
  <ellipse cx="150" cy="142" rx="15" ry="17" fill="#FF6B6B" stroke="#4A2E24" stroke-width="5"/>
  <circle cx="152" cy="130" r="9" fill="#FF9EC4" stroke="#4A2E24" stroke-width="5"/>
  <circle cx="150" cy="129" r="2.5" fill="#4A2E24"/>
  <path d="M158 132 L166 134 L158 137 Z" fill="#FFC93C" stroke="#4A2E24" stroke-width="3" stroke-linejoin="round"/>
  <ellipse cx="144" cy="122" rx="5" ry="7" fill="#FF9EC4" stroke="#4A2E24" stroke-width="3"/>
</svg>`
};

/* =========================================================================
   Luna — little witch kid
   ========================================================================= */
window.GAME_ASSETS.characters.luna = {
  name: 'Luna',
  species: 'witch kid',
  accent: '#7C5CE0',
  voice: { rate: 0.95, pitch: 1.4 },
  greetings: ['Bippity boo, hello to you! ✨', 'A magic pizza spell for two!', 'Wiggle my spoon, a treat by noon!'],
  orderLines: ['Zippity zap, I wish for {ORDER}!', 'Stir the pot for {ORDER}, please!'],
  happyLines: ['Ta-da! That was magic yum!', 'Sparkle sparkle, so so good!', 'My spell worked, delicious!'],
  svg: `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="luna-robeClip"><path d="M54 150 Q54 134 74 132 L126 132 Q146 134 146 150 L156 232 L44 232 Z"/></clipPath>
  </defs>
  <!-- witch robe -->
  <path d="M54 150 Q54 134 74 132 L126 132 Q146 134 146 150 L156 232 L44 232 Z" fill="#7C5CE0" stroke="#4A2E24" stroke-width="6" stroke-linejoin="round"/>
  <g clip-path="url(#luna-robeClip)">
    <circle cx="70" cy="190" r="4" fill="#FFC93C"/>
    <circle cx="100" cy="210" r="4" fill="#FFC93C"/>
    <circle cx="130" cy="188" r="4" fill="#FFC93C"/>
    <circle cx="112" cy="222" r="4" fill="#FFC93C"/>
    <circle cx="82" cy="222" r="4" fill="#FFC93C"/>
  </g>
  <path d="M54 200 L146 200 L156 232 L44 232 Z" fill="#6A4CC7" opacity="0.5"/>
  <!-- raised arm holding spoon wand -->
  <path d="M138 140 L162 96" stroke="#7C5CE0" stroke-width="16" stroke-linecap="round"/>
  <path d="M138 140 L162 96" stroke="#4A2E24" stroke-width="5" fill="none" stroke-linecap="round" opacity="0"/>
  <circle cx="164" cy="92" r="9" fill="#A78BFA" stroke="#4A2E24" stroke-width="5"/>
  <rect x="160" y="40" width="8" height="52" rx="4" fill="#C98A4B" stroke="#4A2E24" stroke-width="5" transform="rotate(8 164 66)"/>
  <ellipse cx="166" cy="40" rx="11" ry="9" fill="#A96B33" stroke="#4A2E24" stroke-width="5" transform="rotate(8 166 40)"/>
  <!-- sparkle wisps -->
  <path d="M180 30 L182 40 L192 42 L182 44 L180 54 L178 44 L168 42 L178 40 Z" fill="#FFC93C"/>
  <circle cx="150" cy="30" r="3" fill="#FFC93C"/>
  <circle cx="186" cy="60" r="2.5" fill="#FFF8EC"/>
  <!-- left hand -->
  <circle cx="52" cy="150" r="12" fill="#FFDDBB" stroke="#4A2E24" stroke-width="6"/>
  <!-- dark bob hair back -->
  <ellipse cx="100" cy="96" rx="50" ry="48" fill="#4A2E24"/>
  <!-- face -->
  <ellipse cx="100" cy="100" rx="42" ry="40" fill="#FFDDBB" stroke="#4A2E24" stroke-width="6"/>
  <!-- bob bangs -->
  <path d="M60 92 Q64 58 100 56 Q136 58 140 92 Q120 74 100 74 Q80 74 60 92 Z" fill="#4A2E24"/>
  <path d="M58 96 Q52 120 60 140 Q66 128 64 100 Z" fill="#4A2E24"/>
  <path d="M142 96 Q148 120 140 140 Q134 128 136 100 Z" fill="#4A2E24"/>
  <!-- eyes -->
  <g class="eye">
    <ellipse cx="84" cy="100" rx="13" ry="15" fill="#FFF8EC" stroke="#4A2E24" stroke-width="6"/>
    <circle cx="85" cy="102" r="8" fill="#7C5CE0"/>
    <circle cx="85" cy="102" r="4" fill="#4A2E24"/>
    <circle cx="81" cy="97" r="3.5" fill="#FFF8EC"/>
    <circle cx="88" cy="106" r="1.6" fill="#FFF8EC"/>
  </g>
  <g class="eye">
    <ellipse cx="116" cy="100" rx="13" ry="15" fill="#FFF8EC" stroke="#4A2E24" stroke-width="6"/>
    <circle cx="115" cy="102" r="8" fill="#7C5CE0"/>
    <circle cx="115" cy="102" r="4" fill="#4A2E24"/>
    <circle cx="111" cy="97" r="3.5" fill="#FFF8EC"/>
    <circle cx="118" cy="106" r="1.6" fill="#FFF8EC"/>
  </g>
  <!-- nose -->
  <path d="M98 110 Q100 114 102 110" fill="none" stroke="#4A2E24" stroke-width="3" stroke-linecap="round"/>
  <!-- blush -->
  <ellipse cx="72" cy="115" rx="10" ry="7" fill="#FFB3A7" opacity="0.55"/>
  <ellipse cx="128" cy="115" rx="10" ry="7" fill="#FFB3A7" opacity="0.55"/>
  <!-- mouths -->
  <g class="mouth-normal">
    <path d="M88 120 Q100 130 112 120" fill="none" stroke="#4A2E24" stroke-width="4" stroke-linecap="round"/>
  </g>
  <g class="mouth-happy" style="display:none">
    <path d="M86 118 Q100 140 114 118 Q100 126 86 118 Z" fill="#4A2E24" stroke="#4A2E24" stroke-width="4" stroke-linejoin="round"/>
    <path d="M92 126 Q100 134 108 126 Z" fill="#FF9EC4"/>
  </g>
  <!-- floppy witch hat -->
  <path d="M46 66 Q100 74 154 66 Q160 66 158 74 Q100 92 42 74 Q40 66 46 66 Z" fill="#7C5CE0" stroke="#4A2E24" stroke-width="6" stroke-linejoin="round"/>
  <path d="M62 66 Q78 12 118 18 Q140 22 132 52 Q120 34 100 62 Q84 60 62 66 Z" fill="#7C5CE0" stroke="#4A2E24" stroke-width="6" stroke-linejoin="round"/>
  <path d="M62 66 Q78 12 100 16 Q90 40 84 62 Q74 62 62 66 Z" fill="#6A4CC7"/>
  <rect x="60" y="58" width="76" height="12" rx="6" fill="#A78BFA" stroke="#4A2E24" stroke-width="5" transform="rotate(-3 98 64)"/>
  <path d="M112 26 L116 38 L128 40 L116 42 L112 54 L108 42 L96 40 L108 38 Z" fill="#FFC93C" stroke="#4A2E24" stroke-width="3" stroke-linejoin="round"/>
</svg>`
};

/* =========================================================================
   Rex — tiny mint-and-cream T-rex kid
   ========================================================================= */
window.GAME_ASSETS.characters.rex = {
  name: 'Rex',
  species: 'baby dinosaur',
  accent: '#5FBF63',
  voice: { rate: 1.0, pitch: 1.3 },
  greetings: ['RAWR! That means hi! 🦖', 'Stomp stomp, hello friend!', 'I am a hungry little dino!'],
  orderLines: ['RAWR! I want {ORDER}, please!', 'Gimme {ORDER}, roar roar!'],
  happyLines: ['RAWR means yummy tummy!', 'Best dino snack ever!', 'Stomp stomp, so good!'],
  svg: `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
  <!-- back spikes alternating -->
  <path d="M60 96 L48 74 L72 88 Z" fill="#FF6B6B" stroke="#4A2E24" stroke-width="5" stroke-linejoin="round"/>
  <path d="M74 78 L66 52 L90 72 Z" fill="#FFC93C" stroke="#4A2E24" stroke-width="5" stroke-linejoin="round"/>
  <path d="M140 96 L152 74 L128 88 Z" fill="#FF6B6B" stroke="#4A2E24" stroke-width="5" stroke-linejoin="round"/>
  <path d="M126 78 L134 52 L110 72 Z" fill="#FFC93C" stroke="#4A2E24" stroke-width="5" stroke-linejoin="round"/>
  <!-- red backpack peeking -->
  <rect x="30" y="150" width="30" height="46" rx="12" fill="#FF6B6B" stroke="#4A2E24" stroke-width="6"/>
  <rect x="36" y="162" width="18" height="14" rx="6" fill="#E8503A"/>
  <!-- round body -->
  <ellipse cx="100" cy="176" rx="58" ry="56" fill="#8FE0B0" stroke="#4A2E24" stroke-width="6"/>
  <ellipse cx="100" cy="188" rx="38" ry="40" fill="#FFF8EC"/>
  <ellipse cx="100" cy="212" rx="58" ry="24" fill="#6FCF97" opacity="0.4"/>
  <!-- teeny arms -->
  <path d="M64 168 Q52 174 56 184" fill="none" stroke="#8FE0B0" stroke-width="12" stroke-linecap="round"/>
  <path d="M64 168 Q52 174 56 184" fill="none" stroke="#4A2E24" stroke-width="5" stroke-linecap="round" opacity="0"/>
  <circle cx="56" cy="186" r="7" fill="#8FE0B0" stroke="#4A2E24" stroke-width="5"/>
  <path d="M136 168 Q148 174 144 184" fill="none" stroke="#8FE0B0" stroke-width="12" stroke-linecap="round"/>
  <circle cx="144" cy="186" r="7" fill="#8FE0B0" stroke="#4A2E24" stroke-width="5"/>
  <!-- backpack straps -->
  <path d="M78 132 L64 158" stroke="#E8503A" stroke-width="9" stroke-linecap="round"/>
  <path d="M122 132 L136 158" stroke="#E8503A" stroke-width="9" stroke-linecap="round"/>
  <!-- head -->
  <ellipse cx="100" cy="92" rx="52" ry="48" fill="#8FE0B0" stroke="#4A2E24" stroke-width="6"/>
  <!-- big happy snout -->
  <ellipse cx="100" cy="112" rx="34" ry="26" fill="#8FE0B0" stroke="#4A2E24" stroke-width="6"/>
  <ellipse cx="100" cy="118" rx="24" ry="15" fill="#6FCF97" opacity="0.5"/>
  <ellipse cx="88" cy="106" rx="3" ry="4" fill="#4A2E24"/>
  <ellipse cx="112" cy="106" rx="3" ry="4" fill="#4A2E24"/>
  <!-- eyes -->
  <g class="eye">
    <ellipse cx="80" cy="80" rx="15" ry="17" fill="#FFF8EC" stroke="#4A2E24" stroke-width="6"/>
    <circle cx="82" cy="82" r="8" fill="#4A2E24"/>
    <circle cx="78" cy="77" r="3.5" fill="#FFF8EC"/>
    <circle cx="85" cy="86" r="1.6" fill="#FFF8EC"/>
  </g>
  <g class="eye">
    <ellipse cx="120" cy="80" rx="15" ry="17" fill="#FFF8EC" stroke="#4A2E24" stroke-width="6"/>
    <circle cx="118" cy="82" r="8" fill="#4A2E24"/>
    <circle cx="114" cy="77" r="3.5" fill="#FFF8EC"/>
    <circle cx="121" cy="86" r="1.6" fill="#FFF8EC"/>
  </g>
  <!-- blush -->
  <ellipse cx="66" cy="104" rx="10" ry="7" fill="#FFB3A7" opacity="0.55"/>
  <ellipse cx="134" cy="104" rx="10" ry="7" fill="#FFB3A7" opacity="0.55"/>
  <!-- mouths -->
  <g class="mouth-normal">
    <path d="M84 122 Q100 132 116 122" fill="none" stroke="#4A2E24" stroke-width="4" stroke-linecap="round"/>
  </g>
  <g class="mouth-happy" style="display:none">
    <path d="M80 120 Q100 142 120 120 Q100 128 80 120 Z" fill="#4A2E24" stroke="#4A2E24" stroke-width="4" stroke-linejoin="round"/>
    <path d="M88 128 Q100 136 112 128 Z" fill="#FF9EC4"/>
    <path d="M84 121 L88 116 L92 121 Z" fill="#FFF8EC"/>
    <path d="M108 121 L112 116 L116 121 Z" fill="#FFF8EC"/>
  </g>
</svg>`
};

/* =========================================================================
   Gran Penny — sweetest grandma
   ========================================================================= */
window.GAME_ASSETS.characters.penny = {
  name: 'Gran Penny',
  species: 'grandma',
  accent: '#FFA94D',
  voice: { rate: 0.85, pitch: 1.1 },
  greetings: ['Hello there, dearie! 💛', 'Come in, come in, sweet pea!', 'Grandma missed you, dearie!'],
  orderLines: ['Fetch me {ORDER}, would you dearie?', 'I would love some {ORDER}, dearie!'],
  happyLines: ['Oh my, delicious dearie!', 'Just like I used to make!', 'Warms my heart, thank you!'],
  svg: `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
  <!-- polka-dot shawl body -->
  <path d="M40 232 Q42 150 100 140 Q158 150 160 232 Z" fill="#FFA94D" stroke="#4A2E24" stroke-width="6" stroke-linejoin="round"/>
  <path d="M40 232 Q42 150 100 140 Q158 150 160 232" fill="none"/>
  <ellipse cx="72" cy="176" rx="5" ry="5" fill="#FFF8EC"/>
  <ellipse cx="104" cy="166" rx="5" ry="5" fill="#FFF8EC"/>
  <ellipse cx="132" cy="184" rx="5" ry="5" fill="#FFF8EC"/>
  <ellipse cx="88" cy="200" rx="5" ry="5" fill="#FFF8EC"/>
  <ellipse cx="118" cy="206" rx="5" ry="5" fill="#FFF8EC"/>
  <ellipse cx="60" cy="208" rx="5" ry="5" fill="#FFF8EC"/>
  <ellipse cx="140" cy="212" rx="5" ry="5" fill="#FFF8EC"/>
  <path d="M100 140 Q60 152 52 200 L148 200 Q140 152 100 140 Z" fill="#F59530" opacity="0.35"/>
  <!-- collar -->
  <path d="M84 146 Q100 158 116 146 L110 138 Q100 146 90 138 Z" fill="#FFF8EC" stroke="#4A2E24" stroke-width="5" stroke-linejoin="round"/>
  <!-- yarn ball in hand -->
  <circle cx="146" cy="182" r="17" fill="#FF9EC4" stroke="#4A2E24" stroke-width="6"/>
  <path d="M134 176 Q146 182 158 176" fill="none" stroke="#E86FA0" stroke-width="3"/>
  <path d="M133 184 Q146 188 159 184" fill="none" stroke="#E86FA0" stroke-width="3"/>
  <path d="M140 170 Q144 182 142 194" fill="none" stroke="#E86FA0" stroke-width="3"/>
  <path d="M152 170 Q148 182 150 194" fill="none" stroke="#E86FA0" stroke-width="3"/>
  <path d="M129 182 Q118 186 112 178" fill="none" stroke="#FF9EC4" stroke-width="4" stroke-linecap="round"/>
  <!-- hand -->
  <circle cx="122" cy="176" r="12" fill="#FFDDBB" stroke="#4A2E24" stroke-width="6"/>
  <!-- silver bun -->
  <circle cx="100" cy="42" r="20" fill="#DADAE4" stroke="#4A2E24" stroke-width="6"/>
  <path d="M92 34 Q100 42 108 34" fill="none" stroke="#B9B9C6" stroke-width="3"/>
  <path d="M90 46 Q100 52 110 46" fill="none" stroke="#B9B9C6" stroke-width="3"/>
  <!-- silver hair -->
  <path d="M56 96 Q52 52 100 50 Q148 52 144 96 Q120 74 100 74 Q80 74 56 96 Z" fill="#DADAE4" stroke="#4A2E24" stroke-width="6" stroke-linejoin="round"/>
  <!-- face -->
  <ellipse cx="100" cy="98" rx="44" ry="42" fill="#FFDDBB" stroke="#4A2E24" stroke-width="6"/>
  <!-- huge round glasses -->
  <circle cx="78" cy="98" r="22" fill="#FFF8EC" stroke="#4A2E24" stroke-width="6" opacity="0.35"/>
  <circle cx="122" cy="98" r="22" fill="#FFF8EC" stroke="#4A2E24" stroke-width="6" opacity="0.35"/>
  <circle cx="78" cy="98" r="22" fill="none" stroke="#4A2E24" stroke-width="6"/>
  <circle cx="122" cy="98" r="22" fill="none" stroke="#4A2E24" stroke-width="6"/>
  <path d="M100 96 L100 96" stroke="#4A2E24" stroke-width="6"/>
  <path d="M97 96 Q100 92 103 96" fill="none" stroke="#4A2E24" stroke-width="5" stroke-linecap="round"/>
  <!-- enormous eyes behind glasses -->
  <g class="eye">
    <ellipse cx="78" cy="98" rx="15" ry="17" fill="#FFF8EC" stroke="#4A2E24" stroke-width="5"/>
    <circle cx="79" cy="100" r="8" fill="#7ED6DF"/>
    <circle cx="79" cy="100" r="4" fill="#4A2E24"/>
    <circle cx="75" cy="95" r="3.5" fill="#FFF8EC"/>
    <circle cx="82" cy="104" r="1.6" fill="#FFF8EC"/>
  </g>
  <g class="eye">
    <ellipse cx="122" cy="98" rx="15" ry="17" fill="#FFF8EC" stroke="#4A2E24" stroke-width="5"/>
    <circle cx="121" cy="100" r="8" fill="#7ED6DF"/>
    <circle cx="121" cy="100" r="4" fill="#4A2E24"/>
    <circle cx="117" cy="95" r="3.5" fill="#FFF8EC"/>
    <circle cx="124" cy="104" r="1.6" fill="#FFF8EC"/>
  </g>
  <!-- nose -->
  <path d="M98 116 Q100 120 102 116" fill="none" stroke="#4A2E24" stroke-width="3" stroke-linecap="round"/>
  <!-- blush -->
  <ellipse cx="66" cy="122" rx="11" ry="8" fill="#FFB3A7" opacity="0.6"/>
  <ellipse cx="134" cy="122" rx="11" ry="8" fill="#FFB3A7" opacity="0.6"/>
  <!-- mouths -->
  <g class="mouth-normal">
    <path d="M88 126 Q100 136 112 126" fill="none" stroke="#4A2E24" stroke-width="4" stroke-linecap="round"/>
  </g>
  <g class="mouth-happy" style="display:none">
    <path d="M88 124 Q100 144 112 124 Q100 132 88 124 Z" fill="#4A2E24" stroke="#4A2E24" stroke-width="4" stroke-linejoin="round"/>
    <path d="M94 132 Q100 138 106 132 Z" fill="#FF9EC4"/>
  </g>
</svg>`
};

/* =========================================================================
   Gus — lavender-blue octopus food critic
   ========================================================================= */
window.GAME_ASSETS.characters.gus = {
  name: 'Gus',
  species: 'octopus food critic',
  accent: '#74B9FF',
  voice: { rate: 0.9, pitch: 0.85 },
  greetings: ['Bonjour! I am here to taste. 🎩', 'Ah, a fine pizza place!', 'Show me your best dish!'],
  orderLines: ['I shall review your {ORDER}.', 'Bring me {ORDER}, if you please!'],
  happyLines: ['Magnifique! Five big stars!', 'Ooh la la, superb!', 'Bravo! A masterpiece!'],
  svg: `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
  <!-- curly tentacles resting on counter -->
  <path d="M62 168 Q40 196 52 216 Q62 230 74 220" fill="none" stroke="#9DB4F5" stroke-width="16" stroke-linecap="round"/>
  <path d="M62 168 Q40 196 52 216 Q62 230 74 220" fill="none" stroke="#4A2E24" stroke-width="5" stroke-linecap="round" opacity="0"/>
  <path d="M138 168 Q160 196 148 216 Q138 230 126 220" fill="none" stroke="#9DB4F5" stroke-width="16" stroke-linecap="round"/>
  <path d="M82 190 Q70 220 84 228 Q96 232 100 222" fill="none" stroke="#8AA3EE" stroke-width="15" stroke-linecap="round"/>
  <path d="M118 190 Q130 220 116 228 Q104 232 100 222" fill="none" stroke="#8AA3EE" stroke-width="15" stroke-linecap="round"/>
  <!-- outline pass for front tentacles -->
  <path d="M82 190 Q70 220 84 228" fill="none" stroke="#7A93E0" stroke-width="4" stroke-linecap="round" opacity="0.4"/>
  <!-- suckers -->
  <circle cx="56" cy="212" r="3" fill="#FFF8EC"/>
  <circle cx="66" cy="220" r="3" fill="#FFF8EC"/>
  <circle cx="144" cy="212" r="3" fill="#FFF8EC"/>
  <circle cx="134" cy="220" r="3" fill="#FFF8EC"/>
  <!-- head/mantle -->
  <path d="M50 118 Q46 54 100 50 Q154 54 150 118 Q150 152 100 156 Q50 152 50 118 Z" fill="#9DB4F5" stroke="#4A2E24" stroke-width="6" stroke-linejoin="round"/>
  <ellipse cx="100" cy="140" rx="46" ry="20" fill="#8AA3EE" opacity="0.5"/>
  <ellipse cx="82" cy="80" rx="18" ry="14" fill="#B4C6FA" opacity="0.6"/>
  <!-- chef neckerchief -->
  <path d="M66 150 Q100 168 134 150 L128 140 Q100 152 72 140 Z" fill="#FF6B6B" stroke="#4A2E24" stroke-width="5" stroke-linejoin="round"/>
  <path d="M96 154 L88 174 L100 166 L112 174 L104 154 Z" fill="#FF6B6B" stroke="#4A2E24" stroke-width="5" stroke-linejoin="round"/>
  <!-- eyes -->
  <g class="eye">
    <ellipse cx="80" cy="96" rx="15" ry="18" fill="#FFF8EC" stroke="#4A2E24" stroke-width="6"/>
    <circle cx="82" cy="98" r="8" fill="#74B9FF"/>
    <circle cx="82" cy="98" r="4" fill="#4A2E24"/>
    <circle cx="78" cy="93" r="3.5" fill="#FFF8EC"/>
    <circle cx="85" cy="102" r="1.6" fill="#FFF8EC"/>
  </g>
  <g class="eye">
    <ellipse cx="120" cy="96" rx="15" ry="18" fill="#FFF8EC" stroke="#4A2E24" stroke-width="6"/>
    <circle cx="118" cy="98" r="8" fill="#74B9FF"/>
    <circle cx="118" cy="98" r="4" fill="#4A2E24"/>
    <circle cx="114" cy="93" r="3.5" fill="#FFF8EC"/>
    <circle cx="121" cy="102" r="1.6" fill="#FFF8EC"/>
  </g>
  <!-- monocle over right eye -->
  <circle cx="120" cy="96" r="20" fill="none" stroke="#FFC93C" stroke-width="4"/>
  <path d="M120 116 L124 134" stroke="#FFC93C" stroke-width="3" stroke-linecap="round"/>
  <!-- blush -->
  <ellipse cx="64" cy="112" rx="10" ry="7" fill="#FFB3A7" opacity="0.55"/>
  <ellipse cx="138" cy="112" rx="10" ry="7" fill="#FFB3A7" opacity="0.55"/>
  <!-- mouths -->
  <g class="mouth-normal">
    <path d="M88 120 Q100 128 112 120" fill="none" stroke="#4A2E24" stroke-width="4" stroke-linecap="round"/>
  </g>
  <g class="mouth-happy" style="display:none">
    <path d="M86 118 Q100 138 114 118 Q100 126 86 118 Z" fill="#4A2E24" stroke="#4A2E24" stroke-width="4" stroke-linejoin="round"/>
    <path d="M92 126 Q100 132 108 126 Z" fill="#FF9EC4"/>
  </g>
  <!-- tentacle holding a tiny fork -->
  <circle cx="52" cy="216" r="8" fill="#9DB4F5" stroke="#4A2E24" stroke-width="5"/>
  <rect x="42" y="182" width="5" height="28" rx="2" fill="#DADAE4" stroke="#4A2E24" stroke-width="3" transform="rotate(-10 44 196)"/>
  <path d="M38 178 L38 190 M43 177 L44 189 M48 178 L49 190" stroke="#DADAE4" stroke-width="3" stroke-linecap="round" transform="rotate(-10 44 184)"/>
  <!-- tentacle holding a notepad -->
  <rect x="128" y="176" width="30" height="36" rx="4" fill="#FFF8EC" stroke="#4A2E24" stroke-width="5"/>
  <path d="M134 186 L152 186 M134 194 L152 194 M134 202 L146 202" stroke="#74B9FF" stroke-width="3" stroke-linecap="round"/>
  <circle cx="148" cy="216" r="8" fill="#9DB4F5" stroke="#4A2E24" stroke-width="5"/>
</svg>`
};
