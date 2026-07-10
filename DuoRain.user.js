// ==UserScript==
// @name                DuoRain
// @namespace           https://github.com/DuoXPy/DuoRain
// @version             6.0.0.BETA.02
// @description         The Ultimate Automation Tool for Duolingo
// @author              OracleMythix & oxGorou
// @license MIT
// @match               https://*.duolingo.com/*
// @match               https://*.duolingo.cn/*
// @icon                https://avatars.githubusercontent.com/u/223025697?s=200&v=4
// @run-at              document-end
// @grant               GM_xmlhttpRequest
// @grant               GM_addStyle
// @connect             duolingo.com
// @connect             stories.duolingo.com
// @connect             goals-api.duolingo.com
// @connect             duolingo-leaderboards-prod.duolingo.com
// @connect             ios-api-2.duolingo.com
// @connect             raw.githubusercontent.com
// @connect             avatars.githubusercontent.com
// @downloadURL         https://raw.githubusercontent.com/DuoXPy/DuoRain/main/DuoRain.user.js
// @updateURL           https://raw.githubusercontent.com/DuoXPy/DuoRain/main/DuoRain.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const localSetItem = window.localStorage.setItem;
  const localStorage = {
    getItem: (key) => window.localStorage.getItem(key),
    setItem: (key, value) => {
      localSetItem.call(window.localStorage, key, value);
      if (
        key.startsWith("dr_") &&
        typeof unsafeWindow !== "undefined" &&
        unsafeWindow.localStorage
      ) {
        try {
          unsafeWindow.localStorage.setItem(key, value);
        } catch (e) {}
      }
    },
    removeItem: (key) => window.localStorage.removeItem(key),
    clear: () => window.localStorage.clear(),
    key: (i) => window.localStorage.key(i),
    get length() {
      return window.localStorage.length;
    },
  };

  setTimeout(() => {
    try {
      if (typeof unsafeWindow !== "undefined" && unsafeWindow.localStorage) {
        const len = window.localStorage.length;
        for (let i = 0; i < len; i++) {
          const key = window.localStorage.key(i);
          if (key && key.startsWith("dr_")) {
            try {
              unsafeWindow.localStorage.setItem(
                key,
                window.localStorage.getItem(key),
              );
            } catch (e) {}
          }
        }
      }
    } catch (e) {}
  }, 150);

  const icons = {
    avatar:
      '<img src="https://simg-ssl.duolingo.com/avatar/default_2/xlarge" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">',
    info: '<img src="https://d35aaqx5ub95lt.cloudfront.net/vendor/3390675b86eeeab0b4119ccfcb5b186e.svg" style="width: 100%; height: 100%; object-fit: contain; flex-shrink: 0;">',
    success:
      '<img src="https://d35aaqx5ub95lt.cloudfront.net/images/b377ec812acb8c96d87d52e8009478ad.svg" style="width: 100%; height: 100%; object-fit: contain; flex-shrink: 0;">',
    error:
      '<img src="https://d35aaqx5ub95lt.cloudfront.net/images/bd13fa941b2407b4914296afe4435646.svg" style="width: 100%; height: 100%; object-fit: contain; flex-shrink: 0;">',
    warning:
      '<img src="https://d35aaqx5ub95lt.cloudfront.net/images/de8acff5e3107d8f89c21786346415b7.svg" style="width: 100%; height: 100%; object-fit: contain; flex-shrink: 0;">',
    chevron:
      '<svg class="DR_Chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>',
    hideBtn:
      '<svg id="hide-icon" width="23" height="16" viewBox="0 0 23 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg"><path d="M17.7266 14.9922L4.1875 1.47656C3.9375 1.22656 3.9375 0.796875 4.1875 0.546875C4.44531 0.289062 4.875 0.289062 5.125 0.546875L18.6562 14.0625C18.9141 14.3203 18.9219 14.7188 18.6562 14.9922C18.3984 15.2578 17.9844 15.25 17.7266 14.9922ZM18.4609 12.4062L15.3281 9.25781C15.5 8.82812 15.5938 8.35938 15.5938 7.875C15.5938 5.57812 13.7266 3.74219 11.4375 3.74219C10.9922 3.74219 10.4922 3.83594 10.0547 3.99219L7.75 1.67969C8.875 1.3125 10.1016 1.09375 11.4297 1.09375C17.8984 1.09375 22.1172 6.28906 22.1172 7.875C22.1172 8.78125 20.7344 10.8438 18.4609 12.4062ZM11.4297 14.6562C5.05469 14.6562 0.75 9.45312 0.75 7.875C0.75 6.96094 2.16406 4.85938 4.54688 3.27344L7.59375 6.32812C7.39062 6.79688 7.27344 7.32812 7.27344 7.875C7.28125 10.1172 9.13281 12.0078 11.4375 12.0078C11.9766 12.0078 12.4922 11.8906 12.9609 11.6875L15.2812 14.0078C14.125 14.4141 12.8281 14.6562 11.4297 14.6562ZM13.9609 7.71094C13.9609 7.77344 13.9609 7.82812 13.9531 7.88281L11.3203 5.25781C11.375 5.25 11.4375 5.25 11.4922 5.25C12.8594 5.25 13.9609 6.35156 13.9609 7.71094ZM8.88281 7.82031C8.88281 7.75781 8.88281 7.6875 8.89062 7.625L11.5391 10.2734C11.4766 10.2812 11.4219 10.2891 11.3594 10.2891C10 10.2891 8.88281 9.17969 8.88281 7.82031Z"></path></svg>',
    showBtn:
      '<svg id="show-icon" width="22" height="14" viewBox="0 0 22 14" xmlns="http://www.w3.org/2000/svg"><path d="M11.2734 13.6406C4.89844 13.6406 0.59375 8.4375 0.59375 6.85156C0.59375 5.27344 4.90625 0.078125 11.2734 0.078125C17.75 0.078125 21.9688 5.27344 21.9688 6.85156C21.9688 8.4375 17.75 13.6406 11.2734 13.6406ZM11.2812 11.0078C13.5781 11.0078 15.4375 9.14844 15.4375 6.85938C15.4375 4.5625 13.5781 2.70312 11.2812 2.70312C8.98438 2.70312 7.125 4.5625 7.125 6.85938C7.125 9.14844 8.98438 11.0078 11.2812 11.0078ZM11.2812 8.49219C10.375 8.49219 9.64844 7.76562 9.64844 6.85938C9.64844 5.95312 10.375 5.22656 11.2812 5.22656C12.1875 5.22656 12.9141 5.95312 12.9141 6.85938C12.9141 7.76562 12.1875 8.49219 11.2812 8.49219Z"></path></svg>',
    discordBtn:
      '<svg width="18" height="14" viewBox="0 0 22 16" fill="#FFF"><path d="M18.289 1.34C16.9296.714 15.4761.259 13.9565 0c-.1866.332-.4046.779-.5549 1.134-1.6154-.239-3.2159-.239-4.8016 0C8.4497.779 8.2267.332 8.0384 0 6.5172.259 5.062.716 3.7027 1.343.9608 5.421.2175 9.398.5892 13.318c1.8185 1.337 3.5809 2.149 5.3136 2.68.4278-.579.8093-1.195 1.138-1.845-.6259-.234-1.2255-.523-1.7921-.858.1503-.11.2973-.225.4393-.307 3.4554 1.591 7.2098 1.591 10.624 0 .1437.118.2907.233.4393.342-.6262.337-1.2274.626-1.8534.86.3287.648.7086 1.265 1.138 1.845 1.7343-.531 3.4983-1.343 5.3168-2.681.4361-4.545-.7449-8.484-3.121-11.978ZM7.5115 10.908c-1.0373 0-1.8879-.954-1.8879-2.114 0-1.161.8325-2.115 1.8879-2.115 1.0555 0 1.9061.954 1.8879 2.115.0016 1.16-.8325 2.114-1.8879 2.114Zm6.9769 0c-1.0373 0-1.8879-.954-1.8879-2.114 0-1.161.8324-2.115 1.8879-2.115 1.0554 0 1.9061.954 1.8879 2.115 0 1.16-.8325 2.114-1.8879 2.114Z"/></svg>',
    githubBtn:
      '<svg width="18" height="18" viewBox="0 0 22 22" fill="#FFF"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.009.5C5.198.5.5 5.313.5 11.266c0 4.759 3.01 8.788 7.186 10.214.522.107.713-.232.713-.517 0-.25-.017-1.105-.017-1.997-2.923.642-3.532-1.283-3.532-1.283-.47-1.248-1.166-1.568-1.166-1.568-.957-.659.07-.659.07-.659 1.062.071 1.619 1.105 1.619 1.105.94 1.64 2.453 1.176 3.062.891.087-.695.366-1.176.661-1.444-2.332-.25-4.785-1.176-4.785-5.312 0-1.176.418-2.139 1.08-2.887-.106-.267-.461-1.373.105-2.852 0 0 .888-.285 2.899 1.09a9.847 9.847 0 0 1 2.636-.356c.888 0 1.793.125 2.628.356 2.01-1.375 2.898-1.09 2.898-1.09.566 1.479.21 2.585.105 2.852.662.748 1.08 1.711 1.08 2.887 0 4.136-2.453 5.045-4.803 5.312.383.338.714.98.714 2.004 0 1.444-.018 2.606-.018 2.963 0 .285.192.624.714.48C18.49 20.054 21.5 16.025 21.5 11.266 21.517 5.313 16.802.5 11.009.5Z"/></svg>',
    webBtn:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
    modeNative:
      '<img src="https://d35aaqx5ub95lt.cloudfront.net/vendor/0cecd302cf0bcd0f73d51768feff75fe.svg" style="width: 20px; height: 20px; object-fit: contain; flex-shrink: 0;">',
    modeSolver:
      '<img src="https://d35aaqx5ub95lt.cloudfront.net/images/goals/39f13d2de304cad2ac2f88b31a7e2ff4.svg" style="width: 20px; height: 20px; object-fit: contain; flex-shrink: 0;">',
    settingsBtn:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;"><path d="M 22.76,10.58 L 22.76,13.42 L 19.99,14.60 L 19.48,15.81 L 20.61,18.61 L 18.61,20.61 L 15.81,19.48 L 14.60,19.99 L 13.42,22.76 L 10.58,22.76 L 9.40,19.99 L 8.19,19.48 L 5.39,20.61 L 3.39,18.61 L 4.52,15.81 L 4.01,14.60 L 1.24,13.42 L 1.24,10.58 L 4.01,9.40 L 4.52,8.19 L 3.39,5.39 L 5.39,3.39 L 8.19,4.52 L 9.40,4.01 L 10.58,1.24 L 13.42,1.24 L 14.60,4.01 L 15.81,4.52 L 18.61,3.39 L 20.61,5.39 L 19.48,8.19 L 19.99,9.40 Z" /><circle cx="12" cy="12" r="4.32" /></svg>',
    moreFeatures:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 234 234" fill="none" stroke="rgb(var(--DR-blue))" stroke-width="20" style="width: 18px; height: 18px; flex-shrink: 0;"><rect x="10" y="10" width="86" height="86" rx="5" /><rect x="138" y="10" width="86" height="86" rx="5" /><rect x="10" y="138" width="86" height="86" rx="5" /><g stroke-linecap="round"><line x1="138" y1="138" x2="224" y2="138" /><line x1="181" y1="181" x2="224" y2="181" /><line x1="138" y1="224" x2="224" y2="224" /></g></svg>',
    arrowRight:
      '<svg width="8" height="13" viewBox="0 0 8 13" fill="none" style="flex-shrink: 0;"><path d="M1 1l6 5.5L1 12" stroke="rgb(var(--DR-blue))" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    socialNav:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 46" fill="none" style="width: 22px; height: 22px; flex-shrink: 0;"><circle cx="15.5" cy="16" r="6.5" fill="#428ce1"/><path d="M4 39c0-6.4 5.2-10 11.5-10S27 32.6 27 39a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" fill="#428ce1"/><circle cx="30" cy="18" r="7.5" fill="#077aff"/><path d="M16 41c0-7 5.9-11 13-11 6.6 0 12 3.5 12 11a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2Z" fill="#077aff"/></svg>',
    back: '<svg width="8" height="14" viewBox="0 0 9 16" fill="none"><path d="M8 1L2 8l6 7" stroke="var(--dr-text)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    hash: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M9.5 3.5 7.7 20.5M16.3 3.5l-1.8 17M4 8.75h16M3 15.25h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    inf: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M6.4 8.2c-2 0-3.4 1.7-3.4 3.8s1.4 3.8 3.4 3.8c3 0 4.2-3.8 5.6-3.8s2.6 3.8 5.6 3.8c2 0 3.4-1.7 3.4-3.8s-1.4-3.8-3.4-3.8c-3 0-4.2 3.8-5.6 3.8S9.4 8.2 6.4 8.2Z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    shopIcons: {
      streak:
        "https://d35aaqx5ub95lt.cloudfront.net/images/icons/216ddc11afcbb98f44e53d565ccf479e.svg",
      xp: "https://d35aaqx5ub95lt.cloudfront.net/images/icons/68c1fd0f467456a4c607ecc0ac040533.svg",
      gem: "https://d35aaqx5ub95lt.cloudfront.net/images/gems/45c14e05be9c1af1d7d0b54c6eed7eee.svg",
      heart:
        "https://d35aaqx5ub95lt.cloudfront.net/images/hearts/7631e3ee734dd4fe7792626b59457fa4.svg",
      outfit:
        "https://d35aaqx5ub95lt.cloudfront.net/vendor/0cecd302cf0bcd0f73d51768feff75fe.svg",
      free: "https://d35aaqx5ub95lt.cloudfront.net/images/super/11db6cd6f69cb2e3c5046b915be8e669.svg",
      misc: "https://d35aaqx5ub95lt.cloudfront.net/images/legendary/158dbe277bf83116d04692b969a27aa3.svg",
    },
    xpIcon:
      "https://d35aaqx5ub95lt.cloudfront.net/images/profile/01ce3a817dd01842581c3d18debcbc46.svg",
    gemIcon:
      "https://d35aaqx5ub95lt.cloudfront.net/images/gems/45c14e05be9c1af1d7d0b54c6eed7eee.svg",
    streakIcon:
      "https://d35aaqx5ub95lt.cloudfront.net/images/icons/398e4298a3b39ce566050e5c041949ef.svg",
  };

  const drVersion = "6.0.0 Beta 02";
  const drScriptVersion = "6.0.0.BETA.02";
  const drUpdateMetaUrl =
    "https://raw.githubusercontent.com/DuoXPy/DuoRain/main/DuoRain.meta.js";
  const drUpdatePageUrl = "https://github.com/DuoXPy/DuoRain";

  const config = {
    api: {
      stories: "https://stories.duolingo.com/api2/stories",
      users: "https://www.duolingo.com/2017-06-30/users",
      sessions: "https://www.duolingo.com/2017-06-30/sessions",
      leaderboards:
        "https://duolingo-leaderboards-prod.duolingo.com/leaderboards/7d9f5dd1-8423-491a-91f2-2532052038ce",
      shop: "https://www.duolingo.com/2023-05-23/shop-items",
      goals: "https://goals-api.duolingo.com",
      friends: "https://www.duolingo.com/2017-06-30/friends",
    },
    challengeTypes: [
      "assist",
      "characterIntro",
      "characterMatch",
      "characterPuzzle",
      "characterSelect",
      "characterTrace",
      "characterWrite",
      "completeReverseTranslation",
      "definition",
      "dialogue",
      "extendedMatch",
      "extendedListenMatch",
      "form",
      "freeResponse",
      "gapFill",
      "judge",
      "listen",
      "listenComplete",
      "listenMatch",
      "match",
      "name",
      "listenComprehension",
      "listenIsolation",
      "listenSpeak",
      "listenTap",
      "orderTapComplete",
      "partialListen",
      "partialReverseTranslate",
      "patternTapComplete",
      "radioBinary",
      "radioImageSelect",
      "radioListenMatch",
      "radioListenRecognize",
      "radioSelect",
      "readComprehension",
      "reverseAssist",
      "sameDifferent",
      "select",
      "selectPronunciation",
      "selectTranscription",
      "svgPuzzle",
      "syllableTap",
      "syllableListenTap",
      "speak",
      "tapCloze",
      "tapClozeTable",
      "tapComplete",
      "tapCompleteTable",
      "tapDescribe",
      "translate",
      "transliterate",
      "transliterationAssist",
      "typeCloze",
      "typeClozeTable",
      "typeComplete",
      "typeCompleteTable",
      "writeComprehension",
    ],
  };

  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:126.0) Gecko/20100101 Firefox/126.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  ];
  function pickUserAgent() {
    let ua = localStorage.getItem("dr_user_agent");
    if (!ua) {
      ua = userAgents[Math.floor(Math.random() * userAgents.length)];
      localStorage.setItem("dr_user_agent", ua);
    }
    return ua;
  }
  const drUserAgent = pickUserAgent();

  const DUO_LEAGUES_CDN =
    "https://d35aaqx5ub95lt.cloudfront.net/images/leagues/";
  const DUO_ICON_CDN = "https://d35aaqx5ub95lt.cloudfront.net/vendor/";
  const leagueTierNames = [
    "Bronze",
    "Silver",
    "Gold",
    "Sapphire",
    "Ruby",
    "Emerald",
    "Amethyst",
    "Pearl",
    "Obsidian",
    "Diamond",
  ];
  const leagueBadges = [
    "192181672ada150becd83a74a4266ae9",
    "8148b17e32d8706a82c02688f559e9ef",
    "0e249b5f869b806da7406b815f4d60c6",
    "3ced84eb1f0274ec0f02b24ae6e3d29b",
    "74d6ab6e5b6f92e7d16a4a6664d1fafd",
    "f480e032c5222395e73dac88ce3592bb",
    "7f895707cd44583692d20481dcd9e0d0",
    "f902954eeaa88fd2cb12f9168b4f68cb",
    "57f0c6b260d33493a0cddc4ab38d6833",
    "afe5c7067cd5fb7de936d3928ea7add6",
  ].map((h) => DUO_LEAGUES_CDN + h + ".svg");
  const leagueBadgeFallback =
    "https://d35aaqx5ub95lt.cloudfront.net/images/path/icons/f4b1c683214cf55f5ddea4535b983745.svg";
  const leagueBadgeUrl = (tier) =>
    typeof tier === "number" && tier >= 0 && leagueBadges[tier]
      ? leagueBadges[tier]
      : leagueBadgeFallback;
  const podiumMedals = [
    "9e4f18c0bc42c7508d5fa5b18346af11",
    "cc7b8f8582e9cfb88408ab851ec2e9bd",
    "eef523c872b71178ef5acb2442d453a2",
  ].map((h) => DUO_LEAGUES_CDN + h + ".svg");

  function svgDataIcon(inner) {
    return (
      "data:image/svg+xml," +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${inner}</svg>`,
      )
    );
  }

  const yearInReviewIcons = {
    top1: "https://raw.githubusercontent.com/DuoXPy/DuoRain/main/assets/top_1.svg",
    top3: "https://raw.githubusercontent.com/DuoXPy/DuoRain/main/assets/top_3.svg",
    top5: "https://raw.githubusercontent.com/DuoXPy/DuoRain/main/assets/top_5.svg",
    everyone:
      "https://raw.githubusercontent.com/DuoXPy/DuoRain/main/assets/everyone.svg",
  };

  const statusReactions = [
    {
      name: "None",
      value: "NONE",
      cat: "Reactions",
      icon: DUO_LEAGUES_CDN + "a35f1db4398fd29e66f1abc33a0d11a2.svg",
    },
    {
      name: "Cat",
      emoji: "🐱",
      value: "CAT",
      cat: "Reactions",
      icon: DUO_LEAGUES_CDN + "535fc27de224cc7d311dbb5de4f33be6.svg",
    },
    {
      name: "Poop",
      emoji: "💩",
      value: "POOP",
      cat: "Reactions",
      icon: DUO_LEAGUES_CDN + "beb0df263d0f696bc7095d56b448ca78.svg",
    },
    {
      name: "Popcorn",
      emoji: "🍿",
      value: "POPCORN",
      cat: "Reactions",
      icon: DUO_LEAGUES_CDN + "573de2bc90b2499eeb2b3738cff90133.svg",
    },
    {
      name: "Dumpster Fire",
      emoji: "🔥",
      value: "DUMPSTER_FIRE",
      cat: "Reactions",
      icon: DUO_LEAGUES_CDN + "9fadb349c2ece257386a0e576359c867.svg",
    },
    {
      name: "Trophy",
      emoji: "🏆",
      value: "TROPHY",
      cat: "Reactions",
      icon: DUO_LEAGUES_CDN + "22df4cb957e6cf2d7198b6e5449a342e.svg",
    },
    {
      name: "Diamond Trophy",
      emoji: "💎",
      value: "TROPHY,winner",
      cat: "Reactions",
      icon: DUO_LEAGUES_CDN + "1795aa8b3b10d243e5d138a79bde360a.svg",
    },
    {
      name: "Eyes",
      emoji: "👀",
      value: "EYES",
      cat: "Reactions",
      icon: DUO_LEAGUES_CDN + "a8e5c18e80054228b2c61168846ff643.svg",
    },
    {
      name: "Flex",
      emoji: "💪",
      value: "FLEX",
      cat: "Reactions",
      icon: DUO_LEAGUES_CDN + "6b8a8db5ac7f847e7e87efe97c8b451a.svg",
    },
    {
      name: "One Hundred",
      emoji: "💯",
      value: "ONE_HUNDRED",
      cat: "Reactions",
      icon: DUO_LEAGUES_CDN + "5642e1e72813a88e8973b551a2004c7f.svg",
    },
    {
      name: "Popper",
      emoji: "🎉",
      value: "POPPER",
      cat: "Reactions",
      icon: DUO_LEAGUES_CDN + "2ceb401cae52712705b66a77df83ce40.svg",
    },
    {
      name: "Sunglasses",
      emoji: "😎",
      value: "SUNGLASSES",
      cat: "Reactions",
      icon: DUO_LEAGUES_CDN + "2439bac00452e99ba7bf6a7ed0b04196.svg",
    },
    {
      name: "Angry",
      emoji: "😠",
      value: "ANGRY",
      cat: "Reactions",
      icon: DUO_LEAGUES_CDN + "f12703218fc80de76a63e650726f742e.svg",
    },
    {
      name: "2023 Top 1",
      emoji: "👑",
      value: "YEAR_IN_REVIEW,2023_top1",
      cat: "2023 Evenrs (iOS-only)",
      icon: yearInReviewIcons.top1,
    },
    {
      name: "2023 Top 3",
      emoji: "⭐",
      value: "YEAR_IN_REVIEW,2023_top3",
      cat: "2023 Evenrs (iOS-only)",
      icon: yearInReviewIcons.top3,
    },
    {
      name: "2023 Top 5",
      emoji: "🌟",
      value: "YEAR_IN_REVIEW,2023_top5",
      cat: "2023 Evenrs (iOS-only)",
      icon: yearInReviewIcons.top5,
    },
    {
      name: "2023 Everyone",
      emoji: "🎊",
      value: "YEAR_IN_REVIEW,2023",
      cat: "2023 Evenrs (iOS-only)",
      icon: yearInReviewIcons.everyone,
    },
    {
      name: "Chess",
      emoji: "♟️",
      value: "FLAG,chess",
      cat: "Courses",
      icon: DUO_ICON_CDN + "c8bad7c09aaf7bc29ddddc50808adb54.svg",
    },
    {
      name: "Math",
      emoji: "🔢",
      value: "FLAG,math",
      cat: "Courses",
      icon: DUO_ICON_CDN + "395c8a6ee9783610b578b02fda405e85.svg",
    },
    {
      name: "Music",
      emoji: "🎵",
      value: "FLAG,music",
      cat: "Courses",
      icon: DUO_ICON_CDN + "7fee27d21187165ccb88aef0234b6101.svg",
    },
    {
      name: "Arabic",
      emoji: "🇸🇦",
      value: "FLAG,arabic",
      cat: "Languages",
      icon: DUO_ICON_CDN + "9ab6930a263c981b57f9d578ac97cae7.svg",
    },
    {
      name: "Catalan",
      emoji: "🇦🇩",
      value: "FLAG,catalan",
      cat: "Languages",
      icon: DUO_ICON_CDN + "984fae40120b61fb684a80652e8f6a35.svg",
    },
    {
      name: "Chinese/Cantonese",
      emoji: "🇨🇳",
      value: "FLAG,chinese",
      cat: "Languages",
      icon: DUO_ICON_CDN + "9905aa3a86fcb9e351b0b3bfaf04d8b9.svg",
    },
    {
      name: "Czech",
      emoji: "🇨🇿",
      value: "FLAG,czech",
      cat: "Languages",
      icon: DUO_ICON_CDN + "828bf0fea457d3beaaab3d6c0bfcc975.svg",
    },
    {
      name: "Danish",
      emoji: "🇩🇰",
      value: "FLAG,danish",
      cat: "Languages",
      icon: DUO_ICON_CDN + "6af84a7cb8e99ea8a567c2b9c55b9926.svg",
    },
    {
      name: "Dutch",
      emoji: "🇳🇱",
      value: "FLAG,dutch",
      cat: "Languages",
      icon: DUO_ICON_CDN + "de945d789e249dcd74333a6996472ef8.svg",
    },
    {
      name: "English",
      emoji: "🇬🇧",
      value: "FLAG,english",
      cat: "Languages",
      icon: DUO_ICON_CDN + "bbe17e16aa4a106032d8e3521eaed13e.svg",
    },
    {
      name: "Esperanto",
      emoji: "🌍",
      value: "FLAG,esperanto",
      cat: "Languages",
      icon: DUO_ICON_CDN + "6de7e4731b2a82a6458268e1a3d67ce4.svg",
    },
    {
      name: "Finnish",
      emoji: "🇫🇮",
      value: "FLAG,finnish",
      cat: "Languages",
      icon: DUO_ICON_CDN + "b4d0e4f6451f504e1441eb93efdbea5e.svg",
    },
    {
      name: "French",
      emoji: "🇫🇷",
      value: "FLAG,french",
      cat: "Languages",
      icon: DUO_ICON_CDN + "482fda142ee4abd728ebf4ccce5d3307.svg",
    },
    {
      name: "German",
      emoji: "🇩🇪",
      value: "FLAG,german",
      cat: "Languages",
      icon: DUO_ICON_CDN + "c71db846ffab7e0a74bc6971e34ad82e.svg",
    },
    {
      name: "Greek",
      emoji: "🇬🇷",
      value: "FLAG,greek",
      cat: "Languages",
      icon: DUO_ICON_CDN + "8db373482261397a3159d3f370eed2f3.svg",
    },
    {
      name: "Guarani",
      emoji: "🇵🇾",
      value: "FLAG,guarani",
      cat: "Languages",
      icon: DUO_ICON_CDN + "ff446507a141928d1cfd9476612d7dc0.svg",
    },
    {
      name: "Haitian Creole",
      emoji: "🇭🇹",
      value: "FLAG,haitian-creole",
      cat: "Languages",
      icon: DUO_ICON_CDN + "8cb302b44c183c1a8ec3b90caf90d922.svg",
    },
    {
      name: "Hawaiian",
      emoji: "🏴",
      value: "FLAG,hawaiian",
      cat: "Languages",
      icon: DUO_ICON_CDN + "312e21f793c555787d01a45e20ee8191.svg",
    },
    {
      name: "Hebrew",
      emoji: "🇮🇱",
      value: "FLAG,hebrew",
      cat: "Languages",
      icon: DUO_ICON_CDN + "f818f545a703ddaa046ca8786e781742.svg",
    },
    {
      name: "High Valyrian",
      emoji: "🐉",
      value: "FLAG,high-valyrian",
      cat: "Languages",
      icon: DUO_ICON_CDN + "2880099b038848abbfd11104097953ad.svg",
    },
    {
      name: "Hindi",
      emoji: "🇮🇳",
      value: "FLAG,hindi",
      cat: "Languages",
      icon: DUO_ICON_CDN + "73837fa39dbf1bcc4c95a17a58ed0ffb.svg",
    },
    {
      name: "Hungarian",
      emoji: "🇭🇺",
      value: "FLAG,hungarian",
      cat: "Languages",
      icon: DUO_ICON_CDN + "2ed8d0a73eab3c9cba0290e2b459684a.svg",
    },
    {
      name: "Indonesian",
      emoji: "🇮🇩",
      value: "FLAG,indonesian",
      cat: "Languages",
      icon: DUO_ICON_CDN + "339c0413e542f19b234971d7740447e7.svg",
    },
    {
      name: "Irish",
      emoji: "🇮🇪",
      value: "FLAG,irish",
      cat: "Languages",
      icon: DUO_ICON_CDN + "ef0bfb96037b127473bd7bcbfde1a6ed.svg",
    },
    {
      name: "Italian",
      emoji: "🇮🇹",
      value: "FLAG,italian",
      cat: "Languages",
      icon: DUO_ICON_CDN + "635a09df9323279d39934a991edd4510.svg",
    },
    {
      name: "Japanese",
      emoji: "🇯🇵",
      value: "FLAG,japanese",
      cat: "Languages",
      icon: DUO_ICON_CDN + "edea4fa18ff3e7d8c0282de3f102aaed.svg",
    },
    {
      name: "Klingon",
      emoji: "🖖",
      value: "FLAG,klingon",
      cat: "Languages",
      icon: DUO_ICON_CDN + "76d654213a8282b0ebc25b4f535ee003.svg",
    },
    {
      name: "Korean",
      emoji: "🇰🇷",
      value: "FLAG,korean",
      cat: "Languages",
      icon: DUO_ICON_CDN + "ec5835ac9f465ff3dad4b1b8725d4314.svg",
    },
    {
      name: "Latin",
      emoji: "🇻🇦",
      value: "FLAG,latin",
      cat: "Languages",
      icon: DUO_ICON_CDN + "f7cee6cc09270371b097129faf792c2a.svg",
    },
    {
      name: "Navajo",
      emoji: "🏴",
      value: "FLAG,navajo",
      cat: "Languages",
      icon: DUO_ICON_CDN + "bbc8ad0cfe2596d5193376ebdc3e969c.svg",
    },
    {
      name: "Norwegian (Bokmål)",
      emoji: "🇳🇴",
      value: "FLAG,norwegian",
      cat: "Languages",
      icon: DUO_ICON_CDN + "90b37d97edc66e830dc2286279548f67.svg",
    },
    {
      name: "Polish",
      emoji: "🇵🇱",
      value: "FLAG,polish",
      cat: "Languages",
      icon: DUO_ICON_CDN + "f095084e6ec400e631d62c3d95fefaa2.svg",
    },
    {
      name: "Portuguese",
      emoji: "🇵🇹",
      value: "FLAG,portuguese",
      cat: "Languages",
      icon: DUO_ICON_CDN + "27d253ae1272917fc9f4a79459aacd53.svg",
    },
    {
      name: "Romanian",
      emoji: "🇷🇴",
      value: "FLAG,romanian",
      cat: "Languages",
      icon: DUO_ICON_CDN + "357e13bb10cf86fc06552d563957e2e6.svg",
    },
    {
      name: "Russian",
      emoji: "🇷🇺",
      value: "FLAG,russian",
      cat: "Languages",
      icon: DUO_ICON_CDN + "eadd7804652170c33814a89482f1f353.svg",
    },
    {
      name: "Scottish Gaelic",
      emoji: "🏴",
      value: "FLAG,scottish-gaelic",
      cat: "Languages",
      icon: DUO_ICON_CDN + "09eba3135efe8fe93a4662dba813b921.svg",
    },
    {
      name: "Spanish",
      emoji: "🇪🇸",
      value: "FLAG,spanish",
      cat: "Languages",
      icon: DUO_ICON_CDN + "59a90a2cedd48b751a8fd22014768fd7.svg",
    },
    {
      name: "Swahili",
      emoji: "🇹🇿",
      value: "FLAG,swahili",
      cat: "Languages",
      icon: DUO_ICON_CDN + "335311988405b4354e1b6ae9037c02db.svg",
    },
    {
      name: "Swedish",
      emoji: "🇸🇪",
      value: "FLAG,swedish",
      cat: "Languages",
      icon: DUO_ICON_CDN + "f578430c9b7ab617c107893afbb501c0.svg",
    },
    {
      name: "Tamil",
      emoji: "🇮🇳",
      value: "FLAG,tamil",
      cat: "Languages",
      icon: DUO_ICON_CDN + "2226e2cc358e810d3ee9dbe182f7c2a9.svg",
    },
    {
      name: "Thai",
      emoji: "🇹🇭",
      value: "FLAG,thai",
      cat: "Languages",
      icon: DUO_ICON_CDN + "d079dc0a7d111bbbf241aa79bc8ceefe.svg",
    },
    {
      name: "Turkish",
      emoji: "🇹🇷",
      value: "FLAG,turkish",
      cat: "Languages",
      icon: DUO_ICON_CDN + "bc80a9518cd6d5af6ae14e8b22b8a1f4.svg",
    },
    {
      name: "Ukrainian",
      emoji: "🇺🇦",
      value: "FLAG,ukrainian",
      cat: "Languages",
      icon: DUO_ICON_CDN + "7c6e12bc57527843082f7f5bb77c9862.svg",
    },
    {
      name: "Urdu",
      emoji: "🇵🇰",
      value: "FLAG,urdu",
      cat: "Languages",
      icon: DUO_ICON_CDN + "aebc481c2b5167a564e4c9313d07278d.svg",
    },
    {
      name: "Vietnamese",
      emoji: "🇻🇳",
      value: "FLAG,vietnamese",
      cat: "Languages",
      icon: DUO_ICON_CDN + "2b077d42185bc45d4896ed55f15c4fea.svg",
    },
    {
      name: "Welsh",
      emoji: "🏴",
      value: "FLAG,welsh",
      cat: "Languages",
      icon: DUO_ICON_CDN + "f773f1b240623072e48843ecdf90d756.svg",
    },
    {
      name: "Yiddish",
      emoji: "🏴",
      value: "FLAG,yiddish",
      cat: "Languages",
      icon: DUO_ICON_CDN + "55bad151fa6a8d9e2376fc9697c671c8.svg",
    },
    {
      name: "Zulu",
      emoji: "🇿🇦",
      value: "FLAG,south-africa",
      cat: "Languages",
      icon: DUO_ICON_CDN + "112e1531d0ac198a9424bd1b0a7166e6.svg",
    },
  ];

  const mainCss = `
        @font-face {
            font-family: "DuoFeather";
            src: url("https://d35aaqx5ub95lt.cloudfront.net/fonts/642e24bb0295f3aee4dedcd8eecd8007.woff2") format("woff2");
            font-display: swap;
        }

        :root {
            --DR-blue: 0, 122, 255;
            --DR-green: 50, 215, 75;
            --DR-red: 255, 69, 58;
            --DR-orange: 255, 159, 10;

            --DR-s1: 4px;
            --DR-s2: 8px;
            --DR-s3: 12px;
            --DR-s4: 16px;

            --DR-ctrl: 40px;
            --DR-ctrl-lg: 48px;

            --DR-r-s: 8px;
            --DR-r-m: 12px;
            --DR-r-l: 16px;
            --DR-r-xl: 22px;
            --DR-corner: 0;

            --DR-ease: cubic-bezier(.16, 1, .32, 1);
            --DR-motion-fast: 400ms;
            --DR-motion: 400ms;
            --DR-motion-page: 400ms;
            --DR-motion-spin: 1200ms;

            --DR-t-title: 22px;
            --DR-t-lead: 16px;
            --DR-t-body: 15px;
            --DR-t-label: 13px;
            --DR-t-cap: 11px;
        }

        @supports (corner-shape: superellipse(1.4)) {
            :root { --DR-corner: superellipse(1.4); }
        }

        .DR_Btn,
        .DR_Input_Wrap,
        .DR_Hash_Btn,
        .DR_Select,
        .DR_Select_Options,
        .DR_Set_Input_Wrap,
        .DR_Search,
        .DR_Panel_Card,
        .DR_Shop_Card,
        .DR_Quest_Item,
        .DR_Shop_Btn,
        .DR_Quest_Get_Btn,
        .DR_Profile_Block,
        .DR_Modal_Box {
            corner-shape: var(--DR-corner);
        }

        .DR_Wordmark {
            display: inline-flex;
            align-items: baseline;
            font-family: 'DuoFeather', 'din-round';
            font-size: var(--DR-t-title);
            font-weight: 900;
            letter-spacing: 0.2px;
            line-height: 1;
        }

        .DR_Wordmark .dr-rain {
            background: linear-gradient(
                135deg,
                #00f0ff 0%,
                #0072ff 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            display: inline-block;
        }


        #DR_Root {
            user-select: none;
            -webkit-user-select: none;
        }

        #DR_Root * {
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }

        .DR_Selectable {
            user-select: text !important;
            -webkit-user-select: text !important;
            cursor: text;
        }

        #DR_Root p,
        #DR_Root span,
        #DR_Root button,
        #DR_Root input,
        #DR_Root label,
        #DR_Root div {
            font-family: 'din-round', 'DuoFeather' !important;
        }

        #DR_Root p,
        #DR_Root span {
            margin: 0;
            padding: 0;
        }

        #DR_Root svg {
            flex-shrink: 0;
        }

        .DR_Main {
            display: inline-flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-end;
            gap: 8px;
            position: fixed;
            right: calc(16px + env(safe-area-inset-right, 0px));
            bottom: calc(16px + env(safe-area-inset-bottom, 0px));
            z-index: 2147483646;
            pointer-events: none;
            transition: gap var(--DR-motion-page) var(--DR-ease);
        }

        .DR_Main > * {
            pointer-events: auto;
        }

        .DR_Main.dr-panel-hidden {
            gap: 0;
            width: max-content;
            height: auto;
        }

        .DR_Main.dr-panel-hidden .DR_Main_Box {
            pointer-events: none !important;
        }

        .DR_Main_Box {
            display: flex;
            width: 325px;
            max-width: calc(100vw - 16px);
            padding: 16px;
            box-sizing: border-box;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 8px;
            overflow: hidden;
            border-radius: var(--DR-r-xl);
            corner-shape: var(--DR-corner);
            position: relative;
            transform-origin: var(--DR-panel-origin, center);
            -webkit-transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
            transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
            -webkit-transition: opacity var(--DR-motion) var(--DR-ease),
                                -webkit-filter var(--DR-motion) var(--DR-ease),
                                filter var(--DR-motion) var(--DR-ease),
                                -webkit-transform var(--DR-motion-page) var(--DR-ease),
                                transform var(--DR-motion-page) var(--DR-ease);
            transition: opacity var(--DR-motion) var(--DR-ease),
                        filter var(--DR-motion) var(--DR-ease),
                        transform var(--DR-motion-page) var(--DR-ease);
            will-change: opacity, filter, transform;
        }

        .DR_Main_Box.dr-hidden {
            opacity: 0 !important;
            -webkit-filter: blur(6px) !important;
            filter: blur(6px) !important;
            -webkit-transform: translate3d(0, var(--DR-panel-hide-y, 0px), 0) scale3d(0.96, 0.96, 1) !important;
            transform: translate3d(0, var(--DR-panel-hide-y, 0px), 0) scale3d(0.96, 0.96, 1) !important;
            pointer-events: none;
        }

        .DR_Main_Box.dr-collapsed {
            width: 0 !important;
            max-width: 0 !important;
            max-height: 0 !important;
            height: 0 !important;
            min-width: 0 !important;
            padding: 0 !important;
            overflow: hidden;
        }

        .DR_Main_Box.dr-scroll {
            overflow-y: auto;
            overflow-x: hidden;
            justify-content: flex-start;
        }

        .DR_Main_Box.dr-scroll::-webkit-scrollbar {
            width: 4px;
        }

        .DR_Main_Box.dr-scroll::-webkit-scrollbar-track {
            background: transparent;
        }

        .DR_Main_Box.dr-scroll::-webkit-scrollbar-thumb {
            background: rgba(var(--DR-blue), 0.4);
            border-radius: 4px;
        }

        .DR_Main_Box.dr-menu-open {
            overflow: visible;
        }

        .DR_Main_Box.dr-scroll.dr-menu-open {
            overflow-x: hidden;
            overflow-y: auto;
        }

        .DR_Main_Box.dr-light {
            --dr-panel-bg: rgba(255, 255, 255, 0.85);
            background: var(--dr-panel-bg);
            backdrop-filter: blur(20px) saturate(1.6);
            -webkit-backdrop-filter: blur(20px) saturate(1.6);
            outline: 2px solid rgba(229, 229, 229, 1);
            outline-offset: -2px;
            box-shadow: 0 18px 50px -12px rgba(17, 32, 46, 0.28), 0 2px 8px rgba(17, 32, 46, 0.06);
            --dr-bg: rgba(255, 255, 255, 0.95);
            --dr-text: #333;
            --dr-card-bg: rgba(0, 0, 0, 0.05);
            --dr-card-hover: rgba(var(--DR-blue), 0.1);
            --dr-card-border: rgba(229, 229, 229, 1);
        }

        .DR_Main_Box.dr-dark {
            --dr-panel-bg: rgba(32, 47, 54, 0.85);
            background: var(--dr-panel-bg);
            backdrop-filter: blur(20px) saturate(1.6);
            -webkit-backdrop-filter: blur(20px) saturate(1.6);
            outline: 2px solid rgba(55, 70, 79, 1);
            outline-offset: -2px;
            box-shadow: 0 20px 55px -12px rgba(0, 0, 0, 0.55), 0 2px 8px rgba(0, 0, 0, 0.3);
            --dr-bg: rgba(32, 47, 54, 0.95);
            --dr-text: #fff;
            --dr-card-bg: rgba(255, 255, 255, 0.05);
            --dr-card-hover: rgba(var(--DR-blue), 0.15);
            --dr-card-border: rgba(55, 70, 79, 1);
        }

        #duorain-hide-button.dr-light {
            --dr-text: #333;
            --dr-panel-bg: rgba(255, 255, 255, 0.85);
            --dr-card-border: rgba(229, 229, 229, 1);
            --dr-panel-shadow: 0 12px 32px -14px rgba(17, 32, 46, 0.28), 0 2px 8px rgba(17, 32, 46, 0.06);
        }

        #duorain-hide-button.dr-dark {
            --dr-text: #fff;
            --dr-panel-bg: rgba(32, 47, 54, 0.85);
            --dr-card-border: rgba(55, 70, 79, 1);
            --dr-panel-shadow: 0 14px 36px -14px rgba(0, 0, 0, 0.55), 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .DR_HStack_Auto {
            display: flex;
            align-items: center;
            justify-content: space-between;
            align-self: stretch;
            gap: 8px;
            min-width: 0;
        }

        .DR_HStack_8 {
            display: flex;
            align-items: center;
            gap: 8px;
            align-self: stretch;
            min-width: 0;
        }

        .DR_HStack_4 {
            display: flex;
            align-items: center;
            gap: 4px;
            align-self: stretch;
            min-width: 0;
        }

        .DR_VStack_8 {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 8px;
            align-self: stretch;
        }

        .DR_VStack_4 {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 4px;
            align-self: stretch;
        }

        .DR_NoSel {
            user-select: none;
            -webkit-user-select: none;
        }

        .DR_Divider {
            align-self: stretch;
            height: 1px;
            background: rgba(117, 117, 117, 0.2);
            flex-shrink: 0;
        }

        .DR_T1 {
            font-size: 14px;
            font-weight: 700;
            line-height: 1.22;
            color: var(--dr-text);
            margin: 0;
            min-width: 0;
        }

        .DR_T1:has(+ .DR_T2) {
            font-weight: 800;
        }

        .DR_T2 {
            font-size: 13px;
            font-weight: 600;
            line-height: 1.25;
            color: var(--dr-text);
            opacity: 0.6;
            margin: 0;
            min-width: 0;
        }

        .DR_Btn {
            display: flex;
            height: 40px;
            padding: 10px 12px 10px 10px;
            box-sizing: border-box;
            align-items: center;
            gap: 6px;
            flex: 1 0 0;
            min-width: 0;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            user-select: none;
            transition: filter var(--DR-motion-fast) ease,
                        transform var(--DR-motion-fast) ease,
                        background var(--DR-motion) ease,
                        color var(--DR-motion) ease;
        }

        .DR_Btn:hover {
            filter: brightness(0.9);
            transform: scale(1.05);
        }

        .DR_Btn:active {
            filter: brightness(0.9);
            transform: scale(0.9);
        }

        .DR_Btn_Blue_Ghost,
        .DR_Btn_Eel {
            outline: 2px solid var(--dr-card-border);
            outline-offset: -2px;
            background: var(--dr-card-bg);
        }

        .DR_Btn_Blue_Ghost .DR_Nav_Title {
            color: var(--dr-text);
        }

        .DR_Btn_Blue_Ghost .DR_Nav_Btn_L > svg,
        .DR_Btn_Blue_Ghost .DR_Nav_Btn_L > svg [stroke],
        .DR_Btn_Blue_Ghost > svg path {
            stroke: var(--dr-text);
        }

        .DR_Btn_Icon {
            flex: none !important;
            width: 40px;
            padding: 10px !important;
            justify-content: center;
        }

        .DR_Nav_Btn {
            align-self: stretch;
            justify-content: space-between;
            height: 40px;
            padding: 10px 12px 10px 10px;
        }

        .DR_Nav_Btn_L {
            display: flex;
            align-items: center;
            gap: 8px;
            flex: 1 1 auto;
            min-width: 0;
        }

        .DR_Nav_Btn_L > svg:first-child,
        .DR_Nav_Btn_L > img:first-child {
            width: 20px !important;
            height: 20px !important;
            flex-shrink: 0;
            object-fit: contain;
        }

        .DR_Nav_Title {
            color: rgb(var(--DR-blue));
            font-size: 14px;
            font-weight: 800;
            line-height: 1.18;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .DR_Input_Wrap {
            display: flex;
            height: 44px;
            padding: 12px 14px;
            box-sizing: border-box;
            align-items: center;
            flex: 1 0 0;
            min-width: 0;
            gap: 6px;
            border-radius: var(--DR-r-s);
            outline: 2px solid var(--dr-card-border);
            outline-offset: -2px;
            background: var(--dr-card-bg);
            position: relative;
            overflow: hidden;
            transition: flex var(--DR-motion-page) var(--DR-ease),
                        padding var(--DR-motion-page) var(--DR-ease),
                        margin var(--DR-motion-page) var(--DR-ease),
                        opacity var(--DR-motion) ease,
                        outline-width var(--DR-motion-page) var(--DR-ease),
                        outline-color var(--DR-motion) ease,
                        background var(--DR-motion) ease;
        }

        .DR_Input_Wrap:focus-within {
            outline-color: rgba(var(--DR-blue), 0.35);
        }

        .DR_Input_Wrap.dr-inf-hidden {
            flex: 0 0 0px;
            padding-left: 0;
            padding-right: 0;
            opacity: 0;
            outline-width: 0px;
            pointer-events: none;
            margin-right: -8px;
        }

        .DR_Hash_Btn {
            --focus-outline: var(--dr-card-border);
            background: var(--dr-card-bg);
            border: none;
            border-radius: var(--DR-r-s);
            color: var(--dr-text);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            height: 44px;
            width: 44px;
            flex-shrink: 0;
            cursor: pointer;
            overflow: hidden;
            outline: 2px solid var(--dr-card-border);
            outline-offset: -2px;
            transition: filter var(--DR-motion-fast) ease,
                        transform var(--DR-motion-fast) ease,
                        background var(--DR-motion) ease,
                        outline-color var(--DR-motion) ease,
                        box-shadow var(--DR-motion) ease,
                        flex var(--DR-motion-page) var(--DR-ease),
                        width var(--DR-motion-page) var(--DR-ease);
        }

        .DR_Hash_Btn svg {
            display: block;
            width: 22px;
            height: 22px;
        }

        .DR_Hash_Btn:hover {
            filter: brightness(0.9);
            transform: scale(1.05);
        }

        .DR_Hash_Btn:active {
            filter: brightness(0.9);
            transform: scale(0.9);
        }

        .DR_Hash_Btn.dr-inf-active {
            flex: 1 0 0;
            width: auto;
        }

        #DR_Root .DR_Hash_Btn:focus,
        #DR_Root .DR_Hash_Btn:focus-visible,
        #DR_Root .DR_Hash_Btn:active {
            outline: 2px solid var(--dr-card-border) !important;
            outline-offset: -2px !important;
            box-shadow: none !important;
        }

        .DR_Hash_Lbl {
            font-weight: 800;
            font-size: 13px;
            white-space: nowrap;
        }

        .DR_Input {
            border: none !important;
            outline: none !important;
            background: none !important;
            text-align: right;
            font-size: 14px !important;
            font-weight: 600 !important;
            color: var(--dr-text) !important;
            font-family: inherit !important;
            width: 100%;
            -webkit-appearance: none;
            appearance: none;
            -moz-appearance: textfield;
        }

        .DR_Input::placeholder {
            color: var(--dr-text) !important;
            opacity: 0.5;
        }

        .DR_Input::-webkit-outer-spin-button,
        .DR_Input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        .DR_Input_Btn {
            display: flex;
            height: 44px;
            width: 66px;
            padding: 12px 10px;
            box-sizing: border-box;
            justify-content: center;
            align-items: center;
            border-radius: var(--DR-r-s);
            corner-shape: var(--DR-corner);
            border: none;
            cursor: pointer;
            user-select: none;
            outline: 2px solid rgba(0, 0, 0, 0.2);
            outline-offset: -2px;
            background: rgb(var(--DR-blue));
            white-space: nowrap;
            flex-shrink: 0;
            transition: background var(--DR-motion) ease,
                        outline var(--DR-motion) ease,
                        filter var(--DR-motion-fast) ease,
                        transform var(--DR-motion-fast) ease;
        }

        .DR_Input_Btn:focus,
        .DR_Input_Btn:focus-visible {
            outline-color: var(--focus-outline, rgba(0, 0, 0, 0.2)) !important;
        }

        .DR_Input_Btn:hover {
            filter: brightness(0.9);
            transform: scale(1.05);
        }

        .DR_Input_Btn:active {
            filter: brightness(0.9);
            transform: scale(0.9);
        }

        .DR_Input_Btn:disabled {
            opacity: 0.38;
            pointer-events: none;
        }

        .DR_Btn_Label {
            font-size: 14px;
            font-weight: 800;
            line-height: 1.1;
            letter-spacing: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            transition: opacity var(--DR-motion) ease,
                        filter var(--DR-motion) ease,
                        color var(--DR-motion) ease;
        }

        .DR_Sm_Btn {
            display: flex;
            height: var(--DR-ctrl);
            padding: 10px 12px;
            min-width: 66px;
            justify-content: center;
            align-items: center;
            border-radius: var(--DR-r-s);
            corner-shape: var(--DR-corner);
            border: none;
            cursor: pointer;
            user-select: none;
            flex-shrink: 0;
            outline: 2px solid rgba(0, 0, 0, 0.2);
            outline-offset: -2px;
            background: rgb(var(--DR-blue));
            white-space: nowrap;
            transition: background var(--DR-motion) ease,
                        outline var(--DR-motion) ease,
                        filter var(--DR-motion-fast) ease,
                        transform var(--DR-motion-fast) ease;
        }

        .DR_Sm_Btn:focus,
        .DR_Sm_Btn:focus-visible {
            outline-color: var(--focus-outline, rgba(0, 0, 0, 0.2)) !important;
        }

        .DR_Sm_Btn:hover {
            filter: brightness(0.9);
            transform: scale(1.05);
        }

        .DR_Sm_Btn:active {
            filter: brightness(0.9);
            transform: scale(0.9);
        }

        .DR_Sm_Btn:disabled {
            opacity: 0.38;
            pointer-events: none;
        }

        .DR_Sm_Btn_Label {
            font-size: 14px;
            font-weight: 800;
            line-height: 1.1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            transition: opacity var(--DR-motion) ease,
                        filter var(--DR-motion) ease,
                        color var(--DR-motion) ease;
        }

        .DR_Toggle {
            position: relative;
            width: 52px;
            height: 30px;
            border-radius: 999px;
            background: var(--dr-card-border);
            cursor: pointer;
            user-select: none;
            flex-shrink: 0;
            transition: background var(--DR-motion) ease;
        }

        .DR_Toggle.on {
            background: rgb(var(--DR-blue));
        }

        .DR_Toggle_Knob {
            position: absolute;
            top: 3px;
            left: 3px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #fff;
            box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
            -webkit-transition: -webkit-transform var(--DR-motion) var(--DR-ease);
            transition: transform var(--DR-motion) var(--DR-ease);
        }

        .DR_Toggle.on .DR_Toggle_Knob {
            -webkit-transform: translate3d(22px, 0, 0);
            transform: translate3d(22px, 0, 0);
        }

        .DR_Select {
            position: relative;
            width: 100%;
            min-width: 0;
            height: 40px;
            border-radius: 8px;
            background: var(--dr-card-bg);
            outline: 2px solid var(--dr-card-border);
            outline-offset: -2px;
            color: var(--dr-text);
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
            user-select: none;
            transition: outline-color var(--DR-motion) ease,
                        background var(--DR-motion) ease;
        }

        .DR_Select:hover {
            outline-color: rgba(var(--DR-blue), 0.35);
        }

        .DR_Select.open {
            outline-color: rgba(var(--DR-blue), 0.35);
        }

        .DR_Select_Trigger {
            height: 100%;
            padding: 0 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 6px;
            min-width: 0;
        }

        .DR_Select_Text {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .DR_Select_Options {
            position: absolute;
            top: calc(100% + 8px);
            left: 0;
            right: 0;
            background: var(--dr-bg);
            border: 1px solid var(--dr-card-border);
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, .2);
            max-height: 0;
            overflow-y: auto;
            opacity: 0;
            visibility: hidden;
            -webkit-transform: translate3d(0, -8px, 0);
            transform: translate3d(0, -8px, 0);
            -webkit-transition: max-height var(--DR-motion) var(--DR-ease),
                                opacity var(--DR-motion) ease,
                                visibility var(--DR-motion) ease,
                                -webkit-transform var(--DR-motion) var(--DR-ease),
                                transform var(--DR-motion) var(--DR-ease);
            transition: max-height var(--DR-motion) var(--DR-ease),
                        opacity var(--DR-motion) ease,
                        visibility var(--DR-motion) ease,
                        transform var(--DR-motion) var(--DR-ease);
            z-index: 100;
            backdrop-filter: blur(20px);
        }

        .DR_Select.open .DR_Select_Options {
            max-height: 128px;
            opacity: 1;
            visibility: visible;
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
        }

        .DR_Select_Option {
            padding: 0 12px;
            min-height: 40px;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            color: var(--dr-text);
            font-weight: 600;
            transition: background var(--DR-motion-fast) ease,
                        color var(--DR-motion-fast) ease;
        }

        .DR_Select_Option:hover {
            background: var(--dr-card-hover);
            color: var(--dr-text);
        }

        .DR_Select .DR_Chevron {
            -webkit-transform: rotate3d(0, 0, 1, 0deg);
            transform: rotate3d(0, 0, 1, 0deg);
            -webkit-transition: -webkit-transform var(--DR-motion) var(--DR-ease);
            transition: transform var(--DR-motion) var(--DR-ease);
            width: 16px;
            height: 16px;
            stroke: var(--dr-text);
        }

        .DR_Select.open .DR_Chevron {
            -webkit-transform: rotate3d(0, 0, 1, 180deg);
            transform: rotate3d(0, 0, 1, 180deg);
        }

        .DR_Select_Options::-webkit-scrollbar {
            width: 4px;
        }

        .DR_Select_Options::-webkit-scrollbar-track {
            margin: 8px 0;
            border-radius: 12px;
        }

        .DR_Select_Options::-webkit-scrollbar-thumb {
            background: rgba(var(--DR-blue), 0.4);
            border-radius: 4px;
        }

        .DR_Farm_Sec {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            align-self: stretch;
        }

        .DR_Farm_Sec > .DR_HStack_8 {
            margin-top: 8px;
        }

        .DR_Farm_Sec > .DR_Prog_Wrap.on {
            margin-top: 8px;
        }

        .DR_Task_Group {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            align-self: stretch;
        }

        .DR_Task_Group > .DR_Prog_Wrap.on {
            margin-top: 8px;
        }

        .DR_Prog_Wrap {
            align-self: stretch;
            height: 0;
            border-radius: 3px;
            background: rgba(var(--DR-blue), 0.1);
            overflow: hidden;
            transition: height var(--DR-motion-page) var(--DR-ease);
        }

        .DR_Prog_Wrap.on {
            height: 4px;
        }

        .DR_Prog_Fill {
            height: 100%;
            border-radius: 3px;
            background: rgb(var(--DR-blue));
            width: 0%;
            transition: width var(--DR-motion-page) var(--DR-ease),
                        background var(--DR-motion) ease,
                        box-shadow var(--DR-motion) ease;
            box-shadow: 0 0 6px rgba(var(--DR-blue), 0.35);
        }

        .DR_Prog_Fill.done {
            background: rgb(var(--DR-green)) !important;
            box-shadow: 0 0 8px rgba(var(--DR-green), 0.45) !important;
        }

        .DR_Avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(var(--DR-blue), 0.1);
            color: var(--dr-text);
            overflow: hidden;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .DR_Stat_Ico {
            width: 15px;
            height: 15px;
            display: block;
            flex-shrink: 0;
        }

        .DR_Stat_Val {
            font-size: 13px !important;
            font-weight: 700 !important;
            color: var(--dr-text) !important;
            opacity: 0.8;
        }

        .DR_Page {
            display: none;
            width: 100%;
        }

        .DR_Page.active {
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-self: stretch;
            align-items: center;
        }

        .DR_Notif_Main {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            gap: 10px;
            width: 320px;
            position: fixed;
            left: 50%;
            top: 20px;
            transform: translateX(-50%);
            z-index: 2147483647;
            pointer-events: none;
        }

        .DR_Notif_Box {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 20px;
            border-radius: 16px;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            outline: 2px solid rgba(229, 229, 229, 1);
            outline-offset: -2px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            opacity: 0;
            transform: translateY(-20px);
            transition: transform var(--DR-motion-page) var(--DR-ease),
                        opacity var(--DR-motion) ease,
                        margin var(--DR-motion-page) var(--DR-ease);
            pointer-events: auto;
            width: 100%;
            min-width: 0;
        }

        .DR_Notif_Box .DR_T1,
        .DR_Notif_Box .DR_T2 {
            overflow-wrap: anywhere;
        }

        .DR_Notif_Box > div:last-child {
            min-width: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 2px;
        }

        .DR_Notif_Main.dr-light {
            --dr-text: #333;
        }

        .DR_Notif_Main.dr-dark {
            --dr-text: #fff;
        }

        .DR_Notif_Main.dr-dark .DR_Notif_Box {
            background: rgba(32, 47, 54, 0.85);
            outline-color: rgba(55, 70, 79, 1);
        }

        .DR_Notif_Box.show {
            opacity: 1;
            transform: translateY(0) scale(1) !important;
        }

        .DR_Notif_Box.hide {
            opacity: 0 !important;
            transform: translateY(-30px) scale(0.85) !important;
            margin-top: -60px;
            z-index: -1;
        }

        .DR_Notif_Main[data-pos^="bottom"] .DR_Notif_Box {
            transform: translateY(30px) scale(0.9);
        }

        .DR_Notif_Main[data-pos^="bottom"] .DR_Notif_Box.hide {
            transform: translateY(30px) scale(0.85) !important;
            margin-top: 0px;
            margin-bottom: -60px;
            z-index: -1;
        }

        .DR_Notif_Ico {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            color: var(--dr-text);
        }

        .DR_Notif_Ico svg {
            width: 100%;
            height: 100%;
        }

        .DR_Notif_Box.warning .DR_Notif_Ico {
            color: rgb(243, 156, 18);
        }

        .DR_Notif_Box.success .DR_Notif_Ico {
            color: rgb(88, 204, 2);
        }

        .DR_Notif_Box.error .DR_Notif_Ico {
            color: rgb(238, 85, 85);
        }

        .DR_Shop_Grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
            align-self: stretch;
        }

        .DR_Shop_Section_Header {
            grid-column: 1 / -1;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 4px;
        }

        .DR_Shop_Section_Line {
            flex: 1;
            height: 1px;
            background: var(--dr-card-border);
        }

        .DR_Shop_Section_Title {
            font-size: 11px !important;
            font-weight: 800 !important;
            color: var(--dr-text) !important;
            text-transform: uppercase;
            letter-spacing: 0;
            opacity: 0.5;
        }

        .DR_Shop_Card {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            padding: 12px 8px;
            box-sizing: border-box;
            border-radius: 12px;
            outline: 1.5px solid var(--dr-card-border);
            outline-offset: -1px;
            background: var(--dr-card-bg);
            transition: outline-color var(--DR-motion) ease,
                        background var(--DR-motion) ease;
            text-align: center;
            min-width: 0;
        }

        .DR_Shop_Card:hover {
            outline-color: rgba(var(--DR-blue), 0.3);
            background: var(--dr-card-hover);
        }

        .DR_Shop_Ico {
            width: 36px;
            height: 36px;
            object-fit: contain;
            flex-shrink: 0;
        }

        .DR_Shop_Name {
            font-size: 11px;
            font-weight: 700;
            color: var(--dr-text);
            opacity: 0.8;
            line-height: 1.3;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 30px;
            overflow-wrap: anywhere;
        }

        .DR_Shop_Btn {
            width: 100%;
            height: 28px;
            border-radius: var(--DR-r-s);
            border: none;
            cursor: pointer;
            font-size: 11px;
            font-weight: 800;
            color: #fff;
            background: rgb(var(--DR-blue));
            outline: 2px solid rgba(0, 0, 0, 0.2);
            outline-offset: -2px;
            transition: filter var(--DR-motion-fast) ease,
                        transform var(--DR-motion-fast) ease,
                        background var(--DR-motion) ease;
        }

        .DR_Shop_Btn:hover {
            filter: brightness(0.9);
            transform: scale(1.05);
        }

        .DR_Shop_Btn:active {
            filter: brightness(0.9);
            transform: scale(0.9);
        }

        .DR_Shop_Btn:focus,
        .DR_Shop_Btn:focus-visible {
            outline-color: var(--focus-outline, rgba(0, 0, 0, 0.2)) !important;
        }

        .DR_Shop_Btn.loading {
            --focus-outline: var(--dr-card-border);
            background: var(--dr-card-bg);
            color: var(--dr-text);
            outline-color: var(--dr-card-border);
            pointer-events: none;
        }

        .DR_Shop_Btn.got {
            --focus-outline: rgba(var(--DR-green), 0.25);
            background: rgba(var(--DR-green), 0.12);
            color: rgb(var(--DR-green));
            outline-color: rgba(var(--DR-green), 0.25);
            pointer-events: none;
        }

        .DR_Shop_Btn.fail {
            --focus-outline: rgba(var(--DR-red), 0.22);
            background: rgba(var(--DR-red), 0.10);
            color: rgb(var(--DR-red));
            outline-color: rgba(var(--DR-red), 0.22);
            pointer-events: none;
        }

        .DR_Scroll_Inner {
            align-self: stretch;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            max-height: 300px;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding-right: 4px;
        }

        .DR_Scroll_Inner::-webkit-scrollbar {
            width: 4px;
        }

        .DR_Scroll_Inner::-webkit-scrollbar-track {
            margin: 8px 0;
            border-radius: 12px;
        }

        .DR_Scroll_Inner::-webkit-scrollbar-thumb {
            background: rgba(var(--DR-blue), 0.4);
            border-radius: 4px;
        }

        .DR_Search {
            align-self: stretch;
            height: 40px;
            padding: 0 12px;
            border-radius: 8px;
            border: none;
            -webkit-appearance: none;
            appearance: none;
            outline: 2px solid var(--dr-card-border);
            outline-offset: -2px;
            background: var(--dr-card-bg);
            font-size: 14px;
            font-weight: 600;
            color: var(--dr-text);
            transition: outline-color var(--DR-motion) ease;
        }

        .DR_Search:focus {
            outline-color: rgba(var(--DR-blue), 0.35);
        }

        .DR_Quest_Item {
            display: flex;
            align-items: center;
            gap: 8px;
            align-self: stretch;
            min-height: 56px;
            padding: 8px 10px;
            box-sizing: border-box;
            border-radius: 8px;
            outline: 1.5px solid var(--dr-card-border);
            outline-offset: -1px;
            background: var(--dr-card-bg);
        }

        .DR_Quest_Item.done {
            outline-color: rgba(var(--DR-green), 0.25);
            background: rgba(var(--DR-green), 0.04);
        }

        .DR_Acc_Card {
            display: flex;
            align-items: center;
            gap: 10px;
            align-self: stretch;
            padding: 10px 12px;
            box-sizing: border-box;
            border-radius: 12px;
            outline: 1.5px solid var(--dr-card-border);
            outline-offset: -1px;
            background: var(--dr-card-bg);
            transition: outline-color var(--DR-motion) ease,
                        background var(--DR-motion) ease;
            position: relative;
            overflow: hidden;
        }
        .DR_Acc_Card:hover {
            outline-color: rgba(var(--DR-blue), 0.3);
            background: var(--dr-card-hover);
        }
        .DR_Acc_Avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            flex-shrink: 0;
            background: rgba(var(--DR-blue), 0.1);
            color: var(--dr-text);
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        }
        .DR_Acc_Info {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .DR_Acc_Name {
            font-size: 13px !important;
            font-weight: 700 !important;
            color: var(--dr-text) !important;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin: 0;
        }
        .DR_Acc_Sub {
            font-size: 11px !important;
            font-weight: 600 !important;
            color: var(--dr-text) !important;
            opacity: 0.5;
            margin: 0;
        }
        .DR_Acc_Sub.active {
            color: rgb(var(--DR-green)) !important;
            opacity: 1;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .DR_Acc_Action_Row {
            display: flex;
            gap: 6px;
            flex-shrink: 0;
        }
        .DR_Acc_Btn {
            height: 28px;
            padding: 0 10px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-size: 10px;
            font-weight: 800;
            color: #fff;
            background: rgb(var(--DR-blue));
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity var(--DR-motion) ease, transform var(--DR-motion) ease;
        }
        .DR_Acc_Btn:hover {
            opacity: 0.9;
            transform: scale(1.05);
        }
        .DR_Acc_Btn:active {
            transform: scale(0.95);
        }
        .DR_Acc_Btn.del {
            width: 28px;
            padding: 0;
            background: rgba(var(--DR-red), 0.15);
            color: rgb(var(--DR-red));
        }
        .DR_Acc_Btn.del:hover {
            background: rgb(var(--DR-red));
            color: #fff;
        }

        .DR_Quest_Icon {
            width: 36px;
            height: 36px;
            object-fit: contain;
            flex-shrink: 0;
        }

        .DR_Quest_Info {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 3px;
        }

        .DR_Quest_Title {
            font-size: 12px !important;
            font-weight: 700 !important;
            color: var(--dr-text) !important;
            opacity: 0.9;
            line-height: 1.25;
            overflow-wrap: anywhere;
        }

        .DR_Quest_Bar_Bg {
            height: 4px;
            border-radius: 2px;
            background: rgba(var(--DR-blue), 0.10);
            overflow: hidden;
            align-self: stretch;
        }

        .DR_Quest_Bar_Fill {
            height: 100%;
            background: rgb(var(--DR-blue));
            border-radius: 2px;
            transition: width var(--DR-motion-page) var(--DR-ease);
        }

        .DR_Quest_Item.done .DR_Quest_Bar_Fill {
            background: rgb(var(--DR-green));
        }

        .DR_Quest_Get_Btn {
            height: 28px;
            min-width: 52px;
            padding: 0 8px;
            flex-shrink: 0;
            border-radius: var(--DR-r-s);
            border: none;
            cursor: pointer;
            font-size: 10px;
            font-weight: 800;
            white-space: nowrap;
            background: rgb(var(--DR-blue));
            color: #fff;
            transition: filter var(--DR-motion-fast) ease,
                        transform var(--DR-motion-fast) ease,
                        background var(--DR-motion) ease;
        }

        .DR_Quest_Get_Btn:hover {
            filter: brightness(0.9);
            transform: scale(1.05);
        }

        .DR_Quest_Get_Btn:active {
            filter: brightness(0.9);
            transform: scale(0.9);
        }

        .DR_Field_Row,
        .DR_Setting_Row,
        .DR_Compact_Task {
            display: flex;
            align-items: center;
            justify-content: space-between;
            align-self: stretch;
            gap: 8px;
            min-width: 0;
        }

        .DR_Stack_Section {
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-self: stretch;
            min-width: 0;
        }

        .DR_Row_Text {
            display: flex;
            flex-direction: column;
            gap: 2px;
            flex: 1 1 auto;
            min-width: 0;
        }

        .DR_Row_Text .DR_T1,
        .DR_Row_Text .DR_T2 {
            overflow-wrap: anywhere;
        }

        .DR_Row_Text .DR_T1 {
            line-height: 1.12;
        }

        .DR_Row_Text .DR_T2 {
            font-size: 11px;
            line-height: 1.25;
        }

        .DR_Set_Input_Wrap {
            display: flex;
            align-items: center;
            height: 40px;
            min-width: 0;
            padding: 0 12px;
            box-sizing: border-box;
            gap: 6px;
            border-radius: 8px;
            outline: 2px solid var(--dr-card-border);
            outline-offset: -2px;
            transition: outline-color var(--DR-motion) ease;
            background: var(--dr-card-bg);
        }

        .DR_Set_Input_Wrap:focus-within {
            outline-color: rgba(var(--DR-blue), 0.35);
        }

        .DR_Set_Input_Wrap .DR_Input {
            text-align: left;
            font-size: 14px !important;
        }

        .DR_Back_Btn {
            align-self: flex-start;
            width: auto;
            opacity: 0.62;
            cursor: pointer;
            padding: 2px 0;
        }

        .DR_Panel_Card {
            align-self: stretch;
            background: var(--dr-card-bg);
            outline: 2px solid var(--dr-card-border);
            outline-offset: -2px;
            border-radius: 8px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .DR_Update_Banner {
            align-self: stretch;
            display: none;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            box-sizing: border-box;
            max-height: 0;
            opacity: 0;
            padding: 0 12px;
            margin: 0;
            overflow: hidden;
            border-radius: 8px;
            corner-shape: var(--DR-corner);
            background: var(--dr-card-bg);
            outline: 1.5px solid var(--dr-card-border);
            outline-offset: -1.5px;
            transition: max-height var(--DR-motion-page) var(--DR-ease),
                        opacity var(--DR-motion) ease,
                        padding var(--DR-motion-page) var(--DR-ease);
        }

        .DR_Update_Banner.on {
            display: flex;
            max-height: 56px;
            opacity: 1;
            padding: 10px 12px;
        }

        .DR_Quest_Get_Btn.done {
            background: rgba(var(--DR-green), 0.10);
            color: rgb(var(--DR-green));
            pointer-events: none;
        }

        @media (max-width: 480px) {
            .DR_Main_Box {
                padding: 14px;
            }
        }

        @media (max-width: 360px) {
            .DR_Main_Box {
                padding: 12px;
            }

            .DR_Input_Btn,
            .DR_Sm_Btn {
                min-width: 60px;
                width: 60px;
                padding-left: 8px;
                padding-right: 8px;
            }
        }

        #duorain-hide-button {
            cursor: grab;
            touch-action: none;
            flex: none;
            min-width: 92px;
            height: 40px;
            padding: 10px 12px;
            justify-content: center;
            align-items: center;
            gap: 6px;
            color: var(--dr-text);
            background: var(--dr-panel-bg) !important;
            outline: 2px solid var(--dr-card-border);
            outline-offset: -2px;
            box-shadow: var(--dr-panel-shadow);
            backdrop-filter: blur(20px) saturate(1.6);
            -webkit-backdrop-filter: blur(20px) saturate(1.6);
            transition: background var(--DR-motion) ease,
                        outline var(--DR-motion) ease,
                        box-shadow var(--DR-motion) ease,
                        color var(--DR-motion) ease,
                        filter var(--DR-motion-fast) ease,
                        transform var(--DR-motion-fast) ease;
        }

        #duorain-hide-button:active {
            cursor: grabbing;
        }

        #duorain-hide-button .DR_Hide_Icon_Stack {
            display: grid;
            place-items: center;
            width: 24px;
            height: 18px;
            flex: 0 0 24px;
        }

        #duorain-hide-button svg {
            display: block !important;
            grid-area: 1 / 1;
            color: inherit;
            fill: currentColor !important;
            transition: color var(--DR-motion) ease,
                        opacity var(--DR-motion) ease,
                        filter var(--DR-motion) ease,
                        transform var(--DR-motion) ease;
        }

        #duorain-hide-button svg path {
            fill: currentColor !important;
        }

        #duorain-hide-button #hide-icon {
            opacity: 1;
            transform: scale(1);
        }

        #duorain-hide-button #show-icon {
            opacity: 0;
            transform: scale(0.85);
        }

        #duorain-hide-button.duorain-show-mode #hide-icon {
            opacity: 0;
            transform: scale(0.85);
        }

        #duorain-hide-button.duorain-show-mode #show-icon {
            opacity: 1;
            transform: scale(1);
        }

        #duorain-hide-button.duorain-show-mode {
            background: var(--dr-panel-bg) !important;
            outline-color: var(--dr-card-border);
            color: var(--dr-text);
        }

        #DR_Main_Content {
            transition: opacity var(--DR-motion) ease,
                        filter var(--DR-motion) ease;
        }

        #DR_Main_Content.dr-disabled > *:not(#DR_User_Row):not(#DR_User_Row_Divider):not(#DR_Page_AccountManager) {
            pointer-events: none;
            opacity: 0.5;
            filter: grayscale(1);
        }

        #DR_Root button {
            -webkit-tap-highlight-color: transparent;
        }

        #DR_Root button:focus,
        #DR_Root button:focus-visible,
        #DR_Root button:active {
            outline-style: solid !important;
            outline-width: 2px !important;
            outline-color: var(--focus-outline, var(--dr-card-border)) !important;
            outline-offset: -2px !important;
        }

        .DR_Modal_Overlay {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            z-index: 1000;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: opacity var(--DR-motion-page) var(--DR-ease),
                        visibility var(--DR-motion-page) var(--DR-ease),
                        backdrop-filter var(--DR-motion-page) var(--DR-ease);
        }

        .DR_Modal_Overlay.show {
            opacity: 1;
            visibility: visible;
        }

        .DR_Modal_Box {
            background: var(--dr-bg);
            border: 1px solid var(--dr-card-border);
            border-radius: 16px;
            padding: 20px;
            width: 270px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 8px;
            transform: scale(0.9);
            transition: transform var(--DR-motion-page) var(--DR-ease);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .DR_Modal_Overlay.show .DR_Modal_Box {
            transform: scale(1);
        }

        .solving-btn {
            position: relative;
            min-width: 150px;
            font-size: 17px;
            border: none;
            border-bottom: 4px solid #2b70c9;
            border-radius: 16px;
            padding: 13px 16px;
            transition: filter 0.1s, color 0.1s;
            font-weight: 700;
            letter-spacing: .8px;
            background: #1cb0f6;
            color: #ffffff;
            cursor: pointer;
        }
        .solve-btn {
            position: relative;
            min-width: 100px;
            font-size: 17px;
            border: none;
            border-bottom: 4px solid #e0a500;
            border-radius: 16px;
            padding: 13px 16px;
            transition: filter 0.1s, color 0.1s;
            font-weight: 700;
            letter-spacing: .8px;
            background: #ffc800;
            color: #ffffff;
            cursor: pointer;
        }
        .auto-solver-btn:hover {
            filter: brightness(1.15);
        }
        .auto-solver-btn:active {
            border-bottom-width: 0px;
            margin-bottom: 4px;
            top: 4px;
        }

        /* Dark Mode Theme overrides for text color only */
        html[data-duo-theme="dark"] .solving-btn,
        html[data-duo-theme="dark"] .solve-btn,
        html._2L9MF .solving-btn,
        html._2L9MF .solve-btn {
            color: #202f36;
        }
        ._1lzAb._1Exx3 {
            padding-bottom: 0px !important;
        }

        #DR_User_Row {
            cursor: pointer;
            transition: filter var(--DR-motion-fast) ease,
                        transform var(--DR-motion-fast) ease,
                        background var(--DR-motion) ease,
                        border-color var(--DR-motion) ease;
        }

        #DR_User_Row:hover {
            filter: brightness(0.9);
            transform: scale(1.02);
            background: var(--dr-card-bg-hover, var(--dr-card-bg));
            border-color: rgb(var(--DR-blue));
        }
        #DR_User_Row:active {
            transform: scale(0.98);
        }

        @media (hover: none) {
            .DR_Btn:hover,
            .DR_Hash_Btn:hover,
            .DR_Input_Btn:hover,
            .DR_Sm_Btn:hover,
            .DR_Shop_Btn:hover,
            .DR_Acc_Btn:hover,
            .DR_Quest_Get_Btn:hover,
            .auto-solver-btn:hover,
            #DR_User_Row:hover {
                filter: none !important;
                transform: none !important;
                opacity: 1 !important;
            }
            .DR_Select:hover {
                outline-color: var(--dr-card-border) !important;
            }
            .DR_Select_Option:hover {
                background: transparent !important;
                color: var(--dr-text) !important;
            }
            .DR_Shop_Card:hover,
            .DR_Acc_Card:hover {
                outline-color: var(--dr-card-border) !important;
                background: var(--dr-card-bg) !important;
            }
        }
    `;

  const loadCss = `
        .dr-spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(var(--DR-blue), 0.15);
            border-top-color: rgb(var(--DR-blue));
            border-radius: 50%;
            -webkit-animation: dr-spin 0.65s linear infinite;
            animation: dr-spin 0.65s linear infinite;
            box-sizing: border-box;
        }

        @-webkit-keyframes dr-spin {
            to { -webkit-transform: rotate3d(0, 0, 1, 360deg); }
        }
        @keyframes dr-spin {
            to { transform: rotate3d(0, 0, 1, 360deg); }
        }
    `;

  const uiHtml = `
        <div class="DR_Notif_Main dr-light" id="DR_Notif_Main"></div>
        <div class="DR_Main" id="DR_Main">
            <div class="DR_HStack_8" style="align-self: flex-end;">
                <button type="button" class="DR_Btn DR_Btn_Eel DR_NoSel dr-light" id="duorain-hide-button">
                    <span class="DR_Hide_Icon_Stack">${icons.hideBtn}${icons.showBtn}</span>
                    <span id="hide-show-text" class="DR_T1 DR_NoSel" style="font-size: 14px; line-height: 1; color: inherit;">Hide</span>
                </button>
            </div>
            <div class="DR_Main_Box dr-light" id="DR_Main_Box">
                <div class="DR_Modal_Overlay" id="DR_Confirm_Modal">
                    <div class="DR_Modal_Box">
                        <div class="DR_Notif_Ico" style="color: rgb(243, 156, 18); width: 32px; height: 32px; margin-bottom: 4px;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        </div>
                        <p class="DR_T1 DR_NoSel">Action Required</p>
                        <p class="DR_T2 DR_NoSel" style="font-size: 12px; margin-bottom: 6px;">XP Farm is currently running. Do you want to stop it to run Auto League?</p>
                        <div class="DR_HStack_8" style="margin-top: 4px;">
                            <button class="DR_Sm_Btn DR_Btn_Eel DR_NoSel" id="DR_Modal_Cancel" style="flex: 1; outline-color: transparent;">
                                <span class="DR_Sm_Btn_Label" style="color: var(--dr-text);">CANCEL</span>
                            </button>
                            <button class="DR_Sm_Btn DR_NoSel" id="DR_Modal_Confirm" style="flex: 1;">
                                <span class="DR_Sm_Btn_Label" style="color: #fff;">STOP & RUN</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="DR_Page active" id="DR_Page_1">
                    <div class="DR_HStack_Auto" id="DR_Header_Row" style="align-self: stretch;">
                        <div class="DR_NoSel" style="display: flex; flex-direction: column; justify-content: center; gap: 2px;">
                            <div class="DR_Wordmark DR_NoSel">
                                <span style="color: var(--dr-text);">Duo</span>
                                <span class="dr-rain">Rain</span>
                            </div>
                            <span class="DR_T2 DR_Hover_1" id="DR_Version_Btn" style="font-size: 11px; font-weight: 700; letter-spacing: 0.4px; opacity: 0.6; cursor: pointer; align-self: flex-start; line-height: 1;">v${drVersion}</span>
                        </div>
                        <div class="DR_HStack_8" style="width: auto;">
                            <div class="DR_Btn DR_Btn_Icon DR_NoSel" id="DR_Web_Btn" style="background: rgb(var(--DR-blue)); outline: 2px solid rgba(255, 255, 255, .18); outline-offset: -2px;">
                                ${icons.webBtn}
                            </div>
                            <div class="DR_Btn DR_Btn_Icon DR_NoSel" id="DR_Discord_Btn" style="background: rgb(88, 101, 242); outline: 2px solid rgba(0, 0, 0, .18); outline-offset: -2px;">
                                ${icons.discordBtn}
                            </div>
                            <div class="DR_Btn DR_Btn_Icon DR_NoSel" id="DR_GitHub_Btn" style="background: #24292e; outline: 2px solid rgba(255, 255, 255, .18); outline-offset: -2px;">
                                ${icons.githubBtn}
                            </div>
                        </div>
                    </div>

                    <div class="DR_Update_Banner" id="DR_Update_Banner">
                        <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1 1 auto;">
                            <div style="width: 26px; height: 26px; border-radius: 50%; background: rgb(var(--DR-blue)); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"></path><path d="M5 12l7-7 7 7"></path></svg>
                            </div>
                            <div style="min-width: 0; display: flex; flex-direction: column; gap: 1px;">
                                <p class="DR_T1 DR_NoSel" style="font-size: 12px; line-height: 1.2;">Update available</p>
                                <p class="DR_T2 DR_NoSel" id="DR_Update_Version_Text" style="font-size: 11px; line-height: 1.2;"></p>
                            </div>
                        </div>
                        <button type="button" class="DR_Sm_Btn DR_NoSel" id="DR_Update_Btn" style="flex-shrink: 0; min-width: 66px;">
                            <span class="DR_Sm_Btn_Label" style="color: #fff;">UPDATE</span>
                        </button>
                    </div>
                    <div id="DR_Main_Content" class="dr-disabled" style="display: flex; flex-direction: column; gap: 8px; width: 100%; transition: opacity var(--DR-motion) ease, filter var(--DR-motion) ease;">
                        <div class="DR_Divider" id="DR_User_Row_Divider" style="display: none;"></div>
                        <div class="DR_Profile_Block" id="DR_User_Row" style="display: none; position: relative; background: var(--dr-card-bg); border: 1.5px solid var(--dr-card-border); border-radius: 8px; padding: 10px; align-items: center; gap: 8px; cursor: pointer;">
                            <div class="DR_Avatar" id="DR_Avatar">${icons.avatar}</div>
                            <div class="DR_VStack_4" style="flex: 1 0 0; min-width: 0; align-items: flex-start;">
                                <p class="DR_T1 DR_NoSel" id="DR_UName" style="font-size: 14px; align-self: stretch; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-right: 16px;"></p>
                                <span class="DR_T2 DR_NoSel" id="DR_UAccCount" style="display: none; font-size: 11px; opacity: 0.75;"></span>
                                <div class="DR_HStack_4" id="DR_User_Stats_Row" style="gap: 8px; flex-wrap: wrap;">
                                    <div class="DR_HStack_4" style="gap: 3px;">
                                        <img class="DR_Stat_Ico" src="${icons.xpIcon}">
                                        <span class="DR_Stat_Val DR_NoSel" id="DR_UXP">0</span>
                                    </div>
                                    <div class="DR_HStack_4" style="gap: 3px;">
                                        <img class="DR_Stat_Ico" src="${icons.gemIcon}">
                                        <span class="DR_Stat_Val DR_NoSel" id="DR_UGems">0</span>
                                    </div>
                                    <div class="DR_HStack_4" style="gap: 3px;">
                                        <img class="DR_Stat_Ico" src="${icons.streakIcon}">
                                        <span class="DR_Stat_Val DR_NoSel" id="DR_UStreak">0</span>
                                    </div>
                                    <div class="DR_HStack_4" id="DR_ULeague_Wrap" style="gap: 3px; display: none;">
                                        <img class="DR_Stat_Ico" id="DR_ULeague_Ico" src="${leagueBadgeUrl()}">
                                        <span class="DR_Stat_Val DR_NoSel" id="DR_ULeague_Rank">#0</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="DR_HStack_8" style="align-self: stretch; align-items: center;">
                            <div class="DR_Btn DR_Btn_Icon DR_Btn_Eel DR_NoSel" id="DR_Conn_Btn" style="transition: background var(--DR-motion) ease, outline var(--DR-motion) ease, color var(--DR-motion) ease; pointer-events: none;">
                                <span id="DR_Conn_Ico" style="display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 20px; height: 20px;"></span>
                            </div>
                            <div class="DR_Btn DR_Btn_Eel DR_NoSel" id="DR_Mode_Toggle_Btn" style="display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 13px; font-weight: 700; border-radius: 8px; flex: 1; color: var(--dr-text); cursor: pointer; padding: 0 8px; white-space: nowrap;">
                                <span id="DR_Mode_Toggle_Ico" style="display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 20px; height: 20px;"></span>
                                <span id="DR_Mode_Toggle_Lbl">Native Mode</span>
                            </div>
                            <div class="DR_Btn DR_Btn_Icon DR_Btn_Eel DR_NoSel" id="DR_TopSettings_Btn" title="Settings" style="color: var(--dr-text); cursor: pointer;">
                                ${icons.settingsBtn}
                            </div>
                        </div>
                        <div class="DR_Divider"></div>
                        <div id="DR_Native_Sections" style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
                            <div class="DR_Farm_Sec">
                                <div class="DR_HStack_4" style="align-self: stretch; min-width: 0;">
                                    <p class="DR_T1 DR_NoSel" style="font-size: 14px; font-weight: 600;">How much XP would you like to get?</p>
                                </div>
                                <div class="DR_HStack_8">
                                    <button class="DR_Hash_Btn" id="DR_XP_Hash" data-inf="false" title="Toggle infinite loops">${icons.hash}</button>
                                    <div class="DR_Input_Wrap">
                                        <input type="number" class="DR_Input DR_NoSel" id="DR_XP_Input" placeholder="0" min="30">
                                    </div>
                                    <button class="DR_Input_Btn DR_NoSel" id="DR_XP_Btn" disabled>
                                        <span class="DR_Btn_Label" id="DR_XP_Lbl" style="color: #fff;">RUN</span>
                                    </button>
                                </div>
                                <div class="DR_Prog_Wrap" id="DR_XP_Prog">
                                    <div class="DR_Prog_Fill" id="DR_XP_Fill"></div>
                                </div>
                            </div>
                            <div class="DR_Divider"></div>
                            <div class="DR_Farm_Sec">
                                <div class="DR_HStack_4" style="align-self: stretch; min-width: 0;">
                                    <p class="DR_T1 DR_NoSel" style="font-size: 14px; font-weight: 600;">How many Gems would you like to get?</p>
                                </div>
                                <div class="DR_HStack_8">
                                    <button class="DR_Hash_Btn dr-inf-active" id="DR_Gem_Hash" data-inf="true" title="Toggle infinite loops">${icons.inf}<span class="DR_Hash_Lbl">Infinite</span></button>
                                    <div class="DR_Input_Wrap dr-inf-hidden">
                                        <input type="number" class="DR_Input DR_NoSel" id="DR_Gem_Input" placeholder="Loops" min="1" disabled value="Infinity">
                                    </div>
                                    <button class="DR_Input_Btn DR_NoSel" id="DR_Gem_Btn" disabled>
                                        <span class="DR_Btn_Label" id="DR_Gem_Lbl" style="color: #fff;">RUN</span>
                                    </button>
                                </div>
                                <div class="DR_Prog_Wrap" id="DR_Gem_Prog">
                                    <div class="DR_Prog_Fill" id="DR_Gem_Fill"></div>
                                </div>
                            </div>
                            <div class="DR_Divider"></div>
                            <div class="DR_Farm_Sec">
                                <div class="DR_HStack_4" style="align-self: stretch; min-width: 0;">
                                    <p class="DR_T1 DR_NoSel" style="font-size: 14px; font-weight: 600;">How many Streak Days to restore?</p>
                                </div>
                                <div class="DR_HStack_8">
                                    <button class="DR_Hash_Btn" id="DR_Streak_Hash" data-inf="false" title="Toggle infinite loops">${icons.hash}</button>
                                    <div class="DR_Input_Wrap">
                                        <input type="number" class="DR_Input DR_NoSel" id="DR_Streak_Input" placeholder="Days" min="1">
                                    </div>
                                    <button class="DR_Input_Btn DR_NoSel" id="DR_Streak_Btn" disabled>
                                        <span class="DR_Btn_Label" id="DR_Streak_Lbl" style="color: #fff;">RUN</span>
                                    </button>
                                </div>
                                <div class="DR_Prog_Wrap" id="DR_Streak_Prog">
                                    <div class="DR_Prog_Fill" id="DR_Streak_Fill"></div>
                                </div>
                            </div>
                        </div>
                        <div id="DR_Solver_Sections" style="display: none; flex-direction: column; gap: 8px; width: 100%;">
                            <div class="DR_Farm_Sec">
                                <div class="DR_HStack_4" style="align-self: stretch; min-width: 0;">
                                    <p class="DR_T1 DR_NoSel" style="font-size: 14px; font-weight: 600;">How many Path lessons to solve?</p>
                                </div>
                                <div class="DR_HStack_8">
                                    <button class="DR_Hash_Btn dr-inf-active" id="DR_Path_Hash" data-inf="true" title="Toggle infinite loops">${icons.inf}<span class="DR_Hash_Lbl">Infinite</span></button>
                                    <div class="DR_Input_Wrap dr-inf-hidden">
                                        <input type="number" class="DR_Input DR_NoSel" id="DR_Path_Input" placeholder="Lessons" min="1" disabled value="Infinity">
                                    </div>
                                    <button class="DR_Input_Btn DR_NoSel" id="DR_AutoPath_Btn" disabled>
                                        <span class="DR_Btn_Label" id="DR_AutoPath_Lbl" style="color: #fff;">RUN</span>
                                    </button>
                                </div>
                                <div class="DR_Prog_Wrap" id="DR_Path_Prog">
                                    <div class="DR_Prog_Fill" id="DR_Path_Fill"></div>
                                </div>
                            </div>
                            <div class="DR_Divider"></div>
                            <div class="DR_Farm_Sec">
                                <div class="DR_HStack_4" style="align-self: stretch; min-width: 0;">
                                    <p class="DR_T1 DR_NoSel" style="font-size: 14px; font-weight: 600;">How many Practice lessons to solve?</p>
                                </div>
                                <div class="DR_HStack_8">
                                    <button class="DR_Hash_Btn dr-inf-active" id="DR_Practice_Hash" data-inf="true" title="Toggle infinite loops">${icons.inf}<span class="DR_Hash_Lbl">Infinite</span></button>
                                    <div class="DR_Input_Wrap dr-inf-hidden">
                                        <input type="number" class="DR_Input DR_NoSel" id="DR_Practice_Input" placeholder="Lessons" min="1" disabled value="Infinity">
                                    </div>
                                    <button class="DR_Input_Btn DR_NoSel" id="DR_AutoPractice_Btn" disabled>
                                        <span class="DR_Btn_Label" id="DR_AutoPractice_Lbl" style="color: #fff;">RUN</span>
                                    </button>
                                </div>
                                <div class="DR_Prog_Wrap" id="DR_Practice_Prog">
                                    <div class="DR_Prog_Fill" id="DR_Practice_Fill"></div>
                                </div>
                            </div>
                        </div>
                        <div class="DR_Divider"></div>
                        <div class="DR_Btn DR_Btn_Blue_Ghost DR_NoSel DR_Nav_Btn" id="DR_Extra_Btn">
                            <div class="DR_Nav_Btn_L">
                                <img class="DR_NoSel" src="https://d35aaqx5ub95lt.cloudfront.net/vendor/7159c0b5d4250a5aea4f396d53f17f0c.svg" alt="" style="width: 22px; height: 22px; object-fit: contain; flex-shrink: 0;">
                                <p class="DR_Nav_Title DR_NoSel">Extra</p>
                            </div>
                            ${icons.arrowRight}
                        </div>
                    </div>
                </div>
                <div class="DR_Page" id="DR_Page_Extra">
                    <div class="DR_HStack_4 DR_NoSel DR_Back_Btn" id="DR_Extra_Back_Btn">
                        ${icons.back}
                        <p class="DR_T1">Back</p>
                    </div>
                    <div class="DR_HStack_4 DR_NoSel" style="align-self: stretch; gap: 8px; margin-bottom: 8px;">
                        <img class="DR_NoSel" src="https://d35aaqx5ub95lt.cloudfront.net/vendor/7159c0b5d4250a5aea4f396d53f17f0c.svg" alt="" style="width: 34px; height: 34px; object-fit: contain; flex-shrink: 0;">
                        <div class="DR_Row_Text">
                            <p class="DR_T1 DR_NoSel" style="font-size: 14px; font-weight: 600;">Extra Features</p>
                            <p class="DR_T2 DR_NoSel">Additional utilities and statistics</p>
                        </div>
                    </div>
                    <div class="DR_Btn DR_Btn_Blue_Ghost DR_NoSel DR_Nav_Btn" id="DR_Shop_Btn">
                        <div class="DR_Nav_Btn_L">
                            <img class="DR_NoSel" src="https://d35aaqx5ub95lt.cloudfront.net/vendor/0e58a94dda219766d98c7796b910beee.svg" alt="" style="width: 22px; height: 22px; object-fit: contain; flex-shrink: 0;">
                            <p class="DR_Nav_Title DR_NoSel">Shop Items</p>
                        </div>
                        ${icons.arrowRight}
                    </div>
                    <div class="DR_Btn DR_Btn_Blue_Ghost DR_NoSel DR_Nav_Btn" id="DR_Quest_Nav_Btn">
                        <div class="DR_Nav_Btn_L">
                            <img class="DR_NoSel" src="https://d35aaqx5ub95lt.cloudfront.net/vendor/7ef36bae3f9d68fc763d3451b5167836.svg" alt="" style="width: 22px; height: 22px; object-fit: contain; flex-shrink: 0;">
                            <p class="DR_Nav_Title DR_NoSel">Quests Center</p>
                        </div>
                        ${icons.arrowRight}
                    </div>
                    <div class="DR_Btn DR_Btn_Blue_Ghost DR_NoSel DR_Nav_Btn" id="DR_Tools_Nav_Btn">
                        <div class="DR_Nav_Btn_L">
                            <img class="DR_NoSel" src="${DUO_LEAGUES_CDN}a8e5c18e80054228b2c61168846ff643.svg" alt="" style="width: 22px; height: 22px; object-fit: contain; flex-shrink: 0;">
                            <p class="DR_Nav_Title DR_NoSel">Social Tools</p>
                        </div>
                        ${icons.arrowRight}
                    </div>
                    <div class="DR_Btn DR_Btn_Blue_Ghost DR_NoSel DR_Nav_Btn" id="DR_Feed_Nav_Btn">
                        <div class="DR_Nav_Btn_L">
                            <img class="DR_NoSel" src="${DUO_LEAGUES_CDN}2ceb401cae52712705b66a77df83ce40.svg" alt="" style="width: 22px; height: 22px; object-fit: contain; flex-shrink: 0;">
                            <p class="DR_Nav_Title DR_NoSel">Activity Feed</p>
                        </div>
                        ${icons.arrowRight}
                    </div>
                    <div class="DR_Btn DR_Btn_Blue_Ghost DR_NoSel DR_Nav_Btn" id="DR_XPSummaries_Btn">
                        <div class="DR_Nav_Btn_L">
                            <img class="DR_NoSel" src="${icons.xpIcon}" alt="" style="width: 22px; height: 22px; object-fit: contain; flex-shrink: 0;">
                            <p class="DR_Nav_Title DR_NoSel">XP Summaries</p>
                        </div>
                        ${icons.arrowRight}
                    </div>
                    <div class="DR_Btn DR_Btn_Blue_Ghost DR_NoSel DR_Nav_Btn" id="DR_Board_Nav_Btn">
                        <div class="DR_Nav_Btn_L">
                            <img id="DR_Board_Nav_Ico" src="${leagueBadgeUrl()}" alt="" style="width: 22px; height: 22px; flex-shrink: 0; object-fit: contain;">
                            <p class="DR_Nav_Title DR_NoSel">Leaderboard</p>
                        </div>
                        ${icons.arrowRight}
                    </div>
                    <div class="DR_Divider"></div>
                    <div class="DR_Farm_Sec">
                        <div class="DR_Compact_Task">
                            <div class="DR_Row_Text">
                                <p class="DR_T1 DR_NoSel">Remove Hearts</p>
                                <p class="DR_T2 DR_NoSel">Drain hearts from this account</p>
                            </div>
                            <div class="DR_HStack_8" style="width: auto; flex-shrink: 0;">
                                <div class="DR_Set_Input_Wrap" style="width: 80px; flex-shrink: 0;">
                                    <input type="number" class="DR_Input DR_NoSel" id="DR_Hearts_Input" placeholder="1-5" min="1" max="5">
                                </div>
                                <button class="DR_Sm_Btn DR_NoSel" id="DR_Hearts_Btn" disabled>
                                    <span class="DR_Sm_Btn_Label" style="color: #fff;">RUN</span>
                                </button>
                            </div>
                        </div>
                        <div class="DR_Prog_Wrap" id="DR_Hearts_Prog" style="align-self: stretch;">
                            <div class="DR_Prog_Fill" id="DR_Hearts_Fill"></div>
                        </div>
                    </div>
                    <div class="DR_Divider"></div>
                    <div class="DR_Farm_Sec">
                        <div class="DR_Compact_Task">
                            <div class="DR_Row_Text">
                                <p class="DR_T1 DR_NoSel">Auto League</p>
                                <p class="DR_T2 DR_NoSel">Target specific rank position</p>
                            </div>
                            <div class="DR_HStack_8" style="width: auto; flex-shrink: 0;">
                                <div class="DR_Select" id="DR_League_Select" data-value="1" style="width: 80px; flex-shrink: 0;">
                                    <div class="DR_Select_Trigger">
                                        <span class="DR_Select_Text"># 1</span>${icons.chevron}
                                    </div>
                                    <div class="DR_Select_Options"></div>
                                </div>
                                <button class="DR_Sm_Btn DR_NoSel" id="DR_League_Btn" disabled>
                                    <span class="DR_Sm_Btn_Label" id="DR_League_Lbl" style="color: #fff;">RUN</span>
                                </button>
                            </div>
                        </div>
                        <div class="DR_Prog_Wrap" id="DR_League_Prog" style="align-self: stretch;">
                            <div class="DR_Prog_Fill" id="DR_League_Fill"></div>
                        </div>
                    </div>
                </div>
                <div class="DR_Page" id="DR_Page_Settings">
                    <div class="DR_HStack_4 DR_NoSel DR_Back_Btn" id="DR_Settings_Back_Btn">
                        ${icons.back}
                        <p class="DR_T1">Back</p>
                    </div>
                    <div class="DR_HStack_4 DR_NoSel" style="align-self: stretch; gap: 8px; margin-bottom: 8px;">
                        <span style="color: var(--dr-text); width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
                                <path d="M 22.76,10.58 L 22.76,13.42 L 19.99,14.60 L 19.48,15.81 L 20.61,18.61 L 18.61,20.61 L 15.81,19.48 L 14.60,19.99 L 13.42,22.76 L 10.58,22.76 L 9.40,19.99 L 8.19,19.48 L 5.39,20.61 L 3.39,18.61 L 4.52,15.81 L 4.01,14.60 L 1.24,13.42 L 1.24,10.58 L 4.01,9.40 L 4.52,8.19 L 3.39,5.39 L 5.39,3.39 L 8.19,4.52 L 9.40,4.01 L 10.58,1.24 L 13.42,1.24 L 14.60,4.01 L 15.81,4.52 L 18.61,3.39 L 20.61,5.39 L 19.48,8.19 L 19.99,9.40 Z" /><circle cx="12" cy="12" r="4.32" />
                            </svg>
                        </span>
                        <div class="DR_Row_Text">
                            <p class="DR_T1 DR_NoSel" style="font-size: 14px; font-weight: 600;">Settings</p>
                            <p class="DR_T2 DR_NoSel">Configure script preferences</p>
                        </div>
                    </div>
                    <div style="align-self: stretch; display: flex; flex-direction: column; width: 100%; gap: 8px;">
                        <style>
                            .DR_Select.dropup .DR_Select_Options { top: auto; bottom: calc(100% + 8px); transform: translateY(10px); }
                            .DR_Select.dropup.open .DR_Select_Options { transform: translateY(0); }
                            .DR_Select_Option { border-left: 3px solid transparent; transition: background var(--DR-motion-fast) ease, border-color var(--DR-motion-fast) ease; }
                            .DR_Select_Option.selected {
                                background: linear-gradient(90deg, rgba(var(--DR-blue), 0.1) 0%, transparent 100%);
                                color: var(--dr-text);
                                border-left: 3px solid rgba(var(--DR-blue), 0.5);
                            }
                            #DR_Page_Settings .DR_HStack_Auto { margin: 0 !important; }
                            #DR_Page_Settings .DR_VStack_8 { gap: 8px; }
                            #DR_Page_Settings .DR_Select, #DR_Page_Settings .DR_Select_Options { border-radius: 8px !important; }
                        </style>
                        <div class="DR_VStack_8" style="align-self: stretch;">
                            <div class="DR_Setting_Row">
                                <div class="DR_Row_Text">
                                    <p class="DR_T1 DR_NoSel">Loop Interval</p>
                                    <p class="DR_T2 DR_NoSel">Interval between loops</p>
                                </div>
                                <div class="DR_HStack_8" style="width: auto;">
                                    <div class="DR_Set_Input_Wrap" style="width: 116px;">
                                        <input type="number" class="DR_Input DR_NoSel" id="DR_Delay_Input" placeholder="500">
                                        <p class="DR_T1 DR_NoSel" style="color: var(--dr-text); font-size: 13px; flex-shrink: 0; opacity: 0.8; margin-left: 6px;">ms</p>
                                    </div>
                                </div>
                            </div>
                            <div class="DR_Divider"></div>
                            <div class="DR_Setting_Row">
                                <div class="DR_Row_Text">
                                    <p class="DR_T1 DR_NoSel">XP Overshoot</p>
                                    <p class="DR_T2 DR_NoSel">Extra XP above target (30-500, 0 off)</p>
                                </div>
                                <div class="DR_HStack_8" style="width: auto;">
                                    <div class="DR_Set_Input_Wrap" style="width: 116px;">
                                        <input type="number" class="DR_Input DR_NoSel" id="DR_XpRoom_Input" placeholder="0">
                                        <p class="DR_T1 DR_NoSel" style="color: var(--dr-text); font-size: 13px; flex-shrink: 0; opacity: 0.8; margin-left: 6px;">xp</p>
                                    </div>
                                </div>
                            </div>
                            <div class="DR_Divider"></div>
                            <div class="DR_Setting_Row">
                                <div class="DR_Row_Text">
                                    <p class="DR_T1 DR_NoSel">Notification Position</p>
                                    <p class="DR_T2 DR_NoSel">Set where alerts should appear</p>
                                </div>
                                <div class="DR_HStack_8" style="width: auto;">
                                    <div class="DR_Select" id="DR_Notif_Select" data-value="bottom_center" style="width: 146px; font-size: 13px;">
                                        <div class="DR_Select_Trigger">
                                            <span class="DR_Select_Text">Bottom Center</span>${icons.chevron}
                                        </div>
                                        <div class="DR_Select_Options">
                                            <div class="DR_Select_Option" data-value="top_left">Top Left</div>
                                            <div class="DR_Select_Option" data-value="top_center">Top Center</div>
                                            <div class="DR_Select_Option" data-value="top_right">Top Right</div>
                                            <div class="DR_Select_Option" data-value="bottom_left">Bottom Left</div>
                                            <div class="DR_Select_Option selected" data-value="bottom_center">Bottom Center</div>
                                            <div class="DR_Select_Option" data-value="bottom_right">Bottom Right</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="DR_Divider"></div>
                            <div class="DR_Setting_Row">
                                <div class="DR_Row_Text">
                                    <p class="DR_T1 DR_NoSel">On-Client Duolingo Max</p>
                                    <p class="DR_T2 DR_NoSel">Unlock Max on client side</p>
                                </div>
                                <div class="DR_HStack_8" style="width: auto;">
                                    <div class="DR_Toggle" id="DR_LocalMax_Toggle"><div class="DR_Toggle_Knob"></div></div>
                                </div>
                            </div>
                            <div class="DR_Divider"></div>
                            <div class="DR_Setting_Row">
                                <div class="DR_Row_Text">
                                    <p class="DR_T1 DR_NoSel">EZ Quiz</p>
                                    <p class="DR_T2 DR_NoSel">Enable custom lesson &amp; instant story</p>
                                </div>
                                <div class="DR_HStack_8" style="width: auto;">
                                    <div class="DR_Toggle" id="DR_EZQuiz_Toggle"><div class="DR_Toggle_Knob"></div></div>
                                </div>
                            </div>
                            <div class="DR_Divider"></div>
                            <div class="DR_Setting_Row">
                                <div class="DR_Row_Text">
                                    <p class="DR_T1 DR_NoSel">EZ Quiz Question Count</p>
                                    <p class="DR_T2 DR_NoSel">Set the number of questions for custom lessons</p>
                                </div>
                                <div class="DR_HStack_8" style="width: auto;">
                                    <div class="DR_Select dropup" id="DR_EZQuizLength_Select" data-value="default" style="width: 146px; font-size: 13px;">
                                        <div class="DR_Select_Trigger">
                                            <span class="DR_Select_Text">Default</span>${icons.chevron}
                                        </div>
                                        <div class="DR_Select_Options">
                                            <div class="DR_Select_Option" data-value="default">Default</div>
                                            <div class="DR_Select_Option" data-value="1">1</div>
                                            <div class="DR_Select_Option" data-value="2">2</div>
                                            <div class="DR_Select_Option" data-value="3">3</div>
                                            <div class="DR_Select_Option" data-value="4">4</div>
                                            <div class="DR_Select_Option" data-value="5">5</div>
                                            <div class="DR_Select_Option" data-value="6">6</div>
                                            <div class="DR_Select_Option" data-value="7">7</div>
                                            <div class="DR_Select_Option" data-value="8">8</div>
                                            <div class="DR_Select_Option" data-value="9">9</div>
                                            <div class="DR_Select_Option" data-value="10">10</div>
                                            <div class="DR_Select_Option" data-value="11">11</div>
                                            <div class="DR_Select_Option" data-value="12">12</div>
                                            <div class="DR_Select_Option" data-value="13">13</div>
                                            <div class="DR_Select_Option" data-value="14">14</div>
                                            <div class="DR_Select_Option" data-value="15">15</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="DR_Divider"></div>
                        <div class="DR_Btn DR_Btn_Blue_Ghost DR_NoSel DR_Nav_Btn" id="DR_Automations_Btn">
                            <div class="DR_Nav_Btn_L">
                                <img class="DR_NoSel" src="https://d35aaqx5ub95lt.cloudfront.net/images/goals/62bb241121ae018b28240eebffb9fc4a.svg" alt="" style="width: 22px; height: 22px; object-fit: contain; flex-shrink: 0;">
                                <p class="DR_Nav_Title DR_NoSel">Automations</p>
                            </div>
                            ${icons.arrowRight}
                        </div>
                        <div class="DR_Btn DR_Btn_Blue_Ghost DR_NoSel DR_Nav_Btn" id="DR_AutoSolver_Btn">
                            <div class="DR_Nav_Btn_L">
                                <img class="DR_NoSel" src="https://d35aaqx5ub95lt.cloudfront.net/images/goals/39f13d2de304cad2ac2f88b31a7e2ff4.svg" alt="" style="width: 22px; height: 22px; object-fit: contain; flex-shrink: 0;">
                                <p class="DR_Nav_Title DR_NoSel">Auto Solver</p>
                            </div>
                            ${icons.arrowRight}
                        </div>
                    </div>
                </div>
                <div class="DR_Page" id="DR_Page_Automations">
                    <div class="DR_HStack_4 DR_NoSel DR_Back_Btn" id="DR_Automations_Back_Btn">
                        ${icons.back}
                        <p class="DR_T1">Back</p>
                    </div>
                    <div class="DR_HStack_4 DR_NoSel" style="align-self: stretch; gap: 8px; margin-bottom: 8px;">
                        <img class="DR_NoSel" src="https://d35aaqx5ub95lt.cloudfront.net/images/goals/62bb241121ae018b28240eebffb9fc4a.svg" alt="" style="width: 34px; height: 34px; object-fit: contain; flex-shrink: 0;">
                        <div class="DR_Row_Text">
                            <p class="DR_T1 DR_NoSel" style="font-size: 14px; font-weight: 600;">Automations</p>
                            <p class="DR_T2 DR_NoSel">Configure automated background tasks</p>
                        </div>
                    </div>
                    <div style="align-self: stretch; display: flex; flex-direction: column; width: 100%;">
                        <div class="DR_VStack_8" style="align-self: stretch;">
                            <div class="DR_Setting_Row">
                                <div class="DR_Row_Text">
                                    <p class="DR_T1 DR_NoSel">Auto Join League</p>
                                    <p class="DR_T2 DR_NoSel">Joins a league for you on launch</p>
                                </div>
                                <div class="DR_HStack_8" style="width: auto;">
                                    <div class="DR_Toggle" id="DR_AutoJoin_Toggle"><div class="DR_Toggle_Knob"></div></div>
                                </div>
                            </div>
                            <div class="DR_Divider"></div>
                            <div class="DR_Setting_Row">
                                <div class="DR_Row_Text">
                                    <p class="DR_T1 DR_NoSel">Auto Block League</p>
                                    <p class="DR_T2 DR_NoSel">Blocks league users for you on launch</p>
                                </div>
                                <div class="DR_HStack_8" style="width: auto;">
                                    <div class="DR_Toggle" id="DR_AutoBlock_Toggle"><div class="DR_Toggle_Knob"></div></div>
                                </div>
                            </div>
                            <div class="DR_Divider"></div>
                            <div class="DR_Setting_Row">
                                <div class="DR_Row_Text">
                                    <p class="DR_T1 DR_NoSel">Auto Reach Rank</p>
                                    <p class="DR_T2 DR_NoSel">Farms to your saved rank on launch</p>
                                </div>
                                <div class="DR_HStack_8" style="width: auto;">
                                    <div class="DR_Toggle" id="DR_AutoReach_Toggle"><div class="DR_Toggle_Knob"></div></div>
                                </div>
                            </div>
                            <div class="DR_Divider"></div>
                            <div class="DR_Setting_Row">
                                <div class="DR_Row_Text">
                                    <p class="DR_T1 DR_NoSel">Auto Keep Streak</p>
                                    <p class="DR_T2 DR_NoSel">Keeps your streak for you on launch</p>
                                </div>
                                <div class="DR_HStack_8" style="width: auto;">
                                    <div class="DR_Toggle" id="DR_AutoStreak_Toggle"><div class="DR_Toggle_Knob"></div></div>
                                </div>
                            </div>
                            <div class="DR_Divider"></div>
                            <div class="DR_Setting_Row">
                                <div class="DR_Row_Text">
                                    <p class="DR_T1 DR_NoSel">Auto Quest Saver</p>
                                    <p class="DR_T2 DR_NoSel">Saves your quests for you on launch</p>
                                </div>
                                <div class="DR_HStack_8" style="width: auto;">
                                    <div class="DR_Toggle" id="DR_AutoQuest_Toggle"><div class="DR_Toggle_Knob"></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="DR_Page" id="DR_Page_Stats">
                    <div class="DR_HStack_4 DR_NoSel DR_Back_Btn" id="DR_Stats_Back_Btn">
                        ${icons.back}
                        <p class="DR_T1">Back</p>
                    </div>
                    <div class="DR_HStack_4 DR_NoSel" style="align-self: stretch; gap: 8px; margin-bottom: 8px;">
                        <img class="DR_NoSel" src="https://d35aaqx5ub95lt.cloudfront.net/vendor/3390675b86eeeab0b4119ccfcb5b186e.svg" alt="" style="width: 34px; height: 34px; object-fit: contain; flex-shrink: 0;">
                        <div class="DR_Row_Text">
                            <p class="DR_T1 DR_NoSel" style="font-size: 14px; font-weight: 600;">About DuoRain</p>
                            <p class="DR_T2 DR_NoSel">Your session metrics and credits</p>
                        </div>
                    </div>
                    <div class="DR_Panel_Card" id="DR_Changelog_Card" style="margin-bottom: 8px; display: none;">
                        <p class="DR_T1 DR_NoSel" style="font-weight: 800; margin-bottom: 6px;">Changelog</p>
                        <div id="DR_Changelog" class="DR_Scroll_Inner" style="max-height: 300px; width: 100%;">
                            <p class="DR_T2 DR_NoSel" style="text-align: center;">Loading changelog...</p>
                        </div>
                    </div>
                    <div class="DR_Panel_Card">
                        <div class="DR_HStack_Auto" style="align-self: stretch;">
                            <p class="DR_T1 DR_NoSel" style="font-weight: 800;">v${drVersion} Stats</p>
                            <span class="DR_T2 DR_NoSel" id="DR_Stats_Reset" style="font-size: 11px; cursor: pointer; opacity: 0.6;">Reset</span>
                        </div>
                        <div class="DR_HStack_Auto" style="align-self: stretch;">
                            <p class="DR_T2 DR_NoSel">XP Gained</p>
                            <p class="DR_T1 DR_NoSel" id="DR_Stat_XP">0</p>
                        </div>
                        <div class="DR_HStack_Auto" style="align-self: stretch;">
                            <p class="DR_T2 DR_NoSel">Gems Gained</p>
                            <p class="DR_T1 DR_NoSel" id="DR_Stat_Gems">0</p>
                        </div>
                        <div class="DR_HStack_Auto" style="align-self: stretch;">
                            <p class="DR_T2 DR_NoSel">Streak Gained</p>
                            <p class="DR_T1 DR_NoSel" id="DR_Stat_Streak">0</p>
                        </div>
                        <div class="DR_Divider" style="margin: 2px 0;"></div>
                        <div class="DR_HStack_Auto" style="align-self: stretch;">
                            <p class="DR_T2 DR_NoSel">Since</p>
                            <p class="DR_T2 DR_NoSel" id="DR_Stat_Since" style="opacity: 1;">—</p>
                        </div>
                        <div class="DR_Divider" style="margin: 2px 0;"></div>
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 3px; margin-top: 2px; align-self: stretch;">
                            <p class="DR_T2 DR_NoSel" style="text-align: center; font-size: 11px; line-height: 1.4; opacity: 1; margin: 0;">Created by <span class="DR_Hover_1" id="DR_Credit_Oracle" style="color: rgb(var(--DR-blue)); font-weight: 700; cursor: pointer;">OracleMythix</span> & <span class="DR_Hover_1" id="DR_Credit_Gorou" style="color: rgb(var(--DR-blue)); font-weight: 700; cursor: pointer;">oxGorou</span> under <a href="https://github.com/DuoXPy/DuoRain/blob/main/LICENSE" target="_blank" style="color: rgb(var(--DR-blue)); font-weight: 700; text-decoration: none;" class="DR_Hover_1">MIT license</a></p>
                            <span class="DR_Hover_1" id="DR_Open_Terms_Btn" style="color: rgb(var(--DR-blue)); font-size: 11px; font-weight: 700; cursor: pointer;">EULA & TOS</span>
                        </div>
                    </div>
                </div>
                <div class="DR_Page" id="DR_Page_XPSummaries">
                    <div class="DR_HStack_4 DR_NoSel DR_Back_Btn" id="DR_XPSummaries_Back_Btn">
                        ${icons.back}
                        <p class="DR_T1">Back</p>
                    </div>
                    <div class="DR_HStack_4 DR_NoSel" style="align-self: stretch; gap: 8px; margin-bottom: 8px;">
                        <img src="${icons.xpIcon}" alt="" style="width: 34px; height: 34px; flex-shrink: 0; object-fit: contain;">
                        <div class="DR_Row_Text">
                            <p class="DR_T1 DR_NoSel" style="font-size: 14px; font-weight: 600;">XP Summaries</p>
                            <p class="DR_T2 DR_NoSel">Your recent XP history</p>
                        </div>
                    </div>
                    <div class="DR_Panel_Card" style="display: flex; flex-direction: column; width: 100%; box-sizing: border-box;">
                        <div id="DR_XPHistory" class="DR_Scroll_Inner" style="max-height: 300px; width: 100%;">
                            <p class="DR_T2 DR_NoSel" style="text-align: center;">Loading...</p>
                        </div>
                    </div>
                </div>
                <div class="DR_Page" id="DR_Page_Status">
                    <div class="DR_HStack_4 DR_NoSel DR_Back_Btn" id="DR_Status_Back_Btn">
                        ${icons.back}
                        <p class="DR_T1">Back</p>
                    </div>
                    <div class="DR_HStack_4 DR_NoSel" style="align-self: stretch; gap: 8px; margin-bottom: 8px;">
                        <img class="DR_NoSel" src="${DUO_LEAGUES_CDN + "6df6337370e45c1b9a5029e78211d114.svg"}" alt="" style="width: 34px; height: 34px; object-fit: contain; flex-shrink: 0;">
                        <div class="DR_Row_Text">
                            <p class="DR_T1 DR_NoSel" style="font-size: 14px; font-weight: 600;">Status Manager</p>
                            <p class="DR_T2 DR_NoSel">Set your active Duolingo status emoji</p>
                        </div>
                    </div>
                    <input type="text" class="DR_Search DR_NoSel" id="DR_Status_Search" placeholder="Search statuses..." style="">
                    <div class="DR_Scroll_Inner" id="DR_Status_Container" style="max-height: 300px;">
                        <p class="DR_T2 DR_NoSel" style="text-align: center; padding: 8px 0;">Loading...</p>
                    </div>
                </div>
                <div class="DR_Page" id="DR_Page_Shop">
                    <div class="DR_HStack_4 DR_NoSel DR_Back_Btn" id="DR_Shop_Back_Btn">
                        ${icons.back}
                        <p class="DR_T1">Back</p>
                    </div>
                    <div class="DR_HStack_4 DR_NoSel" style="align-self: stretch; gap: 8px; margin-bottom: 8px;">
                        <img class="DR_NoSel" src="https://d35aaqx5ub95lt.cloudfront.net/vendor/0e58a94dda219766d98c7796b910beee.svg" alt="" style="width: 34px; height: 34px; object-fit: contain; flex-shrink: 0;">
                        <div class="DR_Row_Text">
                            <p class="DR_T1 DR_NoSel" style="font-size: 14px; font-weight: 600;">Shop Items</p>
                            <p class="DR_T2 DR_NoSel">Purchase boosts and powerups</p>
                        </div>
                    </div>
                    <input type="text" class="DR_Search DR_NoSel" id="DR_Shop_Search" placeholder="Search items..." style="">
                    <div class="DR_Scroll_Inner" id="DR_Shop_Container" style="max-height: 300px;">
                        <p class="DR_T2 DR_NoSel" style="text-align: center; padding: 8px 0;">Loading...</p>
                    </div>
                </div>
                <div class="DR_Page" id="DR_Page_Quests">
                    <div class="DR_HStack_4 DR_NoSel DR_Back_Btn" id="DR_Quests_Back_Btn">
                        ${icons.back}
                        <p class="DR_T1">Back</p>
                    </div>
                    <div class="DR_HStack_4 DR_NoSel" style="align-self: stretch; gap: 8px; margin-bottom: 8px;">
                        <img class="DR_NoSel" src="https://d35aaqx5ub95lt.cloudfront.net/vendor/7ef36bae3f9d68fc763d3451b5167836.svg" alt="" style="width: 34px; height: 34px; flex-shrink: 0; object-fit: contain;">
                        <div class="DR_Row_Text">
                            <p class="DR_T1 DR_NoSel" style="font-size: 14px; font-weight: 600;">Quest Center</p>
                            <p class="DR_T2 DR_NoSel">Manage and view your quests</p>
                        </div>
                    </div>
                    <div class="DR_Farm_Sec">
                        <div class="DR_HStack_Auto" style="align-self: stretch;">
                            <p class="DR_T1 DR_NoSel" style="font-size: 14px; font-weight: 600;">Quest Operations</p>
                            <button class="DR_Sm_Btn DR_NoSel" id="DR_Quest_Force_Btn" disabled style="height: 28px; padding: 0 10px; min-width: 66px;">
                                <span class="DR_Sm_Btn_Label" style="color: #fff; font-size: 11px;">FORCE ALL</span>
                            </button>
                        </div>
                        <div class="DR_Prog_Wrap" id="DR_QuestForce_Prog" style="align-self: stretch;">
                            <div class="DR_Prog_Fill" id="DR_QuestForce_Fill"></div>
                        </div>
                    </div>
                    <input type="text" class="DR_Search DR_NoSel" id="DR_Quest_Search" placeholder="Search quests..." style="">
                    <div id="DR_Quest_Container" class="DR_Scroll_Inner" style="max-height: 300px; width: 100%;">
                        <p class="DR_T2 DR_NoSel" style="text-align: center; padding: 8px 0;">Loading...</p>
                    </div>
                </div>
                <div class="DR_Page" id="DR_Page_AccountManager">
                    <div class="DR_HStack_4 DR_NoSel DR_Back_Btn" id="DR_AccMgr_Back_Btn">
                        ${icons.back}
                        <p class="DR_T1">Back</p>
                    </div>
                    <div class="DR_HStack_4 DR_NoSel" style="align-self: stretch; gap: 8px; margin-bottom: 8px;">
                        <img class="DR_NoSel" src="https://d35aaqx5ub95lt.cloudfront.net/images/super/11db6cd6f69cb2e3c5046b915be8e669.svg" alt="" style="width: 34px; height: 34px; object-fit: contain; flex-shrink: 0;">
                        <div class="DR_Row_Text">
                            <p class="DR_T1 DR_NoSel" style="font-size: 14px; font-weight: 600;">Account Manager</p>
                            <p class="DR_T2 DR_NoSel">Switch profiles and manage accounts</p>
                        </div>
                    </div>
                    <div class="DR_Farm_Sec">
                        <div class="DR_HStack_Auto" style="align-self: stretch;">
                            <p class="DR_T1 DR_NoSel" style="font-size: 14px; font-weight: 600;">Manage Accounts</p>
                            <button class="DR_Sm_Btn DR_NoSel" id="DR_AccSave_Btn" style="height: 28px; padding: 0 10px; min-width: auto; border-radius: 6px;">
                                <span class="DR_Sm_Btn_Label" style="color: #fff; font-size: 10px;">SAVE CURRENT</span>
                            </button>
                        </div>
                    </div>
                    <div class="DR_Divider"></div>
                    <div id="DR_AccList_Wrap" class="DR_Scroll_Inner" style="max-height: 300px; width: 100%; display: flex; flex-direction: column; gap: 8px;">
                        <p class="DR_T2 DR_NoSel" style="text-align: center; padding: 8px 0;">No saved accounts.</p>
                    </div>
                </div>
                <div class="DR_Page" id="DR_Page_Terms">
                    <div class="DR_HStack_Auto" style="align-self: stretch; margin-bottom: 4px;">
                        <div class="DR_NoSel" style="display: flex; flex-direction: column; justify-content: center; gap: 2px;">
                            <div class="DR_Wordmark DR_NoSel">
                                <span style="color: var(--dr-text);">Duo</span>
                                <span class="dr-rain">Rain</span>
                            </div>
                            <span class="DR_T2" style="font-size: 11px; font-weight: 700; letter-spacing: 0.4px; opacity: 0.6; line-height: 1;">v${drVersion}</span>
                        </div>
                        <div class="DR_Row_Text" style="text-align: right;">
                            <p class="DR_T1 DR_NoSel" style="font-size: 13px; font-weight: 700; color: var(--dr-text);">EULA & TOS</p>
                            <p class="DR_T2 DR_NoSel" id="DR_Terms_Status" style="font-size: 10px;">Please read and accept</p>
                        </div>
                    </div>
                    <div class="DR_Divider"></div>
                    <div id="DR_Terms_Content" class="DR_Scroll_Inner DR_Selectable" style="max-height: 250px; font-size: 11px; line-height: 1.5; color: var(--dr-text); white-space: pre-wrap; padding: 10px; background: var(--dr-card-bg); border: 1.5px solid var(--dr-card-border); border-radius: var(--DR-r-s); align-self: stretch; text-align: left;">Loading terms...</div>
                    <div class="DR_Divider"></div>
                    <div class="DR_HStack_8" style="margin-top: 4px;">
                        <button class="DR_Sm_Btn DR_Btn_Eel DR_NoSel" id="DR_Terms_Decline_Btn" style="flex: 1; outline-color: transparent;">
                            <span class="DR_Sm_Btn_Label" style="color: var(--dr-text);">DECLINE</span>
                        </button>
                        <button class="DR_Sm_Btn DR_NoSel" id="DR_Terms_Accept_Btn" style="flex: 1;">
                            <span class="DR_Sm_Btn_Label" style="color: #fff;">ACCEPT</span>
                        </button>
                    </div>
                </div>
                <div class="DR_Page" id="DR_Page_Tools">
                    <div class="DR_HStack_4 DR_NoSel DR_Back_Btn" id="DR_Tools_Back_Btn">
                        ${icons.back}
                        <p class="DR_T1">Back</p>
                    </div>
                    <div class="DR_HStack_4 DR_NoSel" style="align-self: stretch; gap: 8px; margin-bottom: 8px;">
                        <img class="DR_NoSel" src="${DUO_LEAGUES_CDN}a8e5c18e80054228b2c61168846ff643.svg" alt="" style="width: 34px; height: 34px; object-fit: contain; flex-shrink: 0;">
                        <div class="DR_Row_Text">
                            <p class="DR_T1 DR_NoSel" style="font-size: 14px; font-weight: 600;">Social Tools</p>
                            <p class="DR_T2 DR_NoSel">Interact with other users</p>
                        </div>
                    </div>
                    <div class="DR_VStack_8" style="align-self: stretch;">
                        <div class="DR_Set_Input_Wrap" style="align-self: stretch;">
                            <input type="text" class="DR_Input DR_NoSel" id="DR_Tools_User" placeholder="Target username">
                        </div>
                        <div class="DR_Compact_Task">
                            <div class="DR_Row_Text">
                                <p class="DR_T1 DR_NoSel">Block / Unblock</p>
                                <p class="DR_T2 DR_NoSel">Block or unblock the user above</p>
                            </div>
                            <div class="DR_Select" id="DR_Block_Select" data-value="block" style="width: 98px; flex-shrink: 0;">
                                <div class="DR_Select_Trigger">
                                    <span class="DR_Select_Text">Block</span>${icons.chevron}
                                </div>
                                <div class="DR_Select_Options">
                                    <div class="DR_Select_Option selected" data-value="block">Block</div>
                                    <div class="DR_Select_Option" data-value="unblock">Unblock</div>
                                </div>
                            </div>
                            <button class="DR_Sm_Btn DR_NoSel" id="DR_Block_Btn" disabled>
                                <span class="DR_Sm_Btn_Label" style="color: #fff;">RUN</span>
                            </button>
                        </div>
                        <div class="DR_Compact_Task">
                            <div class="DR_Row_Text">
                                <p class="DR_T1 DR_NoSel">Follow / Unfollow</p>
                                <p class="DR_T2 DR_NoSel">Follow or unfollow the user above</p>
                            </div>
                            <div class="DR_Select" id="DR_FollowSingle_Select" data-value="follow" style="width: 98px; flex-shrink: 0;">
                                <div class="DR_Select_Trigger">
                                    <span class="DR_Select_Text">Follow</span>${icons.chevron}
                                </div>
                                <div class="DR_Select_Options">
                                    <div class="DR_Select_Option selected" data-value="follow">Follow</div>
                                    <div class="DR_Select_Option" data-value="unfollow">Unfollow</div>
                                </div>
                            </div>
                            <button class="DR_Sm_Btn DR_NoSel" id="DR_FollowSingle_Btn" disabled>
                                <span class="DR_Sm_Btn_Label" style="color: #fff;">RUN</span>
                            </button>
                        </div>
                        <div class="DR_Compact_Task">
                            <div class="DR_Row_Text">
                                <p class="DR_T1 DR_NoSel">Send Gift</p>
                                <p class="DR_T2 DR_NoSel">Gift an item to the user above</p>
                            </div>
                            <div class="DR_Select" id="DR_Gift_Select" data-value="streak_freeze_gift" style="width: 98px; flex-shrink: 0;">
                                <div class="DR_Select_Trigger">
                                    <span class="DR_Select_Text">Freeze</span>${icons.chevron}
                                </div>
                                <div class="DR_Select_Options">
                                    <div class="DR_Select_Option selected" data-value="streak_freeze_gift">Freeze</div>
                                    <div class="DR_Select_Option" data-value="xp_boost_15_gift">XP Boost</div>
                                </div>
                            </div>
                            <button class="DR_Sm_Btn DR_NoSel" id="DR_Gift_Btn" disabled>
                                <span class="DR_Sm_Btn_Label" style="color: #fff;">RUN</span>
                            </button>
                        </div>
                        <div class="DR_Compact_Task">
                            <div class="DR_Row_Text">
                                <p class="DR_T1 DR_NoSel">Friend Streak / Quest</p>
                                <p class="DR_T2 DR_NoSel">Start a streak or quest with them</p>
                            </div>
                            <div class="DR_Select" id="DR_Friend_Select" data-value="streak" style="width: 98px; flex-shrink: 0;">
                                <div class="DR_Select_Trigger">
                                    <span class="DR_Select_Text">Streak</span>${icons.chevron}
                                </div>
                                <div class="DR_Select_Options">
                                    <div class="DR_Select_Option selected" data-value="streak">Streak</div>
                                    <div class="DR_Select_Option" data-value="quest">Quest</div>
                                </div>
                            </div>
                            <button class="DR_Sm_Btn DR_NoSel" id="DR_Friend_Btn" disabled>
                                <span class="DR_Sm_Btn_Label" style="color: #fff;">RUN</span>
                            </button>
                        </div>
                        <div class="DR_Divider"></div>
                        <div class="DR_Task_Group">
                            <div class="DR_Compact_Task">
                                <div class="DR_Row_Text">
                                    <p class="DR_T1 DR_NoSel">Mass Follow</p>
                                    <p class="DR_T2 DR_NoSel">Follow or unfollow in bulk</p>
                                </div>
                                <div class="DR_Select" id="DR_Follow_Select" data-value="follow" style="width: 98px; flex-shrink: 0;">
                                    <div class="DR_Select_Trigger">
                                        <span class="DR_Select_Text">Follow</span>${icons.chevron}
                                    </div>
                                    <div class="DR_Select_Options">
                                        <div class="DR_Select_Option selected" data-value="follow">Follow</div>
                                        <div class="DR_Select_Option" data-value="unfollow">Unfollow</div>
                                    </div>
                                </div>
                                <button class="DR_Sm_Btn DR_NoSel" id="DR_Follow_Btn" disabled>
                                    <span class="DR_Sm_Btn_Label" style="color: #fff;">RUN</span>
                                </button>
                            </div>
                            <div class="DR_Prog_Wrap" id="DR_Follow_Prog">
                                <div class="DR_Prog_Fill" id="DR_Follow_Fill"></div>
                            </div>
                        </div>
                        <div class="DR_Task_Group">
                            <div class="DR_Compact_Task">
                                <div class="DR_Row_Text">
                                    <p class="DR_T1 DR_NoSel">Mass Block</p>
                                    <p class="DR_T2 DR_NoSel">Block or unblock your league</p>
                                </div>
                                <div class="DR_Select" id="DR_BlockMass_Select" data-value="block" style="width: 98px; flex-shrink: 0;">
                                    <div class="DR_Select_Trigger">
                                        <span class="DR_Select_Text">Block</span>${icons.chevron}
                                    </div>
                                    <div class="DR_Select_Options">
                                        <div class="DR_Select_Option selected" data-value="block">Block</div>
                                        <div class="DR_Select_Option" data-value="unblock">Unblock</div>
                                    </div>
                                </div>
                                <button class="DR_Sm_Btn DR_NoSel" id="DR_Block_Mass_Btn" disabled>
                                    <span class="DR_Sm_Btn_Label" style="color: #fff;">RUN</span>
                                </button>
                            </div>
                            <div class="DR_Prog_Wrap" id="DR_Block_Mass_Prog">
                                <div class="DR_Prog_Fill" id="DR_Block_Mass_Fill"></div>
                            </div>
                        </div>
                        <div class="DR_Divider"></div>
                        <div class="DR_Compact_Task">
                            <div class="DR_Row_Text">
                                <p class="DR_T1 DR_NoSel">Privacy Status</p>
                                <p class="DR_T2 DR_NoSel">Change privacy status</p>
                            </div>
                            <div class="DR_Select" id="DR_Privacy_Select" data-value="public" style="width: 98px; flex-shrink: 0;">
                                <div class="DR_Select_Trigger">
                                    <span class="DR_Select_Text">Public</span>${icons.chevron}
                                </div>
                                <div class="DR_Select_Options">
                                    <div class="DR_Select_Option selected" data-value="public">Public</div>
                                    <div class="DR_Select_Option" data-value="private">Private</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="DR_Page" id="DR_Page_Board">
                    <div class="DR_HStack_4 DR_NoSel DR_Back_Btn" id="DR_Board_Back_Btn">
                        ${icons.back}
                        <p class="DR_T1">Back</p>
                    </div>
                    <div class="DR_HStack_4 DR_NoSel" style="align-self: stretch; gap: 8px; margin-bottom: 8px;">
                        <img id="DR_Board_Tier_Ico" src="${leagueBadgeUrl()}" alt="" style="width: 34px; height: 34px; flex-shrink: 0; object-fit: contain;">
                        <div class="DR_Row_Text">
                            <p id="DR_Board_Tier_Name" class="DR_T1 DR_NoSel" style="font-size: 14px; font-weight: 600;">Leaderboard</p>
                            <p class="DR_T2 DR_NoSel">Your current league</p>
                        </div>
                    </div>
                    <div class="DR_Btn DR_Btn_Blue_Ghost DR_NoSel DR_Nav_Btn" id="DR_Board_Status_Btn" style="align-self: stretch;">
                        <div class="DR_Nav_Btn_L">
                            <span id="DR_Board_Status_Ico" style="width: 22px; height: 22px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 15px; line-height: 1; overflow: hidden;">
                                <img src="${DUO_LEAGUES_CDN + "6df6337370e45c1b9a5029e78211d114.svg"}" alt="" style="width: 22px; height: 22px; object-fit: contain;">
                            </span>
                            <p class="DR_Nav_Title DR_NoSel">Set your status</p>
                        </div>
                        ${icons.arrowRight}
                    </div>
                    <div class="DR_Divider" style=""></div>
                    <div id="DR_Board_Container" class="DR_Scroll_Inner" style="max-height: 300px; width: 100%;"></div>
                </div>
                <div class="DR_Page" id="DR_Page_Feed">
                    <div class="DR_HStack_4 DR_NoSel DR_Back_Btn" id="DR_Feed_Back_Btn">
                        ${icons.back}
                        <p class="DR_T1">Back</p>
                    </div>
                    <div class="DR_HStack_4 DR_NoSel" style="align-self: stretch; gap: 8px;">
                        <img class="DR_NoSel" src="${DUO_LEAGUES_CDN}2ceb401cae52712705b66a77df83ce40.svg" alt="" style="width: 34px; height: 34px; object-fit: contain; flex-shrink: 0;">
                        <div class="DR_Row_Text">
                            <p class="DR_T1 DR_NoSel" style="font-size: 14px; font-weight: 600;">Activity Feed</p>
                            <p class="DR_T2 DR_NoSel">Recent activity from your friends</p>
                        </div>
                    </div>
                    <div id="DR_Feed_Container" class="DR_Scroll_Inner" style="max-height: 300px; width: 100%;"></div>
                </div>
                <div class="DR_Page" id="DR_Page_AutoSolver">
                    <div class="DR_HStack_4 DR_NoSel DR_Back_Btn" id="DR_AutoSolver_Back_Btn">
                        ${icons.back}
                        <p class="DR_T1">Back</p>
                    </div>
                    <div class="DR_HStack_4 DR_NoSel" style="align-self: stretch; gap: 8px; margin-bottom: 8px;">
                        <img class="DR_NoSel" src="https://d35aaqx5ub95lt.cloudfront.net/images/goals/39f13d2de304cad2ac2f88b31a7e2ff4.svg" alt="" style="width: 34px; height: 34px; object-fit: contain; flex-shrink: 0;">
                        <div class="DR_Row_Text">
                            <p class="DR_T1 DR_NoSel" style="font-size: 14px; font-weight: 600;">Auto Solver</p>
                            <p class="DR_T2 DR_NoSel">Configure question auto-solving settings</p>
                        </div>
                    </div>
                    <div style="align-self: stretch; display: flex; flex-direction: column; width: 100%;">
                        <div class="DR_VStack_8" style="align-self: stretch;">
                            <div class="DR_Setting_Row">
                                <div class="DR_Row_Text">
                                    <p class="DR_T1 DR_NoSel">Show Solve Buttons</p>
                                    <p class="DR_T2 DR_NoSel">Show Solve/Solve All buttons in footer</p>
                                </div>
                                <div class="DR_HStack_8" style="width: auto;">
                                    <div class="DR_Toggle" id="DR_SolverButtons_Toggle"><div class="DR_Toggle_Knob"></div></div>
                                </div>
                            </div>
                            <div class="DR_Divider"></div>
                            <div class="DR_Setting_Row">
                                <div class="DR_Row_Text">
                                    <p class="DR_T1 DR_NoSel">Auto Solve Mode</p>
                                    <p class="DR_T2 DR_NoSel">Solve questions automatically on start</p>
                                </div>
                                <div class="DR_HStack_8" style="width: auto;">
                                    <div class="DR_Toggle" id="DR_AutoSolver_Toggle"><div class="DR_Toggle_Knob"></div></div>
                                </div>
                            </div>
                            <div class="DR_Divider"></div>
                            <div class="DR_Setting_Row">
                                <div class="DR_Row_Text">
                                    <p class="DR_T1 DR_NoSel">Random Speed</p>
                                    <p class="DR_T2 DR_NoSel">Wait a random delay before solving</p>
                                </div>
                                <div class="DR_HStack_8" style="width: auto;">
                                    <div class="DR_Toggle" id="DR_RandomSpeed_Toggle"><div class="DR_Toggle_Knob"></div></div>
                                </div>
                            </div>
                            <div class="DR_Divider"></div>
                            <div class="DR_Setting_Row">
                                <div class="DR_Row_Text">
                                    <p class="DR_T1 DR_NoSel">Solve Speed (Fixed)</p>
                                    <p class="DR_T2 DR_NoSel">Delay if random speed is disabled</p>
                                </div>
                                <div class="DR_HStack_8" style="width: auto;">
                                    <div class="DR_Set_Input_Wrap" style="width: 116px;">
                                        <input type="number" class="DR_Input DR_NoSel" id="DR_SolveSpeed_Input" placeholder="400">
                                        <p class="DR_T1 DR_NoSel" style="color: var(--dr-text); font-size: 13px; flex-shrink: 0; opacity: 0.8; margin-left: 6px;">ms</p>
                                    </div>
                                </div>
                            </div>
                            <div class="DR_Divider"></div>
                            <div class="DR_Setting_Row">
                                <div class="DR_Row_Text">
                                    <p class="DR_T1 DR_NoSel">Min Solve Speed</p>
                                    <p class="DR_T2 DR_NoSel">Minimum delay for random speed</p>
                                </div>
                                <div class="DR_HStack_8" style="width: auto;">
                                    <div class="DR_Set_Input_Wrap" style="width: 116px;">
                                        <input type="number" step="0.1" class="DR_Input DR_NoSel" id="DR_SolveSpeedMin_Input" placeholder="2.8">
                                        <p class="DR_T1 DR_NoSel" style="color: var(--dr-text); font-size: 13px; flex-shrink: 0; opacity: 0.8; margin-left: 6px;">sec</p>
                                    </div>
                                </div>
                            </div>
                            <div class="DR_Divider"></div>
                            <div class="DR_Setting_Row">
                                <div class="DR_Row_Text">
                                    <p class="DR_T1 DR_NoSel">Max Solve Speed</p>
                                    <p class="DR_T2 DR_NoSel">Maximum delay for random speed</p>
                                </div>
                                <div class="DR_HStack_8" style="width: auto;">
                                    <div class="DR_Set_Input_Wrap" style="width: 116px;">
                                        <input type="number" step="0.1" class="DR_Input DR_NoSel" id="DR_SolveSpeedMax_Input" placeholder="12.4">
                                        <p class="DR_T1 DR_NoSel" style="color: var(--dr-text); font-size: 13px; flex-shrink: 0; opacity: 0.8; margin-left: 6px;">sec</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  if (typeof GM_addStyle === "function") {
    GM_addStyle(`${mainCss}${loadCss}`);
  } else {
    document.head.insertAdjacentHTML(
      "beforeend",
      `<style id="dr-style-inject">${mainCss}${loadCss}</style>`,
    );
  }
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div id="DR_Root">${uiHtml}</div>`,
  );

  let token = null;
  let userId = null;

  if (localStorage.getItem("dr_ez_quiz") === null) {
    localStorage.setItem("dr_ez_quiz", "false");
  }
  if (localStorage.getItem("dr_path_inf") === null) {
    localStorage.setItem("dr_path_inf", "true");
  }
  if (localStorage.getItem("dr_practice_inf") === null) {
    localStorage.setItem("dr_practice_inf", "true");
  }

  let solverButtonsEnabled =
    localStorage.getItem("dr_solver_buttons") !== "false";
  let autoSolverEnabled = localStorage.getItem("dr_auto_solver") === "true";
  let randomSpeedEnabled = localStorage.getItem("dr_random_speed") === "true";
  let solveSpeedMin =
    parseFloat(localStorage.getItem("dr_solve_speed_min")) || 2.8;
  let solveSpeedMax =
    parseFloat(localStorage.getItem("dr_solve_speed_max")) || 12.4;
  let solveSpeedFixed =
    parseInt(localStorage.getItem("dr_solve_speed_fixed")) || 400;
  let autoPathEnabled = localStorage.getItem("dr_auto_path") === "true";
  let autoPracticeEnabled = localStorage.getItem("dr_auto_practice") === "true";
  let pathLessonsRemaining = Infinity;
  let practiceLessonsRemaining = Infinity;
  let hasDecrementedForCurrentLesson = false;
  let lastHomeTime = 0;

  let isAutoMode = false;
  let headers = null;
  let user = null;
  let farmStates = {
    xp: false,
    gem: false,
    streak: false,
    league: false,
    follow: false,
    unfollow: false,
    blockmass: false,
    unblock: false,
  };
  let uiHidden = localStorage.getItem("dr_ui_hidden") === "true";
  let hideCollapseTimer = null;
  let panelCorner = localStorage.getItem("dr_panel_corner") || "br";
  let oldToken = null;
  let delayMs = (() => {
    const storedDelay = parseInt(localStorage.getItem("dr_delay") || "100", 10);
    return isNaN(storedDelay)
      ? 100
      : Math.min(60000, Math.max(50, storedDelay));
  })();
  let shopCache = [];
  let questState = null;
  let questStateTs = 0;
  let currentStatus = null;
  let streakKeepBusy = false;
  let autoBlockCohortKey = null;
  let pageId = 1;
  let bgCheckBusy = false;
  let connectBusy = false;
  let refreshStatsBusy = false;
  let questSaverBusy = false;
  let leagueCheckBusy = false;
  let xpHistoryBusy = false;
  let feedBusy = false;
  const DR_PAGE_TRANSITION_MS = 400;
  const DR_PAGE_FADE_DELAY_MS = 120;
  const DR_DRAG_SNAP_MS = 400;

  function wait(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  function safeJsonParse(text, fallback = null) {
    try {
      return text ? JSON.parse(text) : fallback;
    } catch {
      return fallback;
    }
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  }

  function statusFallback(status) {
    if (status && status.emoji) {
      return status.emoji;
    }
    const name = status && status.name ? status.name : "?";
    return name.charAt(0).toUpperCase();
  }

  function getToken() {
    const match = document.cookie.match(/(^| )jwt_token=([^;]+)/);
    if (match) {
      try {
        return decodeURIComponent(match[2]);
      } catch {
        return match[2];
      }
    }

    const storageKeys = ["jwt_token", "jwtToken", "duolingo_jwt"];
    for (const key of storageKeys) {
      const value = localStorage.getItem(key);
      if (value) return value;
    }
    return null;
  }

  function readToken(jwtStr) {
    try {
      if (!jwtStr || jwtStr.split(".").length < 2) {
        return null;
      }
      const base64Url = jwtStr.split(".")[1];
      const base64String = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const paddingLength =
        base64String.length + ((4 - (base64String.length % 4)) % 4);
      const paddedBase64 = base64String.padEnd(paddingLength, "=");

      const decodedString = decodeURIComponent(
        atob(paddedBase64)
          .split("")
          .map((char) => {
            return "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(""),
      );
      return JSON.parse(decodedString);
    } catch {
      return null;
    }
  }

  function setHeaders(tokenStr) {
    return {
      accept: "application/json",
      authorization: "Bearer " + tokenStr,
      "content-type": "application/json",
      cookie: "jwt_token=" + tokenStr,
      origin: "https://www.duolingo.com",
      "User-Agent": drUserAgent,
      "x-amzn-trace-id": "User=" + userId,
    };
  }

  function setGoalHeaders(tokenStr) {
    return {
      "Content-Type": "application/json",
      "x-requested-with": "XMLHttpRequest",
      accept: "application/json; charset=UTF-8",
      Authorization: "Bearer " + tokenStr,
      "User-Agent": drUserAgent,
      "x-amzn-trace-id": "User=" + userId,
    };
  }

  const forbiddenHeaders = {
    cookie: 1,
    origin: 1,
    "user-agent": 1,
    host: 1,
    referer: 1,
    "content-length": 1,
  };

  function fetchApi(method, url, data, customHeaders, signal, anonymous) {
    const rawHeaders = customHeaders || headers || {};
    const body =
      data === undefined || data === null ? null : JSON.stringify(data);

    if (signal && signal.aborted)
      return Promise.resolve({ status: 0, responseText: "" });

    return new Promise((resolve, reject) => {
      let onAbort = null;
      const cleanup = () => {
        if (signal && onAbort) signal.removeEventListener("abort", onAbort);
      };
      const settle = (fn, value) => {
        cleanup();
        fn(value);
      };
      const requestOptions = {
        method: method,
        url: url,
        headers: rawHeaders,
        data: body,
        onload: (response) => {
          settle(resolve, response);
        },
        onerror: () => {
          settle(resolve, { status: 0, responseText: "" });
        },
        timeout: 15000,
        ontimeout: () => {
          settle(resolve, { status: 0, responseText: "" });
        },
      };
      if (anonymous) {
        requestOptions.anonymous = true;
      }
      const handle = GM_xmlhttpRequest(requestOptions);
      if (signal) {
        onAbort = () => {
          try {
            if (handle && handle.abort) handle.abort();
          } catch {}
          settle(resolve, { status: 0, responseText: "" });
        };
        signal.addEventListener("abort", onAbort, { once: true });
      }
    });
  }

  const farmCtl = { xp: null, gem: null, streak: null, league: null };

  function farmSignal(type) {
    return farmCtl[type] ? farmCtl[type].signal : null;
  }

  function stopFarm(type) {
    farmStates[type] = false;
    if (farmCtl[type]) {
      farmCtl[type].abort();
      farmCtl[type] = null;
    }
  }

  function waitStop(ms, signal) {
    return new Promise((resolve) => {
      if (signal && signal.aborted) return resolve();
      let onAbort;
      const timer = setTimeout(() => {
        if (signal && onAbort) signal.removeEventListener("abort", onAbort);
        resolve();
      }, ms);
      if (signal) {
        onAbort = () => {
          clearTimeout(timer);
          resolve();
        };
        signal.addEventListener("abort", onAbort, { once: true });
      }
    });
  }

  function notify(type, title, body, onClick) {
    const container = document.getElementById("DR_Notif_Main");
    if (!container) {
      return;
    }

    const safeType = ["info", "success", "error", "warning"].includes(type)
      ? type
      : "info";
    const element = document.createElement("div");
    element.className = "DR_Notif_Box " + safeType;

    let iconMarkup = icons.info;
    if (safeType === "success") {
      iconMarkup = icons.success;
    }
    if (safeType === "error") {
      iconMarkup = icons.error;
    }
    if (safeType === "warning") {
      iconMarkup = icons.warning;
    }

    element.innerHTML = `
            <div class="DR_Notif_Ico">${iconMarkup}</div>
            <div style="flex: 1 0 0;">
                <div class="DR_T1 DR_NoSel"></div>
                <div class="DR_T2 DR_NoSel" style="margin-top: 2px;"></div>
            </div>
        `;
    const titleEl = element.querySelector(".DR_T1");
    const bodyEl = element.querySelector(".DR_T2");
    if (titleEl) titleEl.textContent = title || "";
    if (bodyEl) bodyEl.textContent = body || "";

    container.prepend(element);

    const h = element.offsetHeight;
    const atTop = notifPos.indexOf("top") === 0;
    element.style.transform = `translateY(${atTop ? -(h + 20) : h + 20}px) scale(0.9)`;

    let removeTimer;
    const dismiss = () => {
      clearTimeout(removeTimer);
      element.classList.remove("show");
      element.classList.add("hide");
      element.style[atTop ? "marginTop" : "marginBottom"] = -(h + 10) + "px";
      setTimeout(() => {
        element.remove();
      }, 400);
    };

    if (typeof onClick === "function") {
      element.style.cursor = "pointer";
      element.addEventListener("click", () => {
        dismiss();
        onClick();
      });
    }

    requestAnimationFrame(() => {
      element.classList.add("show");
    });

    removeTimer = setTimeout(dismiss, onClick ? 8000 : 4000);
  }

  function versionSegments(v) {
    return String(v || "")
      .trim()
      .split(".")
      .map((s) => s.trim());
  }

  function compareVersions(a, b) {
    const pa = versionSegments(a);
    const pb = versionSegments(b);
    const len = Math.max(pa.length, pb.length);
    for (let i = 0; i < len; i++) {
      const sa = pa[i] !== undefined ? pa[i] : "0";
      const sb = pb[i] !== undefined ? pb[i] : "0";
      const isNumA = /^\d+$/.test(sa);
      const isNumB = /^\d+$/.test(sb);
      if (isNumA && isNumB) {
        const na = parseInt(sa, 10);
        const nb = parseInt(sb, 10);
        if (na !== nb) return na - nb;
      } else {
        const la = sa.toLowerCase();
        const lb = sb.toLowerCase();
        if (la !== lb) return la < lb ? -1 : 1;
      }
    }
    return 0;
  }

  function showUpdateBanner(version) {
    const banner = document.getElementById("DR_Update_Banner");
    const verText = document.getElementById("DR_Update_Version_Text");
    if (!banner || !verText) return;
    verText.innerText = `Version ${version} is now available`;
    banner.dataset.version = version;
    banner.classList.add("on");
    queueRelayout();
  }

  function hideUpdateBanner() {
    const banner = document.getElementById("DR_Update_Banner");
    if (!banner) return;
    banner.classList.remove("on");
    queueRelayout();
  }

  function checkUpdateBannerFromCache() {
    const availableKey = "dr_update_available_version";
    const avail = localStorage.getItem(availableKey);
    if (avail && compareVersions(avail, drScriptVersion) > 0) {
      showUpdateBanner(avail);
    }
  }

  function bestAvatarUrl(picture) {
    if (
      !picture ||
      picture.includes("avatar/default") ||
      picture.includes("avatar/default_2")
    ) {
      return "https://simg-ssl.duolingo.com/avatar/default_2/xlarge";
    }
    let picUrl = picture;
    if (picUrl.startsWith("//")) {
      picUrl = "https:" + picUrl;
    }
    picUrl = picUrl.replace(/\/(medium|large|small)$/, "/xlarge");
    if (
      !picUrl.endsWith("/xlarge") &&
      picUrl.includes("duolingo.com/ssr-avatars")
    ) {
      if (!picUrl.endsWith("/")) picUrl += "/";
      picUrl += "xlarge";
    }
    return picUrl;
  }

  function accGetAll() {
    try {
      return JSON.parse(localStorage.getItem("dr_accounts") || "[]");
    } catch {
      return [];
    }
  }

  function accSetAll(arr) {
    localStorage.setItem("dr_accounts", JSON.stringify(arr));
  }

  function accSaveCurrent() {
    if (!user || !token || !userId) {
      notify("warning", "Account Manager", "Please wait for connection.");
      return;
    }
    const all = accGetAll();
    if (all.find((a) => a.id == userId)) {
      notify("info", "Account Manager", "This account is already saved.");
      return;
    }
    const pic = bestAvatarUrl(user.picture);
    all.push({
      id: userId,
      username: user.username || "User",
      pic,
      token: token,
      status: "ok",
    });
    accSetAll(all);
    notify("success", "Account Manager", `Saved account: ${user.username}`);
    renderAccounts();
    accRefreshAll();
  }

  function accRemove(id) {
    const all = accGetAll().filter((a) => a.id != id);
    accSetAll(all);
    renderAccounts();
    notify("success", "Account Manager", "Account removed from list.");
  }

  function accLogin(id) {
    const acc = accGetAll().find((a) => a.id == id);
    if (!acc) {
      notify("error", "Account Manager", "Account not found.");
      return;
    }
    const payload = readToken(acc.token);
    const isExpired =
      payload && payload.exp && Math.floor(Date.now() / 1000) > payload.exp;
    if (isExpired) {
      notify(
        "error",
        "Account Manager",
        "This account session has expired. Please sign in manually and save it again.",
      );
      return;
    }

    document.cookie =
      "jwt_token=; domain=www.duolingo.com; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "jwt_token=; domain=duolingo.com; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "jwt_token=; domain=.www.duolingo.com; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    document.cookie = `jwt_token=${acc.token}; domain=.duolingo.com; path=/; max-age=31536000`;

    const duoLocalStorageKeys = [
      "duo.user",
      "duo_user",
      "duolingo_user",
      "duo.session",
      "duo.token",
      "persist:root",
      "persist:session",
      "persist:auth",
      "duo.client_credentials",
    ];
    duoLocalStorageKeys.forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {}
    });

    try {
      Object.keys(localStorage).forEach((k) => {
        if (
          k.startsWith("persist:") ||
          k.startsWith("duo.") ||
          k.startsWith("duolingo_")
        ) {
          localStorage.removeItem(k);
        }
      });
    } catch {}

    window.location.replace("https://www.duolingo.com/learn");
  }

  function renderAccounts() {
    const wrap = document.getElementById("DR_AccList_Wrap");
    if (!wrap) return;
    const all = accGetAll();

    const countEl = document.getElementById("DR_UAccCount");
    if (countEl) {
      countEl.textContent =
        all.length === 1 ? "1 saved account" : `${all.length} saved accounts`;
    }

    if (all.length === 0) {
      wrap.innerHTML = `
                <p class="DR_T2 DR_NoSel" style="text-align:center;padding:8px 0;">
                    No saved accounts.
                </p>
            `;
      return;
    }
    wrap.innerHTML = "";
    all.forEach((acc) => {
      const card = document.createElement("div");
      card.className = "DR_Acc_Card";
      const isCurrentUser = userId && acc.id == userId;

      if (isCurrentUser) {
        card.style.outline = "2px solid rgba(var(--DR-blue), 0.5)";
        card.style.outlineOffset = "-2px";
        card.style.background = "rgba(var(--DR-blue), 0.08)";
      }

      const avatarDiv = document.createElement("div");
      avatarDiv.className = "DR_Acc_Avatar";
      if (acc.pic) {
        const img = document.createElement("img");
        img.src = acc.pic;
        img.style.cssText =
          "width:100%;height:100%;object-fit:cover;border-radius:50%;";
        img.addEventListener("error", () => {
          avatarDiv.innerHTML = icons.avatar;
        });
        avatarDiv.appendChild(img);
      } else {
        avatarDiv.innerHTML = icons.avatar;
      }
      card.appendChild(avatarDiv);

      const payload = readToken(acc.token);
      const isExpired =
        payload && payload.exp && Math.floor(Date.now() / 1000) > payload.exp;

      let subHtml = "";
      if (isExpired || acc.status === "relogin") {
        subHtml = `<p class="DR_Acc_Sub DR_NoSel" style="color:rgb(var(--DR-red))!important;opacity:1;font-weight:700;">Re-login Needed</p>`;
      } else if (acc.status === "banned") {
        subHtml = `<p class="DR_Acc_Sub DR_NoSel" style="color:rgb(var(--DR-red))!important;opacity:1;font-weight:700;">Account Banned</p>`;
      } else {
        subHtml = `<p class="DR_Acc_Sub DR_NoSel">ID: ${acc.id}</p>`;
      }

      const infoDiv = document.createElement("div");
      infoDiv.className = "DR_Acc_Info";
      infoDiv.innerHTML = `
                <p class="DR_Acc_Name DR_NoSel">${acc.username}</p>
                ${subHtml}
            `;
      card.appendChild(infoDiv);

      const canLogin =
        !isCurrentUser &&
        !isExpired &&
        acc.status !== "relogin" &&
        acc.status !== "banned";
      const actionDiv = document.createElement("div");
      actionDiv.className = "DR_Acc_Action_Row";
      actionDiv.innerHTML = `
                ${canLogin ? `<button class="DR_Acc_Btn login" data-id="${acc.id}">LOG IN</button>` : ""}
                <button class="DR_Acc_Btn del" data-id="${acc.id}"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
            `;
      card.appendChild(actionDiv);
      card.querySelector(".del").addEventListener("click", (e) => {
        e.stopPropagation();
        accRemove(acc.id);
      });
      const loginBtn = card.querySelector(".login");
      if (loginBtn)
        loginBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          accLogin(acc.id);
        });
      wrap.appendChild(card);
    });
  }

  async function accRefreshAll() {
    const all = accGetAll();
    if (!all.length) return;

    let changed = false;
    await Promise.all(
      all.map(async (acc) => {
        try {
          const res = await fetchApi(
            "GET",
            `https://www.duolingo.com/2017-06-30/users/${acc.id}?fields=id,username,picture,deactivated`,
            null,
            {
              accept: "application/json",
              authorization: "Bearer " + acc.token,
              "content-type": "application/json",
              origin: "https://www.duolingo.com",
              "User-Agent": drUserAgent,
              "x-amzn-trace-id": "User=" + acc.id,
            },
            null,
            true,
          );

          let newStatus = acc.status || "ok";
          if (res.status === 200) {
            const fresh = safeJsonParse(res.responseText);
            if (fresh) {
              const pic = bestAvatarUrl(fresh.picture);

              if (fresh.username && fresh.username !== acc.username) {
                acc.username = fresh.username;
                changed = true;
              }
              if (pic !== undefined && pic !== acc.pic) {
                acc.pic = pic;
                changed = true;
              }

              newStatus = fresh.deactivated === true ? "banned" : "ok";
            } else {
              newStatus = "ok";
            }
          } else if (res.status === 401 || res.status === 400) {
            newStatus = "relogin";
          } else if (res.status === 404) {
            newStatus = "banned";
          }

          if (acc.status !== newStatus) {
            acc.status = newStatus;
            changed = true;
          }
        } catch {
          if (acc.status !== "error") {
            acc.status = "error";
            changed = true;
          }
        }
      }),
    );

    if (changed) {
      accSetAll(all);
      renderAccounts();
    }
  }

  async function checkForUpdates() {
    const availableKey = "dr_update_available_version";
    const now = Date.now();

    try {
      const res = await fetchApi(
        "GET",
        drUpdateMetaUrl + "?_=" + now,
        null,
        {},
      );
      if (res.status !== 200) return;

      const match = res.responseText.match(/@version\s+(\S+)/);
      if (!match) return;

      const remoteVersion = match[1].trim();
      if (compareVersions(remoteVersion, drScriptVersion) > 0) {
        localStorage.setItem(availableKey, remoteVersion);
        showUpdateBanner(remoteVersion);
      } else {
        localStorage.removeItem(availableKey);
        hideUpdateBanner();
      }
    } catch {}
  }

  let notifPos = "bottom_center";

  function normalizeNotifPos(pos) {
    const valid = [
      "top_left",
      "top_center",
      "top_right",
      "bottom_left",
      "bottom_center",
      "bottom_right",
    ];
    if (valid.indexOf(pos) !== -1) return pos;
    return "bottom_center";
  }

  function applyNotifPos(pos) {
    notifPos = normalizeNotifPos(pos);
    layoutNotif();
  }

  function layoutNotif() {
    const nMain = document.getElementById("DR_Notif_Main");
    if (!nMain) return;

    nMain.style.width = Math.min(320, window.innerWidth - 32) + "px";

    const atTop = notifPos.indexOf("top") === 0;
    const centered = notifPos.indexOf("center") !== -1;
    const leftAnchored = notifPos.indexOf("left") !== -1;

    if (atTop) {
      nMain.style.top = "20px";
      nMain.style.bottom = "auto";
      nMain.style.flexDirection = "column";
    } else {
      nMain.style.top = "auto";
      nMain.style.bottom = "20px";
      nMain.style.flexDirection = "column-reverse";
    }

    if (centered) {
      nMain.style.left = "50%";
      nMain.style.right = "auto";
      nMain.style.transform = "translateX(-50%)";
      nMain.style.alignItems = "center";
    } else if (leftAnchored) {
      nMain.style.left = "16px";
      nMain.style.right = "auto";
      nMain.style.transform = "none";
      nMain.style.alignItems = "flex-start";
    } else {
      nMain.style.left = "auto";
      nMain.style.right = "16px";
      nMain.style.transform = "none";
      nMain.style.alignItems = "flex-end";
    }

    nMain.setAttribute("data-pos", notifPos);
  }

  function styleBtn(id, bg, outline, color, label) {
    const btn = document.getElementById(id);
    if (!btn) {
      return;
    }

    const labelEl =
      btn.querySelector(".DR_Btn_Label") ||
      btn.querySelector(".DR_Sm_Btn_Label");
    if (!labelEl) {
      return;
    }

    btn.style.background = bg;
    btn.style.outline = `2px solid ${outline}`;
    btn.style.outlineOffset = "-2px";
    btn.style.setProperty("--focus-outline", outline);
    labelEl.style.color = color;
    labelEl.textContent = label;
  }

  function resetBtn(id, originalLabel) {
    styleBtn(
      id,
      "rgb(var(--DR-blue))",
      "rgba(0,0,0,0.2)",
      "#fff",
      originalLabel,
    );
  }

  function stopBtn(id) {
    styleBtn(
      id,
      "rgba(var(--DR-red),0.10)",
      "rgba(var(--DR-red),0.22)",
      "rgb(var(--DR-red))",
      "STOP",
    );
  }

  function setProgress(identifier, percentage) {
    const wrapper = document.getElementById(identifier + "_Prog");
    const fill = document.getElementById(identifier + "_Fill");
    const pct = Number.isFinite(Number(percentage))
      ? Math.max(0, Math.min(100, Number(percentage)))
      : 0;

    if (wrapper) {
      wrapper.classList.add("on");
    }

    if (fill) {
      fill.style.width = pct + "%";
    }
  }

  function clearProgress(identifier, isSuccess = false) {
    const wrapper = document.getElementById(identifier + "_Prog");
    const fill = document.getElementById(identifier + "_Fill");

    if (isSuccess && fill) {
      fill.classList.add("done");
    }

    if (wrapper) {
      setTimeout(
        () => {
          wrapper.classList.remove("on");
          setTimeout(() => {
            if (fill) {
              fill.style.width = "0%";
              fill.classList.remove("done");
            }
          }, 400);
        },
        isSuccess ? 1500 : 800,
      );
    } else if (fill) {
      fill.style.width = "0%";
      fill.classList.remove("done");
    }
  }

  function updateUi(status) {
    const btn = document.getElementById("DR_Conn_Btn");
    const text = document.getElementById("DR_Conn_Txt");
    const icon = document.getElementById("DR_Conn_Ico");
    const content = document.getElementById("DR_Main_Content");

    if (!btn || !icon || !content) {
      return;
    }

    const countEl = document.getElementById("DR_UAccCount");
    if (countEl) {
      if (status === "logged_out") {
        const count = accGetAll().length;
        countEl.textContent =
          count === 1 ? "1 saved account" : `${count} saved accounts`;
        countEl.style.display = "block";
      } else {
        countEl.style.display = "none";
      }
    }

    const loaderHtml = `
            <div style="width: 20px; height: 20px; position: relative; display: flex; align-items: center; justify-content: center;">
                <div class="dr-spinner" style="position: absolute; top: 0; left: 0; transition: opacity var(--DR-motion) ease, transform var(--DR-motion) var(--DR-ease);"></div>
                <svg class="dr-tick-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; width: 20px; height: 20px; stroke-dasharray: 50; stroke-dashoffset: 50; opacity: 0; transition: stroke-dashoffset var(--DR-motion-page) var(--DR-ease), opacity var(--DR-motion) ease, background-color var(--DR-motion) ease; border-radius: 50%; padding: 3px; box-sizing: border-box;">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
        `;

    if (status === "connecting") {
      if (text) text.innerText = "Connecting";
      btn.style.background = "var(--dr-card-bg)";
      btn.style.outline = "2px solid var(--dr-card-border)";
      btn.style.color = "var(--dr-text)";
      icon.innerHTML = loaderHtml;
      content.classList.add("dr-disabled");
    } else if (status === "connected") {
      if (text) text.innerText = "Connected";
      btn.style.background = "rgba(88, 204, 2, 1)";
      btn.style.outline = "2px solid rgba(88, 204, 2, 1)";
      btn.style.color = "#fff";
      content.classList.remove("dr-disabled");

      if (!icon.querySelector(".dr-spinner")) {
        icon.innerHTML = loaderHtml;
      }

      setTimeout(() => {
        const tick = icon.querySelector(".dr-tick-icon");
        const spinner = icon.querySelector(".dr-spinner");
        if (tick && spinner) {
          spinner.style.opacity = "0";
          spinner.style.transform =
            "scale3d(0.1, 0.1, 1) rotate3d(0, 0, 1, 90deg)";
          tick.style.opacity = "1";
          tick.style.strokeDashoffset = "0";
          tick.style.stroke = "#fff";
        }
      }, 50);

      setTimeout(() => {
        if (status === "connected") {
          btn.style.background = "rgba(88, 204, 2, 0.15)";
          btn.style.outline = "2px solid rgba(88, 204, 2, 0.5)";
          btn.style.color = "var(--dr-text)";

          const tick = icon.querySelector(".dr-tick-icon");
          if (tick) {
            tick.style.backgroundColor = "transparent";
            tick.style.stroke = "rgb(88, 204, 2)";
          }
        }
      }, 3000);
    } else if (status === "logged_out") {
      if (text) text.innerText = "Logged Out";
      btn.style.background = "rgba(238, 85, 85, 1)";
      btn.style.outline = "2px solid rgba(238, 85, 85, 1)";
      btn.style.color = "#fff";
      icon.innerHTML = `
                <svg class="dr-cross-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px; padding: 3px; box-sizing: border-box; transition: stroke var(--DR-motion) ease;">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            `;
      content.classList.add("dr-disabled");

      const userRowEl = document.getElementById("DR_User_Row");
      if (userRowEl) {
        userRowEl.style.display = "flex";
        const userRowDiv = document.getElementById("DR_User_Row_Divider");
        if (userRowDiv) userRowDiv.style.display = "block";
        const nameEl = document.getElementById("DR_UName");
        if (nameEl) nameEl.textContent = "Account Manager";
        const avatarEl = document.getElementById("DR_Avatar");
        if (avatarEl) avatarEl.innerHTML = icons.avatar;
        const statsRow = document.getElementById("DR_User_Stats_Row");
        if (statsRow) statsRow.style.display = "none";
      }

      setTimeout(() => {
        if (status === "logged_out") {
          btn.style.background = "rgba(238, 85, 85, 0.15)";
          btn.style.outline = "2px solid rgba(238, 85, 85, 0.5)";
          btn.style.color = "var(--dr-text)";

          const cross = icon.querySelector(".dr-cross-icon");
          if (cross) {
            cross.style.stroke = "rgb(238, 85, 85)";
          }
        }
      }, 3000);

      [
        "DR_XP_Btn",
        "DR_Gem_Btn",
        "DR_Streak_Btn",
        "DR_League_Btn",
        "DR_Quest_Force_Btn",
        "DR_Block_Btn",
        "DR_FollowSingle_Btn",
        "DR_Follow_Btn",
        "DR_Block_Mass_Btn",
        "DR_Gift_Btn",
        "DR_Hearts_Btn",
        "DR_Friend_Btn",
        "DR_AutoPath_Btn",
        "DR_AutoPractice_Btn",
      ].forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          element.disabled = true;
        }
      });
    }
  }

  async function bgCheck() {
    if (bgCheckBusy) return;
    bgCheckBusy = true;
    try {
      const isLessonActive =
        window.location.pathname.includes("/lesson") ||
        window.location.pathname.includes("/practice") ||
        window.location.pathname.includes("/stories");
      if (!isLessonActive) {
        hasDecrementedForCurrentLesson = false;
      }

      const isSectionPage =
        window.location.pathname.includes("/section") &&
        !window.location.pathname.includes("/sections");
      if (isSectionPage && !isLessonActive) {
        const buttons = Array.from(
          document.querySelectorAll('button, [role="button"]'),
        );
        const nextBtn = buttons.find((btn) => {
          const txt = (btn.textContent || btn.innerText || "")
            .toUpperCase()
            .trim();
          return (
            txt === "CONTINUE" ||
            txt.includes("NEXT SECTION") ||
            txt.includes("GO TO")
          );
        });
        if (nextBtn) {
          nextBtn.click();
          lastHomeTime = 0;
        } else {
          if (lastHomeTime === 0) {
            lastHomeTime = Date.now();
          } else if (Date.now() - lastHomeTime > 3000) {
            window.location.href = "https://duolingo.com/";
            lastHomeTime = 0;
          }
        }
        return;
      }

      if (autoPathEnabled) {
        const isHome =
          window.location.pathname === "/" ||
          window.location.pathname === "/learn";
        if (isHome && !isLessonActive) {
          const chest = Array.from(document.querySelectorAll("img")).find(
            (img) =>
              img.src &&
              img.src.includes("09f977a3e299d1418fde0fd053de0beb.svg"),
          );
          if (chest) {
            chest.click();
            lastHomeTime = Date.now();
          } else {
            if (lastHomeTime === 0) {
              lastHomeTime = Date.now();
            } else if (Date.now() - lastHomeTime > 3000) {
              window.location.href = "https://duolingo.com/lesson";
              lastHomeTime = 0;
            }
          }
        } else {
          lastHomeTime = 0;
        }
      } else if (autoPracticeEnabled) {
        const isHome =
          window.location.pathname === "/" ||
          window.location.pathname === "/learn";
        if (isHome && !isLessonActive) {
          if (lastHomeTime === 0) {
            lastHomeTime = Date.now();
          } else if (Date.now() - lastHomeTime > 3000) {
            window.location.href = "https://duolingo.com/practice";
            lastHomeTime = 0;
          }
        } else {
          lastHomeTime = 0;
        }
      }

      const currentExtractedJwt = getToken();
      if (currentExtractedJwt && currentExtractedJwt !== oldToken) {
        oldToken = currentExtractedJwt;
        await connect(true);
      } else if (!currentExtractedJwt && oldToken) {
        oldToken = null;
        token = null;
        userId = null;
        headers = null;
        user = null;
        questState = null;
        currentStatus = null;
        stopLeaguePolling();
        updateUi("logged_out");
      }
    } finally {
      bgCheckBusy = false;
    }
  }

  function parseMarkdownToHtml(md) {
    if (!md) return "";

    const blocks = md.split(/\n\s*\n/);
    let html = "";

    for (let block of blocks) {
      block = block.trim();
      if (!block) continue;

      let cleanBlock = block
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      if (cleanBlock.startsWith("#")) {
        if (cleanBlock.startsWith("### ")) {
          const text = cleanBlock.replace(/^###\s+/, "");
          html += `<h3 class="DR_T1" style="font-size: 11px; font-weight: 700; margin: 6px 0 2px 0; color: var(--dr-text); text-transform: uppercase; letter-spacing: 0.5px; text-align: left;">${text}</h3>`;
        } else if (cleanBlock.startsWith("## ")) {
          const text = cleanBlock.replace(/^##\s+/, "");
          html += `<h2 class="DR_T1" style="font-size: 13px; font-weight: 800; margin: 8px 0 4px 0; color: var(--dr-text); border-bottom: 1px solid var(--dr-card-border); padding-bottom: 2px; text-align: left;">${text}</h2>`;
        } else if (cleanBlock.startsWith("# ")) {
          const text = cleanBlock.replace(/^#\s+/, "");
          html += `<h1 class="DR_T1" style="font-size: 14px; font-weight: 900; margin: 10px 0 6px 0; color: var(--dr-text); border-bottom: 1.5px solid var(--dr-card-border); padding-bottom: 3px; text-align: left;">${text}</h1>`;
        }
        continue;
      }

      if (/^[\-\=]{3,}$/.test(cleanBlock)) {
        html += '<div class="DR_Divider" style="margin: 8px 0;"></div>';
        continue;
      }

      const lines = cleanBlock.split("\n");
      const firstLine = lines[0].trim();
      if (
        firstLine.startsWith("* ") ||
        firstLine.startsWith("- ") ||
        /^\d+\.\s+/.test(firstLine)
      ) {
        let listHtml =
          '<div style="margin: 4px 0 6px 0; display: flex; flex-direction: column; gap: 3px;">';
        for (let line of lines) {
          line = line.trim();
          if (line.startsWith("* ") || line.startsWith("- ")) {
            const text = line.replace(/^[\*\-]\s+/, "");
            const parsedText = text.replace(
              /\*\*(.*?)\*\*/g,
              '<strong style="font-weight: 800; color: var(--dr-text);">$1</strong>',
            );
            listHtml += `<div style="display: flex; gap: 6px; margin-left: 6px; font-size: 11px; line-height: 1.4;"><div style="color: rgb(var(--DR-blue)); font-weight: 700; flex-shrink: 0;">•</div><div style="flex: 1; text-align: left; color: var(--dr-text); opacity: 0.85;">${parsedText}</div></div>`;
          } else if (/^\d+\.\s+/.test(line)) {
            const num = line.match(/^(\d+)\.\s+/)[1];
            const text = line.replace(/^\d+\.\s+/, "");
            const parsedText = text.replace(
              /\*\*(.*?)\*\*/g,
              '<strong style="font-weight: 800; color: var(--dr-text);">$1</strong>',
            );
            listHtml += `<div style="display: flex; gap: 6px; margin-left: 6px; font-size: 11px; line-height: 1.4;"><div style="color: rgb(var(--DR-blue)); font-weight: 700; flex-shrink: 0;">${num}.</div><div style="flex: 1; text-align: left; color: var(--dr-text); opacity: 0.85;">${parsedText}</div></div>`;
          }
        }
        listHtml += "</div>";
        html += listHtml;
        continue;
      }

      let parsedParagraph = cleanBlock.replace(/\n/g, " ");
      parsedParagraph = parsedParagraph.replace(
        /\*\*(.*?)\*\*/g,
        '<strong style="font-weight: 800; color: var(--dr-text);">$1</strong>',
      );

      html += `<p class="DR_T2" style="margin: 0 0 6px 0; font-size: 11px; line-height: 1.4; color: var(--dr-text); opacity: 0.85; text-align: left;">${parsedParagraph}</p>`;
    }

    return html;
  }

  function updateTermsPage(
    html,
    statusText,
    showDecline,
    acceptLabel,
    onAccept,
  ) {
    const pageEl = document.getElementById("DR_Page_Terms");
    const mainBox = document.getElementById("DR_Main_Box");
    if (!pageEl || !mainBox) return;

    const contentEl = document.getElementById("DR_Terms_Content");
    const statusEl = document.getElementById("DR_Terms_Status");
    const declineBtn = document.getElementById("DR_Terms_Decline_Btn");
    const acceptBtn = document.getElementById("DR_Terms_Accept_Btn");

    pageEl.style.transition =
      "opacity 0.15s ease, filter 0.15s ease, -webkit-transform 0.15s ease, transform 0.15s ease";
    pageEl.style.opacity = "0";
    pageEl.style.filter = "blur(3px)";
    pageEl.style.transform = "scale3d(0.98, 0.98, 1)";

    const startHeight = mainBox.offsetHeight;

    setTimeout(() => {
      mainBox.style.transition = "none";
      mainBox.style.height = startHeight + "px";

      if (contentEl) contentEl.innerHTML = html;
      if (statusEl) statusEl.innerText = statusText;
      if (declineBtn) declineBtn.style.display = showDecline ? "flex" : "none";
      if (acceptBtn) {
        acceptBtn.querySelector(".DR_Sm_Btn_Label").innerText = acceptLabel;
        acceptBtn.onclick = onAccept;
      }

      mainBox.style.height = "auto";
      mainBox.style.maxHeight = "none";
      const targetHeight = mainBox.offsetHeight;

      mainBox.style.height = startHeight + "px";
      void mainBox.offsetHeight;

      const easeCurve = "cubic-bezier(0.34, 1.15, 0.64, 1)";
      mainBox.style.transition = `height 0.3s ${easeCurve}`;
      mainBox.style.height = targetHeight + "px";

      pageEl.style.opacity = "1";
      pageEl.style.filter = "none";
      pageEl.style.transform = "scale3d(1, 1, 1)";

      setTimeout(() => {
        mainBox.style.height = "auto";
        mainBox.style.transition = "";
        pageEl.style.transition = "";
        relayout();
      }, 300);
    }, 150);
  }

  function loadEulaAndTos() {
    const contentEl = document.getElementById("DR_Terms_Content");
    const statusEl = document.getElementById("DR_Terms_Status");
    const declineBtn = document.getElementById("DR_Terms_Decline_Btn");
    const acceptBtn = document.getElementById("DR_Terms_Accept_Btn");

    if (!contentEl || !statusEl || !declineBtn || !acceptBtn) return;

    const termsAccepted = localStorage.getItem("dr_terms_accepted") === "true";
    const statusText = termsAccepted
      ? "Review EULA & Terms of Service"
      : "Please read and accept to use DuoRain";
    const acceptLabel = termsAccepted ? "CLOSE" : "ACCEPT";
    const onAccept = () => {
      if (!termsAccepted) {
        localStorage.setItem("dr_terms_accepted", "true");
        connect().then(() => {
          accRefreshAll();
        });
      }
      changePage(1);
    };

    updateTermsPage(
      '<div style="text-align: center; padding: 12px 0;">Loading terms & conditions...</div>',
      statusText,
      !termsAccepted,
      acceptLabel,
      onAccept,
    );

    Promise.all([
      window
        .fetch("https://raw.githubusercontent.com/DuoXPy/DuoRain/main/EULA.md")
        .then((r) => {
          if (!r.ok) throw new Error("HTTP error " + r.status);
          return r.text();
        }),
      window
        .fetch("https://raw.githubusercontent.com/DuoXPy/DuoRain/main/TOS.md")
        .then((r) => {
          if (!r.ok) throw new Error("HTTP error " + r.status);
          return r.text();
        }),
    ])
      .then(([eula, tos]) => {
        if (eula.trim() && tos.trim()) {
          updateTermsPage(
            parseMarkdownToHtml(`${eula}\n\n---\n\n${tos}`),
            statusText,
            !termsAccepted,
            acceptLabel,
            onAccept,
          );
        } else {
          throw new Error("Empty response");
        }
      })
      .catch(() => {
        const fallbackMd = `# END USER LICENSE AGREEMENT & TERMS OF SERVICE\n\nUsage of DuoRain implies compliance with the terms below:\n\n1. **Disclaimer**: You agree to use this script at your own risk. The authors are not responsible for any account bans, suspensions, or data loss.\n2. **Usage Limit**: You will not use the script for commercial purposes or distribute malicious modifications.\n3. **License**: The script is provided "as is" under the MIT license.\n\n---\n\nPlease connect to the internet to read the full EULA and TOS from our official repository.`;
        updateTermsPage(
          parseMarkdownToHtml(fallbackMd),
          statusText,
          !termsAccepted,
          acceptLabel,
          onAccept,
        );
      });
  }

  async function connect(isBgProcess = false) {
    if (connectBusy) {
      return;
    }
    connectBusy = true;
    token = getToken();

    if (!token) {
      userId = null;
      headers = null;
      user = null;
      questState = null;
      currentStatus = null;
      stopLeaguePolling();
      updateUi("logged_out");
      connectBusy = false;
      return;
    }

    const decoded = readToken(token);
    if (!decoded) {
      token = null;
      userId = null;
      headers = null;
      user = null;
      questState = null;
      currentStatus = null;
      stopLeaguePolling();
      updateUi("logged_out");
      connectBusy = false;
      return;
    }

    userId = decoded.sub;
    headers = setHeaders(token);
    oldToken = token;
    leagueJoinAttempted = false;
    autoBlockCohortKey = null;

    try {
      if (!isBgProcess) {
        updateUi("connecting");
      }

      const res = await fetchApi(
        "GET",
        `${config.api.users}/${userId}?fields=id,username,email,emailVerified,fromLanguage,learningLanguage,streak,totalXp,gems,picture,streakData,timezone`,
      );

      if (res.status !== 200) {
        throw new Error("Connection failed");
      }

      user = safeJsonParse(res.responseText);
      if (!user) {
        throw new Error("Invalid user response");
      }
      updateUi("connected");
      showUser();
      startLeaguePolling();

      [
        "DR_XP_Btn",
        "DR_Gem_Btn",
        "DR_Streak_Btn",
        "DR_League_Btn",
        "DR_Quest_Force_Btn",
        "DR_Block_Btn",
        "DR_FollowSingle_Btn",
        "DR_Follow_Btn",
        "DR_Block_Mass_Btn",
        "DR_Gift_Btn",
        "DR_Hearts_Btn",
        "DR_Friend_Btn",
        "DR_AutoPath_Btn",
        "DR_AutoPractice_Btn",
      ].forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          element.disabled = false;
        }
      });

      setTimeout(async () => {
        await Promise.allSettled([getShop(), getQuests(), getPrivacy()]);
        autoKeepStreak();
        autoQuestSaver();
      }, 500);
    } catch {
      if (!isBgProcess) {
        setTimeout(() => {
          connect(false);
        }, 5000);
      }
    } finally {
      connectBusy = false;
    }
  }

  const statKeys = {
    xp: "dr_stat_xp_" + drVersion,
    gems: "dr_stat_gems_" + drVersion,
    streak: "dr_stat_streak_" + drVersion,
  };
  const statSinceKey = "dr_stat_since_" + drVersion;

  function readStat(kind) {
    return parseInt(localStorage.getItem(statKeys[kind])) || 0;
  }

  function showStats() {
    const map = {
      xp: "DR_Stat_XP",
      gems: "DR_Stat_Gems",
      streak: "DR_Stat_Streak",
    };
    for (const kind in map) {
      const el = document.getElementById(map[kind]);
      if (el) {
        el.textContent = readStat(kind).toLocaleString();
      }
    }
    const sinceEl = document.getElementById("DR_Stat_Since");
    if (sinceEl) {
      let ts = parseInt(localStorage.getItem(statSinceKey));
      if (!ts) {
        ts = Date.now();
        localStorage.setItem(statSinceKey, String(ts));
      }
      sinceEl.textContent = new Date(ts).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  }

  let changelogBusy = false;
  async function loadChangelog() {
    const cont = document.getElementById("DR_Changelog");
    if (!cont || changelogBusy) return;
    changelogBusy = true;
    if (cont.dataset.loaded !== "1") {
      cont.innerHTML = `<p class="DR_T2 DR_NoSel" style="text-align: center;">Loading changelog...</p>`;
    }
    try {
      const res = await fetchApi(
        "GET",
        "https://raw.githubusercontent.com/DuoXPy/DuoRain/main/CHANGELOG.md?_c=" +
          Date.now(),
        null,
        {},
      );
      if (res.status !== 200) throw new Error("Changelog not found");

      const text = res.responseText || "";
      const lines = text.split("\n");
      let html = "";
      let listItems = [];

      const flushSection = () => {
        if (listItems.length) {
          if (html)
            html += '<div class="DR_Divider" style="margin: 8px 0;"></div>';
          html += `<ul style="margin: 0; padding-left: 14px; color: var(--dr-text); font-size: 11px; line-height: 1.5; list-style-type: disc; text-align: left; align-self: stretch;">
            ${listItems.map((item) => `<li class="DR_T2 DR_NoSel" style="margin-bottom: 3px;">${item}</li>`).join("")}
          </ul>`;
        }
        listItems = [];
      };

      for (let line of lines) {
        line = line.trim();
        if (line.startsWith("## ")) {
          flushSection();
        } else if (line.startsWith("- ") || line.startsWith("* ")) {
          listItems.push(line.substring(2).trim());
        }
      }
      flushSection();

      cont.innerHTML =
        html ||
        `<p class="DR_T2 DR_NoSel" style="text-align: center;">No updates found.</p>`;
      cont.dataset.loaded = "1";
      const card = document.getElementById("DR_Changelog_Card");
      if (card) {
        if (html) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      }
    } catch (e) {
      const card = document.getElementById("DR_Changelog_Card");
      if (card) card.style.display = "none";
    } finally {
      changelogBusy = false;
    }
  }

  async function loadXpHistory() {
    const cont = document.getElementById("DR_XPHistory");
    if (!cont || !token || !userId || xpHistoryBusy) return;
    xpHistoryBusy = true;
    if (cont.dataset.loaded !== "1") {
      cont.innerHTML = `<p class="DR_T2 DR_NoSel" style="text-align: center;">Loading...</p>`;
    }
    try {
      const d = new Date(Date.now() - 7 * 86400000);
      const pad = (n) => String(n).padStart(2, "0");
      const startDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      const res = await fetchApi(
        "GET",
        `https://www.duolingo.com/2017-06-30/users/${userId}/xp_summaries?startDate=${startDate}&_=${Date.now()}`,
      );
      if (res.status !== 200) throw new Error("bad status");
      let summaries = (
        safeJsonParse(res.responseText, {}).summaries || []
      ).slice();
      summaries.sort((a, b) => (b.date || 0) - (a.date || 0));
      summaries = summaries.slice(0, 7).reverse();
      if (!summaries.length) {
        cont.innerHTML = `<p class="DR_T2 DR_NoSel" style="text-align: center;">No recent activity.</p>`;
        cont.dataset.loaded = "1";
        return;
      }
      cont.innerHTML = summaries
        .map((s) => {
          const label = new Date((s.date || 0) * 1000).toLocaleDateString(
            undefined,
            { weekday: "short", month: "short", day: "numeric" },
          );
          return `<div class="DR_HStack_Auto" style="align-self: stretch;"><p class="DR_T2 DR_NoSel">${label}</p><p class="DR_T1 DR_NoSel">+${(s.gainedXp || 0).toLocaleString()} XP</p></div>`;
        })
        .join("");
      cont.dataset.loaded = "1";
    } catch {
      if (cont.dataset.loaded !== "1") {
        cont.innerHTML = `<p class="DR_T2 DR_NoSel" style="text-align: center; color: rgb(var(--DR-red));">Failed to load XP history.</p>`;
      }
    } finally {
      xpHistoryBusy = false;
    }
  }

  function compactRelativeTime(diffSec) {
    diffSec = Math.max(0, Math.floor(diffSec));
    if (diffSec < 60) return "just now";
    const mins = Math.floor(diffSec / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `${weeks}w ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
  }

  function normalizeRelativeText(value) {
    const raw = String(value == null ? "" : value).trim();
    if (!raw) return "";
    if (/^just now$/i.test(raw)) return "just now";

    const match = raw.match(
      /^(\d+)\s*(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|months?|mos?|years?|yrs?|y)(?:\s+ago)?$/i,
    );
    if (!match) return "";

    const amount = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    if (unit.startsWith("sec") || unit === "s")
      return amount < 60 ? "just now" : `${Math.floor(amount / 60)}m ago`;
    if (unit.startsWith("min") || unit === "m") return `${amount}m ago`;
    if (unit.startsWith("h")) return `${amount}h ago`;
    if (unit.startsWith("d")) return `${amount}d ago`;
    if (unit.startsWith("w")) return `${amount}w ago`;
    if (unit.startsWith("mo")) return `${amount}mo ago`;
    if (unit.startsWith("y")) return `${amount}y ago`;
    return "";
  }

  function feedTimestampMs(card) {
    const fields = [
      card?.subtitle,
      card?.timestamp,
      card?.createdAt,
      card?.creationDate,
      card?.eventTime,
      card?.time,
      card?.date,
    ];

    for (const value of fields) {
      if (value === undefined || value === null || value === "") continue;

      if (typeof value === "number" || /^\d+$/.test(String(value).trim())) {
        const num = Number(value);
        if (Number.isFinite(num) && num > 0) {
          return num < 100000000000 ? num * 1000 : num;
        }
      }

      const raw = String(value).trim();
      const isoLike = raw.match(
        /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(?:\s*(Z|[+-]\d{2}:?\d{2}))?$/,
      );
      if (isoLike) {
        const hasZone = !!isoLike[8];
        const normalized = raw
          .replace(" ", "T")
          .replace(/([+-]\d{2})(\d{2})$/, "$1:$2");
        const parsed = hasZone
          ? Date.parse(normalized)
          : Date.UTC(
              +isoLike[1],
              +isoLike[2] - 1,
              +isoLike[3],
              +isoLike[4],
              +isoLike[5],
              +isoLike[6],
              isoLike[7] ? Number((isoLike[7] + "000").slice(0, 3)) : 0,
            );
        if (!Number.isNaN(parsed)) return parsed;
      }

      const parsed = Date.parse(raw);
      if (!Number.isNaN(parsed)) return parsed;
    }

    return null;
  }

  function feedTimeAgo(card) {
    const subtitleRelative = normalizeRelativeText(card?.subtitle);
    if (subtitleRelative) return subtitleRelative;

    const ts = feedTimestampMs(card);
    if (!ts) return "";
    return compactRelativeTime((Date.now() - ts) / 1000);
  }

  async function getFeed() {
    const cont = document.getElementById("DR_Feed_Container");
    if (!cont || !token || !userId || feedBusy) return;
    feedBusy = true;
    const loaded = cont.dataset.loaded === "1";
    if (!loaded)
      cont.innerHTML = `<p class="DR_T2 DR_NoSel" style="text-align: center; padding: 8px 0;">Loading...</p>`;
    try {
      const res = await fetchApi(
        "GET",
        `https://www.duolingo.com/2017-06-30/friends/users/${userId}/feed/v2?uiLanguage=${uiLang()}`,
      );
      if (res.status !== 200) throw new Error("bad status");
      const cards = [];
      (safeJsonParse(res.responseText, {}).feed || []).forEach((section) => {
        (section.feedCards || []).forEach((c) => cards.push(c));
      });
      if (!cards.length) {
        cont.innerHTML = `<p class="DR_T2 DR_NoSel" style="text-align: center; padding: 8px 0;">No recent activity.</p>`;
        cont.dataset.loaded = "1";
        return;
      }
      const frag = document.createDocumentFragment();
      cards.slice(0, 40).forEach((c) => {
        const name = escapeHtml(c.displayName || "Someone");
        const cardType = c.cardType || "";
        let message;
        if (cardType === "FOLLOW") {
          message = `You followed ${c.displayName || "someone"}`;
        } else if (cardType === "FOLLOW_BACK") {
          message = `${c.displayName || "Someone"} followed you`;
        } else {
          message = c.body || "";
        }
        const text = escapeHtml(message);
        const timeAgo = escapeHtml(feedTimeAgo(c));
        const raw = c.avatarUrl || c.picture || "";
        const av = raw
          ? (raw.indexOf("http") === 0 ? raw : "https:" + raw) + "/xlarge"
          : "";
        const row = document.createElement("div");
        row.className = "DR_HStack_4";
        row.style.cssText =
          "align-self: stretch; padding: 8px 10px; border-radius: var(--DR-r-s); corner-shape: var(--DR-corner); gap: 8px; background: var(--dr-card-bg);";
        row.innerHTML = `
                    <img src="${escapeHtml(av)}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; flex-shrink: 0; background: var(--dr-card-border);" onerror="this.style.visibility='hidden'">
                    <div style="flex: 1; min-width: 0;">
                        <p class="DR_T1 DR_NoSel" style="font-size: 13px;">${name}</p>
                        ${text ? `<p class="DR_T2 DR_NoSel" style="font-size: 11px;">${text}</p>` : ""}
                    </div>
                    ${timeAgo ? `<p class="DR_T2 DR_NoSel" style="font-size: 10px; flex-shrink: 0; opacity: 0.5;">${timeAgo}</p>` : ""}
                `;
        frag.appendChild(row);
      });
      cont.replaceChildren(frag);
      cont.dataset.loaded = "1";
    } catch {
      if (!loaded)
        cont.innerHTML = `<p class="DR_T2 DR_NoSel" style="text-align: center; color: rgb(var(--DR-red));">Failed to load feed.</p>`;
    } finally {
      feedBusy = false;
    }
  }

  function addStat(kind, amount) {
    if (!statKeys[kind] || !amount || amount <= 0) {
      return;
    }
    localStorage.setItem(statKeys[kind], String(readStat(kind) + amount));
    showStats();
  }

  function showUser() {
    if (!user) {
      return;
    }

    const usernameEl = document.getElementById("DR_UName");
    if (usernameEl) {
      usernameEl.textContent = user.username || "";
    }

    const xpEl = document.getElementById("DR_UXP");
    if (xpEl) {
      xpEl.textContent = (user.totalXp || 0).toLocaleString();
    }

    const gemsEl = document.getElementById("DR_UGems");
    if (gemsEl) {
      gemsEl.textContent = (user.gems || 0).toLocaleString();
    }

    const streakEl = document.getElementById("DR_UStreak");
    if (streakEl) {
      streakEl.textContent = (user.streak || 0).toLocaleString();
    }

    const userRowEl = document.getElementById("DR_User_Row");
    if (userRowEl) {
      userRowEl.style.display = "flex";
      const userRowDiv = document.getElementById("DR_User_Row_Divider");
      if (userRowDiv) userRowDiv.style.display = "block";
      const statsRow = document.getElementById("DR_User_Stats_Row");
      if (statsRow) statsRow.style.display = "flex";
      const countEl = document.getElementById("DR_UAccCount");
      if (countEl) countEl.style.display = "none";
    }

    const picUrl = bestAvatarUrl(user.picture);
    const avatarEl = document.getElementById("DR_Avatar");
    if (avatarEl) {
      const currentImg = avatarEl.querySelector("img");
      if (!currentImg || currentImg.src !== picUrl) {
        const img = document.createElement("img");
        img.src = picUrl;
        img.style.cssText =
          "width: 100%; height: 100%; object-fit: cover; border-radius: 50%;";
        img.addEventListener("error", () => {
          avatarEl.innerHTML = icons.avatar;
        });
        avatarEl.replaceChildren(img);
      }
    }
  }

  async function refreshStats() {
    if (!token || !userId || !user || refreshStatsBusy) {
      return;
    }

    refreshStatsBusy = true;
    try {
      const res = await fetchApi(
        "GET",
        `${config.api.users}/${userId}?fields=streak,totalXp,gems,streakData`,
      );
      if (res.status === 200) {
        const data = safeJsonParse(res.responseText, {});
        if (data.totalXp !== undefined) {
          user.totalXp = data.totalXp;
        }
        if (data.gems !== undefined) {
          user.gems = data.gems;
        }
        if (data.streak !== undefined) {
          user.streak = data.streak;
        }
        if (data.streakData !== undefined) {
          user.streakData = data.streakData;
        }
        showUser();
      }
    } catch {
    } finally {
      refreshStatsBusy = false;
    }
  }

  function accountTimezone() {
    return user && user.timezone ? user.timezone : "America/New_York";
  }

  function uiLang() {
    return user && user.fromLanguage ? user.fromLanguage : "en";
  }

  function tzParts(timeZone, date) {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const out = {};
    dtf.formatToParts(date).forEach((part) => {
      if (part.type !== "literal") out[part.type] = part.value;
    });
    return out;
  }

  function wallClockToSeconds(
    timeZone,
    year,
    month,
    day,
    hour,
    minute,
    second,
  ) {
    const guess = Date.UTC(year, month - 1, day, hour, minute, second);
    const parts = tzParts(timeZone, new Date(guess));
    const localAsUtc = Date.UTC(
      +parts.year,
      +parts.month - 1,
      +parts.day,
      +parts.hour,
      +parts.minute,
      +parts.second,
    );
    const offset = localAsUtc - guess;
    return Math.floor((guess - offset) / 1000);
  }

  function accountToday(timeZone) {
    const parts = tzParts(timeZone, new Date());
    return { year: +parts.year, month: +parts.month, day: +parts.day };
  }

  function accountNowIso() {
    const now = new Date();
    const parts = tzParts(accountTimezone(), now);
    const ms = String(now.getMilliseconds()).padStart(3, "0");
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}.${ms}Z`;
  }

  async function playStory(bonus, signal) {
    try {
      const currentSeconds = Math.floor(Date.now() / 1000);
      const genDuration = Math.floor(Math.random() * 121 + 300);

      const payload = {
        awardXp: true,
        completedBonusChallenge: true,
        fromLanguage: "fr",
        learningLanguage: "en",
        hasXpBoost: false,
        illustrationFormat: "svg",
        isFeaturedStoryInPracticeHub: true,
        isLegendaryMode: true,
        isV2Redo: false,
        isV2Story: false,
        masterVersion: true,
        maxScore: 0,
        score: 0,
        happyHourBonusXp: bonus,
        startTime: currentSeconds,
        endTime: currentSeconds + genDuration,
      };

      const res = await fetchApi(
        "POST",
        `${config.api.stories}/fr-en-le-passeport/complete`,
        payload,
        null,
        signal,
      );
      return res.status === 200;
    } catch {
      return false;
    }
  }

  async function farmXp(targetAmount) {
    const isInfinite = targetAmount === Infinity;
    if (!isInfinite) {
      const room = parseInt(localStorage.getItem("dr_xp_room")) || 0;
      if (room > 0) {
        targetAmount += Math.min(500, Math.max(30, room));
      }
    }
    const maxPerReq = 499;
    const minPerReq = 30;

    let loops = isInfinite ? Infinity : Math.floor(targetAmount / maxPerReq);
    let remAmount = isInfinite ? 0 : targetAmount % maxPerReq;

    if (!isInfinite && remAmount > 0 && remAmount < minPerReq && loops > 0) {
      loops--;
      remAmount += maxPerReq;
    }

    const expectedIters = isInfinite
      ? Infinity
      : loops + (remAmount >= minPerReq ? 1 : 0);
    let doneIters = 0;
    let totalXp = 0;
    const sig = farmSignal("xp");

    stopBtn("DR_XP_Btn");

    for (let i = 0; i < loops; i++) {
      if (!farmStates.xp) {
        break;
      }

      const success = await playStory(469, sig);
      if (!farmStates.xp) break;
      if (success) {
        totalXp += maxPerReq;
        doneIters++;
        user.totalXp += maxPerReq;
        showUser();
      }

      if (!isInfinite) {
        setProgress("DR_XP", (doneIters / expectedIters) * 100);
      }

      await waitStop(delayMs, sig);
    }

    if (!isInfinite && remAmount >= minPerReq && farmStates.xp) {
      const success = await playStory(
        Math.min(remAmount - minPerReq, 469),
        sig,
      );
      if (success) {
        totalXp += remAmount;
        doneIters++;
        user.totalXp += remAmount;
        showUser();
      }
      setProgress("DR_XP", 100);
    }

    const completed = farmStates.xp;
    if (totalXp > 0) {
      addStat("xp", totalXp);
      notify(
        "success",
        completed ? "XP Farm Complete" : "XP Farm Stopped",
        `Farmed ${totalXp} XP.`,
      );
      refreshStats();
    }

    clearProgress("DR_XP", completed);

    farmStates.xp = false;
    farmCtl.xp = null;
    resetBtn("DR_XP_Btn", "RUN");
  }

  async function checkGems(signal) {
    try {
      const res = await fetchApi(
        "GET",
        `${config.api.users}/${userId}?fields=rewardBundles`,
        null,
        null,
        signal,
      );

      if (res.status !== 200) {
        return [];
      }

      const data = safeJsonParse(res.responseText, {});
      const collected = [];

      for (const bundle of data.rewardBundles || []) {
        for (const reward of bundle.rewards || []) {
          if (
            !reward.consumed &&
            ((reward.id || "").includes("GEMS") || reward.currency === "GEMS")
          ) {
            collected.push({ id: reward.id });
          }
        }
      }

      return collected;
    } catch {
      return [];
    }
  }

  async function claimGem(rewardId, signal) {
    try {
      const res = await fetchApi(
        "PATCH",
        `${config.api.users}/${userId}/rewards/${rewardId}`,
        {
          consumed: true,
          fromLanguage: user.fromLanguage,
          learningLanguage: user.learningLanguage,
        },
        null,
        signal,
      );
      return res.status === 200;
    } catch {
      return false;
    }
  }

  async function getGems(signal) {
    try {
      const res = await fetchApi(
        "GET",
        `${config.api.users}/${userId}?fields=gemsConfig`,
        null,
        null,
        signal,
      );

      if (res.status !== 200) {
        return null;
      }

      const data = safeJsonParse(res.responseText, {});
      if (data.gemsConfig && data.gemsConfig.gems !== undefined) {
        return data.gemsConfig.gems;
      }
      return null;
    } catch {
      return null;
    }
  }

  async function farmGems(targetLoops) {
    const isInfinite = targetLoops === Infinity;
    stopBtn("DR_Gem_Btn");

    let totalGained = 0;
    let doneLoops = 0;
    const sig = farmSignal("gem");

    while (farmStates.gem && (isInfinite || doneLoops < targetLoops)) {
      const available = await checkGems(sig);
      if (!farmStates.gem) break;

      if (available.length === 0) {
        await waitStop(delayMs * 2, sig);
        continue;
      }

      let prevCount = await getGems(sig);
      if (prevCount === null) {
        prevCount = user?.gems ?? 0;
      }

      for (let i = 0; i < available.length; i += 4) {
        if (!farmStates.gem || (!isInfinite && doneLoops >= targetLoops)) {
          break;
        }

        const batch = available.slice(i, i + 4);
        const promises = batch.map((r) => claimGem(r.id, sig));
        await Promise.all(promises);
        if (!farmStates.gem) break;

        await waitStop(150, sig);

        const currentCount = await getGems(sig);
        if (currentCount !== null) {
          const diff = Math.max(0, currentCount - prevCount);
          totalGained += diff;
          prevCount = currentCount;

          if (user) {
            user.gems = currentCount;
            showUser();
          }
        }

        doneLoops++;

        if (!isInfinite) {
          setProgress("DR_Gem", (doneLoops / targetLoops) * 100);
        }

        await waitStop(Math.max(50, delayMs - 50), sig);
      }

      await waitStop(delayMs, sig);
    }

    const completed = farmStates.gem;
    if (totalGained > 0) {
      addStat("gems", totalGained);
      notify(
        "success",
        completed ? "Gem Farm Complete" : "Gem Farm Stopped",
        `+${totalGained} gems acquired.`,
      );
      refreshStats();
    }

    clearProgress("DR_Gem", completed);

    farmStates.gem = false;
    farmCtl.gem = null;
    resetBtn("DR_Gem_Btn", "RUN");
  }

  async function completePracticeSession(endSecs, signal) {
    try {
      const sPayload = {
        challengeTypes: config.challengeTypes,
        fromLanguage: user.fromLanguage,
        isFinalLevel: false,
        isV2: true,
        juicy: true,
        learningLanguage: user.learningLanguage,
        smartTipsVersion: 2,
        type: "GLOBAL_PRACTICE",
      };

      const sRes = await fetchApi(
        "POST",
        config.api.sessions,
        sPayload,
        null,
        signal,
      );
      if (sRes.status !== 200) return false;

      const sData = safeJsonParse(sRes.responseText, {});
      if (!sData.id) return false;

      const fPayload = {
        ...sData,
        heartsLeft: 5,
        startTime: endSecs - 1,
        endTime: endSecs,
        enableBonusPoints: false,
        failed: false,
        maxInLessonStreak: 9,
        shouldLearnThings: true,
      };

      const fRes = await fetchApi(
        "PUT",
        `${config.api.sessions}/${sData.id}`,
        fPayload,
        null,
        signal,
      );
      return fRes.status === 200;
    } catch {
      return false;
    }
  }

  async function farmStreak(targetDays) {
    const isInfinite = targetDays === Infinity;
    stopBtn("DR_Streak_Btn");

    const tz = accountTimezone();
    let base;
    const dateStr = user.streakData?.currentStreak?.startDate;
    if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const parts = dateStr.split("-").map(Number);
      base = { year: parts[0], month: parts[1], day: parts[2] };
    } else {
      base = accountToday(tz);
    }

    let doneLoops = 0;
    let savedDays = 0;
    const sig = farmSignal("streak");

    while (farmStates.streak && (isInfinite || doneLoops < targetDays)) {
      const endSecs = wallClockToSeconds(
        tz,
        base.year,
        base.month,
        base.day - 1 - doneLoops,
        12,
        0,
        0,
      );

      if (farmStates.streak) {
        const ok = await completePracticeSession(endSecs, sig);
        if (ok && user) {
          savedDays++;
          user.streak++;
          showUser();
        }
      }

      doneLoops++;

      if (!isInfinite) {
        setProgress("DR_Streak", (doneLoops / targetDays) * 100);
      }

      await waitStop(delayMs, sig);
    }

    const completed = farmStates.streak;
    if (savedDays > 0) {
      addStat("streak", savedDays);
      notify(
        "success",
        completed ? "Streak Restored" : "Streak Farm Stopped",
        `Processed ${savedDays} days.`,
      );
      refreshStats();
    } else if (completed && doneLoops > 0) {
      notify(
        "error",
        "Streak Farm",
        "No days could be saved. Please try again.",
      );
    }

    clearProgress("DR_Streak", completed);

    farmStates.streak = false;
    farmCtl.streak = null;
    resetBtn("DR_Streak_Btn", "RUN");
  }

  async function keepStreak() {
    if (!user) return false;
    const tz = accountTimezone();
    const t = accountToday(tz);
    const endSecs = wallClockToSeconds(tz, t.year, t.month, t.day, 12, 0, 0);
    return completePracticeSession(endSecs);
  }

  async function autoKeepStreak() {
    if (localStorage.getItem("dr_auto_keep_streak") !== "true") return;
    if (!user || streakKeepBusy) return;
    const tz = accountTimezone();
    const t = accountToday(tz);
    const pad = (n) => String(n).padStart(2, "0");
    const todayIso = `${t.year}-${pad(t.month)}-${pad(t.day)}`;
    if (localStorage.getItem("dr_streak_kept_date") === todayIso) return;
    if (user.streakData?.currentStreak?.endDate === todayIso) {
      localStorage.setItem("dr_streak_kept_date", todayIso);
      return;
    }
    streakKeepBusy = true;
    try {
      const ok = await keepStreak();
      if (ok) {
        localStorage.setItem("dr_streak_kept_date", todayIso);
        refreshStats();
        notify("success", "Auto Keep Streak", "Your streak is safe for today.");
      }
    } finally {
      streakKeepBusy = false;
    }
  }

  async function autoReachRank(knownRank) {
    if (localStorage.getItem("dr_auto_reach_rank") !== "true") return;
    if (!userId || farmStates.league) return;
    const target = parseInt(localStorage.getItem("dr_league_target")) || 1;
    const rank = knownRank === undefined ? await getLeagueRank() : knownRank;
    if (rank && rank > target) {
      notify("info", "Auto Reach Rank", `Climbing to #${target}...`);
      farmStates.league = true;
      farmCtl.league = new AbortController();
      farmLeague(target);
    }
  }

  async function autoBlockLeague() {
    if (localStorage.getItem("dr_auto_block_league") !== "true") return;
    if (!userId || farmStates.blockmass || farmStates.unblock) return;
    farmStates.blockmass = true;
    try {
      const result = await blockLeagueUsers({ auto: true });
      if (!result.skipped && result.ok > 0) {
        notify(
          "success",
          "Auto Block League",
          `Blocked ${result.ok} league user(s).`,
        );
      }
    } finally {
      clearProgress("DR_Block_Mass", true);
      farmStates.blockmass = false;
      resetBtn("DR_Block_Mass_Btn", "RUN");
    }
  }

  async function autoQuestSaver() {
    if (localStorage.getItem("dr_auto_quest_saver") !== "true") return;
    if (!token || !userId || questSaverBusy) return;
    questSaverBusy = true;
    try {
      if (!questState) return;

      const schemaGoals = Array.isArray(questState.schema?.goals)
        ? questState.schema.goals
        : [];
      if (schemaGoals.length === 0) return;

      const t = accountToday(accountTimezone());
      const pad = (n) => String(n).padStart(2, "0");
      const monthlyKey = `${t.year}_${pad(t.month)}_monthly_challenge`;
      const progress = questState.progress || {};
      const keys = Object.keys(progress).filter((k) => k !== monthlyKey);
      if (keys.length === 0 || !keys.some((k) => progress[k] === 0)) return;

      const mSet = new Set();
      schemaGoals.forEach((goal) => {
        if (goal.metric && goal.metric !== "QUESTS") mSet.add(goal.metric);
      });
      if (mSet.size === 0) return;

      const monthPrefix = `${t.year}_${pad(t.month)}_monthly`;
      let monthlyThreshold = 0;
      schemaGoals.forEach((goal) => {
        if (goal.goalId && goal.goalId.startsWith(monthPrefix)) {
          monthlyThreshold = Math.max(monthlyThreshold, goal.threshold || 0);
        }
      });
      let monthlyProgress = 0;
      Object.keys(progress).forEach((k) => {
        if (!k.startsWith(monthPrefix)) return;
        const rd = progress[k];
        const v =
          typeof rd === "number" ? rd : rd && rd.progress ? rd.progress : 0;
        if (v > monthlyProgress) monthlyProgress = v;
      });

      const targetDay =
        monthlyThreshold > 0 ? Math.min(t.day, monthlyThreshold) : t.day;
      const questQty = Math.max(0, targetDay - monthlyProgress);

      const updates = [...mSet].map((mName) => ({
        metric: mName,
        quantity: 2000,
      }));
      if (questQty > 0) updates.push({ metric: "QUESTS", quantity: questQty });

      const bPayload = {
        metric_updates: updates,
        timezone: accountTimezone(),
        timestamp: accountNowIso(),
      };
      const res = await fetchApi(
        "POST",
        `${config.api.goals}/users/${userId}/progress/batch`,
        bPayload,
        setGoalHeaders(token),
      );
      if (res.status === 200) {
        notify("success", "Auto Quest Saver", "Your quests have been saved.");
        getQuests();
      }
    } catch {
    } finally {
      questSaverBusy = false;
    }
  }

  async function refreshQuestCenter() {
    if (!token || !userId) return;
    await getQuests();
    autoQuestSaver();
  }

  async function joinLeague() {
    let wasPrivate = false;
    try {
      const pRes = await fetchApi(
        "GET",
        `https://www.duolingo.com/2023-05-23/users/${userId}/privacy-settings?fields=privacySettings`,
      );
      if (pRes.status === 200) {
        const pData = safeJsonParse(pRes.responseText, {});
        const soc = (pData.privacySettings || []).find(
          (s) => s.id === "disable_social",
        );
        wasPrivate = soc ? soc.enabled : false;
      }
    } catch {}

    if (wasPrivate) {
      try {
        await fetchApi(
          "PATCH",
          `https://www.duolingo.com/2023-05-23/users/${userId}/privacy-settings?fields=privacySettings`,
          { DISABLE_SOCIAL: false },
        );
        await wait(2000);
      } catch {}
    }

    try {
      const ok = await playStory(0);
      if (ok && user) {
        user.totalXp += 30;
        showUser();
      }
    } catch {}

    if (wasPrivate) {
      try {
        await fetchApi(
          "PATCH",
          `https://www.duolingo.com/2023-05-23/users/${userId}/privacy-settings?fields=privacySettings`,
          { DISABLE_SOCIAL: true },
        );
      } catch {}
    }
  }

  async function farmLeague(targetRank) {
    stopBtn("DR_League_Btn");
    setProgress("DR_League", 10);

    let joinAttemptCount = 0;
    const sig = farmSignal("league");

    while (farmStates.league) {
      try {
        const res = await fetchApi(
          "GET",
          `${config.api.leaderboards}/users/${userId}?client_unlocked=true&_=${Date.now()}`,
          null,
          null,
          sig,
        );
        if (!farmStates.league) break;

        if (res.status !== 200) {
          await waitStop(3000, sig);
          continue;
        }

        const data = safeJsonParse(res.responseText, {});
        leagueDataCache = data;
        leagueDataTs = Date.now();
        applyLeagueSummary(data);
        const activeRanks = data?.active?.cohort?.rankings || [];
        const cRankings = activeRanks.find((u) => u.user_id == userId);

        if (!cRankings) {
          if (joinAttemptCount === 0) {
            joinAttemptCount = 1;
            notify(
              "info",
              "Auto League",
              "You are not in a league yet. Joining now...",
            );
            await joinLeague();
            await waitStop(3000, sig);
            continue;
          } else if (joinAttemptCount < 10) {
            joinAttemptCount++;
            try {
              const ok = await playStory(0, sig);
              if (ok && user) {
                user.totalXp += 30;
                showUser();
              }
            } catch {}
            await waitStop(3000, sig);
            continue;
          }
          notify(
            "error",
            "League Error",
            "Could not confirm league join status after 10 checks. Please try again later.",
          );
          break;
        }

        const cRankPos = activeRanks.indexOf(cRankings) + 1;
        const tUserRanking = activeRanks[targetRank - 1];

        if (!tUserRanking || cRankPos <= targetRank) {
          if (farmStates.league) {
            notify("success", "Goal Reached", `Reached Rank #${targetRank}!`);
          }
          setProgress("DR_League", 100);
          break;
        }

        const scoreGap = tUserRanking.score - cRankings.score;
        const progressPct = Math.min(
          95,
          Math.floor((cRankings.score / tUserRanking.score) * 100),
        );

        setProgress("DR_League", progressPct);

        const room = parseInt(localStorage.getItem("dr_xp_room")) || 0;
        const overshoot = room > 0 ? Math.min(500, Math.max(30, room)) : 5;

        if (scoreGap + overshoot > 0) {
          const bonus = Math.min(469, Math.max(0, scoreGap - 30 + overshoot));
          const ok = await playStory(bonus, sig);
          if (!farmStates.league) break;
          if (ok) {
            user.totalXp += 30 + bonus;
            showUser();
          } else {
            await waitStop(2000, sig);
          }
        }

        await waitStop(delayMs, sig);
      } catch {
        await waitStop(3000, sig);
      }
    }

    const completed = farmStates.league;
    if (!completed) {
      notify("warning", "Auto League Stopped", "Rank targeting aborted.");
    }

    clearProgress("DR_League", completed);
    refreshStats();

    farmStates.league = false;
    farmCtl.league = null;
    resetBtn("DR_League_Btn", "RUN");
  }

  function showConfirmModal(onConfirm) {
    const modal = document.getElementById("DR_Confirm_Modal");
    const btnCancel = document.getElementById("DR_Modal_Cancel");
    const btnConfirm = document.getElementById("DR_Modal_Confirm");

    const cleanup = () => {
      modal.classList.remove("show");
      btnCancel.removeEventListener("click", handleCancel);
      btnConfirm.removeEventListener("click", handleConfirm);
    };

    const handleCancel = () => cleanup();
    const handleConfirm = () => {
      cleanup();
      onConfirm();
    };

    btnCancel.addEventListener("click", handleCancel);
    btnConfirm.addEventListener("click", handleConfirm);

    modal.classList.add("show");
  }

  let leaguePollTimer = null;
  let leagueJoinAttempted = false;

  let leagueDataCache = null;
  let leagueDataTs = 0;
  const LEAGUE_TTL = 8000;

  async function fetchLeagueData(force) {
    if (!userId || !token) return null;
    const now = Date.now();
    if (!force && leagueDataCache && now - leagueDataTs < LEAGUE_TTL)
      return leagueDataCache;
    try {
      const res = await fetchApi(
        "GET",
        `${config.api.leaderboards}/users/${userId}?client_unlocked=true&get_reactions=true&_=${now}`,
      );
      if (res.status === 200) {
        const parsed = safeJsonParse(res.responseText);
        if (parsed) {
          leagueDataCache = parsed;
          leagueDataTs = Date.now();
        }
      }
    } catch {}
    return leagueDataCache;
  }

  function leagueRankFromData(data) {
    const active = data?.active;
    if (active && active.cohort && Array.isArray(active.cohort.rankings)) {
      const myIndex = active.cohort.rankings.findIndex(
        (r) => r.user_id == userId,
      );
      return myIndex !== -1 ? myIndex + 1 : 0;
    }
    return null;
  }

  function applyLeagueSummary(data) {
    const cohort = data?.active?.cohort;
    const rankings = cohort?.rankings;
    if (!Array.isArray(rankings)) return;
    const idx = rankings.findIndex((r) => String(r.user_id) === String(userId));
    const tier = cohort?.tier;
    updateLeagueBadge(tier);
    updateProfileLeague(tier, idx >= 0 ? idx + 1 : null);
  }

  async function getLeagueRank() {
    return leagueRankFromData(await fetchLeagueData(true));
  }

  function updateLeagueDropdown(rank) {
    const sel = document.getElementById("DR_League_Select");
    if (!sel) return;
    if (sel.classList.contains("open")) return;
    const opts = sel.querySelector(".DR_Select_Options");
    const text = sel.querySelector(".DR_Select_Text");
    const chevron = sel.querySelector(".DR_Chevron");
    const btn = document.getElementById("DR_League_Btn");
    const lbl = document.getElementById("DR_League_Lbl");

    if (btn && !farmStates.league) btn.disabled = false;
    if (lbl && !farmStates.league) lbl.innerText = "RUN";
    if (chevron) chevron.style.display = "";
    sel.style.pointerEvents = "auto";

    const maxPos = 15;
    let optHtml = "";
    for (let i = 1; i <= maxPos; i++) {
      optHtml += `<div class="DR_Select_Option" data-value="${i}"># ${i}</div>`;
    }
    opts.innerHTML = optHtml;

    const savedTarget = parseInt(localStorage.getItem("dr_league_target"));
    let currentVal = !isNaN(savedTarget)
      ? savedTarget
      : parseInt(sel.getAttribute("data-value")) || 1;
    if (currentVal < 1 || currentVal > maxPos) currentVal = 1;

    sel.setAttribute("data-value", currentVal.toString());
    text.innerText = `# ${currentVal}`;

    opts.querySelectorAll(".DR_Select_Option").forEach((opt) => {
      opt.classList.toggle(
        "selected",
        parseInt(opt.getAttribute("data-value")) === currentVal,
      );
    });
  }

  async function silentLeagueCheck() {
    if (leagueCheckBusy) return;
    if (!user || !userId || !token) return;
    leagueCheckBusy = true;
    try {
      let data = await fetchLeagueData(false);
      applyLeagueSummary(data);
      let rank = leagueRankFromData(data);

      if (rank === 0 || rank === null) {
        const autoJoin = localStorage.getItem("dr_auto_join_league") === "true";
        if (autoJoin && !leagueJoinAttempted && !farmStates.league) {
          leagueJoinAttempted = true;
          if (pageId === "Extra") updateLeagueDropdown(0);
          notify(
            "info",
            "Auto League",
            "You are not in a league yet. Joining now and farming XP to get placed...",
          );
          await joinLeague();
          let checkAttempts = 0;
          while (checkAttempts < 10) {
            try {
              const ok = await playStory(0);
              if (ok && user) {
                user.totalXp += 30;
                showUser();
              }
            } catch {}
            await wait(2000);
            data = await fetchLeagueData(true);
            applyLeagueSummary(data);
            rank = leagueRankFromData(data);
            if (rank && rank > 0) {
              break;
            }
            checkAttempts++;
          }

          if (rank && rank > 0) {
            if (pageId === "Extra") updateLeagueDropdown(rank);
            notify(
              "success",
              "Auto League",
              `Joined a league and reached rank #${rank}.`,
            );
            autoBlockLeague();
          } else {
            if (pageId === "Extra") updateLeagueDropdown(0);
            notify(
              "warning",
              "Auto League",
              "Farmed XP but could not confirm league placement after 10 tries. It may take some time to update.",
            );
          }
        } else if (pageId === "Extra") {
          updateLeagueDropdown(0);
        }
      } else if (rank !== null) {
        if (pageId === "Extra") updateLeagueDropdown(rank);
        autoReachRank(rank);
        autoBlockLeague();
      }

      if (pageId === "Board") showLeagueBoard(data);
    } finally {
      leagueCheckBusy = false;
    }
  }

  function startLeaguePolling() {
    silentLeagueCheck();
    if (leaguePollTimer) clearInterval(leaguePollTimer);
    leaguePollTimer = setInterval(silentLeagueCheck, 15000);
  }

  function stopLeaguePolling() {
    if (leaguePollTimer) {
      clearInterval(leaguePollTimer);
      leaguePollTimer = null;
    }
  }

  function timeQuest(idStr) {
    const match = idStr.match(/^(\d{4})_(\d{2})_monthly/);
    if (match) {
      const yr = parseInt(match[1]);
      const mo = parseInt(match[2]) - 1;
      return new Date(Date.UTC(yr, mo, 15, 12, 0, 0)).toISOString();
    }
    return new Date().toISOString();
  }

  async function getQuests() {
    const cont = document.getElementById("DR_Quest_Container");
    if (!cont) {
      return;
    }

    const forceBtn = document.getElementById("DR_Quest_Force_Btn");

    if (!token) {
      cont.innerHTML = `<p class="DR_T2 DR_NoSel" style="text-align: center;">Login required.</p>`;
      return;
    }

    const isRefresh = questState !== null;
    const prevScroll = cont.scrollTop;
    if (!isRefresh) {
      cont.innerHTML = `<p class="DR_T2 DR_NoSel" style="text-align: center;">Loading...</p>`;
    }

    try {
      const tzStr = encodeURIComponent(accountTimezone());
      const lang = uiLang();
      const [sRes, pRes] = await Promise.all([
        fetchApi(
          "GET",
          `${config.api.goals}/schema?ui_language=${lang}&_=${Date.now()}`,
          null,
          setGoalHeaders(token),
        ),
        fetchApi(
          "GET",
          `${config.api.goals}/users/${userId}/progress?timezone=${tzStr}&ui_language=${lang}`,
          null,
          setGoalHeaders(token),
        ),
      ]);

      if (sRes.status !== 200 || pRes.status !== 200) {
        throw new Error("Quest fetch failed");
      }

      const sData = safeJsonParse(sRes.responseText, {});
      const pData = safeJsonParse(pRes.responseText, {});

      questState = {
        schema: sData,
        progress: pData.goals?.progress || {},
        earned: new Set(pData.badges?.earned || []),
      };
      questStateTs = Date.now();

      showQuests();
      cont.scrollTop = prevScroll;

      if (forceBtn) {
        forceBtn.disabled = false;
      }
    } catch {
      if (!isRefresh)
        cont.innerHTML = `<p class="DR_T2 DR_NoSel" style="text-align: center; color: rgb(var(--DR-red));">Failed to load quests.</p>`;
    }
  }

  function questDisplayGoals() {
    if (!questState || !Array.isArray(questState.schema?.goals)) {
      return [];
    }
    const mGoalMap = new Map();
    questState.schema.goals.forEach((goal) => {
      if (!goal || !goal.goalId) return;
      const match = goal.goalId.match(/^(\d{4}_\d{2})_monthly/);
      if (!match) {
        mGoalMap.set(goal.goalId, goal);
        return;
      }
      const exGoal = mGoalMap.get(match[1]);
      if (!exGoal) {
        mGoalMap.set(match[1], goal);
      } else if (
        !exGoal.category?.includes("CHALLENGE") &&
        goal.category?.includes("CHALLENGE")
      ) {
        mGoalMap.set(match[1], goal);
      }
    });
    return [...mGoalMap.values()].reverse();
  }

  function questRemaining(goal) {
    const isEarned =
      questState.earned.has(goal.badgeId) || questState.earned.has(goal.goalId);
    if (isEarned) return 0;
    const rData = questState.progress[goal.goalId];
    let cVal = 0;
    if (typeof rData === "number") cVal = rData;
    else if (rData && rData.progress) cVal = rData.progress;
    return Math.max(0, (goal.threshold || 10) - cVal);
  }

  function showQuests(filterStr) {
    const cont = document.getElementById("DR_Quest_Container");
    if (!cont) {
      return;
    }

    const searchEl = document.getElementById("DR_Quest_Search");
    const query = (
      filterStr !== undefined ? filterStr : searchEl ? searchEl.value : ""
    )
      .trim()
      .toLowerCase();

    cont.innerHTML = "";
    const allGoals = questDisplayGoals();

    if (allGoals.length === 0) {
      cont.innerHTML = `<p class="DR_T2 DR_NoSel" style="text-align: center;">No active quests.</p>`;
      return;
    }

    const yearOf = (goal) => {
      const m = goal.goalId.match(/^(\d{4})_/);
      return m ? m[1] : "Daily";
    };

    const ddGoals = (
      query
        ? allGoals.filter((goal) =>
            (goal.title?.uiString || goal.goalId || "")
              .toLowerCase()
              .includes(query),
          )
        : allGoals
    ).filter((goal) => yearOf(goal) !== "Daily");

    if (ddGoals.length === 0) {
      cont.innerHTML = `<p class="DR_T2 DR_NoSel" style="text-align: center;">No quests found.</p>`;
      return;
    }

    const sorted = ddGoals.slice().sort((a, b) => {
      const ya = yearOf(a),
        yb = yearOf(b);
      if (ya === yb) return 0;
      if (ya === "Daily") return -1;
      if (yb === "Daily") return 1;
      return Number(yb) - Number(ya);
    });

    let lastYear = null;
    sorted.forEach((goal) => {
      const yr = yearOf(goal);
      if (yr !== lastYear) {
        lastYear = yr;
        const yHeader = document.createElement("div");
        yHeader.className = "DR_Shop_Section_Header DR_NoSel";
        yHeader.innerHTML = `<div class="DR_Shop_Section_Line"></div><span class="DR_Shop_Section_Title">${yr}</span><div class="DR_Shop_Section_Line"></div>`;
        cont.appendChild(yHeader);
      }
      const isEarned =
        questState.earned.has(goal.badgeId) ||
        questState.earned.has(goal.goalId);
      const rData = questState.progress[goal.goalId];

      let cVal = 0;
      if (typeof rData === "number") {
        cVal = rData;
      } else if (rData && rData.progress) {
        cVal = rData.progress;
      }

      const target = goal.threshold || 10;
      if (isEarned) {
        cVal = target;
      }

      const pct = Math.min(100, (cVal / target) * 100);
      const rem = Math.max(0, target - cVal);

      let qIconUrl =
        "https://d35aaqx5ub95lt.cloudfront.net/vendor/7ef36bae3f9d68fc763d3451b5167836.svg";

      if (
        goal.category?.includes("MONTHLY") &&
        Array.isArray(questState.schema?.badges)
      ) {
        const linked = questState.schema.badges?.find(
          (b) => b.badgeId === goal.badgeId,
        );
        if (linked && linked.icon?.enabled?.lightMode) {
          qIconUrl =
            linked.icon.enabled.lightMode.svg ||
            linked.icon.enabled.lightMode.url ||
            qIconUrl;
        }
      }

      const qItem = document.createElement("div");
      qItem.className = `DR_Quest_Item ${isEarned ? "done" : ""}`;

      let bruteHtml = "";
      if (!isEarned && rem > 0) {
        bruteHtml = `<button class="DR_Quest_Get_Btn" data-m="${escapeHtml(goal.metric || "")}" data-id="${escapeHtml(goal.goalId)}" data-amt="${rem}">BRUTE</button>`;
      }

      qItem.innerHTML = `
                <img src="${escapeHtml(qIconUrl)}" class="DR_Quest_Icon">
                <div class="DR_Quest_Info">
                    <p class="DR_Quest_Title DR_NoSel">${escapeHtml(goal.title?.uiString || goal.goalId)}</p>
                    <div class="DR_Quest_Bar_Bg">
                        <div class="DR_Quest_Bar_Fill" style="width: ${pct}%"></div>
                    </div>
                </div>
                ${bruteHtml}
            `;

      const actBtn = qItem.querySelector(".DR_Quest_Get_Btn");
      if (actBtn) {
        actBtn.addEventListener("click", async () => {
          actBtn.disabled = true;
          actBtn.innerText = "...";

          try {
            const tMetric = actBtn.dataset.m;
            const tAmt = parseInt(actBtn.dataset.amt);
            const tQId = actBtn.dataset.id;

            const updLoad = {
              metric_updates: [{ metric: tMetric, quantity: tAmt }],
              timezone: accountTimezone(),
              timestamp: timeQuest(tQId),
            };

            const res = await fetchApi(
              "POST",
              `${config.api.goals}/users/${userId}/progress/batch`,
              updLoad,
              setGoalHeaders(token),
            );

            if (res.status === 200) {
              actBtn.innerText = "✓";
              notify("success", "Quest updated", "Progress injected.");
              getQuests();
            } else {
              actBtn.innerText = "BRUTE";
              actBtn.disabled = false;
              notify("error", "Quest Failed", "Could not inject progress.");
            }
          } catch {
            actBtn.innerText = "BRUTE";
            actBtn.disabled = false;
            notify("error", "Network Error", "Could not inject progress.");
          }
        });
      }

      cont.appendChild(qItem);
    });
  }

  async function forceQuests() {
    if (!questState) {
      return;
    }

    const targets = questDisplayGoals().filter(
      (goal) => goal.metric && questRemaining(goal) > 0,
    );

    const forceBtn = document.getElementById("DR_Quest_Force_Btn");
    const forceLbl = forceBtn
      ? forceBtn.querySelector(".DR_Sm_Btn_Label")
      : null;

    if (targets.length === 0) {
      notify("info", "Quest Operations", "All quests are already complete.");
      return;
    }

    if (forceBtn) {
      forceBtn.disabled = true;
      if (forceLbl) forceLbl.innerText = "...";
    }

    let allOk = true;
    setProgress("DR_QuestForce", 0);
    try {
      for (let i = 0; i < targets.length; i++) {
        const goal = targets[i];
        const res = await fetchApi(
          "POST",
          `${config.api.goals}/users/${userId}/progress/batch`,
          {
            metric_updates: [
              { metric: goal.metric, quantity: questRemaining(goal) },
            ],
            timezone: accountTimezone(),
            timestamp: timeQuest(goal.goalId),
          },
          setGoalHeaders(token),
        );
        if (res.status !== 200) allOk = false;
        setProgress("DR_QuestForce", ((i + 1) / targets.length) * 100);
      }
      notify(
        allOk ? "success" : "warning",
        "Mass Operation",
        allOk
          ? "All quests brute-forced."
          : "Some quests could not be completed.",
      );
      clearProgress("DR_QuestForce", allOk);
      getQuests();
    } catch {
      notify("error", "Network Error", "Failed mass operation.");
      clearProgress("DR_QuestForce", false);
    }

    if (forceBtn) {
      forceBtn.disabled = false;
      if (forceLbl) forceLbl.innerText = "FORCE ALL";
    }
  }

  function formatName(raw) {
    return raw
      .split("_")
      .map((word) => {
        if (word === "xp") {
          return "XP";
        }
        if (!isNaN(word)) {
          return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  function sortShop(rawList) {
    const vItems = rawList.filter((item) => item.currencyType === "XGM");

    const pItems = vItems.map((item) => {
      const safeId = item.id || "";
      let name = item.name || (safeId ? formatName(safeId) : "Unknown Item");
      let cat = "Misc";
      let ico = icons.shopIcons.misc;

      if (safeId.includes("streak_freeze")) {
        cat = "Streak Freezes";
        ico = icons.shopIcons.streak;
      } else if (safeId.includes("xp_boost")) {
        cat = "XP Boosts";
        ico = icons.shopIcons.xp;
        if (safeId.match(/\d+$/)) {
          name += " Mins";
        }
      } else if (safeId.includes("health") || safeId.includes("heart")) {
        cat = "Hearts";
        ico = icons.shopIcons.heart;
        if (safeId.includes("partial")) {
          const numMatch = safeId.match(/\d$/);
          if (numMatch) {
            name = `Health Refill Partial (${numMatch[0]} Heart)`;
          }
        }
      } else if (safeId.includes("gem")) {
        cat = "Gems";
        ico = icons.shopIcons.gem;
      } else if (item.type === "outfit") {
        cat = "Outfits";
        ico = icons.shopIcons.outfit;
      } else if (safeId.includes("free_taste")) {
        cat = "Free Taste";
        ico = icons.shopIcons.free;
      }

      if (safeId.includes("gift")) {
        cat = "Gifts";
      }

      return {
        ...item,
        displayName: name,
        category: cat,
        icon: ico,
      };
    });

    const ord = [
      "Streak Freezes",
      "XP Boosts",
      "Hearts",
      "Gems",
      "Outfits",
      "Free Taste",
      "Gifts",
      "Misc",
    ];

    return pItems.sort((a, b) => {
      const idxA = ord.indexOf(a.category);
      const idxB = ord.indexOf(b.category);
      if (idxA !== idxB) {
        return idxA - idxB;
      }
      const nameA = a.displayName || "";
      const nameB = b.displayName || "";
      return nameA.localeCompare(nameB);
    });
  }

  const preloadedShopIcons = {};

  async function getShop() {
    const cont = document.getElementById("DR_Shop_Container");
    if (!cont) return;

    try {
      const res = await fetchApi("GET", config.api.shop);
      if (res.status === 200) {
        const rData = safeJsonParse(res.responseText, {});
        shopCache = sortShop(rData.shopItems || []);

        shopCache.forEach((item) => {
          if (item.icon && !preloadedShopIcons[item.icon]) {
            const img = new Image();
            img.src = item.icon;
            img.className = "DR_Shop_Ico";
            preloadedShopIcons[item.icon] = img;
          }
        });

        showShop("");
      } else {
        cont.innerHTML = `<p class="DR_T2 DR_NoSel" style="text-align: center; color: rgb(var(--DR-red));">Failed to load shop. Please try again.</p>`;
      }
    } catch {
      cont.innerHTML = `<p class="DR_T2 DR_NoSel" style="text-align: center; color: rgb(var(--DR-red));">Failed to load shop. Please try again.</p>`;
    }
  }

  function showShop(filterStr) {
    const cont = document.getElementById("DR_Shop_Container");
    if (!cont) return;

    cont.innerHTML = "";
    const query = (filterStr || "").trim().toLowerCase();

    const fPowerUps = query
      ? powerUpItems.filter((p) => p.name.toLowerCase().includes(query))
      : powerUpItems;

    const fItems = query
      ? shopCache.filter((i) =>
          ((i.displayName || "") + (i.id || "")).toLowerCase().includes(query),
        )
      : shopCache;

    if (fPowerUps.length === 0 && fItems.length === 0) {
      cont.innerHTML = `<p class="DR_T2 DR_NoSel" style="text-align: center;">No items found.</p>`;
      return;
    }

    const grid = document.createElement("div");
    grid.className = "DR_Shop_Grid";

    const fragment = document.createDocumentFragment();

    if (fPowerUps.length > 0) {
      const puHeader = document.createElement("div");
      puHeader.className = "DR_Shop_Section_Header DR_NoSel";
      puHeader.innerHTML = `
                <div class="DR_Shop_Section_Line"></div>
                <span class="DR_Shop_Section_Title">Power-Ups</span>
                <div class="DR_Shop_Section_Line"></div>
            `;
      fragment.appendChild(puHeader);

      fPowerUps.forEach((item) => {
        const card = document.createElement("div");
        card.className = "DR_Shop_Card";

        const ico = document.createElement("img");
        ico.className = "DR_Shop_Ico DR_NoSel";
        ico.src = item.ico;
        card.appendChild(ico);

        const nameDiv = document.createElement("div");
        nameDiv.className = "DR_Shop_Name DR_NoSel";
        nameDiv.innerText = item.name;
        card.appendChild(nameDiv);

        const btn = document.createElement("button");
        btn.className = "DR_Shop_Btn";
        btn.innerText = "GET";
        btn.addEventListener("click", async () => {
          if (btn.className.includes("loading")) return;
          btn.className = "DR_Shop_Btn loading";
          btn.innerText = "...";
          const r = await applyPowerUp(item);
          if (r.ok) {
            btn.className = "DR_Shop_Btn got";
            btn.innerText = "✓";
            notify("success", "Power-Ups", `${item.name} applied.`);
          } else {
            btn.className = "DR_Shop_Btn fail";
            btn.innerText = "ERR";
            notify("error", "Power-Ups", r.msg);
          }
          setTimeout(() => {
            btn.className = "DR_Shop_Btn";
            btn.innerText = "GET";
          }, 2000);
        });
        card.appendChild(btn);
        fragment.appendChild(card);
      });
    }

    let currentCategory = null;

    fItems.forEach((item) => {
      if (item.category !== currentCategory) {
        currentCategory = item.category;
        const secHeader = document.createElement("div");
        secHeader.className = "DR_Shop_Section_Header DR_NoSel";
        secHeader.innerHTML = `
                    <div class="DR_Shop_Section_Line"></div>
                    <span class="DR_Shop_Section_Title">${currentCategory}</span>
                    <div class="DR_Shop_Section_Line"></div>
                `;
        fragment.appendChild(secHeader);
      }

      const card = document.createElement("div");
      card.className = "DR_Shop_Card";

      if (item.icon && preloadedShopIcons[item.icon]) {
        card.appendChild(preloadedShopIcons[item.icon].cloneNode(true));
      }

      const nameDiv = document.createElement("div");
      nameDiv.className = "DR_Shop_Name DR_NoSel";
      nameDiv.innerText = item.displayName || "Unknown";
      card.appendChild(nameDiv);

      const btn = document.createElement("button");
      btn.className = "DR_Shop_Btn";
      btn.dataset.id = item.id;
      btn.innerText = "GET";

      btn.addEventListener("click", async () => {
        if (btn.className.includes("loading")) return;
        btn.className = "DR_Shop_Btn loading";
        btn.innerText = "...";

        const result = await applyPowerUp({
          id: item.id,
          refill: /refill/i.test(item.id),
        });
        if (result.ok) {
          btn.className = "DR_Shop_Btn got";
          btn.innerText = "✓";
          notify("success", "Shop Success", `Acquired ${item.displayName}.`);
          setTimeout(() => {
            btn.className = "DR_Shop_Btn";
            btn.innerText = "GET";
          }, 2000);
        } else {
          btn.className = "DR_Shop_Btn fail";
          btn.innerText = "ERR";
          notify("error", "Shop Failed", `${item.displayName}: ${result.msg}`);
          setTimeout(() => {
            btn.className = "DR_Shop_Btn";
            btn.innerText = "GET";
          }, 2000);
        }
      });

      card.appendChild(btn);
      fragment.appendChild(card);
    });

    grid.appendChild(fragment);
    cont.appendChild(grid);
  }

  async function getPrivacy() {
    if (!token || !userId) {
      return;
    }

    try {
      const res = await fetchApi(
        "GET",
        `https://www.duolingo.com/2023-05-23/users/${userId}/privacy-settings?fields=privacySettings`,
      );
      if (res.status !== 200) return;

      const pData = safeJsonParse(res.responseText, {});
      const socSet = pData.privacySettings?.find(
        (s) => s.id === "disable_social",
      );
      const isPriv = socSet ? socSet.enabled : false;

      const selEl = document.getElementById("DR_Privacy_Select");
      if (selEl) {
        const tVal = isPriv ? "private" : "public";
        selEl.setAttribute("data-value", tVal);
        selEl.querySelector(".DR_Select_Text").innerText = isPriv
          ? "Private"
          : "Public";

        selEl.querySelectorAll(".DR_Select_Option").forEach((opt) => {
          if (opt.getAttribute("data-value") === tVal) {
            opt.style.color = "rgb(var(--DR-blue))";
            opt.style.background = "rgba(var(--DR-blue),0.1)";
          } else {
            opt.style.color = "";
            opt.style.background = "";
          }
        });
      }
    } catch {}
  }

  async function setPrivacy(modePriv) {
    if (!token || !userId) {
      return;
    }

    try {
      const res = await fetchApi(
        "PATCH",
        `https://www.duolingo.com/2023-05-23/users/${userId}/privacy-settings?fields=privacySettings`,
        { DISABLE_SOCIAL: modePriv },
      );
      if (res.status !== 200) {
        throw new Error("Privacy update failed");
      }

      notify(
        "success",
        "Privacy Updated",
        `Profile is now ${modePriv ? "Private" : "Public"}.`,
      );
    } catch {
      notify("error", "Update Failed", "Could not change privacy settings.");
    }
  }

  async function resolveUser(username) {
    try {
      const res = await fetchApi(
        "GET",
        `${config.api.users}?username=${encodeURIComponent(username)}`,
      );
      if (res.status === 200) {
        const data = safeJsonParse(res.responseText, {});
        const found = (data.users || [])[0];
        return found ? found.id : null;
      }
    } catch {}
    return null;
  }

  async function requestEmailVerification() {
    try {
      const res = await fetchApi(
        "POST",
        `${config.api.users}/${userId}/email-verifications`,
        {},
      );
      if (res.status === 200 || res.status === 201 || res.status === 204) {
        notify(
          "success",
          "Verification Email",
          user.email
            ? `Sent to ${user.email}. Verify it, then reload.`
            : "Verification email sent. Verify it, then reload.",
        );
      } else {
        notify(
          "error",
          "Verification Email",
          `Could not send (status ${res.status}). Verify on Duolingo directly.`,
        );
      }
    } catch {
      notify(
        "error",
        "Verification Email",
        "Request failed. Verify on Duolingo directly.",
      );
    }
  }

  async function ensureEmailVerified() {
    if (!user) {
      notify("error", "Social Tools", "Wait for connection.");
      return false;
    }
    if (user.emailVerified) return true;
    notify(
      "warning",
      "Email Not Verified",
      "Click here to verify your email.",
      requestEmailVerification,
    );
    return false;
  }

  async function blockTarget(username, unblock) {
    const label = unblock ? "Unblock" : "Block";
    if (!(await ensureEmailVerified())) return;
    const target = await resolveUser(username);
    if (!target) {
      notify("error", label, `Could not find user "${username}".`);
      return;
    }
    try {
      const res = await fetchApi(
        unblock ? "DELETE" : "POST",
        `${config.api.friends}/users/${userId}/block/${target}`,
      );
      if (res.status === 200 || res.status === 201) {
        if (unblock) autoBlockCohortKey = null;
        notify(
          "success",
          label,
          `${unblock ? "Unblocked" : "Blocked"} ${username}.`,
        );
      } else {
        notify("error", label, `Failed with status ${res.status}.`);
      }
    } catch {
      notify("error", label, "Request failed.");
    }
  }

  async function followTarget(username, unfollow) {
    const label = unfollow ? "Unfollow" : "Follow";
    if (!(await ensureEmailVerified())) return;
    const target = await resolveUser(username);
    if (!target) {
      notify("error", label, `Could not find user "${username}".`);
      return;
    }
    try {
      const res = await fetchApi(
        unfollow ? "DELETE" : "POST",
        `${config.api.friends}/users/${userId}/follow/${target}`,
        unfollow ? null : { component: "profile_header_button" },
      );
      if (res.status === 200 || res.status === 201) {
        notify(
          "success",
          label,
          `${unfollow ? "Unfollowed" : "Followed"} ${username}.`,
        );
      } else {
        notify("error", label, `Failed with status ${res.status}.`);
      }
    } catch {
      notify("error", label, "Request failed.");
    }
  }

  async function massUnfollow() {
    if (farmStates.unfollow) {
      farmStates.unfollow = false;
      resetBtn("DR_Follow_Btn", "RUN");
      return;
    }
    if (!(await ensureEmailVerified())) return;
    farmStates.unfollow = true;
    stopBtn("DR_Follow_Btn");

    let list = [];
    try {
      const res = await fetchApi(
        "GET",
        `${config.api.friends}/users/${userId}/following?viewerId=${userId}`,
      );
      if (res.status === 200) {
        list = safeJsonParse(res.responseText, {}).following?.users || [];
      }
    } catch {}

    if (list.length === 0) {
      notify("info", "Mass Unfollow", "You are not following anyone.");
      farmStates.unfollow = false;
      resetBtn("DR_Follow_Btn", "RUN");
      return;
    }

    let done = 0;
    let ok = 0;
    for (const entry of list) {
      if (!farmStates.unfollow) break;
      try {
        const res = await fetchApi(
          "DELETE",
          `${config.api.friends}/users/${userId}/follow/${entry.userId}`,
        );
        if (res.status === 200) ok++;
      } catch {}
      done++;
      setProgress("DR_Follow", (done / list.length) * 100);
      await wait(delayMs);
    }

    const completed = farmStates.unfollow;
    notify(
      "success",
      completed ? "Mass Unfollow Complete" : "Mass Unfollow Stopped",
      `Unfollowed ${ok} user(s).`,
    );
    clearProgress("DR_Follow", completed);
    farmStates.unfollow = false;
    resetBtn("DR_Follow_Btn", "RUN");
  }

  async function massUnblock() {
    if (farmStates.unblock) {
      farmStates.unblock = false;
      resetBtn("DR_Block_Mass_Btn", "RUN");
      return;
    }
    if (!(await ensureEmailVerified())) return;
    farmStates.unblock = true;
    stopBtn("DR_Block_Mass_Btn");

    let list = [];
    try {
      const res = await fetchApi(
        "GET",
        `${config.api.users}/${userId}?fields=blockedUserIds`,
      );
      if (res.status === 200) {
        list = safeJsonParse(res.responseText, {}).blockedUserIds || [];
      }
    } catch {}

    if (list.length === 0) {
      notify("info", "Mass Unblock", "You have not blocked anyone.");
      farmStates.unblock = false;
      resetBtn("DR_Block_Mass_Btn", "RUN");
      return;
    }

    let done = 0;
    let ok = 0;
    for (const blockedId of list) {
      if (!farmStates.unblock) break;
      try {
        const res = await fetchApi(
          "DELETE",
          `${config.api.friends}/users/${userId}/block/${blockedId}`,
        );
        if (res.status === 200) ok++;
      } catch {}
      done++;
      setProgress("DR_Block_Mass", (done / list.length) * 100);
      await wait(delayMs);
    }

    const completed = farmStates.unblock;
    if (ok > 0) autoBlockCohortKey = null;
    notify(
      "success",
      completed ? "Mass Unblock Complete" : "Mass Unblock Stopped",
      `Unblocked ${ok} user(s).`,
    );
    clearProgress("DR_Block_Mass", completed);
    farmStates.unblock = false;
    resetBtn("DR_Block_Mass_Btn", "RUN");
  }

  async function getCohortIds(force = true) {
    const rankings = (await fetchLeagueData(force))?.active?.cohort?.rankings;
    if (Array.isArray(rankings)) {
      return rankings
        .map((r) => r.user_id)
        .filter((id) => id && String(id) !== String(userId));
    }
    return null;
  }

  async function massFollow() {
    if (farmStates.follow) {
      farmStates.follow = false;
      resetBtn("DR_Follow_Btn", "RUN");
      return;
    }
    if (!(await ensureEmailVerified())) return;
    farmStates.follow = true;
    stopBtn("DR_Follow_Btn");

    const ids = new Set();
    const cohort = await getCohortIds();
    if (Array.isArray(cohort)) cohort.forEach((id) => ids.add(String(id)));

    try {
      const res = await fetchApi(
        "GET",
        `${config.api.friends}/users/${userId}/followers?viewerId=${userId}`,
      );
      if (res.status === 200) {
        (safeJsonParse(res.responseText, {}).followers?.users || []).forEach(
          (u) => ids.add(String(u.userId)),
        );
      }
    } catch {}

    ids.delete(String(userId));
    try {
      const res = await fetchApi(
        "GET",
        `${config.api.friends}/users/${userId}/following?viewerId=${userId}`,
      );
      if (res.status === 200) {
        (safeJsonParse(res.responseText, {}).following?.users || []).forEach(
          (u) => ids.delete(String(u.userId)),
        );
      }
    } catch {}

    const list = [...ids];
    if (list.length === 0) {
      notify("info", "Mass Follow", "No new users to follow.");
      farmStates.follow = false;
      resetBtn("DR_Follow_Btn", "RUN");
      return;
    }

    let done = 0;
    let ok = 0;
    for (const id of list) {
      if (!farmStates.follow) break;
      try {
        const res = await fetchApi(
          "POST",
          `${config.api.friends}/users/${userId}/follow/${id}`,
          { component: "profile_header_button" },
        );
        if (res.status === 200 || res.status === 201) ok++;
      } catch {}
      done++;
      setProgress("DR_Follow", (done / list.length) * 100);
      await wait(delayMs);
    }

    const completed = farmStates.follow;
    notify(
      "success",
      completed ? "Mass Follow Complete" : "Mass Follow Stopped",
      `Followed ${ok} user(s).`,
    );
    clearProgress("DR_Follow", completed);
    farmStates.follow = false;
    resetBtn("DR_Follow_Btn", "RUN");
  }

  async function blockLeagueUsers(options = {}) {
    const isAuto = !!options.auto;
    const title = isAuto ? "Auto Block League" : "Mass Block";
    const cohort = await getCohortIds(false);
    if (cohort === null) {
      if (!isAuto)
        notify("error", title, "No league cohort found. Join a league first.");
      return { ok: 0, total: 0, skipped: true };
    }

    const cohortKey = cohort.map(String).sort().join(",");
    if (isAuto && autoBlockCohortKey === cohortKey) {
      return { ok: 0, total: 0, skipped: true };
    }

    let blocked = [];
    try {
      const res = await fetchApi(
        "GET",
        `${config.api.users}/${userId}?fields=blockedUserIds`,
      );
      if (res.status === 200)
        blocked = safeJsonParse(res.responseText, {}).blockedUserIds || [];
    } catch {}
    const blockedSet = new Set(blocked.map(String));

    const list = cohort.filter((id) => !blockedSet.has(String(id)));
    if (list.length === 0) {
      if (!isAuto || autoBlockCohortKey !== cohortKey) {
        notify("info", title, "Everyone in your league is already blocked.");
      }
      autoBlockCohortKey = cohortKey;
      return { ok: 0, total: 0, skipped: true };
    }

    let done = 0;
    let ok = 0;
    for (const id of list) {
      if (!farmStates.blockmass) break;
      try {
        const res = await fetchApi(
          "POST",
          `${config.api.friends}/users/${userId}/block/${id}`,
        );
        if (res.status === 200 || res.status === 201) ok++;
      } catch {}
      done++;
      setProgress("DR_Block_Mass", (done / list.length) * 100);
      await wait(delayMs);
    }

    if (ok === list.length) autoBlockCohortKey = cohortKey;
    return { ok, total: list.length, skipped: false };
  }

  async function massBlock() {
    if (farmStates.blockmass) {
      farmStates.blockmass = false;
      resetBtn("DR_Block_Mass_Btn", "RUN");
      return;
    }
    if (!(await ensureEmailVerified())) return;
    farmStates.blockmass = true;
    stopBtn("DR_Block_Mass_Btn");

    const result = await blockLeagueUsers();
    const completed = farmStates.blockmass;
    if (!result.skipped) {
      notify(
        "success",
        completed ? "Mass Block Complete" : "Mass Block Stopped",
        `Blocked ${result.ok} user(s).`,
      );
    }
    clearProgress("DR_Block_Mass", completed);
    farmStates.blockmass = false;
    resetBtn("DR_Block_Mass_Btn", "RUN");
  }

  const powerUpItems = [
    { id: "streak_repair", name: "Streak Repair", ico: icons.shopIcons.streak },
    {
      id: "society_streak_freeze",
      name: "Streak Freeze",
      ico: icons.shopIcons.streak,
    },
    {
      id: "general_xp_boost",
      name: "General XP Boost",
      ico: icons.shopIcons.xp,
    },
    {
      id: "xp_boost_stackable",
      name: "XP Boost (Stackable)",
      ico: icons.shopIcons.xp,
    },
    { id: "xp_boost_15", name: "XP Boost x2 (15m)", ico: icons.shopIcons.xp },
    { id: "xp_boost_60", name: "XP Boost x2 (60m)", ico: icons.shopIcons.xp },
    {
      id: "xp_boost_refill",
      name: "XP Boost x3 (15m)",
      ico: icons.shopIcons.xp,
      refill: true,
    },
    {
      id: "early_bird_xp_boost",
      name: "Early Bird Boost",
      ico: icons.shopIcons.xp,
    },
  ];

  async function applyPowerUp(item) {
    if (!token || !userId) return { ok: false, msg: "Login required." };
    try {
      let res;
      if (item.refill) {
        const innerBody = {
          isFree: false,
          learningLanguage: user.learningLanguage,
          subscriptionFeatureGroupId: 0,
          xpBoostSource: "REFILL",
          xpBoostMinutes: 15,
          xpBoostMultiplier: 3,
          id: item.id,
        };
        const batch = {
          includeHeaders: true,
          requests: [
            {
              url: `/2023-05-23/users/${userId}/shop-items`,
              extraHeaders: {},
              method: "POST",
              body: JSON.stringify(innerBody),
            },
          ],
        };
        const refillHeaders = Object.assign({}, headers, {
          "x-amzn-trace-id": "User=" + userId,
        });
        res = await fetchApi(
          "POST",
          "https://ios-api-2.duolingo.com/2023-05-23/batch",
          batch,
          refillHeaders,
        );
      } else {
        res = await fetchApi(
          "POST",
          `${config.api.users}/${userId}/shop-items`,
          {
            itemName: item.id,
            isFree: true,
            consumed: true,
            fromLanguage: user.fromLanguage,
            learningLanguage: user.learningLanguage,
          },
        );
      }
      if (res.status === 200 || res.status === 201) return { ok: true };
      return { ok: false, msg: `Failed (${res.status}).` };
    } catch {
      return { ok: false, msg: "Request failed." };
    }
  }

  async function sendGift(username, itemName) {
    username = (username || "").trim();
    const btn = document.getElementById("DR_Gift_Btn");
    const lbl = btn ? btn.querySelector(".DR_Sm_Btn_Label") : null;
    if (!username) {
      notify("warning", "Send Gift", "Enter a username.");
      return;
    }
    if (!(await ensureEmailVerified())) return;

    if (btn) btn.disabled = true;
    if (lbl) lbl.innerText = "...";

    const target = await resolveUser(username);
    if (!target) {
      notify("error", "Send Gift", `Could not find user "${username}".`);
    } else {
      try {
        const res = await fetchApi(
          "POST",
          `${config.api.users}/${userId}/gifts/${target}`,
          { itemName: itemName },
        );
        if (res.status === 200 || res.status === 201) {
          notify("success", "Send Gift", `Gift sent to ${username}.`);
        } else {
          notify("error", "Send Gift", `Failed with status ${res.status}.`);
        }
      } catch {
        notify("error", "Send Gift", "Request failed.");
      }
    }

    if (btn) btn.disabled = false;
    if (lbl) lbl.innerText = "RUN";
  }

  async function forceFriend(username, mode) {
    username = (username || "").trim();
    const isQuest = mode === "quest";
    const label = isQuest ? "Friends Quest" : "Friend Streak";
    const btn = document.getElementById("DR_Friend_Btn");
    const lbl = btn ? btn.querySelector(".DR_Sm_Btn_Label") : null;
    if (!username) {
      notify("warning", label, "Enter a username.");
      return;
    }
    if (!(await ensureEmailVerified())) return;

    if (btn) btn.disabled = true;
    if (lbl) lbl.innerText = "...";

    const displayName = username;
    const target = await resolveUser(username);

    if (!target) {
      notify("error", label, `Could not find user "${username}".`);
    } else {
      try {
        if (isQuest) {
          const chk = await fetchApi(
            "GET",
            `https://www.duolingo.com/users/${userId}/friends-quests/match`,
          );
          let existing = null;
          if (chk.status === 200) {
            existing = safeJsonParse(chk.responseText, {}).match || null;
          }
          if (existing) {
            const mu = existing.matchedUser || {};
            notify(
              "warning",
              label,
              `Already in a quest with ${mu.name || "someone"}.`,
            );
          } else {
            const res = await fetchApi(
              "POST",
              `https://www.duolingo.com/2017-06-30/friends/users/${userId}/friends-quests/match`,
              { targetUserId: parseInt(target) },
            );
            let ok = false;
            if (res.status === 200) {
              ok = safeJsonParse(res.responseText, {}).success === true;
            }
            if (ok) {
              notify("success", label, `Quest started with ${displayName}.`);
            } else {
              notify(
                "error",
                label,
                `Could not start a quest with ${displayName}.`,
              );
            }
          }
        } else {
          const res = await fetchApi(
            "POST",
            `https://www.duolingo.com/2017-06-30/friends/users/${userId}/matches`,
            {
              activityName: "friendsStreak",
              intendedMatches: [{ targetUserIds: [parseInt(target)] }],
            },
          );
          let ok = res.status === 200;
          let failReason = null;
          if (ok) {
            try {
              const d = safeJsonParse(res.responseText, {});
              const fStreak = d.friendsStreak || {};
              const successList = Array.isArray(fStreak.success)
                ? fStreak.success
                : [];
              const failList = Array.isArray(fStreak.fail) ? fStreak.fail : [];
              ok = successList.length > 0 && failList.length === 0;
              if (!ok && failList.length > 0) {
                failReason = failList[0].failureReason || null;
              }
            } catch {
              ok = false;
            }
          }
          if (ok) {
            notify("success", label, `Streak started with ${displayName}.`);
          } else {
            notify(
              "error",
              label,
              failReason
                ? `Could not start a streak with ${displayName}: ${failReason}`
                : `Could not start a streak with ${displayName}.`,
            );
          }
        }
      } catch {
        notify("error", label, "Request failed.");
      }
    }

    if (btn) btn.disabled = false;
    if (lbl) lbl.innerText = "RUN";
  }

  function scrollToActiveStatus() {
    const doScroll = () => {
      const cont = document.getElementById("DR_Status_Container");
      if (!cont) return;
      const activeBtn = cont.querySelector(".DR_Shop_Btn.got");
      const card = activeBtn ? activeBtn.closest(".DR_Shop_Card") : null;
      if (!card || !cont.clientHeight) return;
      const contRect = cont.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const offset =
        cardRect.top -
        contRect.top +
        cont.scrollTop -
        cont.clientHeight / 2 +
        cardRect.height / 2;
      cont.scrollTop = Math.max(0, offset);
    };
    requestAnimationFrame(() => requestAnimationFrame(doScroll));
    setTimeout(doScroll, 450);
  }

  async function openStatusPicker() {
    const search = document.getElementById("DR_Status_Search");
    if (search) search.value = "";
    showStatuses("");
    changePage("Status");
    currentStatus = await getCurrentStatus();
    showStatuses("");
    scrollToActiveStatus();
  }

  function updateLeagueBadge(tier) {
    const url = leagueBadgeUrl(tier);
    const name =
      typeof tier === "number" && leagueTierNames[tier]
        ? leagueTierNames[tier] + " League"
        : "Leaderboard";
    const navIco = document.getElementById("DR_Board_Nav_Ico");
    const tierIco = document.getElementById("DR_Board_Tier_Ico");
    const tierName = document.getElementById("DR_Board_Tier_Name");
    if (navIco) navIco.src = url;
    if (tierIco) tierIco.src = url;
    if (tierName) tierName.innerText = name;
  }

  function updateProfileLeague(tier, rank) {
    const wrap = document.getElementById("DR_ULeague_Wrap");
    const ico = document.getElementById("DR_ULeague_Ico");
    const rk = document.getElementById("DR_ULeague_Rank");
    if (!wrap || !ico || !rk) return;
    if (typeof tier !== "number" || !rank) {
      wrap.style.display = "none";
      return;
    }
    ico.src = leagueBadgeUrl(tier);
    rk.innerText = "#" + rank;
    wrap.style.display = "flex";
  }

  function makeBoardSeparator(type) {
    const isProm = type === "prom";
    const arrowUrl = isProm
      ? "https://d35aaqx5ub95lt.cloudfront.net/images/leagues/577cf633b59ce72791f725d0cb973061.svg"
      : "https://d35aaqx5ub95lt.cloudfront.net/images/leagues/248453c5e2d9de19fba7a2f4fef7f016.svg";
    const textStr = isProm ? "Promotion Zone" : "Demotion Zone";
    const sep = document.createElement("div");
    sep.className = "DR_LB_Sep";
    sep.style.cssText =
      "display: flex; align-items: center; gap: 8px; margin: 6px 2px; height: 14px; align-self: stretch;";

    const lineCol = isProm
      ? "rgba(var(--DR-green), 0.35)"
      : "rgba(var(--DR-red), 0.35)";
    const textCol = isProm ? "rgb(var(--DR-green))" : "rgb(var(--DR-red))";

    sep.innerHTML = `
            <div style="flex: 1; height: 1px; background: ${lineCol}; border-radius: 1px;"></div>
            <div style="display: flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: ${textCol}; flex-shrink: 0;">
                <img class="DR_NoSel" src="${arrowUrl}" style="width: 14px; height: 14px; object-fit: contain; flex-shrink: 0;">
                <span>${textStr}</span>
                <img class="DR_NoSel" src="${arrowUrl}" style="width: 14px; height: 14px; object-fit: contain; flex-shrink: 0;">
            </div>
            <div style="flex: 1; height: 1px; background: ${lineCol}; border-radius: 1px;"></div>
        `;
    return sep;
  }

  async function showLeagueBoard(preData) {
    const cont = document.getElementById("DR_Board_Container");
    if (!cont) return;
    const loaded = cont.dataset.loaded === "1";
    if (!loaded)
      cont.innerHTML = `<p class="DR_T2 DR_NoSel" style="text-align: center; padding: 8px 0;">Loading...</p>`;

    try {
      const data = preData || (await fetchLeagueData(false));
      const cohort = data?.active?.cohort;
      const contest = data?.active?.contest;
      const rankings = cohort?.rankings;
      if (!Array.isArray(rankings) || rankings.length === 0) {
        if (!loaded)
          cont.innerHTML = `<p class="DR_T2 DR_NoSel" style="text-align: center; color: rgb(var(--DR-red));">You are not in an active league.</p>`;
        return;
      }

      const tier = cohort?.tier;
      updateLeagueBadge(tier);

      const nProm = (contest?.ruleset?.num_promoted || [])[tier] || 0;
      const nDem = (contest?.ruleset?.num_demoted || [])[tier] || 0;
      const total = rankings.length;

      const statusMap = {};
      statusReactions.forEach((s) => {
        statusMap[s.value] = s;
      });

      const frag = document.createDocumentFragment();
      const setIco = DUO_LEAGUES_CDN + "6df6337370e45c1b9a5029e78211d114.svg";
      let myStatus = null;
      let myRank = null;
      rankings.forEach((r, i) => {
        const rank = i + 1;
        const isMe = String(r.user_id) === String(userId);
        const av = r.avatar_url
          ? (r.avatar_url.startsWith("http")
              ? r.avatar_url
              : "https:" + r.avatar_url) + "/xlarge"
          : "";
        const st =
          r.reaction && r.reaction !== "NONE" ? statusMap[r.reaction] : null;
        if (isMe) {
          myStatus = st;
          myRank = rank;
        }
        let statusHtml;
        if (isMe) {
          const inner = st
            ? renderStatusIcon(st, 12)
            : `<img src="${setIco}" alt="" style="width: 12px; height: 12px; object-fit: contain; opacity: 0.5;">`;
          statusHtml = `<div class="DR_Board_MyStatus DR_NoSel" title="Tap to change your status" style="position: absolute; right: -5px; top: -5px; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; background: var(--dr-bg); box-shadow: 0 2px 4px rgba(0,0,0,0.15); border: 1px solid var(--dr-card-border); z-index: 2;">${inner}</div>`;
        } else {
          statusHtml = st
            ? `<div class="DR_NoSel" title="${escapeHtml(st.name)}" style="position: absolute; right: -5px; top: -5px; display: flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; background: var(--dr-bg); box-shadow: 0 2px 4px rgba(0,0,0,0.15); border: 1px solid var(--dr-card-border); z-index: 2;">${renderStatusIcon(st, 12)}</div>`
            : "";
        }
        const row = document.createElement("div");
        row.className = "DR_HStack_Auto";
        row.style.cssText =
          "align-self: stretch; padding: 8px 10px; border-radius: var(--DR-r-s); corner-shape: var(--DR-corner); gap: 8px; background: var(--dr-card-bg);" +
          (isMe
            ? " outline: 2px solid rgba(var(--DR-blue), 0.5); outline-offset: -2px; background: rgba(var(--DR-blue), 0.08);"
            : "");
        row.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
                        ${
                          rank <= 3
                            ? `<img class="DR_NoSel" src="${podiumMedals[rank - 1]}" alt="#${rank}" title="#${rank}" style="width: 24px; height: 24px; object-fit: contain; flex-shrink: 0;">`
                            : `<span class="DR_T1 DR_NoSel" style="width: 22px; text-align: center; flex-shrink: 0;">${rank}</span>`
                        }
                        <div class="DR_Avatar_Container" style="position: relative; width: 30px; height: 30px; flex-shrink: 0;">
                            <img src="${escapeHtml(av)}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; background: var(--dr-card-border);" onerror="this.style.visibility='hidden'">
                            ${statusHtml}
                        </div>
                        <p class="DR_T1 DR_NoSel" style="font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(r.display_name || "Unknown")}</p>
                    </div>
                    <p class="DR_T2 DR_NoSel" style="flex-shrink: 0;">${(r.score || 0).toLocaleString()} XP</p>
                `;
        frag.appendChild(row);
        if (isMe) {
          const myEl = row.querySelector(".DR_Board_MyStatus");
          if (myEl) myEl.addEventListener("click", openStatusPicker);
        }

        if (rank === nProm && rank < total) {
          frag.appendChild(makeBoardSeparator("prom"));
        }
        if (rank === total - nDem && nDem > 0 && rank > nProm) {
          frag.appendChild(makeBoardSeparator("dem"));
        }
      });
      cont.replaceChildren(frag);
      cont.dataset.loaded = "1";
      const barIco = document.getElementById("DR_Board_Status_Ico");
      if (barIco) {
        if (myStatus) {
          barIco.innerHTML = renderStatusIcon(myStatus, 22);
        } else {
          barIco.innerHTML = `<img src="${setIco}" alt="" style="width: 22px; height: 22px; object-fit: contain; opacity: 0.5;">`;
        }
      }
      updateProfileLeague(tier, myRank);
    } catch {
      if (!loaded)
        cont.innerHTML = `<p class="DR_T2 DR_NoSel" style="text-align: center; color: rgb(var(--DR-red));">Failed to load leaderboard.</p>`;
    }
  }

  async function removeHearts(count) {
    const btn = document.getElementById("DR_Hearts_Btn");
    if (btn) btn.disabled = true;
    let ok = 0;
    for (let i = 0; i < count; i++) {
      try {
        const res = await fetchApi(
          "PUT",
          `${config.api.users}/${userId}/remove-heart`,
        );
        if (res.status === 200) ok++;
      } catch {}
      setProgress("DR_Hearts", ((i + 1) / count) * 100);
      await wait(delayMs);
    }
    notify(
      ok > 0 ? "success" : "error",
      "Remove Hearts",
      ok > 0 ? `Removed ${ok} heart(s).` : "Failed to remove hearts.",
    );
    clearProgress("DR_Hearts", ok > 0);
    if (btn) btn.disabled = false;
  }

  function applyLocalMax() {
    if (localStorage.getItem("dr_local_max") !== "true") return;
    if (document.getElementById("DR_LocalMax_Script")) return;
    const script = document.createElement("script");
    script.id = "DR_LocalMax_Script";
    script.textContent = `
            (function() {
                const TARGET_URL_REGEX = /https?:\\/\\/(?:[a-zA-Z0-9-]+\\.)?duolingo\\.[a-zA-Z]{2,6}(?:\\.[a-zA-Z]{2})?\\/\\d{4}-\\d{2}-\\d{2}\\/users\\/.+/;
                const CUSTOM_SHOP_ITEMS = {
                    gold_subscription: {
                        itemName: "gold_subscription",
                        subscriptionInfo: {
                            vendor: "STRIPE",
                            renewing: true,
                            expectedExpiration: Date.now() + 31536000000
                        }
                    }
                };

                const originalFetch = window.fetch;
                window.fetch = function (resource, options) {
                    const url = resource instanceof Request ? resource.url : resource;
                    if (TARGET_URL_REGEX.test(url)) {
                        return originalFetch.apply(this, arguments).then(async function (response) {
                            const resp = response.clone();
                            let raw = await resp.text();
                            try {
                                let data = JSON.parse(raw);
                                data.hasPlus = true;
                                if (!data.trackingProperties || typeof data.trackingProperties !== 'object') data.trackingProperties = {};
                                data.trackingProperties.has_item_gold_subscription = true;
                                data.shopItems = CUSTOM_SHOP_ITEMS;
                                raw = JSON.stringify(data);
                            } catch { }
                            let hdrs = response.headers;
                            try { const obj = {}; response.headers.forEach((v, k) => obj[k] = v); hdrs = obj; } catch { }
                            return new Response(raw, { status: response.status, statusText: response.statusText, headers: hdrs });
                        });
                    }
                    return originalFetch.apply(this, arguments);
                };

                const origOpen = XMLHttpRequest.prototype.open;
                const origSend = XMLHttpRequest.prototype.send;
                XMLHttpRequest.prototype.open = function (method, url, ...args) {
                    this._intercept = TARGET_URL_REGEX.test(url);
                    this._url = url;
                    origOpen.call(this, method, url, ...args);
                };
                XMLHttpRequest.prototype.send = function () {
                    if (this._intercept) {
                        const origChange = this.onreadystatechange;
                        const xhr = this;
                        this.onreadystatechange = function () {
                            if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
                                try {
                                    let raw = xhr.responseText;
                                    try {
                                        let data = JSON.parse(raw);
                                        data.hasPlus = true;
                                        if (!data.trackingProperties || typeof data.trackingProperties !== 'object') data.trackingProperties = {};
                                        data.trackingProperties.has_item_gold_subscription = true;
                                        data.shopItems = CUSTOM_SHOP_ITEMS;
                                        raw = JSON.stringify(data);
                                    } catch { }
                                    Object.defineProperty(xhr, 'responseText', { writable: true, value: raw });
                                    Object.defineProperty(xhr, 'response', { writable: true, value: raw });
                                } catch { }
                            }
                            if (origChange) origChange.apply(this, arguments);
                        };
                    }
                    origSend.apply(this, arguments);
                };

                function remove(root = document) {
                    const sections = root.querySelectorAll('section._3f-te');
                    for (let i = 0; i < sections.length; i++) {
                        const h2 = sections[i].querySelector('h2._203-l');
                        if (h2 && h2.textContent.trim() === 'Manage subscription') {
                            sections[i].remove();
                            break;
                        }
                    }
                }
                const observer = new MutationObserver(function () {
                    remove();
                });
                observer.observe(document.documentElement, { childList: true, subtree: true });
                remove();
            })();
        `;
    document.documentElement.appendChild(script);
  }

  async function getCohort() {
    return (await fetchLeagueData(false))?.active?.cohort?.cohort_id || null;
  }

  async function getCurrentStatus() {
    const rankings =
      (await fetchLeagueData(true))?.active?.cohort?.rankings || [];
    const me = rankings.find((r) => r.user_id == userId);
    return me ? me.reaction || "NONE" : null;
  }

  async function setStatus(reaction) {
    if (!userId) return false;
    const cohort = await getCohort();
    if (!cohort) {
      notify("error", "Leaderboard Status", "You are not in an active league.");
      return false;
    }
    try {
      const res = await fetchApi(
        "PATCH",
        `https://duolingo-leaderboards-prod.duolingo.com/reactions/${cohort}/users/${userId}`,
        { reaction: reaction },
      );
      if (res.status === 200) {
        notify("success", "Leaderboard Status", "Status updated.");
        return true;
      }
      notify(
        "error",
        "Leaderboard Status",
        `Failed with status ${res.status}.`,
      );
      return false;
    } catch {
      notify("error", "Leaderboard Status", "Request failed.");
      return false;
    }
  }

  function renderStatusIcon(st, size = 12) {
    if (!st) return "";
    if (st.icon) {
      if (st.icon.startsWith("<svg")) {
        return `<div style="display: flex; align-items: center; justify-content: center; width: ${size}px; height: ${size}px; color: var(--dr-text);">${st.icon.replace("<svg ", `<svg style="width:${size}px; height:${size}px;" `)}</div>`;
      }
      return `<img src="${escapeHtml(st.icon)}" alt="${escapeHtml(st.name)}" style="width: ${size}px; height: ${size}px; object-fit: contain;">`;
    }
    return `<span style="font-size: ${Math.round(size * 0.83)}px; line-height: 1;">${escapeHtml(statusFallback(st))}</span>`;
  }

  function showStatuses(filterStr) {
    const cont = document.getElementById("DR_Status_Container");
    if (!cont) return;

    cont.innerHTML = "";
    const query = (filterStr || "").trim().toLowerCase();
    const items = query
      ? statusReactions.filter((s) => s.name.toLowerCase().includes(query))
      : statusReactions;

    if (items.length === 0) {
      cont.innerHTML = `<p class="DR_T2 DR_NoSel" style="text-align: center;">No statuses found.</p>`;
      return;
    }

    const grid = document.createElement("div");
    grid.className = "DR_Shop_Grid";

    const fragment = document.createDocumentFragment();
    let currentCat = null;

    items.forEach((s) => {
      if (s.cat !== currentCat) {
        currentCat = s.cat;
        const secHeader = document.createElement("div");
        secHeader.className = "DR_Shop_Section_Header DR_NoSel";
        secHeader.innerHTML = `
                    <div class="DR_Shop_Section_Line"></div>
                    <span class="DR_Shop_Section_Title">${currentCat}</span>
                    <div class="DR_Shop_Section_Line"></div>
                `;
        fragment.appendChild(secHeader);
      }

      const card = document.createElement("div");
      card.className = "DR_Shop_Card";

      const ico = document.createElement("div");
      ico.className = "DR_NoSel";
      ico.style.cssText =
        "font-size: 30px; line-height: 36px; height: 36px; display: flex; align-items: center; justify-content: center;";
      if (s.icon) {
        if (s.icon.startsWith("<svg")) {
          ico.innerHTML = s.icon;
          const svgEl = ico.querySelector("svg");
          if (svgEl) {
            svgEl.style.cssText =
              "width: 36px; height: 36px; color: var(--dr-text);";
          }
        } else {
          const img = document.createElement("img");
          img.src = s.icon;
          img.alt = s.name;
          img.style.cssText = "width: 36px; height: 36px; object-fit: contain;";
          ico.appendChild(img);
        }
      } else {
        ico.innerText = statusFallback(s);
      }
      card.appendChild(ico);

      const nameDiv = document.createElement("div");
      nameDiv.className = "DR_Shop_Name DR_NoSel";
      nameDiv.innerText = s.name;
      card.appendChild(nameDiv);

      const isActive = currentStatus !== null && s.value === currentStatus;
      if (isActive) {
        card.style.outlineColor = "rgba(var(--DR-blue), 0.6)";
      }

      const btn = document.createElement("button");
      btn.className = isActive ? "DR_Shop_Btn got" : "DR_Shop_Btn";
      btn.innerText = isActive ? "ACTIVE" : "SET";

      btn.addEventListener("click", async () => {
        if (btn.className.includes("loading") || btn.className.includes("got"))
          return;
        btn.className = "DR_Shop_Btn loading";
        btn.innerText = "...";

        const ok = await setStatus(s.value);
        if (ok) {
          currentStatus = s.value;
          showStatuses(document.getElementById("DR_Status_Search").value);
        } else {
          btn.className = "DR_Shop_Btn fail";
          btn.innerText = "ERR";
          setTimeout(() => {
            btn.className = "DR_Shop_Btn";
            btn.innerText = "SET";
          }, 2000);
        }
      });

      card.appendChild(btn);
      fragment.appendChild(card);
    });

    grid.appendChild(fragment);
    cont.appendChild(grid);
  }

  function checkTheme() {
    let lastDark = null;
    const updClasses = () => {
      const html = document.documentElement;
      const isDark =
        html.getAttribute("data-duo-theme") === "dark" ||
        html.classList.contains("_2L9MF");
      if (isDark === lastDark) {
        return;
      }
      const mainBox = document.getElementById("DR_Main_Box");
      if (!mainBox) {
        return;
      }
      lastDark = isDark;

      const notifMain = document.getElementById("DR_Notif_Main");
      const hideBtn = document.getElementById("duorain-hide-button");
      const targets = [mainBox, notifMain, hideBtn].filter(Boolean);
      targets.forEach((el) => {
        el.classList.toggle("dr-dark", isDark);
        el.classList.toggle("dr-light", !isDark);
      });
    };

    updClasses();
    if (window.MutationObserver) {
      new MutationObserver(updClasses).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "data-duo-theme"],
      });
    }
    setInterval(updClasses, 5000);
  }

  function drVpWidth() {
    return Math.round(
      window.visualViewport ? window.visualViewport.width : window.innerWidth,
    );
  }

  function drVpHeight() {
    return Math.round(
      window.visualViewport ? window.visualViewport.height : window.innerHeight,
    );
  }

  function drMargin() {
    return drVpWidth() <= 480 ? 8 : 16;
  }

  function drPageWidth() {
    const base = 325;
    return Math.min(base, drVpWidth() - drMargin() * 2);
  }

  function drMaxHeight() {
    const btn = document.getElementById("duorain-hide-button");
    const reserve = btn ? btn.offsetHeight + 8 : 48;
    return drVpHeight() - drMargin() * 2 - reserve;
  }

  function clampPos(left, top) {
    const wrap = document.getElementById("DR_Main");
    const m = drMargin();
    const maxL = Math.max(m, drVpWidth() - wrap.offsetWidth - m);
    const maxT = Math.max(m, drVpHeight() - wrap.offsetHeight - m);
    return {
      left: Math.min(Math.max(left, m), maxL),
      top: Math.min(Math.max(top, m), maxT),
    };
  }

  function nearestCorner() {
    const wrap = document.getElementById("DR_Main");
    const r = wrap.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    return (
      (cy < drVpHeight() / 2 ? "t" : "b") + (cx < drVpWidth() / 2 ? "l" : "r")
    );
  }

  function positionPanel() {
    const wrap = document.getElementById("DR_Main");
    if (!wrap) return;
    const m = drMargin();
    const top = panelCorner.charAt(0) === "t";
    const left = panelCorner.charAt(1) === "l";
    wrap.style.left = left ? m + "px" : "auto";
    wrap.style.right = left ? "auto" : m + "px";
    wrap.style.top = top ? m + "px" : "auto";
    wrap.style.bottom = top ? "auto" : m + "px";
    wrap.style.flexDirection = top ? "column" : "column-reverse";
    wrap.style.alignItems = left ? "flex-start" : "flex-end";
    wrap.style.setProperty(
      "--DR-panel-origin",
      `${top ? "top" : "bottom"} ${left ? "left" : "right"}`,
    );
    wrap.style.setProperty("--DR-panel-hide-y", top ? "-8px" : "8px");
    const btn = document.getElementById("duorain-hide-button");
    if (btn && btn.parentElement) {
      btn.parentElement.style.alignSelf = left ? "flex-start" : "flex-end";
    }
  }

  function relayout() {
    const box = document.getElementById("DR_Main_Box");
    if (box && box.dataset.isAnimating !== "true") {
      const prevScroll = box.scrollTop;
      const w = drPageWidth(pageId) + "px";
      if (box.style.width !== w) box.style.width = w;
      const cap = drMaxHeight();
      box.style.maxHeight = "none";
      const natural = box.offsetHeight;
      box.style.maxHeight = cap + "px";
      const needScroll = natural > cap + 4;
      if (box.classList.contains("dr-scroll") !== needScroll)
        box.classList.toggle("dr-scroll", needScroll);
      if (needScroll && box.scrollTop !== prevScroll)
        box.scrollTop = prevScroll;
    }
    positionPanel();
  }

  let relayoutQueued = false;
  function queueRelayout() {
    if (relayoutQueued) return;
    relayoutQueued = true;
    requestAnimationFrame(() => {
      relayoutQueued = false;
      relayout();
    });
  }

  function refreshPageData(tPageId) {
    if (tPageId === "XPSummaries") {
      loadXpHistory();
    }
    if (tPageId === "Stats") {
      loadChangelog();
    }
    if (tPageId === "Feed") {
      getFeed();
    }
    if (tPageId === "Board") {
      showLeagueBoard();
    }
    if (tPageId === "Extra") {
      updateLeagueDropdown(leagueRankFromData(leagueDataCache) || 0);
      silentLeagueCheck();
    }
  }

  function setMainMode(mode, animate) {
    localStorage.setItem("dr_main_mode", mode);
    const nativeSec = document.getElementById("DR_Native_Sections");
    const solverSec = document.getElementById("DR_Solver_Sections");
    const toggleBtn = document.getElementById("DR_Mode_Toggle_Btn");
    const toggleLbl = document.getElementById("DR_Mode_Toggle_Lbl");

    if (!nativeSec || !solverSec || !toggleBtn || !toggleLbl) return;

    const showSec = mode === "native" ? nativeSec : solverSec;
    const hideSec = mode === "native" ? solverSec : nativeSec;
    const wasShown = showSec.style.display === "flex";

    const toggleIco = document.getElementById("DR_Mode_Toggle_Ico");
    if (toggleIco) {
      toggleIco.innerHTML =
        mode === "native" ? icons.modeNative : icons.modeSolver;
    }

    if (mode === "native") {
      toggleLbl.innerText = "Native Mode";
      toggleBtn.style.background = "var(--dr-card-bg)";
      toggleBtn.style.color = "var(--dr-text)";
      toggleBtn.style.outline = "2px solid var(--dr-card-border)";
      toggleBtn.style.outlineOffset = "-2px";
    } else {
      toggleLbl.innerText = "Solver Mode";
      toggleBtn.style.background = "var(--dr-card-bg)";
      toggleBtn.style.color = "var(--dr-text)";
      toggleBtn.style.outline = "2px solid var(--dr-card-border)";
      toggleBtn.style.outlineOffset = "-2px";
    }

    if (!animate || wasShown) {
      hideSec.style.display = "none";
      showSec.style.display = "flex";
      queueRelayout();
      return;
    }

    const mainBox = document.getElementById("DR_Main_Box");
    if (!mainBox || mainBox.dataset.isAnimating === "true") return;
    mainBox.dataset.isAnimating = "true";

    const activePage = document.getElementById("DR_Page_1");
    const sW = mainBox.offsetWidth;
    const sH = mainBox.offsetHeight;

    activePage.style.transition =
      "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), filter 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)";
    activePage.style.opacity = "0";
    activePage.style.filter = "blur(6px)";
    activePage.style.transform = "scale(0.96)";

    setTimeout(() => {
      mainBox.style.transition = "none";
      mainBox.style.width = sW + "px";
      mainBox.style.height = sH + "px";

      hideSec.style.display = "none";
      showSec.style.display = "flex";

      activePage.style.transition = "none";
      activePage.style.filter = "blur(6px)";
      activePage.style.opacity = "0";
      activePage.style.transform = "scale(1.04)";

      mainBox.style.height = "auto";
      mainBox.style.maxHeight = "none";
      mainBox.classList.remove("dr-scroll");

      const natH = mainBox.offsetHeight;
      const maxH = drMaxHeight();
      const needsScroll = natH > maxH;
      const finalH = Math.min(natH < 50 ? 200 : natH, maxH);
      mainBox.style.maxHeight = maxH + "px";
      mainBox.classList.toggle("dr-scroll", needsScroll);

      mainBox.style.height = sH + "px";
      void mainBox.offsetHeight;

      const easeCurve = "cubic-bezier(0.34, 1.15, 0.64, 1)";
      mainBox.style.transition = `height 0.4s ${easeCurve}, width 0.4s ${easeCurve}`;
      mainBox.style.height = finalH + "px";

      setTimeout(() => {
        activePage.style.transition = `filter 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ${easeCurve}`;
        activePage.style.filter = "blur(0px)";
        activePage.style.opacity = "1";
        activePage.style.transform = "scale(1)";
      }, 50);

      setTimeout(() => {
        mainBox.style.height = "auto";
        mainBox.style.transition = "";
        activePage.style.transition = "";
        activePage.style.filter = "";
        activePage.style.opacity = "";
        activePage.style.transform = "";
        mainBox.dataset.isAnimating = "false";
        relayout();
      }, 400);
    }, 200);
  }

  function setUiHiddenState(hidden) {
    if (uiHidden === hidden) return;
    uiHidden = hidden;
    localStorage.setItem("dr_ui_hidden", uiHidden ? "true" : "false");
    const wrap = document.getElementById("DR_Main");
    const mBox = document.getElementById("DR_Main_Box");
    const lblTxt = document.getElementById("hide-show-text");
    const togHide = document.getElementById("duorain-hide-button");
    if (!wrap || !mBox || !lblTxt || !togHide) return;

    if (uiHidden) {
      clearTimeout(hideCollapseTimer);
      togHide.classList.add("duorain-show-mode");
      lblTxt.innerText = "Show";
      mBox.classList.add("dr-hidden");
      hideCollapseTimer = setTimeout(() => {
        mBox.classList.add("dr-collapsed");
        wrap.classList.add("dr-panel-hidden");
      }, 400);
    } else {
      clearTimeout(hideCollapseTimer);
      wrap.classList.remove("dr-panel-hidden");
      mBox.classList.remove("dr-collapsed");
      void mBox.offsetHeight;
      mBox.classList.remove("dr-hidden");
      togHide.classList.remove("duorain-show-mode");
      lblTxt.innerText = "Hide";
      relayout();
    }
  }

  function changePage(tPageId) {
    const mainBox = document.getElementById("DR_Main_Box");
    if (mainBox.dataset.isAnimating === "true") return;
    if (pageId === tPageId) {
      refreshPageData(tPageId);
      return;
    }

    mainBox.dataset.isAnimating = "true";

    if (tPageId === "Extra") {
      const lSel = document.getElementById("DR_League_Select");
      if (lSel) {
        const st = parseInt(localStorage.getItem("dr_league_target"));
        const tv = !isNaN(st) && st >= 1 && st <= 15 ? st : 1;
        const lTxt = lSel.querySelector(".DR_Select_Text");
        if (lTxt) lTxt.innerText = `# ${tv}`;
        lSel.setAttribute("data-value", tv.toString());
      }
    }

    if (tPageId === "Settings") {
      const qSel = document.getElementById("DR_EZQuizLength_Select");
      if (qSel) {
        const storedLen = localStorage.getItem("dr_ez_quiz_len") || "default";
        const qTxt = qSel.querySelector(".DR_Select_Text");
        if (qTxt) {
          qTxt.innerText = storedLen === "default" ? "Default" : storedLen;
        }
        qSel.setAttribute("data-value", storedLen);
        qSel.querySelectorAll(".DR_Select_Option").forEach((opt) => {
          opt.classList.toggle(
            "selected",
            opt.getAttribute("data-value") === storedLen,
          );
        });
      }
    }

    const origPage = document.getElementById(
      pageId === 1 ? "DR_Page_1" : `DR_Page_${pageId}`,
    );
    const tPage = document.getElementById(
      tPageId === 1 ? "DR_Page_1" : `DR_Page_${tPageId}`,
    );

    if (!origPage || !tPage) {
      mainBox.dataset.isAnimating = "false";
      return;
    }

    const sW = mainBox.offsetWidth;
    const sH = mainBox.offsetHeight;

    origPage.style.transition =
      "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), filter 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)";
    origPage.style.opacity = "0";
    origPage.style.filter = "blur(6px)";
    origPage.style.transform = "scale(0.96)";

    setTimeout(() => {
      mainBox.style.transition = "none";
      mainBox.style.width = sW + "px";
      mainBox.style.height = sH + "px";

      origPage.classList.remove("active");
      origPage.style.cssText = "";

      tPage.classList.add("active");
      tPage.style.transition = "none";
      tPage.style.filter = "blur(6px)";
      tPage.style.opacity = "0";
      tPage.style.transform = "scale(1.04)";

      mainBox.style.width = "auto";
      mainBox.style.height = "auto";
      mainBox.style.maxHeight = "none";
      mainBox.classList.remove("dr-scroll");

      let cTargetW = drPageWidth(tPageId);
      mainBox.style.width = cTargetW + "px";

      const natH = mainBox.offsetHeight;
      const maxH = drMaxHeight();
      const needsScroll = natH > maxH;
      const finalH = Math.min(natH < 50 ? 200 : natH, maxH);

      mainBox.style.maxHeight = maxH + "px";
      mainBox.classList.toggle("dr-scroll", needsScroll);

      mainBox.style.width = sW + "px";
      mainBox.style.height = sH + "px";
      void mainBox.offsetHeight; // force reflow

      const easeCurve = "cubic-bezier(0.34, 1.15, 0.64, 1)";
      mainBox.style.transition = `height 0.4s ${easeCurve}, width 0.4s ${easeCurve}`;
      mainBox.style.width = cTargetW + "px";
      mainBox.style.height = finalH + "px";

      setTimeout(() => {
        tPage.style.transition = `filter 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ${easeCurve}`;
        tPage.style.filter = "blur(0px)";
        tPage.style.opacity = "1";
        tPage.style.transform = "scale(1)";
      }, 50);

      setTimeout(() => {
        mainBox.style.width = cTargetW + "px";
        mainBox.style.height = "auto";
        mainBox.style.transition = "";
        tPage.style.transition = "";
        tPage.style.filter = "";
        tPage.style.opacity = "";
        tPage.style.transform = "";
        pageId = tPageId;
        mainBox.dataset.isAnimating = "false";
        relayout();

        refreshPageData(tPageId);
      }, 400);
    }, 200);
  }

  function toggleInf(idPre) {
    const togBtn = document.getElementById(`DR_${idPre}_Hash`);
    const inpEl = document.getElementById(`DR_${idPre}_Input`);
    const inpWrap = inpEl.parentElement;

    togBtn.addEventListener("click", () => {
      const isInf = togBtn.getAttribute("data-inf") === "true";

      if (isInf) {
        togBtn.innerHTML = icons.hash;
        togBtn.setAttribute("data-inf", "false");
        togBtn.classList.remove("dr-inf-active");
        inpWrap.classList.remove("dr-inf-hidden");
        inpEl.disabled = false;
        inpEl.value = "";
      } else {
        togBtn.innerHTML =
          icons.inf + '<span class="DR_Hash_Lbl">Infinite</span>';
        togBtn.setAttribute("data-inf", "true");
        togBtn.classList.add("dr-inf-active");
        inpWrap.classList.add("dr-inf-hidden");
        inpEl.disabled = true;
        inpEl.value = "Infinity";
      }
      togBtn.blur();
    });
  }

  function runTask(type, idPre) {
    if (farmStates[type]) {
      stopFarm(type);
      resetBtn(`${idPre}_Btn`, "RUN");
      return;
    }

    if (!user) {
      notify("error", "Status", "Wait for connection.");
      return;
    }

    let infSel = false;
    let numVal = Infinity;

    if (idPre !== "DR_League") {
      const togBtn = document.getElementById(`${idPre}_Hash`);
      infSel = togBtn.getAttribute("data-inf") === "true";

      if (!infSel) {
        const inpVal = document.getElementById(`${idPre}_Input`).value;
        numVal = parseInt(inpVal);

        if (isNaN(numVal) || numVal <= 0) {
          notify(
            "warning",
            "Invalid Input",
            "Please enter a valid number greater than 0.",
          );
          return;
        }

        if (type === "xp" && numVal < 30) {
          notify("warning", "Invalid Input", "Minimum XP amount is 30.");
          return;
        }
      }
    } else {
      const selEl = document.getElementById("DR_League_Select");
      numVal = selEl.getAttribute("data-value");
    }

    const startExecution = () => {
      farmStates[type] = true;
      farmCtl[type] = new AbortController();
      if (type === "xp") farmXp(numVal);
      if (type === "gem") farmGems(numVal);
      if (type === "streak") farmStreak(numVal);
      if (type === "league") farmLeague(numVal);
    };

    if (type === "league" && farmStates.xp) {
      showConfirmModal(() => {
        stopFarm("xp");
        resetBtn("DR_XP_Btn", "RUN");
        startExecution();
      });
      return;
    }

    startExecution();
  }

  // ==========================================
  // AUTO SOLVER CODE PORTED FROM DUOLINGO PRO OFC WHAT DO YALL THINGKING?
  // ==========================================

  function toggleAutoSolve(value) {
    if (value === "start") {
      window.dispatchEvent(
        new CustomEvent("DR_TriggerSolveAll", { detail: { action: "start" } }),
      );
    } else if (value === "stop") {
      window.dispatchEvent(
        new CustomEvent("DR_TriggerSolveAll", { detail: { action: "stop" } }),
      );
    } else {
      window.dispatchEvent(new CustomEvent("DR_TriggerSolveAll"));
    }
  }

  async function runAutoSolve() {
    window.dispatchEvent(new CustomEvent("DR_TriggerSolveOnce"));
  }

  function updateSolveButtonText(text) {
    try {
      const btn = document.getElementById("solveAllButton");
      if (btn) btn.innerText = text;
    } catch (error) {
      console.log(error);
    }
  }

  function injectSolverButtons() {
    if (
      window.location.pathname === "/learn" &&
      document.querySelector('a[data-test="global-practice"]')
    )
      return;

    if (autoSolverEnabled && !isAutoMode) {
      toggleAutoSolve("start");
    }

    if (!solverButtonsEnabled) return;
    if (document.querySelector("#solveAllButton")) return;

    document
      .querySelector('[data-test="quit-button"]')
      ?.addEventListener("click", function outerHandler() {
        if (isAutoMode) toggleAutoSolve("stop");
      });

    const nextButton = document.querySelector('[data-test="player-next"]');
    const storiesContinueButton = document.querySelector(
      '[data-test="stories-player-continue"]',
    );
    const storiesDoneButton = document.querySelector(
      '[data-test="stories-player-done"]',
    );
    const target = nextButton || storiesContinueButton || storiesDoneButton;

    if (
      document.querySelector('[data-test="story-start"]') &&
      autoSolverEnabled
    ) {
      document.querySelector('[data-test="story-start"]').click();
    }

    if (target) {
      if (document.querySelector(".MYehf") !== null) {
        document.querySelector(".MYehf").style.display = "flex";
        document.querySelector(".MYehf").style.gap = "20px";
      } else if (document.querySelector(".FmlUF") !== null) {
        const storyContainer =
          document.querySelector("._3TJzR") || document.querySelector(".mAxZF");
        if (storyContainer) {
          storyContainer.style.display = "flex";
          storyContainer.style.gap = "20px";
        }
      }

      const solveButtonCopy = document.createElement("button");
      solveButtonCopy.id = "solveAllButton";
      solveButtonCopy.innerText = isAutoMode ? "PAUSE SOLVE" : "SOLVE ALL";
      solveButtonCopy.className = "auto-solver-btn solving-btn";
      solveButtonCopy.addEventListener("click", () => toggleAutoSolve());

      const solveAllButtonCopy = document.createElement("button");
      solveAllButtonCopy.innerText = "SOLVE";
      solveAllButtonCopy.className = "auto-solver-btn solve-btn";
      solveAllButtonCopy.addEventListener("click", () => runAutoSolve());

      target.parentElement.appendChild(solveAllButtonCopy);
      target.parentElement.appendChild(solveButtonCopy);

      let duolingoPROSolveButtonsDisappearObserverTimeout = null;
      const observer = new MutationObserver((mutations, obs) => {
        if (duolingoPROSolveButtonsDisappearObserverTimeout) return;
        if (!document.querySelector(".auto-solver-btn")) {
          duolingoPROSolveButtonsDisappearObserverTimeout = setTimeout(() => {
            initAutoSolverObserver();
            duolingoPROSolveButtonsDisappearObserverTimeout = null;
            obs.disconnect();
          }, 50);
        }
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    }
  }

  let duolingoPROSolveButtonsObserver = null;
  function initAutoSolverObserver() {
    if (duolingoPROSolveButtonsObserver) return;

    if (
      document.querySelector(
        '[data-test="player-next"], [data-test="stories-player-continue"], [data-test="stories-player-done"], [data-test="story-start"]',
      )
    ) {
      injectSolverButtons();
    }

    duolingoPROSolveButtonsObserver = new MutationObserver((mutations) => {
      if (
        document.querySelector(
          '[data-test="player-next"], [data-test="stories-player-continue"], [data-test="stories-player-done"], [data-test="story-start"]',
        )
      ) {
        injectSolverButtons();
      }
    });

    duolingoPROSolveButtonsObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function clearPrefetchedSessionsCache() {
    const script = document.createElement("script");
    script.textContent = `
            (function() {
                try {
                    const req = indexedDB.open("duolingo");
                    req.onsuccess = function(e) {
                        const db = e.target.result;
                        if (db.objectStoreNames.contains("prefetchedSessions")) {
                            try {
                                const tx = db.transaction("prefetchedSessions", "readwrite");
                                tx.objectStore("prefetchedSessions").clear();
                            } catch (err) {}
                        }
                        db.close();
                    };
                } catch (err) {}
            })();
        `;
    document.documentElement.appendChild(script);
    script.remove();
  }

  function applyEZQuiz() {
    if (localStorage.getItem("dr_ez_quiz") !== "true") return;
    if (document.getElementById("DR_EZQuiz_Script")) return;
    const storedLen = localStorage.getItem("dr_ez_quiz_len") || "default";
    const script = document.createElement("script");
    script.id = "DR_EZQuiz_Script";
    script.textContent = `
            (function() {
                const ezQuizLen = "${storedLen}";
                const STORY_RX = /https?:\\/\\/stories\\.duolingo\\.com\\/api2\\/stories\\//;

                try {
                    const req = indexedDB.open("duolingo");
                    req.onsuccess = function(e) {
                        const db = e.target.result;
                        if (db.objectStoreNames.contains("prefetchedSessions")) {
                            try {
                                const tx = db.transaction("prefetchedSessions", "readwrite");
                                tx.objectStore("prefetchedSessions").clear();
                            } catch (err) {}
                        }
                        db.close();
                    };
                } catch (err) {}

                function modStory(j) {
                    try {
                        const d = JSON.parse(j);
                        if (Array.isArray(d.elements)) {
                            const filtered = d.elements.filter(el => el && el.type === 'HEADER');
                            if (filtered.length > 0) {
                                d.elements = filtered;
                            } else if (d.elements.length > 0) {
                                d.elements = [d.elements[0]];
                            }
                        }
                        return JSON.stringify(d);
                    } catch { return j; }
                }

                const alphabetOriginalChallenges = {};
                const originalFetch = window.fetch;
                window.fetch = function(resource, options) {
                    const url = String(resource instanceof Request ? resource.url : resource);
                    const method = resource instanceof Request ? resource.method : ((options && options.method) || 'GET');
                    const m = method.toUpperCase();

                    if (m === 'PUT' && url.indexOf('/sessions') !== -1 && options && options.body) {
                        try {
                            let bodyData = JSON.parse(options.body);
                            if (bodyData && bodyData.id && alphabetOriginalChallenges[bodyData.id]) {
                                bodyData.challenges = alphabetOriginalChallenges[bodyData.id];
                                delete alphabetOriginalChallenges[bodyData.id];
                                options.body = JSON.stringify(bodyData);
                            }
                        } catch (e) {}
                    }

                    if (m === 'GET' && STORY_RX.test(url)) {
                        return originalFetch.apply(this, arguments).then(function(r) {
                            return r.clone().text().then(function(text) {
                                let hdrs = {};
                                try { r.headers.forEach((v, k) => hdrs[k] = v); } catch {}
                                hdrs['content-type'] = 'application/json';
                                return new Response(modStory(text), {
                                    status: r.status,
                                    statusText: r.statusText,
                                    headers: hdrs
                                });
                            });
                        });
                    }

                    if (m === 'POST' && url.indexOf('/sessions') !== -1) {
                        return originalFetch.apply(this, arguments).then(function(r) {
                            return r.clone().json().then(function(data) {
                                const isDuoRadio = data.metadata && data.metadata.type && data.metadata.type.toUpperCase() === "DUORADIO";
                                if (isDuoRadio) {
                                    data.introLengthMillis = 1;
                                    data.outroPoseShowMillis = 1;
                                    data.titleCardShowMillis = 1;
                                    data.challenges = data.challenges.map(function(ch) {
                                        return Object.assign({}, ch, {
                                            audioText: "DuoRain!",
                                            audioUrl: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA",
                                            prompt: "DuoRain by OracleMythix & oxGorou",
                                            isTrue: true,
                                            type: "radioBinary"
                                        });
                                    });
                                    data.elements = data.elements.map(function(el) {
                                        if (el.type === "challenge") {
                                            return {
                                                type: "challenge",
                                                challengeType: "binaryComprehension",
                                                prompt: "DuoRain by OracleMythix & oxGorou",
                                                isTrue: true,
                                                audioText: "DuoRain!",
                                                audioUrl: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA",
                                                durationMillis: 1,
                                                guestAudioRanges: [],
                                                hostAudioRanges: [],
                                                lowPerformanceAudioUrl: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA",
                                                lowPerformanceDurationMillis: 1,
                                                lowPerformanceHostAudioRanges: []
                                            };
                                        }
                                        el.audioUrl = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
                                        el.durationMillis = 1;
                                        return el;
                                    });
                                } else {
                                    let n = 10;
                                    if (ezQuizLen === 'default') {
                                        n = (data.type && data.type.indexOf('LEGENDARY') === 0) ? 2 : 1;
                                    } else {
                                        n = parseInt(ezQuizLen) || 10;
                                    }
                                    const ll = data.learningLanguage || 'en';
                                    const fl = data.fromLanguage || 'en';
                                    const lsChallenge = {
                                        character: {
                                            url: "https://d2pur3iezf4d1j.cloudfront.net/images/51d3bded9ecbd8bf6e9869041c437ba9",
                                            image: {
                                                pdf: "https://d2pur3iezf4d1j.cloudfront.net/images/51d3bded9ecbd8bf6e9869041c437ba9",
                                                svg: "https://d2pur3iezf4d1j.cloudfront.net/images/51d3bded9ecbd8bf6e9869041c437ba9"
                                            },
                                            gender: "MALE",
                                            correctAnimation: "https://simg-ssl.duolingo.com/lottie/Falstaff_CORRECT_Cropped_NotBad.json",
                                            incorrectAnimation: "https://simg-ssl.duolingo.com/lottie/Bear_INCORRECT_Cropped.json",
                                            idleAnimation: "https://simg-ssl.duolingo.com/lottie/Falstaff_IDLE_Cropped.json",
                                            name: "FALSTAFF",
                                            avatarIconImage: {
                                                pdf: "https://simg-ssl.duolingo.com/world-characters/avatars/falstaff_avatar_icon.pdf",
                                                svg: "https://simg-ssl.duolingo.com/world-characters/avatars/falstaff_avatar_icon.svg"
                                            }
                                        },
                                        prompt: "What is the best tool for Duolingo?",
                                        choices: ["DuoRain by OracleMythix & oxGorou"],
                                        correctIndex: 0,
                                        options: [{
                                            tts: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA",
                                            text: "DuoRain by OracleMythix & oxGorou"
                                        }],
                                        type: "assist",
                                        id: "8f0c37fdc39049e8bb1d2f2a196e77fc",
                                        challengeResponseTrackingProperties: {
                                            level_session_index: 5,
                                            birdbrain_target: 0.95,
                                            birdbrain_source: "birdbrain_v2",
                                            birdbrain_probability: 0.9929917,
                                            content_length: 10,
                                            cefr_subsection: "A2.1",
                                            cefr_level: "CEFR_A2",
                                            is_v2: true,
                                            is_adaptive: false,
                                            path_uses_unit_vision: false,
                                            generation_timestamp: 1705515660603,
                                            session_type: "lexeme_skill_level_practice",
                                            tagged_kc_ids: ["81d5f8beeb27d2b2f8234fea16cb9b20"]
                                        },
                                        metadata: {
                                            challenge_construction_insights: {
                                                birdbrain_probability: 0.9929917,
                                                birdbrain_target: 0.95,
                                                birdbrain_source: "birdbrain_v2",
                                                content_length: 10,
                                                is_adaptive: false,
                                                cefr_level: "CEFR_A2",
                                                cefr_subsection: "A2.1"
                                            },
                                            highlight: [],
                                            learning_language: ll,
                                            other_options: [],
                                            solution_key: "81d5f8beeb27d2b2f8234fea16cb9b20",
                                            translation: "DuoRain",
                                            ui_language: fl,
                                            word: "DuoRain",
                                            language: ll,
                                            specific_type: "assist",
                                            lexeme_ids_to_update: [],
                                            type: "assist",
                                            lexemes_to_update: [],
                                            generic_lexeme_map: {},
                                            num_comments: 0,
                                            from_language: fl
                                        },
                                        newWords: [],
                                        progressUpdates: [],
                                        challengeGeneratorIdentifier: {
                                            specificType: "assist",
                                            generatorId: "81d5f8beeb27d2b2f8234fea16cb9b20"
                                        }
                                    };
                                    const isAlphabet = data.type && String(data.type).toLowerCase().indexOf('alphabet') !== -1;
                                    if (isAlphabet) {
                                        if (data.challenges && data.challenges.length > 0) {
                                            alphabetOriginalChallenges[data.id] = JSON.parse(JSON.stringify(data.challenges));
                                            const firstCh = data.challenges[0];
                                            if (firstCh && firstCh.id) {
                                                data.challenges = [Object.assign({}, lsChallenge, {
                                                    id: firstCh.id
                                                })];
                                            }
                                        }
                                    } else {
                                        const baseId = lsChallenge.id;
                                        data.challenges = Array.from({ length: n }, (_, idx) => {
                                            const uniqueId = baseId.substring(0, 24) + String(idx).padStart(8, '0');
                                            return Object.assign({}, lsChallenge, { id: uniqueId });
                                        });
                                        if (Array.isArray(data.elements)) {
                                            data.elements = Array.from({ length: n }, (_, i) => ({
                                                type: "challenge",
                                                challengeIndex: i
                                            }));
                                        }
                                    }
                                }
                                data.adaptiveChallenges = [];
                                data.adaptiveInterleavedChallenges = { challenges: [], speakOrListenReplacementIndices: [] };
                                return new Response(JSON.stringify(data), {
                                    status: r.status,
                                    statusText: r.statusText,
                                    headers: { 'Content-Type': 'application/json' }
                                });
                            }).catch(() => r);
                        });
                    }

                    return originalFetch.apply(this, arguments);
                };

                const origOpen = XMLHttpRequest.prototype.open;
                const origSend = XMLHttpRequest.prototype.send;
                XMLHttpRequest.prototype.open = function(method, url, ...args) {
                    const m = (method || '').toUpperCase();
                    this._isStoryGet = m === 'GET' && STORY_RX.test(url);
                    origOpen.call(this, method, url, ...args);
                };
                XMLHttpRequest.prototype.send = function() {
                    if (this._isStoryGet) {
                        const origChange = this.onreadystatechange;
                        const xhr = this;
                        this.onreadystatechange = function() {
                            if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
                                try {
                                    let raw = xhr.responseText;
                                    raw = modStory(raw);
                                    Object.defineProperty(xhr, 'responseText', { writable: true, value: raw });
                                    Object.defineProperty(xhr, 'response', { writable: true, value: raw });
                                } catch {}
                            }
                            if (origChange) origChange.apply(this, arguments);
                        };
                    }
                    origSend.apply(this, arguments);
                };
            })();
        `;
    document.documentElement.appendChild(script);
  }

  function applyPageSolver() {
    if (document.getElementById("DR_PageSolver_Script")) return;
    const autoSolver = localStorage.getItem("dr_auto_solver") === "true";
    const randomSpeed = localStorage.getItem("dr_random_speed") === "true";
    const solveSpeedMin =
      parseFloat(localStorage.getItem("dr_solve_speed_min")) || 2.8;
    const solveSpeedMax =
      parseFloat(localStorage.getItem("dr_solve_speed_max")) || 12.4;
    const solveSpeedFixed =
      parseInt(localStorage.getItem("dr_solve_speed_fixed")) || 400;

    const script = document.createElement("script");
    script.id = "DR_PageSolver_Script";
    script.textContent = `
            (function() {
                const initAutoSolver = ${autoSolver};
                const initRandomSpeed = ${randomSpeed};
                const initSolveSpeedMin = ${solveSpeedMin};
                const initSolveSpeedMax = ${solveSpeedMax};
                const initSolveSpeedFixed = ${solveSpeedFixed};

                let isAutoMode = false;
                let solvingLoopRunning = false;
                let solveAllRunToken = 0;
                let isSolveBusy = false;
                let currentQuestionId = null;
                let hasLoggedForCurrent = 0;
                let reactTraverseUp = 1;
                let findReactMainElementClass = '_3yE3H';
                let hasDecrementedForCurrentLesson = false;
                let justClickedNext = false;
                let lastSolvedQuestionId = null;
                let nextClickedTime = 0;

                function bumpSolveAllRunToken() {
                    solveAllRunToken += 1;
                    return solveAllRunToken;
                }

                function logOnce(flag, sol, dom) {
                    if ((flag === 2 && hasLoggedForCurrent === 0) || (flag === 3 && hasLoggedForCurrent === 2)) {
                        hasLoggedForCurrent++;
                        if (flag === 2) {
                            window.dispatchEvent(new CustomEvent('DR_Notify', {
                                detail: { type: 'error', title: 'Auto Solver', body: 'Solver has detected that it solved a question incorrectly.' }
                            }));
                        } else if (flag === 3) {
                            window.dispatchEvent(new CustomEvent('DR_Notify', {
                                detail: { type: 'error', title: 'Auto Solver', body: 'Solver has detected that it is stuck on a question.' }
                            }));
                        }
                    }
                }

                async function solverClickCheck() {
                    try {
                        let nextButtonNormal = document.querySelector('[data-test="player-next"]');
                        let storiesContinueButton = document.querySelector('[data-test="stories-player-continue"]');
                        let storiesDoneButton = document.querySelector('[data-test="stories-player-done"]');

                        let nextButtonAriaValueNormal = nextButtonNormal ? nextButtonNormal.getAttribute('aria-disabled') : null;
                        let nextButtonAriaValueStoriesContinue = storiesContinueButton ? storiesContinueButton.disabled : null;

                        let nextButton = nextButtonNormal || storiesContinueButton || storiesDoneButton;
                        let nextButtonAriaValue = nextButtonAriaValueNormal || nextButtonAriaValueStoriesContinue || storiesDoneButton;

                        if (!nextButton) {
                            const btns = Array.from(document.querySelectorAll('button:not(#DR_Root *), [role="button"]:not(#DR_Root *)'));
                            nextButton = btns.find(btn => {
                                const txt = (btn.textContent || btn.innerText || "").toUpperCase().trim();
                                return txt === "CONTINUE" || txt === "NO THANKS";
                            });
                            nextButtonAriaValue = null;
                        }

                        if (nextButton) {
                            if (String(nextButtonAriaValue) === 'true') {
                                logOnce(3, window.sol, document.querySelector('.RMEuZ._1GVfY'));
                            } else if (String(nextButtonAriaValue) === 'false' && (nextButton.classList.length === 7 && nextButton.matches('._1rcV8._1VYyp._1ursp._7jW2t._3DbUj._38g3s._2oGJR'))) {
                                nextButton.click();
                                await new Promise(r => setTimeout(r, 50));

                                if (nextButton && nextButton.classList.contains('_2oGJR')) {
                                    logOnce(1, window.sol, document.querySelector('.RMEuZ._1GVfY'));
                                } else if (nextButton && nextButton.classList.contains('_3S8jJ')) {
                                    logOnce(2, window.sol, document.querySelector('.RMEuZ._1GVfY'));
                                }
                            } else {
                                nextButton.click();
                            }
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }

                async function solverClickNext() {
                    const challengeElement = document.querySelector('[data-test~="challenge"]');
                    let observer = null;
                    let clicked = false;
                    const removalPromise = challengeElement ? new Promise((resolve) => {
                        if (!document.body.contains(challengeElement)) return resolve();
                        observer = new MutationObserver(() => {
                            if (!document.body.contains(challengeElement)) {
                                observer.disconnect();
                                resolve();
                            }
                        });
                        observer.observe(document.body, { childList: true, subtree: true });
                    }) : Promise.resolve();

                    try {
                        let nextButton = document.querySelector('[data-test="player-next"]') ||
                            document.querySelector('[data-test="stories-player-continue"]') ||
                            document.querySelector('[data-test="stories-player-done"]');

                        if (!nextButton) {
                            const btns = Array.from(document.querySelectorAll('button:not(#DR_Root *), [role="button"]:not(#DR_Root *)'));
                            nextButton = btns.find(btn => {
                                const txt = (btn.textContent || btn.innerText || "").toUpperCase().trim();
                                return txt === "CONTINUE" || txt === "NO THANKS";
                            });
                        }

                        if (nextButton) {
                            nextButton.click();
                            clicked = true;
                        }
                    } catch (error) {
                        console.error(error);
                    } finally {
                        if (clicked && challengeElement) {
                            await removalPromise;
                        } else if (observer) {
                            observer.disconnect();
                        }
                    }
                }

                function solverGetCleanButtonText(button) {
                    const rubyElements = button.querySelectorAll('ruby');
                    if (rubyElements.length > 0) {
                        let text = '';
                        rubyElements.forEach(ruby => {
                            const baseTextElements = ruby.querySelectorAll('span[lang]:not(rt)');
                            baseTextElements.forEach(span => {
                                text += span.textContent;
                            });
                        });
                        return text.trim();
                    } else {
                        const textElement = button.querySelector('[data-test="challenge-tap-token-text"]');
                        return textElement ? textElement.innerText.trim() : button.innerText.trim();
                    }
                }

                function solverDetermineChallengeType() {
                    try {
                        if (document.getElementsByClassName("FmlUF").length > 0) {
                            if (window.sol.type === "arrange") return "Story Arrange";
                            else if (window.sol.type === "multiple-choice" || window.sol.type === "select-phrases") return "Story Multiple Choice";
                            else if (window.sol.type === "point-to-phrase") return "Story Point to Phrase";
                            else if (window.sol.type === "match") return "Story Pairs";
                        } else {
                            if (document.querySelectorAll('[data-test*="challenge-speak"]').length > 0) return 'Challenge Speak';
                            else if (window.sol.type === 'syllableTap') return 'Syllable Tap';
                            else if (window.sol.type === 'syllableListenTap') return 'Syllable Listen Tap';
                            else if (window.sol.type === 'tapCompleteTable') return 'Tap Complete Table';
                            else if (window.sol.type === 'typeCloze') return 'Type Cloze';
                            else if (window.sol.type === 'typeClozeTable') return 'Type Cloze Table';
                            else if (window.sol.type === 'tapClozeTable') return 'Tap Cloze Table';
                            else if (window.sol.type === 'typeCompleteTable') return 'Type Complete Table';
                            else if (window.sol.type === 'patternTapComplete') return 'Pattern Tap Complete';
                            else if (window.sol.type === 'completeReverseTranslation') return 'Complete Reverse Translation';
                            else if (document.querySelectorAll('[data-test*="challenge-name"]').length > 0 && document.querySelectorAll('[data-test="challenge-choice"]').length > 0) return 'Challenge Name';
                            else if (window.sol.type === 'listenMatch') return 'Listen Match';
                            else if (document.querySelectorAll('[data-test="challenge challenge-characterWrite"]').length > 0) {
                                if (document.querySelector('g._25Ktp')) return 'Character Write Drag';
                                else if (document.querySelectorAll('path._1e5Zt').length > 0) return 'Character Write Draw';
                                else return 'Character Write Freehand';
                            } else if (document.querySelectorAll('[data-test="challenge challenge-listenSpeak"]').length > 0) return 'Listen Speak';
                            else if (document.querySelectorAll('[data-test="challenge-choice"]').length > 0) {
                                if (document.querySelectorAll('[data-test="challenge-text-input"]').length > 0) return 'Challenge Choice with Text Input';
                                else return 'Challenge Choice';
                            } else if (document.querySelectorAll('[data-test$="challenge-tap-token"]').length > 0) {
                                if (window.sol.pairs !== undefined) return 'Pairs';
                                else if (window.sol.correctTokens !== undefined) return 'Tokens Run';
                                else if (window.sol.correctIndices !== undefined) return 'Indices Run';
                            } else if (document.querySelectorAll('[data-test="challenge-tap-token-text"]').length > 0) return 'Fill in the Gap';
                            else if (document.querySelectorAll('[data-test="challenge-text-input"]').length > 0) return 'Challenge Text Input';
                            else if (document.querySelectorAll('[data-test*="challenge-partialReverseTranslate"]').length > 0) return 'Partial Reverse';
                            else if (document.querySelectorAll('textarea[data-test="challenge-translate-input"]').length > 0) return 'Challenge Translate Input';
                            else if (window.sol.type === 'judge') return 'Judge';
                            else if (window.sol.type === 'dialogue' || window.sol.type === 'characterIntro' || window.sol.type === 'selectTranscription') return 'Dialogue';
                            else if (window.sol.type === 'select' || window.sol.type === 'characterSelect' || window.sol.type === 'form' || window.sol.type === 'readComprehension' || window.sol.type === 'listenComprehension' || window.sol.type === 'selectPronunciation') return 'Select Card';
                            else if (window.sol.type === 'orderTapComplete') return 'Order Tap Complete';
                            else if (window.sol.type === 'gap-fill' || window.sol.type === 'gap_fill') return 'Story Gap Fill';
                            else if (document.querySelectorAll('[data-test="session-complete-slide"]').length > 0) return 'Session Complete';
                            else if (document.querySelectorAll('[data-test="daily-quest-progress-slide"]').length > 0) return 'Daily Quest Progress';
                            else if (document.querySelectorAll('[data-test="streak-slide"]').length > 0) return 'Streak';
                            else if (document.querySelectorAll('[data-test="leaderboard-slide"]').length > 0) return 'Leaderboard';
                            else return false;
                        }
                    } catch (error) {
                        console.log(error);
                        return 'error';
                    }
                }

                async function solverHandleChallenge(challengeType) {
                    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

                    if (challengeType === 'Challenge Speak' || challengeType === 'Listen Match' || challengeType === 'Listen Speak') {
                        const buttonSkip = document.querySelector('button[data-test="player-skip"]');
                        buttonSkip?.click();

                    } else if (challengeType === 'Challenge Choice' || challengeType === 'Challenge Choice with Text Input') {
                        if (challengeType === 'Challenge Choice with Text Input') {
                            let elm = document.querySelectorAll('[data-test="challenge-text-input"]')[0];
                            let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                            nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0].split(/(?<=^\\S+)\\s/)[1] : (window.sol.displayTokens ? window.sol.displayTokens.find(t => t.isBlank).text : window.sol.prompt));
                            let inputEvent = new Event('input', { bubbles: true });
                            elm.dispatchEvent(inputEvent);
                        } else if (challengeType === 'Challenge Choice') {
                            document.querySelectorAll("[data-test='challenge-choice']")[window.sol.correctIndex].click();
                        }

                    } else if (challengeType === 'Pairs') {
                        let nl = document.querySelectorAll('[data-test*="challenge-tap-token"]:not(span)');
                        window.sol.pairs?.forEach((pair) => {
                            for (let i = 0; i < nl.length; i++) {
                                if (nl[i].disabled) continue;
                                const buttonText = solverGetCleanButtonText(nl[i]).toLowerCase();
                                try {
                                    if (buttonText === pair.transliteration.toLowerCase().trim() || buttonText === pair.character.toLowerCase().trim()) {
                                        nl[i].click();
                                    }
                                } catch (TypeError) {
                                    if (buttonText === pair.learningToken.toLowerCase().trim() || buttonText === pair.fromToken.toLowerCase().trim()) {
                                        nl[i].click();
                                    }
                                }
                            }
                        });

                    } else if (challengeType === 'Story Pairs') {
                        const nl = document.querySelectorAll('[data-test*="challenge-tap-token"]:not(span)');
                        const textToElementMap = new Map();
                        for (let i = 0; i < nl.length; i++) {
                            const text = solverGetCleanButtonText(nl[i]).toLowerCase();
                            textToElementMap.set(text, nl[i]);
                        }
                        for (const key in window.sol.dictionary) {
                            if (window.sol.dictionary.hasOwnProperty(key)) {
                                const value = window.sol.dictionary[key];
                                const keyPart = key.split(":")[1].toLowerCase().trim();
                                const normalizedValue = value.toLowerCase().trim();
                                const element1 = textToElementMap.get(keyPart);
                                const element2 = textToElementMap.get(normalizedValue);
                                if (element1 && !element1.disabled) element1.click();
                                if (element2 && !element2.disabled) element2.click();
                            }
                        }

                    } else if (challengeType === 'Tap Complete Table') {
                        const solutionRows = window.sol.displayTableTokens.slice(1);
                        const tableRowElements = document.querySelectorAll('tbody tr');
                        const wordBank = document.querySelector('div[data-test="word-bank"]');
                        const wordBankButtons = wordBank ? wordBank.querySelectorAll('button[data-test*="-challenge-tap-token"]') : [];
                        const usedWordBankIndexes = new Set();

                        solutionRows.forEach((solutionRow, rowIndex) => {
                            const answerCellData = solutionRow[1];
                            const correctToken = answerCellData.find(token => token.isBlank);
                            if (correctToken) {
                                const correctAnswerText = correctToken.text;
                                const currentRowElement = tableRowElements[rowIndex];
                                let buttons = currentRowElement.querySelectorAll('button[data-test*="-challenge-tap-token"]');
                                let clicked = false;
                                if (buttons.length > 0) {
                                    for (let button of buttons) {
                                        const buttonText = solverGetCleanButtonText(button);
                                        if (buttonText === correctAnswerText && !button.disabled) {
                                            button.click();
                                            clicked = true;
                                            break;
                                        }
                                    }
                                }
                                if (!clicked && wordBankButtons.length > 0) {
                                    for (let i = 0; i < wordBankButtons.length; i++) {
                                        if (usedWordBankIndexes.has(i)) continue;
                                        const button = wordBankButtons[i];
                                        const buttonText = solverGetCleanButtonText(button);
                                        if (buttonText === correctAnswerText && !button.disabled) {
                                            button.click();
                                            usedWordBankIndexes.add(i);
                                            break;
                                        }
                                    }
                                }
                            }
                        });

                    } else if (challengeType === 'Tokens Run') {
                        const all_tokens = document.querySelectorAll('[data-test$="challenge-tap-token"]');
                        const correct_tokens = window.sol.correctTokens;
                        const clicked_tokens = [];
                        correct_tokens.forEach(correct_token => {
                            const matching_elements = Array.from(all_tokens).filter(element => {
                                const elementText = solverGetCleanButtonText(element);
                                return elementText === correct_token.trim();
                            });
                            if (matching_elements.length > 0) {
                                const match_index = clicked_tokens.filter(token => {
                                    const tokenText = solverGetCleanButtonText(token);
                                    return tokenText === correct_token.trim();
                                }).length;
                                if (match_index < matching_elements.length) {
                                    matching_elements[match_index].click();
                                    clicked_tokens.push(matching_elements[match_index]);
                                } else {
                                    clicked_tokens.push(matching_elements[0]);
                                }
                            }
                        });

                    } else if (challengeType === 'Indices Run' || challengeType === 'Fill in the Gap') {
                        if (window.sol.correctIndices) {
                            window.sol.correctIndices?.forEach(index => {
                                document.querySelectorAll('div[data-test="word-bank"] [data-test*="challenge-tap-token"]:not(span)')[index].click();
                            });
                        }

                    } else if (challengeType === 'Challenge Text Input') {
                        let elm = document.querySelectorAll('[data-test="challenge-text-input"]')[0];
                        let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                        nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0] : (window.sol.displayTokens ? window.sol.displayTokens.find(t => t.isBlank).text : window.sol.prompt));
                        let inputEvent = new Event('input', { bubbles: true });
                        elm.dispatchEvent(inputEvent);

                    } else if (challengeType === 'Partial Reverse') {
                        let elm = document.querySelector('[data-test*="challenge-partialReverseTranslate"]')?.querySelector("span[contenteditable]");
                        let nativeInputNodeTextSetter = Object.getOwnPropertyDescriptor(Node.prototype, "textContent").set;
                        nativeInputNodeTextSetter.call(elm, window.sol?.displayTokens?.filter(t => t.isBlank)?.map(t => t.text)?.join()?.replaceAll(',', ''));
                        let inputEvent = new Event('input', { bubbles: true });
                        elm.dispatchEvent(inputEvent);

                    } else if (challengeType === 'Challenge Translate Input') {
                        const elm = document.querySelector('textarea[data-test="challenge-translate-input"]');
                        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                        nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0] : window.sol.prompt);
                        let inputEvent = new Event('input', { bubbles: true });
                        elm.dispatchEvent(inputEvent);

                    } else if (challengeType === 'Challenge Name') {
                        let articles = solverFindReact(document.getElementsByClassName(findReactMainElementClass)[0]).props.currentChallenge.articles;
                        let correctSolutions = solverFindReact(document.getElementsByClassName(findReactMainElementClass)[0]).props.currentChallenge.correctSolutions[0];
                        let matchingArticle = articles.find(article => correctSolutions.startsWith(article));
                        let matchingIndex = matchingArticle !== undefined ? articles.indexOf(matchingArticle) : null;
                        let remainingValue = correctSolutions.substring(matchingArticle.length);
                        let selectedElement = document.querySelector('[data-test="challenge-choice"]:nth-child(' + (matchingIndex + 1) + ')');
                        if (selectedElement) selectedElement.click();
                        let elm = document.querySelector('[data-test="challenge-text-input"]');
                        let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                        nativeInputValueSetter.call(elm, remainingValue);
                        let inputEvent = new Event('input', { bubbles: true });
                        elm.dispatchEvent(inputEvent);

                    } else if (challengeType === 'Type Cloze') {
                        const input = document.querySelector('input[type="text"].b4jqk');
                        if (!input) return;
                        let targetToken = window.sol.displayTokens.find(t => t.damageStart !== undefined);
                        let correctWord = targetToken?.text || "";
                        let correctEnding = "";
                        if (typeof targetToken?.damageStart === "number") {
                            correctEnding = correctWord.slice(targetToken.damageStart);
                        }
                        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                        nativeInputValueSetter.call(input, correctEnding);
                        input.dispatchEvent(new Event("input", { bubbles: true }));
                        input.dispatchEvent(new Event("change", { bubbles: true }));

                    } else if (challengeType === 'Type Cloze Table') {
                        const tableRows = document.querySelectorAll('tbody tr');
                        window.sol.displayTableTokens.slice(1).forEach((rowTokens, i) => {
                            const answerCell = rowTokens[1]?.find(t => typeof t.damageStart === "number");
                            if (answerCell && tableRows[i]) {
                                const input = tableRows[i].querySelector('input[type="text"].b4jqk');
                                if (!input) return;
                                const correctWord = answerCell.text;
                                const correctEnding = correctWord.slice(answerCell.damageStart);
                                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                                nativeInputValueSetter.call(input, correctEnding);
                                input.dispatchEvent(new Event("input", { bubbles: true }));
                                input.dispatchEvent(new Event("change", { bubbles: true }));
                            }
                        });

                    } else if (challengeType === 'Tap Cloze Table') {
                        const tableRows = document.querySelectorAll('tbody tr');
                        window.sol.displayTableTokens.slice(1).forEach((rowTokens, i) => {
                            const answerCell = rowTokens[1]?.find(t => typeof t.damageStart === "number");
                            if (!answerCell || !tableRows[i]) return;
                            const wordBank = document.querySelector('[data-test="word-bank"], .eSgkc');
                            const wordButtons = wordBank ? Array.from(wordBank.querySelectorAll('button[data-test*="challenge-tap-token"]:not([aria-disabled="true"])')) : [];
                            const correctWord = answerCell.text;
                            const correctEnding = correctWord.slice(answerCell.damageStart);
                            let endingMatched = "";
                            for (let btn of wordButtons) {
                                const btnText = solverGetCleanButtonText(btn);
                                if (!correctEnding.startsWith(endingMatched + btnText)) continue;
                                btn.click();
                                endingMatched += btnText;
                                if (endingMatched === correctEnding) break;
                            }
                        });

                    } else if (challengeType === 'Type Complete Table') {
                        const tableRows = document.querySelectorAll('tbody tr');
                        window.sol.displayTableTokens.slice(1).forEach((rowTokens, i) => {
                            const answerCell = rowTokens[1]?.find(t => t.isBlank);
                            if (!answerCell || !tableRows[i]) return;
                            const input = tableRows[i].querySelector('input[type="text"].b4jqk');
                            if (!input) return;
                            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                            nativeInputValueSetter.call(input, answerCell.text);
                            input.dispatchEvent(new Event("input", { bubbles: true }));
                            input.dispatchEvent(new Event("change", { bubbles: true }));
                        });

                    } else if (challengeType === 'Pattern Tap Complete') {
                        const wordBank = document.querySelector('[data-test="word-bank"], .eSgkc');
                        if (!wordBank) return;
                        const choices = window.sol.choices;
                        const correctIndex = window.sol.correctIndex ?? 0;
                        const correctText = choices[correctIndex];
                        const buttons = Array.from(wordBank.querySelectorAll('button[data-test*="challenge-tap-token"]:not([aria-disabled="true"])'));
                        const targetButton = buttons.find(btn => solverGetCleanButtonText(btn) === correctText);
                        if (targetButton) targetButton.click();

                    } else if (challengeType === 'Complete Reverse Translation') {
                        const blankTokens = window.sol.displayTokens.filter(t => t.isBlank);
                        const inputFields = document.querySelectorAll('[data-test="challenge-text-input"]');
                        inputFields.forEach((input, index) => {
                            if (blankTokens[index]) {
                                const answer = blankTokens[index].text;
                                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                                nativeInputValueSetter.call(input, answer);
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                            }
                        });

                    } else if (challengeType === 'Character Write Drag') {
                        const strokes = window.sol.strokes;
                        const createEvent = (type, x, y, buttons) => new MouseEvent(type, { bubbles: true, clientX: x, clientY: y, buttons, button: 0 });
                        const normalize = (str) => str ? str.replace(/\\s/g, '') : '';
                        for (let i = 0; i < strokes.length; i++) {
                            const targetPathData = normalize(strokes[i].path);
                            let path, handle;
                            while (!path || !handle) {
                                const candidates = document.querySelectorAll('path._1e5Zt');
                                path = Array.from(candidates).find(p => normalize(p.getAttribute('d')) === targetPathData);
                                handle = document.querySelector('g._25Ktp');
                                if (!path || !handle) await sleep(10);
                            }
                            const matrix = path.getScreenCTM();
                            const len = path.getTotalLength();
                            const start = path.getPointAtLength(0).matrixTransform(matrix);
                            const end = path.getPointAtLength(len).matrixTransform(matrix);
                            handle.dispatchEvent(createEvent('mousedown', start.x, start.y, 1));
                            const steps = 10;
                            for (let s = 1; s <= steps; s++) {
                                const p = path.getPointAtLength((s / steps) * len).matrixTransform(matrix);
                                const move = createEvent('mousemove', p.x, p.y, 1);
                                handle.dispatchEvent(move);
                                document.dispatchEvent(move);
                            }
                            const finalMove = createEvent('mousemove', end.x, end.y, 1);
                            handle.dispatchEvent(finalMove);
                            document.dispatchEvent(finalMove);
                            await sleep(5);
                            handle.dispatchEvent(createEvent('mouseup', end.x, end.y, 0));
                            document.dispatchEvent(createEvent('mouseup', end.x, end.y, 0));
                        }

                    } else if (challengeType === 'Character Write Draw') {
                        const strokes = window.sol.strokes;
                        const createEvent = (type, x, y, buttons) => new MouseEvent(type, { bubbles: true, clientX: x, clientY: y, buttons, button: 0 });
                        const normalize = (str) => str ? str.replace(/\\s/g, '') : '';
                        for (let i = 0; i < strokes.length; i++) {
                            const targetPathData = normalize(strokes[i].path);
                            let path, cursor;
                            while (!path || !cursor) {
                                const candidates = document.querySelectorAll('path._1e5Zt');
                                path = Array.from(candidates).find(p => normalize(p.getAttribute('d')) === targetPathData);
                                cursor = document.querySelector('g._1h31R:not(._25Ktp)');
                                if (!path || !cursor) await sleep(10);
                            }
                            const matrix = path.getScreenCTM();
                            const len = path.getTotalLength();
                            const start = path.getPointAtLength(0).matrixTransform(matrix);
                            const end = path.getPointAtLength(len).matrixTransform(matrix);
                            cursor.dispatchEvent(createEvent('mousedown', start.x, start.y, 1));
                            document.dispatchEvent(createEvent('mousedown', start.x, start.y, 1));
                            const steps = 10;
                            for (let s = 1; s <= steps; s++) {
                                const p = path.getPointAtLength((s / steps) * len).matrixTransform(matrix);
                                cursor.dispatchEvent(createEvent('mousemove', p.x, p.y, 1));
                                document.dispatchEvent(createEvent('mousemove', p.x, p.y, 1));
                            }
                            const finalMove = createEvent('mousemove', end.x, end.y, 1);
                            cursor.dispatchEvent(finalMove);
                            document.dispatchEvent(finalMove);
                            await sleep(5);
                            cursor.dispatchEvent(createEvent('mouseup', end.x, end.y, 0));
                            document.dispatchEvent(createEvent('mouseup', end.x, end.y, 0));
                        }

                    } else if (challengeType === 'Character Write Freehand') {
                        const freehandStrokes = window.sol.strokes.filter(s => s.strokeDrawMode === 'FREEHAND');
                        const createEvent = (type, x, y, buttons) => new MouseEvent(type, { bubbles: true, clientX: x, clientY: y, buttons, button: 0 });
                        const normalize = (str) => str ? str.replace(/\\s/g, '') : '';
                        for (let i = 0; i < freehandStrokes.length; i++) {
                            const targetPathData = normalize(freehandStrokes[i].path);
                            let path, svg;
                            while (!path || !svg) {
                                const candidates = document.querySelectorAll('path._22UPm');
                                path = Array.from(candidates).find(p => normalize(p.getAttribute('d')) === targetPathData);
                                svg = document.querySelector('svg.o1rqi');
                                if (!path || !svg) await sleep(10);
                            }
                            const matrix = path.getScreenCTM();
                            const len = path.getTotalLength();
                            const start = path.getPointAtLength(0).matrixTransform(matrix);
                            const end = path.getPointAtLength(len).matrixTransform(matrix);
                            svg.dispatchEvent(createEvent('mousedown', start.x, start.y, 1));
                            document.dispatchEvent(createEvent('mousedown', start.x, start.y, 1));
                            const steps = 10;
                            for (let s = 1; s <= steps; s++) {
                                const p = path.getPointAtLength((s / steps) * len).matrixTransform(matrix);
                                const move = createEvent('mousemove', p.x, p.y, 1);
                                svg.dispatchEvent(move);
                                document.dispatchEvent(move);
                            }
                            const finalMove = createEvent('mousemove', end.x, end.y, 1);
                            svg.dispatchEvent(finalMove);
                            document.dispatchEvent(finalMove);
                            await sleep(5);
                            svg.dispatchEvent(createEvent('mouseup', end.x, end.y, 0));
                            document.dispatchEvent(createEvent('mouseup', end.x, end.y, 0));
                        }

                    } else if (challengeType === 'Syllable Tap' || challengeType === 'Syllable Listen Tap') {
                        const correctIndices = window.sol.correctIndices;
                        const choicesData = window.sol.choices;
                        const domButtons = Array.from(document.querySelectorAll('[data-test="word-bank"] [data-test$="challenge-tap-token"]'));
                        correctIndices.forEach(index => {
                            const correctChoiceData = choicesData[index];
                            const correctText = correctChoiceData.text;
                            const matchingButton = domButtons.find(btn => solverGetCleanButtonText(btn) === correctText);
                            if (matchingButton) matchingButton.click();
                        });

                    } else if (challengeType === 'Story Arrange') {
                        let choices = document.querySelectorAll('[data-test*="challenge-tap-token"]:not(span)');
                        for (let i = 0; i < window.sol.phraseOrder.length; i++) {
                            choices[window.sol.phraseOrder[i]].click();
                        }
                    } else if (challengeType === 'Story Multiple Choice') {
                        let choices = document.querySelectorAll('[data-test="stories-choice"]');
                        choices[window.sol.correctAnswerIndex].click();
                    } else if (challengeType === 'Story Point to Phrase') {
                        let choices = document.querySelectorAll('[data-test="challenge-tap-token-text"]');
                        var correctIndex = -1;
                        for (let i = 0; i < window.sol.parts.length; i++) {
                            if (window.sol.parts[i].selectable === true) {
                                correctIndex += 1;
                                if (window.sol.correctAnswerIndex === i) {
                                    choices[correctIndex].parentElement.click();
                                }
                            }
                        }
                    } else if (challengeType === 'Judge') {
                        const ci = window.sol.correctIndices?.[0] ?? 0;
                        document.querySelectorAll('[data-test="challenge-judge-text"]')[ci]?.click();

                    } else if (challengeType === 'Dialogue') {
                        const idx = window.sol.correctIndex ?? 0;
                        const judgeItems = document.querySelectorAll('[data-test="challenge-judge-text"]');
                        if (judgeItems.length > 0) {
                            judgeItems[idx]?.click();
                        } else {
                            document.querySelectorAll('[data-test="challenge-choice"]')[idx]?.click();
                        }

                    } else if (challengeType === 'Select Card') {
                        const idx = window.sol.correctIndex ?? 0;
                        const cards = document.querySelectorAll('[data-test="challenge-choice-card"]');
                        if (cards.length > 0) {
                            cards[idx]?.click();
                        } else {
                            document.querySelectorAll('[data-test="challenge-choice"]')[idx]?.click();
                        }

                    } else if (challengeType === 'Order Tap Complete') {
                        const blanks = window.sol.displayTokens?.filter(t => t.isBlank);
                        if (blanks && blanks.length > 0) {
                            const choicesData = window.sol.choices || [];
                            const usedChoiceIdx = new Set();
                            for (const blank of blanks) {
                                let choiceIdx = -1;
                                for (let i = 0; i < choicesData.length; i++) {
                                    if (usedChoiceIdx.has(i)) continue;
                                    const choiceText = typeof choicesData[i] === 'object' ? choicesData[i].text : choicesData[i];
                                    if (choiceText?.trim() === blank.text?.trim()) {
                                        choiceIdx = i;
                                        break;
                                    }
                                }
                                if (choiceIdx === -1) continue;
                                usedChoiceIdx.add(choiceIdx);
                                const buttons = document.querySelectorAll('[data-test="word-bank"] [data-test*="challenge-tap-token"]:not(span)');
                                if (buttons[choiceIdx]) {
                                    buttons[choiceIdx].click();
                                    await sleep(50);
                                }
                            }
                        }

                    } else if (challengeType === 'Story Gap Fill') {
                        const correctIndices = window.sol.correctIndices || [];
                        const choicesList = window.sol.choices || [];
                        for (const idx of correctIndices) {
                            const targetText = choicesList[idx];
                            if (targetText == null) continue;
                            const gapBtns = document.querySelectorAll('[data-test="stories-choice"], [data-test*="challenge-tap-token"]:not(span):not([disabled]):not([aria-disabled="true"])');
                            for (const btn of gapBtns) {
                                if (btn.innerText.trim() === targetText.trim() && !btn.disabled && btn.getAttribute('aria-disabled') !== 'true') {
                                    btn.click();
                                    await sleep(50);
                                    break;
                                }
                            }
                        }
                    }
                }

                function solverFindSubReact(dom, traverseUp = reactTraverseUp) {
                    if (!dom) return null;
                    const key = Object.keys(dom).find(key => key.startsWith("__reactProps"));
                    return dom?.[key]?.children?.props?.slide;
                }

                function solverFindReact(dom, traverseUp = reactTraverseUp) {
                    if (!dom) return null;
                    const key = Object.keys(dom).find(key => {
                        return key.startsWith("__reactFiber$")
                            || key.startsWith("__reactInternalInstance$");
                    });
                    const domFiber = dom[key];
                    if (domFiber == null) return null;
                    const GetCompFiber = fiber => {
                        let parentFiber = fiber.return;
                        while (typeof parentFiber.type == "string") {
                            parentFiber = parentFiber.return;
                        }
                        return parentFiber;
                    };
                    let compFiber = GetCompFiber(domFiber);
                    for (let i = 0; i < traverseUp; i++) {
                        compFiber = GetCompFiber(compFiber);
                    }
                    return compFiber.stateNode;
                }

                function syncReactLookupByContext() {
                    const isStoryContext = document.querySelector('.FmlUF') !== null
                        || document.querySelector('[data-test="stories-player-continue"], [data-test="stories-player-done"], [data-test="story-start"]') !== null;

                    if (isStoryContext) {
                        findReactMainElementClass = '_3TJzR';
                        reactTraverseUp = 0;
                    } else {
                        findReactMainElementClass = '_3yE3H';
                        reactTraverseUp = 1;
                    }
                }

                async function runAutoSolve(check = true, skip = false, runToken = solveAllRunToken) {
                    if (isSolveBusy) return;
                    isSolveBusy = true;
                    syncReactLookupByContext();

                    try {
                        const practiceAgain = document.querySelector('[data-test="player-practice-again"]');
                        const sessionCompleteSlide = document.querySelector('[data-test="session-complete-slide"]');

                        const completeSlideVisible = sessionCompleteSlide || practiceAgain;
                        if (completeSlideVisible) {
                            if (!hasDecrementedForCurrentLesson) {
                                hasDecrementedForCurrentLesson = true;
                                window.dispatchEvent(
                                    new CustomEvent('DR_LessonCompleted')
                                );
                            }
                            if (practiceAgain) {
                                const autoPath =
                                    localStorage.getItem('dr_auto_path') ===
                                    'true';
                                const autoPractice =
                                    localStorage.getItem(
                                        'dr_auto_practice'
                                    ) === 'true';
                                const pathRem =
                                    parseInt(
                                        localStorage.getItem('dr_path_rem')
                                    ) || 0;
                                const practiceRem =
                                    parseInt(
                                        localStorage.getItem('dr_practice_rem')
                                    ) || 0;
                                const pathInf =
                                    localStorage.getItem('dr_path_inf') ===
                                    'true';
                                const practiceInf =
                                    localStorage.getItem('dr_practice_inf') ===
                                    'true';
                                const pathActive =
                                    autoPath && (pathInf || pathRem > 0);
                                const practiceActive =
                                    autoPractice &&
                                    (practiceInf || practiceRem > 0);
                                if (pathActive || practiceActive) {
                                    practiceAgain.click();
                                    return;
                                }
                            }
                        } else {
                            hasDecrementedForCurrentLesson = false;
                        }

                        const selectorsForSkip = [
                            '[data-test="practice-hub-ad-no-thanks-button"]',
                            '.vpDIE',
                            '[data-test="plus-no-thanks"]',
                            '._1N-oo._36Vd3._16r-S._1ZBYz._23KDq._1S2uf.HakPM',
                            '._8AMBh._2vfJy._3Qy5R._28UWu._3h0lA._1S2uf._1E9sc',
                            '._1Qh5D._36g4N._2YF0P._28UWu._3h0lA._1S2uf._1E9sc',
                            '[data-test="story-start"]',
                            '._3bBpU._1x5JY._1M9iF._36g4N._2YF0P.T7I0c._2EnxW.MYehf',
                            '._2V6ug._1ursp._7jW2t._28UWu._3h0lA._1S2uf._1E9sc',
                            '._1rcV8._1VYyp._1ursp._7jW2t._1gKir',
                            '._2V6ug._1ursp._7jW2t._3zgLG'
                        ];
                        selectorsForSkip.forEach(selector => {
                            const element = document.querySelector(selector);
                            if (element) element.click();
                        });

                        window.sol = null;
                        try {
                            window.sol = solverFindReact(document.getElementsByClassName(findReactMainElementClass)[0])?.props?.currentChallenge ?? null;
                        } catch (error) {
                            window.sol = null;
                            console.log(error);
                        }

                        let challengeType;
                        if (window.sol) {
                            challengeType = solverDetermineChallengeType();
                        } else {
                            challengeType = 'error';
                        }

                        let questionKey;
                        if (window.sol && window.sol.id) {
                            questionKey = window.sol.id;
                        } else if (window.sol) {
                            questionKey = JSON.stringify({
                                type: window.sol.type,
                                prompt: window.sol.prompt || ''
                            });
                        } else {
                            questionKey = null;
                        }

                        if (questionKey !== currentQuestionId) {
                            currentQuestionId = questionKey;
                            hasLoggedForCurrent = 0;
                        }

                        if (justClickedNext) {
                            const hasChallenge =
                                document.querySelector(
                                    '[data-test~="challenge"]'
                                ) !== null;
                            if (
                                hasChallenge &&
                                questionKey === lastSolvedQuestionId &&
                                questionKey !== null &&
                                Date.now() - nextClickedTime < 5000
                            ) {
                                return;
                            } else {
                                justClickedNext = false;
                            }
                        }

                        if (challengeType === 'error') {
                            await Promise.race([
                                solverClickCheck(),
                                new Promise(resolve => setTimeout(resolve, 500))
                            ]);
                        } else if (challengeType) {
                            let playerFooter1 = document.getElementById("session/PlayerFooter");

                            if ((playerFooter1 && playerFooter1.matches("._3rB4d._1VTif._2HXQ9")) || (!playerFooter1 && document.querySelector('._2i9lj'))) {
                                await Promise.race([
                                    solverHandleChallenge(challengeType),
                                    new Promise(resolve => setTimeout(resolve, 2000))
                                ]);
                                await new Promise(r => setTimeout(r, 50));
                            }

                            let skipInsteadOfCheck = false;
                            if (check && (playerFooter1 && playerFooter1.matches('._3rB4d._1VTif._2HXQ9')) || (!playerFooter1 && document.querySelector('._2i9lj'))) {
                                await Promise.race([
                                    solverClickCheck(),
                                    new Promise(resolve => setTimeout(resolve, 500))
                                ]);
                                await new Promise(r => setTimeout(r, 50));
                                lastSolvedQuestionId = questionKey;
                            } else if (check && (playerFooter1 && !playerFooter1.matches('._3rB4d._1VTif._2HXQ9')) || ((!playerFooter1 && document.querySelector('._2i9lj')) && !document.querySelector('[data-test="stories-player-continue"]').disabled)) {
                                skipInsteadOfCheck = true;
                            }

                            if (skip || skipInsteadOfCheck) {
                                await Promise.race([
                                    solverClickNext(),
                                    new Promise(resolve => setTimeout(resolve, 500))
                                ]);
                                lastSolvedQuestionId = questionKey;
                                justClickedNext = true;
                                nextClickedTime = Date.now();
                            }
                        } else {
                            await Promise.race([
                                solverClickCheck(),
                                new Promise(resolve => setTimeout(resolve, 500))
                            ]);
                        }
                    } finally {
                        isSolveBusy = false;
                    }
                }

                function toggleAutoSolve(value) {
                    if (value === "start") isAutoMode = true;
                    else if (value === "stop") isAutoMode = false;
                    else isAutoMode = !isAutoMode;

                    const activeSolveAllRunToken = bumpSolveAllRunToken();

                    try {
                        const btn = document.getElementById("solveAllButton");
                        if (btn) btn.innerText = isAutoMode ? "PAUSE SOLVE" : "SOLVE ALL";
                    } catch {}

                    window.dispatchEvent(new CustomEvent('DR_StateSync', { detail: { isAutoMode: isAutoMode } }));

                    function startSolvingLoop(runToken) {
                        if (solvingLoopRunning || !isAutoMode || runToken !== solveAllRunToken) return;

                        solvingLoopRunning = true;
                        let initialUrl = window.location.href;

                        (async function runLoop() {
                            while (isAutoMode && runToken === solveAllRunToken) {
                                if (window.location.href !== initialUrl) {
                                    isAutoMode = false;
                                    try {
                                        const btn = document.getElementById("solveAllButton");
                                        if (btn) btn.innerText = "SOLVE ALL";
                                    } catch {}
                                    window.dispatchEvent(new CustomEvent('DR_StateSync', { detail: { isAutoMode: false } }));
                                    break;
                                }

                                const startTime = Date.now();
                                const randomSpeedEnabled = localStorage.getItem('dr_random_speed') !== null
                                    ? localStorage.getItem('dr_random_speed') === 'true'
                                    : initRandomSpeed;
                                const solveSpeedMin = parseFloat(localStorage.getItem('dr_solve_speed_min')) || initSolveSpeedMin;
                                const solveSpeedMax = parseFloat(localStorage.getItem('dr_solve_speed_max')) || initSolveSpeedMax;
                                const solveSpeedFixed = parseInt(localStorage.getItem('dr_solve_speed_fixed')) || initSolveSpeedFixed;

                                const targetDelay = randomSpeedEnabled
                                    ? Math.floor((
                                        solveSpeedMin + (crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295) *
                                        (solveSpeedMax - solveSpeedMin)
                                    ) * 1000)
                                    : solveSpeedFixed;

                                await runAutoSolve(true, true, runToken);
                                await new Promise(resolve => setTimeout(resolve, 100));

                                if (!isAutoMode || runToken !== solveAllRunToken) break;

                                const elapsedTime = Date.now() - startTime;
                                const remainingTime = targetDelay - elapsedTime;

                                if (remainingTime > 0) {
                                    await new Promise(resolve => setTimeout(resolve, remainingTime));
                                }
                            }

                            solvingLoopRunning = false;

                            if (isAutoMode && runToken !== solveAllRunToken) {
                                startSolvingLoop(solveAllRunToken);
                            }
                        })();
                    }

                    if (isAutoMode) {
                        startSolvingLoop(activeSolveAllRunToken);
                    }
                }

                window.toggleAutoSolve = toggleAutoSolve;
                window.runAutoSolve = runAutoSolve;

                window.addEventListener('DR_TriggerSolveAll', (e) => {
                    let action = e && e.detail && e.detail.action;
                    toggleAutoSolve(action);
                });

                window.addEventListener('DR_TriggerSolveOnce', () => {
                    runAutoSolve();
                });

                window.addEventListener('DR_StopSolver', () => {
                    toggleAutoSolve("stop");
                });

                setInterval(() => {
                    const isLesson = window.location.pathname.includes('/lesson') || window.location.pathname.includes('/practice') || window.location.pathname.includes('/stories');
                    if (isLesson) {
                        const autoSolverVal = localStorage.getItem('dr_auto_solver') !== null
                            ? localStorage.getItem('dr_auto_solver') === 'true'
                            : initAutoSolver;
                        if (autoSolverVal && !isAutoMode) {
                            toggleAutoSolve('start');
                        }
                    } else {
                        if (isAutoMode) {
                            toggleAutoSolve('stop');
                        }
                    }
                }, 1000);
            })();
        `;
    (document.head || document.documentElement).appendChild(script);
  }

  function updatePathRemainingUI() {
    const pathInput = document.getElementById("DR_Path_Input");
    if (pathInput) {
      if (pathLessonsRemaining === Infinity) {
        pathInput.value = "Infinity";
      } else {
        pathInput.value = pathLessonsRemaining;
        localStorage.setItem("dr_path_rem", String(pathLessonsRemaining));
      }
    }
  }

  function updatePracticeRemainingUI() {
    const pracInput = document.getElementById("DR_Practice_Input");
    if (pracInput) {
      if (practiceLessonsRemaining === Infinity) {
        pracInput.value = "Infinity";
      } else {
        pracInput.value = practiceLessonsRemaining;
        localStorage.setItem(
          "dr_practice_rem",
          String(practiceLessonsRemaining),
        );
      }
    }
  }

  function initApp() {
    checkTheme();

    window.addEventListener("DR_Notify", (e) => {
      if (e.detail) notify(e.detail.type, e.detail.title, e.detail.body);
    });

    window.addEventListener("DR_ResetBtn", (e) => {
      if (e.detail) resetBtn(e.detail.id, e.detail.text);
    });

    window.addEventListener("DR_StateSync", (e) => {
      if (e.detail && typeof e.detail.isAutoMode !== "undefined") {
        isAutoMode = e.detail.isAutoMode;
        updateSolveButtonText(isAutoMode ? "PAUSE SOLVE" : "SOLVE ALL");
        if (isAutoMode) {
          setUiHiddenState(true);
        }
      }
    });

    window.addEventListener("DR_LessonCompleted", () => {
      if (!hasDecrementedForCurrentLesson) {
        hasDecrementedForCurrentLesson = true;

        if (autoPathEnabled) {
          if (pathLessonsRemaining !== Infinity) {
            pathLessonsRemaining = Math.max(0, pathLessonsRemaining - 1);
            updatePathRemainingUI();
            if (pathLessonsRemaining === 0) {
              autoPathEnabled = false;
              localStorage.setItem("dr_auto_path", "false");
              const pathBtn = document.getElementById("DR_AutoPath_Btn");
              if (pathBtn) resetBtn("DR_AutoPath_Btn", "RUN");
              notify(
                "success",
                "Path Solver Target Reached",
                "Specified number of lessons solved. Stopping...",
              );
              window.dispatchEvent(new CustomEvent("DR_StopSolver"));
            }
          }
        }

        if (autoPracticeEnabled) {
          if (practiceLessonsRemaining !== Infinity) {
            practiceLessonsRemaining = Math.max(
              0,
              practiceLessonsRemaining - 1,
            );
            updatePracticeRemainingUI();
            if (practiceLessonsRemaining === 0) {
              autoPracticeEnabled = false;
              localStorage.setItem("dr_auto_practice", "false");
              const pracBtn = document.getElementById("DR_AutoPractice_Btn");
              if (pracBtn) resetBtn("DR_AutoPractice_Btn", "RUN");
              notify(
                "success",
                "Practice Solver Target Reached",
                "Specified number of lessons solved. Stopping...",
              );
              window.dispatchEvent(new CustomEvent("DR_StopSolver"));
            }
          }
        }
      }
    });

    if (uiHidden) {
      const togHide = document.getElementById("duorain-hide-button");
      const wrap = document.getElementById("DR_Main");
      const mBox = document.getElementById("DR_Main_Box");
      const lblTxt = document.getElementById("hide-show-text");

      if (togHide) togHide.classList.add("duorain-show-mode");
      if (lblTxt) lblTxt.innerText = "Show";
      if (mBox) {
        mBox.classList.add("dr-hidden");
        mBox.classList.add("dr-collapsed");
      }
      if (wrap) wrap.classList.add("dr-panel-hidden");
    }

    applyLocalMax();
    applyEZQuiz();
    applyPageSolver();
    startLeaguePolling();
    checkUpdateBannerFromCache();
    checkForUpdates();
    setInterval(checkForUpdates, 6 * 60 * 60 * 1000);
    setInterval(bgCheck, 2500);
    setInterval(async () => {
      if (!user) return;
      await refreshStats();
      autoKeepStreak();
    }, 30000);

    setInterval(() => {
      if (!user) return;
      refreshQuestCenter();
    }, 60000);

    setInterval(() => {
      if (!user) return;
      refreshPageData(pageId);
    }, 10000);

    ["XP", "Gem", "Streak", "Path", "Practice"].forEach(toggleInf);

    document
      .getElementById("DR_TopSettings_Btn")
      .addEventListener("click", () => changePage("Settings"));
    document.getElementById("DR_Update_Btn").addEventListener("click", () => {
      window.open(drUpdatePageUrl, "_blank");
    });
    document
      .getElementById("DR_Settings_Back_Btn")
      .addEventListener("click", () => changePage(1));
    document
      .getElementById("DR_Version_Btn")
      .addEventListener("click", () => changePage("Stats"));
    document
      .getElementById("DR_Stats_Back_Btn")
      .addEventListener("click", () => changePage(1));
    document
      .getElementById("DR_AutoSolver_Btn")
      .addEventListener("click", () => changePage("AutoSolver"));
    document
      .getElementById("DR_Automations_Btn")
      .addEventListener("click", () => changePage("Automations"));
    document
      .getElementById("DR_AutoSolver_Back_Btn")
      .addEventListener("click", () => changePage("Settings"));
    document
      .getElementById("DR_Automations_Back_Btn")
      .addEventListener("click", () => changePage("Settings"));
    document
      .getElementById("DR_Extra_Btn")
      .addEventListener("click", () => changePage("Extra"));
    document
      .getElementById("DR_Extra_Back_Btn")
      .addEventListener("click", () => changePage(1));
    document
      .getElementById("DR_Shop_Btn")
      .addEventListener("click", () => changePage("Shop"));
    document
      .getElementById("DR_Shop_Back_Btn")
      .addEventListener("click", () => changePage("Extra"));
    document
      .getElementById("DR_Quest_Nav_Btn")
      .addEventListener("click", () => changePage("Quests"));
    document
      .getElementById("DR_Quests_Back_Btn")
      .addEventListener("click", () => changePage("Extra"));
    document
      .getElementById("DR_Tools_Nav_Btn")
      .addEventListener("click", () => changePage("Tools"));
    document
      .getElementById("DR_Tools_Back_Btn")
      .addEventListener("click", () => changePage("Extra"));
    document
      .getElementById("DR_Board_Nav_Btn")
      .addEventListener("click", () => {
        const cont = document.getElementById("DR_Board_Container");
        if (cont && cont.dataset.loaded !== "1") {
          cont.innerHTML = `<p class="DR_T2 DR_NoSel" style="text-align: center; padding: 8px 0;">Loading...</p>`;
        }
        changePage("Board");
      });
    document
      .getElementById("DR_Board_Back_Btn")
      .addEventListener("click", () => changePage("Extra"));

    document
      .getElementById("DR_Feed_Nav_Btn")
      .addEventListener("click", () => changePage("Feed"));
    document
      .getElementById("DR_Feed_Back_Btn")
      .addEventListener("click", () => changePage("Extra"));

    document
      .getElementById("DR_XPSummaries_Btn")
      .addEventListener("click", () => changePage("XPSummaries"));
    document
      .getElementById("DR_XPSummaries_Back_Btn")
      .addEventListener("click", () => changePage("Extra"));

    document
      .getElementById("DR_AccMgr_Back_Btn")
      .addEventListener("click", () => changePage(1));
    document
      .getElementById("DR_AccSave_Btn")
      .addEventListener("click", () => accSaveCurrent());

    document.getElementById("DR_Gift_Btn").addEventListener("click", () => {
      const uname = document.getElementById("DR_Tools_User").value;
      const gtype = document
        .getElementById("DR_Gift_Select")
        .getAttribute("data-value");
      sendGift(uname, gtype);
    });

    document.getElementById("DR_Friend_Btn").addEventListener("click", () => {
      const uname = document.getElementById("DR_Tools_User").value;
      const mode = document
        .getElementById("DR_Friend_Select")
        .getAttribute("data-value");
      forceFriend(uname, mode);
    });

    document
      .getElementById("duorain-hide-button")
      .addEventListener("click", () => {
        const togHide = document.getElementById("duorain-hide-button");
        if (togHide.dataset.dragged === "1") {
          togHide.dataset.dragged = "";
          return;
        }
        setUiHiddenState(!uiHidden);
      });

    document.getElementById("DR_XP_Btn").addEventListener("click", () => {
      runTask("xp", "DR_XP");
    });

    document.getElementById("DR_Gem_Btn").addEventListener("click", () => {
      runTask("gem", "DR_Gem");
    });

    document.getElementById("DR_Streak_Btn").addEventListener("click", () => {
      runTask("streak", "DR_Streak");
    });

    document.getElementById("DR_League_Btn").addEventListener("click", () => {
      runTask("league", "DR_League");
    });

    document
      .getElementById("DR_Quest_Force_Btn")
      .addEventListener("click", () => {
        forceQuests();
      });

    document.getElementById("DR_Block_Btn").addEventListener("click", () => {
      const name = document.getElementById("DR_Tools_User").value.trim();
      if (!name) {
        notify("warning", "Block / Unblock", "Please enter a username.");
        return;
      }
      const mode = document
        .getElementById("DR_Block_Select")
        .getAttribute("data-value");
      blockTarget(name, mode === "unblock");
    });

    document
      .getElementById("DR_FollowSingle_Btn")
      .addEventListener("click", () => {
        const name = document.getElementById("DR_Tools_User").value.trim();
        if (!name) {
          notify("warning", "Follow / Unfollow", "Please enter a username.");
          return;
        }
        const mode = document
          .getElementById("DR_FollowSingle_Select")
          .getAttribute("data-value");
        followTarget(name, mode === "unfollow");
      });

    document.getElementById("DR_Follow_Btn").addEventListener("click", () => {
      if (farmStates.follow) {
        massFollow();
        return;
      }
      if (farmStates.unfollow) {
        massUnfollow();
        return;
      }
      const mode = document
        .getElementById("DR_Follow_Select")
        .getAttribute("data-value");
      if (mode === "unfollow") massUnfollow();
      else massFollow();
    });

    document
      .getElementById("DR_Block_Mass_Btn")
      .addEventListener("click", () => {
        if (farmStates.blockmass) {
          massBlock();
          return;
        }
        if (farmStates.unblock) {
          massUnblock();
          return;
        }
        const mode = document
          .getElementById("DR_BlockMass_Select")
          .getAttribute("data-value");
        if (mode === "unblock") massUnblock();
        else massBlock();
      });

    document.getElementById("DR_Hearts_Btn").addEventListener("click", () => {
      const count = parseInt(document.getElementById("DR_Hearts_Input").value);
      if (isNaN(count) || count < 1 || count > 5) {
        notify("warning", "Remove Hearts", "Enter a number between 1 and 5.");
        return;
      }
      removeHearts(count);
    });

    document
      .getElementById("DR_Board_Status_Btn")
      .addEventListener("click", openStatusPicker);
    document
      .getElementById("DR_Status_Back_Btn")
      .addEventListener("click", () => {
        changePage("Board");
      });
    document
      .getElementById("DR_Status_Search")
      .addEventListener("input", (event) => {
        showStatuses(event.target.value);
      });

    const wireToggle = (id, storageKey, onChange) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.toggle("on", localStorage.getItem(storageKey) === "true");
      el.addEventListener("click", () => {
        const now = !el.classList.contains("on");
        el.classList.toggle("on", now);
        localStorage.setItem(storageKey, now ? "true" : "false");
        if (typeof onChange === "function") onChange(now);
      });
    };

    wireToggle("DR_LocalMax_Toggle", "dr_local_max", () => {
      notify("info", "On-Client Max", "Reloading page to apply the change...");
      setTimeout(() => window.location.reload(), 1200);
    });
    wireToggle("DR_AutoJoin_Toggle", "dr_auto_join_league", () => {
      leagueJoinAttempted = false;
    });
    wireToggle("DR_AutoReach_Toggle", "dr_auto_reach_rank", (on) => {
      if (on) autoReachRank();
    });
    wireToggle("DR_AutoStreak_Toggle", "dr_auto_keep_streak", (on) => {
      if (on) autoKeepStreak();
    });
    wireToggle("DR_AutoBlock_Toggle", "dr_auto_block_league", (on) => {
      if (on) autoBlockLeague();
    });
    wireToggle("DR_AutoQuest_Toggle", "dr_auto_quest_saver", (on) => {
      if (on) refreshQuestCenter();
    });

    wireToggle("DR_SolverButtons_Toggle", "dr_solver_buttons", (on) => {
      solverButtonsEnabled = on;
    });
    if (localStorage.getItem("dr_solver_buttons") === null) {
      const el = document.getElementById("DR_SolverButtons_Toggle");
      if (el) el.classList.add("on");
    }
    wireToggle("DR_AutoSolver_Toggle", "dr_auto_solver", (on) => {
      autoSolverEnabled = on;
      toggleAutoSolve(on ? "start" : "stop");
    });
    wireToggle("DR_RandomSpeed_Toggle", "dr_random_speed", (on) => {
      randomSpeedEnabled = on;
    });
    wireToggle("DR_EZQuiz_Toggle", "dr_ez_quiz", () => {
      clearPrefetchedSessionsCache();
      notify("info", "EZ Quiz", "Reloading page to apply the change...");
      setTimeout(() => window.location.reload(), 1200);
    });

    const sSpdInp = document.getElementById("DR_SolveSpeed_Input");
    if (sSpdInp) {
      sSpdInp.value = solveSpeedFixed;
      sSpdInp.addEventListener("change", () => {
        const nVal = parseInt(sSpdInp.value);
        solveSpeedFixed = isNaN(nVal) ? 400 : Math.max(50, nVal);
        sSpdInp.value = solveSpeedFixed;
        localStorage.setItem("dr_solve_speed_fixed", solveSpeedFixed);
      });
    }

    const sSpdMinInp = document.getElementById("DR_SolveSpeedMin_Input");
    if (sSpdMinInp) {
      sSpdMinInp.value = solveSpeedMin;
      sSpdMinInp.addEventListener("change", () => {
        const nVal = parseFloat(sSpdMinInp.value);
        solveSpeedMin = isNaN(nVal) ? 2.8 : Math.max(0.1, nVal);
        sSpdMinInp.value = solveSpeedMin;
        localStorage.setItem("dr_solve_speed_min", solveSpeedMin);
      });
    }

    const sSpdMaxInp = document.getElementById("DR_SolveSpeedMax_Input");
    if (sSpdMaxInp) {
      sSpdMaxInp.value = solveSpeedMax;
      sSpdMaxInp.addEventListener("change", () => {
        const nVal = parseFloat(sSpdMaxInp.value);
        solveSpeedMax = isNaN(nVal) ? 12.4 : Math.max(solveSpeedMin, nVal);
        sSpdMaxInp.value = solveSpeedMax;
        localStorage.setItem("dr_solve_speed_max", solveSpeedMax);
      });
    }

    const autoPathBtn = document.getElementById("DR_AutoPath_Btn");
    if (autoPathBtn) {
      if (autoPathEnabled) {
        stopBtn("DR_AutoPath_Btn");
        const pathInf = localStorage.getItem("dr_path_inf") === "true";
        const pathRem = parseInt(localStorage.getItem("dr_path_rem")) || 1;
        pathLessonsRemaining = pathInf ? Infinity : pathRem;
        const pathHash = document.getElementById("DR_Path_Hash");
        const pathInput = document.getElementById("DR_Path_Input");
        if (pathHash && pathInput) {
          if (pathInf) {
            pathHash.innerHTML =
              icons.inf + '<span class="DR_Hash_Lbl">Infinite</span>';
            pathHash.setAttribute("data-inf", "true");
            pathHash.classList.add("dr-inf-active");
            pathInput.parentElement.classList.add("dr-inf-hidden");
            pathInput.disabled = true;
            pathInput.value = "Infinity";
          } else {
            pathHash.innerHTML = icons.hash;
            pathHash.setAttribute("data-inf", "false");
            pathHash.classList.remove("dr-inf-active");
            pathInput.parentElement.classList.remove("dr-inf-hidden");
            pathInput.disabled = false;
            pathInput.value = pathRem;
          }
        }
      } else {
        resetBtn("DR_AutoPath_Btn", "RUN");
      }

      autoPathBtn.addEventListener("click", () => {
        if (autoPathEnabled) {
          autoPathEnabled = false;
          localStorage.setItem("dr_auto_path", "false");
          resetBtn("DR_AutoPath_Btn", "RUN");
          notify("info", "Auto Path", "Auto Path Solver stopped.");
        } else {
          if (autoPracticeEnabled) {
            autoPracticeEnabled = false;
            localStorage.setItem("dr_auto_practice", "false");
            resetBtn("DR_AutoPractice_Btn", "RUN");
          }
          const pathHash = document.getElementById("DR_Path_Hash");
          const pathInput = document.getElementById("DR_Path_Input");
          const isInf =
            pathHash && pathHash.getAttribute("data-inf") === "true";
          let lessonsCount = Infinity;
          if (!isInf && pathInput) {
            const val = parseInt(pathInput.value);
            if (isNaN(val) || val <= 0) {
              notify(
                "warning",
                "Invalid Input",
                "Please enter a valid number of lessons.",
              );
              return;
            }
            lessonsCount = val;
          }
          autoPathEnabled = true;
          pathLessonsRemaining = lessonsCount;
          localStorage.setItem("dr_auto_path", "true");
          localStorage.setItem("dr_path_inf", isInf ? "true" : "false");
          localStorage.setItem(
            "dr_path_rem",
            isInf ? "0" : String(lessonsCount),
          );
          stopBtn("DR_AutoPath_Btn");
          autoSolverEnabled = true;
          localStorage.setItem("dr_auto_solver", "true");
          const solverTog = document.getElementById("DR_AutoSolver_Toggle");
          if (solverTog) solverTog.classList.add("on");
          notify(
            "success",
            "Auto Path",
            `Auto Path Solver started (${isInf ? "Infinite" : lessonsCount + " lessons"}).`,
          );
        }
      });
    }

    const autoPracticeBtn = document.getElementById("DR_AutoPractice_Btn");
    if (autoPracticeBtn) {
      if (autoPracticeEnabled) {
        stopBtn("DR_AutoPractice_Btn");
        const pracInf = localStorage.getItem("dr_practice_inf") === "true";
        const pracRem = parseInt(localStorage.getItem("dr_practice_rem")) || 1;
        practiceLessonsRemaining = pracInf ? Infinity : pracRem;
        const pracHash = document.getElementById("DR_Practice_Hash");
        const pracInput = document.getElementById("DR_Practice_Input");
        if (pracHash && pracInput) {
          if (pracInf) {
            pracHash.innerHTML =
              icons.inf + '<span class="DR_Hash_Lbl">Infinite</span>';
            pracHash.setAttribute("data-inf", "true");
            pracHash.classList.add("dr-inf-active");
            pracInput.parentElement.classList.add("dr-inf-hidden");
            pracInput.disabled = true;
            pracInput.value = "Infinity";
          } else {
            pracHash.innerHTML = icons.hash;
            pracHash.setAttribute("data-inf", "false");
            pracHash.classList.remove("dr-inf-active");
            pracInput.parentElement.classList.remove("dr-inf-hidden");
            pracInput.disabled = false;
            pracInput.value = pracRem;
          }
        }
      } else {
        resetBtn("DR_AutoPractice_Btn", "RUN");
      }

      autoPracticeBtn.addEventListener("click", () => {
        if (autoPracticeEnabled) {
          autoPracticeEnabled = false;
          localStorage.setItem("dr_auto_practice", "false");
          resetBtn("DR_AutoPractice_Btn", "RUN");
          notify("info", "Auto Practice", "Auto Practice Mode stopped.");
        } else {
          if (autoPathEnabled) {
            autoPathEnabled = false;
            localStorage.setItem("dr_auto_path", "false");
            resetBtn("DR_AutoPath_Btn", "RUN");
          }
          const pracHash = document.getElementById("DR_Practice_Hash");
          const pracInput = document.getElementById("DR_Practice_Input");
          const isInf =
            pracHash && pracHash.getAttribute("data-inf") === "true";
          let lessonsCount = Infinity;
          if (!isInf && pracInput) {
            const val = parseInt(pracInput.value);
            if (isNaN(val) || val <= 0) {
              notify(
                "warning",
                "Invalid Input",
                "Please enter a valid number of lessons.",
              );
              return;
            }
            lessonsCount = val;
          }
          autoPracticeEnabled = true;
          practiceLessonsRemaining = lessonsCount;
          localStorage.setItem("dr_auto_practice", "true");
          localStorage.setItem("dr_practice_inf", isInf ? "true" : "false");
          localStorage.setItem(
            "dr_practice_rem",
            isInf ? "0" : String(lessonsCount),
          );
          stopBtn("DR_AutoPractice_Btn");
          autoSolverEnabled = true;
          localStorage.setItem("dr_auto_solver", "true");
          const solverTog = document.getElementById("DR_AutoSolver_Toggle");
          if (solverTog) solverTog.classList.add("on");
          notify(
            "success",
            "Auto Practice",
            `Auto Practice Mode started (${isInf ? "Infinite" : lessonsCount + " lessons"}).`,
          );
        }
      });
    }

    showStats();
    document.getElementById("DR_Stats_Reset").addEventListener("click", () => {
      for (const kind in statKeys) {
        localStorage.removeItem(statKeys[kind]);
      }
      localStorage.removeItem(statSinceKey);
      showStats();
    });

    document
      .getElementById("DR_Shop_Search")
      .addEventListener("input", (event) => {
        showShop(event.target.value);
      });

    document
      .getElementById("DR_Quest_Search")
      .addEventListener("input", (event) => {
        showQuests(event.target.value);
      });

    const dInp = document.getElementById("DR_Delay_Input");
    dInp.value = delayMs;

    dInp.addEventListener("change", () => {
      const nVal = parseInt(dInp.value);
      delayMs = isNaN(nVal) ? 100 : Math.min(60000, Math.max(50, nVal));
      dInp.value = delayMs;
      localStorage.setItem("dr_delay", delayMs);
    });

    const roomInp = document.getElementById("DR_XpRoom_Input");
    const rawRoom = localStorage.getItem("dr_xp_room");
    const savedRoom = rawRoom === null ? 30 : parseInt(rawRoom) || 0;
    if (rawRoom === null) localStorage.setItem("dr_xp_room", "30");
    roomInp.value = savedRoom > 0 ? savedRoom : "";

    roomInp.addEventListener("change", () => {
      let rVal = parseInt(roomInp.value);
      if (isNaN(rVal) || rVal <= 0) {
        rVal = 0;
      } else {
        rVal = Math.min(500, Math.max(30, rVal));
      }
      roomInp.value = rVal > 0 ? rVal : "";
      localStorage.setItem("dr_xp_room", rVal);
    });

    const savedNotifPos =
      localStorage.getItem("dr_notif_pos") || "bottom_center";
    applyNotifPos(savedNotifPos);

    window.addEventListener("resize", layoutNotif);
    window.addEventListener("resize", queueRelayout);
    window.addEventListener("orientationchange", queueRelayout);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", queueRelayout);
    }
    relayout();

    const drBox = document.getElementById("DR_Main_Box");
    if (drBox && window.MutationObserver) {
      new MutationObserver(queueRelayout).observe(drBox, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    const drHandle = document.getElementById("duorain-hide-button");
    const drWrap = document.getElementById("DR_Main");
    if (drHandle && drWrap) {
      let dragging = false,
        moved = false,
        sx = 0,
        sy = 0,
        ox = 0,
        oy = 0;
      const onDown = (e) => {
        const p = e.touches ? e.touches[0] : e;
        dragging = true;
        moved = false;
        sx = p.clientX;
        sy = p.clientY;

        clearTimeout(hideCollapseTimer);
        const mBox = document.getElementById("DR_Main_Box");
        if (mBox) {
          const prevBoxTrans = mBox.style.transition;
          mBox.style.transition = "none";
          mBox.classList.toggle("dr-hidden", uiHidden);
          mBox.classList.toggle("dr-collapsed", uiHidden);
          void mBox.offsetHeight;
          mBox.style.transition = prevBoxTrans;
        }
        const prevWrapTrans = drWrap.style.transition;
        drWrap.style.transition = "none";
        void drWrap.offsetHeight;
        drWrap.style.transition = prevWrapTrans;

        const r = drWrap.getBoundingClientRect();
        ox = r.left;
        oy = r.top;
        drWrap.style.transition = "none";
      };
      let tick = false;
      const onMove = (e) => {
        if (!dragging) return;
        const p = e.touches ? e.touches[0] : e;
        const dx = p.clientX - sx;
        const dy = p.clientY - sy;
        if (!moved && Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
        moved = true;
        if (e.cancelable) e.preventDefault();
        if (!tick) {
          requestAnimationFrame(() => {
            if (dragging) {
              const c = clampPos(ox + dx, oy + dy);
              drWrap.style.left = c.left + "px";
              drWrap.style.top = c.top + "px";
              drWrap.style.right = "auto";
              drWrap.style.bottom = "auto";
            }
            tick = false;
          });
          tick = true;
        }
      };
      const onUp = () => {
        if (!dragging) return;
        dragging = false;
        if (!moved) {
          drWrap.style.transition = "none";
          drWrap.style.transform = "";
          return;
        }
        drHandle.dataset.dragged = "1";
        setTimeout(() => {
          drHandle.dataset.dragged = "";
        }, 60);
        panelCorner = nearestCorner();
        localStorage.setItem("dr_panel_corner", panelCorner);
        const first = drWrap.getBoundingClientRect();
        drWrap.style.transition = "none";
        positionPanel();
        const last = drWrap.getBoundingClientRect();
        drWrap.style.transform = `translate(${first.left - last.left}px, ${first.top - last.top}px)`;
        void drWrap.offsetWidth;
        drWrap.style.transition =
          "transform var(--DR-motion-page) var(--DR-ease)";
        drWrap.style.transform = "";
        setTimeout(() => {
          drWrap.style.transition = "none";
        }, DR_DRAG_SNAP_MS);
      };
      drHandle.addEventListener("mousedown", onDown);
      drHandle.addEventListener("touchstart", onDown, { passive: false });
      window.addEventListener("mousemove", onMove);
      window.addEventListener("touchmove", onMove, { passive: false });
      window.addEventListener("mouseup", onUp);
      window.addEventListener("touchend", onUp);
    }

    const notifSel = document.getElementById("DR_Notif_Select");
    if (notifSel) {
      const posVal = normalizeNotifPos(savedNotifPos);
      const posLabels = {
        top_left: "Top Left",
        top_center: "Top Center",
        top_right: "Top Right",
        bottom_left: "Bottom Left",
        bottom_center: "Bottom Center",
        bottom_right: "Bottom Right",
      };
      notifSel.setAttribute("data-value", posVal);
      notifSel.querySelector(".DR_Select_Text").innerText = posLabels[posVal];
      notifSel.querySelectorAll(".DR_Select_Option").forEach((opt) => {
        opt.classList.toggle(
          "selected",
          opt.getAttribute("data-value") === posVal,
        );
      });
    }

    const qSel = document.getElementById("DR_EZQuizLength_Select");
    if (qSel) {
      const storedLen = localStorage.getItem("dr_ez_quiz_len") || "default";
      qSel.setAttribute("data-value", storedLen);
      qSel.querySelector(".DR_Select_Text").innerText =
        storedLen === "default" ? "Default" : storedLen;
      qSel.querySelectorAll(".DR_Select_Option").forEach((opt) => {
        opt.classList.toggle(
          "selected",
          opt.getAttribute("data-value") === storedLen,
        );
      });
    }

    document.getElementById("DR_Web_Btn").addEventListener("click", () => {
      window.open("https://duorain.vercel.app", "_blank");
    });

    document.getElementById("DR_Discord_Btn").addEventListener("click", () => {
      window.open("https://discord.gg/yawq7BxJPy", "_blank");
    });

    document.getElementById("DR_GitHub_Btn").addEventListener("click", () => {
      window.open("https://github.com/OracleMythix/DuoRain-BETA", "_blank");
    });

    document
      .getElementById("DR_Credit_Oracle")
      .addEventListener("click", () => {
        window.open("https://github.com/OracleMythix", "_blank");
      });

    document.getElementById("DR_Credit_Gorou").addEventListener("click", () => {
      window.open("https://github.com/oxGorou", "_blank");
    });

    const openTermsBtn = document.getElementById("DR_Open_Terms_Btn");
    if (openTermsBtn) {
      openTermsBtn.addEventListener("click", () => {
        changePage("Terms");
        loadEulaAndTos();
      });
    }

    const lOpts = document.querySelector(
      "#DR_League_Select .DR_Select_Options",
    );
    if (lOpts) {
      lOpts.innerHTML = `<div class="DR_Select_Option" style="cursor:default;opacity:0.5;">Loading rank...</div>`;
    }

    const syncMenuOpen = () => {
      const anyOpen = !!document.querySelector(".DR_Select.open");
      document.querySelectorAll(".DR_Main_Box").forEach((box) => {
        box.classList.toggle("dr-menu-open", anyOpen);
      });
    };

    document.querySelectorAll(".DR_Select_Trigger").forEach((trig) => {
      trig.addEventListener("click", (event) => {
        event.stopPropagation();
        const pSel = trig.parentElement;

        document.querySelectorAll(".DR_Select").forEach((sel) => {
          if (sel !== pSel) sel.classList.remove("open");
        });

        if (!pSel.classList.contains("open")) {
          const opts = pSel.querySelector(".DR_Select_Options");
          const rect = pSel.getBoundingClientRect();
          const box = pSel.closest(".DR_Main_Box");
          const boxRect = box ? box.getBoundingClientRect() : null;
          const bottomLimit = boxRect
            ? Math.min(window.innerHeight, boxRect.bottom)
            : window.innerHeight;
          const topLimit = boxRect ? Math.max(0, boxRect.top) : 0;
          const spaceBelow = bottomLimit - rect.bottom - 20;
          const spaceAbove = rect.top - topLimit - 20;

          const minRequired = 100;

          if (spaceBelow < minRequired && spaceAbove > spaceBelow) {
            pSel.classList.add("dropup");
          } else {
            pSel.classList.remove("dropup");
          }

          const currentVal = pSel.getAttribute("data-value");
          let selOpt = null;
          opts.querySelectorAll(".DR_Select_Option").forEach((opt) => {
            if (opt.getAttribute("data-value") === currentVal) {
              opt.classList.add("selected");
              selOpt = opt;
            } else {
              opt.classList.remove("selected");
            }
          });

          pSel.classList.add("open");

          const listMax = 128;
          opts.scrollTop = selOpt
            ? Math.max(
                0,
                selOpt.offsetTop + selOpt.offsetHeight / 2 - listMax / 2,
              )
            : 0;
        } else {
          pSel.classList.remove("open");
        }
        syncMenuOpen();
      });
    });

    document.addEventListener("click", (event) => {
      const oEl = event.target.closest(".DR_Select_Option");
      if (oEl) {
        event.stopPropagation();
        const pSel = oEl.closest(".DR_Select");
        const sVal = oEl.getAttribute("data-value");

        pSel.querySelector(".DR_Select_Text").innerText = oEl.innerText;
        pSel.setAttribute("data-value", sVal);
        pSel.classList.remove("open");

        pSel
          .querySelectorAll(".DR_Select_Option")
          .forEach((opt) => opt.classList.remove("selected"));
        oEl.classList.add("selected");

        if (pSel.id === "DR_Privacy_Select") {
          setPrivacy(sVal === "private");
        }
        if (pSel.id === "DR_Notif_Select") {
          localStorage.setItem("dr_notif_pos", sVal);
          applyNotifPos(sVal);
        }
        if (pSel.id === "DR_League_Select" && sVal) {
          localStorage.setItem("dr_league_target", sVal);
        }
        if (pSel.id === "DR_EZQuizLength_Select") {
          localStorage.setItem("dr_ez_quiz_len", sVal);
          clearPrefetchedSessionsCache();
          notify("info", "EZ Quiz", "Reloading page to apply the change...");
          setTimeout(() => window.location.reload(), 1200);
        }
        syncMenuOpen();
      } else {
        document.querySelectorAll(".DR_Select").forEach((sel) => {
          sel.classList.remove("open");
        });
        syncMenuOpen();
      }
    });

    const savedMainMode = localStorage.getItem("dr_main_mode") || "native";
    setMainMode(savedMainMode, false);
    const modeToggleBtn = document.getElementById("DR_Mode_Toggle_Btn");
    if (modeToggleBtn) {
      modeToggleBtn.addEventListener("click", () => {
        const nowMode =
          (localStorage.getItem("dr_main_mode") || "native") === "native"
            ? "solver"
            : "native";
        setMainMode(nowMode, true);
      });
    }
    const userRowBtn = document.getElementById("DR_User_Row");
    if (userRowBtn) {
      userRowBtn.addEventListener("click", () => {
        changePage("AccountManager");
        renderAccounts();
        accRefreshAll();
      });
    }

    const drRootEl = document.getElementById("DR_Root");
    if (drRootEl) {
      drRootEl.addEventListener(
        "focus",
        (e) => {
          if (
            e.target &&
            (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
          ) {
            setTimeout(() => {
              e.target.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 150);
          }
        },
        true,
      );
    }

    const termsAccepted = localStorage.getItem("dr_terms_accepted") === "true";

    const declineBtn = document.getElementById("DR_Terms_Decline_Btn");
    if (declineBtn) {
      declineBtn.addEventListener("click", () => {
        const declineMd = `# Access Denied\n\nYou must accept the EULA & Terms of Service to use DuoRain.\n\nAccess to the script's automated tools and account operations is disabled until accepted.`;
        updateTermsPage(
          parseMarkdownToHtml(declineMd),
          "Terms Declined",
          false,
          "READ AGAIN",
          () => {
            loadEulaAndTos();
          },
        );
      });
    }

    if (!termsAccepted) {
      const page1 = document.getElementById("DR_Page_1");
      if (page1) page1.classList.remove("active");

      const termsPage = document.getElementById("DR_Page_Terms");
      if (termsPage) termsPage.classList.add("active");

      pageId = "Terms";
      loadEulaAndTos();
    } else {
      connect().then(() => {
        accRefreshAll();
      });
    }
    initAutoSolverObserver();

    window.DR_checkForUpdates = () => checkForUpdates();
    window.DR_resetUpdateCheck = () => {
      localStorage.removeItem("dr_update_available_version");
      hideUpdateBanner();
    };
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();
