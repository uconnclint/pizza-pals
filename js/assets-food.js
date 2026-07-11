window.GAME_ASSETS = window.GAME_ASSETS || {};
window.GAME_ASSETS.food = {
  doughBall: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="150" cy="220" rx="92" ry="20" fill="#4A2E24" opacity="0.12"/>
    <path d="M60 168 C60 118 100 92 150 92 C200 92 240 118 240 168 C240 208 205 228 150 228 C95 228 60 208 60 168 Z" fill="#F7E3B8" stroke="#4A2E24" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M64 182 C74 214 108 228 150 228 C192 228 226 214 236 182 C232 205 200 224 150 224 C100 224 68 205 64 182 Z" fill="#E7CE9A" opacity="0.9"/>
    <ellipse cx="118" cy="130" rx="34" ry="20" fill="#FFF3D8" opacity="0.75"/>
    <circle cx="108" cy="160" r="3.4" fill="#FFF8EC"/>
    <circle cx="150" cy="150" r="2.6" fill="#FFF8EC"/>
    <circle cx="182" cy="168" r="3" fill="#FFF8EC"/>
    <circle cx="132" cy="182" r="2.4" fill="#FFF8EC"/>
    <circle cx="168" cy="140" r="2.2" fill="#FFF8EC"/>
    <circle cx="196" cy="150" r="2.6" fill="#FFF8EC"/>
    <circle cx="96" cy="140" r="2.4" fill="#FFF8EC"/>
  </svg>`,
  crust: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
    <path d="M150 32 C210 30 268 82 270 148 C272 214 214 270 150 270 C86 270 30 216 30 150 C30 84 88 34 150 32 Z" fill="#F2B84B" stroke="#4A2E24" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M46 168 C64 226 108 262 150 262 C214 262 264 214 268 156 C258 214 210 252 150 252 C96 252 58 218 46 168 Z" fill="#D89A32" opacity="0.9"/>
    <path d="M150 52 C202 50 250 92 250 150 C250 208 204 250 150 250 C96 250 50 208 50 150 C50 92 100 54 150 52 Z" fill="#F7E3B8" stroke="#4A2E24" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="118" cy="118" r="2.4" fill="#E7CE9A"/>
    <circle cx="176" cy="132" r="2.2" fill="#E7CE9A"/>
    <circle cx="140" cy="188" r="2.6" fill="#E7CE9A"/>
    <circle cx="190" cy="180" r="2" fill="#E7CE9A"/>
    <circle cx="102" cy="168" r="2.2" fill="#E7CE9A"/>
  </svg>`,
  sauceLayer: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
    <path d="M150 46 C186 44 210 60 226 86 C244 100 256 124 252 152 C258 188 236 214 206 228 C186 250 156 258 128 250 C96 254 68 236 56 208 C40 190 40 160 52 136 C50 104 76 76 108 66 C122 50 132 48 150 46 Z" fill="#E8503A" stroke="#B83320" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <ellipse cx="118" cy="112" rx="30" ry="22" fill="#F26D5B"/>
    <ellipse cx="182" cy="138" rx="26" ry="20" fill="#F26D5B"/>
    <ellipse cx="140" cy="186" rx="28" ry="20" fill="#F26D5B"/>
    <ellipse cx="196" cy="192" rx="18" ry="14" fill="#F26D5B"/>
    <ellipse cx="90" cy="168" rx="18" ry="14" fill="#F26D5B"/>
    <ellipse cx="128" cy="150" rx="12" ry="9" fill="#F58A7B" opacity="0.8"/>
  </svg>`,
  cheeseLayer: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
    <path d="M150 52 C176 50 192 66 214 70 C240 78 252 104 246 130 C258 152 250 180 228 194 C222 220 196 234 170 228 C148 246 118 246 98 230 C72 234 50 214 52 188 C38 170 42 142 60 128 C58 102 78 80 104 76 C120 58 130 54 150 52 Z" fill="#FFD855" stroke="#4A2E24" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M60 128 C56 148 60 176 74 196 C58 190 46 172 52 152 C54 140 56 132 60 128 Z" fill="#F5B93E"/>
    <path d="M228 194 C240 178 246 152 240 132 C252 150 250 178 234 194 C232 196 230 195 228 194 Z" fill="#F5B93E"/>
    <path d="M98 230 C112 240 138 244 158 236 C150 246 124 248 106 238 C102 236 100 233 98 230 Z" fill="#F5B93E"/>
    <ellipse cx="120" cy="108" rx="22" ry="14" fill="#FFE79A" opacity="0.75"/>
    <ellipse cx="186" cy="150" rx="14" ry="9" fill="#FFE79A" opacity="0.7"/>
  </svg>`,
  bakedSpots: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="110" cy="98" rx="16" ry="11" fill="#D98E2B" opacity="0.55"/>
    <ellipse cx="176" cy="90" rx="12" ry="9" fill="#D98E2B" opacity="0.55"/>
    <ellipse cx="208" cy="132" rx="14" ry="10" fill="#D98E2B" opacity="0.55"/>
    <ellipse cx="92" cy="150" rx="13" ry="10" fill="#D98E2B" opacity="0.55"/>
    <ellipse cx="150" cy="140" rx="11" ry="8" fill="#D98E2B" opacity="0.5"/>
    <ellipse cx="200" cy="186" rx="14" ry="10" fill="#D98E2B" opacity="0.55"/>
    <ellipse cx="118" cy="200" rx="15" ry="11" fill="#D98E2B" opacity="0.55"/>
    <ellipse cx="164" cy="204" rx="12" ry="9" fill="#D98E2B" opacity="0.5"/>
    <ellipse cx="150" cy="176" rx="10" ry="7" fill="#D98E2B" opacity="0.5"/>
    <ellipse cx="88" cy="118" rx="9" ry="7" fill="#D98E2B" opacity="0.5"/>
    <circle cx="128" cy="120" r="3" fill="#9E5E1A" opacity="0.6"/>
    <circle cx="188" cy="160" r="2.6" fill="#9E5E1A" opacity="0.6"/>
    <circle cx="104" cy="176" r="2.4" fill="#9E5E1A" opacity="0.6"/>
    <circle cx="170" cy="130" r="2.2" fill="#9E5E1A" opacity="0.55"/>
    <circle cx="146" cy="210" r="2.4" fill="#9E5E1A" opacity="0.55"/>
  </svg>`,
  tray: `<svg viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="170" cy="182" rx="150" ry="146" fill="#4A2E24" opacity="0.12"/>
    <circle cx="170" cy="170" r="150" fill="#A96B33" stroke="#4A2E24" stroke-width="6" stroke-linejoin="round"/>
    <circle cx="170" cy="170" r="128" fill="#C98A4B" stroke="#4A2E24" stroke-width="5"/>
    <path d="M100 116 C140 104 210 104 250 118" fill="none" stroke="#A96B33" stroke-width="5" stroke-linecap="round" opacity="0.7"/>
    <path d="M78 170 C130 158 214 158 262 170" fill="none" stroke="#A96B33" stroke-width="5" stroke-linecap="round" opacity="0.7"/>
    <path d="M92 220 C140 234 206 234 250 222" fill="none" stroke="#A96B33" stroke-width="5" stroke-linecap="round" opacity="0.7"/>
    <path d="M120 260 C150 268 196 268 224 260" fill="none" stroke="#A96B33" stroke-width="4" stroke-linecap="round" opacity="0.6"/>
    <path d="M62 140 C80 116 110 96 150 86 C118 100 96 122 84 148 C76 146 68 143 62 140 Z" fill="#D8A468" opacity="0.7"/>
  </svg>`,
  ladle: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <rect x="58" y="8" width="18" height="70" rx="9" transform="rotate(38 67 43)" fill="#FF6B6B" stroke="#4A2E24" stroke-width="5" stroke-linejoin="round"/>
    <ellipse cx="82" cy="22" rx="9" ry="7" transform="rotate(38 82 22)" fill="#FF8C8C"/>
    <path d="M36 66 C36 88 54 104 72 104 C90 104 106 90 106 68 C106 64 102 62 96 62 L46 62 C40 62 36 62 36 66 Z" fill="#C74A38" stroke="#4A2E24" stroke-width="6" stroke-linejoin="round"/>
    <ellipse cx="71" cy="66" rx="34" ry="12" fill="#E8503A" stroke="#4A2E24" stroke-width="5"/>
    <ellipse cx="60" cy="63" rx="12" ry="4.5" fill="#F26D5B"/>
    <ellipse cx="84" cy="66" rx="7" ry="3" fill="#F26D5B"/>
    <ellipse cx="52" cy="88" rx="8" ry="6" fill="#B83320" opacity="0.8"/>
  </svg>`,
  shaker: `<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="128" rx="34" ry="8" fill="#4A2E24" opacity="0.12"/>
    <path d="M32 58 L30 112 C30 122 42 128 60 128 C78 128 90 122 90 112 L88 58 Z" fill="#DFF3F6" stroke="#4A2E24" stroke-width="6" stroke-linejoin="round" transform="rotate(-6 60 92)"/>
    <path d="M35 74 L34 112 C34 120 44 124 60 124 C64 124 68 123 72 122 L70 74 Z" fill="#FFD855" stroke="#4A2E24" stroke-width="4" stroke-linejoin="round" transform="rotate(-6 60 98)"/>
    <circle cx="48" cy="96" r="3" fill="#F5B93E"/>
    <circle cx="62" cy="106" r="2.6" fill="#F5B93E"/>
    <circle cx="52" cy="112" r="2.4" fill="#F5B93E"/>
    <path d="M30 56 L90 56 L88 40 C88 34 80 30 60 30 C40 30 32 34 32 40 Z" fill="#C9D2D6" stroke="#4A2E24" stroke-width="6" stroke-linejoin="round" transform="rotate(-6 60 44)"/>
    <circle cx="48" cy="42" r="2.6" fill="#4A2E24" transform="rotate(-6 60 44)"/>
    <circle cx="60" cy="40" r="2.6" fill="#4A2E24" transform="rotate(-6 60 44)"/>
    <circle cx="72" cy="42" r="2.6" fill="#4A2E24" transform="rotate(-6 60 44)"/>
    <path d="M38 64 L40 108" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.6" transform="rotate(-6 60 86)"/>
  </svg>`,
  sparkle: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="12" fill="#FFC93C" opacity="0.25"/>
    <path d="M20 3 C22 14 26 18 37 20 C26 22 22 26 20 37 C18 26 14 22 3 20 C14 18 18 14 20 3 Z" fill="#FFC93C"/>
    <path d="M20 11 C21 17 23 19 29 20 C23 21 21 23 20 29 C19 23 17 21 11 20 C17 19 19 17 20 11 Z" fill="#FFE79A"/>
  </svg>`,
  heart: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 35 C6 25 3 16 6 10 C9 4 17 4 20 11 C23 4 31 4 34 10 C37 16 34 25 20 35 Z" fill="#FF6B6B" stroke="#4A2E24" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M20 32 C10 25 6 18 8 13 C7 20 12 26 20 32 Z" fill="#E85555" opacity="0.7"/>
    <ellipse cx="14" cy="14" rx="4" ry="3" fill="#FFB3A7"/>
  </svg>`,
  star: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 5 C32 5 33 6 34 8 L40 21 L54 23 C58 23.6 59.5 27 57 30 L47 40 L49.5 54 C50 58 47 60 43.5 58 L30 51 L16.5 58 C13 60 10 58 10.5 54 L13 40 L3 30 C0.5 27 2 23.6 6 23 L20 21 L26 8 C27 6 28 5 30 5 Z" fill="#FFC93C" stroke="#4A2E24" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M30 44 L18.5 50 L20.5 40 L13 33 L23 31 L30 44 Z" fill="#F0AF28" opacity="0.65"/>
    <ellipse cx="26" cy="20" rx="5" ry="3.5" fill="#FFE79A"/>
  </svg>`,
  coin: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25" cy="26" r="21" fill="#E0A61E" opacity="0.35"/>
    <circle cx="25" cy="24" r="21" fill="#FFC93C" stroke="#4A2E24" stroke-width="4"/>
    <circle cx="25" cy="24" r="15" fill="#FFD855" stroke="#4A2E24" stroke-width="2.5"/>
    <path d="M25 15 L34 30 C31 32 27 33 25 33 C23 33 19 32 16 30 Z" fill="#E8503A" stroke="#4A2E24" stroke-width="2" stroke-linejoin="round"/>
    <path d="M25 15 L34 30 C33 30.6 32 31.2 31 31.6 L25 15 Z" fill="#F2B84B" opacity="0.8"/>
    <circle cx="22" cy="24" r="1.6" fill="#B83320"/>
    <circle cx="28" cy="27" r="1.4" fill="#B83320"/>
    <path d="M14 16 C17 12 22 10 26 10" fill="none" stroke="#FFE79A" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
  </svg>`,
  toppings: {
    pepperoni: { name: 'pepperoni', emoji: '🍕', svg: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="31" r="23" fill="#D6412F" opacity="0.35"/>
      <circle cx="30" cy="30" r="23" fill="#E8503A" stroke="#4A2E24" stroke-width="5"/>
      <path d="M9 34 C13 46 20 52 30 52 C42 52 51 44 53 32 C50 44 41 50 30 50 C20 50 12 44 9 34 Z" fill="#C74A38"/>
      <circle cx="21" cy="24" r="3" fill="#B83320"/>
      <circle cx="38" cy="22" r="2.6" fill="#B83320"/>
      <circle cx="40" cy="36" r="3.2" fill="#B83320"/>
      <circle cx="24" cy="40" r="2.8" fill="#B83320"/>
      <circle cx="31" cy="32" r="2.4" fill="#B83320"/>
      <ellipse cx="23" cy="20" rx="6" ry="4" fill="#F26D5B" opacity="0.8"/>
    </svg>` },
    mushroom:  { name: 'mushrooms', emoji: '🍄', svg: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 30 C12 16 22 8 34 8 C46 8 52 18 50 28 C50 34 46 38 42 38 L40 52 C40 55 37 56 34 56 L30 56 C27 56 25 55 25 52 L24 40 C18 40 12 38 12 30 Z" fill="#FFF3E0" stroke="#4A2E24" stroke-width="5" stroke-linejoin="round"/>
      <path d="M13 28 C13 16 23 9 34 9 C45 9 51 17 49 27 C46 20 40 15 32 15 C22 15 15 20 13 28 Z" fill="#B5793F"/>
      <path d="M24 40 L25 52 C25 55 27 56 30 56 L34 56 C34 46 33 40 33 40 Z" fill="#E9D3B0"/>
      <ellipse cx="24" cy="20" rx="5" ry="3.5" fill="#FFFBF2" opacity="0.85"/>
      <ellipse cx="30" cy="47" rx="2.6" ry="4" fill="#D9BE94"/>
    </svg>` },
    olive:     { name: 'olives', emoji: '🫒', svg: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="21" fill="#3D3450" stroke="#4A2E24" stroke-width="5"/>
      <circle cx="30" cy="30" r="9" fill="#6B5C7A" stroke="#4A2E24" stroke-width="4"/>
      <path d="M12 34 C15 44 22 49 30 49 C40 49 48 42 49 32 C46 42 39 47 30 47 C21 47 14 42 12 34 Z" fill="#2A2438"/>
      <ellipse cx="22" cy="20" rx="5" ry="3" fill="#8A7BA0" opacity="0.8"/>
      <circle cx="41" cy="23" r="2" fill="#8A7BA0" opacity="0.7"/>
    </svg>` },
    pepper:    { name: 'peppers', emoji: '🫑', svg: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 8 C44 8 52 18 52 32 C52 46 43 53 34 53 C41 50 45 42 45 33 C45 24 40 18 30 18 C20 18 15 24 15 33 C15 42 19 50 26 53 C17 53 8 46 8 32 C8 18 16 8 30 8 Z" fill="#5FBF63" stroke="#4A2E24" stroke-width="5" stroke-linejoin="round"/>
      <path d="M8 32 C8 40 12 47 18 51 C11 46 8 38 9 30 C8 30 8 31 8 32 Z" fill="#3E9D4C"/>
      <path d="M45 33 C45 42 41 50 34 53 C40 50 44 43 44 34 C44 33 45 33 45 33 Z" fill="#3E9D4C"/>
      <path d="M20 14 C25 11 32 11 38 14" fill="none" stroke="#C7F0C9" stroke-width="3.5" stroke-linecap="round" opacity="0.85"/>
    </svg>` },
    pineapple: { name: 'pineapple', emoji: '🍍', svg: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 6 C36 6 40 12 42 20 L50 44 C52 50 47 54 40 54 L20 54 C13 54 8 50 10 44 L18 20 C20 12 24 6 30 6 Z" fill="#FFD855" stroke="#4A2E24" stroke-width="5" stroke-linejoin="round"/>
      <path d="M12 42 L50 44 C52 50 47 54 40 54 L20 54 C13 54 8 50 10 44 Z" fill="#FFC93C"/>
      <path d="M23 22 L37 22 M20 34 L40 34" stroke="#E8A81E" stroke-width="3" stroke-linecap="round"/>
      <path d="M27 12 L33 46 M33 12 L27 46" stroke="#E8A81E" stroke-width="2.4" stroke-linecap="round" opacity="0.7"/>
      <ellipse cx="23" cy="18" rx="5" ry="4" fill="#FFF0B8" opacity="0.85"/>
    </svg>` },
    broccoli:  { name: 'broccoli', emoji: '🥦', svg: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M23 40 L23 52 C23 55 26 56 29 56 L33 56 C36 56 38 55 38 52 L38 40 Z" fill="#A9CE7A" stroke="#4A2E24" stroke-width="5" stroke-linejoin="round"/>
      <path d="M14 26 C10 24 8 18 12 14 C13 8 20 6 25 9 C29 5 37 6 40 12 C47 11 52 17 50 24 C54 27 53 36 46 38 C42 44 32 45 28 42 C22 46 14 43 13 36 C9 34 9 28 14 26 Z" fill="#3E9D4C" stroke="#4A2E24" stroke-width="5" stroke-linejoin="round"/>
      <path d="M13 36 C14 43 22 46 28 42 C32 45 42 44 46 38 C40 42 32 42 28 39 C22 42 15 41 13 36 Z" fill="#2F7D3A"/>
      <circle cx="20" cy="18" r="2.2" fill="#5FBF63"/>
      <circle cx="30" cy="15" r="2.4" fill="#5FBF63"/>
      <circle cx="40" cy="20" r="2.2" fill="#5FBF63"/>
      <circle cx="26" cy="26" r="2.2" fill="#5FBF63"/>
      <circle cx="38" cy="30" r="2" fill="#5FBF63"/>
    </svg>` }
  }
};
