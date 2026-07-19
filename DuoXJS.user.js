// ==UserScript==
// @name                DuoXJS
// @namespace           https://github.com/LibreDuo/DuoXJS
// @version             1.1.0
// @description         Free userscript utility for Duolingo
// @author              LibreDuo
// @license             MIT
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
// @downloadURL         https://raw.githubusercontent.com/LibreDuo/DuoXJS/main/DuoXJS.user.js
// @updateURL           https://raw.githubusercontent.com/LibreDuo/DuoXJS/main/DuoXJS.meta.js
// ==/UserScript==

(function () {
  "use strict";

  if (
    window.location.href.includes("/legendary/") &&
    !window.location.href.includes("reloaded")
  ) {
    window.location.href =
      window.location.href +
      (window.location.href.includes("?") ? "&" : "?") +
      "reloaded";
    return;
  }

  const localSetItem = window.localStorage.setItem;
  const localStorage = {
    getItem: (key) => window.localStorage.getItem(key),
    setItem: (key, value) => {
      localSetItem.call(window.localStorage, key, value);
      if (
        key.startsWith("dx_") &&
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
          if (key && key.startsWith("dx_")) {
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
      '<svg class="DX_Chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>',
    hideBtn:
      '<svg id="hide-icon" width="23" height="16" viewBox="0 0 23 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg"><path d="M17.7266 14.9922L4.1875 1.47656C3.9375 1.22656 3.9375 0.796875 4.1875 0.546875C4.44531 0.289062 4.875 0.289062 5.125 0.546875L18.6562 14.0625C18.9141 14.3203 18.9219 14.7188 18.6562 14.9922C18.3984 15.2578 17.9844 15.25 17.7266 14.9922ZM18.4609 12.4062L15.3281 9.25781C15.5 8.82812 15.5938 8.35938 15.5938 7.875C15.5938 5.57812 13.7266 3.74219 11.4375 3.74219C10.9922 3.74219 10.4922 3.83594 10.0547 3.99219L7.75 1.67969C8.875 1.3125 10.1016 1.09375 11.4297 1.09375C17.8984 1.09375 22.1172 6.28906 22.1172 7.875C22.1172 8.78125 20.7344 10.8438 18.4609 12.4062ZM11.4297 14.6562C5.05469 14.6562 0.75 9.45312 0.75 7.875C0.75 6.96094 2.16406 4.85938 4.54688 3.27344L7.59375 6.32812C7.39062 6.79688 7.27344 7.32812 7.27344 7.875C7.28125 10.1172 9.13281 12.0078 11.4375 12.0078C11.9766 12.0078 12.4922 11.8906 12.9609 11.6875L15.2812 14.0078C14.125 14.4141 12.8281 14.6562 11.4297 14.6562ZM13.9609 7.71094C13.9609 7.77344 13.9609 7.82812 13.9531 7.88281L11.3203 5.25781C11.375 5.25 11.4375 5.25 11.4922 5.25C12.8594 5.25 13.9609 6.35156 13.9609 7.71094ZM8.88281 7.82031C8.88281 7.75781 8.88281 7.6875 8.89062 7.625L11.5391 10.2734C11.4766 10.2812 11.4219 10.2891 11.3594 10.2891C10 10.2891 8.88281 9.17969 8.88281 7.82031Z"></path></svg>',
    showBtn:
      '<svg id="show-icon" width="22" height="14" viewBox="0 0 22 14" xmlns="http://www.w3.org/2000/svg"><path d="M11.2734 13.6406C4.89844 13.6406 0.59375 8.4375 0.59375 6.85156C0.59375 5.27344 4.90625 0.078125 11.2734 0.078125C17.75 0.078125 21.9688 5.27344 21.9688 6.85156C21.9688 8.4375 17.75 13.6406 11.2734 13.6406ZM11.2812 11.0078C13.5781 11.0078 15.4375 9.14844 15.4375 6.85938C15.4375 4.5625 13.5781 2.70312 11.2812 2.70312C8.98438 2.70312 7.125 4.5625 7.125 6.85938C7.125 9.14844 8.98438 11.0078 11.2812 11.0078ZM11.2812 8.49219C10.375 8.49219 9.64844 7.76562 9.64844 6.85938C9.64844 5.95312 10.375 5.22656 11.2812 5.22656C12.1875 5.22656 12.9141 5.95312 12.9141 6.85938C12.9141 7.76562 12.1875 8.49219 11.2812 8.49219Z"></path></svg>',
    discordBtn:
      '<svg width="20" height="15" viewBox="0 0 22 16" fill="#FFF"><path d="M18.289 1.34C16.9296.714 15.4761.259 13.9565 0c-.1866.332-.4046.779-.5549 1.134-1.6154-.239-3.2159-.239-4.8016 0C8.4497.779 8.2267.332 8.0384 0 6.5172.259 5.062.716 3.7027 1.343.9608 5.421.2175 9.398.5892 13.318c1.8185 1.337 3.5809 2.149 5.3136 2.68.4278-.579.8093-1.195 1.138-1.845-.6259-.234-1.2255-.523-1.7921-.858.1503-.11.2973-.225.4393-.307 3.4554 1.591 7.2098 1.591 10.624 0 .1437.118.2907.233.4393.342-.6262.337-1.2274.626-1.8534.86.3287.648.7086 1.265 1.138 1.845 1.7343-.531 3.4983-1.343 5.3168-2.681.4361-4.545-.7449-8.484-3.121-11.978ZM7.5115 10.908c-1.0373 0-1.8879-.954-1.8879-2.114 0-1.161.8325-2.115 1.8879-2.115 1.0555 0 1.9061.954 1.8879 2.115.0016 1.16-.8325 2.114-1.8879 2.114Zm6.9769 0c-1.0373 0-1.8879-.954-1.8879-2.114 0-1.161.8324-2.115 1.8879-2.115 1.0554 0 1.9061.954 1.8879 2.115 0 1.16-.8325 2.114-1.8879 2.114Z"/></svg>',
    githubBtn:
      '<svg width="20" height="20" viewBox="0 0 22 22" fill="#FFF"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.009.5C5.198.5.5 5.313.5 11.266c0 4.759 3.01 8.788 7.186 10.214.522.107.713-.232.713-.517 0-.25-.017-1.105-.017-1.997-2.923.642-3.532-1.283-3.532-1.283-.47-1.248-1.166-1.568-1.166-1.568-.957-.659.07-.659.07-.659 1.062.071 1.619 1.105 1.619 1.105.94 1.64 2.453 1.176 3.062.891.087-.695.366-1.176.661-1.444-2.332-.25-4.785-1.176-4.785-5.312 0-1.176.418-2.139 1.08-2.887-.106-.267-.461-1.373.105-2.852 0 0 .888-.285 2.899 1.09a9.847 9.847 0 0 1 2.636-.356c.888 0 1.793.125 2.628.356 2.01-1.375 2.898-1.09 2.898-1.09.566 1.479.21 2.585.105 2.852.662.748 1.08 1.711 1.08 2.887 0 4.136-2.453 5.045-4.803 5.312.383.338.714.98.714 2.004 0 1.444-.018 2.606-.018 2.963 0 .285.192.624.714.48C18.49 20.054 21.5 16.025 21.5 11.266 21.517 5.313 16.802.5 11.009.5Z"/></svg>',
    webBtn:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
    modeNative:
      '<img src="https://d35aaqx5ub95lt.cloudfront.net/vendor/0cecd302cf0bcd0f73d51768feff75fe.svg" style="width: 20px; height: 20px; object-fit: contain; flex-shrink: 0;">',
    modeSolver:
      '<img src="https://d35aaqx5ub95lt.cloudfront.net/images/goals/39f13d2de304cad2ac2f88b31a7e2ff4.svg" style="width: 20px; height: 20px; object-fit: contain; flex-shrink: 0;">',
    settingsBtn:
      '<svg width="20" height="21" viewBox="147 69 20 21" fill="none" style="width: 20px; height: 20px; object-fit: contain; flex-shrink: 0;" xmlns="http://www.w3.org/2000/svg"><path d="M166.69 81.09v-2.68l-2.21-.3a7.69 7.69 0 0 0-1-2.62l1.27-1.68-1.89-1.89-1.58 1.2a7.71 7.71 0 0 0-2.77-1.22l-.23-1.9h-2.68l-.26 1.85a7.71 7.71 0 0 0-2.86 1.2L151 71.91l-1.9 1.89 1.18 1.56a7.69 7.69 0 0 0-1.06 2.77l-2 .28v2.68l2.16.3a7.71 7.71 0 0 0 1.13 2.48l-1.41 1.83 1.9 1.89 1.93-1.46a7.69 7.69 0 0 0 2.34.91l.34 2.46h2.68l.35-2.5a7.69 7.69 0 0 0 2.26-.93l2 1.52 1.89-1.89-1.47-1.95a7.71 7.71 0 0 0 1-2.34l2.37-.32zm-9.84 1.78a3.42 3.42 0 1 1 .01 0h-.01z" fill="currentColor" fill-rule="nonzero"/></svg>',
    arrowRight:
      '<svg width="8" height="13" viewBox="0 0 8 13" fill="none" style="flex-shrink: 0;"><path d="M1 1l6 5.5L1 12" stroke="rgb(var(--DX-blue))" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    back: '<svg width="8" height="14" viewBox="0 0 9 16" fill="none"><path d="M8 1L2 8l6 7" stroke="var(--dx-text)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
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

  const dxVersion = "1.1.0";
  const dxScriptVersion = "1.1.0";
  const dxUpdateMetaUrl =
    "https://raw.githubusercontent.com/LibreDuo/DuoXJS/main/DuoXJS.meta.js";
  const dxUpdatePageUrl = "https://github.com/LibreDuo/DuoXJS";

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
    let ua = localStorage.getItem("dx_user_agent");
    if (!ua) {
      ua = userAgents[Math.floor(Math.random() * userAgents.length)];
      localStorage.setItem("dx_user_agent", ua);
    }
    return ua;
  }
  const dxUserAgent = pickUserAgent();

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

  const yearInReviewIcons = {
    top1: "https://raw.githubusercontent.com/LibreDuo/DuoXJS/refs/heads/main/assets/top_1.svg",
    top3: "https://raw.githubusercontent.com/LibreDuo/DuoXJS/refs/heads/main/assets/top_3.svg",
    top5: "https://raw.githubusercontent.com/LibreDuo/DuoXJS/refs/heads/main/assets/top_5.svg",
    everyone:
      "https://raw.githubusercontent.com/LibreDuo/DuoXJS/refs/heads/main/assets/everyone.svg",
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
      cat: "2023 Events (iOS-only)",
      icon: yearInReviewIcons.top1,
    },
    {
      name: "2023 Top 3",
      emoji: "⭐",
      value: "YEAR_IN_REVIEW,2023_top3",
      cat: "2023 Events (iOS-only)",
      icon: yearInReviewIcons.top3,
    },
    {
      name: "2023 Top 5",
      emoji: "🌟",
      value: "YEAR_IN_REVIEW,2023_top5",
      cat: "2023 Events (iOS-only)",
      icon: yearInReviewIcons.top5,
    },
    {
      name: "2023 Everyone",
      emoji: "🎊",
      value: "YEAR_IN_REVIEW,2023",
      cat: "2023 Events (iOS-only)",
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
            --DX-blue: 0, 122, 255;
            --DX-green: 52, 199, 89;
            --DX-red: 255, 59, 48;
            --DX-orange: 255, 149, 0;
            --dx-link-color: rgb(var(--DX-blue));

            --DX-s1: 4px;
            --DX-s2: 8px;
            --DX-s3: 12px;
            --DX-s4: 16px;

            --DX-ctrl: 40px;
            --DX-ctrl-lg: 48px;

            --DX-r-s: 8px;
            --DX-r-m: 12px;
            --DX-r-l: 16px;
            --DX-r-xl: 22px;
            --DX-corner: 0;

            --DX-ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
            --DX-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
            --DX-ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
            --DX-ease: var(--DX-ease-spring);
            --DX-motion-fast: 150ms;
            --DX-motion: 200ms;
            --DX-motion-page: 400ms;
            --DX-motion-spin: 1200ms;

            --DX-t-title: 22px;
            --DX-t-lead: 16px;
            --DX-t-body: 15px;
            --DX-t-label: 13px;
            --DX-t-cap: 11px;
        }

        @supports (corner-shape: superellipse(1.4)) {
            :root { --DX-corner: superellipse(1.4); }
        }

        .DX_Btn,
        .DX_Input_Wrap,
        .DX_Hash_Btn,
        .DX_Select,
        .DX_Select_Options,
        .DX_Set_Input_Wrap,
        .DX_Search,
        .DX_Panel_Card,
        .DX_Shop_Card,
        .DX_Quest_Item,
        .DX_Shop_Btn,
        .DX_Quest_Get_Btn,
        .DX_Profile_Block,
        .DX_Modal_Box {
            corner-shape: var(--DX-corner);
        }

        .DX_Wordmark {
            display: inline-flex;
            align-items: baseline;
            font-family: 'DuoFeather', 'din-round';
            font-size: var(--DX-t-title);
            font-weight: 900;
            letter-spacing: -0.03em;
            line-height: 1;
        }

        .DX_Wordmark .dx-xjs {
            background: linear-gradient(
                135deg,
                #F7DF1E 0%,
                #FF8000 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            display: inline-block;
        }


        #DX_Root {
            user-select: none;
            -webkit-user-select: none;
        }

        #DX_Root * {
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }

        .DX_Selectable {
            user-select: text !important;
            -webkit-user-select: text !important;
            cursor: text;
        }

        #DX_Root p,
        #DX_Root span,
        #DX_Root button,
        #DX_Root input,
        #DX_Root label,
        #DX_Root div {
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "din-round", "DuoFeather", system-ui, sans-serif !important;
        }

        #DX_Root p,
        #DX_Root span {
            margin: 0;
            padding: 0;
        }

        #DX_Root svg {
            flex-shrink: 0;
        }

        .DX_Main {
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
            transition: gap var(--DX-motion-page) var(--DX-ease);
        }

        .DX_Main > * {
            pointer-events: auto;
        }

        .DX_Main.dx-panel-hidden {
            gap: 0;
            width: max-content;
            height: auto;
        }

        .DX_Main.dx-panel-hidden .DX_Main_Box {
            pointer-events: none !important;
        }

        .DX_Main_Box {
            display: flex;
            width: 325px;
            padding: 16px;
            box-sizing: border-box;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 8px;
            overflow: hidden;
            border-radius: var(--DX-r-xl);
            corner-shape: var(--DX-corner);
            position: relative;
            transform-origin: var(--DX-panel-origin, center);
            -webkit-transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
            transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
            -webkit-transition: opacity var(--DX-motion) var(--DX-ease),
                                -webkit-filter var(--DX-motion) var(--DX-ease),
                                filter var(--DX-motion) var(--DX-ease),
                                -webkit-transform var(--DX-motion-page) var(--DX-ease),
                                transform var(--DX-motion-page) var(--DX-ease),
                                max-height var(--DX-motion-page) var(--DX-ease),
                                max-width var(--DX-motion-page) var(--DX-ease),
                                padding var(--DX-motion-page) var(--DX-ease);
            transition: opacity var(--DX-motion) var(--DX-ease),
                        filter var(--DX-motion) var(--DX-ease),
                        transform var(--DX-motion-page) var(--DX-ease),
                        max-height var(--DX-motion-page) var(--DX-ease),
                        max-width var(--DX-motion-page) var(--DX-ease),
                        padding var(--DX-motion-page) var(--DX-ease);
            will-change: opacity, filter, transform, max-height, max-width, padding;
        }

        .DX_Main_Box.dx-hidden {
            opacity: 0 !important;
            -webkit-filter: blur(16px) !important;
            filter: blur(16px) !important;
            -webkit-transform: scale3d(0.92, 0.92, 1) !important;
            transform: scale3d(0.92, 0.92, 1) !important;
            pointer-events: none;
        }

        .DX_Main_Box.dx-collapsed {
            max-height: 0 !important;
            max-width: 0 !important;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            overflow: hidden;
            visibility: hidden;
        }

        .DX_Main_Box.dx-scroll {
            overflow-y: auto;
            overflow-x: hidden;
            justify-content: flex-start;
        }

        .DX_Main_Box.dx-scroll::-webkit-scrollbar {
            width: 4px;
        }

        .DX_Main_Box.dx-scroll::-webkit-scrollbar-track {
            background: transparent;
        }

        .DX_Main_Box.dx-scroll::-webkit-scrollbar-thumb {
            background: rgba(var(--DX-blue), 0.4);
            border-radius: 4px;
        }

        .DX_Main_Box.dx-menu-open {
            overflow: visible;
        }

        .DX_Main_Box.dx-scroll.dx-menu-open {
            overflow-x: hidden;
            overflow-y: auto;
        }

        .DX_Main_Box.dx-light {
            --dx-panel-bg: rgba(255, 255, 255, 0.65);
            background: var(--dx-panel-bg);
            backdrop-filter: blur(30px) saturate(190%);
            -webkit-backdrop-filter: blur(30px) saturate(190%);
            outline: 1px solid rgba(255, 255, 255, 0.4);
            outline-offset: -1px;
            box-shadow: 0 16px 40px -10px rgba(17, 32, 46, 0.15), 0 1px 3px rgba(17, 32, 46, 0.05);
            --dx-bg: rgba(255, 255, 255, 0.95);
            --dx-text: #1d1d1f;
            --dx-card-bg: rgba(0, 0, 0, 0.04);
            --dx-card-hover: rgba(var(--DX-blue), 0.08);
            --dx-card-border: rgba(0, 0, 0, 0.08);
        }

        .DX_Main_Box.dx-dark {
            --dx-panel-bg: rgba(28, 28, 30, 0.65);
            background: var(--dx-panel-bg);
            backdrop-filter: blur(30px) saturate(190%);
            -webkit-backdrop-filter: blur(30px) saturate(190%);
            outline: 1px solid rgba(255, 255, 255, 0.12);
            outline-offset: -1px;
            box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.35), 0 1px 3px rgba(0, 0, 0, 0.1);
            --dx-bg: rgba(28, 28, 30, 0.95);
            --dx-text: #f5f5f7;
            --dx-card-bg: rgba(255, 255, 255, 0.05);
            --dx-card-hover: rgba(var(--DX-blue), 0.12);
            --dx-card-border: rgba(255, 255, 255, 0.12);
            --dx-link-color: #007aff;
        }

        #duoxjs-hide-button.dx-light {
            --dx-text: #333;
            --dx-panel-bg: rgba(255, 255, 255, 0.85);
            --dx-card-border: rgba(229, 229, 229, 1);
            --dx-panel-shadow: 0 12px 32px -14px rgba(17, 32, 46, 0.28), 0 2px 8px rgba(17, 32, 46, 0.06);
        }

        #duoxjs-hide-button.dx-dark {
            --dx-text: #fff;
            --dx-panel-bg: rgba(32, 47, 54, 0.85);
            --dx-card-border: rgba(55, 70, 79, 1);
            --dx-panel-shadow: 0 14px 36px -14px rgba(0, 0, 0, 0.55), 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .DX_HStack_Auto {
            display: flex;
            align-items: center;
            justify-content: space-between;
            align-self: stretch;
            gap: 8px;
            min-width: 0;
        }

        .DX_HStack_8 {
            display: flex;
            align-items: center;
            gap: 8px;
            align-self: stretch;
            min-width: 0;
        }

        .DX_HStack_4 {
            display: flex;
            align-items: center;
            gap: 4px;
            align-self: stretch;
            min-width: 0;
        }

        .DX_VStack_8 {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 8px;
            align-self: stretch;
        }

        .DX_VStack_4 {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 4px;
            align-self: stretch;
        }

        .DX_NoSel {
            user-select: none;
            -webkit-user-select: none;
        }

        .DX_Divider {
            align-self: stretch;
            height: 1px;
            background: rgba(117, 117, 117, 0.2);
            flex-shrink: 0;
        }

        .DX_T1 {
            font-size: 14px;
            font-weight: 700;
            line-height: 1.22;
            color: var(--dx-text);
            margin: 0;
            min-width: 0;
            letter-spacing: -0.015em;
        }

        .DX_T1:has(+ .DX_T2) {
            font-weight: 800;
        }

        .DX_T2 {
            font-size: 13px;
            font-weight: 600;
            line-height: 1.25;
            color: var(--dx-text);
            opacity: 0.6;
            margin: 0;
            min-width: 0;
            letter-spacing: -0.005em;
        }

        .DX_Btn {
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
            outline: 1px solid rgba(0, 0, 0, 0.08);
            outline-offset: -1px;
            transition: filter 100ms var(--DX-ease-spring),
                        transform 100ms var(--DX-ease-spring),
                        background var(--DX-motion) var(--DX-ease-spring),
                        outline var(--DX-motion) var(--DX-ease-spring),
                        color var(--DX-motion) var(--DX-ease-spring);
        }

        .DX_Btn:focus-visible {
            outline-color: var(--focus-outline, rgba(var(--DX-blue), 0.5)) !important;
        }

        .DX_Btn:hover {
            filter: brightness(0.98);
            transform: scale(1.02);
        }

        .DX_Btn:active {
            filter: brightness(0.94) saturate(1.1);
            transform: scale(0.97);
        }

        .DX_Btn_Blue_Ghost,
        .DX_Btn_Eel {
            outline: 1px solid var(--dx-card-border);
            outline-offset: -1px;
            background: var(--dx-card-bg);
        }

        .DX_Btn_Blue_Ghost .DX_Nav_Title {
            color: var(--dx-text);
        }

        .DX_Btn_Blue_Ghost .DX_Nav_Btn_L > svg,
        .DX_Btn_Blue_Ghost .DX_Nav_Btn_L > svg [stroke],
        .DX_Btn_Blue_Ghost > svg path {
            stroke: var(--dx-text);
        }

        .DX_Btn_Icon {
            flex: none !important;
            width: 40px;
            padding: 10px !important;
            justify-content: center;
        }

        .DX_Nav_Btn {
            align-self: stretch;
            justify-content: space-between;
            height: 40px;
            padding: 10px 12px 10px 10px;
        }

        .DX_Nav_Btn_L {
            display: flex;
            align-items: center;
            gap: 8px;
            flex: 1 1 auto;
            min-width: 0;
        }

        .DX_Nav_Btn_L > svg:first-child,
        .DX_Nav_Btn_L > img:first-child {
            width: 20px !important;
            height: 20px !important;
            flex-shrink: 0;
            object-fit: contain;
        }

        .DX_Nav_Title {
            color: rgb(var(--DX-blue));
            font-size: 14px;
            font-weight: 800;
            line-height: 1.18;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .DX_Input_Wrap {
            display: flex;
            height: 44px;
            padding: 12px 14px;
            box-sizing: border-box;
            align-items: center;
            flex: 1 0 0px;
            min-width: 0;
            gap: 6px;
            border-radius: var(--DX-r-s);
            outline: 1px solid var(--dx-card-border);
            outline-offset: -1px;
            background: var(--dx-card-bg);
            position: relative;
            overflow: hidden;
            transition: flex var(--DX-motion-page) var(--DX-ease),
                        padding var(--DX-motion-page) var(--DX-ease),
                        margin var(--DX-motion-page) var(--DX-ease),
                        opacity var(--DX-motion) var(--DX-ease),
                        outline-width var(--DX-motion-page) var(--DX-ease),
                        outline-color var(--DX-motion) var(--DX-ease),
                        background var(--DX-motion) var(--DX-ease);
        }

        .DX_Input_Wrap:focus-within {
            outline-color: rgba(var(--DX-blue), 0.35);
        }

        .DX_Input_Wrap.dx-inf-hidden {
            flex: 0 0 0px;
            padding-left: 0;
            padding-right: 0;
            opacity: 0;
            outline-width: 0px;
            pointer-events: none;
            margin-right: -8px;
        }

        .DX_Hash_Btn {
            --focus-outline: var(--dx-card-border);
            background: var(--dx-card-bg);
            border: none;
            border-radius: var(--DX-r-s);
            color: var(--dx-text);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            height: 44px;
            flex: 0 0 44px;
            cursor: pointer;
            overflow: hidden;
            outline: 1px solid var(--dx-card-border);
            outline-offset: -1px;
            transition: filter var(--DX-motion-fast) var(--DX-ease),
                        transform var(--DX-motion-fast) var(--DX-ease),
                        background var(--DX-motion) var(--DX-ease),
                        outline-color var(--DX-motion) var(--DX-ease),
                        box-shadow var(--DX-motion) var(--DX-ease),
                        flex var(--DX-motion-page) var(--DX-ease);
        }

        .DX_Hash_Btn svg {
            display: block;
            width: 22px;
            height: 22px;
        }

        .DX_Hash_Btn:hover {
            filter: brightness(0.98);
            transform: scale(1.02);
        }

        .DX_Hash_Btn:active {
            filter: brightness(0.98);
            transform: scale(0.97);
        }

        .DX_Hash_Btn.dx-inf-active {
            flex: 1 0 44px;
        }

        #DX_Root .DX_Hash_Btn:focus,
        #DX_Root .DX_Hash_Btn:focus-visible,
        #DX_Root .DX_Hash_Btn:active {
            outline: 1px solid var(--dx-card-border) !important;
            outline-offset: -1px !important;
            box-shadow: none !important;
        }

        .DX_Hash_Lbl {
            font-weight: 800;
            font-size: 13px;
            white-space: nowrap;
        }

        .DX_Input {
            border: none !important;
            outline: none !important;
            background: none !important;
            text-align: right;
            font-size: 14px !important;
            font-weight: 600 !important;
            color: var(--dx-text) !important;
            font-family: inherit !important;
            width: 100%;
            -webkit-appearance: none;
            appearance: none;
            -moz-appearance: textfield;
        }

        .DX_Input::placeholder {
            color: var(--dx-text) !important;
            opacity: 0.5;
        }

        .DX_Input::-webkit-outer-spin-button,
        .DX_Input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        .DX_Input_Btn {
            display: flex;
            height: 44px;
            width: 66px;
            padding: 12px 10px;
            box-sizing: border-box;
            justify-content: center;
            align-items: center;
            border-radius: var(--DX-r-s);
            corner-shape: var(--DX-corner);
            border: none;
            cursor: pointer;
            user-select: none;
            outline: 1px solid rgba(0, 0, 0, 0.2);
            outline-offset: -1px;
            background: rgb(var(--DX-blue));
            white-space: nowrap;
            flex-shrink: 0;
            transition: background var(--DX-motion) var(--DX-ease),
                        outline var(--DX-motion) var(--DX-ease),
                        filter var(--DX-motion-fast) var(--DX-ease),
                        transform var(--DX-motion-fast) var(--DX-ease);
        }

        .DX_Input_Btn:focus-visible {
            outline-color: var(--focus-outline, rgba(0, 0, 0, 0.2)) !important;
        }

        .DX_Input_Btn:hover {
            filter: brightness(0.98);
            transform: scale(1.02);
        }

        .DX_Input_Btn:active {
            filter: brightness(0.98);
            transform: scale(0.97);
        }

        .DX_Btn:disabled,
        .DX_Sm_Btn:disabled,
        .DX_Acc_Btn:disabled,
        .DX_Quest_Get_Btn:disabled,
        .DX_Shop_Btn:disabled,
        .DX_Hash_Btn:disabled,
        .DX_Input_Btn:disabled {
            opacity: 0.38 !important;
            pointer-events: none !important;
            transform: scale(1) !important;
            filter: none !important;
        }

        .DX_Btn_Label {
            font-size: 14px;
            font-weight: 800;
            line-height: 1.1;
            letter-spacing: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            transition: opacity var(--DX-motion) var(--DX-ease),
                        filter var(--DX-motion) var(--DX-ease),
                        color var(--DX-motion) var(--DX-ease);
        }

        .DX_Sm_Btn {
            display: flex;
            height: var(--DX-ctrl);
            padding: 10px 12px;
            min-width: 66px;
            justify-content: center;
            align-items: center;
            border-radius: var(--DX-r-s);
            corner-shape: var(--DX-corner);
            border: none;
            cursor: pointer;
            user-select: none;
            flex-shrink: 0;
            outline: 1px solid rgba(0, 0, 0, 0.2);
            outline-offset: -1px;
            background: rgb(var(--DX-blue));
            white-space: nowrap;
            transition: background var(--DX-motion) var(--DX-ease),
                        outline var(--DX-motion) var(--DX-ease),
                        filter var(--DX-motion-fast) var(--DX-ease),
                        transform var(--DX-motion-fast) var(--DX-ease);
        }

        .DX_Sm_Btn:focus-visible {
            outline-color: var(--focus-outline, rgba(var(--DX-blue), 0.5)) !important;
        }

        .DX_Sm_Btn:hover {
            filter: brightness(0.98);
            transform: scale(1.02);
        }

        .DX_Sm_Btn:active {
            filter: brightness(0.98);
            transform: scale(0.97);
        }


        .DX_Sm_Btn_Label {
            font-size: 14px;
            font-weight: 800;
            line-height: 1.1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            transition: opacity var(--DX-motion) var(--DX-ease),
                        filter var(--DX-motion) var(--DX-ease),
                        color var(--DX-motion) var(--DX-ease);
        }

        .DX_Toggle {
            position: relative;
            width: 52px;
            height: 28px;
            border-radius: 8px;
            corner-shape: var(--DX-corner);
            background: var(--dx-card-border);
            cursor: pointer;
            user-select: none;
            flex-shrink: 0;
            transition: background 200ms var(--DX-ease-spring);
        }

        .DX_Toggle.on {
            background: rgb(var(--DX-blue));
        }

        .DX_Toggle_Knob {
            position: absolute;
            top: 3px;
            left: 3px;
            width: 22px;
            height: 22px;
            border-radius: 6px;
            corner-shape: var(--DX-corner);
            background: #fff;
            box-shadow: 0 1px 3px rgba(0, 0, 0, .15);
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
            transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1), width 250ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .DX_Toggle.on .DX_Toggle_Knob {
            -webkit-transform: translate3d(24px, 0, 0);
            transform: translate3d(24px, 0, 0);
        }

        .DX_Toggle:active .DX_Toggle_Knob {
            width: 27px;
        }

        .DX_Toggle.on:active .DX_Toggle_Knob {
            transform: translate3d(19px, 0, 0);
        }

        .DX_Select {
            position: relative;
            width: 100%;
            min-width: 0;
            height: 40px;
            border-radius: 8px;
            background: var(--dx-card-bg);
            outline: 1px solid var(--dx-card-border);
            outline-offset: -1px;
            color: var(--dx-text);
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
            user-select: none;
            transition: outline-color var(--DX-motion) var(--DX-ease),
                        background var(--DX-motion) var(--DX-ease);
        }

        .DX_Select:hover {
            outline-color: rgba(var(--DX-blue), 0.35);
        }

        .DX_Select.open {
            outline-color: rgba(var(--DX-blue), 0.35);
        }

        .DX_Select_Trigger {
            height: 100%;
            padding: 0 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 6px;
            min-width: 0;
        }

        .DX_Select_Text {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .DX_Select_Options {
            position: absolute;
            top: calc(100% + 8px);
            left: 0;
            right: 0;
            background: var(--dx-panel-bg);
            backdrop-filter: blur(20px) saturate(190%);
            -webkit-backdrop-filter: blur(20px) saturate(190%);
            outline: 1px solid var(--dx-card-border);
            outline-offset: -1px;
            border-radius: 8px;
            corner-shape: var(--DX-corner);
            box-shadow: 0 10px 40px rgba(0, 0, 0, .2);
            max-height: 0;
            overflow-y: auto;
            opacity: 0;
            visibility: hidden;
            -webkit-transform: translate3d(0, -8px, 0);
            transform: translate3d(0, -8px, 0);
            -webkit-transition: max-height var(--DX-motion) var(--DX-ease),
                                opacity var(--DX-motion) var(--DX-ease),
                                visibility var(--DX-motion) var(--DX-ease),
                                -webkit-transform var(--DX-motion) var(--DX-ease),
                                transform var(--DX-motion) var(--DX-ease);
            transition: max-height var(--DX-motion) var(--DX-ease),
                        opacity var(--DX-motion) var(--DX-ease),
                        visibility var(--DX-motion) var(--DX-ease),
                        transform var(--DX-motion) var(--DX-ease);
            z-index: 100;
        }

        .DX_Select.open .DX_Select_Options {
            max-height: 128px;
            opacity: 1;
            visibility: visible;
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
        }

        .DX_Select_Option {
            padding: 0 12px;
            min-height: 40px;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            color: var(--dx-text);
            font-size: 13px;
            font-weight: 700;
            transition: background var(--DX-motion-fast) var(--DX-ease),
                        color var(--DX-motion-fast) var(--DX-ease);
        }

        .DX_Select_Option:hover {
            background: var(--dx-card-hover);
            color: var(--dx-text);
        }

        .DX_Select_Option.selected {
            background: rgba(var(--DX-blue), 0.12);
            color: var(--dx-link-color);
        }

        .DX_Select.dropup .DX_Select_Options {
            top: auto;
            bottom: calc(100% + 8px);
            -webkit-transform: translate3d(0, 8px, 0);
            transform: translate3d(0, 8px, 0);
        }

        .DX_Select.dropup.open .DX_Select_Options {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
        }

        .DX_Select .DX_Chevron {
            -webkit-transform: rotate3d(0, 0, 1, 0deg);
            transform: rotate3d(0, 0, 1, 0deg);
            -webkit-transition: -webkit-transform var(--DX-motion) var(--DX-ease);
            transition: transform var(--DX-motion) var(--DX-ease);
            width: 16px;
            height: 16px;
            stroke: var(--dx-text);
        }

        .DX_Select.open .DX_Chevron {
            -webkit-transform: rotate3d(0, 0, 1, 180deg);
            transform: rotate3d(0, 0, 1, 180deg);
        }

        .DX_Select_Options::-webkit-scrollbar {
            width: 4px;
        }

        .DX_Select_Options::-webkit-scrollbar-track {
            margin: 8px 0;
            border-radius: 12px;
        }

        .DX_Select_Options::-webkit-scrollbar-thumb {
            background: rgba(var(--DX-blue), 0.4);
            border-radius: 4px;
        }

        .DX_Farm_Sec {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            align-self: stretch;
        }

        .DX_Farm_Sec > .DX_HStack_8 {
            margin-top: 8px;
        }

        .DX_Farm_Sec > .DX_Prog_Wrap.on {
            margin-top: 8px;
        }

        .DX_Task_Group {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            align-self: stretch;
        }

        .DX_Task_Group > .DX_Prog_Wrap.on {
            margin-top: 8px;
        }

        .DX_Prog_Wrap {
            align-self: stretch;
            height: 0;
            border-radius: 3px;
            background: rgba(var(--DX-blue), 0.1);
            overflow: hidden;
            opacity: 0;
            visibility: hidden;
            transition: height var(--DX-motion-page) var(--DX-ease),
                        opacity var(--DX-motion-page) var(--DX-ease),
                        visibility var(--DX-motion-page) var(--DX-ease);
        }

        .DX_Prog_Wrap.on {
            height: 4px;
            opacity: 1;
            visibility: visible;
        }

        .DX_Prog_Fill {
            height: 100%;
            border-radius: 3px;
            background: rgb(var(--DX-blue));
            width: 0%;
            transition: width var(--DX-motion-page) var(--DX-ease),
                        background var(--DX-motion) var(--DX-ease),
                        box-shadow var(--DX-motion) var(--DX-ease);
            box-shadow: 0 0 6px rgba(var(--DX-blue), 0.35);
        }

        .DX_Prog_Fill.done {
            background: rgb(var(--DX-green)) !important;
            box-shadow: 0 0 8px rgba(var(--DX-green), 0.45) !important;
        }

        .DX_Avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(var(--DX-blue), 0.1);
            color: var(--dx-text);
            overflow: hidden;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .DX_Stat_Ico {
            width: 15px;
            height: 15px;
            display: block;
            flex-shrink: 0;
        }

        .DX_Stat_Val {
            font-size: 13px !important;
            font-weight: 700 !important;
            color: var(--dx-text) !important;
            opacity: 0.8;
        }

        .DX_Page {
            display: none;
            width: 100%;
        }

        .DX_Page.active {
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-self: stretch;
            align-items: center;
        }

        .DX_Notif_Main {
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

        .DX_Notif_Box {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 20px;
            border-radius: 16px;
            corner-shape: var(--DX-corner);
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            outline: 1px solid rgba(229, 229, 229, 1);
            outline-offset: -1px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            opacity: 0;
            transform: translate3d(0, -40px, 0) scale(0.85);
            transition: transform var(--DX-motion-page) var(--DX-ease),
                        opacity var(--DX-motion) var(--DX-ease),
                        margin var(--DX-motion-page) var(--DX-ease);
            pointer-events: auto;
            width: 100%;
            min-width: 0;
        }

        .DX_Notif_Title {
            font-size: 14px;
            font-weight: 800;
            line-height: 1.2;
            color: var(--dx-text);
            margin: 0;
            overflow-wrap: anywhere;
        }

        .DX_Notif_Body {
            font-size: 12px;
            font-weight: 600;
            line-height: 1.3;
            color: var(--dx-text);
            opacity: 0.7;
            margin: 2px 0 0 0;
            overflow-wrap: anywhere;
        }

        .DX_Notif_Box > div:last-child {
            min-width: 0;
            flex: 1 0 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .DX_Notif_Main.dx-light {
            --dx-text: #333;
        }

        .DX_Notif_Main.dx-dark {
            --dx-text: #fff;
        }

        .DX_Notif_Main.dx-dark .DX_Notif_Box {
            background: rgba(32, 47, 54, 0.85);
            outline-color: rgba(55, 70, 79, 1);
        }

        .DX_Notif_Box.show {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1) !important;
        }

        .DX_Notif_Box.hide {
            opacity: 0 !important;
            transform: translate3d(0, -40px, 0) scale(0.85) !important;
            margin-top: -60px;
            z-index: -1;
        }

        .DX_Notif_Main[data-pos="bottom_center"] .DX_Notif_Box {
            transform: translate3d(0, 40px, 0) scale(0.85);
        }

        .DX_Notif_Main[data-pos="bottom_center"] .DX_Notif_Box.hide {
            transform: translate3d(0, 40px, 0) scale(0.85) !important;
            margin-top: 0px;
            margin-bottom: -60px;
            z-index: -1;
        }

        /* Left-aligned positions (top_left, bottom_left) */
        .DX_Notif_Main[data-pos$="left"] .DX_Notif_Box {
            transform: translate3d(-40px, 0, 0) scale(0.85);
        }
        .DX_Notif_Main[data-pos$="left"] .DX_Notif_Box.hide {
            transform: translate3d(-40px, 0, 0) scale(0.85) !important;
            z-index: -1;
        }
        .DX_Notif_Main[data-pos="bottom_left"] .DX_Notif_Box.hide {
            margin-top: 0px;
            margin-bottom: -60px;
        }

        /* Right-aligned positions (top_right, bottom_right) */
        .DX_Notif_Main[data-pos$="right"] .DX_Notif_Box {
            transform: translate3d(40px, 0, 0) scale(0.85);
        }
        .DX_Notif_Main[data-pos$="right"] .DX_Notif_Box.hide {
            transform: translate3d(40px, 0, 0) scale(0.85) !important;
            z-index: -1;
        }
        .DX_Notif_Main[data-pos="bottom_right"] .DX_Notif_Box.hide {
            margin-top: 0px;
            margin-bottom: -60px;
        }

        .DX_Notif_Ico {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            color: var(--dx-text);
        }

        .DX_Notif_Ico svg {
            width: 100%;
            height: 100%;
        }

        .DX_Notif_Box.warning .DX_Notif_Ico {
            color: rgb(var(--DX-orange));
        }

        .DX_Notif_Box.success .DX_Notif_Ico {
            color: rgb(var(--DX-green));
        }

        .DX_Notif_Box.error .DX_Notif_Ico {
            color: rgb(var(--DX-red));
        }

        .DX_Shop_Grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
            align-self: stretch;
        }

        .DX_Shop_Section_Header {
            grid-column: 1 / -1;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 4px;
        }

        .DX_Shop_Section_Line {
            flex: 1;
            height: 1px;
            background: var(--dx-card-border);
        }

        .DX_Shop_Section_Title {
            font-size: 11px !important;
            font-weight: 800 !important;
            color: var(--dx-text) !important;
            text-transform: uppercase;
            letter-spacing: 0;
            opacity: 0.5;
        }

        .DX_Shop_Card {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            padding: 12px 8px;
            box-sizing: border-box;
            border-radius: 12px;
            outline: 1px solid var(--dx-card-border);
            outline-offset: -1px;
            background: var(--dx-card-bg);
            transition: outline-color var(--DX-motion) var(--DX-ease),
                        background var(--DX-motion) var(--DX-ease);
            text-align: center;
            min-width: 0;
        }

        .DX_Shop_Card:hover {
            outline-color: rgba(var(--DX-blue), 0.3);
            background: var(--dx-card-hover);
        }

        .DX_Shop_Ico {
            width: 36px;
            height: 36px;
            object-fit: contain;
            flex-shrink: 0;
        }

        .DX_Shop_Name {
            font-size: 11px;
            font-weight: 700;
            color: var(--dx-text);
            opacity: 0.8;
            line-height: 1.3;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 30px;
            overflow-wrap: anywhere;
        }

        .DX_Shop_Btn {
            width: 100%;
            height: 28px;
            border-radius: var(--DX-r-s);
            border: none;
            cursor: pointer;
            font-size: 11px;
            font-weight: 800;
            color: #fff;
            background: rgb(var(--DX-blue));
            outline: 1px solid rgba(0, 0, 0, 0.2);
            outline-offset: -1px;
            transition: filter var(--DX-motion-fast) var(--DX-ease),
                        transform var(--DX-motion-fast) var(--DX-ease),
                        background var(--DX-motion) var(--DX-ease);
        }

        .DX_Shop_Btn:hover {
            filter: brightness(0.98);
            transform: scale(1.02);
        }

        .DX_Shop_Btn:active {
            filter: brightness(0.98);
            transform: scale(0.97);
        }

        .DX_Shop_Btn:focus-visible {
            outline-color: var(--focus-outline, rgba(0, 0, 0, 0.2)) !important;
        }

        .DX_Shop_Btn.loading {
            --focus-outline: var(--dx-card-border);
            background: var(--dx-card-bg);
            color: var(--dx-text);
            outline-color: var(--dx-card-border);
            pointer-events: none;
        }

        .DX_Shop_Btn.got {
            --focus-outline: rgba(var(--DX-green), 0.25);
            background: rgba(var(--DX-green), 0.12);
            color: rgb(var(--DX-green));
            outline-color: rgba(var(--DX-green), 0.25);
            pointer-events: none;
        }

        .DX_Btn.fail,
        .DX_Sm_Btn.fail,
        .DX_Input_Btn.fail,
        .DX_Quest_Get_Btn.fail,
        .DX_Shop_Btn.fail,
        .DX_Hash_Btn.fail {
            --focus-outline: rgba(var(--DX-red), 0.22) !important;
            background: rgba(var(--DX-red), 0.10) !important;
            color: rgb(var(--DX-red)) !important;
            outline-color: rgba(var(--DX-red), 0.22) !important;
            pointer-events: none !important;
        }

        .DX_Scroll_Inner {
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

        .DX_Scroll_Inner::-webkit-scrollbar {
            width: 4px;
        }

        .DX_Scroll_Inner::-webkit-scrollbar-track {
            margin: 8px 0;
            border-radius: 12px;
        }

        .DX_Scroll_Inner::-webkit-scrollbar-thumb {
            background: rgba(var(--DX-blue), 0.4);
            border-radius: 4px;
        }

        .DX_Search {
            align-self: stretch;
            height: 40px;
            padding: 0 12px;
            border-radius: 8px;
            border: none;
            -webkit-appearance: none;
            appearance: none;
            outline: 1px solid var(--dx-card-border);
            outline-offset: -1px;
            background: var(--dx-card-bg);
            font-size: 14px;
            font-weight: 600;
            color: var(--dx-text);
            transition: outline-color var(--DX-motion) var(--DX-ease);
        }

        .DX_Search:focus {
            outline-color: rgba(var(--DX-blue), 0.35);
        }

        .DX_Quest_Item {
            display: flex;
            align-items: center;
            gap: 8px;
            align-self: stretch;
            min-height: 56px;
            padding: 8px 10px;
            box-sizing: border-box;
            border-radius: 8px;
            outline: 1px solid var(--dx-card-border);
            outline-offset: -1px;
            background: var(--dx-card-bg);
        }

        .DX_Quest_Item.done {
            outline-color: rgba(var(--DX-green), 0.25);
            background: rgba(var(--DX-green), 0.04);
        }

        .DX_Acc_Card {
            display: flex;
            align-items: center;
            gap: 10px;
            align-self: stretch;
            padding: 10px 12px;
            box-sizing: border-box;
            border-radius: 12px;
            outline: 1px solid var(--dx-card-border);
            outline-offset: -1px;
            background: var(--dx-card-bg);
            transition: outline-color var(--DX-motion) var(--DX-ease),
                        background var(--DX-motion) var(--DX-ease);
            position: relative;
            overflow: hidden;
        }
        .DX_Acc_Card:hover {
            outline-color: rgba(var(--DX-blue), 0.3);
            background: var(--dx-card-hover);
        }
        .DX_Acc_Avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            flex-shrink: 0;
            background: rgba(var(--DX-blue), 0.1);
            color: var(--dx-text);
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        }
        .DX_Acc_Info {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .DX_Acc_Name {
            font-size: 13px !important;
            font-weight: 700 !important;
            color: var(--dx-text) !important;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin: 0;
        }
        .DX_Acc_Sub {
            font-size: 11px !important;
            font-weight: 600 !important;
            color: var(--dx-text) !important;
            opacity: 0.5;
            margin: 0;
        }
        .DX_Acc_Sub.active {
            color: rgb(var(--DX-green)) !important;
            opacity: 1;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .DX_Acc_Action_Row {
            display: flex;
            gap: 6px;
            flex-shrink: 0;
        }
        .DX_Acc_Btn {
            height: 28px;
            padding: 0 10px;
            border-radius: 8px;
            corner-shape: var(--DX-corner);
            border: none;
            cursor: pointer;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.5px;
            color: #fff;
            background: rgb(var(--DX-blue));
            display: flex;
            align-items: center;
            justify-content: center;
            outline: 1px solid rgba(0, 0, 0, 0.2);
            outline-offset: -1px;
            transition: opacity var(--DX-motion) var(--DX-ease),
                        transform var(--DX-motion-fast) var(--DX-ease),
                        outline var(--DX-motion) var(--DX-ease),
                        filter var(--DX-motion-fast) var(--DX-ease);
        }
        .DX_Acc_Btn:focus-visible {
            outline-color: rgba(var(--DX-blue), 0.5) !important;
        }
        .DX_Acc_Btn:hover {
            opacity: 0.9;
            transform: scale(1.02);
        }
        .DX_Acc_Btn:active {
            filter: brightness(0.98);
            transform: scale(0.97);
        }
        .DX_Acc_Btn.del {
            width: 28px;
            padding: 0;
            background: rgba(var(--DX-red), 0.15);
            color: rgb(var(--DX-red));
            outline: 1px solid rgba(var(--DX-red), 0.2);
        }
        .DX_Acc_Btn.del:hover {
            background: rgb(var(--DX-red));
            color: #fff;
            outline: 1px solid rgba(0, 0, 0, 0.2);
        }
        .DX_Acc_Btn.del img {
            transition: filter var(--DX-motion) var(--DX-ease);
        }
        .DX_Acc_Btn.del:hover img {
            filter: brightness(0) invert(1);
        }

        .DX_Quest_Icon {
            width: 36px;
            height: 36px;
            object-fit: contain;
            flex-shrink: 0;
        }

        .DX_Quest_Info {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 3px;
        }

        .DX_Quest_Title {
            font-size: 12px !important;
            font-weight: 700 !important;
            color: var(--dx-text) !important;
            opacity: 0.9;
            line-height: 1.25;
            overflow-wrap: anywhere;
        }

        .DX_Quest_Bar_Bg {
            height: 4px;
            border-radius: 2px;
            background: rgba(var(--DX-blue), 0.10);
            overflow: hidden;
            align-self: stretch;
        }

        .DX_Quest_Bar_Fill {
            height: 100%;
            background: rgb(var(--DX-blue));
            border-radius: 2px;
            transition: width var(--DX-motion-page) var(--DX-ease);
        }

        .DX_Quest_Item.done .DX_Quest_Bar_Fill {
            background: rgb(var(--DX-green));
        }

        .DX_Quest_Get_Btn {
            height: 28px;
            min-width: 52px;
            padding: 0 8px;
            flex-shrink: 0;
            border-radius: var(--DX-r-s);
            border: none;
            cursor: pointer;
            font-size: 10px;
            font-weight: 800;
            white-space: nowrap;
            background: rgb(var(--DX-blue));
            color: #fff;
            outline: 1px solid rgba(0, 0, 0, 0.2);
            outline-offset: -1px;
            transition: filter var(--DX-motion-fast) var(--DX-ease),
                        transform var(--DX-motion-fast) var(--DX-ease),
                        outline var(--DX-motion) var(--DX-ease),
                        background var(--DX-motion) var(--DX-ease);
        }

        .DX_Quest_Get_Btn:focus-visible {
            outline-color: var(--focus-outline, rgba(var(--DX-blue), 0.5)) !important;
        }

        .DX_Quest_Get_Btn:hover {
            filter: brightness(0.98);
            transform: scale(1.02);
        }

        .DX_Quest_Get_Btn:active {
            filter: brightness(0.98);
            transform: scale(0.97);
        }

        .DX_Field_Row,
        .DX_Setting_Row,
        .DX_Compact_Task {
            display: flex;
            align-items: center;
            justify-content: space-between;
            align-self: stretch;
            gap: 8px;
            min-width: 0;
        }

        .DX_Setting_Row .DX_HStack_8 {
            width: 146px;
            justify-content: flex-end;
            flex-shrink: 0;
            align-self: center !important;
        }

        .DX_Stack_Section {
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-self: stretch;
            min-width: 0;
        }

        .DX_Row_Text {
            display: flex;
            flex-direction: column;
            gap: 2px;
            flex: 1 1 auto;
            min-width: 0;
        }

        .DX_Row_Text .DX_T1,
        .DX_Row_Text .DX_T2 {
            overflow-wrap: anywhere;
        }

        .DX_Row_Text .DX_T1 {
            line-height: 1.12;
        }

        .DX_Row_Text .DX_T2 {
            font-size: 11px;
            line-height: 1.25;
        }

        .DX_Set_Input_Wrap {
            display: flex;
            align-items: center;
            height: 40px;
            min-width: 0;
            padding: 0 12px;
            box-sizing: border-box;
            gap: 6px;
            border-radius: 8px;
            outline: 1px solid var(--dx-card-border);
            outline-offset: -1px;
            transition: outline-color var(--DX-motion) var(--DX-ease);
            background: var(--dx-card-bg);
        }

        .DX_Set_Input_Wrap:focus-within {
            outline-color: rgba(var(--DX-blue), 0.35);
        }

        .DX_Set_Input_Wrap .DX_Input {
            text-align: left;
            font-size: 14px !important;
        }

        .DX_Back_Btn {
            align-self: flex-start;
            width: auto;
            opacity: 0.62;
            cursor: pointer;
            padding: 2px 0;
        }

        .DX_Panel_Card {
            align-self: stretch;
            background: var(--dx-card-bg);
            outline: 1px solid var(--dx-card-border);
            outline-offset: -1px;
            border-radius: 8px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .DX_Update_Banner {
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
            corner-shape: var(--DX-corner);
            background: var(--dx-card-bg);
            outline: 1px solid var(--dx-card-border);
            outline-offset: -1px;
            transition: max-height var(--DX-motion-page) var(--DX-ease),
                        opacity var(--DX-motion) var(--DX-ease),
                        padding var(--DX-motion-page) var(--DX-ease);
        }

        .DX_Update_Banner.on {
            display: flex;
            max-height: 56px;
            opacity: 1;
            padding: 10px 12px;
        }

        .DX_Quest_Get_Btn.done {
            background: rgba(var(--DX-green), 0.10);
            color: rgb(var(--DX-green));
            pointer-events: none;
        }



        @media (max-width: 480px) {
            .DX_Main_Box {
                padding: 14px;
            }
        }

        @media (max-width: 360px) {
            .DX_Main_Box {
                padding: 12px;
            }

            .DX_Input_Btn,
            .DX_Sm_Btn {
                min-width: 60px;
                width: 60px;
                padding-left: 8px;
                padding-right: 8px;
            }
        }

        #duoxjs-hide-button {
            cursor: grab;
            touch-action: none;
            flex: none;
            min-width: 92px;
            height: 40px;
            padding: 10px 12px;
            justify-content: center;
            align-items: center;
            gap: 6px;
            border-radius: 8px;
            corner-shape: var(--DX-corner);
            font-family: var(--DX-font-stack);
            font-size: 13px;
            font-weight: 600;
            letter-spacing: -0.01em;
            color: var(--dx-text);
            background: var(--dx-panel-bg) !important;
            outline: 1px solid var(--dx-card-border);
            outline-offset: -1px;
            box-shadow: var(--dx-panel-shadow);
            backdrop-filter: blur(30px) saturate(190%);
            -webkit-backdrop-filter: blur(30px) saturate(190%);
            pointer-events: auto !important;
            transition: background var(--DX-motion) var(--DX-ease-spring),
                        outline var(--DX-motion) var(--DX-ease-spring),
                        box-shadow var(--DX-motion) var(--DX-ease-spring),
                        color var(--DX-motion) var(--DX-ease-spring),
                        filter var(--DX-motion-fast) var(--DX-ease-spring),
                        transform var(--DX-motion-fast) var(--DX-ease-spring);
        }

        #duoxjs-hide-button:hover {
            filter: brightness(1.04);
            transform: scale(1.02);
        }

        #duoxjs-hide-button:active {
            cursor: grabbing;
            filter: brightness(0.95);
            transform: scale(0.96);
        }

        #duoxjs-hide-button .DX_Hide_Icon_Stack {
            display: grid;
            place-items: center;
            width: 24px;
            height: 18px;
            flex: 0 0 24px;
        }

        #duoxjs-hide-button svg {
            display: block !important;
            grid-area: 1 / 1;
            color: inherit;
            fill: currentColor !important;
            transition: color var(--DX-motion) var(--DX-ease),
                        opacity var(--DX-motion) var(--DX-ease),
                        filter var(--DX-motion) var(--DX-ease),
                        transform var(--DX-motion) var(--DX-ease);
        }

        #duoxjs-hide-button svg path {
            fill: currentColor !important;
        }

        #duoxjs-hide-button #hide-icon {
            opacity: 1;
            transform: scale(1);
        }

        #duoxjs-hide-button #show-icon {
            opacity: 0;
            transform: scale(0.85);
        }

        #duoxjs-hide-button.duoxjs-show-mode #hide-icon {
            opacity: 0;
            transform: scale(0.85);
        }

        #duoxjs-hide-button.duoxjs-show-mode #show-icon {
            opacity: 1;
            transform: scale(1);
        }

        #duoxjs-hide-button.duoxjs-show-mode {
            background: var(--dx-panel-bg) !important;
            outline-color: var(--dx-card-border);
            color: var(--dx-text);
        }

        #DX_Main_Content {
            transition: opacity var(--DX-motion) var(--DX-ease),
                        filter var(--DX-motion) var(--DX-ease);
        }

        #DX_Main_Content.dx-disabled > *:not(#DX_User_Row):not(#DX_User_Row_Divider):not(#DX_Page_AccountManager) {
            pointer-events: none;
            opacity: 0.5;
            filter: grayscale(1);
        }

        #DX_Root button {
            -webkit-tap-highlight-color: transparent;
        }

        #DX_Root button:focus-visible {
            outline-style: solid !important;
            outline-width: 1px !important;
            outline-color: var(--focus-outline, rgba(var(--DX-blue), 0.6)) !important;
            outline-offset: -1px !important;
        }



        .DX_Btn:focus,
        .DX_Btn:active,
        .DX_Sm_Btn:focus,
        .DX_Sm_Btn:active,
        .DX_Acc_Btn:focus,
        .DX_Acc_Btn:active,
        .DX_Quest_Get_Btn:focus,
        .DX_Quest_Get_Btn:active,
        .DX_Shop_Btn:focus,
        .DX_Shop_Btn:active,
        .DX_Input_Btn:focus,
        .DX_Input_Btn:active {
            outline: 1px solid rgba(0, 0, 0, 0.2);
            outline-offset: -1px;
        }

        .DX_Btn_Blue_Ghost:focus,
        .DX_Btn_Blue_Ghost:active,
        .DX_Btn_Eel:focus,
        .DX_Btn_Eel:active,
        .DX_Hash_Btn:focus,
        .DX_Hash_Btn:active {
            outline: 1px solid var(--dx-card-border);
            outline-offset: -1px;
        }

        .DX_Modal_Overlay {
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
            transition: opacity var(--DX-motion-page) var(--DX-ease),
                        visibility var(--DX-motion-page) var(--DX-ease),
                        backdrop-filter var(--DX-motion-page) var(--DX-ease);
        }

        .DX_Modal_Overlay.show {
            opacity: 1;
            visibility: visible;
        }

        .DX_Modal_Box {
            background: var(--dx-bg);
            outline: 1px solid var(--dx-card-border);
            outline-offset: -1px;
            border-radius: 16px;
            padding: 20px;
            width: 270px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 8px;
            transform: scale(0.9);
            transition: transform var(--DX-motion-page) var(--DX-ease);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .DX_Modal_Overlay.show .DX_Modal_Box {
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
            transition: filter var(--DX-motion-fast) var(--DX-ease), color var(--DX-motion-fast) var(--DX-ease);
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
            transition: filter var(--DX-motion-fast) var(--DX-ease), color var(--DX-motion-fast) var(--DX-ease);
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

        #DX_User_Row {
            cursor: pointer;
            transition: filter var(--DX-motion-fast) var(--DX-ease),
                        transform var(--DX-motion-fast) var(--DX-ease),
                        background var(--DX-motion) var(--DX-ease),
                        outline-color var(--DX-motion) var(--DX-ease);
        }

        #DX_User_Row:hover {
            filter: brightness(0.98);
            transform: scale(1.02);
            background: var(--dx-card-hover);
            outline-color: rgb(var(--DX-blue));
        }
        #DX_User_Row:active {
            filter: brightness(0.98);
            transform: scale(0.97);
        }



        @media (hover: none) {
            .DX_Btn:hover,
            .DX_Hash_Btn:hover,
            .DX_Input_Btn:hover,
            .DX_Sm_Btn:hover,
            .DX_Shop_Btn:hover,
            .DX_Acc_Btn:hover,
            .DX_Quest_Get_Btn:hover,
            .auto-solver-btn:hover,
            #DX_User_Row:hover {
                filter: none !important;
                transform: none !important;
                opacity: 1 !important;
            }
            .DX_Select:hover {
                outline-color: var(--dx-card-border) !important;
            }
            .DX_Select_Option:hover {
                background: transparent !important;
                color: var(--dx-text) !important;
            }
            .DX_Shop_Card:hover,
            .DX_Acc_Card:hover {
                outline-color: var(--dx-card-border) !important;
                background: var(--dx-card-bg) !important;
            }
        }
    `;

  const loadCss = `
        .dx-spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(var(--DX-blue), 0.15);
            border-top-color: rgb(var(--DX-blue));
            border-radius: 50%;
            -webkit-animation: dx-spin 0.65s linear infinite;
            animation: dx-spin 0.65s linear infinite;
            box-sizing: border-box;
        }

        @-webkit-keyframes dx-spin {
            to { -webkit-transform: rotate3d(0, 0, 1, 360deg); }
        }
        @keyframes dx-spin {
            to { transform: rotate3d(0, 0, 1, 360deg); }
        }
    `;

  const uiHtml = `
        <div class="DX_Notif_Main dx-light" id="DX_Notif_Main"></div>
        <div class="DX_Main" id="DX_Main">
            <div class="DX_HStack_8" style="align-self: flex-end; pointer-events: none;">
                <button type="button" class="DX_Btn DX_Btn_Eel DX_NoSel dx-light" id="duoxjs-hide-button">
                    <span class="DX_Hide_Icon_Stack">${icons.hideBtn}${icons.showBtn}</span>
                    <span id="hide-show-text" class="DX_T1 DX_NoSel" style="font-size: 14px; line-height: 1; color: inherit;">Hide</span>
                </button>
            </div>
            <div class="DX_Main_Box dx-light" id="DX_Main_Box">
                <div class="DX_Modal_Overlay" id="DX_Confirm_Modal">
                    <div class="DX_Modal_Box">
                        <div class="DX_Notif_Ico" style="width: 32px; height: 32px; margin-bottom: 4px;">
                            ${icons.warning}
                        </div>
                        <p class="DX_T1 DX_NoSel">Action Required</p>
                        <p class="DX_T2 DX_NoSel" id="DX_Confirm_Modal_Text" style="font-size: 12px; margin-bottom: 6px;">XP Farm is currently running. Do you want to stop it to run Auto League?</p>
                        <div class="DX_HStack_8" style="margin-top: 4px;">
                            <button class="DX_Sm_Btn DX_Btn_Eel DX_NoSel" id="DX_Modal_Cancel" style="flex: 1; outline-color: transparent;">
                                <span class="DX_Sm_Btn_Label" style="color: var(--dx-text);">NO</span>
                            </button>
                            <button class="DX_Sm_Btn DX_NoSel" id="DX_Modal_Confirm" style="flex: 1;">
                                <span class="DX_Sm_Btn_Label" style="color: #fff;">YES</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="DX_Page active" id="DX_Page_1">
                    <div class="DX_HStack_Auto" id="DX_Header_Row" style="align-self: stretch;">
                        <div class="DX_NoSel" style="display: flex; flex-direction: column; justify-content: center; gap: 2px;">
                            <div class="DX_Wordmark DX_NoSel">
                                <span style="color: var(--dx-text);">Duo</span>
                                <span class="dx-xjs">XJS</span>
                            </div>
                            <span class="DX_T2 DX_Hover_1" id="DX_Version_Btn" style="font-size: 11px; font-weight: 700; letter-spacing: 0.4px; opacity: 0.6; cursor: pointer; align-self: flex-start; line-height: 1;">v${dxVersion}</span>
                        </div>
                        <div class="DX_HStack_8" style="width: auto;">
                            <div class="DX_Btn DX_Btn_Icon DX_NoSel" id="DX_Web_Btn" style="background: rgb(var(--DX-blue)); outline: 1px solid rgba(255, 255, 255, .18); outline-offset: -1px;">
                                ${icons.webBtn}
                            </div>
                            <div class="DX_Btn DX_Btn_Icon DX_NoSel" id="DX_Discord_Btn" style="background: rgb(88, 101, 242); outline: 1px solid rgba(0, 0, 0, .18); outline-offset: -1px;">
                                ${icons.discordBtn}
                            </div>
                            <div class="DX_Btn DX_Btn_Icon DX_NoSel" id="DX_GitHub_Btn" style="background: #24292e; outline: 1px solid rgba(255, 255, 255, .18); outline-offset: -1px;">
                                ${icons.githubBtn}
                            </div>
                        </div>
                    </div>

                    <div class="DX_Update_Banner" id="DX_Update_Banner">
                        <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1 1 auto;">
                            <div style="width: 26px; height: 26px; border-radius: 50%; background: rgb(var(--DX-blue)); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"></path><path d="M5 12l7-7 7 7"></path></svg>
                            </div>
                            <div style="min-width: 0; display: flex; flex-direction: column; gap: 1px;">
                                <p class="DX_T1 DX_NoSel" style="font-size: 12px; line-height: 1.2;">Update available</p>
                                <p class="DX_T2 DX_NoSel" id="DX_Update_Version_Text" style="font-size: 11px; line-height: 1.2;"></p>
                            </div>
                        </div>
                        <button type="button" class="DX_Sm_Btn DX_NoSel" id="DX_Update_Btn" style="flex-shrink: 0; min-width: 66px;">
                            <span class="DX_Sm_Btn_Label" style="color: #fff;">UPDATE</span>
                        </button>
                    </div>
                    <div id="DX_Main_Content" class="dx-disabled" style="display: flex; flex-direction: column; gap: 8px; width: 100%; transition: opacity var(--DX-motion) var(--DX-ease), filter var(--DX-motion) var(--DX-ease);">
                        <div class="DX_Divider" id="DX_User_Row_Divider" style="display: none;"></div>
                        <div class="DX_Profile_Block" id="DX_User_Row" style="display: none; position: relative; background: var(--dx-card-bg); outline: 1px solid var(--dx-card-border); outline-offset: -1px; border-radius: 8px; padding: 10px; align-items: center; gap: 8px; cursor: pointer;">
                            <div class="DX_Avatar" id="DX_Avatar">${icons.avatar}</div>
                            <div class="DX_VStack_4" style="flex: 1 0 0; min-width: 0; align-items: flex-start;">
                                <p class="DX_T1 DX_NoSel" id="DX_UName" style="font-size: 14px; align-self: stretch; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-right: 16px;"></p>
                                <span class="DX_T2 DX_NoSel" id="DX_UAccCount" style="display: none; font-size: 11px; opacity: 0.75;"></span>
                                <div class="DX_HStack_4" id="DX_User_Stats_Row" style="gap: 8px; flex-wrap: wrap;">
                                    <div class="DX_HStack_4" style="gap: 3px;">
                                        <img class="DX_Stat_Ico" src="${icons.xpIcon}">
                                        <span class="DX_Stat_Val DX_NoSel" id="DX_UXP">0</span>
                                    </div>
                                    <div class="DX_HStack_4" style="gap: 3px;">
                                        <img class="DX_Stat_Ico" src="${icons.gemIcon}">
                                        <span class="DX_Stat_Val DX_NoSel" id="DX_UGems">0</span>
                                    </div>
                                    <div class="DX_HStack_4" style="gap: 3px;">
                                        <img class="DX_Stat_Ico" src="${icons.streakIcon}">
                                        <span class="DX_Stat_Val DX_NoSel" id="DX_UStreak">0</span>
                                    </div>
                                    <div class="DX_HStack_4" id="DX_ULeague_Wrap" style="gap: 3px; display: none;">
                                        <img class="DX_Stat_Ico" id="DX_ULeague_Ico" src="${leagueBadgeUrl()}">
                                        <span class="DX_Stat_Val DX_NoSel" id="DX_ULeague_Rank">#0</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="DX_HStack_8" style="align-self: stretch; align-items: center;">
                            <div class="DX_Btn DX_Btn_Icon DX_Btn_Eel DX_NoSel" id="DX_Conn_Btn" style="transition: background var(--DX-motion) var(--DX-ease), outline var(--DX-motion) var(--DX-ease), color var(--DX-motion) var(--DX-ease); pointer-events: none;">
                                <span id="DX_Conn_Ico" style="display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 20px; height: 20px;"></span>
                            </div>
                            <div class="DX_Btn DX_Btn_Eel DX_NoSel" id="DX_Mode_Toggle_Btn" style="display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 13px; font-weight: 700; border-radius: 8px; flex: 1; color: var(--dx-text); cursor: pointer; padding: 0 8px; white-space: nowrap;">
                                <span id="DX_Mode_Toggle_Ico" style="display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 20px; height: 20px;"></span>
                                <span id="DX_Mode_Toggle_Lbl">Native Mode</span>
                            </div>
                            <div class="DX_Btn DX_Btn_Icon DX_Btn_Eel DX_NoSel" id="DX_TopSettings_Btn" title="Settings" style="color: var(--dx-text); cursor: pointer;">
                                ${icons.settingsBtn}
                            </div>
                        </div>
                        <div class="DX_Divider"></div>
                        <div id="DX_Native_Sections" style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
                            <div class="DX_Farm_Sec">
                                <div class="DX_HStack_4" style="align-self: stretch; min-width: 0;">
                                    <p class="DX_T1 DX_NoSel" style="font-size: 14px; font-weight: 600;">How much XP to farm?</p>
                                </div>
                                <div class="DX_HStack_8">
                                    <button class="DX_Hash_Btn" id="DX_XP_Hash" data-inf="false" title="Toggle infinite loops">${icons.hash}</button>
                                    <div class="DX_Input_Wrap">
                                        <input type="number" class="DX_Input DX_NoSel" id="DX_XP_Input" placeholder="0" min="30">
                                    </div>
                                    <button class="DX_Input_Btn DX_NoSel" id="DX_XP_Btn" disabled>
                                        <span class="DX_Btn_Label" id="DX_XP_Lbl" style="color: #fff;">RUN</span>
                                    </button>
                                </div>
                                <div class="DX_Prog_Wrap" id="DX_XP_Prog">
                                    <div class="DX_Prog_Fill" id="DX_XP_Fill"></div>
                                </div>
                            </div>
                            <div class="DX_Divider"></div>
                            <div class="DX_Farm_Sec">
                                <div class="DX_HStack_4" style="align-self: stretch; min-width: 0;">
                                    <p class="DX_T1 DX_NoSel" style="font-size: 14px; font-weight: 600;">How many Gems to farm?</p>
                                </div>
                                <div class="DX_HStack_8">
                                    <button class="DX_Hash_Btn dx-inf-active" id="DX_Gem_Hash" data-inf="true" title="Toggle infinite loops">${icons.inf}<span class="DX_Hash_Lbl">Infinite</span></button>
                                    <div class="DX_Input_Wrap dx-inf-hidden">
                                        <input type="number" class="DX_Input DX_NoSel" id="DX_Gem_Input" placeholder="Loops" min="1" disabled value="Infinity">
                                    </div>
                                    <button class="DX_Input_Btn DX_NoSel" id="DX_Gem_Btn" disabled>
                                        <span class="DX_Btn_Label" id="DX_Gem_Lbl" style="color: #fff;">RUN</span>
                                    </button>
                                </div>
                                <div class="DX_Prog_Wrap" id="DX_Gem_Prog">
                                    <div class="DX_Prog_Fill" id="DX_Gem_Fill"></div>
                                </div>
                            </div>
                            <div class="DX_Divider"></div>
                            <div class="DX_Farm_Sec">
                                <div class="DX_HStack_4" style="align-self: stretch; min-width: 0;">
                                    <p class="DX_T1 DX_NoSel" style="font-size: 14px; font-weight: 600;">How many streak days to restore?</p>
                                </div>
                                <div class="DX_HStack_8">
                                    <button class="DX_Hash_Btn" id="DX_Streak_Hash" data-inf="false" title="Toggle infinite loops">${icons.hash}</button>
                                    <div class="DX_Input_Wrap">
                                        <input type="number" class="DX_Input DX_NoSel" id="DX_Streak_Input" placeholder="Days" min="1">
                                    </div>
                                    <button class="DX_Input_Btn DX_NoSel" id="DX_Streak_Btn" disabled>
                                        <span class="DX_Btn_Label" id="DX_Streak_Lbl" style="color: #fff;">RUN</span>
                                    </button>
                                </div>
                                <div class="DX_Prog_Wrap" id="DX_Streak_Prog">
                                    <div class="DX_Prog_Fill" id="DX_Streak_Fill"></div>
                                </div>
                            </div>
                        </div>
                        <div id="DX_Solver_Sections" style="display: none; flex-direction: column; gap: 8px; width: 100%;">
                            <div class="DX_Farm_Sec">
                                <div class="DX_HStack_4" style="align-self: stretch; min-width: 0;">
                                    <p class="DX_T1 DX_NoSel" style="font-size: 14px; font-weight: 600;">How many lessons to solve?</p>
                                </div>
                                <div class="DX_HStack_8">
                                    <button class="DX_Hash_Btn dx-inf-active" id="DX_Path_Hash" data-inf="true" title="Toggle infinite loops">${icons.inf}<span class="DX_Hash_Lbl">Infinite</span></button>
                                    <div class="DX_Input_Wrap dx-inf-hidden">
                                        <input type="number" class="DX_Input DX_NoSel" id="DX_Path_Input" placeholder="Lessons" min="1" disabled value="Infinity">
                                    </div>
                                    <button class="DX_Input_Btn DX_NoSel" id="DX_AutoPath_Btn" disabled>
                                        <span class="DX_Btn_Label" id="DX_AutoPath_Lbl" style="color: #fff;">RUN</span>
                                    </button>
                                </div>
                                <div class="DX_Prog_Wrap" id="DX_Path_Prog">
                                    <div class="DX_Prog_Fill" id="DX_Path_Fill"></div>
                                </div>
                            </div>
                            <div class="DX_Divider"></div>
                            <div class="DX_Farm_Sec">
                                <div class="DX_HStack_4" style="align-self: stretch; min-width: 0;">
                                    <p class="DX_T1 DX_NoSel" style="font-size: 14px; font-weight: 600;">How many legendary lessons to solve?</p>
                                </div>
                                <div class="DX_HStack_8">
                                    <button class="DX_Hash_Btn dx-inf-active" id="DX_Legendary_Hash" data-inf="true" title="Toggle infinite loops">${icons.inf}<span class="DX_Hash_Lbl">Infinite</span></button>
                                    <div class="DX_Input_Wrap dx-inf-hidden">
                                        <input type="number" class="DX_Input DX_NoSel" id="DX_Legendary_Input" placeholder="Lessons" min="1" disabled value="Infinity">
                                    </div>
                                    <button class="DX_Input_Btn DX_NoSel" id="DX_AutoLegendary_Btn" disabled>
                                        <span class="DX_Btn_Label" id="DX_AutoLegendary_Lbl" style="color: #fff;">RUN</span>
                                    </button>
                                </div>
                                <div class="DX_Prog_Wrap" id="DX_Legendary_Prog">
                                    <div class="DX_Prog_Fill" id="DX_Legendary_Fill"></div>
                                </div>
                            </div>
                            <div class="DX_Divider"></div>
                            <div class="DX_Farm_Sec">
                                <div class="DX_HStack_4" style="align-self: stretch; min-width: 0;">
                                    <p class="DX_T1 DX_NoSel" style="font-size: 14px; font-weight: 600;">How many practice lessons to solve?</p>
                                </div>
                                <div class="DX_HStack_8">
                                    <button class="DX_Hash_Btn dx-inf-active" id="DX_Practice_Hash" data-inf="true" title="Toggle infinite loops">${icons.inf}<span class="DX_Hash_Lbl">Infinite</span></button>
                                    <div class="DX_Input_Wrap dx-inf-hidden">
                                        <input type="number" class="DX_Input DX_NoSel" id="DX_Practice_Input" placeholder="Lessons" min="1" disabled value="Infinity">
                                    </div>
                                    <button class="DX_Input_Btn DX_NoSel" id="DX_AutoPractice_Btn" disabled>
                                        <span class="DX_Btn_Label" id="DX_AutoPractice_Lbl" style="color: #fff;">RUN</span>
                                    </button>
                                </div>
                                <div class="DX_Prog_Wrap" id="DX_Practice_Prog">
                                    <div class="DX_Prog_Fill" id="DX_Practice_Fill"></div>
                                </div>
                            </div>
                        </div>
                        <div class="DX_Divider"></div>
                        <div class="DX_Btn DX_Btn_Blue_Ghost DX_NoSel DX_Nav_Btn" id="DX_Extra_Btn">
                            <div class="DX_Nav_Btn_L">
                                <img class="DX_NoSel" src="https://d35aaqx5ub95lt.cloudfront.net/vendor/7159c0b5d4250a5aea4f396d53f17f0c.svg" alt="" style="width: 22px; height: 22px; object-fit: contain; flex-shrink: 0;">
                                <p class="DX_Nav_Title DX_NoSel">Extra Features</p>
                            </div>
                            ${icons.arrowRight}
                        </div>
                    </div>
                </div>
                <div class="DX_Page" id="DX_Page_Extra">
                    <div class="DX_HStack_4 DX_NoSel DX_Back_Btn" id="DX_Extra_Back_Btn">
                        ${icons.back}
                        <p class="DX_T1">Back</p>
                    </div>
                    <div class="DX_HStack_4 DX_NoSel" style="align-self: stretch; gap: 8px; margin-bottom: 8px;">
                        <img class="DX_NoSel" src="https://d35aaqx5ub95lt.cloudfront.net/vendor/7159c0b5d4250a5aea4f396d53f17f0c.svg" alt="" style="width: 34px; height: 34px; object-fit: contain; flex-shrink: 0;">
                        <div class="DX_Row_Text">
                            <p class="DX_T1 DX_NoSel" style="font-size: 14px; font-weight: 600;">Extra Features</p>
                            <p class="DX_T2 DX_NoSel">Additional utilities and statistics</p>
                        </div>
                    </div>
                    <div class="DX_Farm_Sec">
                        <div class="DX_Compact_Task">
                            <div class="DX_Row_Text">
                                <p class="DX_T1 DX_NoSel">Auto League</p>
                                <p class="DX_T2 DX_NoSel">Target specific rank position</p>
                            </div>
                            <div class="DX_HStack_8" style="width: auto; flex-shrink: 0;">
                                <div class="DX_Select" id="DX_League_Select" data-value="1" style="width: 80px; flex-shrink: 0;">
                                    <div class="DX_Select_Trigger">
                                        <span class="DX_Select_Text"># 1</span>${icons.chevron}
                                    </div>
                                    <div class="DX_Select_Options"></div>
                                </div>
                                <button class="DX_Sm_Btn DX_NoSel" id="DX_League_Btn" disabled>
                                    <span class="DX_Sm_Btn_Label" id="DX_League_Lbl" style="color: #fff;">RUN</span>
                                </button>
                            </div>
                        </div>
                        <div class="DX_Prog_Wrap" id="DX_League_Prog" style="align-self: stretch;">
                            <div class="DX_Prog_Fill" id="DX_League_Fill"></div>
                        </div>
                    </div>
                    <div class="DX_Divider"></div>
                    <div class="DX_Farm_Sec">
                        <div class="DX_Compact_Task">
                            <div class="DX_Row_Text">
                                <p class="DX_T1 DX_NoSel">Remove Hearts</p>
                                <p class="DX_T2 DX_NoSel">Drain hearts from this account</p>
                            </div>
                            <div class="DX_HStack_8" style="width: auto; flex-shrink: 0;">
                                <div class="DX_Set_Input_Wrap" style="width: 80px; flex-shrink: 0;">
                                    <input type="number" class="DX_Input DX_NoSel" id="DX_Hearts_Input" placeholder="1-5" min="1" max="5">
                                </div>
                                <button class="DX_Sm_Btn DX_NoSel" id="DX_Hearts_Btn" disabled>
                                    <span class="DX_Sm_Btn_Label" style="color: #fff;">RUN</span>
                                </button>
                            </div>
                        </div>
                        <div class="DX_Prog_Wrap" id="DX_Hearts_Prog" style="align-self: stretch;">
                            <div class="DX_Prog_Fill" id="DX_Hearts_Fill"></div>
                        </div>
                    </div>
                    <div class="DX_Divider"></div>
                    <div class="DX_Btn DX_Btn_Blue_Ghost DX_NoSel DX_Nav_Btn" id="DX_Shop_Btn">
                        <div class="DX_Nav_Btn_L">
                            <img class="DX_NoSel" src="https://d35aaqx5ub95lt.cloudfront.net/vendor/0e58a94dda219766d98c7796b910beee.svg" alt="" style="width: 22px; height: 22px; object-fit: contain; flex-shrink: 0;">
                            <p class="DX_Nav_Title DX_NoSel">Shop Items</p>
                        </div>
                        ${icons.arrowRight}
                    </div>
                    <div class="DX_Btn DX_Btn_Blue_Ghost DX_NoSel DX_Nav_Btn" id="DX_Quest_Nav_Btn">
                        <div class="DX_Nav_Btn_L">
                            <img class="DX_NoSel" src="https://d35aaqx5ub95lt.cloudfront.net/vendor/7ef36bae3f9d68fc763d3451b5167836.svg" alt="" style="width: 22px; height: 22px; object-fit: contain; flex-shrink: 0;">
                            <p class="DX_Nav_Title DX_NoSel">Quest Center</p>
                        </div>
                        ${icons.arrowRight}
                    </div>
                    <div class="DX_Btn DX_Btn_Blue_Ghost DX_NoSel DX_Nav_Btn" id="DX_Tools_Nav_Btn">
                        <div class="DX_Nav_Btn_L">
                            <img class="DX_NoSel" src="${DUO_LEAGUES_CDN}a8e5c18e80054228b2c61168846ff643.svg" alt="" style="width: 22px; height: 22px; object-fit: contain; flex-shrink: 0;">
                            <p class="DX_Nav_Title DX_NoSel">Social Tools</p>
                        </div>
                        ${icons.arrowRight}
                    </div>
                    <div class="DX_Btn DX_Btn_Blue_Ghost DX_NoSel DX_Nav_Btn" id="DX_Board_Nav_Btn">
                        <div class="DX_Nav_Btn_L">
                            <img id="DX_Board_Nav_Ico" src="${leagueBadgeUrl()}" alt="" style="width: 22px; height: 22px; flex-shrink: 0; object-fit: contain;">
                            <p class="DX_Nav_Title DX_NoSel">Leaderboard</p>
                        </div>
                        ${icons.arrowRight}
                    </div>
                    <div class="DX_Btn DX_Btn_Blue_Ghost DX_NoSel DX_Nav_Btn" id="DX_XPSummaries_Btn">
                        <div class="DX_Nav_Btn_L">
                            <img class="DX_NoSel" src="${icons.xpIcon}" alt="" style="width: 22px; height: 22px; object-fit: contain; flex-shrink: 0;">
                            <p class="DX_Nav_Title DX_NoSel">XP Summaries</p>
                        </div>
                        ${icons.arrowRight}
                    </div>
                    <div class="DX_Btn DX_Btn_Blue_Ghost DX_NoSel DX_Nav_Btn" id="DX_Feed_Nav_Btn">
                        <div class="DX_Nav_Btn_L">
                            <img class="DX_NoSel" src="${DUO_LEAGUES_CDN}2ceb401cae52712705b66a77df83ce40.svg" alt="" style="width: 22px; height: 22px; object-fit: contain; flex-shrink: 0;">
                            <p class="DX_Nav_Title DX_NoSel">Activity Feed</p>
                        </div>
                        ${icons.arrowRight}
                    </div>
                </div>
                <div class="DX_Page" id="DX_Page_Settings">
                    <div class="DX_HStack_4 DX_NoSel DX_Back_Btn" id="DX_Settings_Back_Btn">
                        ${icons.back}
                        <p class="DX_T1">Back</p>
                    </div>
                    <div class="DX_HStack_4 DX_NoSel" style="align-self: stretch; gap: 8px; margin-bottom: 8px;">
                        <span style="color: var(--dx-text); width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <svg width="20" height="21" viewBox="147 69 20 21" fill="none" style="width: 30px; height: 30px; object-fit: contain; flex-shrink: 0;" xmlns="http://www.w3.org/2000/svg"><path d="M166.69 81.09v-2.68l-2.21-.3a7.69 7.69 0 0 0-1-2.62l1.27-1.68-1.89-1.89-1.58 1.2a7.71 7.71 0 0 0-2.77-1.22l-.23-1.9h-2.68l-.26 1.85a7.71 7.71 0 0 0-2.86 1.2L151 71.91l-1.9 1.89 1.18 1.56a7.69 7.69 0 0 0-1.06 2.77l-2 .28v2.68l2.16.3a7.71 7.71 0 0 0 1.13 2.48l-1.41 1.83 1.9 1.89 1.93-1.46a7.69 7.69 0 0 0 2.34.91l.34 2.46h2.68l.35-2.5a7.69 7.69 0 0 0 2.26-.93l2 1.52 1.89-1.89-1.47-1.95a7.71 7.71 0 0 0 1-2.34l2.37-.32zm-9.84 1.78a3.42 3.42 0 1 1 .01 0h-.01z" fill="currentColor" fill-rule="nonzero"/></svg>
                        </span>
                        <div class="DX_Row_Text">
                            <p class="DX_T1 DX_NoSel" style="font-size: 14px; font-weight: 600;">Settings</p>
                            <p class="DX_T2 DX_NoSel">Configure script preferences</p>
                        </div>
                    </div>
                    <div style="align-self: stretch; display: flex; flex-direction: column; width: 100%; gap: 8px;">
                        <style>
                            #DX_Page_Settings .DX_HStack_Auto { margin: 0 !important; }
                            #DX_Page_Settings .DX_VStack_8 { gap: 8px; }
                        </style>
                        <div class="DX_VStack_8" style="align-self: stretch;">
                            <div class="DX_Setting_Row">
                                <div class="DX_Row_Text">
                                    <p class="DX_T1 DX_NoSel">Loop Interval</p>
                                    <p class="DX_T2 DX_NoSel">Delay interval between loops</p>
                                </div>
                                <div class="DX_HStack_8" style="width: auto;">
                                    <div class="DX_Set_Input_Wrap" style="width: 116px;">
                                        <input type="number" class="DX_Input DX_NoSel" id="DX_Delay_Input" placeholder="500">
                                        <p class="DX_T1 DX_NoSel" style="color: var(--dx-text); font-size: 13px; flex-shrink: 0; opacity: 0.8; margin-left: 6px;">ms</p>
                                    </div>
                                </div>
                            </div>
                            <div class="DX_Divider"></div>
                            <div class="DX_Setting_Row">
                                <div class="DX_Row_Text">
                                    <p class="DX_T1 DX_NoSel">XP Overshoot</p>
                                    <p class="DX_T2 DX_NoSel">Extra XP buffer for Auto League</p>
                                </div>
                                <div class="DX_HStack_8" style="width: auto;">
                                    <div class="DX_Set_Input_Wrap" style="width: 116px;">
                                        <input type="number" class="DX_Input DX_NoSel" id="DX_XpRoom_Input" placeholder="0">
                                        <p class="DX_T1 DX_NoSel" style="color: var(--dx-text); font-size: 13px; flex-shrink: 0; opacity: 0.8; margin-left: 6px;">xp</p>
                                    </div>
                                </div>
                            </div>
                            <div class="DX_Divider"></div>
                            <div class="DX_Setting_Row">
                                <div class="DX_Row_Text">
                                    <p class="DX_T1 DX_NoSel">Notification Position</p>
                                    <p class="DX_T2 DX_NoSel">Set the notification pop-up position</p>
                                </div>
                                <div class="DX_HStack_8" style="width: auto;">
                                    <div class="DX_Select" id="DX_Notif_Select" data-value="bottom_center" style="width: 146px; font-size: 13px;">
                                        <div class="DX_Select_Trigger">
                                            <span class="DX_Select_Text">Bottom Center</span>${icons.chevron}
                                        </div>
                                        <div class="DX_Select_Options">
                                            <div class="DX_Select_Option" data-value="top_left">Top Left</div>
                                            <div class="DX_Select_Option" data-value="top_center">Top Center</div>
                                            <div class="DX_Select_Option" data-value="top_right">Top Right</div>
                                            <div class="DX_Select_Option" data-value="bottom_left">Bottom Left</div>
                                            <div class="DX_Select_Option selected" data-value="bottom_center">Bottom Center</div>
                                            <div class="DX_Select_Option" data-value="bottom_right">Bottom Right</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="DX_Divider"></div>
                            <div class="DX_Setting_Row">
                                <div class="DX_Row_Text">
                                    <p class="DX_T1 DX_NoSel">On-Client Duolingo Max</p>
                                    <p class="DX_T2 DX_NoSel">Unlock Duolingo Max client-side</p>
                                </div>
                                <div class="DX_HStack_8" style="width: auto;">
                                    <div class="DX_Toggle" id="DX_LocalMax_Toggle"><div class="DX_Toggle_Knob"></div></div>
                                </div>
                            </div>
                            <div class="DX_Divider"></div>
                            <div class="DX_Setting_Row">
                                <div class="DX_Row_Text">
                                    <p class="DX_T1 DX_NoSel">Safe Streak Farming</p>
                                    <p class="DX_T2 DX_NoSel">Prevent streak days from exceeding account age</p>
                                </div>
                                <div class="DX_HStack_8" style="width: auto;">
                                    <div class="DX_Toggle" id="DX_SafeStreak_Toggle"><div class="DX_Toggle_Knob"></div></div>
                                </div>
                            </div>
                            <div class="DX_Divider"></div>

                            <div class="DX_Setting_Row">
                                <div class="DX_Row_Text">
                                    <p class="DX_T1 DX_NoSel">Lesson Shortener</p>
                                    <p class="DX_T2 DX_NoSel">Enable custom lessons and instant stories</p>
                                </div>
                                <div class="DX_HStack_8" style="width: auto;">
                                    <div class="DX_Toggle" id="DX_EZQuiz_Toggle"><div class="DX_Toggle_Knob"></div></div>
                                </div>
                            </div>
                            <div class="DX_Divider"></div>
                            <div class="DX_Setting_Row">
                                <div class="DX_Row_Text">
                                    <p class="DX_T1 DX_NoSel">Lesson Shortener Question Count</p>
                                    <p class="DX_T2 DX_NoSel">Set the question count</p>
                                </div>
                                <div class="DX_HStack_8" style="width: auto;">
                                    <div class="DX_Select dropup" id="DX_EZQuizLength_Select" data-value="5" style="width: 90px; font-size: 13px;">
                                        <div class="DX_Select_Trigger">
                                            <span class="DX_Select_Text">5</span>${icons.chevron}
                                        </div>
                                        <div class="DX_Select_Options">
                                            <div class="DX_Select_Option" data-value="1">1</div>
                                            <div class="DX_Select_Option" data-value="2">2</div>
                                            <div class="DX_Select_Option" data-value="3">3</div>
                                            <div class="DX_Select_Option" data-value="4">4</div>
                                            <div class="DX_Select_Option selected" data-value="5">5</div>
                                            <div class="DX_Select_Option" data-value="6">6</div>
                                            <div class="DX_Select_Option" data-value="7">7</div>
                                            <div class="DX_Select_Option" data-value="8">8</div>
                                            <div class="DX_Select_Option" data-value="9">9</div>
                                            <div class="DX_Select_Option" data-value="10">10</div>
                                            <div class="DX_Select_Option" data-value="11">11</div>
                                            <div class="DX_Select_Option" data-value="12">12</div>
                                            <div class="DX_Select_Option" data-value="13">13</div>
                                            <div class="DX_Select_Option" data-value="14">14</div>
                                            <div class="DX_Select_Option" data-value="15">15</div>
                                            <div class="DX_Select_Option" data-value="16">16</div>
                                            <div class="DX_Select_Option" data-value="17">17</div>
                                            <div class="DX_Select_Option" data-value="18">18</div>
                                            <div class="DX_Select_Option" data-value="19">19</div>
                                            <div class="DX_Select_Option" data-value="20">20</div>
                                            <div class="DX_Select_Option" data-value="21">21</div>
                                            <div class="DX_Select_Option" data-value="22">22</div>
                                            <div class="DX_Select_Option" data-value="23">23</div>
                                            <div class="DX_Select_Option" data-value="24">24</div>
                                            <div class="DX_Select_Option" data-value="25">25</div>
                                            <div class="DX_Select_Option" data-value="26">26</div>
                                            <div class="DX_Select_Option" data-value="27">27</div>
                                            <div class="DX_Select_Option" data-value="28">28</div>
                                            <div class="DX_Select_Option" data-value="29">29</div>
                                            <div class="DX_Select_Option" data-value="30">30</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="DX_Divider"></div>
                        <div class="DX_Btn DX_Btn_Blue_Ghost DX_NoSel DX_Nav_Btn" id="DX_Automations_Btn">
                            <div class="DX_Nav_Btn_L">
                                <img class="DX_NoSel" src="https://d35aaqx5ub95lt.cloudfront.net/images/goals/62bb241121ae018b28240eebffb9fc4a.svg" alt="" style="width: 22px; height: 22px; object-fit: contain; flex-shrink: 0;">
                                <p class="DX_Nav_Title DX_NoSel">Automations</p>
                            </div>
                            ${icons.arrowRight}
                        </div>
                        <div class="DX_Btn DX_Btn_Blue_Ghost DX_NoSel DX_Nav_Btn" id="DX_AutoSolver_Btn">
                            <div class="DX_Nav_Btn_L">
                                <img class="DX_NoSel" src="https://d35aaqx5ub95lt.cloudfront.net/images/goals/39f13d2de304cad2ac2f88b31a7e2ff4.svg" alt="" style="width: 22px; height: 22px; object-fit: contain; flex-shrink: 0;">
                                <p class="DX_Nav_Title DX_NoSel">Auto Solver</p>
                            </div>
                            ${icons.arrowRight}
                        </div>
                    </div>
                </div>
                <div class="DX_Page" id="DX_Page_Automations">
                    <div class="DX_HStack_4 DX_NoSel DX_Back_Btn" id="DX_Automations_Back_Btn">
                        ${icons.back}
                        <p class="DX_T1">Back</p>
                    </div>
                    <div class="DX_HStack_4 DX_NoSel" style="align-self: stretch; gap: 8px; margin-bottom: 8px;">
                        <img class="DX_NoSel" src="https://d35aaqx5ub95lt.cloudfront.net/images/goals/62bb241121ae018b28240eebffb9fc4a.svg" alt="" style="width: 34px; height: 34px; object-fit: contain; flex-shrink: 0;">
                        <div class="DX_Row_Text">
                            <p class="DX_T1 DX_NoSel" style="font-size: 14px; font-weight: 600;">Automations</p>
                            <p class="DX_T2 DX_NoSel">Configure automated background tasks</p>
                        </div>
                    </div>
                    <div style="align-self: stretch; display: flex; flex-direction: column; width: 100%;">
                        <div class="DX_VStack_8" style="align-self: stretch;">
                            <div class="DX_Setting_Row">
                                <div class="DX_Row_Text">
                                    <p class="DX_T1 DX_NoSel">Auto Join League</p>
                                    <p class="DX_T2 DX_NoSel">Automatically join a league on startup</p>
                                </div>
                                <div class="DX_HStack_8" style="width: auto;">
                                    <div class="DX_Toggle" id="DX_AutoJoin_Toggle"><div class="DX_Toggle_Knob"></div></div>
                                </div>
                            </div>
                            <div class="DX_Divider"></div>
                            <div class="DX_Setting_Row">
                                <div class="DX_Row_Text">
                                    <p class="DX_T1 DX_NoSel">Auto Block League</p>
                                    <p class="DX_T2 DX_NoSel">Automatically block league users on startup</p>
                                </div>
                                <div class="DX_HStack_8" style="width: auto;">
                                    <div class="DX_Toggle" id="DX_AutoBlock_Toggle"><div class="DX_Toggle_Knob"></div></div>
                                </div>
                            </div>
                            <div class="DX_Divider"></div>
                            <div class="DX_Setting_Row">
                                <div class="DX_Row_Text">
                                    <p class="DX_T1 DX_NoSel">Auto Reach Rank</p>
                                    <p class="DX_T2 DX_NoSel">Automatically farm to target rank on startup</p>
                                </div>
                                <div class="DX_HStack_8" style="width: auto;">
                                    <div class="DX_Toggle" id="DX_AutoReach_Toggle"><div class="DX_Toggle_Knob"></div></div>
                                </div>
                            </div>
                            <div class="DX_Divider"></div>
                            <div class="DX_Setting_Row">
                                <div class="DX_Row_Text">
                                    <p class="DX_T1 DX_NoSel">Auto Keep Streak</p>
                                    <p class="DX_T2 DX_NoSel">Automatically maintain streak on startup</p>
                                </div>
                                <div class="DX_HStack_8" style="width: auto;">
                                    <div class="DX_Toggle" id="DX_AutoStreak_Toggle"><div class="DX_Toggle_Knob"></div></div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
                <div class="DX_Page" id="DX_Page_Stats">
                    <div class="DX_HStack_4 DX_NoSel DX_Back_Btn" id="DX_Stats_Back_Btn">
                        ${icons.back}
                        <p class="DX_T1">Back</p>
                    </div>
                    <div class="DX_HStack_4 DX_NoSel" style="align-self: stretch; gap: 8px; margin-bottom: 8px;">
                        <img class="DX_NoSel" src="https://d35aaqx5ub95lt.cloudfront.net/vendor/3390675b86eeeab0b4119ccfcb5b186e.svg" alt="" style="width: 34px; height: 34px; object-fit: contain; flex-shrink: 0;">
                        <div class="DX_Row_Text">
                            <p class="DX_T1 DX_NoSel" style="font-size: 14px; font-weight: 600;">About DuoXJS</p>
                            <p class="DX_T2 DX_NoSel">Your session metrics and credits</p>
                        </div>
                    </div>
                    <div class="DX_Scroll_Inner" style="max-height: 300px; width: 100%;">
                        <div class="DX_Panel_Card" id="DX_Changelog_Card" style="margin-bottom: 8px; display: none;">
                            <p class="DX_T1 DX_NoSel" style="font-weight: 800; margin-bottom: 6px;">Changelog</p>
                            <div id="DX_Changelog" style="width: 100%;">
                                <p class="DX_T2 DX_NoSel" style="text-align: center;">Loading changelog...</p>
                            </div>
                        </div>
                        <div class="DX_Panel_Card">
                            <div class="DX_HStack_Auto" style="align-self: stretch;">
                                <p class="DX_T1 DX_NoSel" style="font-weight: 800;">v${dxVersion} Stats</p>
                                <span class="DX_T2 DX_NoSel" id="DX_Stats_Reset" style="font-size: 11px; cursor: pointer; opacity: 0.6;">Reset</span>
                            </div>
                            <div class="DX_HStack_Auto" style="align-self: stretch;">
                                <p class="DX_T2 DX_NoSel">XP Gained</p>
                                <p class="DX_T1 DX_NoSel" id="DX_Stat_XP">0</p>
                            </div>
                            <div class="DX_HStack_Auto" style="align-self: stretch;">
                                <p class="DX_T2 DX_NoSel">Gems Gained</p>
                                <p class="DX_T1 DX_NoSel" id="DX_Stat_Gems">0</p>
                            </div>
                            <div class="DX_HStack_Auto" style="align-self: stretch;">
                                <p class="DX_T2 DX_NoSel">Streak Gained</p>
                                <p class="DX_T1 DX_NoSel" id="DX_Stat_Streak">0</p>
                            </div>
                            <div class="DX_Divider" style="margin: 2px 0;"></div>
                            <div class="DX_HStack_Auto" style="align-self: stretch;">
                                <p class="DX_T2 DX_NoSel">Since</p>
                                <p class="DX_T2 DX_NoSel" id="DX_Stat_Since" style="opacity: 1;">—</p>
                            </div>
                            <div class="DX_Divider" style="margin: 2px 0;"></div>
                            <div style="display: flex; flex-direction: column; align-items: center; gap: 3px; margin-top: 2px; align-self: stretch;">
                                <p class="DX_T2 DX_NoSel" style="text-align: center; font-size: 11px; line-height: 1.4; opacity: 1; margin: 0;">Created by <span class="DX_Hover_1" id="DX_Credit_LibreDuo" style="color: var(--dx-link-color); font-weight: 700; cursor: pointer;">LibreDuo</span> under <a href="https://github.com/LibreDuo/DuoXJS/blob/main/LICENSE" target="_blank" style="color: var(--dx-link-color); font-weight: 700; text-decoration: none;" class="DX_Hover_1">MIT license</a></p>
                                <span class="DX_Hover_1" id="DX_Open_Terms_Btn" style="color: var(--dx-link-color); font-size: 11px; font-weight: 700; cursor: pointer;">EULA & TOS</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="DX_Page" id="DX_Page_XPSummaries">
                    <div class="DX_HStack_4 DX_NoSel DX_Back_Btn" id="DX_XPSummaries_Back_Btn">
                        ${icons.back}
                        <p class="DX_T1">Back</p>
                    </div>
                    <div class="DX_HStack_4 DX_NoSel" style="align-self: stretch; gap: 8px; margin-bottom: 8px;">
                        <img src="${icons.xpIcon}" alt="" style="width: 34px; height: 34px; flex-shrink: 0; object-fit: contain;">
                        <div class="DX_Row_Text">
                            <p class="DX_T1 DX_NoSel" style="font-size: 14px; font-weight: 600;">XP Summaries</p>
                            <p class="DX_T2 DX_NoSel">Your recent XP history</p>
                        </div>
                    </div>
                    <div class="DX_Panel_Card" style="display: flex; flex-direction: column; width: 100%; box-sizing: border-box;">
                        <div id="DX_XPHistory" class="DX_Scroll_Inner" style="max-height: 300px; width: 100%;">
                            <p class="DX_T2 DX_NoSel" style="text-align: center;">Loading...</p>
                        </div>
                    </div>
                </div>
                <div class="DX_Page" id="DX_Page_Status">
                    <div class="DX_HStack_4 DX_NoSel DX_Back_Btn" id="DX_Status_Back_Btn">
                        ${icons.back}
                        <p class="DX_T1">Back</p>
                    </div>
                    <div class="DX_HStack_4 DX_NoSel" style="align-self: stretch; gap: 8px; margin-bottom: 8px;">
                        <img class="DX_NoSel" src="${DUO_LEAGUES_CDN + "6df6337370e45c1b9a5029e78211d114.svg"}" alt="" style="width: 34px; height: 34px; object-fit: contain; flex-shrink: 0;">
                        <div class="DX_Row_Text">
                            <p class="DX_T1 DX_NoSel" style="font-size: 14px; font-weight: 600;">Status Manager</p>
                            <p class="DX_T2 DX_NoSel">Set your active Duolingo status emoji</p>
                        </div>
                    </div>
                    <input type="text" class="DX_Search DX_NoSel" id="DX_Status_Search" placeholder="Search statuses..." style="">
                    <div class="DX_Scroll_Inner" id="DX_Status_Container" style="max-height: 300px;">
                        <p class="DX_T2 DX_NoSel" style="text-align: center; padding: 8px 0;">Loading...</p>
                    </div>
                </div>
                <div class="DX_Page" id="DX_Page_Shop">
                    <div class="DX_HStack_4 DX_NoSel DX_Back_Btn" id="DX_Shop_Back_Btn">
                        ${icons.back}
                        <p class="DX_T1">Back</p>
                    </div>
                    <div class="DX_HStack_4 DX_NoSel" style="align-self: stretch; gap: 8px; margin-bottom: 8px;">
                        <img class="DX_NoSel" src="https://d35aaqx5ub95lt.cloudfront.net/vendor/0e58a94dda219766d98c7796b910beee.svg" alt="" style="width: 34px; height: 34px; object-fit: contain; flex-shrink: 0;">
                        <div class="DX_Row_Text">
                            <p class="DX_T1 DX_NoSel" style="font-size: 14px; font-weight: 600;">Shop Items</p>
                            <p class="DX_T2 DX_NoSel">Purchase boosts and power-ups</p>
                        </div>
                    </div>
                    <input type="text" class="DX_Search DX_NoSel" id="DX_Shop_Search" placeholder="Search items..." style="">
                    <div class="DX_Scroll_Inner" id="DX_Shop_Container" style="max-height: 300px;">
                        <p class="DX_T2 DX_NoSel" style="text-align: center; padding: 8px 0;">Loading...</p>
                    </div>
                </div>
                <div class="DX_Page" id="DX_Page_Quests">
                    <div class="DX_HStack_4 DX_NoSel DX_Back_Btn" id="DX_Quests_Back_Btn">
                        ${icons.back}
                        <p class="DX_T1">Back</p>
                    </div>
                    <div class="DX_HStack_4 DX_NoSel" style="align-self: stretch; gap: 8px; margin-bottom: 8px;">
                        <img class="DX_NoSel" src="https://d35aaqx5ub95lt.cloudfront.net/vendor/7ef36bae3f9d68fc763d3451b5167836.svg" alt="" style="width: 34px; height: 34px; flex-shrink: 0; object-fit: contain;">
                        <div class="DX_Row_Text">
                            <p class="DX_T1 DX_NoSel" style="font-size: 14px; font-weight: 600;">Quest Center</p>
                            <p class="DX_T2 DX_NoSel">Manage and view your daily quests</p>
                        </div>
                    </div>
                    <div class="DX_Farm_Sec">
                        <div class="DX_HStack_Auto" style="align-self: stretch;">
                            <p class="DX_T1 DX_NoSel" style="font-size: 14px; font-weight: 600;">Quest Operations</p>
                            <button class="DX_Sm_Btn DX_NoSel" id="DX_Quest_Force_Btn" disabled style="height: 28px; padding: 0 12px; min-width: auto; border-radius: var(--DX-r-s);">
                                <span class="DX_Sm_Btn_Label" style="color: #fff; font-size: 11px; font-weight: 800; letter-spacing: 0.5px;">FORCE ALL</span>
                            </button>
                        </div>
                        <div class="DX_Prog_Wrap" id="DX_QuestForce_Prog" style="align-self: stretch;">
                            <div class="DX_Prog_Fill" id="DX_QuestForce_Fill"></div>
                        </div>
                    </div>
                    <input type="text" class="DX_Search DX_NoSel" id="DX_Quest_Search" placeholder="Search quests..." style="">
                    <div id="DX_Quest_Container" class="DX_Scroll_Inner" style="max-height: 300px; width: 100%;">
                        <p class="DX_T2 DX_NoSel" style="text-align: center; padding: 8px 0;">Loading...</p>
                    </div>
                </div>
                <div class="DX_Page" id="DX_Page_AccountManager">
                    <div class="DX_HStack_4 DX_NoSel DX_Back_Btn" id="DX_AccMgr_Back_Btn">
                        ${icons.back}
                        <p class="DX_T1">Back</p>
                    </div>
                    <div class="DX_HStack_4 DX_NoSel" style="align-self: stretch; gap: 8px; margin-bottom: 8px;">
                        <img class="DX_NoSel" src="https://d35aaqx5ub95lt.cloudfront.net/images/super/11db6cd6f69cb2e3c5046b915be8e669.svg" alt="" style="width: 34px; height: 34px; object-fit: contain; flex-shrink: 0;">
                        <div class="DX_Row_Text">
                            <p class="DX_T1 DX_NoSel" style="font-size: 14px; font-weight: 600;">Account Manager</p>
                            <p class="DX_T2 DX_NoSel">Switch and manage saved profiles</p>
                        </div>
                    </div>
                    <div class="DX_Farm_Sec">
                        <div class="DX_HStack_Auto" style="align-self: stretch;">
                            <p class="DX_T1 DX_NoSel" style="font-size: 14px; font-weight: 600;">Saved Profiles</p>
                            <button class="DX_Sm_Btn DX_NoSel" id="DX_AccSave_Btn" style="height: 28px; padding: 0 12px; min-width: auto; border-radius: var(--DX-r-s);">
                                <span class="DX_Sm_Btn_Label" style="color: #fff; font-size: 11px; font-weight: 800; letter-spacing: 0.5px;">SAVE CURRENT</span>
                            </button>
                        </div>
                    </div>
                    <div class="DX_Divider"></div>
                    <div id="DX_AccList_Wrap" class="DX_Scroll_Inner" style="max-height: 300px; width: 100%; display: flex; flex-direction: column; gap: 8px;">
                        <p class="DX_T2 DX_NoSel" style="text-align: center; padding: 8px 0;">No saved accounts.</p>
                    </div>
                </div>
                <div class="DX_Page" id="DX_Page_Terms">
                    <div class="DX_HStack_Auto" style="align-self: stretch; margin-bottom: 4px;">
                        <div class="DX_NoSel" style="display: flex; flex-direction: column; justify-content: center; gap: 2px;">
                            <div class="DX_Wordmark DX_NoSel">
                                <span style="color: var(--dx-text);">Duo</span>
                                <span class="dx-xjs">XJS</span>
                            </div>
                            <span class="DX_T2" style="font-size: 11px; font-weight: 700; letter-spacing: 0.4px; opacity: 0.6; line-height: 1;">v${dxVersion}</span>
                        </div>
                        <div class="DX_Row_Text" style="text-align: right;">
                            <p class="DX_T1 DX_NoSel" style="font-size: 13px; font-weight: 700; color: var(--dx-text);">EULA & TOS</p>
                            <p class="DX_T2 DX_NoSel" id="DX_Terms_Status" style="font-size: 10px;">Please read and accept</p>
                        </div>
                    </div>
                    <div class="DX_Divider"></div>
                    <div id="DX_Terms_Content" class="DX_Scroll_Inner DX_Selectable" style="max-height: 250px; font-size: 11px; line-height: 1.5; color: var(--dx-text); white-space: pre-wrap; padding: 10px; background: var(--dx-card-bg); outline: 1px solid var(--dx-card-border); outline-offset: -1px; border-radius: var(--DX-r-s); align-self: stretch; text-align: left;">Loading terms...</div>
                    <div class="DX_Divider"></div>
                    <div class="DX_HStack_8" style="margin-top: 4px;">
                        <button class="DX_Sm_Btn DX_Btn_Eel DX_NoSel" id="DX_Terms_Decline_Btn" style="flex: 1; outline-color: transparent;">
                            <span class="DX_Sm_Btn_Label" style="color: var(--dx-text);">DECLINE</span>
                        </button>
                        <button class="DX_Sm_Btn DX_NoSel" id="DX_Terms_Accept_Btn" style="flex: 1;">
                            <span class="DX_Sm_Btn_Label" style="color: #fff;">ACCEPT</span>
                        </button>
                    </div>
                </div>
                <div class="DX_Page" id="DX_Page_Tools">
                    <div class="DX_HStack_4 DX_NoSel DX_Back_Btn" id="DX_Tools_Back_Btn">
                        ${icons.back}
                        <p class="DX_T1">Back</p>
                    </div>
                    <div class="DX_HStack_4 DX_NoSel" style="align-self: stretch; gap: 8px; margin-bottom: 8px;">
                        <img class="DX_NoSel" src="${DUO_LEAGUES_CDN}a8e5c18e80054228b2c61168846ff643.svg" alt="" style="width: 34px; height: 34px; object-fit: contain; flex-shrink: 0;">
                        <div class="DX_Row_Text">
                            <p class="DX_T1 DX_NoSel" style="font-size: 14px; font-weight: 600;">Social Tools</p>
                            <p class="DX_T2 DX_NoSel">Interact with other Duolingo users</p>
                        </div>
                    </div>
                    <div class="DX_VStack_8" style="align-self: stretch;">
                        <div class="DX_Set_Input_Wrap" style="align-self: stretch;">
                            <input type="text" class="DX_Input DX_NoSel" id="DX_Tools_User" placeholder="Target username">
                        </div>
                        <div class="DX_Compact_Task">
                            <div class="DX_Row_Text">
                                <p class="DX_T1 DX_NoSel">Block / Unblock</p>
                                <p class="DX_T2 DX_NoSel">Block or unblock the specified user</p>
                            </div>
                            <div class="DX_Select" id="DX_Block_Select" data-value="block" style="width: 98px; flex-shrink: 0;">
                                <div class="DX_Select_Trigger">
                                    <span class="DX_Select_Text">Block</span>${icons.chevron}
                                </div>
                                <div class="DX_Select_Options">
                                    <div class="DX_Select_Option selected" data-value="block">Block</div>
                                    <div class="DX_Select_Option" data-value="unblock">Unblock</div>
                                </div>
                            </div>
                            <button class="DX_Sm_Btn DX_NoSel" id="DX_Block_Btn" disabled>
                                <span class="DX_Sm_Btn_Label" style="color: #fff;">RUN</span>
                            </button>
                        </div>
                        <div class="DX_Compact_Task">
                            <div class="DX_Row_Text">
                                <p class="DX_T1 DX_NoSel">Follow / Unfollow</p>
                                <p class="DX_T2 DX_NoSel">Follow or unfollow the specified user</p>
                            </div>
                            <div class="DX_Select" id="DX_FollowSingle_Select" data-value="follow" style="width: 98px; flex-shrink: 0;">
                                <div class="DX_Select_Trigger">
                                    <span class="DX_Select_Text">Follow</span>${icons.chevron}
                                </div>
                                <div class="DX_Select_Options">
                                    <div class="DX_Select_Option selected" data-value="follow">Follow</div>
                                    <div class="DX_Select_Option" data-value="unfollow">Unfollow</div>
                                </div>
                            </div>
                            <button class="DX_Sm_Btn DX_NoSel" id="DX_FollowSingle_Btn" disabled>
                                <span class="DX_Sm_Btn_Label" style="color: #fff;">RUN</span>
                            </button>
                        </div>
                        <div class="DX_Compact_Task">
                            <div class="DX_Row_Text">
                                <p class="DX_T1 DX_NoSel">Send Gift</p>
                                <p class="DX_T2 DX_NoSel">Gift an item to the specified user</p>
                            </div>
                            <div class="DX_Select" id="DX_Gift_Select" data-value="streak_freeze_gift" style="width: 98px; flex-shrink: 0;">
                                <div class="DX_Select_Trigger">
                                    <span class="DX_Select_Text">Freeze</span>${icons.chevron}
                                </div>
                                <div class="DX_Select_Options">
                                    <div class="DX_Select_Option selected" data-value="streak_freeze_gift">Freeze</div>
                                    <div class="DX_Select_Option" data-value="xp_boost_15_gift">XP Boost</div>
                                </div>
                            </div>
                            <button class="DX_Sm_Btn DX_NoSel" id="DX_Gift_Btn" disabled>
                                <span class="DX_Sm_Btn_Label" style="color: #fff;">RUN</span>
                            </button>
                        </div>
                        <div class="DX_Compact_Task">
                            <div class="DX_Row_Text">
                                <p class="DX_T1 DX_NoSel">Friend Streak / Quest</p>
                                <p class="DX_T2 DX_NoSel">Start a Friends Quest or Friends Streak</p>
                            </div>
                            <div class="DX_Select" id="DX_Friend_Select" data-value="streak" style="width: 98px; flex-shrink: 0;">
                                <div class="DX_Select_Trigger">
                                    <span class="DX_Select_Text">Streak</span>${icons.chevron}
                                </div>
                                <div class="DX_Select_Options">
                                    <div class="DX_Select_Option selected" data-value="streak">Streak</div>
                                    <div class="DX_Select_Option" data-value="quest">Quest</div>
                                </div>
                            </div>
                            <button class="DX_Sm_Btn DX_NoSel" id="DX_Friend_Btn" disabled>
                                <span class="DX_Sm_Btn_Label" style="color: #fff;">RUN</span>
                            </button>
                        </div>
                        <div class="DX_Divider"></div>
                        <div class="DX_Task_Group">
                            <div class="DX_Compact_Task">
                                <div class="DX_Row_Text">
                                    <p class="DX_T1 DX_NoSel">Mass Follow</p>
                                    <p class="DX_T2 DX_NoSel">Follow or unfollow in bulk</p>
                                </div>
                                <div class="DX_Select" id="DX_Follow_Select" data-value="follow" style="width: 98px; flex-shrink: 0;">
                                    <div class="DX_Select_Trigger">
                                        <span class="DX_Select_Text">Follow</span>${icons.chevron}
                                    </div>
                                    <div class="DX_Select_Options">
                                        <div class="DX_Select_Option selected" data-value="follow">Follow</div>
                                        <div class="DX_Select_Option" data-value="unfollow">Unfollow</div>
                                    </div>
                                </div>
                                <button class="DX_Sm_Btn DX_NoSel" id="DX_Follow_Btn" disabled>
                                    <span class="DX_Sm_Btn_Label" style="color: #fff;">RUN</span>
                                </button>
                            </div>
                            <div class="DX_Prog_Wrap" id="DX_Follow_Prog">
                                <div class="DX_Prog_Fill" id="DX_Follow_Fill"></div>
                            </div>
                        </div>
                        <div class="DX_Task_Group">
                            <div class="DX_Compact_Task">
                                <div class="DX_Row_Text">
                                    <p class="DX_T1 DX_NoSel">Mass Block</p>
                                    <p class="DX_T2 DX_NoSel">Block or unblock your league</p>
                                </div>
                                <div class="DX_Select" id="DX_BlockMass_Select" data-value="block" style="width: 98px; flex-shrink: 0;">
                                    <div class="DX_Select_Trigger">
                                        <span class="DX_Select_Text">Block</span>${icons.chevron}
                                    </div>
                                    <div class="DX_Select_Options">
                                        <div class="DX_Select_Option selected" data-value="block">Block</div>
                                        <div class="DX_Select_Option" data-value="unblock">Unblock</div>
                                    </div>
                                </div>
                                <button class="DX_Sm_Btn DX_NoSel" id="DX_Block_Mass_Btn" disabled>
                                    <span class="DX_Sm_Btn_Label" style="color: #fff;">RUN</span>
                                </button>
                            </div>
                            <div class="DX_Prog_Wrap" id="DX_Block_Mass_Prog">
                                <div class="DX_Prog_Fill" id="DX_Block_Mass_Fill"></div>
                            </div>
                        </div>
                        <div class="DX_Divider"></div>
                        <div class="DX_Compact_Task">
                            <div class="DX_Row_Text">
                                <p class="DX_T1 DX_NoSel">Privacy Status</p>
                                <p class="DX_T2 DX_NoSel">Change privacy status</p>
                            </div>
                            <div class="DX_Select" id="DX_Privacy_Select" data-value="public" style="width: 98px; flex-shrink: 0;">
                                <div class="DX_Select_Trigger">
                                    <span class="DX_Select_Text">Public</span>${icons.chevron}
                                </div>
                                <div class="DX_Select_Options">
                                    <div class="DX_Select_Option selected" data-value="public">Public</div>
                                    <div class="DX_Select_Option" data-value="private">Private</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="DX_Page" id="DX_Page_Board">
                    <div class="DX_HStack_4 DX_NoSel DX_Back_Btn" id="DX_Board_Back_Btn">
                        ${icons.back}
                        <p class="DX_T1">Back</p>
                    </div>
                    <div class="DX_HStack_4 DX_NoSel" style="align-self: stretch; gap: 8px; margin-bottom: 8px;">
                        <img id="DX_Board_Tier_Ico" src="${leagueBadgeUrl()}" alt="" style="width: 34px; height: 34px; flex-shrink: 0; object-fit: contain;">
                        <div class="DX_Row_Text">
                            <p id="DX_Board_Tier_Name" class="DX_T1 DX_NoSel" style="font-size: 14px; font-weight: 600;">Leaderboard</p>
                            <p class="DX_T2 DX_NoSel">Your current league</p>
                        </div>
                    </div>
                    <div class="DX_Btn DX_Btn_Blue_Ghost DX_NoSel DX_Nav_Btn" id="DX_Board_Status_Btn" style="align-self: stretch;">
                        <div class="DX_Nav_Btn_L">
                            <span id="DX_Board_Status_Ico" style="width: 22px; height: 22px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 15px; line-height: 1; overflow: hidden;">
                                <img src="${DUO_LEAGUES_CDN + "6df6337370e45c1b9a5029e78211d114.svg"}" alt="" style="width: 22px; height: 22px; object-fit: contain;">
                            </span>
                            <p class="DX_Nav_Title DX_NoSel">Set your status</p>
                        </div>
                        ${icons.arrowRight}
                    </div>
                    <div class="DX_Divider" style=""></div>
                    <div id="DX_Board_Container" class="DX_Scroll_Inner" style="max-height: 300px; width: 100%;"></div>
                </div>
                <div class="DX_Page" id="DX_Page_Feed">
                    <div class="DX_HStack_4 DX_NoSel DX_Back_Btn" id="DX_Feed_Back_Btn">
                        ${icons.back}
                        <p class="DX_T1">Back</p>
                    </div>
                    <div class="DX_HStack_4 DX_NoSel" style="align-self: stretch; gap: 8px;">
                        <img class="DX_NoSel" src="${DUO_LEAGUES_CDN}2ceb401cae52712705b66a77df83ce40.svg" alt="" style="width: 34px; height: 34px; object-fit: contain; flex-shrink: 0;">
                        <div class="DX_Row_Text">
                            <p class="DX_T1 DX_NoSel" style="font-size: 14px; font-weight: 600;">Activity Feed</p>
                            <p class="DX_T2 DX_NoSel">Recent activity from your friends</p>
                        </div>
                    </div>
                    <div id="DX_Feed_Container" class="DX_Scroll_Inner" style="max-height: 300px; width: 100%;"></div>
                </div>
                <div class="DX_Page" id="DX_Page_AutoSolver">
                    <div class="DX_HStack_4 DX_NoSel DX_Back_Btn" id="DX_AutoSolver_Back_Btn">
                        ${icons.back}
                        <p class="DX_T1">Back</p>
                    </div>
                    <div class="DX_HStack_4 DX_NoSel" style="align-self: stretch; gap: 8px; margin-bottom: 8px;">
                        <img class="DX_NoSel" src="https://d35aaqx5ub95lt.cloudfront.net/images/goals/39f13d2de304cad2ac2f88b31a7e2ff4.svg" alt="" style="width: 34px; height: 34px; object-fit: contain; flex-shrink: 0;">
                        <div class="DX_Row_Text">
                            <p class="DX_T1 DX_NoSel" style="font-size: 14px; font-weight: 600;">Auto Solver</p>
                            <p class="DX_T2 DX_NoSel">Configure question auto-solving settings</p>
                        </div>
                    </div>
                    <div style="align-self: stretch; display: flex; flex-direction: column; width: 100%;">
                        <div class="DX_VStack_8" style="align-self: stretch;">
                            <div class="DX_Setting_Row">
                                <div class="DX_Row_Text">
                                    <p class="DX_T1 DX_NoSel">Show Solve Buttons</p>
                                    <p class="DX_T2 DX_NoSel">Show Solve/Solve All buttons in footer</p>
                                </div>
                                <div class="DX_HStack_8" style="width: auto;">
                                    <div class="DX_Toggle" id="DX_SolverButtons_Toggle"><div class="DX_Toggle_Knob"></div></div>
                                </div>
                            </div>
                            <div class="DX_Divider"></div>
                            <div class="DX_Setting_Row">
                                <div class="DX_Row_Text">
                                    <p class="DX_T1 DX_NoSel">Auto Solve Mode</p>
                                    <p class="DX_T2 DX_NoSel">Solve questions automatically on start</p>
                                </div>
                                <div class="DX_HStack_8" style="width: auto;">
                                    <div class="DX_Toggle" id="DX_AutoSolver_Toggle"><div class="DX_Toggle_Knob"></div></div>
                                </div>
                            </div>
                            <div class="DX_Divider"></div>
                            <div class="DX_Setting_Row">
                                <div class="DX_Row_Text">
                                    <p class="DX_T1 DX_NoSel">Safe Solver Mode</p>
                                    <p class="DX_T2 DX_NoSel">Mimic human typing speed and delays in lessons</p>
                                </div>
                                <div class="DX_HStack_8" style="width: auto;">
                                    <div class="DX_Toggle" id="DX_SafeSolver_Toggle"><div class="DX_Toggle_Knob"></div></div>
                                </div>
                            </div>
                            <div class="DX_Divider"></div>
                            <div class="DX_Setting_Row">
                                <div class="DX_Row_Text">
                                    <p class="DX_T1 DX_NoSel">Random Speed</p>
                                    <p class="DX_T2 DX_NoSel">Wait a random delay before solving</p>
                                </div>
                                <div class="DX_HStack_8" style="width: auto;">
                                    <div class="DX_Toggle" id="DX_RandomSpeed_Toggle"><div class="DX_Toggle_Knob"></div></div>
                                </div>
                            </div>
                            <div class="DX_Divider"></div>
                            <div class="DX_Setting_Row">
                                <div class="DX_Row_Text">
                                    <p class="DX_T1 DX_NoSel">Solve Speed (Fixed)</p>
                                    <p class="DX_T2 DX_NoSel">Delay if random speed is disabled</p>
                                </div>
                                <div class="DX_HStack_8" style="width: auto;">
                                    <div class="DX_Set_Input_Wrap" style="width: 116px;">
                                        <input type="number" class="DX_Input DX_NoSel" id="DX_SolveSpeed_Input" placeholder="400">
                                        <p class="DX_T1 DX_NoSel" style="color: var(--dx-text); font-size: 13px; flex-shrink: 0; opacity: 0.8; margin-left: 6px;">ms</p>
                                    </div>
                                </div>
                            </div>
                            <div class="DX_Divider"></div>
                            <div class="DX_Setting_Row">
                                <div class="DX_Row_Text">
                                    <p class="DX_T1 DX_NoSel">Min Solve Speed</p>
                                    <p class="DX_T2 DX_NoSel">Minimum delay for random speed</p>
                                </div>
                                <div class="DX_HStack_8" style="width: auto;">
                                    <div class="DX_Set_Input_Wrap" style="width: 116px;">
                                        <input type="number" step="0.1" class="DX_Input DX_NoSel" id="DX_SolveSpeedMin_Input" placeholder="2.8">
                                        <p class="DX_T1 DX_NoSel" style="color: var(--dx-text); font-size: 13px; flex-shrink: 0; opacity: 0.8; margin-left: 6px;">sec</p>
                                    </div>
                                </div>
                            </div>
                            <div class="DX_Divider"></div>
                            <div class="DX_Setting_Row">
                                <div class="DX_Row_Text">
                                    <p class="DX_T1 DX_NoSel">Max Solve Speed</p>
                                    <p class="DX_T2 DX_NoSel">Maximum delay for random speed</p>
                                </div>
                                <div class="DX_HStack_8" style="width: auto;">
                                    <div class="DX_Set_Input_Wrap" style="width: 116px;">
                                        <input type="number" step="0.1" class="DX_Input DX_NoSel" id="DX_SolveSpeedMax_Input" placeholder="12.4">
                                        <p class="DX_T1 DX_NoSel" style="color: var(--dx-text); font-size: 13px; flex-shrink: 0; opacity: 0.8; margin-left: 6px;">sec</p>
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
      `<style id="dx-style-inject">${mainCss}${loadCss}</style>`,
    );
  }
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div id="DX_Root">${uiHtml}</div>`,
  );

  let token = null;
  let userId = null;

  if (localStorage.getItem("dx_ez_quiz") === null) {
    localStorage.setItem("dx_ez_quiz", "false");
  }
  if (localStorage.getItem("dx_ez_quiz_len") === null) {
    localStorage.setItem("dx_ez_quiz_len", "5");
  }
  if (localStorage.getItem("dx_safe_streak") === null) {
    localStorage.setItem("dx_safe_streak", "true");
  }
  if (localStorage.getItem("dx_safe_solver") === null) {
    localStorage.setItem("dx_safe_solver", "false");
  }

  if (localStorage.getItem("dx_path_inf") === null) {
    localStorage.setItem("dx_path_inf", "true");
  }
  if (localStorage.getItem("dx_practice_inf") === null) {
    localStorage.setItem("dx_practice_inf", "true");
  }
  if (localStorage.getItem("dx_legendary_inf") === null) {
    localStorage.setItem("dx_legendary_inf", "true");
  }

  let solverButtonsEnabled =
    localStorage.getItem("dx_solver_buttons") !== "false";
  let autoSolverEnabled = localStorage.getItem("dx_auto_solver") === "true";
  let randomSpeedEnabled = localStorage.getItem("dx_random_speed") === "true";
  let solveSpeedMin =
    parseFloat(localStorage.getItem("dx_solve_speed_min")) || 2.8;
  let solveSpeedMax =
    parseFloat(localStorage.getItem("dx_solve_speed_max")) || 12.4;
  let solveSpeedFixed =
    parseInt(localStorage.getItem("dx_solve_speed_fixed")) || 400;
  let autoPathEnabled = localStorage.getItem("dx_auto_path") === "true";
  let autoPracticeEnabled = localStorage.getItem("dx_auto_practice") === "true";
  let autoLegendaryEnabled =
    localStorage.getItem("dx_auto_legendary") === "true";
  let pathLessonsRemaining = Infinity;
  let practiceLessonsRemaining = Infinity;
  let legendaryLessonsRemaining = Infinity;
  let hasDecrementedForCurrentLesson = false;

  let isAutoMode = false;
  let solverPausedByUser = false;
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
  let uiHidden = localStorage.getItem("dx_ui_hidden") === "true";
  let hideCollapseTimer = null;
  let hideShowContentTimer = null;
  let panelCorner = localStorage.getItem("dx_panel_corner") || "br";
  let oldToken = null;
  let delayMs = (() => {
    const storedDelay = parseInt(localStorage.getItem("dx_delay") || "100", 10);
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

  let connectBusy = false;
  let refreshStatsBusy = false;
  let questSaverBusy = false;
  let leagueCheckBusy = false;
  let xpHistoryBusy = false;
  let feedBusy = false;
  let checkForUpdatesBusy = false;
  let accRefreshBusy = false;
  const DX_DRAG_SNAP_MS = 400;

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
      "User-Agent": dxUserAgent,
      "x-amzn-trace-id": "User=" + userId,
    };
  }

  function setGoalHeaders(tokenStr) {
    return {
      "Content-Type": "application/json",
      "x-requested-with": "XMLHttpRequest",
      accept: "application/json; charset=UTF-8",
      Authorization: "Bearer " + tokenStr,
      "User-Agent": dxUserAgent,
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

    const gmRequest = () => {
      return new Promise((resolve) => {
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
    };

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    const useFetch = isMobile || typeof GM_xmlhttpRequest === "undefined";

    if (useFetch) {
      const safeHeaders = {};
      for (const key in rawHeaders) {
        if (!forbiddenHeaders[key.toLowerCase()]) {
          safeHeaders[key] = rawHeaders[key];
        }
      }

      return fetch(url, {
        method: method,
        headers: safeHeaders,
        body: method === "GET" || method === "HEAD" ? undefined : body,
        credentials: anonymous ? "omit" : "include",
        mode: "cors",
        signal: signal || undefined,
      })
        .then((res) =>
          res
            .text()
            .then((text) => ({ status: res.status, responseText: text })),
        )
        .catch(() => {
          if (signal && signal.aborted) return { status: 0, responseText: "" };
          return gmRequest();
        });
    }

    return gmRequest();
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

  function stopAllFarmingTasks() {
    if (farmStates.xp) {
      stopFarm("xp");
      const xpBtn = document.getElementById("DX_XP_Btn");
      if (xpBtn) resetBtn("DX_XP_Btn", "RUN");
    }
    if (farmStates.gem) {
      stopFarm("gem");
      const gemBtn = document.getElementById("DX_Gem_Btn");
      if (gemBtn) resetBtn("DX_Gem_Btn", "RUN");
    }
    if (farmStates.streak) {
      stopFarm("streak");
      const streakBtn = document.getElementById("DX_Streak_Btn");
      if (streakBtn) resetBtn("DX_Streak_Btn", "RUN");
    }
    if (farmStates.league) {
      stopFarm("league");
      const leagueBtn = document.getElementById("DX_League_Btn");
      if (leagueBtn) resetBtn("DX_League_Btn", "RUN");
    }
  }

  function stopAllSolverModes() {
    autoPathEnabled = false;
    localStorage.setItem("dx_auto_path", "false");
    const pathBtn = document.getElementById("DX_AutoPath_Btn");
    if (pathBtn) resetBtn("DX_AutoPath_Btn", "RUN");

    autoPracticeEnabled = false;
    localStorage.setItem("dx_auto_practice", "false");
    const pracBtn = document.getElementById("DX_AutoPractice_Btn");
    if (pracBtn) resetBtn("DX_AutoPractice_Btn", "RUN");

    autoLegendaryEnabled = false;
    localStorage.setItem("dx_auto_legendary", "false");
    const legendaryBtn = document.getElementById("DX_AutoLegendary_Btn");
    if (legendaryBtn) resetBtn("DX_AutoLegendary_Btn", "RUN");

    window.dispatchEvent(new CustomEvent("DX_StopSolver"));
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
    const container = document.getElementById("DX_Notif_Main");
    if (!container) {
      return;
    }

    const safeType = ["info", "success", "error", "warning"].includes(type)
      ? type
      : "info";
    const element = document.createElement("div");
    element.className = "DX_Notif_Box " + safeType;

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

    let cleanTitle = title || "";
    const titleMap = {
      "Auto Keep Streak": "Auto Streak",
      "Auto Reach Rank": "Auto League",
      "Goal Reached": "Auto League",
      "Auto League Stopped": "Auto League",
      "Auto Quest Saver": "Quest Center",
      "Quest Center": "Quest Center",
      Shop: "Shop Items",
      "Send Gift": "Social Tools",
      "Mass Follow": "Social Tools",
      "Mass Unfollow": "Social Tools",
      "Mass Block": "Social Tools",
      "Mass Unblock": "Social Tools",
      "Follow User": "Social Tools",
      "Unfollow User": "Social Tools",
      "Block User": "Social Tools",
      "Unblock User": "Social Tools",
      "Quest Invite": "Social Tools",
      "Streak Invite": "Social Tools",
      "Leaderboard Status": "Leaderboard",
    };
    if (titleMap[cleanTitle]) {
      cleanTitle = titleMap[cleanTitle];
    }

    let cleanBody = body || "";
    if (cleanBody && typeof cleanBody === "string") {
      cleanBody = cleanBody.trim();
      if (cleanBody.length > 0) {
        cleanBody = cleanBody.charAt(0).toUpperCase() + cleanBody.slice(1);
        if (!/[.!?]$/.test(cleanBody)) {
          cleanBody += ".";
        }
      }
    }

    element.innerHTML = `
            <div class="DX_Notif_Ico">${iconMarkup}</div>
            <div>
                <div class="DX_Notif_Title DX_NoSel"></div>
                <div class="DX_Notif_Body DX_NoSel"></div>
            </div>
        `;
    const titleEl = element.querySelector(".DX_Notif_Title");
    const bodyEl = element.querySelector(".DX_Notif_Body");
    if (titleEl) titleEl.textContent = cleanTitle;
    if (bodyEl) bodyEl.textContent = cleanBody;

    container.prepend(element);

    const h = element.offsetHeight;
    const atTop = notifPos.indexOf("top") === 0;

    const isLeft = notifPos.indexOf("left") !== -1;
    const isRight = notifPos.indexOf("right") !== -1;
    let initTransform = `translate3d(0, ${atTop ? -40 : 40}px, 0) scale(0.85)`;
    if (isLeft) {
      initTransform = "translate3d(-40px, 0, 0) scale(0.85)";
    } else if (isRight) {
      initTransform = "translate3d(40px, 0, 0) scale(0.85)";
    }
    element.style.transform = initTransform;

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
    const banner = document.getElementById("DX_Update_Banner");
    const verText = document.getElementById("DX_Update_Version_Text");
    if (!banner || !verText) return;
    verText.innerText = `Version ${version} is now available`;
    banner.dataset.version = version;
    banner.classList.add("on");
    queueRelayout();
  }

  function hideUpdateBanner() {
    const banner = document.getElementById("DX_Update_Banner");
    if (!banner) return;
    banner.classList.remove("on");
    queueRelayout();
  }

  function checkUpdateBannerFromCache() {
    const availableKey = "dx_update_available_version";
    const avail = localStorage.getItem(availableKey);
    if (avail && compareVersions(avail, dxScriptVersion) > 0) {
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
      return JSON.parse(localStorage.getItem("dx_accounts") || "[]");
    } catch {
      return [];
    }
  }

  function accSetAll(arr) {
    localStorage.setItem("dx_accounts", JSON.stringify(arr));
  }

  function accSaveCurrent() {
    if (!user || !token || !userId) {
      notify(
        "warning",
        "Account Manager",
        "Please wait for the connection to complete.",
      );
      return;
    }
    const all = accGetAll();
    if (all.find((a) => a.id == userId)) {
      notify("info", "Account Manager", "This profile is already saved.");
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
    notify(
      "success",
      "Account Manager",
      `Successfully saved profile: ${user.username}`,
    );
    renderAccounts();
    accRefreshAll();
  }

  function accRemove(id) {
    const all = accGetAll().filter((a) => a.id != id);
    accSetAll(all);
    renderAccounts();
    notify("success", "Account Manager", "Profile removed from list.");
  }

  function accLogin(id) {
    const acc = accGetAll().find((a) => a.id == id);
    if (!acc) {
      notify("error", "Account Manager", "Profile not found.");
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
    const wrap = document.getElementById("DX_AccList_Wrap");
    if (!wrap) return;
    const all = accGetAll();

    const countEl = document.getElementById("DX_UAccCount");
    if (countEl) {
      countEl.textContent =
        all.length === 1 ? "1 saved account" : `${all.length} saved accounts`;
    }

    if (all.length === 0) {
      wrap.innerHTML = `
                <p class="DX_T2 DX_NoSel" style="text-align:center;padding:8px 0;">
                    No saved accounts.
                </p>
            `;
      return;
    }
    wrap.innerHTML = "";
    all.forEach((acc) => {
      const card = document.createElement("div");
      card.className = "DX_Acc_Card";
      const isCurrentUser = userId && acc.id == userId;

      if (isCurrentUser) {
        card.style.outline = "1px solid rgba(var(--DX-blue), 0.5)";
        card.style.outlineOffset = "-1px";
        card.style.background = "rgba(var(--DX-blue), 0.08)";
      }

      const avatarDiv = document.createElement("div");
      avatarDiv.className = "DX_Acc_Avatar";
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
        subHtml = `<p class="DX_Acc_Sub DX_NoSel" style="color:rgb(var(--DX-red))!important;opacity:1;font-weight:700;">Re-login Needed</p>`;
      } else if (acc.status === "banned") {
        subHtml = `<p class="DX_Acc_Sub DX_NoSel" style="color:rgb(var(--DX-red))!important;opacity:1;font-weight:700;">Account Banned</p>`;
      } else {
        subHtml = `<p class="DX_Acc_Sub DX_NoSel">ID: ${acc.id}</p>`;
      }

      const infoDiv = document.createElement("div");
      infoDiv.className = "DX_Acc_Info";
      infoDiv.innerHTML = `
                <p class="DX_Acc_Name DX_NoSel">${acc.username}</p>
                ${subHtml}
            `;
      card.appendChild(infoDiv);

      const canLogin =
        !isCurrentUser &&
        !isExpired &&
        acc.status !== "relogin" &&
        acc.status !== "banned";
      const actionDiv = document.createElement("div");
      actionDiv.className = "DX_Acc_Action_Row";
      actionDiv.innerHTML = `
                ${canLogin ? `<button class="DX_Acc_Btn login" data-id="${acc.id}">LOG IN</button>` : ""}
                <button class="DX_Acc_Btn del" data-id="${acc.id}"><img src="https://d35aaqx5ub95lt.cloudfront.net/images/bd13fa941b2407b4914296afe4435646.svg" style="width: 12px; height: 12px; object-fit: contain; flex-shrink: 0;"></button>
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
    if (accRefreshBusy) return;
    accRefreshBusy = true;
    try {
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
                "User-Agent": dxUserAgent,
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
    } finally {
      accRefreshBusy = false;
    }
  }

  async function checkForUpdates() {
    if (checkForUpdatesBusy) return;
    checkForUpdatesBusy = true;
    const availableKey = "dx_update_available_version";
    const now = Date.now();

    try {
      const res = await fetchApi(
        "GET",
        dxUpdateMetaUrl + "?_=" + now,
        null,
        {},
      );
      if (res.status !== 200) return;

      const match = res.responseText.match(/@version\s+(\S+)/);
      if (!match) return;

      const remoteVersion = match[1].trim();
      if (compareVersions(remoteVersion, dxScriptVersion) > 0) {
        localStorage.setItem(availableKey, remoteVersion);
        showUpdateBanner(remoteVersion);
      } else {
        localStorage.removeItem(availableKey);
        hideUpdateBanner();
      }
    } catch {
    } finally {
      checkForUpdatesBusy = false;
    }
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
    const nMain = document.getElementById("DX_Notif_Main");
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
      btn.querySelector(".DX_Btn_Label") ||
      btn.querySelector(".DX_Sm_Btn_Label");
    if (!labelEl) {
      return;
    }

    btn.style.background = bg;
    btn.style.outline = `1px solid ${outline}`;
    btn.style.outlineOffset = "-1px";
    btn.style.setProperty("--focus-outline", outline);
    labelEl.style.color = color;
    labelEl.textContent = label;
  }

  function resetBtn(id, originalLabel) {
    styleBtn(
      id,
      "rgb(var(--DX-blue))",
      "rgba(0,0,0,0.2)",
      "#fff",
      originalLabel,
    );
  }

  function stopBtn(id) {
    styleBtn(
      id,
      "rgba(var(--DX-red),0.10)",
      "rgba(var(--DX-red),0.22)",
      "rgb(var(--DX-red))",
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
    const btn = document.getElementById("DX_Conn_Btn");
    const text = document.getElementById("DX_Conn_Txt");
    const icon = document.getElementById("DX_Conn_Ico");
    const content = document.getElementById("DX_Main_Content");

    if (!btn || !icon || !content) {
      return;
    }

    const countEl = document.getElementById("DX_UAccCount");
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
                <div class="dx-spinner" style="position: absolute; top: 0; left: 0; transition: opacity var(--DX-motion) var(--DX-ease), transform var(--DX-motion) var(--DX-ease);"></div>
                <img class="dx-tick-icon" src="https://d35aaqx5ub95lt.cloudfront.net/images/b377ec812acb8c96d87d52e8009478ad.svg" style="position: absolute; width: 20px; height: 20px; opacity: 0; transform: scale(0.5); transition: transform var(--DX-motion) var(--DX-ease), opacity var(--DX-motion) var(--DX-ease); object-fit: contain; flex-shrink: 0;">
            </div>
        `;

    btn.style.background = "var(--dx-card-bg)";
    btn.style.outline = "1px solid var(--dx-card-border)";
    btn.style.outlineOffset = "-1px";
    btn.style.color = "var(--dx-text)";

    if (status === "connecting") {
      if (text) text.innerText = "Connecting";
      icon.innerHTML = loaderHtml;
      content.classList.add("dx-disabled");
    } else if (status === "connected") {
      if (text) text.innerText = "Connected";
      content.classList.remove("dx-disabled");

      if (!icon.querySelector(".dx-spinner")) {
        icon.innerHTML = loaderHtml;
      }

      setTimeout(() => {
        const tick = icon.querySelector(".dx-tick-icon");
        const spinner = icon.querySelector(".dx-spinner");
        if (tick && spinner) {
          spinner.style.opacity = "0";
          spinner.style.transform =
            "scale3d(0.1, 0.1, 1) rotate3d(0, 0, 1, 90deg)";
          tick.style.opacity = "1";
          tick.style.transform = "scale(1)";
        }
      }, 50);
    } else if (status === "logged_out") {
      if (text) text.innerText = "Logged Out";
      icon.innerHTML = `
                <img class="dx-cross-icon" src="https://d35aaqx5ub95lt.cloudfront.net/images/bd13fa941b2407b4914296afe4435646.svg" style="width: 20px; height: 20px; object-fit: contain; flex-shrink: 0;">
            `;
      content.classList.add("dx-disabled");

      const userRowEl = document.getElementById("DX_User_Row");
      if (userRowEl) {
        userRowEl.style.display = "flex";
        const userRowDiv = document.getElementById("DX_User_Row_Divider");
        if (userRowDiv) userRowDiv.style.display = "block";
        const nameEl = document.getElementById("DX_UName");
        if (nameEl) nameEl.textContent = "Account Manager";
        const avatarEl = document.getElementById("DX_Avatar");
        if (avatarEl) {
          avatarEl.innerHTML =
            '<img src="https://d35aaqx5ub95lt.cloudfront.net/images/super/11db6cd6f69cb2e3c5046b915be8e669.svg" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">';
        }
        const statsRow = document.getElementById("DX_User_Stats_Row");
        if (statsRow) statsRow.style.display = "none";
      }

      [
        "DX_XP_Btn",
        "DX_Gem_Btn",
        "DX_Streak_Btn",
        "DX_League_Btn",
        "DX_Quest_Force_Btn",
        "DX_Block_Btn",
        "DX_FollowSingle_Btn",
        "DX_Follow_Btn",
        "DX_Block_Mass_Btn",
        "DX_Gift_Btn",
        "DX_Hearts_Btn",
        "DX_Friend_Btn",
        "DX_AutoPath_Btn",
        "DX_AutoPractice_Btn",
        "DX_AutoLegendary_Btn",
      ].forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          element.disabled = true;
        }
      });
    }
  }

  async function onNavChange() {
    const path = window.location.pathname;
    const isLesson =
      path.includes("/lesson") ||
      path.includes("/practice") ||
      path.includes("/practice-hub") ||
      path.includes("/alphabets") ||
      path.includes("/characters") ||
      path.includes("/character-practice") ||
      path.includes("/unit-rewind") ||
      path.includes("/mistakes-review") ||
      path.includes("/listen-practice") ||
      path.includes("/speak-practice") ||
      path.includes("/stories");

    if (!isLesson) {
      hasDecrementedForCurrentLesson = false;
      solverPausedByUser = false;
      cachedCurrentCourseData = null;
    }

    const isSectionPage =
      path.includes("/section") && !path.includes("/sections");
    if (isSectionPage && !isLesson) {
      let attempts = 0;
      const tryClickSection = () => {
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
        } else if (++attempts < 8) {
          setTimeout(tryClickSection, 500);
        } else {
          window.location.href = "https://duolingo.com/";
        }
      };
      setTimeout(tryClickSection, 300);
      return;
    }

    if (!isLesson) {
      const isSolverRunning =
        autoPathEnabled || autoPracticeEnabled || autoLegendaryEnabled;
      const chest = isSolverRunning
        ? Array.from(document.querySelectorAll("img")).find(
            (img) =>
              img.src &&
              img.src.includes("09f977a3e299d1418fde0fd053de0beb.svg"),
          )
        : null;

      if (chest) {
        chest.click();
        let attempts = 0;
        const dismissInterval = setInterval(() => {
          const buttons = Array.from(
            document.querySelectorAll("button, [role='button']"),
          );
          const targetBtn = buttons.find((btn) => {
            const txt = (btn.textContent || btn.innerText || "")
              .toUpperCase()
              .trim();
            return (
              txt === "CLAIM" ||
              txt === "CONTINUE" ||
              txt === "NO THANKS" ||
              txt === "OK" ||
              btn.getAttribute("data-test") === "chest-claim" ||
              btn.getAttribute("data-test") === "claim-button"
            );
          });
          if (targetBtn) {
            targetBtn.click();
            clearInterval(dismissInterval);
            setTimeout(() => {
              onNavChange();
            }, 1500);
          } else if (++attempts > 20) {
            clearInterval(dismissInterval);
          }
        }, 500);
      } else {
        if (autoPathEnabled) {
          const hasActive = await hasActivePathLesson();
          if (!hasActive) {
            autoPathEnabled = false;
            localStorage.setItem("dx_auto_path", "false");
            resetBtn("DX_AutoPath_Btn", "RUN");
            notify(
              "warning",
              "Auto Lesson Completed",
              "No unfinished lessons found. Stopping Auto Lesson.",
            );
          } else if (autoLegendaryEnabled) {
            const legendaryUrl = await getLegendaryUrl().catch(() => null);
            window.location.href =
              legendaryUrl || "https://duolingo.com/lesson";
          } else {
            window.location.href = "https://duolingo.com/lesson";
          }
        } else if (autoPracticeEnabled) {
          if (autoLegendaryEnabled) {
            const legendaryUrl = await getLegendaryUrl().catch(() => null);
            window.location.href =
              legendaryUrl || "https://duolingo.com/practice";
          } else {
            window.location.href = "https://duolingo.com/practice";
          }
        } else if (autoLegendaryEnabled) {
          const legendaryUrl = await getLegendaryUrl().catch(() => null);
          if (legendaryUrl) {
            window.location.href = legendaryUrl;
          } else {
            notify(
              "warning",
              "Auto Legendary",
              "No legendary lesson found to solve. Stopping...",
            );
            autoLegendaryEnabled = false;
            localStorage.setItem("dx_auto_legendary", "false");
            const legendaryBtn = document.getElementById(
              "DX_AutoLegendary_Btn",
            );
            if (legendaryBtn) resetBtn("DX_AutoLegendary_Btn", "RUN");
            window.dispatchEvent(new CustomEvent("DX_StopSolver"));
          }
        }
      }
    }

    initAutoSolverObserver();
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
          html += `<h3 class="DX_T1" style="font-size: 11px; font-weight: 700; margin: 6px 0 2px 0; color: var(--dx-text); text-transform: uppercase; letter-spacing: 0.5px; text-align: left;">${text}</h3>`;
        } else if (cleanBlock.startsWith("## ")) {
          const text = cleanBlock.replace(/^##\s+/, "");
          html += `<h2 class="DX_T1" style="font-size: 13px; font-weight: 800; margin: 8px 0 4px 0; color: var(--dx-text); border-bottom: 1px solid var(--dx-card-border); padding-bottom: 2px; text-align: left;">${text}</h2>`;
        } else if (cleanBlock.startsWith("# ")) {
          const text = cleanBlock.replace(/^#\s+/, "");
          html += `<h1 class="DX_T1" style="font-size: 14px; font-weight: 900; margin: 10px 0 6px 0; color: var(--dx-text); border-bottom: 1.5px solid var(--dx-card-border); padding-bottom: 3px; text-align: left;">${text}</h1>`;
        }
        continue;
      }

      if (/^[\-\=]{3,}$/.test(cleanBlock)) {
        html += '<div class="DX_Divider" style="margin: 8px 0;"></div>';
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
              '<strong style="font-weight: 800; color: var(--dx-text);">$1</strong>',
            );
            listHtml += `<div style="display: flex; gap: 6px; margin-left: 6px; font-size: 11px; line-height: 1.4;"><div style="color: rgb(var(--DX-blue)); font-weight: 700; flex-shrink: 0;">•</div><div style="flex: 1; text-align: left; color: var(--dx-text); opacity: 0.85;">${parsedText}</div></div>`;
          } else if (/^\d+\.\s+/.test(line)) {
            const num = line.match(/^(\d+)\.\s+/)[1];
            const text = line.replace(/^\d+\.\s+/, "");
            const parsedText = text.replace(
              /\*\*(.*?)\*\*/g,
              '<strong style="font-weight: 800; color: var(--dx-text);">$1</strong>',
            );
            listHtml += `<div style="display: flex; gap: 6px; margin-left: 6px; font-size: 11px; line-height: 1.4;"><div style="color: rgb(var(--DX-blue)); font-weight: 700; flex-shrink: 0;">${num}.</div><div style="flex: 1; text-align: left; color: var(--dx-text); opacity: 0.85;">${parsedText}</div></div>`;
          }
        }
        listHtml += "</div>";
        html += listHtml;
        continue;
      }

      let parsedParagraph = cleanBlock.replace(/\n/g, " ");
      parsedParagraph = parsedParagraph.replace(
        /\*\*(.*?)\*\*/g,
        '<strong style="font-weight: 800; color: var(--dx-text);">$1</strong>',
      );

      html += `<p class="DX_T2" style="margin: 0 0 6px 0; font-size: 11px; line-height: 1.4; color: var(--dx-text); opacity: 0.85; text-align: left;">${parsedParagraph}</p>`;
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
    const pageEl = document.getElementById("DX_Page_Terms");
    const mainBox = document.getElementById("DX_Main_Box");
    if (!pageEl || !mainBox) return;

    const contentEl = document.getElementById("DX_Terms_Content");
    const statusEl = document.getElementById("DX_Terms_Status");
    const declineBtn = document.getElementById("DX_Terms_Decline_Btn");
    const acceptBtn = document.getElementById("DX_Terms_Accept_Btn");

    const easeCurve = "cubic-bezier(0.34, 1.15, 0.64, 1)";
    const fadeCurve = "cubic-bezier(0.4, 0, 0.2, 1)";

    pageEl.style.transition = `opacity 0.2s ${fadeCurve}, filter 0.2s ${fadeCurve}, transform 0.2s ${fadeCurve}`;
    pageEl.style.opacity = "0";
    pageEl.style.filter = "blur(6px)";
    pageEl.style.transform = "scale(0.96)";

    const startHeight = mainBox.offsetHeight;

    setTimeout(() => {
      mainBox.style.transition = "none";
      mainBox.style.height = startHeight + "px";

      if (contentEl) contentEl.innerHTML = html;
      if (statusEl) statusEl.innerText = statusText;
      if (declineBtn) declineBtn.style.display = showDecline ? "flex" : "none";
      if (acceptBtn) {
        acceptBtn.querySelector(".DX_Sm_Btn_Label").innerText = acceptLabel;
        acceptBtn.onclick = onAccept;
      }

      mainBox.style.height = "auto";
      mainBox.style.maxHeight = "none";
      const targetHeight = mainBox.offsetHeight;

      mainBox.style.height = startHeight + "px";
      void mainBox.offsetHeight;

      mainBox.style.transition = `height 0.4s ${easeCurve}`;
      mainBox.style.height = targetHeight + "px";

      setTimeout(() => {
        pageEl.style.transition = `filter 0.3s ${fadeCurve}, opacity 0.3s ${fadeCurve}, transform 0.3s ${easeCurve}`;
        pageEl.style.filter = "none";
        pageEl.style.opacity = "1";
        pageEl.style.transform = "scale(1)";
      }, 50);

      setTimeout(() => {
        mainBox.style.height = "auto";
        mainBox.style.transition = "";
        pageEl.style.transition = "";
        pageEl.style.filter = "";
        pageEl.style.opacity = "";
        pageEl.style.transform = "";
        relayout();
      }, 400);
    }, 200);
  }

  function loadEulaAndTos() {
    const contentEl = document.getElementById("DX_Terms_Content");
    const statusEl = document.getElementById("DX_Terms_Status");
    const declineBtn = document.getElementById("DX_Terms_Decline_Btn");
    const acceptBtn = document.getElementById("DX_Terms_Accept_Btn");

    if (!contentEl || !statusEl || !declineBtn || !acceptBtn) return;

    const termsAccepted = localStorage.getItem("dx_terms_accepted") === "true";
    const statusText = termsAccepted
      ? "Review EULA & Terms of Service"
      : "Please read and accept to use DuoXJS";
    const acceptLabel = termsAccepted ? "CLOSE" : "ACCEPT";
    const onAccept = () => {
      if (!termsAccepted) {
        localStorage.setItem("dx_terms_accepted", "true");
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
        .fetch("https://raw.githubusercontent.com/LibreDuo/DuoXJS/main/EULA.md")
        .then((r) => {
          if (!r.ok) throw new Error("HTTP error " + r.status);
          return r.text();
        }),
      window
        .fetch("https://raw.githubusercontent.com/LibreDuo/DuoXJS/main/TOS.md")
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
        const fallbackMd = `# END USER LICENSE AGREEMENT & TERMS OF SERVICE\n\nUsage of DuoXJS implies compliance with the terms below:\n\n1. **Disclaimer**: You agree to use this script at your own risk. The authors are not responsible for any account bans, suspensions, or data loss.\n2. **Usage Limit**: You will not use the script for commercial purposes or distribute malicious modifications.\n3. **License**: The script is provided "as is" under the MIT license.\n\n---\n\nPlease connect to the internet to read the full EULA and TOS from our official repository.`;
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
        `${config.api.users}/${userId}?fields=id,username,email,emailVerified,fromLanguage,learningLanguage,streak,totalXp,gems,picture,streakData,timezone,creationDate`,
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
        "DX_XP_Btn",
        "DX_Gem_Btn",
        "DX_Streak_Btn",
        "DX_League_Btn",
        "DX_Quest_Force_Btn",
        "DX_Block_Btn",
        "DX_FollowSingle_Btn",
        "DX_Follow_Btn",
        "DX_Block_Mass_Btn",
        "DX_Gift_Btn",
        "DX_Hearts_Btn",
        "DX_Friend_Btn",
        "DX_AutoPath_Btn",
        "DX_AutoPractice_Btn",
        "DX_AutoLegendary_Btn",
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
    xp: "dx_stat_xp_" + dxVersion,
    gems: "dx_stat_gems_" + dxVersion,
    streak: "dx_stat_streak_" + dxVersion,
  };
  const statSinceKey = "dx_stat_since_" + dxVersion;

  function readStat(kind) {
    return parseInt(localStorage.getItem(statKeys[kind])) || 0;
  }

  function showStats() {
    const map = {
      xp: "DX_Stat_XP",
      gems: "DX_Stat_Gems",
      streak: "DX_Stat_Streak",
    };
    for (const kind in map) {
      const el = document.getElementById(map[kind]);
      if (el) {
        el.textContent = readStat(kind).toLocaleString();
      }
    }
    const sinceEl = document.getElementById("DX_Stat_Since");
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
    const cont = document.getElementById("DX_Changelog");
    if (!cont || changelogBusy) return;
    changelogBusy = true;
    if (cont.dataset.loaded !== "1") {
      cont.innerHTML = `<p class="DX_T2 DX_NoSel" style="text-align: center;">Loading changelog...</p>`;
    }
    try {
      const res = await fetchApi(
        "GET",
        "https://raw.githubusercontent.com/LibreDuo/DuoXJS/main/CHANGELOG.md?_c=" +
          Date.now(),
        null,
        {},
      );
      if (res.status !== 200) throw new Error("Changelog not found");

      const text = res.responseText || "";
      const lines = text.split("\n");
      const items = [];
      let inTargetSection = false;

      for (let line of lines) {
        line = line.trim();
        if (line.startsWith("## ")) {
          const headingVersion = line
            .replace(/^##\s*/, "")
            .replace(/[\[\]]/g, "")
            .trim();
          inTargetSection =
            compareVersions(headingVersion, dxScriptVersion) === 0;
        } else if (
          inTargetSection &&
          (line.startsWith("- ") || line.startsWith("* "))
        ) {
          items.push(line.substring(2).trim());
        }
      }

      const html = items.length
        ? `<ul style="margin: 0; padding-left: 14px; color: var(--dx-text); font-size: 11px; line-height: 1.5; list-style-type: disc; text-align: left; align-self: stretch;">
            ${items.map((item) => `<li class="DX_T2 DX_NoSel" style="margin-bottom: 3px;">${item}</li>`).join("")}
          </ul>`
        : "";

      cont.innerHTML =
        html ||
        `<p class="DX_T2 DX_NoSel" style="text-align: center;">No changelog entries for this version.</p>`;
      cont.dataset.loaded = "1";
      const card = document.getElementById("DX_Changelog_Card");
      if (card) {
        if (html) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      }
    } catch (e) {
      const card = document.getElementById("DX_Changelog_Card");
      if (card) card.style.display = "none";
    } finally {
      changelogBusy = false;
    }
  }

  async function loadXpHistory() {
    const cont = document.getElementById("DX_XPHistory");
    if (!cont || !token || !userId || xpHistoryBusy) return;
    xpHistoryBusy = true;
    if (cont.dataset.loaded !== "1") {
      cont.innerHTML = `<p class="DX_T2 DX_NoSel" style="text-align: center;">Loading...</p>`;
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
        cont.innerHTML = `<p class="DX_T2 DX_NoSel" style="text-align: center;">No recent activity.</p>`;
        cont.dataset.loaded = "1";
        return;
      }
      cont.innerHTML = summaries
        .map((s) => {
          const label = new Date((s.date || 0) * 1000).toLocaleDateString(
            undefined,
            { weekday: "short", month: "short", day: "numeric" },
          );
          return `<div class="DX_HStack_Auto" style="align-self: stretch;"><p class="DX_T2 DX_NoSel">${label}</p><p class="DX_T1 DX_NoSel">+${(s.gainedXp || 0).toLocaleString()} XP</p></div>`;
        })
        .join("");
      cont.dataset.loaded = "1";
    } catch {
      if (cont.dataset.loaded !== "1") {
        cont.innerHTML = `<p class="DX_T2 DX_NoSel" style="text-align: center; color: rgb(var(--DX-red));">Failed to load XP history.</p>`;
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
    const cont = document.getElementById("DX_Feed_Container");
    if (!cont || !token || !userId || feedBusy) return;
    feedBusy = true;
    const loaded = cont.dataset.loaded === "1";
    if (!loaded)
      cont.innerHTML = `<p class="DX_T2 DX_NoSel" style="text-align: center; padding: 8px 0;">Loading...</p>`;
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
        cont.innerHTML = `<p class="DX_T2 DX_NoSel" style="text-align: center; padding: 8px 0;">No recent activity.</p>`;
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
        row.className = "DX_HStack_4";
        row.style.cssText =
          "align-self: stretch; padding: 8px 10px; border-radius: var(--DX-r-s); corner-shape: var(--DX-corner); gap: 8px; background: var(--dx-card-bg);";
        row.innerHTML = `
                    <img src="${escapeHtml(av)}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; flex-shrink: 0; background: var(--dx-card-border);" onerror="this.style.visibility='hidden'">
                    <div style="flex: 1; min-width: 0;">
                        <p class="DX_T1 DX_NoSel" style="font-size: 13px;">${name}</p>
                        ${text ? `<p class="DX_T2 DX_NoSel" style="font-size: 11px;">${text}</p>` : ""}
                    </div>
                    ${timeAgo ? `<p class="DX_T2 DX_NoSel" style="font-size: 10px; flex-shrink: 0; opacity: 0.5;">${timeAgo}</p>` : ""}
                `;
        frag.appendChild(row);
      });
      cont.replaceChildren(frag);
      cont.dataset.loaded = "1";
    } catch {
      if (!loaded)
        cont.innerHTML = `<p class="DX_T2 DX_NoSel" style="text-align: center; color: rgb(var(--DX-red));">Failed to load feed.</p>`;
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

    const usernameEl = document.getElementById("DX_UName");
    if (usernameEl) {
      usernameEl.textContent = user.username || "";
    }

    const xpEl = document.getElementById("DX_UXP");
    if (xpEl) {
      xpEl.textContent = (user.totalXp || 0).toLocaleString();
    }

    const gemsEl = document.getElementById("DX_UGems");
    if (gemsEl) {
      gemsEl.textContent = (user.gems || 0).toLocaleString();
    }

    const streakEl = document.getElementById("DX_UStreak");
    if (streakEl) {
      streakEl.textContent = (user.streak || 0).toLocaleString();
    }

    const userRowEl = document.getElementById("DX_User_Row");
    if (userRowEl) {
      userRowEl.style.display = "flex";
      const userRowDiv = document.getElementById("DX_User_Row_Divider");
      if (userRowDiv) userRowDiv.style.display = "block";
      const statsRow = document.getElementById("DX_User_Stats_Row");
      if (statsRow) statsRow.style.display = "flex";
      const countEl = document.getElementById("DX_UAccCount");
      if (countEl) countEl.style.display = "none";
    }

    const picUrl = bestAvatarUrl(user.picture);
    const avatarEl = document.getElementById("DX_Avatar");
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

  let accountStatsTs = 0;
  const ACCOUNT_STATS_TTL = 30000;

  async function refreshStats(force = false) {
    if (!token || !userId || !user || refreshStatsBusy) {
      return;
    }
    if (!force && Date.now() - accountStatsTs < ACCOUNT_STATS_TTL) {
      return;
    }

    refreshStatsBusy = true;
    try {
      const res = await fetchApi(
        "GET",
        `${config.api.users}/${userId}?fields=streak,totalXp,gems,streakData,creationDate`,
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
        if (data.creationDate !== undefined) {
          user.creationDate = data.creationDate;
        }
        accountStatsTs = Date.now();
        showUser();
      }
    } catch {
    } finally {
      refreshStatsBusy = false;
    }
  }

  let cachedCurrentCourseData = null;
  let currentCourseFetchPromise = null;

  async function fetchCurrentCourse() {
    if (cachedCurrentCourseData) return cachedCurrentCourseData;
    if (currentCourseFetchPromise) return currentCourseFetchPromise;

    if (!token || !userId || !headers) return null;

    currentCourseFetchPromise = (async () => {
      try {
        const res = await fetchApi(
          "GET",
          `https://www.duolingo.com/2017-06-30/users/${userId}?fields=currentCourse&_=${Date.now()}`,
        );
        if (res.status === 200) {
          const d = safeJsonParse(res.responseText, {});
          cachedCurrentCourseData = d.currentCourse || null;
          return cachedCurrentCourseData;
        }
      } catch (err) {
        console.error("Error fetching current course:", err);
      } finally {
        currentCourseFetchPromise = null;
      }
      return null;
    })();

    return currentCourseFetchPromise;
  }

  async function hasActivePathLesson() {
    const course = await fetchCurrentCourse();
    if (!course || !course.pathSectioned) return true;
    try {
      for (let s = 0; s < course.pathSectioned.length; s++) {
        const section = course.pathSectioned[s];
        if (!section || !section.units) continue;
        for (let u = 0; u < section.units.length; u++) {
          const unit = section.units[u];
          if (!unit || !unit.levels) continue;
          const foundActive = unit.levels.some(
            (l) => l.state === "active" || l.state === "unit_test",
          );
          if (foundActive) return true;
        }
      }
      return false;
    } catch {
      return true;
    }
  }

  async function getLegendaryUrl() {
    const course = await fetchCurrentCourse();
    if (!course) return null;
    try {
      let ui = -1;
      let li = -1;

      if (course.pathSectioned && Array.isArray(course.pathSectioned)) {
        for (let s = 0; s < course.pathSectioned.length; s++) {
          const section = course.pathSectioned[s];
          if (!section || !section.units) continue;

          for (let u = 0; u < section.units.length; u++) {
            const unit = section.units[u];
            if (!unit || !unit.levels) continue;

            const index = unit.levels.findIndex(
              (l) => l.state === "passed" && l.type !== "chest",
            );
            if (index !== -1 && ui === -1) {
              ui = unit.unitIndex;
              li = index;
              break;
            }
          }
          if (ui !== -1) break;
        }
      }

      if (ui === -1 || li === -1) {
        return null;
      } else {
        return `https://www.duolingo.com/lesson/unit/${ui + 1}/legendary/${li + 1}`;
      }
    } catch (err) {
      console.error(err);
      return null;
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
        fromLanguage: "en",
        learningLanguage: "fr",
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
      if (res.status !== 200) return 0;

      const data = safeJsonParse(res.responseText, {});
      return typeof data.awardedXp === "number" ? data.awardedXp : 0;
    } catch {
      return 0;
    }
  }

  async function farmXp(targetAmount) {
    const isInfinite = targetAmount === Infinity;
    const maxPerReq = 499;
    const minPerReq = 30;

    let totalXp = 0;
    let consecutiveFailures = 0;
    const xpBefore = user ? user.totalXp : 0;
    const sig = farmSignal("xp");

    stopBtn("DX_XP_Btn");

    try {
      outerLoop: while (farmStates.xp) {
        while (farmStates.xp) {
          if (!isInfinite && totalXp >= targetAmount) break;

          const remainingNeeded = isInfinite
            ? Infinity
            : targetAmount - totalXp;

          if (!isInfinite && remainingNeeded < minPerReq) break;

          let nextAmount;
          if (isInfinite || remainingNeeded >= maxPerReq) {
            nextAmount = maxPerReq;
            if (!isInfinite) {
              const r = remainingNeeded % maxPerReq;
              if (r > 0 && r < minPerReq) {
                nextAmount = maxPerReq - (minPerReq - r);
              }
            }
          } else {
            nextAmount = remainingNeeded;
          }
          if (nextAmount < minPerReq) nextAmount = minPerReq;

          const bonus = Math.max(0, nextAmount - 30);
          const awarded = await playStory(bonus, sig);
          if (!farmStates.xp) break outerLoop;

          if (awarded > 0) {
            consecutiveFailures = 0;
            totalXp += awarded;
            if (user) {
              user.totalXp += awarded;
              showUser();
            }
            if (leagueDataCache) {
              const ranks = leagueDataCache.active?.cohort?.rankings || [];
              const me = ranks.find((u) => u.user_id == userId);
              if (me) {
                me.score += awarded;
                ranks.sort((a, b) => b.score - a.score);
              }
            }
            if (pageId === "Board") {
              showLeagueBoard(leagueDataCache);
            }
            if (!isInfinite && totalXp >= targetAmount) break;
          } else {
            consecutiveFailures++;
            if (consecutiveFailures >= 5) {
              notify(
                "error",
                "XP Farm Rate-Limited",
                "Duolingo returned multiple failed responses. Stopping farm to prevent account suspension.",
              );
              break outerLoop;
            }
            await waitStop(2000, sig);
            continue;
          }

          if (!isInfinite) {
            setProgress("DX_XP", Math.min(100, (totalXp / targetAmount) * 100));
          }

          await waitStop(delayMs, sig);
        }

        if (!farmStates.xp) break;

        if (isInfinite) break;

        await refreshStats(true);
        const serverConfirmed = user
          ? Math.max(0, user.totalXp - xpBefore)
          : totalXp;

        if (serverConfirmed >= targetAmount) {
          totalXp = serverConfirmed;
          break;
        }

        if (!farmStates.xp) break;

        const gap = targetAmount - serverConfirmed;
        totalXp = serverConfirmed;
        if (user) user.totalXp = xpBefore + serverConfirmed;

        if (gap < minPerReq) break;
      }

      const completed = farmStates.xp;
      const finalGained = user ? Math.max(0, user.totalXp - xpBefore) : totalXp;
      if (finalGained > 0) {
        addStat("xp", finalGained);
        notify(
          "success",
          completed ? "XP Farm Complete" : "XP Farm Stopped",
          `Farmed ${finalGained} XP.`,
        );
      }

      clearProgress("DX_XP", completed);
    } finally {
      farmStates.xp = false;
      farmCtl.xp = null;
      resetBtn("DX_XP_Btn", "RUN");
    }
  }

  async function checkGems(signal) {
    try {
      const res = await fetchApi(
        "GET",
        `https://www.duolingo.com/2023-05-23/users/${userId}?fields=rewardBundles{rewards}`,
        null,
        null,
        signal,
      );

      if (res.status !== 200) {
        return null;
      }

      const data = safeJsonParse(res.responseText, {});
      const collected = [];

      for (const bundle of data.rewardBundles || []) {
        for (const reward of bundle.rewards || []) {
          if (
            !reward.consumed &&
            ((reward.id || "").startsWith("SKILL_COMPLETION-") ||
              (reward.id || "").startsWith("SKILL_COMPLETION_BALANCED-"))
          ) {
            collected.push({ id: reward.id, amount: reward.amount || 0 });
          }
        }
      }

      return collected;
    } catch {
      return null;
    }
  }

  async function claimGem(rewardId, signal) {
    const payload = {
      consumed: true,
      fromLanguage: user.fromLanguage,
      learningLanguage: user.learningLanguage,
    };
    try {
      let res = await fetchApi(
        "PATCH",
        `https://www.duolingo.com/2023-05-23/users/${userId}/rewards/${rewardId}`,
        payload,
        null,
        signal,
      );
      return res.status === 200;
    } catch {
      return false;
    }
  }

  async function farmGems(targetLoops) {
    const isInfinite = targetLoops === Infinity;
    stopBtn("DX_Gem_Btn");

    let totalGained = 0;
    let doneLoops = 0;
    let consecutiveFailures = 0;
    const sig = farmSignal("gem");

    try {
      while (farmStates.gem && (isInfinite || doneLoops < targetLoops)) {
        let available = await checkGems(sig);
        if (!farmStates.gem) break;

        if (available === null) {
          consecutiveFailures++;
          if (consecutiveFailures >= 5) {
            notify(
              "error",
              "Gem Farm Rate-Limited",
              "Duolingo returned multiple failed responses. Stopping loop.",
            );
            break;
          }
          await waitStop(3000, sig);
          continue;
        }

        consecutiveFailures = 0;

        if (available.length === 0) {
          await waitStop(delayMs * 2, sig);
          continue;
        }

        if (farmStates.gem && (isInfinite || doneLoops < targetLoops)) {
          const results = await Promise.all(
            available.map((r) => claimGem(r.id, sig)),
          );
          if (!farmStates.gem) break;

          let batchGained = 0;
          results.forEach((ok, idx) => {
            if (ok) batchGained += available[idx].amount || 0;
          });
          if (batchGained > 0) {
            totalGained += batchGained;
            if (user) {
              user.gems = (user.gems || 0) + batchGained;
              showUser();
            }
          }

          await waitStop(150, sig);

          doneLoops++;

          if (!isInfinite) {
            setProgress("DX_Gem", (doneLoops / targetLoops) * 100);
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
        refreshStats(true);
      }

      clearProgress("DX_Gem", completed);
    } finally {
      farmStates.gem = false;
      farmCtl.gem = null;
      resetBtn("DX_Gem_Btn", "RUN");
    }
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
      if (sRes.status !== 200) {
        return false;
      }

      const sData = safeJsonParse(sRes.responseText, {});
      if (!sData.id) {
        return false;
      }

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
      if (fRes.status !== 200) {
        return false;
      }

      const fData = safeJsonParse(fRes.responseText, {});
      if (fData.xpGain === undefined || fData.xpGain === null) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  async function farmStreak(targetDays) {
    let isInfinite = targetDays === Infinity;
    stopBtn("DX_Streak_Btn");

    if (localStorage.getItem("dx_safe_streak") === "true" && user) {
      let creationDateVal = user.creationDate;
      if (creationDateVal) {
        const creationDateObj = new Date(
          typeof creationDateVal === "number"
            ? creationDateVal * 1000
            : creationDateVal,
        );
        if (!isNaN(creationDateObj.getTime())) {
          const safeTz = accountTimezone();
          const creationParts = tzParts(safeTz, creationDateObj);
          const creationDayMs = Date.UTC(
            +creationParts.year,
            +creationParts.month - 1,
            +creationParts.day,
          );
          const todayParts = accountToday(safeTz);
          const todayDayMs = Date.UTC(
            todayParts.year,
            todayParts.month - 1,
            todayParts.day,
          );
          const elapsedDays = Math.round(
            (todayDayMs - creationDayMs) / 86400000,
          );
          const maxSafeStreak = elapsedDays - 1;
          const currentStreak = user.streak || 0;
          const remainingSafeDays = Math.max(0, maxSafeStreak - currentStreak);

          if (remainingSafeDays <= 0) {
            notify(
              "error",
              "Safe Streak",
              "Farming blocked: your streak has already reached the maximum limit of " +
                maxSafeStreak +
                " days for your account age.",
            );
            farmStates.streak = false;
            resetBtn("DX_Streak_Btn", "RUN");
            return;
          }

          if (isInfinite || targetDays > remainingSafeDays) {
            notify(
              "warning",
              "Safe Streak",
              "Target days capped at " +
                remainingSafeDays +
                " to prevent exceeding account age.",
            );
            targetDays = remainingSafeDays;
            isInfinite = false;
          }
        }
      }
    }

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
    let consecutiveFailures = 0;
    const sig = farmSignal("streak");

    try {
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
            consecutiveFailures = 0;
            savedDays++;
            user.streak++;
            showUser();
          } else {
            consecutiveFailures++;
            if (consecutiveFailures >= 5) {
              notify(
                "error",
                "Streak Farm Rate-Limited",
                "Duolingo returned multiple failed responses. Stopping streak farm.",
              );
              break;
            }
            await waitStop(2000, sig);
            continue;
          }
        }

        doneLoops++;

        if (!isInfinite) {
          setProgress("DX_Streak", (doneLoops / targetDays) * 100);
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
        refreshStats(true);
      } else if (completed && doneLoops > 0) {
        notify(
          "error",
          "Streak Farm",
          "No days could be saved. Please try again.",
        );
      }

      clearProgress("DX_Streak", completed);
    } finally {
      farmStates.streak = false;
      farmCtl.streak = null;
      resetBtn("DX_Streak_Btn", "RUN");
    }
  }

  async function keepStreak() {
    if (!user) return false;
    const endSecs = Math.floor(Date.now() / 1000);
    return completePracticeSession(endSecs);
  }

  async function autoKeepStreak() {
    if (localStorage.getItem("dx_auto_keep_streak") !== "true") return;
    const isSolverRunning =
      autoPathEnabled || autoPracticeEnabled || autoLegendaryEnabled;
    if (isSolverRunning) return;
    if (!user || streakKeepBusy) return;
    const tz = accountTimezone();
    const t = accountToday(tz);
    const pad = (n) => String(n).padStart(2, "0");
    const todayIso = `${t.year}-${pad(t.month)}-${pad(t.day)}`;
    const keptKey = `dx_streak_kept_date_${userId}`;
    if (localStorage.getItem(keptKey) === todayIso) return;
    if (user.streakData?.currentStreak?.lastExtendedDate === todayIso) {
      localStorage.setItem(keptKey, todayIso);
      return;
    }
    if (localStorage.getItem("dx_safe_streak") === "true") {
      let creationDateVal = user.creationDate;
      if (creationDateVal) {
        const creationDateObj = new Date(
          typeof creationDateVal === "number"
            ? creationDateVal * 1000
            : creationDateVal,
        );
        if (!isNaN(creationDateObj.getTime())) {
          const creationParts = tzParts(tz, creationDateObj);
          const creationDayMs = Date.UTC(
            +creationParts.year,
            +creationParts.month - 1,
            +creationParts.day,
          );
          const todayDayMs = Date.UTC(t.year, t.month - 1, t.day);
          const elapsedDays = Math.round(
            (todayDayMs - creationDayMs) / 86400000,
          );
          const maxSafeStreak = elapsedDays - 1;
          const currentStreak = user.streak || 0;
          if (currentStreak + 1 > maxSafeStreak) {
            notify(
              "warning",
              "Auto Keep Streak",
              "Auto streak blocked: keeping streak today would exceed the safe limit (" +
                maxSafeStreak +
                " days) for your account age.",
            );
            return;
          }
        }
      }
    }

    streakKeepBusy = true;
    try {
      const ok = await keepStreak();
      if (ok) {
        localStorage.setItem(keptKey, todayIso);
        refreshStats(true);
        notify("success", "Auto Keep Streak", "Your streak is safe for today.");
      } else {
        notify(
          "error",
          "Auto Keep Streak",
          "Could not save your streak today. Will keep retrying.",
        );
      }
    } finally {
      streakKeepBusy = false;
    }
  }

  async function autoReachRank(knownRank) {
    if (localStorage.getItem("dx_auto_reach_rank") !== "true") return;
    const isSolverRunning =
      autoPathEnabled || autoPracticeEnabled || autoLegendaryEnabled;
    if (isSolverRunning) return;
    if (!userId || farmStates.league || farmStates.xp) return;
    const target = parseInt(localStorage.getItem("dx_league_target")) || 1;
    const rank = knownRank === undefined ? await getLeagueRank() : knownRank;
    if (rank && rank > target) {
      notify("info", "Auto Reach Rank", `Climbing to #${target}...`);
      farmStates.league = true;
      farmCtl.league = new AbortController();
      farmLeague(target);
    }
  }

  async function autoBlockLeague() {
    if (localStorage.getItem("dx_auto_block_league") !== "true") return;
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
      clearProgress("DX_Block_Mass", true);
      farmStates.blockmass = false;
      resetBtn("DX_Block_Mass_Btn", "RUN");
    }
  }

  async function autoQuestSaver() {
    if (localStorage.getItem("dx_auto_quest_saver") !== "true") return;
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
    const state = await fetchQuests(false);
    if (state && pageId === "Quests") {
      showQuests();
    }
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
      const xpAwarded = await playStory(0);
      if (xpAwarded > 0 && user) {
        user.totalXp += xpAwarded;
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
    stopBtn("DX_League_Btn");
    setProgress("DX_League", 10);

    let joinAttemptCount = 0;
    let consecutiveFailures = 0;
    const sig = farmSignal("league");

    try {
      while (farmStates.league) {
        try {
          const data = await fetchLeagueData(false, sig);
          if (!farmStates.league) break;

          if (!data) {
            consecutiveFailures++;
            if (consecutiveFailures >= 5) {
              notify(
                "error",
                "Auto League Rate-Limited",
                "Failed to retrieve league data multiple times. Stopping loop.",
              );
              break;
            }
            await waitStop(3000, sig);
            continue;
          }

          consecutiveFailures = 0;

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
                const xpAwarded = await playStory(0, sig);
                if (xpAwarded > 0 && user) {
                  user.totalXp += xpAwarded;
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
            const verified = await fetchLeagueData(true, sig);
            if (!farmStates.league) break;
            const verifiedRanks = verified?.active?.cohort?.rankings || [];
            const verifiedMe = verifiedRanks.find((u) => u.user_id == userId);
            const verifiedPos = verifiedMe
              ? verifiedRanks.indexOf(verifiedMe) + 1
              : null;
            const verifiedTarget = verifiedRanks[targetRank - 1];

            if (!verifiedTarget || (verifiedPos && verifiedPos <= targetRank)) {
              if (farmStates.league) {
                notify(
                  "success",
                  "Goal Reached",
                  `Reached Rank #${targetRank}!`,
                );
              }
              setProgress("DX_League", 100);
              break;
            }
            applyLeagueSummary(verified);
            continue;
          }

          const scoreGap = tUserRanking.score - cRankings.score;
          const progressPct = Math.min(
            95,
            Math.floor((cRankings.score / tUserRanking.score) * 100),
          );

          setProgress("DX_League", progressPct);

          const room =
            localStorage.getItem("dx_xp_room") === null
              ? 30
              : parseInt(localStorage.getItem("dx_xp_room")) >= 0
                ? parseInt(localStorage.getItem("dx_xp_room"))
                : 0;
          const overshoot = room > 0 ? room : 1;
          const targetGap = scoreGap + overshoot;

          if (targetGap > 0) {
            let nextAmount = Math.min(499, targetGap);
            if (targetGap > 499 && targetGap - 499 < 30) {
              nextAmount = targetGap - 30;
            }
            if (nextAmount < 30) {
              nextAmount = 30;
            }
            const bonus = Math.max(0, nextAmount - 30);
            const xpAwarded = await playStory(bonus, sig);
            if (!farmStates.league) break;
            if (xpAwarded > 0) {
              user.totalXp += xpAwarded;
              showUser();
              if (leagueDataCache) {
                const ranks = leagueDataCache.active?.cohort?.rankings || [];
                const me = ranks.find((u) => u.user_id == userId);
                if (me) {
                  me.score += xpAwarded;
                  ranks.sort((a, b) => b.score - a.score);
                }
              }
              if (pageId === "Board") {
                showLeagueBoard(leagueDataCache);
              }
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

      clearProgress("DX_League", completed);
      refreshStats(true);
    } finally {
      farmStates.league = false;
      farmCtl.league = null;
      resetBtn("DX_League_Btn", "RUN");
    }
  }

  function showConfirmModal(text, onConfirm, onCancel) {
    const modal = document.getElementById("DX_Confirm_Modal");
    const btnCancel = document.getElementById("DX_Modal_Cancel");
    const btnConfirm = document.getElementById("DX_Modal_Confirm");
    const textEl = document.getElementById("DX_Confirm_Modal_Text");

    if (textEl && text) {
      textEl.innerText = text;
    }

    const cleanup = () => {
      modal.classList.remove("show");
      btnCancel.removeEventListener("click", handleCancel);
      btnConfirm.removeEventListener("click", handleConfirm);
    };

    const handleCancel = () => {
      cleanup();
      if (typeof onCancel === "function") onCancel();
    };
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
  const LEAGUE_TTL = 30000;

  async function fetchLeagueData(force, sig) {
    if (!userId || !token) return null;
    if (!force && leagueDataCache && Date.now() - leagueDataTs < LEAGUE_TTL) {
      return leagueDataCache;
    }
    try {
      const res = await fetchApi(
        "GET",
        `${config.api.leaderboards}/users/${userId}?client_unlocked=true&get_reactions=true&_=${Date.now()}`,
        null,
        null,
        sig,
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
    const sel = document.getElementById("DX_League_Select");
    if (!sel) return;
    if (sel.classList.contains("open")) return;
    const opts = sel.querySelector(".DX_Select_Options");
    const text = sel.querySelector(".DX_Select_Text");
    const chevron = sel.querySelector(".DX_Chevron");
    const btn = document.getElementById("DX_League_Btn");
    const lbl = document.getElementById("DX_League_Lbl");

    if (btn && !farmStates.league) btn.disabled = false;
    if (lbl && !farmStates.league) lbl.innerText = "RUN";
    if (chevron) chevron.style.display = "";
    sel.style.pointerEvents = "auto";

    const maxPos = 15;
    let optHtml = "";
    for (let i = 1; i <= maxPos; i++) {
      optHtml += `<div class="DX_Select_Option" data-value="${i}"># ${i}</div>`;
    }
    opts.innerHTML = optHtml;

    const savedTarget = parseInt(localStorage.getItem("dx_league_target"));
    let currentVal = !isNaN(savedTarget)
      ? savedTarget
      : parseInt(sel.getAttribute("data-value")) || 1;
    if (currentVal < 1 || currentVal > maxPos) currentVal = 1;

    sel.setAttribute("data-value", currentVal.toString());
    text.innerText = `# ${currentVal}`;

    opts.querySelectorAll(".DX_Select_Option").forEach((opt) => {
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
        const autoJoin = localStorage.getItem("dx_auto_join_league") === "true";
        const isSolverRunning =
          autoPathEnabled || autoPracticeEnabled || autoLegendaryEnabled;
        if (
          autoJoin &&
          !isSolverRunning &&
          !leagueJoinAttempted &&
          !farmStates.league
        ) {
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
              const xpAwarded = await playStory(0);
              if (xpAwarded > 0 && user) {
                user.totalXp += xpAwarded;
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
    leaguePollTimer = setInterval(silentLeagueCheck, 30000);
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

  async function fetchQuests(force = false) {
    if (!token || !userId) return null;
    if (!force && questState && Date.now() - questStateTs < 30000) {
      return questState;
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
      return questState;
    } catch {
      return null;
    }
  }

  async function getQuests(force = false) {
    const cont = document.getElementById("DX_Quest_Container");
    if (!cont) {
      return;
    }

    const forceBtn = document.getElementById("DX_Quest_Force_Btn");

    if (!token) {
      cont.innerHTML = `<p class="DX_T2 DX_NoSel" style="text-align: center;">Login required.</p>`;
      return;
    }

    const isRefresh = questState !== null;
    const prevScroll = cont.scrollTop;
    if (!isRefresh) {
      cont.innerHTML = `<p class="DX_T2 DX_NoSel" style="text-align: center;">Loading...</p>`;
    }

    const state = await fetchQuests(force);
    if (state) {
      showQuests();
      cont.scrollTop = prevScroll;
      if (forceBtn) {
        forceBtn.disabled = false;
      }
    } else {
      if (!isRefresh)
        cont.innerHTML = `<p class="DX_T2 DX_NoSel" style="text-align: center; color: rgb(var(--DX-red));">Failed to load quests.</p>`;
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
    const cont = document.getElementById("DX_Quest_Container");
    if (!cont) {
      return;
    }

    const searchEl = document.getElementById("DX_Quest_Search");
    const query = (
      filterStr !== undefined ? filterStr : searchEl ? searchEl.value : ""
    )
      .trim()
      .toLowerCase();

    cont.innerHTML = "";
    const allGoals = questDisplayGoals();

    if (allGoals.length === 0) {
      cont.innerHTML = `<p class="DX_T2 DX_NoSel" style="text-align: center;">No active quests.</p>`;
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
      cont.innerHTML = `<p class="DX_T2 DX_NoSel" style="text-align: center;">No quests found.</p>`;
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
        yHeader.className = "DX_Shop_Section_Header DX_NoSel";
        yHeader.innerHTML = `<div class="DX_Shop_Section_Line"></div><span class="DX_Shop_Section_Title">${yr}</span><div class="DX_Shop_Section_Line"></div>`;
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
      qItem.className = `DX_Quest_Item ${isEarned ? "done" : ""}`;

      let bruteHtml = "";
      if (!isEarned && rem > 0) {
        bruteHtml = `<button class="DX_Quest_Get_Btn" data-m="${escapeHtml(goal.metric || "")}" data-id="${escapeHtml(goal.goalId)}" data-amt="${rem}">BRUTE</button>`;
      }

      qItem.innerHTML = `
                <img src="${escapeHtml(qIconUrl)}" class="DX_Quest_Icon">
                <div class="DX_Quest_Info">
                    <p class="DX_Quest_Title DX_NoSel">${escapeHtml(goal.title?.uiString || goal.goalId)}</p>
                    <div class="DX_Quest_Bar_Bg">
                        <div class="DX_Quest_Bar_Fill" style="width: ${pct}%"></div>
                    </div>
                </div>
                ${bruteHtml}
            `;

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

    const forceBtn = document.getElementById("DX_Quest_Force_Btn");
    const forceLbl = forceBtn
      ? forceBtn.querySelector(".DX_Sm_Btn_Label")
      : null;

    if (targets.length === 0) {
      notify("info", "Quest Center", "All daily quests are already complete.");
      return;
    }

    if (forceBtn) {
      forceBtn.disabled = true;
      if (forceLbl) forceLbl.innerText = "...";
    }

    let allOk = true;
    setProgress("DX_QuestForce", 0);
    try {
      for (let i = 0; i < targets.length; i++) {
        const goal = targets[i];
        const rem = questRemaining(goal);
        const qty = Math.max(rem, 2000);
        const payload = {
          metric_updates: [{ metric: goal.metric, quantity: qty }],
          timezone: accountTimezone(),
          timestamp: timeQuest(goal.goalId),
        };
        let res = await fetchApi(
          "POST",
          `${config.api.goals}/users/${userId}/progress/batch`,
          payload,
          setGoalHeaders(token),
        );
        if (res.status !== 200) allOk = false;
        setProgress("DX_QuestForce", ((i + 1) / targets.length) * 100);
      }
      notify(
        allOk ? "success" : "warning",
        "Mass Operation",
        allOk
          ? "All quests brute-forced."
          : "Some quests could not be completed.",
      );
      clearProgress("DX_QuestForce", allOk);
      getQuests(true);
    } catch {
      notify(
        "error",
        "Quest Center",
        "Network error: Failed to execute mass operation.",
      );
      clearProgress("DX_QuestForce", false);
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
    const cont = document.getElementById("DX_Shop_Container");
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
            img.className = "DX_Shop_Ico";
            preloadedShopIcons[item.icon] = img;
          }
        });

        showShop("");
      } else {
        cont.innerHTML = `<p class="DX_T2 DX_NoSel" style="text-align: center; color: rgb(var(--DX-red));">Failed to load shop. Please try again.</p>`;
      }
    } catch {
      cont.innerHTML = `<p class="DX_T2 DX_NoSel" style="text-align: center; color: rgb(var(--DX-red));">Failed to load shop. Please try again.</p>`;
    }
  }

  function showShop(filterStr) {
    const cont = document.getElementById("DX_Shop_Container");
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
      cont.innerHTML = `<p class="DX_T2 DX_NoSel" style="text-align: center;">No items found.</p>`;
      return;
    }

    const grid = document.createElement("div");
    grid.className = "DX_Shop_Grid";

    const fragment = document.createDocumentFragment();

    if (fPowerUps.length > 0) {
      const puHeader = document.createElement("div");
      puHeader.className = "DX_Shop_Section_Header DX_NoSel";
      puHeader.innerHTML = `
                <div class="DX_Shop_Section_Line"></div>
                <span class="DX_Shop_Section_Title">Power-Ups</span>
                <div class="DX_Shop_Section_Line"></div>
            `;
      fragment.appendChild(puHeader);

      fPowerUps.forEach((item) => {
        const card = document.createElement("div");
        card.className = "DX_Shop_Card";

        const ico = document.createElement("img");
        ico.className = "DX_Shop_Ico DX_NoSel";
        ico.src = item.ico;
        card.appendChild(ico);

        const nameDiv = document.createElement("div");
        nameDiv.className = "DX_Shop_Name DX_NoSel";
        nameDiv.innerText = item.name;
        card.appendChild(nameDiv);

        const btn = document.createElement("button");
        btn.className = "DX_Shop_Btn";
        btn.innerText = "GET";
        btn.addEventListener("click", async () => {
          if (btn.className.includes("loading")) return;
          btn.className = "DX_Shop_Btn loading";
          btn.innerText = "...";
          const r = await applyPowerUp(item);
          if (r.ok) {
            btn.className = "DX_Shop_Btn got";
            btn.innerText = "✓";
            notify("success", "Shop", `Successfully applied ${item.name}.`);
          } else {
            btn.className = "DX_Shop_Btn fail";
            btn.innerText = "ERR";
            notify("error", "Shop", r.msg);
          }
          setTimeout(() => {
            btn.className = "DX_Shop_Btn";
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
        secHeader.className = "DX_Shop_Section_Header DX_NoSel";
        secHeader.innerHTML = `
                    <div class="DX_Shop_Section_Line"></div>
                    <span class="DX_Shop_Section_Title">${currentCategory}</span>
                    <div class="DX_Shop_Section_Line"></div>
                `;
        fragment.appendChild(secHeader);
      }

      const card = document.createElement("div");
      card.className = "DX_Shop_Card";

      if (item.icon && preloadedShopIcons[item.icon]) {
        card.appendChild(preloadedShopIcons[item.icon].cloneNode(true));
      }

      const nameDiv = document.createElement("div");
      nameDiv.className = "DX_Shop_Name DX_NoSel";
      nameDiv.innerText = item.displayName || "Unknown";
      card.appendChild(nameDiv);

      const btn = document.createElement("button");
      btn.className = "DX_Shop_Btn";
      btn.dataset.id = item.id;
      btn.innerText = "GET";

      btn.addEventListener("click", async () => {
        if (btn.className.includes("loading")) return;
        btn.className = "DX_Shop_Btn loading";
        btn.innerText = "...";

        const result = await applyPowerUp({
          id: item.id,
          refill: /refill/i.test(item.id),
        });
        if (result.ok) {
          btn.className = "DX_Shop_Btn got";
          btn.innerText = "✓";
          notify(
            "success",
            "Shop",
            `Successfully acquired ${item.displayName}.`,
          );
          setTimeout(() => {
            btn.className = "DX_Shop_Btn";
            btn.innerText = "GET";
          }, 2000);
        } else {
          btn.className = "DX_Shop_Btn fail";
          btn.innerText = "ERR";
          notify("error", "Shop", `${item.displayName}: ${result.msg}`);
          setTimeout(() => {
            btn.className = "DX_Shop_Btn";
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

      const selEl = document.getElementById("DX_Privacy_Select");
      if (selEl) {
        const tVal = isPriv ? "private" : "public";
        selEl.setAttribute("data-value", tVal);
        selEl.querySelector(".DX_Select_Text").innerText = isPriv
          ? "Private"
          : "Public";

        selEl.querySelectorAll(".DX_Select_Option").forEach((opt) => {
          if (opt.getAttribute("data-value") === tVal) {
            opt.style.color = "rgb(var(--DX-blue))";
            opt.style.background = "rgba(var(--DX-blue),0.1)";
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
      notify(
        "error",
        "Privacy Settings",
        "Failed to update profile privacy status.",
      );
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
      notify("error", "Social Tools", "Please connect your account first.");
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
      resetBtn("DX_Follow_Btn", "RUN");
      return;
    }
    if (!(await ensureEmailVerified())) return;
    farmStates.unfollow = true;
    stopBtn("DX_Follow_Btn");

    let list = [];
    try {
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
        setProgress("DX_Follow", (done / list.length) * 100);
        await wait(delayMs);
      }

      const completed = farmStates.unfollow;
      notify(
        "success",
        completed ? "Mass Unfollow Complete" : "Mass Unfollow Stopped",
        `Unfollowed ${ok} user(s).`,
      );
      clearProgress("DX_Follow", completed);
    } finally {
      farmStates.unfollow = false;
      resetBtn("DX_Follow_Btn", "RUN");
    }
  }

  async function massUnblock() {
    if (farmStates.unblock) {
      farmStates.unblock = false;
      resetBtn("DX_Block_Mass_Btn", "RUN");
      return;
    }
    if (!(await ensureEmailVerified())) return;
    farmStates.unblock = true;
    stopBtn("DX_Block_Mass_Btn");

    let list = [];
    try {
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
        setProgress("DX_Block_Mass", (done / list.length) * 100);
        await wait(delayMs);
      }

      const completed = farmStates.unblock;
      if (ok > 0) autoBlockCohortKey = null;
      notify(
        "success",
        completed ? "Mass Unblock Complete" : "Mass Unblock Stopped",
        `Unblocked ${ok} user(s).`,
      );
      clearProgress("DX_Block_Mass", completed);
    } finally {
      farmStates.unblock = false;
      resetBtn("DX_Block_Mass_Btn", "RUN");
    }
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
      resetBtn("DX_Follow_Btn", "RUN");
      return;
    }
    if (!(await ensureEmailVerified())) return;
    farmStates.follow = true;
    stopBtn("DX_Follow_Btn");

    try {
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
        setProgress("DX_Follow", (done / list.length) * 100);
        await wait(delayMs);
      }

      const completed = farmStates.follow;
      notify(
        "success",
        completed ? "Mass Follow Complete" : "Mass Follow Stopped",
        `Followed ${ok} user(s).`,
      );
      clearProgress("DX_Follow", completed);
    } finally {
      farmStates.follow = false;
      resetBtn("DX_Follow_Btn", "RUN");
    }
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
      if (!isAuto) {
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
      setProgress("DX_Block_Mass", (done / list.length) * 100);
      await wait(delayMs);
    }

    if (ok === list.length) autoBlockCohortKey = cohortKey;
    return { ok, total: list.length, skipped: false };
  }

  async function massBlock() {
    if (farmStates.blockmass) {
      farmStates.blockmass = false;
      resetBtn("DX_Block_Mass_Btn", "RUN");
      return;
    }
    if (!(await ensureEmailVerified())) return;
    farmStates.blockmass = true;
    stopBtn("DX_Block_Mass_Btn");

    try {
      const result = await blockLeagueUsers();
      const completed = farmStates.blockmass;
      if (!result.skipped) {
        notify(
          "success",
          completed ? "Mass Block Complete" : "Mass Block Stopped",
          `Blocked ${result.ok} user(s).`,
        );
      }
      clearProgress("DX_Block_Mass", completed);
    } finally {
      farmStates.blockmass = false;
      resetBtn("DX_Block_Mass_Btn", "RUN");
    }
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
    const btn = document.getElementById("DX_Gift_Btn");
    const lbl = btn ? btn.querySelector(".DX_Sm_Btn_Label") : null;
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
    const btn = document.getElementById("DX_Friend_Btn");
    const lbl = btn ? btn.querySelector(".DX_Sm_Btn_Label") : null;
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
      const cont = document.getElementById("DX_Status_Container");
      if (!cont) return;
      const activeBtn = cont.querySelector(".DX_Shop_Btn.got");
      const card = activeBtn ? activeBtn.closest(".DX_Shop_Card") : null;
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
    const search = document.getElementById("DX_Status_Search");
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
    const navIco = document.getElementById("DX_Board_Nav_Ico");
    const tierIco = document.getElementById("DX_Board_Tier_Ico");
    const tierName = document.getElementById("DX_Board_Tier_Name");
    if (navIco) navIco.src = url;
    if (tierIco) tierIco.src = url;
    if (tierName) tierName.innerText = name;
  }

  function updateProfileLeague(tier, rank) {
    const wrap = document.getElementById("DX_ULeague_Wrap");
    const ico = document.getElementById("DX_ULeague_Ico");
    const rk = document.getElementById("DX_ULeague_Rank");
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
    sep.className = "DX_LB_Sep";
    sep.style.cssText =
      "display: flex; align-items: center; gap: 8px; margin: 6px 2px; height: 14px; align-self: stretch;";

    const lineCol = isProm
      ? "rgba(var(--DX-green), 0.35)"
      : "rgba(var(--DX-red), 0.35)";
    const textCol = isProm ? "rgb(var(--DX-green))" : "rgb(var(--DX-red))";

    sep.innerHTML = `
            <div style="flex: 1; height: 1px; background: ${lineCol}; border-radius: 1px;"></div>
            <div style="display: flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: ${textCol}; flex-shrink: 0;">
                <img class="DX_NoSel" src="${arrowUrl}" style="width: 14px; height: 14px; object-fit: contain; flex-shrink: 0;">
                <span>${textStr}</span>
                <img class="DX_NoSel" src="${arrowUrl}" style="width: 14px; height: 14px; object-fit: contain; flex-shrink: 0;">
            </div>
            <div style="flex: 1; height: 1px; background: ${lineCol}; border-radius: 1px;"></div>
        `;
    return sep;
  }

  async function showLeagueBoard(preData) {
    const cont = document.getElementById("DX_Board_Container");
    if (!cont) return;
    const loaded = cont.dataset.loaded === "1";
    if (!loaded)
      cont.innerHTML = `<p class="DX_T2 DX_NoSel" style="text-align: center; padding: 8px 0;">Loading...</p>`;

    try {
      const data = preData || (await fetchLeagueData(false));
      const cohort = data?.active?.cohort;
      const contest = data?.active?.contest;
      const rankings = cohort?.rankings;
      if (!Array.isArray(rankings) || rankings.length === 0) {
        if (!loaded)
          cont.innerHTML = `<p class="DX_T2 DX_NoSel" style="text-align: center; color: rgb(var(--DX-red));">You are not in an active league.</p>`;
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
          statusHtml = `<div class="DX_Board_MyStatus DX_NoSel" title="Tap to change your status" style="position: absolute; right: -5px; top: -5px; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; background: var(--dx-bg); box-shadow: 0 2px 4px rgba(0,0,0,0.15); border: 1px solid var(--dx-card-border); z-index: 2;">${inner}</div>`;
        } else {
          statusHtml = st
            ? `<div class="DX_NoSel" title="${escapeHtml(st.name)}" style="position: absolute; right: -5px; top: -5px; display: flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; background: var(--dx-bg); box-shadow: 0 2px 4px rgba(0,0,0,0.15); border: 1px solid var(--dx-card-border); z-index: 2;">${renderStatusIcon(st, 12)}</div>`
            : "";
        }
        const row = document.createElement("div");
        row.className = "DX_HStack_Auto";
        row.style.cssText =
          "align-self: stretch; padding: 8px 10px; border-radius: var(--DX-r-s); corner-shape: var(--DX-corner); gap: 8px; background: var(--dx-card-bg);" +
          (isMe
            ? " outline: 1px solid rgba(var(--DX-blue), 0.5); outline-offset: -1px; background: rgba(var(--DX-blue), 0.08);"
            : "");
        row.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
                        ${
                          rank <= 3
                            ? `<img class="DX_NoSel" src="${podiumMedals[rank - 1]}" alt="#${rank}" title="#${rank}" style="width: 24px; height: 24px; object-fit: contain; flex-shrink: 0;">`
                            : `<span class="DX_T1 DX_NoSel" style="width: 22px; text-align: center; flex-shrink: 0;">${rank}</span>`
                        }
                        <div class="DX_Avatar_Container" style="position: relative; width: 30px; height: 30px; flex-shrink: 0;">
                            <img src="${escapeHtml(av)}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; background: var(--dx-card-border);" onerror="this.style.visibility='hidden'">
                            ${statusHtml}
                        </div>
                        <p class="DX_T1 DX_NoSel" style="font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(r.display_name || "Unknown")}</p>
                    </div>
                    <p class="DX_T2 DX_NoSel" style="flex-shrink: 0;">${(r.score || 0).toLocaleString()} XP</p>
                `;
        frag.appendChild(row);
        if (isMe) {
          const myEl = row.querySelector(".DX_Board_MyStatus");
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
      const barIco = document.getElementById("DX_Board_Status_Ico");
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
        cont.innerHTML = `<p class="DX_T2 DX_NoSel" style="text-align: center; color: rgb(var(--DX-red));">Failed to load leaderboard.</p>`;
    }
  }

  async function removeHearts(count) {
    const btn = document.getElementById("DX_Hearts_Btn");
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
      setProgress("DX_Hearts", ((i + 1) / count) * 100);
      await wait(delayMs);
    }
    notify(
      ok > 0 ? "success" : "error",
      "Remove Hearts",
      ok > 0 ? `Removed ${ok} heart(s).` : "Failed to remove hearts.",
    );
    clearProgress("DX_Hearts", ok > 0);
    if (btn) btn.disabled = false;
  }

  function applyLocalMax() {
    if (localStorage.getItem("dx_local_max") !== "true") return;
    if (document.getElementById("DX_LocalMax_Script")) return;
    const script = document.createElement("script");
    script.id = "DX_LocalMax_Script";
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
                    const method = resource instanceof Request ? resource.method : ((options && options.method) || 'GET');
                    const m = method.toUpperCase();
                    if (m === 'GET' && TARGET_URL_REGEX.test(url)) {
                        return originalFetch.apply(this, arguments).then(async function (response) {
                            const resp = response.clone();
                            let raw = await resp.text();
                            try {
                                let data = JSON.parse(raw);
                                data.hasPlus = true;
                                if (!data.trackingProperties || typeof data.trackingProperties !== 'object') data.trackingProperties = {};
                                data.trackingProperties.has_item_gold_subscription = true;
                                data.shopItems = Object.assign({}, data.shopItems, CUSTOM_SHOP_ITEMS);
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
                                        let data = JSON.parse(raw);
                                        data.hasPlus = true;
                                        if (!data.trackingProperties || typeof data.trackingProperties !== 'object') data.trackingProperties = {};
                                        data.trackingProperties.has_item_gold_subscription = true;
                                        data.shopItems = Object.assign({}, data.shopItems, CUSTOM_SHOP_ITEMS);
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
        notify("success", "Leaderboard Status", "Status successfully updated.");

        const me = leagueDataCache?.active?.cohort?.rankings?.find(
          (r) => String(r.user_id) === String(userId),
        );
        if (me) me.reaction = reaction;
        leagueDataTs = 0;

        return true;
      }
      notify(
        "error",
        "Leaderboard Status",
        `Failed to update status (Status ${res.status}).`,
      );
      return false;
    } catch {
      notify("error", "Leaderboard Status", "Network error: Request failed.");
      return false;
    }
  }

  function renderStatusIcon(st, size = 12) {
    if (!st) return "";
    if (st.icon) {
      if (st.icon.startsWith("<svg")) {
        return `<div style="display: flex; align-items: center; justify-content: center; width: ${size}px; height: ${size}px; color: var(--dx-text);">${st.icon.replace("<svg ", `<svg style="width:${size}px; height:${size}px;" `)}</div>`;
      }
      return `<img src="${escapeHtml(st.icon)}" alt="${escapeHtml(st.name)}" style="width: ${size}px; height: ${size}px; object-fit: contain;">`;
    }
    return `<span style="font-size: ${Math.round(size * 0.83)}px; line-height: 1;">${escapeHtml(statusFallback(st))}</span>`;
  }

  function showStatuses(filterStr) {
    const cont = document.getElementById("DX_Status_Container");
    if (!cont) return;

    cont.innerHTML = "";
    const query = (filterStr || "").trim().toLowerCase();
    const items = query
      ? statusReactions.filter((s) => s.name.toLowerCase().includes(query))
      : statusReactions;

    if (items.length === 0) {
      cont.innerHTML = `<p class="DX_T2 DX_NoSel" style="text-align: center;">No statuses found.</p>`;
      return;
    }

    const grid = document.createElement("div");
    grid.className = "DX_Shop_Grid";

    const fragment = document.createDocumentFragment();
    let currentCat = null;

    items.forEach((s) => {
      if (s.cat !== currentCat) {
        currentCat = s.cat;
        const secHeader = document.createElement("div");
        secHeader.className = "DX_Shop_Section_Header DX_NoSel";
        secHeader.innerHTML = `
                    <div class="DX_Shop_Section_Line"></div>
                    <span class="DX_Shop_Section_Title">${currentCat}</span>
                    <div class="DX_Shop_Section_Line"></div>
                `;
        fragment.appendChild(secHeader);
      }

      const card = document.createElement("div");
      card.className = "DX_Shop_Card";

      const ico = document.createElement("div");
      ico.className = "DX_NoSel";
      ico.style.cssText =
        "font-size: 30px; line-height: 36px; height: 36px; display: flex; align-items: center; justify-content: center;";
      if (s.icon) {
        if (s.icon.startsWith("<svg")) {
          ico.innerHTML = s.icon;
          const svgEl = ico.querySelector("svg");
          if (svgEl) {
            svgEl.style.cssText =
              "width: 36px; height: 36px; color: var(--dx-text);";
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
      nameDiv.className = "DX_Shop_Name DX_NoSel";
      nameDiv.innerText = s.name;
      card.appendChild(nameDiv);

      const isActive = currentStatus !== null && s.value === currentStatus;
      if (isActive) {
        card.style.outlineColor = "rgba(var(--DX-blue), 0.6)";
      }

      const btn = document.createElement("button");
      btn.className = isActive ? "DX_Shop_Btn got" : "DX_Shop_Btn";
      btn.innerText = isActive ? "ACTIVE" : "SET";

      btn.addEventListener("click", async () => {
        if (btn.className.includes("loading") || btn.className.includes("got"))
          return;
        btn.className = "DX_Shop_Btn loading";
        btn.innerText = "...";

        const ok = await setStatus(s.value);
        if (ok) {
          currentStatus = s.value;
          showStatuses(document.getElementById("DX_Status_Search").value);
          if (leagueDataCache) applyLeagueSummary(leagueDataCache);
        } else {
          btn.className = "DX_Shop_Btn fail";
          btn.innerText = "ERR";
          setTimeout(() => {
            btn.className = "DX_Shop_Btn";
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
      const mainBox = document.getElementById("DX_Main_Box");
      if (!mainBox) {
        return;
      }
      lastDark = isDark;

      const notifMain = document.getElementById("DX_Notif_Main");
      const hideBtn = document.getElementById("duoxjs-hide-button");
      const targets = [mainBox, notifMain, hideBtn].filter(Boolean);
      targets.forEach((el) => {
        el.classList.toggle("dx-dark", isDark);
        el.classList.toggle("dx-light", !isDark);
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

  function dxVpWidth() {
    return Math.round(
      window.visualViewport ? window.visualViewport.width : window.innerWidth,
    );
  }

  function dxVpHeight() {
    return Math.round(
      window.visualViewport ? window.visualViewport.height : window.innerHeight,
    );
  }

  function dxVpOffsetTop() {
    return window.visualViewport ? window.visualViewport.offsetTop : 0;
  }

  function dxVpOffsetLeft() {
    return window.visualViewport ? window.visualViewport.offsetLeft : 0;
  }

  function dxMargin() {
    return dxVpWidth() <= 480 ? 8 : 16;
  }

  function dxPageWidth() {
    return 325;
  }

  function dxMaxHeight() {
    const btn = document.getElementById("duoxjs-hide-button");
    const reserve = btn ? btn.offsetHeight + 8 : 48;
    return dxVpHeight() - dxMargin() * 2 - reserve;
  }

  function clampPos(left, top) {
    const wrap = document.getElementById("DX_Main");
    const m = dxMargin();
    const offTop = dxVpOffsetTop();
    const offLeft = dxVpOffsetLeft();
    const minL = m + offLeft;
    const minT = m + offTop;
    const maxL = Math.max(minL, offLeft + dxVpWidth() - wrap.offsetWidth - m);
    const maxT = Math.max(minT, offTop + dxVpHeight() - wrap.offsetHeight - m);
    return {
      left: Math.min(Math.max(left, minL), maxL),
      top: Math.min(Math.max(top, minT), maxT),
    };
  }

  function nearestCorner() {
    const wrap = document.getElementById("DX_Main");
    const r = wrap.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    return (
      (cy < dxVpHeight() / 2 ? "t" : "b") + (cx < dxVpWidth() / 2 ? "l" : "r")
    );
  }

  function positionPanel() {
    const wrap = document.getElementById("DX_Main");
    if (!wrap) return;
    const activeEl = document.activeElement;
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    const isVpShrunkY = window.innerHeight - dxVpHeight() > 40;
    const isVpShrunkX = window.innerWidth - dxVpWidth() > 40;
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const keyboardUp =
      (isMobile || (isTouch && isVpShrunkY)) &&
      activeEl &&
      (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA") &&
      wrap.contains(activeEl);

    const m = dxMargin();
    const top = keyboardUp ? true : panelCorner.charAt(0) === "t";
    const left = panelCorner.charAt(1) === "l";
    const offTop = dxVpOffsetTop();
    const offLeft = dxVpOffsetLeft();

    const extraRight =
      isVpShrunkX || offLeft > 0
        ? window.innerWidth - (offLeft + dxVpWidth())
        : 0;
    const extraBottom =
      isVpShrunkY || offTop > 0
        ? window.innerHeight - (offTop + dxVpHeight())
        : 0;

    wrap.style.left = left ? m + offLeft + "px" : "auto";
    wrap.style.right = left ? "auto" : m + extraRight + "px";
    wrap.style.top = top ? m + offTop + "px" : "auto";
    wrap.style.bottom = top ? "auto" : m + extraBottom + "px";
    wrap.style.flexDirection = top ? "column" : "column-reverse";
    wrap.style.alignItems = left ? "flex-start" : "flex-end";
    wrap.style.setProperty(
      "--DX-panel-origin",
      `${top ? "top" : "bottom"} ${left ? "left" : "right"}`,
    );
    wrap.style.setProperty("--DX-panel-hide-y", top ? "-8px" : "8px");
    const btn = document.getElementById("duoxjs-hide-button");
    if (btn && btn.parentElement) {
      btn.parentElement.style.alignSelf = left ? "flex-start" : "flex-end";
    }
  }

  function relayout() {
    const box = document.getElementById("DX_Main_Box");
    if (box && box.dataset.isAnimating !== "true") {
      const prevScroll = box.scrollTop;
      const w = dxPageWidth(pageId) + "px";
      if (box.style.width !== w) box.style.width = w;
      const cap = dxMaxHeight();

      const isCollapsed =
        box.classList.contains("dx-collapsed") || box.offsetHeight === 0;
      const natural = isCollapsed ? 0 : box.scrollHeight;

      if (box.style.maxHeight !== cap + "px") {
        box.style.maxHeight = cap + "px";
      }

      const needScroll = natural > cap + 4;
      if (box.classList.contains("dx-scroll") !== needScroll)
        box.classList.toggle("dx-scroll", needScroll);
      if (
        needScroll &&
        box.scrollTop !== prevScroll &&
        Date.now() > suppressScrollRestoreUntil
      ) {
        box.scrollTop = prevScroll;
      } else if (Date.now() <= suppressScrollRestoreUntil) {
        const activeEl = document.activeElement;
        if (
          activeEl &&
          (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA") &&
          box.contains(activeEl)
        ) {
          const targetRect = activeEl.getBoundingClientRect();
          const boxRect = box.getBoundingClientRect();
          const relativeTop = targetRect.top - boxRect.top + box.scrollTop;
          const targetScroll =
            relativeTop - box.offsetHeight / 2 + activeEl.offsetHeight / 2;
          box.scrollTop = Math.max(0, targetScroll);
        }
      }
    }
    positionPanel();
  }

  let relayoutQueued = false;
  let suppressScrollRestoreUntil = 0;
  function queueRelayout() {
    if (relayoutQueued) return;
    relayoutQueued = true;
    requestAnimationFrame(() => {
      relayoutQueued = false;
      relayout();
    });
  }

  let lastXpHistoryTime = 0;
  let lastFeedTime = 0;

  function refreshPageData(tPageId) {
    const now = Date.now();
    if (tPageId === "XPSummaries") {
      if (now - lastXpHistoryTime >= 30000) {
        lastXpHistoryTime = now;
        loadXpHistory();
      }
    }
    if (tPageId === "Stats") {
      loadChangelog();
    }
    if (tPageId === "Feed") {
      if (now - lastFeedTime >= 30000) {
        lastFeedTime = now;
        getFeed();
      }
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
    localStorage.setItem("dx_main_mode", mode);
    const nativeSec = document.getElementById("DX_Native_Sections");
    const solverSec = document.getElementById("DX_Solver_Sections");
    const toggleBtn = document.getElementById("DX_Mode_Toggle_Btn");
    const toggleLbl = document.getElementById("DX_Mode_Toggle_Lbl");

    if (!nativeSec || !solverSec || !toggleBtn || !toggleLbl) return;

    const showSec = mode === "native" ? nativeSec : solverSec;
    const hideSec = mode === "native" ? solverSec : nativeSec;
    const wasShown = showSec.style.display === "flex";

    const toggleIco = document.getElementById("DX_Mode_Toggle_Ico");
    if (toggleIco) {
      toggleIco.innerHTML =
        mode === "native" ? icons.modeNative : icons.modeSolver;
    }

    if (mode === "native") {
      toggleLbl.innerText = "Native Mode";
      toggleBtn.style.background = "var(--dx-card-bg)";
      toggleBtn.style.color = "var(--dx-text)";
      toggleBtn.style.outline = "1px solid var(--dx-card-border)";
      toggleBtn.style.outlineOffset = "-1px";
    } else {
      toggleLbl.innerText = "Solver Mode";
      toggleBtn.style.background = "var(--dx-card-bg)";
      toggleBtn.style.color = "var(--dx-text)";
      toggleBtn.style.outline = "1px solid var(--dx-card-border)";
      toggleBtn.style.outlineOffset = "-1px";
    }

    if (!animate || wasShown) {
      hideSec.style.display = "none";
      showSec.style.display = "flex";
      queueRelayout();
      return;
    }

    const mainBox = document.getElementById("DX_Main_Box");
    if (!mainBox || mainBox.dataset.isAnimating === "true") return;
    mainBox.dataset.isAnimating = "true";

    const activePage = document.getElementById("DX_Page_1");
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
      activePage.style.transform = "scale(0.96)";
      activePage.style.width = sW - 32 + "px";
      activePage.style.minWidth = sW - 32 + "px";

      mainBox.style.height = "auto";
      mainBox.style.maxHeight = "none";
      mainBox.classList.remove("dx-scroll");

      const natH = mainBox.offsetHeight;
      const maxH = dxMaxHeight();
      const needsScroll = natH > maxH;
      const finalH = Math.min(natH < 50 ? 200 : natH, maxH);
      mainBox.style.maxHeight = maxH + "px";

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
        activePage.style.width = "";
        activePage.style.minWidth = "";
        mainBox.dataset.isAnimating = "false";
        mainBox.classList.toggle("dx-scroll", needsScroll);
        relayout();
      }, 400);
    }, 200);
  }

  function setUiHiddenState(hidden) {
    if (uiHidden === hidden) return;
    uiHidden = hidden;
    localStorage.setItem("dx_ui_hidden", uiHidden ? "true" : "false");
    const wrap = document.getElementById("DX_Main");
    const mBox = document.getElementById("DX_Main_Box");
    const lblTxt = document.getElementById("hide-show-text");
    const togHide = document.getElementById("duoxjs-hide-button");
    if (!wrap || !mBox || !lblTxt || !togHide) return;

    const easeCurve = "cubic-bezier(0.34, 1.15, 0.64, 1)";
    const fadeCurve = "cubic-bezier(0.4, 0, 0.2, 1)";

    mBox.dataset.isAnimating = "true";
    clearTimeout(hideCollapseTimer);
    clearTimeout(hideShowContentTimer);

    if (uiHidden) {
      togHide.classList.add("duoxjs-show-mode");
      lblTxt.innerText = "Show";

      const startW = mBox.offsetWidth;
      const startH = mBox.offsetHeight;

      mBox.style.transition = "none";
      mBox.style.width = startW + "px";
      mBox.style.height = startH + "px";
      mBox.style.padding = "16px";
      mBox.style.opacity = "1";
      mBox.style.filter = "blur(0px)";
      mBox.style.transform = "scale(1)";
      void mBox.offsetHeight;

      mBox.style.transition = `opacity 0.2s ${fadeCurve}, filter 0.2s ${fadeCurve}, transform 0.2s ${fadeCurve}`;
      mBox.style.opacity = "0";
      mBox.style.filter = "blur(6px)";
      mBox.style.transform = "scale3d(0.96, 0.96, 1)";

      hideCollapseTimer = setTimeout(() => {
        mBox.style.transition = `height 0.4s ${easeCurve}, width 0.4s ${easeCurve}, padding 0.4s ${easeCurve}`;
        mBox.style.height = "0px";
        mBox.style.width = "0px";
        mBox.style.padding = "0px";
        wrap.classList.add("dx-panel-hidden");

        hideCollapseTimer = setTimeout(() => {
          mBox.classList.add("dx-hidden");
          mBox.classList.add("dx-collapsed");
          mBox.style.transition = "";
          mBox.style.opacity = "";
          mBox.style.filter = "";
          mBox.style.transform = "";
          mBox.style.height = "";
          mBox.style.width = "";
          mBox.style.padding = "";
          mBox.dataset.isAnimating = "false";
        }, 400);
      }, 200);
    } else {
      togHide.classList.remove("duoxjs-show-mode");
      lblTxt.innerText = "Hide";

      mBox.style.transition = "none";
      mBox.classList.remove("dx-collapsed");
      mBox.classList.remove("dx-hidden");
      wrap.classList.remove("dx-panel-hidden");

      const targetW = dxPageWidth();
      mBox.style.width = targetW + "px";
      mBox.style.height = "auto";
      mBox.style.padding = "16px";

      const cap = dxMaxHeight();
      const natural = mBox.offsetHeight;
      const targetH = Math.min(natural, cap);

      mBox.style.width = "0px";
      mBox.style.height = "0px";
      mBox.style.padding = "0px";
      mBox.style.opacity = "0";
      mBox.style.filter = "blur(6px)";
      mBox.style.transform = "scale3d(0.96, 0.96, 1)";
      void mBox.offsetHeight;

      mBox.style.transition = `height 0.4s ${easeCurve}, width 0.4s ${easeCurve}, padding 0.4s ${easeCurve}`;
      mBox.style.width = targetW + "px";
      mBox.style.height = targetH + "px";
      mBox.style.padding = "16px";

      const activeP = mBox.querySelector(".DX_Page.active");
      if (activeP) {
        activeP.style.width = targetW - 32 + "px";
        activeP.style.minWidth = targetW - 32 + "px";
      }

      hideShowContentTimer = setTimeout(() => {
        mBox.style.transition = `opacity 0.3s ${fadeCurve}, filter 0.3s ${fadeCurve}, transform 0.3s ${easeCurve}, height 0.4s ${easeCurve}, width 0.4s ${easeCurve}, padding 0.4s ${easeCurve}`;
        mBox.style.opacity = "1";
        mBox.style.filter = "none";
        mBox.style.transform = "scale(1)";
      }, 50);

      hideCollapseTimer = setTimeout(() => {
        mBox.style.transition = "";
        mBox.style.opacity = "";
        mBox.style.filter = "";
        mBox.style.transform = "";
        mBox.style.height = "";
        mBox.style.width = "";
        mBox.style.padding = "";
        if (activeP) {
          activeP.style.width = "";
          activeP.style.minWidth = "";
        }
        mBox.dataset.isAnimating = "false";
        relayout();
      }, 400);
    }
  }

  function changePage(tPageId) {
    const mainBox = document.getElementById("DX_Main_Box");
    if (mainBox.dataset.isAnimating === "true") return;
    if (pageId === tPageId) {
      refreshPageData(tPageId);
      return;
    }

    mainBox.dataset.isAnimating = "true";

    if (tPageId === "Extra") {
      const lSel = document.getElementById("DX_League_Select");
      if (lSel) {
        const st = parseInt(localStorage.getItem("dx_league_target"));
        const tv = !isNaN(st) && st >= 1 && st <= 15 ? st : 1;
        const lTxt = lSel.querySelector(".DX_Select_Text");
        if (lTxt) lTxt.innerText = `# ${tv}`;
        lSel.setAttribute("data-value", tv.toString());
      }
    }

    if (tPageId === "Settings") {
      const qSel = document.getElementById("DX_EZQuizLength_Select");
      if (qSel) {
        const storedLen = localStorage.getItem("dx_ez_quiz_len") || "5";
        const qTxt = qSel.querySelector(".DX_Select_Text");
        if (qTxt) {
          qTxt.innerText = storedLen;
        }
        qSel.setAttribute("data-value", storedLen);
        qSel.querySelectorAll(".DX_Select_Option").forEach((opt) => {
          opt.classList.toggle(
            "selected",
            opt.getAttribute("data-value") === storedLen,
          );
        });
      }
    }

    const origPage = document.getElementById(
      pageId === 1 ? "DX_Page_1" : `DX_Page_${pageId}`,
    );
    const tPage = document.getElementById(
      tPageId === 1 ? "DX_Page_1" : `DX_Page_${tPageId}`,
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
      tPage.style.transform = "scale(0.96)";

      mainBox.style.width = "auto";
      mainBox.style.height = "auto";
      mainBox.style.maxHeight = "none";
      mainBox.classList.remove("dx-scroll");

      let cTargetW = dxPageWidth(tPageId);
      mainBox.style.width = cTargetW + "px";

      const natH = mainBox.offsetHeight;
      const maxH = dxMaxHeight();
      const needsScroll = natH > maxH;
      const finalH = Math.min(natH < 50 ? 200 : natH, maxH);

      mainBox.style.maxHeight = maxH + "px";

      mainBox.style.width = sW + "px";
      mainBox.style.height = sH + "px";
      void mainBox.offsetHeight;

      tPage.style.width = cTargetW - 32 + "px";
      tPage.style.minWidth = cTargetW - 32 + "px";

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
        tPage.style.width = "";
        tPage.style.minWidth = "";
        pageId = tPageId;
        mainBox.dataset.isAnimating = "false";
        mainBox.classList.toggle("dx-scroll", needsScroll);
        relayout();

        refreshPageData(tPageId);
      }, 400);
    }, 200);
  }

  function toggleInf(idPre) {
    const togBtn = document.getElementById(`DX_${idPre}_Hash`);
    const inpEl = document.getElementById(`DX_${idPre}_Input`);
    const inpWrap = inpEl.parentElement;

    togBtn.addEventListener("click", () => {
      const isInf = togBtn.getAttribute("data-inf") === "true";

      if (isInf) {
        togBtn.innerHTML = icons.hash;
        togBtn.setAttribute("data-inf", "false");
        togBtn.classList.remove("dx-inf-active");
        inpWrap.classList.remove("dx-inf-hidden");
        inpEl.disabled = false;
        inpEl.value = "";
      } else {
        togBtn.innerHTML =
          icons.inf + '<span class="DX_Hash_Lbl">Infinite</span>';
        togBtn.setAttribute("data-inf", "true");
        togBtn.classList.add("dx-inf-active");
        inpWrap.classList.add("dx-inf-hidden");
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

    if (idPre !== "DX_League") {
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
      const selEl = document.getElementById("DX_League_Select");
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

    const isSolverRunning =
      autoPathEnabled || autoPracticeEnabled || autoLegendaryEnabled;
    if (isSolverRunning) {
      const modeName = autoPathEnabled
        ? "Auto Lesson"
        : autoPracticeEnabled
          ? "Auto Practice"
          : "Auto Legendary";
      const farmName =
        type === "xp"
          ? "XP Farm"
          : type === "gem"
            ? "Gem Farm"
            : type === "streak"
              ? "Streak Farm"
              : "Auto League";
      showConfirmModal(
        `${modeName} is currently running. Do you want to stop it to run ${farmName}?`,
        () => {
          stopAllSolverModes();
          startExecution();
        },
      );
      return;
    }

    if (type === "league" && farmStates.xp) {
      showConfirmModal(
        "XP Farm is currently running. Do you want to stop it to run Auto League?",
        () => {
          stopFarm("xp");
          resetBtn("DX_XP_Btn", "RUN");
          startExecution();
        },
      );
      return;
    }

    if (type === "xp" && farmStates.league) {
      showConfirmModal(
        "Auto League is currently running. Do you want to stop it to run XP Farm?",
        () => {
          stopFarm("league");
          resetBtn("DX_League_Btn", "RUN");
          startExecution();
        },
      );
      return;
    }

    if (
      type === "xp" ||
      type === "gem" ||
      type === "streak" ||
      type === "league"
    ) {
      const otherActiveFarms = Object.keys(farmStates).filter(
        (key) => key !== type && farmStates[key],
      );
      if (otherActiveFarms.length > 0) {
        otherActiveFarms.forEach((activeKey) => {
          stopFarm(activeKey);
          const btnId =
            activeKey === "xp"
              ? "DX_XP"
              : activeKey === "gem"
                ? "DX_Gem"
                : activeKey === "streak"
                  ? "DX_Streak"
                  : "DX_League";
          resetBtn(`${btnId}_Btn`, "RUN");
        });
      }
    }

    startExecution();
  }

  function toggleAutoSolve(value) {
    if (value === "start") {
      window.dispatchEvent(
        new CustomEvent("DX_TriggerSolveAll", { detail: { action: "start" } }),
      );
    } else if (value === "stop") {
      window.dispatchEvent(
        new CustomEvent("DX_TriggerSolveAll", { detail: { action: "stop" } }),
      );
    } else {
      window.dispatchEvent(new CustomEvent("DX_TriggerSolveAll"));
    }
  }

  async function runAutoSolve() {
    window.dispatchEvent(new CustomEvent("DX_TriggerSolveOnce"));
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

    if (autoSolverEnabled && !isAutoMode && !solverPausedByUser) {
      toggleAutoSolve("start");
    }

    if (!solverButtonsEnabled) return;
    if (document.querySelector("#solveAllButton")) return;

    document
      .querySelector('[data-test="quit-button"]')
      ?.addEventListener("click", function outerHandler() {
        solverPausedByUser = false;
        if (isAutoMode) toggleAutoSolve("stop");
      });

    const nextButton = document.querySelector('[data-test="player-next"]');
    const skipButton = document.querySelector('[data-test="player-skip"]');
    const storiesContinueButton = document.querySelector(
      '[data-test="stories-player-continue"]',
    );
    const storiesDoneButton = document.querySelector(
      '[data-test="stories-player-done"]',
    );
    const footerButton =
      document.querySelector('[data-test="player-footer"] button') ||
      document.querySelector("footer button");
    const target =
      nextButton ||
      skipButton ||
      storiesContinueButton ||
      storiesDoneButton ||
      footerButton;

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
    if (duolingoPROSolveButtonsObserver) {
      duolingoPROSolveButtonsObserver.disconnect();
      duolingoPROSolveButtonsObserver = null;
    }

    if (
      document.querySelector(
        '[data-test="player-next"], [data-test="player-skip"], [data-test="stories-player-continue"], [data-test="stories-player-done"], [data-test="story-start"], [data-test="player-footer"], footer button',
      )
    ) {
      injectSolverButtons();
    }

    let _observerTimeout = null;
    duolingoPROSolveButtonsObserver = new MutationObserver(() => {
      if (_observerTimeout) return;
      if (
        document.querySelector(
          '[data-test="player-next"], [data-test="stories-player-continue"], [data-test="stories-player-done"], [data-test="story-start"]',
        )
      ) {
        _observerTimeout = setTimeout(() => {
          injectSolverButtons();
          _observerTimeout = null;
        }, 50);
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
    if (localStorage.getItem("dx_ez_quiz") !== "true") return;
    if (document.getElementById("DX_EZQuiz_Script")) return;
    const storedLen = localStorage.getItem("dx_ez_quiz_len") || "5";
    clearPrefetchedSessionsCache();
    const script = document.createElement("script");
    script.id = "DX_EZQuiz_Script";
    script.textContent = `
            (function() {
                const ezQuizLen = "${storedLen}";
                const STORY_RX = /\\/api2\\/stories\\//;

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
                const storyOriginalChallenges = {};
                const storyOriginalElements = {};
                const originalFetch = window.fetch;
                window.fetch = function(resource, options) {
                    const url = String(resource instanceof Request ? resource.url : resource);
                    const method = resource instanceof Request ? resource.method : ((options && options.method) || 'GET');
                    const m = method.toUpperCase();

                    if (m === 'PUT' && url.indexOf('/sessions') !== -1 && options && options.body) {
                        try {
                            let bodyData = JSON.parse(options.body);
                            if (bodyData && bodyData.id) {
                                if (alphabetOriginalChallenges[bodyData.id]) {
                                    bodyData.challenges = alphabetOriginalChallenges[bodyData.id];
                                    delete alphabetOriginalChallenges[bodyData.id];
                                    options.body = JSON.stringify(bodyData);
                                } else if (storyOriginalChallenges[bodyData.id]) {
                                    bodyData.challenges = storyOriginalChallenges[bodyData.id];
                                    delete storyOriginalChallenges[bodyData.id];
                                    bodyData.failed = false;
                                    bodyData.heartsLeft = 5;
                                    options.body = JSON.stringify(bodyData);
                                }
                            }
                        } catch (e) {}
                    }



                                        if (m === 'POST' && url.indexOf('/complete') !== -1 && url.indexOf('/stories/') !== -1) {
                        try {
                            const storyId = url.split('/stories/')[1].split('/')[0];
                            if (storyOriginalElements[storyId] && options && options.body) {
                                let bodyData = JSON.parse(options.body);
                                bodyData.elements = storyOriginalElements[storyId];
                                bodyData.furthestPosition = { elementIndex: bodyData.elements.length - 1, textIndex: 0 };
                                bodyData.selectedPosition = { elementIndex: bodyData.elements.length - 1, textIndex: 0 };
                                bodyData.status = "story-end";
                                bodyData.storyCompleteRequestStatus = "ok";
                                bodyData.completed = true;
                                bodyData.failed = false;
                                bodyData.heartsLeft = 5;
                                options.body = JSON.stringify(bodyData);
                            }
                        } catch (e) {}
                    }

                    if (m === 'GET' && STORY_RX.test(url)) {
                        return originalFetch.apply(this, arguments).then(function(r) {
                            return r.clone().text().then(function(text) {
                                try {
                                    const storyId = url.split('/').pop().split('?')[0];
                                    storyOriginalElements[storyId] = JSON.parse(text).elements;
                                } catch (e) {}
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
                                const isStory = (data.type && String(data.type).toLowerCase().indexOf('story') !== -1) ||
                                                window.location.pathname.includes('/stories');
                                if (isStory) {
                                    if (data.id && data.challenges) {
                                        storyOriginalChallenges[data.id] = JSON.parse(JSON.stringify(data.challenges));
                                    }
                                    return r;
                                }
                                const isChess = (data.learningLanguage && (String(data.learningLanguage).toLowerCase() === 'chess' || String(data.learningLanguage).toLowerCase() === 'ch')) ||
                                                (data.type && String(data.type).toUpperCase().indexOf('CHESS') !== -1);
                                if (isChess) {
                                    const path = window.location.pathname;
                                    const isLessonPage = path.includes('/lesson') ||
                                                         path.includes('/practice') ||
                                                         path.includes('/practice-hub') ||
                                                         path.includes('/alphabets') ||
                                                         path.includes('/characters') ||
                                                         path.includes('/character-practice') ||
                                                         path.includes('/stories') ||
                                                         path.includes('/chess-match');
                                    if (isLessonPage) {
                                        const origType = String(data.type).toUpperCase();
                                        if (origType.indexOf('PRACTICE') !== -1) data.type = 'PRACTICE';
                                        else if (origType.indexOf('TEST') !== -1 || origType.indexOf('SECTION') !== -1) data.type = 'UNIT_TEST';
                                        else if (origType.indexOf('LEGENDARY') !== -1) data.type = 'LEGENDARY_0';
                                        else data.type = 'LESSON';
                                    } else {
                                        return r;
                                    }
                                }
                                const isSpecifiedMatch = data.type && String(data.type).toUpperCase().indexOf('SPECIFIED_MATCH_PRACTICE') !== -1;

                                const isDuoRadio = data.metadata && data.metadata.type && data.metadata.type.toUpperCase() === "DUORADIO";

                                if (isDuoRadio) {
                                    data.introLengthMillis = 1;
                                    data.outroPoseShowMillis = 1;
                                    data.titleCardShowMillis = 1;
                                    data.challenges = data.challenges.map(function(ch) {
                                        return Object.assign({}, ch, {
                                            audioText: "DuoXJS!",
                                            audioUrl: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA",
                                            prompt: "DuoXJS by LibreDuo",
                                            isTrue: true,
                                            type: "radioBinary"
                                        });
                                    });
                                    data.elements = data.elements.map(function(el) {
                                        if (el.type === "challenge") {
                                            return {
                                                type: "challenge",
                                                challengeType: "binaryComprehension",
                                                prompt: "DuoXJS by LibreDuo",
                                                isTrue: true,
                                                audioText: "DuoXJS!",
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
                                    const isLegendary = data.type && data.type.indexOf('LEGENDARY') === 0;
                                    if (ezQuizLen === 'default') {
                                        n = isLegendary ? 2 : 1;
                                    } else {
                                        n = parseInt(ezQuizLen) || 10;
                                    }
                                    if (isLegendary && n < 2) {
                                        n = 2;
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
                                        prompt: "How this even possible?",
                                        choices: ["DuoXJS by LibreDuo"],
                                        correctIndex: 0,
                                        options: [{
                                            tts: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA",
                                            text: "DuoXJS by LibreDuo"
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
                                            translation: "DuoXJS",
                                            ui_language: fl,
                                            word: "DuoXJS",
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
                                    const isAlphabet = (data.type && String(data.type).toLowerCase().indexOf('alphabet') !== -1) ||
                                        window.location.pathname.startsWith('/alphabets') ||
                                        window.location.pathname.startsWith('/characters');
                                    if (isSpecifiedMatch) {
                                        if (data.challenges && data.challenges.length > 0) {
                                            data.challenges = data.challenges.slice(0, 1);
                                        }
                                        if (Array.isArray(data.elements)) {
                                            data.elements = data.elements.filter(el => el.type !== "challenge" || el.challengeIndex < 1);
                                        }
                                    } else if (isAlphabet) {
                                        if (data.challenges && data.challenges.length > 0) {
                                            alphabetOriginalChallenges[data.id] = JSON.parse(JSON.stringify(data.challenges));
                                            const firstCh = data.challenges[0];
                                            if (firstCh && firstCh.id) {
                                                const baseAlphaId = firstCh.id;
                                                data.challenges = Array.from({ length: n }, (_, idx) => {
                                                    const uniqueId = baseAlphaId.substring(0, 24) + String(idx).padStart(8, '0');
                                                    return Object.assign({}, lsChallenge, { id: uniqueId });
                                                });
                                                data.challenges[0] = Object.assign({}, lsChallenge, { id: baseAlphaId });
                                            }
                                        }

                                    } else {
                                        const baseId = lsChallenge.id;
                                        data.challenges = Array.from({ length: n }, (_, idx) => {
                                            const uniqueId = baseId.substring(0, 24) + String(idx).padStart(8, '0');
                                            return Object.assign({}, lsChallenge, { id: uniqueId });
                                        });
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
                    this._isStoryComplete = m === 'POST' && url.indexOf('/complete') !== -1 && url.indexOf('/stories/') !== -1;
                    this._storyUrl = url;
                    origOpen.call(this, method, url, ...args);
                };
                XMLHttpRequest.prototype.send = function(body) {
                    if (this._isStoryGet) {
                        const origChange = this.onreadystatechange;
                        const xhr = this;
                        this.onreadystatechange = function() {
                            if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
                                try {
                                    let raw = xhr.responseText;
                                    const storyId = xhr._storyUrl.split('/').pop().split('?')[0];
                                    storyOriginalElements[storyId] = JSON.parse(raw).elements;
                                    raw = modStory(raw);
                                    Object.defineProperty(xhr, 'responseText', { writable: true, value: raw });
                                    Object.defineProperty(xhr, 'response', { writable: true, value: raw });
                                } catch {}
                            }
                            if (origChange) origChange.apply(this, arguments);
                        };
                    }
                    if (this._isStoryComplete && body) {
                        try {
                            const storyId = this._storyUrl.split('/stories/')[1].split('/')[0];
                            if (storyOriginalElements[storyId]) {
                                let bodyData = JSON.parse(body);
                                bodyData.elements = storyOriginalElements[storyId];
                                bodyData.furthestPosition = { elementIndex: bodyData.elements.length - 1, textIndex: 0 };
                                bodyData.selectedPosition = { elementIndex: bodyData.elements.length - 1, textIndex: 0 };
                                bodyData.status = "story-end";
                                bodyData.storyCompleteRequestStatus = "ok";
                                bodyData.completed = true;
                                bodyData.failed = false;
                                bodyData.heartsLeft = 5;
                                body = JSON.stringify(bodyData);
                            }
                        } catch (e) {}
                    }
                    origSend.call(this, body);
                };
            })();
        `;
    document.documentElement.appendChild(script);
  }

  function applyPageSolver() {
    if (document.getElementById("DX_PageSolver_Script")) return;
    const autoSolver = localStorage.getItem("dx_auto_solver") === "true";
    const randomSpeed = localStorage.getItem("dx_random_speed") === "true";
    const solveSpeedMin =
      parseFloat(localStorage.getItem("dx_solve_speed_min")) || 2.8;
    const solveSpeedMax =
      parseFloat(localStorage.getItem("dx_solve_speed_max")) || 12.4;
    const solveSpeedFixed =
      parseInt(localStorage.getItem("dx_solve_speed_fixed")) || 400;

    const script = document.createElement("script");
    script.id = "DX_PageSolver_Script";
    script.textContent = `
            (function() {
                const initAutoSolver = ${autoSolver};
                const initRandomSpeed = ${randomSpeed};
                const initSolveSpeedMin = ${solveSpeedMin};
                const initSolveSpeedMax = ${solveSpeedMax};
                const initSolveSpeedFixed = ${solveSpeedFixed};

                let isAutoMode = false;
                let solverPausedByUser = false;
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
                            window.dispatchEvent(new CustomEvent('DX_Notify', {
                                detail: { type: 'error', title: 'Auto Solver', body: 'Solver has detected that it solved a question incorrectly.' }
                            }));
                        } else if (flag === 3) {
                            window.dispatchEvent(new CustomEvent('DX_Notify', {
                                detail: { type: 'error', title: 'Auto Solver', body: 'Solver has detected that it is stuck on a question.' }
                            }));
                        }
                    }
                }

                function solverFindNextButton() {
                    let nextButton = document.querySelector('[data-test="player-next"]') ||
                        document.querySelector('[data-test="stories-player-continue"]') ||
                        document.querySelector('[data-test="stories-player-done"]');

                    if (!nextButton) {
                        const btns = Array.from(document.querySelectorAll('button:not(#DX_Root *), [role="button"]:not(#DX_Root *)'));
                        nextButton = btns.find(btn => {
                            const txt = (btn.textContent || btn.innerText || "").toUpperCase().trim();
                            return txt === "CONTINUE" || txt === "NO THANKS";
                        });
                    }
                    return nextButton;
                }

                async function solverClickCheck() {
                    try {
                        let nextButtonNormal = document.querySelector('[data-test="player-next"]');
                        let storiesContinueButton = document.querySelector('[data-test="stories-player-continue"]');
                        let storiesDoneButton = document.querySelector('[data-test="stories-player-done"]');

                        let nextButton = solverFindNextButton();
                        if (!nextButton) return;

                        let nextButtonAriaValue = null;
                        if (nextButton === nextButtonNormal) {
                            nextButtonAriaValue = nextButtonNormal.getAttribute('aria-disabled');
                        } else if (nextButton === storiesContinueButton) {
                            nextButtonAriaValue = storiesContinueButton.disabled;
                        } else if (nextButton === storiesDoneButton) {
                            nextButtonAriaValue = storiesDoneButton;
                        }

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
                    } catch (error) {
                        console.error(error);
                    }
                }

                function solverFindStoryContinue() {
                    try {
                        const candidates = [
                            document.getElementsByClassName('_2neC7')[0],
                            document.querySelector('[data-test="stories-player-continue"]'),
                            document.querySelector('[data-test="stories-player-done"]'),
                            document.querySelector('.FmlUF'),
                            document.querySelector('.vpDIE')
                        ];
                        for (const node of candidates) {
                            if (!node) continue;
                            const key = Object.keys(node).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
                            if (!key) continue;
                            let fiber = node[key];
                            let depth = 0;
                            while (fiber && depth < 100) {
                                const fn = fiber.memoizedProps?.continueStory || fiber.pendingProps?.continueStory;
                                if (typeof fn === 'function') return fn;
                                fiber = fiber.return;
                                depth++;
                            }
                        }
                    } catch (e) {
                        console.error(e);
                    }
                    return null;
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
                        const inStory = location.hostname.includes('stories.duolingo.com') ||
                            location.pathname.includes('/stories') ||
                            !!document.querySelector('.FmlUF') ||
                            !!document.querySelector('[data-test="stories-choice"]') ||
                            !!document.querySelector('[data-test="story-start"]') ||
                            !!document.querySelector('[data-test="stories-player-continue"]') ||
                            !!document.querySelector('[data-test="stories-player-done"]');

                        if (inStory) {
                            const continueFn = solverFindStoryContinue();
                            if (continueFn) {
                                continueFn();
                                clicked = true;
                                return;
                            }
                        }

                        let nextButton = solverFindNextButton();
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
                    const clone = button.cloneNode(true);
                    const rts = clone.querySelectorAll('rt');
                    rts.forEach(rt => rt.remove());
                    const textElement = clone.querySelector('[data-test="challenge-tap-token-text"]');
                    return textElement ? textElement.innerText.trim() : clone.innerText.trim();
                }

                function solverDetermineChallengeType() {
                    try {
                        if (document.getElementsByClassName("FmlUF").length > 0 && window.sol && ["arrange", "multiple-choice", "multiple_choice", "select-phrases", "point-to-phrase", "point_to_phrase", "match", "gap-fill", "gap_fill"].includes(window.sol.type)) {
                            if (window.sol.type === "arrange") return "Story Arrange";
                            else if (window.sol.type === "multiple-choice" || window.sol.type === "multiple_choice" || window.sol.type === "select-phrases") return "Story Multiple Choice";
                            else if (window.sol.type === "point-to-phrase" || window.sol.type === "point_to_phrase") return "Story Point to Phrase";
                            else if (window.sol.type === "match") return "Story Pairs";
                            else if (window.sol.type === "gap-fill" || window.sol.type === "gap_fill") return "Story Gap Fill";
                        } else {
                            if (window.sol && window.sol.type) {
                                const t = window.sol.type;
                                if (t === 'patternTapComplete') return 'Pattern Tap Complete';
                                else if (t === 'syllableTap') return 'Syllable Tap';
                                else if (t === 'syllableListenTap') return 'Syllable Listen Tap';
                                else if (t === 'tapCompleteTable') return 'Tap Complete Table';
                                else if (t === 'typeCloze') return 'Type Cloze';
                                else if (t === 'typeClozeTable') return 'Type Cloze Table';
                                else if (t === 'tapClozeTable') return 'Tap Cloze Table';
                                else if (t === 'typeCompleteTable') return 'Type Complete Table';
                                else if (t === 'completeReverseTranslation') return 'Complete Reverse Translation';
                                else if (t === 'listenMatch') return 'Listen Match';
                                else if (t === 'judge') return 'Judge';
                                else if (t === 'dialogue' || t === 'characterIntro' || t === 'selectTranscription') return 'Dialogue';
                                else if (t === 'select' || t === 'characterSelect' || t === 'form' || t === 'readComprehension' || t === 'listenComprehension' || t === 'selectPronunciation') return 'Select Card';
                                else if (t === 'orderTapComplete') return 'Order Tap Complete';
                                else if (t === 'gap-fill' || t === 'gap_fill') return 'Story Gap Fill';
                                else if (t === 'translate') return 'Translate';
                                else if (t === 'tapComplete' || t === 'tapCloze') return 'Indices Run';
                                else if (t === 'typeComplete') return 'Challenge Text Input';
                                else if (t === 'transliterationAssist' || t === 'reverseAssist') return 'Challenge Choice';
                                else if (t === 'listenTap') return 'Listen Tap';
                                else if (t === 'listen') return 'Listen Type';
                                else if (t === 'completeReverseTranslation') return 'Complete Reverse';
                            }

                            if (document.querySelectorAll('[data-test*="challenge-speak"]').length > 0) return 'Challenge Speak';
                            else if (document.querySelectorAll('[data-test*="challenge-name"]').length > 0 && document.querySelectorAll('[data-test="challenge-choice"]').length > 0) return 'Challenge Name';
                            else if (document.querySelectorAll('[data-test="challenge challenge-characterWrite"]').length > 0) {
                                if (document.querySelector('g._25Ktp')) return 'Character Write Drag';
                                else if (document.querySelectorAll('path._1e5Zt').length > 0) return 'Character Write Draw';
                                else return 'Character Write Freehand';
                            } else if (document.querySelectorAll('[data-test="challenge challenge-listenSpeak"]').length > 0) return 'Listen Speak';
                            else if (document.querySelectorAll('[data-test="challenge-choice"]').length > 0) {
                                if (document.querySelectorAll('[data-test="challenge-text-input"]').length > 0) return 'Challenge Choice with Text Input';
                                else return 'Challenge Choice';
                            } else if (document.querySelectorAll('[data-test$="challenge-tap-token"]').length > 0) {
                                if (window.sol.pairs !== undefined || window.sol.type === 'characterMatch' || window.sol.type === 'match') return 'Pairs';
                                else if (window.sol.correctTokens !== undefined) return 'Tokens Run';
                                else if (window.sol.correctIndices !== undefined) return 'Indices Run';
                            } else if (document.querySelectorAll('[data-test="challenge-tap-token-text"]').length > 0) return 'Fill in the Gap';
                            else if (document.querySelectorAll('[data-test="challenge-text-input"]').length > 0) return 'Challenge Text Input';
                            else if (document.querySelectorAll('[data-test*="challenge-partialReverseTranslate"]').length > 0) return 'Partial Reverse';
                            else if (document.querySelectorAll('textarea[data-test="challenge-translate-input"]').length > 0) return 'Challenge Translate Input';
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

                    async function typeHumanized(element, value, isContentEditable = false) {
                        const wantsSafe = localStorage.getItem("dx_safe_solver") === "true";
                        if (!value) return;

                        if (isContentEditable) {
                            const setter = Object.getOwnPropertyDescriptor(Node.prototype, "textContent").set;
                            if (!wantsSafe) {
                                setter.call(element, value);
                                element.dispatchEvent(new Event('input', { bubbles: true }));
                                return;
                            }
                            const words = String(value).split(' ');
                            let typed = '';
                            for (let i = 0; i < words.length; i++) {
                                typed += (i > 0 ? ' ' : '') + words[i];
                                setter.call(element, typed);
                                element.dispatchEvent(new Event('input', { bubbles: true }));
                                await sleep(110 + Math.random() * 180);
                            }
                        } else {
                            const isTextarea = element.tagName === 'TEXTAREA';
                            const prototype = isTextarea ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
                            const setter = Object.getOwnPropertyDescriptor(prototype, "value").set;
                            if (!wantsSafe) {
                                setter.call(element, value);
                                element.dispatchEvent(new Event('input', { bubbles: true }));
                                element.dispatchEvent(new Event('change', { bubbles: true }));
                                return;
                            }
                            const words = String(value).split(' ');
                            let typed = '';
                            for (let i = 0; i < words.length; i++) {
                                typed += (i > 0 ? ' ' : '') + words[i];
                                setter.call(element, typed);
                                element.dispatchEvent(new Event('input', { bubbles: true }));
                                element.dispatchEvent(new Event('change', { bubbles: true }));
                                await sleep(110 + Math.random() * 180);
                            }
                        }
                    }

                    async function solverClickTokens(correct_tokens) {
                        if (!correct_tokens) return;
                        const all_tokens = document.querySelectorAll('[data-test$="challenge-tap-token"]');
                        const clicked_tokens = [];
                        for (const correct_token of correct_tokens) {
                            const matching_elements = Array.from(all_tokens).filter(element => {
                                const elementText = solverGetCleanButtonText(element).toLowerCase().trim();
                                return elementText === correct_token.toLowerCase().trim();
                            });
                            if (matching_elements.length > 0) {
                                const match_index = clicked_tokens.filter(token => {
                                    const tokenText = solverGetCleanButtonText(token).toLowerCase().trim();
                                    return tokenText === correct_token.toLowerCase().trim();
                                }).length;
                                if (match_index < matching_elements.length) {
                                    matching_elements[match_index].click();
                                    clicked_tokens.push(matching_elements[match_index]);
                                } else {
                                    clicked_tokens.push(matching_elements[0]);
                                }
                                await sleep(50);
                            }
                        }
                    }


                    if (challengeType === 'Challenge Speak' || challengeType === 'Listen Match' || challengeType === 'Listen Speak') {

                        const buttonSkip = document.querySelector('button[data-test="player-skip"]');
                        buttonSkip?.click();

                    } else if (challengeType === 'Challenge Choice' || challengeType === 'Challenge Choice with Text Input') {
                        if (challengeType === 'Challenge Choice with Text Input') {
                            let elm = document.querySelectorAll('[data-test="challenge-text-input"]')[0];
                            if (elm) {
                                const val = window.sol.correctSolutions ? window.sol.correctSolutions[0].split(/(?<=^\S+)\s/)[1] : (window.sol.displayTokens ? window.sol.displayTokens.find(t => t.isBlank).text : window.sol.prompt);
                                await typeHumanized(elm, val);
                            }
                        } else if (challengeType === 'Challenge Choice') {
                            document.querySelectorAll("[data-test='challenge-choice']")[window.sol.correctIndex].click();
                        }

                    } else if (challengeType === 'Pairs') {
                        const nl = document.querySelectorAll('[data-test*="challenge-tap-token"]:not(span)');
                        for (const pair of window.sol.pairs || []) {
                            for (let i = 0; i < nl.length; i++) {
                                const btn = nl[i];
                                if (btn.disabled) continue;
                                const buttonText = solverGetCleanButtonText(btn).toLowerCase().trim();
                                const matches =
                                    buttonText === pair.transliteration?.toLowerCase().trim() ||
                                    buttonText === pair.character?.toLowerCase().trim() ||
                                    buttonText === pair.learningToken?.toLowerCase().trim() ||
                                    buttonText === pair.fromToken?.toLowerCase().trim();
                                if (matches) {
                                    btn.click();
                                    await sleep(50);
                                }
                            }
                        }

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
                        await solverClickTokens(window.sol.correctTokens);

                    } else if (challengeType === 'Indices Run' || challengeType === 'Fill in the Gap') {
                        if (window.sol.correctIndices) {
                            const wordBank = document.querySelector('div[data-test="word-bank"]') || document.querySelector('.eSgkc');
                            if (wordBank) {
                                const bankButtons = Array.from(wordBank.querySelectorAll('button[data-test*="challenge-tap-token"]:not(span)'));
                                for (const index of window.sol.correctIndices) {
                                    if (index >= 0 && index < bankButtons.length) {
                                        const button = bankButtons[index];
                                        if (!button.disabled && button.getAttribute('aria-disabled') !== 'true') {
                                            button.click();
                                            await sleep(50);
                                        }
                                    }
                                }
                            }
                        }

                    } else if (challengeType === 'Challenge Text Input') {
                        let elm = document.querySelectorAll('[data-test="challenge-text-input"]')[0];
                        if (elm) {
                            const val = window.sol.correctSolutions ? window.sol.correctSolutions[0] : (window.sol.displayTokens ? window.sol.displayTokens.find(t => t.isBlank).text : window.sol.prompt);
                            await typeHumanized(elm, val);
                        }

                    } else if (challengeType === 'Partial Reverse') {
                        let elm = document.querySelector('[data-test*="challenge-partialReverseTranslate"]')?.querySelector("span[contenteditable]");
                        if (elm) {
                            const val = window.sol?.displayTokens?.filter(t => t.isBlank)?.map(t => t.text)?.join('')?.trim();
                            await typeHumanized(elm, val, true);
                        }

                    } else if (challengeType === 'Challenge Translate Input') {
                        const elm = document.querySelector('textarea[data-test="challenge-translate-input"]');
                        if (elm) {
                            const val = window.sol.correctSolutions ? window.sol.correctSolutions[0] : window.sol.prompt;
                            await typeHumanized(elm, val);
                        }

                    } else if (challengeType === 'Challenge Name') {
                        let articles = window.sol.articles;
                        let correctSolutions = window.sol.correctSolutions[0];
                        let matchingArticle = articles.find(article => correctSolutions.startsWith(article));
                        let matchingIndex = matchingArticle !== undefined ? articles.indexOf(matchingArticle) : null;
                        let remainingValue = correctSolutions.substring(matchingArticle.length);
                        let selectedElement = document.querySelector('[data-test="challenge-choice"]:nth-child(' + (matchingIndex + 1) + ')');
                        if (selectedElement) selectedElement.click();
                        let elm = document.querySelector('[data-test="challenge-text-input"]');
                        if (elm) {
                            await typeHumanized(elm, remainingValue);
                        }

                    } else if (challengeType === 'Type Cloze') {
                        const input = document.querySelector('input[type="text"]') || document.querySelector('[data-test="challenge-text-input"]');
                        if (!input) return;
                        let targetToken = window.sol.displayTokens.find(t => t.damageStart !== undefined);
                        let correctWord = targetToken?.text || "";
                        let correctEnding = "";
                        if (typeof targetToken?.damageStart === "number") {
                            correctEnding = correctWord.slice(targetToken.damageStart);
                        }
                        await typeHumanized(input, correctEnding);

                    } else if (challengeType === 'Type Cloze Table') {
                        const tableRows = document.querySelectorAll('tbody tr');
                        for (let i = 0; i < window.sol.displayTableTokens.slice(1).length; i++) {
                            const rowTokens = window.sol.displayTableTokens.slice(1)[i];
                            const answerCell = rowTokens[1]?.find(t => typeof t.damageStart === "number");
                            if (answerCell && tableRows[i]) {
                                const input = tableRows[i].querySelector('input[type="text"]') || tableRows[i].querySelector('input');
                                if (input) {
                                    const correctWord = answerCell.text;
                                    const correctEnding = correctWord.slice(answerCell.damageStart);
                                    await typeHumanized(input, correctEnding);
                                }
                            }
                        }

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
                        for (let i = 0; i < window.sol.displayTableTokens.slice(1).length; i++) {
                            const rowTokens = window.sol.displayTableTokens.slice(1)[i];
                            const answerCell = rowTokens[1]?.find(t => t.isBlank);
                            if (answerCell && tableRows[i]) {
                                const input = tableRows[i].querySelector('input[type="text"]') || tableRows[i].querySelector('input');
                                if (input) {
                                    await typeHumanized(input, answerCell.text);
                                }
                            }
                        }

                    } else if (challengeType === 'Pattern Tap Complete') {
                        const wordBank = document.querySelector('[data-test="word-bank"], .eSgkc');
                        if (!wordBank) return;
                        const choices = window.sol.choices;
                        const correctIndex = window.sol.correctIndex ?? 0;
                        const choice = choices[correctIndex];
                        const correctText = typeof choice === 'object' ? choice.text : choice;
                        const buttons = Array.from(wordBank.querySelectorAll('button[data-test*="challenge-tap-token"]:not([aria-disabled="true"])'));
                        const targetButton = buttons.find(btn => solverGetCleanButtonText(btn).toLowerCase().trim() === correctText?.toLowerCase().trim());
                        if (targetButton) targetButton.click();

                    } else if (challengeType === 'Complete Reverse Translation') {
                        const blankTokens = window.sol.displayTokens.filter(t => t.isBlank);
                        const inputFields = document.querySelectorAll('[data-test="challenge-text-input"]');
                        for (let index = 0; index < inputFields.length; index++) {
                            if (blankTokens[index]) {
                                const answer = blankTokens[index].text;
                                await typeHumanized(inputFields[index], answer);
                            }
                        }

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

                    } else if (challengeType === 'Story Pairs') {
                        const storyButtons = document.querySelectorAll('[data-test*="challenge-tap-token"]:not(span)');
                        const storyTexts = document.querySelectorAll('[data-test="challenge-tap-token-text"]');
                        const textToElementMap = new Map();
                        for (let i = 0; i < storyButtons.length; i++) {
                            const text = storyTexts[i].innerText.toLowerCase().trim();
                            textToElementMap.set(text, storyButtons[i]);
                        }
                        for (const key in window.sol.dictionary) {
                            if (window.sol.dictionary.hasOwnProperty(key)) {
                                const value = window.sol.dictionary[key];
                                const keyPart = key.split(":")[1].toLowerCase().trim();
                                const normalizedValue = value.toLowerCase().trim();
                                const element1 = textToElementMap.get(keyPart);
                                const element2 = textToElementMap.get(normalizedValue);
                                if (element1 && !element1.disabled) {
                                    element1.click();
                                    await sleep(50);
                                }
                                if (element2 && !element2.disabled) {
                                    element2.click();
                                    await sleep(50);
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
                            const choiceCards = document.querySelectorAll('[data-test="challenge-choice-card"]');
                            if (choiceCards.length > 0) {
                                choiceCards[idx]?.click();
                            } else {
                                document.querySelectorAll('[data-test="challenge-choice"]')[idx]?.click();
                            }
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

                    } else if (challengeType === 'Translate') {
                        const correctSolutions = window.sol.correctSolutions;
                        if (window.sol.correctTokens && window.sol.correctTokens.length > 0) {
                            await solverClickTokens(window.sol.correctTokens);
                        } else if (correctSolutions) {
                            const ta = document.querySelector('textarea[data-test="challenge-translate-input"]');
                            if (ta) await typeHumanized(ta, correctSolutions[0]);
                        }

                    } else if (challengeType === 'Listen Tap') {
                        await solverClickTokens(window.sol.correctTokens);

                    } else if (challengeType === 'Listen Type') {
                        const answer = window.sol.prompt || window.sol.correctSolutions?.[0] || '';
                        const ta = document.querySelector('textarea[data-test="challenge-translate-input"]') ||
                            document.querySelector('[data-test="challenge-text-input"]');
                        if (ta) await typeHumanized(ta, answer);

                    } else if (challengeType === 'Complete Reverse') {
                        const blankTokens = window.sol.displayTokens?.filter(t => t.isBlank);
                        const inputFields = document.querySelectorAll('[data-test="challenge-text-input"]');
                        if (blankTokens && blankTokens.length > 1 && inputFields.length > 1) {
                            for (let index = 0; index < inputFields.length; index++) {
                                if (blankTokens[index]) {
                                    await typeHumanized(inputFields[index], blankTokens[index].text);
                                }
                            }
                        } else {
                            const answer = blankTokens?.[0]?.text || window.sol.correctSolutions?.[0] || '';
                            const input = document.querySelector('[data-test="challenge-text-input"]');
                            if (input) await typeHumanized(input, answer);
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

                function solverFindChallenge() {
                    try {
                        const mainEl = document.getElementsByClassName(findReactMainElementClass)[0];
                        const reactObj = solverFindReact(mainEl);
                        if (reactObj?.props?.currentChallenge) {
                            return reactObj.props.currentChallenge;
                        }
                    } catch {}

                    try {
                        const selectors = [
                            '[data-test="player-next"]',
                            '[data-test="player-skip"]',
                            '[data-test="quit-button"]',
                            '#solveAllButton',
                            '.vpDIE',
                            '._3yE3H',
                            '._3TJzR'
                        ];
                        for (const sel of selectors) {
                            const el = document.querySelector(sel);
                            if (!el) continue;
                            const key = Object.keys(el).find(k => k.startsWith("__reactFiber$") || k.startsWith("__reactInternalInstance$"));
                            if (!key) continue;
                            let fiber = el[key];
                            while (fiber) {
                                if (fiber.memoizedProps?.currentChallenge) {
                                    return fiber.memoizedProps.currentChallenge;
                                }
                                if (fiber.stateNode?.props?.currentChallenge) {
                                    return fiber.stateNode.props.currentChallenge;
                                }
                                fiber = fiber.return;
                            }
                        }
                    } catch {}

                    try {
                        const subEl = document.querySelector('.vpDIE') || document.querySelector('._3yE3H');
                        if (subEl) {
                            const slide = solverFindSubReact(subEl);
                            if (slide?.currentChallenge) {
                                return slide.currentChallenge;
                            }
                        }
                    } catch {}

                    return null;
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
                                    new CustomEvent('DX_LessonCompleted')
                                );
                            }
                            if (practiceAgain) {
                                const autoPath =
                                    localStorage.getItem('dx_auto_path') ===
                                    'true';
                                const autoPractice =
                                    localStorage.getItem(
                                        'dx_auto_practice'
                                    ) === 'true';
                                const autoLegendary =
                                    localStorage.getItem(
                                        'dx_auto_legendary'
                                    ) === 'true';
                                const pathRem =
                                    parseInt(
                                        localStorage.getItem('dx_path_rem')
                                    ) || 0;
                                const practiceRem =
                                    parseInt(
                                        localStorage.getItem('dx_practice_rem')
                                    ) || 0;
                                const legendaryRem =
                                    parseInt(
                                        localStorage.getItem('dx_legendary_rem')
                                    ) || 0;
                                const pathInf =
                                    localStorage.getItem('dx_path_inf') ===
                                    'true';
                                const practiceInf =
                                    localStorage.getItem('dx_practice_inf') ===
                                    'true';
                                const legendaryInf =
                                    localStorage.getItem('dx_legendary_inf') ===
                                    'true';
                                const pathActive =
                                    autoPath && (pathInf || pathRem > 0);
                                const practiceActive =
                                    autoPractice &&
                                    (practiceInf || practiceRem > 0);
                                const legendaryActive =
                                    autoLegendary &&
                                    (legendaryInf || legendaryRem > 0);
                                if (pathActive || practiceActive || legendaryActive) {
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
                            '._2V6ug._1ursp._7jW2t._3zgLG',
                            '[data-test="hearts-intro-continue-button"]',
                            '[data-test="legendary-session-end-continue"]',
                            '[data-test="legendary-start-button"]',
                            '[data-test="create-profile-later"]',
                            '[data-test="close-button"]',
                            '[data-test="streak-goal-option"]',
                            '[data-test="plus-continue"] + div + button'
                        ];
                        selectorsForSkip.forEach(selector => {
                            const element = document.querySelector(selector);
                            if (element) element.click();
                        });

                        window.sol = null;
                        try {
                            window.sol = solverFindChallenge();
                        } catch (error) {
                            window.sol = null;
                            console.log(error);
                        }

                        let challengeType;
                        if (window.sol) {
                            challengeType = solverDetermineChallengeType();
                        } else {
                            challengeType = solverDetermineChallengeType();
                            if (challengeType === false) challengeType = 'error';
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
                    if (value === "start") {
                        isAutoMode = true;
                        solverPausedByUser = false;
                    } else if (value === "stop") {
                        isAutoMode = false;
                        solverPausedByUser = true;
                    } else {
                        isAutoMode = !isAutoMode;
                        solverPausedByUser = !isAutoMode;
                    }

                    const activeSolveAllRunToken = bumpSolveAllRunToken();

                    try {
                        const btn = document.getElementById("solveAllButton");
                        if (btn) btn.innerText = isAutoMode ? "PAUSE SOLVE" : "SOLVE ALL";
                    } catch {}

                    window.dispatchEvent(new CustomEvent('DX_StateSync', { detail: { isAutoMode: isAutoMode } }));

                    function startSolvingLoop(runToken) {
                        if (solvingLoopRunning || !isAutoMode || runToken !== solveAllRunToken) return;

                        solvingLoopRunning = true;

                        (async function runLoop() {
                            while (isAutoMode && runToken === solveAllRunToken) {
                                const _p = window.location.pathname;
                                const stillInLesson =
                                    _p.includes('/lesson') ||
                                    _p.includes('/practice') ||
                                    _p.includes('/practice-hub') ||
                                    _p.includes('/alphabets') ||
                                    _p.includes('/characters') ||
                                    _p.includes('/character-practice') ||
                                    _p.includes('/unit-rewind') ||
                                    _p.includes('/mistakes-review') ||
                                    _p.includes('/listen-practice') ||
                                    _p.includes('/speak-practice') ||
                                    _p.includes('/stories') ||
                                    _p.includes('/chess-match') ||
                                    !!document.querySelector('[data-test="player-next"]') ||
                                    !!document.querySelector('[data-test="player-skip"]') ||
                                    !!document.querySelector('[data-test="player-footer"]');
                                if (!stillInLesson) {
                                    isAutoMode = false;
                                    try {
                                        const btn = document.getElementById("solveAllButton");
                                        if (btn) btn.innerText = "SOLVE ALL";
                                    } catch {}
                                    window.dispatchEvent(new CustomEvent('DX_StateSync', { detail: { isAutoMode: false } }));
                                    break;
                                }

                                const startTime = Date.now();
                                const randomSpeedEnabled = localStorage.getItem('dx_random_speed') !== null
                                    ? localStorage.getItem('dx_random_speed') === 'true'
                                    : initRandomSpeed;
                                const solveSpeedMin = parseFloat(localStorage.getItem('dx_solve_speed_min')) || initSolveSpeedMin;
                                const solveSpeedMax = parseFloat(localStorage.getItem('dx_solve_speed_max')) || initSolveSpeedMax;
                                const solveSpeedFixed = parseInt(localStorage.getItem('dx_solve_speed_fixed')) || initSolveSpeedFixed;

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

                window.addEventListener('DX_TriggerSolveAll', (e) => {
                    let action = e && e.detail && e.detail.action;
                    toggleAutoSolve(action);
                });

                window.addEventListener('DX_TriggerSolveOnce', () => {
                    runAutoSolve();
                });


                window.addEventListener('DX_StopSolver', () => {

                    toggleAutoSolve("stop");
                });

                setInterval(() => {
                    const _p = window.location.pathname;
                    const isLesson =
                        _p.includes('/lesson') ||
                        _p.includes('/practice') ||
                        _p.includes('/practice-hub') ||
                        _p.includes('/alphabets') ||
                        _p.includes('/characters') ||
                        _p.includes('/character-practice') ||
                        _p.includes('/unit-rewind') ||
                        _p.includes('/mistakes-review') ||
                        _p.includes('/listen-practice') ||
                        _p.includes('/speak-practice') ||
                        _p.includes('/stories') ||
                        _p.includes('/chess-match') ||
                        !!document.querySelector('[data-test="player-next"]') ||
                        !!document.querySelector('[data-test="player-skip"]') ||
                        !!document.querySelector('[data-test="player-footer"]');
                    if (isLesson) {
                        const autoSolverVal = localStorage.getItem('dx_auto_solver') !== null
                            ? localStorage.getItem('dx_auto_solver') === 'true'
                            : initAutoSolver;
                        if (autoSolverVal && !isAutoMode && !solverPausedByUser) {
                            toggleAutoSolve('start');
                        }
                    } else {
                        solverPausedByUser = false;
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
    const pathInput = document.getElementById("DX_Path_Input");
    if (pathInput) {
      if (pathLessonsRemaining === Infinity) {
        pathInput.value = "Infinity";
      } else {
        pathInput.value = pathLessonsRemaining;
        localStorage.setItem("dx_path_rem", String(pathLessonsRemaining));
      }
    }
  }

  function updatePracticeRemainingUI() {
    const pracInput = document.getElementById("DX_Practice_Input");
    if (pracInput) {
      if (practiceLessonsRemaining === Infinity) {
        pracInput.value = "Infinity";
      } else {
        pracInput.value = practiceLessonsRemaining;
        localStorage.setItem(
          "dx_practice_rem",
          String(practiceLessonsRemaining),
        );
      }
    }
  }

  function updateLegendaryRemainingUI() {
    const legendaryInput = document.getElementById("DX_Legendary_Input");
    if (legendaryInput) {
      if (legendaryLessonsRemaining === Infinity) {
        legendaryInput.value = "Infinity";
      } else {
        legendaryInput.value = legendaryLessonsRemaining;
        localStorage.setItem(
          "dx_legendary_rem",
          String(legendaryLessonsRemaining),
        );
      }
    }
  }

  function initApp() {
    checkTheme();

    window.addEventListener("DX_UserSync", () => {
      connect(true);
    });

    if (!document.getElementById("DX_UserSync_Script")) {
      const script = document.createElement("script");
      script.id = "DX_UserSync_Script";
      script.textContent = `
        (function() {
          const TARGET_URL_REGEX = /\\/users\\/\\d+/;
          const origFetch = window.fetch;
          window.fetch = function(resource, options) {
            const url = String(resource instanceof Request ? resource.url : resource);
            const method = resource instanceof Request ? resource.method : ((options && options.method) || 'GET');
            const m = method.toUpperCase();
            if ((m === 'PATCH' || m === 'POST') && TARGET_URL_REGEX.test(url)) {
              return origFetch.apply(this, arguments).then(function(r) {
                if (r.status >= 200 && r.status < 300) {
                  window.dispatchEvent(new CustomEvent("DX_UserSync"));
                }
                return r;
              });
            }
            return origFetch.apply(this, arguments);
          };

          const origOpen = XMLHttpRequest.prototype.open;
          const origSend = XMLHttpRequest.prototype.send;
          XMLHttpRequest.prototype.open = function(method, url, ...args) {
            const m = (method || '').toUpperCase();
            this._isUserMutation = (m === 'PATCH' || m === 'POST') && TARGET_URL_REGEX.test(url);
            origOpen.call(this, method, url, ...args);
          };
          XMLHttpRequest.prototype.send = function() {
            if (this._isUserMutation) {
              const origChange = this.onreadystatechange;
              const xhr = this;
              this.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
                  window.dispatchEvent(new CustomEvent("DX_UserSync"));
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

    window.addEventListener("DX_Notify", (e) => {
      if (e.detail) notify(e.detail.type, e.detail.title, e.detail.body);
    });

    window.addEventListener("DX_ResetBtn", (e) => {
      if (e.detail) resetBtn(e.detail.id, e.detail.text);
    });

    window.addEventListener("DX_StateSync", (e) => {
      if (e.detail && typeof e.detail.isAutoMode !== "undefined") {
        const wasAuto = isAutoMode;
        isAutoMode = e.detail.isAutoMode;
        updateSolveButtonText(isAutoMode ? "PAUSE SOLVE" : "SOLVE ALL");
        if (wasAuto && !isAutoMode) {
          solverPausedByUser = true;
        }
        if (isAutoMode) {
          solverPausedByUser = false;
        }
        if (
          isAutoMode &&
          (autoPathEnabled || autoPracticeEnabled || autoLegendaryEnabled)
        ) {
          setUiHiddenState(true);
        }
      }
    });

    window.addEventListener("DX_LessonCompleted", () => {
      cachedCurrentCourseData = null;
      if (!hasDecrementedForCurrentLesson) {
        hasDecrementedForCurrentLesson = true;

        if (autoPathEnabled) {
          if (pathLessonsRemaining !== Infinity) {
            pathLessonsRemaining = Math.max(0, pathLessonsRemaining - 1);
            updatePathRemainingUI();
            if (pathLessonsRemaining === 0) {
              autoPathEnabled = false;
              localStorage.setItem("dx_auto_path", "false");
              const pathBtn = document.getElementById("DX_AutoPath_Btn");
              if (pathBtn) resetBtn("DX_AutoPath_Btn", "RUN");
              notify(
                "success",
                "Lesson Solver Target Reached",
                "Specified number of lessons solved. Stopping...",
              );
              window.dispatchEvent(new CustomEvent("DX_StopSolver"));
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
              localStorage.setItem("dx_auto_practice", "false");
              const pracBtn = document.getElementById("DX_AutoPractice_Btn");
              if (pracBtn) resetBtn("DX_AutoPractice_Btn", "RUN");
              notify(
                "success",
                "Practice Solver Target Reached",
                "Specified number of lessons solved. Stopping...",
              );
              window.dispatchEvent(new CustomEvent("DX_StopSolver"));
            }
          }
        }

        if (autoLegendaryEnabled) {
          if (legendaryLessonsRemaining !== Infinity) {
            legendaryLessonsRemaining = Math.max(
              0,
              legendaryLessonsRemaining - 1,
            );
            updateLegendaryRemainingUI();
            if (legendaryLessonsRemaining === 0) {
              autoLegendaryEnabled = false;
              localStorage.setItem("dx_auto_legendary", "false");
              const legendaryBtn = document.getElementById(
                "DX_AutoLegendary_Btn",
              );
              if (legendaryBtn) resetBtn("DX_AutoLegendary_Btn", "RUN");
              notify(
                "success",
                "Legendary Solver Target Reached",
                "Specified number of legendary lessons solved. Stopping...",
              );
              window.dispatchEvent(new CustomEvent("DX_StopSolver"));
            }
          }
        }
      }
    });

    if (uiHidden) {
      const togHide = document.getElementById("duoxjs-hide-button");
      const wrap = document.getElementById("DX_Main");
      const mBox = document.getElementById("DX_Main_Box");
      const lblTxt = document.getElementById("hide-show-text");

      if (togHide) togHide.classList.add("duoxjs-show-mode");
      if (lblTxt) lblTxt.innerText = "Show";
      if (mBox) {
        mBox.classList.add("dx-hidden");
        mBox.classList.add("dx-collapsed");
      }
      if (wrap) wrap.classList.add("dx-panel-hidden");
    }

    applyLocalMax();
    applyEZQuiz();
    applyPageSolver();
    startLeaguePolling();
    checkUpdateBannerFromCache();
    checkForUpdates();
    setInterval(checkForUpdates, 6 * 60 * 60 * 1000);
    setInterval(async () => {
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
    }, 10000);
    setInterval(async () => {
      if (!user) return;
      try {
        await refreshStats();
        await Promise.allSettled([
          autoKeepStreak(),
          autoReachRank(),
          autoBlockLeague(),
          refreshQuestCenter(),
          refreshPageData(pageId),
        ]);
      } catch (err) {
        console.error("[DuoXJS] Background loop error:", err);
      }
    }, 30000);

    ["XP", "Gem", "Streak", "Path", "Practice", "Legendary"].forEach(toggleInf);

    document
      .getElementById("DX_TopSettings_Btn")
      .addEventListener("click", () => changePage("Settings"));
    document.getElementById("DX_Update_Btn").addEventListener("click", () => {
      window.open(dxUpdatePageUrl, "_blank");
    });
    document
      .getElementById("DX_Settings_Back_Btn")
      .addEventListener("click", () => changePage(1));
    document
      .getElementById("DX_Version_Btn")
      .addEventListener("click", () => changePage("Stats"));
    document
      .getElementById("DX_Stats_Back_Btn")
      .addEventListener("click", () => changePage(1));
    document
      .getElementById("DX_AutoSolver_Btn")
      .addEventListener("click", () => changePage("AutoSolver"));
    document
      .getElementById("DX_Automations_Btn")
      .addEventListener("click", () => changePage("Automations"));
    document
      .getElementById("DX_AutoSolver_Back_Btn")
      .addEventListener("click", () => changePage("Settings"));
    document
      .getElementById("DX_Automations_Back_Btn")
      .addEventListener("click", () => changePage("Settings"));
    document
      .getElementById("DX_Extra_Btn")
      .addEventListener("click", () => changePage("Extra"));
    document
      .getElementById("DX_Extra_Back_Btn")
      .addEventListener("click", () => changePage(1));
    document
      .getElementById("DX_Shop_Btn")
      .addEventListener("click", () => changePage("Shop"));
    document
      .getElementById("DX_Shop_Back_Btn")
      .addEventListener("click", () => changePage("Extra"));
    document
      .getElementById("DX_Quest_Nav_Btn")
      .addEventListener("click", () => changePage("Quests"));
    document
      .getElementById("DX_Quests_Back_Btn")
      .addEventListener("click", () => changePage("Extra"));
    document
      .getElementById("DX_Tools_Nav_Btn")
      .addEventListener("click", () => changePage("Tools"));
    document
      .getElementById("DX_Tools_Back_Btn")
      .addEventListener("click", () => changePage("Extra"));
    document
      .getElementById("DX_Board_Nav_Btn")
      .addEventListener("click", () => {
        const cont = document.getElementById("DX_Board_Container");
        if (cont && cont.dataset.loaded !== "1") {
          cont.innerHTML = `<p class="DX_T2 DX_NoSel" style="text-align: center; padding: 8px 0;">Loading...</p>`;
        }
        changePage("Board");
      });
    document
      .getElementById("DX_Board_Back_Btn")
      .addEventListener("click", () => changePage("Extra"));

    document
      .getElementById("DX_Feed_Nav_Btn")
      .addEventListener("click", () => changePage("Feed"));
    document
      .getElementById("DX_Feed_Back_Btn")
      .addEventListener("click", () => changePage("Extra"));

    document
      .getElementById("DX_XPSummaries_Btn")
      .addEventListener("click", () => changePage("XPSummaries"));
    document
      .getElementById("DX_XPSummaries_Back_Btn")
      .addEventListener("click", () => changePage("Extra"));

    document
      .getElementById("DX_AccMgr_Back_Btn")
      .addEventListener("click", () => changePage(1));
    document
      .getElementById("DX_AccSave_Btn")
      .addEventListener("click", () => accSaveCurrent());

    document.getElementById("DX_Gift_Btn").addEventListener("click", () => {
      const uname = document.getElementById("DX_Tools_User").value;
      const gtype = document
        .getElementById("DX_Gift_Select")
        .getAttribute("data-value");
      sendGift(uname, gtype);
    });

    document.getElementById("DX_Friend_Btn").addEventListener("click", () => {
      const uname = document.getElementById("DX_Tools_User").value;
      const mode = document
        .getElementById("DX_Friend_Select")
        .getAttribute("data-value");
      forceFriend(uname, mode);
    });

    document
      .getElementById("duoxjs-hide-button")
      .addEventListener("click", () => {
        const togHide = document.getElementById("duoxjs-hide-button");
        if (togHide.dataset.dragged === "1") {
          togHide.dataset.dragged = "";
          return;
        }
        setUiHiddenState(!uiHidden);
      });

    document.getElementById("DX_XP_Btn").addEventListener("click", () => {
      runTask("xp", "DX_XP");
    });

    document.getElementById("DX_Gem_Btn").addEventListener("click", () => {
      runTask("gem", "DX_Gem");
    });

    document.getElementById("DX_Streak_Btn").addEventListener("click", () => {
      runTask("streak", "DX_Streak");
    });

    document.getElementById("DX_League_Btn").addEventListener("click", () => {
      runTask("league", "DX_League");
    });

    document
      .getElementById("DX_Quest_Force_Btn")
      .addEventListener("click", () => {
        forceQuests();
      });

    const questCont = document.getElementById("DX_Quest_Container");
    if (questCont) {
      questCont.addEventListener("click", async (event) => {
        const actBtn = event.target.closest(".DX_Quest_Get_Btn");
        if (!actBtn || actBtn.disabled) return;

        actBtn.disabled = true;
        actBtn.innerText = "...";

        try {
          const tMetric = actBtn.dataset.m;
          const tQId = actBtn.dataset.id;
          let tAmt = parseInt(actBtn.dataset.amt);
          tAmt = Math.max(tAmt, 2000);

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
            notify(
              "success",
              "Quest Center",
              "Daily quest progress successfully injected.",
            );
            getQuests(true);
          } else {
            actBtn.disabled = false;
            actBtn.innerText = "ERR";
            actBtn.classList.add("fail");
            setTimeout(() => {
              actBtn.innerText = "BRUTE";
              actBtn.classList.remove("fail");
            }, 2000);
            notify(
              "error",
              "Quest Center",
              "Failed to brute-force quest progress.",
            );
          }
        } catch {
          actBtn.disabled = false;
          actBtn.innerText = "ERR";
          actBtn.classList.add("fail");
          setTimeout(() => {
            actBtn.innerText = "BRUTE";
            actBtn.classList.remove("fail");
          }, 2000);
          notify(
            "error",
            "Quest Center",
            "Failed to brute-force quest progress.",
          );
        }
      });
    }

    document.getElementById("DX_Block_Btn").addEventListener("click", () => {
      const name = document.getElementById("DX_Tools_User").value.trim();
      if (!name) {
        notify("warning", "Block / Unblock", "Please enter a username.");
        return;
      }
      const mode = document
        .getElementById("DX_Block_Select")
        .getAttribute("data-value");
      blockTarget(name, mode === "unblock");
    });

    document
      .getElementById("DX_FollowSingle_Btn")
      .addEventListener("click", () => {
        const name = document.getElementById("DX_Tools_User").value.trim();
        if (!name) {
          notify("warning", "Follow / Unfollow", "Please enter a username.");
          return;
        }
        const mode = document
          .getElementById("DX_FollowSingle_Select")
          .getAttribute("data-value");
        followTarget(name, mode === "unfollow");
      });

    document.getElementById("DX_Follow_Btn").addEventListener("click", () => {
      if (farmStates.follow) {
        massFollow();
        return;
      }
      if (farmStates.unfollow) {
        massUnfollow();
        return;
      }
      const mode = document
        .getElementById("DX_Follow_Select")
        .getAttribute("data-value");
      if (mode === "unfollow") massUnfollow();
      else massFollow();
    });

    document
      .getElementById("DX_Block_Mass_Btn")
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
          .getElementById("DX_BlockMass_Select")
          .getAttribute("data-value");
        if (mode === "unblock") massUnblock();
        else massBlock();
      });

    document.getElementById("DX_Hearts_Btn").addEventListener("click", () => {
      const count = parseInt(document.getElementById("DX_Hearts_Input").value);
      if (isNaN(count) || count < 1 || count > 5) {
        notify("warning", "Remove Hearts", "Enter a number between 1 and 5.");
        return;
      }
      removeHearts(count);
    });

    document
      .getElementById("DX_Board_Status_Btn")
      .addEventListener("click", openStatusPicker);
    document
      .getElementById("DX_Status_Back_Btn")
      .addEventListener("click", () => {
        changePage("Board");
      });
    document
      .getElementById("DX_Status_Search")
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

    wireToggle("DX_LocalMax_Toggle", "dx_local_max", () => {
      notify("info", "On-Client Max", "Reloading page to apply the change...");
      setTimeout(() => window.location.reload(), 1200);
    });
    wireToggle("DX_SafeStreak_Toggle", "dx_safe_streak", () => {});
    wireToggle("DX_SafeSolver_Toggle", "dx_safe_solver", () => {});
    wireToggle("DX_AutoJoin_Toggle", "dx_auto_join_league", () => {
      leagueJoinAttempted = false;
    });
    wireToggle("DX_AutoReach_Toggle", "dx_auto_reach_rank", (on) => {
      if (on) {
        const isSolverRunning =
          autoPathEnabled || autoPracticeEnabled || autoLegendaryEnabled;
        if (isSolverRunning) {
          notify(
            "warning",
            "Conflict",
            "Auto Reach Rank cannot be enabled while Auto Solver is active.",
          );
          const el = document.getElementById("DX_AutoReach_Toggle");
          if (el) el.classList.remove("on");
          localStorage.setItem("dx_auto_reach_rank", "false");
        } else {
          autoReachRank();
        }
      }
    });
    wireToggle("DX_AutoStreak_Toggle", "dx_auto_keep_streak", (on) => {
      if (on) {
        const isSolverRunning =
          autoPathEnabled || autoPracticeEnabled || autoLegendaryEnabled;
        if (isSolverRunning) {
          notify(
            "warning",
            "Conflict",
            "Auto Keep Streak cannot be enabled while Auto Solver is active.",
          );
          const el = document.getElementById("DX_AutoStreak_Toggle");
          if (el) el.classList.remove("on");
          localStorage.setItem("dx_auto_keep_streak", "false");
        } else {
          autoKeepStreak();
        }
      }
    });
    wireToggle("DX_AutoBlock_Toggle", "dx_auto_block_league", (on) => {
      if (on) autoBlockLeague();
    });
    wireToggle("DX_AutoQuest_Toggle", "dx_auto_quest_saver", (on) => {
      if (on) refreshQuestCenter();
    });

    wireToggle("DX_SolverButtons_Toggle", "dx_solver_buttons", (on) => {
      solverButtonsEnabled = on;
    });
    if (localStorage.getItem("dx_solver_buttons") === null) {
      const el = document.getElementById("DX_SolverButtons_Toggle");
      if (el) el.classList.add("on");
    }
    wireToggle("DX_AutoSolver_Toggle", "dx_auto_solver", (on) => {
      autoSolverEnabled = on;
      toggleAutoSolve(on ? "start" : "stop");
    });
    wireToggle("DX_RandomSpeed_Toggle", "dx_random_speed", (on) => {
      randomSpeedEnabled = on;
    });
    wireToggle("DX_EZQuiz_Toggle", "dx_ez_quiz", () => {
      clearPrefetchedSessionsCache();
      notify(
        "info",
        "Lesson Shortener",
        "Reloading page to apply the change...",
      );
      setTimeout(() => window.location.reload(), 1200);
    });

    const sSpdInp = document.getElementById("DX_SolveSpeed_Input");
    if (sSpdInp) {
      sSpdInp.value = solveSpeedFixed;
      sSpdInp.addEventListener("change", () => {
        const nVal = parseInt(sSpdInp.value);
        solveSpeedFixed = isNaN(nVal) ? 400 : Math.max(50, nVal);
        sSpdInp.value = solveSpeedFixed;
        localStorage.setItem("dx_solve_speed_fixed", solveSpeedFixed);
      });
    }

    const sSpdMinInp = document.getElementById("DX_SolveSpeedMin_Input");
    if (sSpdMinInp) {
      sSpdMinInp.value = solveSpeedMin;
      sSpdMinInp.addEventListener("change", () => {
        const nVal = parseFloat(sSpdMinInp.value);
        solveSpeedMin = isNaN(nVal) ? 2.8 : Math.max(0.1, nVal);
        sSpdMinInp.value = solveSpeedMin;
        localStorage.setItem("dx_solve_speed_min", solveSpeedMin);
      });
    }

    const sSpdMaxInp = document.getElementById("DX_SolveSpeedMax_Input");
    if (sSpdMaxInp) {
      sSpdMaxInp.value = solveSpeedMax;
      sSpdMaxInp.addEventListener("change", () => {
        const nVal = parseFloat(sSpdMaxInp.value);
        solveSpeedMax = isNaN(nVal) ? 12.4 : Math.max(solveSpeedMin, nVal);
        sSpdMaxInp.value = solveSpeedMax;
        localStorage.setItem("dx_solve_speed_max", solveSpeedMax);
      });
    }

    const autoPathBtn = document.getElementById("DX_AutoPath_Btn");
    if (autoPathBtn) {
      if (autoPathEnabled) {
        stopBtn("DX_AutoPath_Btn");
        const pathInf = localStorage.getItem("dx_path_inf") === "true";
        const pathRem = parseInt(localStorage.getItem("dx_path_rem")) || 1;
        pathLessonsRemaining = pathInf ? Infinity : pathRem;
        const pathHash = document.getElementById("DX_Path_Hash");
        const pathInput = document.getElementById("DX_Path_Input");
        if (pathHash && pathInput) {
          if (pathInf) {
            pathHash.innerHTML =
              icons.inf + '<span class="DX_Hash_Lbl">Infinite</span>';
            pathHash.setAttribute("data-inf", "true");
            pathHash.classList.add("dx-inf-active");
            pathInput.parentElement.classList.add("dx-inf-hidden");
            pathInput.disabled = true;
            pathInput.value = "Infinity";
          } else {
            pathHash.innerHTML = icons.hash;
            pathHash.setAttribute("data-inf", "false");
            pathHash.classList.remove("dx-inf-active");
            pathInput.parentElement.classList.remove("dx-inf-hidden");
            pathInput.disabled = false;
            pathInput.value = pathRem;
          }
        }
      } else {
        resetBtn("DX_AutoPath_Btn", "RUN");
      }

      autoPathBtn.addEventListener("click", () => {
        if (autoPathEnabled) {
          autoPathEnabled = false;
          localStorage.setItem("dx_auto_path", "false");
          resetBtn("DX_AutoPath_Btn", "RUN");
          notify("info", "Auto Lesson", "Auto Lesson Solver stopped.");
        } else {
          const startPathExecution = () => {
            if (autoPracticeEnabled) {
              autoPracticeEnabled = false;
              localStorage.setItem("dx_auto_practice", "false");
              resetBtn("DX_AutoPractice_Btn", "RUN");
            }

            const pathHash = document.getElementById("DX_Path_Hash");
            const pathInput = document.getElementById("DX_Path_Input");
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
            localStorage.setItem("dx_auto_path", "true");
            localStorage.setItem("dx_path_inf", isInf ? "true" : "false");
            localStorage.setItem(
              "dx_path_rem",
              isInf ? "0" : String(lessonsCount),
            );
            stopBtn("DX_AutoPath_Btn");
            autoSolverEnabled = true;
            localStorage.setItem("dx_auto_solver", "true");
            const solverTog = document.getElementById("DX_AutoSolver_Toggle");
            if (solverTog) solverTog.classList.add("on");
            notify(
              "success",
              "Auto Lesson",
              `Auto Lesson Solver started (${isInf ? "Infinite" : lessonsCount + " lessons"}).`,
            );
            cachedCurrentCourseData = null;
            onNavChange();
          };

          const isFarmRunning =
            farmStates.xp ||
            farmStates.gem ||
            farmStates.streak ||
            farmStates.league;
          if (isFarmRunning) {
            const farmName = farmStates.xp
              ? "XP Farm"
              : farmStates.gem
                ? "Gem Farm"
                : farmStates.streak
                  ? "Streak Farm"
                  : "Auto League";
            showConfirmModal(
              `${farmName} is currently running. Do you want to stop it to run Auto Lesson?`,
              () => {
                stopAllFarmingTasks();
                startPathExecution();
              },
            );
          } else {
            startPathExecution();
          }
        }
      });
    }

    const autoPracticeBtn = document.getElementById("DX_AutoPractice_Btn");
    if (autoPracticeBtn) {
      if (autoPracticeEnabled) {
        stopBtn("DX_AutoPractice_Btn");
        const pracInf = localStorage.getItem("dx_practice_inf") === "true";
        const pracRem = parseInt(localStorage.getItem("dx_practice_rem")) || 1;
        practiceLessonsRemaining = pracInf ? Infinity : pracRem;
        const pracHash = document.getElementById("DX_Practice_Hash");
        const pracInput = document.getElementById("DX_Practice_Input");
        if (pracHash && pracInput) {
          if (pracInf) {
            pracHash.innerHTML =
              icons.inf + '<span class="DX_Hash_Lbl">Infinite</span>';
            pracHash.setAttribute("data-inf", "true");
            pracHash.classList.add("dx-inf-active");
            pracInput.parentElement.classList.add("dx-inf-hidden");
            pracInput.disabled = true;
            pracInput.value = "Infinity";
          } else {
            pracHash.innerHTML = icons.hash;
            pracHash.setAttribute("data-inf", "false");
            pracHash.classList.remove("dx-inf-active");
            pracInput.parentElement.classList.remove("dx-inf-hidden");
            pracInput.disabled = false;
            pracInput.value = pracRem;
          }
        }
      } else {
        resetBtn("DX_AutoPractice_Btn", "RUN");
      }

      autoPracticeBtn.addEventListener("click", () => {
        if (autoPracticeEnabled) {
          autoPracticeEnabled = false;
          localStorage.setItem("dx_auto_practice", "false");
          resetBtn("DX_AutoPractice_Btn", "RUN");
          notify("info", "Auto Practice", "Auto Practice Mode stopped.");
        } else {
          const startPracticeExecution = () => {
            if (autoPathEnabled) {
              autoPathEnabled = false;
              localStorage.setItem("dx_auto_path", "false");
              resetBtn("DX_AutoPath_Btn", "RUN");
            }

            const pracHash = document.getElementById("DX_Practice_Hash");
            const pracInput = document.getElementById("DX_Practice_Input");
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
            localStorage.setItem("dx_auto_practice", "true");
            localStorage.setItem("dx_practice_inf", isInf ? "true" : "false");
            localStorage.setItem(
              "dx_practice_rem",
              isInf ? "0" : String(lessonsCount),
            );
            stopBtn("DX_AutoPractice_Btn");
            autoSolverEnabled = true;
            localStorage.setItem("dx_auto_solver", "true");
            const solverTog = document.getElementById("DX_AutoSolver_Toggle");
            if (solverTog) solverTog.classList.add("on");
            notify(
              "success",
              "Auto Practice",
              `Auto Practice Mode started (${isInf ? "Infinite" : lessonsCount + " lessons"}).`,
            );
            cachedCurrentCourseData = null;
            onNavChange();
          };

          const isFarmRunning =
            farmStates.xp ||
            farmStates.gem ||
            farmStates.streak ||
            farmStates.league;
          if (isFarmRunning) {
            const farmName = farmStates.xp
              ? "XP Farm"
              : farmStates.gem
                ? "Gem Farm"
                : farmStates.streak
                  ? "Streak Farm"
                  : "Auto League";
            showConfirmModal(
              `${farmName} is currently running. Do you want to stop it to run Auto Practice?`,
              () => {
                stopAllFarmingTasks();
                startPracticeExecution();
              },
            );
          } else {
            startPracticeExecution();
          }
        }
      });
    }

    const autoLegendaryBtn = document.getElementById("DX_AutoLegendary_Btn");
    if (autoLegendaryBtn) {
      if (autoLegendaryEnabled) {
        stopBtn("DX_AutoLegendary_Btn");
        const legendaryInf =
          localStorage.getItem("dx_legendary_inf") === "true";
        const legendaryRem =
          parseInt(localStorage.getItem("dx_legendary_rem")) || 1;
        legendaryLessonsRemaining = legendaryInf ? Infinity : legendaryRem;
        const legendaryHash = document.getElementById("DX_Legendary_Hash");
        const legendaryInput = document.getElementById("DX_Legendary_Input");
        if (legendaryHash && legendaryInput) {
          if (legendaryInf) {
            legendaryHash.innerHTML =
              icons.inf + '<span class="DX_Hash_Lbl">Infinite</span>';
            legendaryHash.setAttribute("data-inf", "true");
            legendaryHash.classList.add("dx-inf-active");
            legendaryInput.parentElement.classList.add("dx-inf-hidden");
            legendaryInput.disabled = true;
            legendaryInput.value = "Infinity";
          } else {
            legendaryHash.innerHTML = icons.hash;
            legendaryHash.setAttribute("data-inf", "false");
            legendaryHash.classList.remove("dx-inf-active");
            legendaryInput.parentElement.classList.remove("dx-inf-hidden");
            legendaryInput.disabled = false;
            legendaryInput.value = legendaryRem;
          }
        }
      } else {
        resetBtn("DX_AutoLegendary_Btn", "RUN");
      }

      autoLegendaryBtn.addEventListener("click", () => {
        if (autoLegendaryEnabled) {
          autoLegendaryEnabled = false;
          localStorage.setItem("dx_auto_legendary", "false");
          resetBtn("DX_AutoLegendary_Btn", "RUN");
          notify("info", "Auto Legendary", "Auto Legendary Solver stopped.");
        } else {
          const startLegendaryExecution = () => {
            const legendaryHash = document.getElementById("DX_Legendary_Hash");
            const legendaryInput =
              document.getElementById("DX_Legendary_Input");
            const isInf =
              legendaryHash &&
              legendaryHash.getAttribute("data-inf") === "true";
            let lessonsCount = Infinity;
            if (!isInf && legendaryInput) {
              const val = parseInt(legendaryInput.value);
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
            autoLegendaryEnabled = true;
            legendaryLessonsRemaining = lessonsCount;
            localStorage.setItem("dx_auto_legendary", "true");
            localStorage.setItem("dx_legendary_inf", isInf ? "true" : "false");
            localStorage.setItem(
              "dx_legendary_rem",
              isInf ? "0" : String(lessonsCount),
            );
            stopBtn("DX_AutoLegendary_Btn");
            autoSolverEnabled = true;
            localStorage.setItem("dx_auto_solver", "true");
            const solverTog = document.getElementById("DX_AutoSolver_Toggle");
            if (solverTog) solverTog.classList.add("on");
            notify(
              "success",
              "Auto Legendary",
              `Auto Legendary Solver started (${isInf ? "Infinite" : lessonsCount + " lessons"}).`,
            );
            cachedCurrentCourseData = null;
            onNavChange();
          };

          const isFarmRunning =
            farmStates.xp ||
            farmStates.gem ||
            farmStates.streak ||
            farmStates.league;
          if (isFarmRunning) {
            const farmName = farmStates.xp
              ? "XP Farm"
              : farmStates.gem
                ? "Gem Farm"
                : farmStates.streak
                  ? "Streak Farm"
                  : "Auto League";
            showConfirmModal(
              `${farmName} is currently running. Do you want to stop it to run Auto Legendary?`,
              () => {
                stopAllFarmingTasks();
                startLegendaryExecution();
              },
            );
          } else {
            startLegendaryExecution();
          }
        }
      });
    }

    showStats();
    document.getElementById("DX_Stats_Reset").addEventListener("click", () => {
      for (const kind in statKeys) {
        localStorage.removeItem(statKeys[kind]);
      }
      localStorage.removeItem(statSinceKey);
      showStats();
    });

    document
      .getElementById("DX_Shop_Search")
      .addEventListener("input", (event) => {
        showShop(event.target.value);
      });

    document
      .getElementById("DX_Quest_Search")
      .addEventListener("input", (event) => {
        showQuests(event.target.value);
      });

    const dInp = document.getElementById("DX_Delay_Input");
    dInp.value = delayMs;

    dInp.addEventListener("change", () => {
      const nVal = parseInt(dInp.value);
      delayMs = isNaN(nVal) ? 100 : Math.min(60000, Math.max(50, nVal));
      dInp.value = delayMs;
      localStorage.setItem("dx_delay", delayMs);
    });

    const roomInp = document.getElementById("DX_XpRoom_Input");
    const rawRoom = localStorage.getItem("dx_xp_room");
    const savedRoom =
      rawRoom === null ? 30 : parseInt(rawRoom) >= 0 ? parseInt(rawRoom) : 0;
    if (rawRoom === null) localStorage.setItem("dx_xp_room", "30");
    roomInp.value = savedRoom >= 0 ? savedRoom : "";

    roomInp.addEventListener("change", () => {
      let rVal = parseInt(roomInp.value);
      if (isNaN(rVal) || rVal < 0) {
        rVal = 0;
      }
      roomInp.value = rVal >= 0 ? rVal : "";
      localStorage.setItem("dx_xp_room", rVal);
    });

    const savedNotifPos =
      localStorage.getItem("dx_notif_pos") || "bottom_center";
    applyNotifPos(savedNotifPos);

    window.addEventListener("resize", layoutNotif);
    window.addEventListener("resize", queueRelayout);
    window.addEventListener("orientationchange", queueRelayout);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", queueRelayout);
      window.visualViewport.addEventListener("scroll", queueRelayout);
    }
    relayout();

    const dxBox = document.getElementById("DX_Main_Box");
    if (dxBox && window.MutationObserver) {
      new MutationObserver(queueRelayout).observe(dxBox, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    const dxHandle = document.getElementById("duoxjs-hide-button");
    const dxWrap = document.getElementById("DX_Main");
    if (dxHandle && dxWrap) {
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
        clearTimeout(hideShowContentTimer);
        const mBox = document.getElementById("DX_Main_Box");
        if (mBox) {
          mBox.style.transition = "none";
          mBox.style.opacity = "";
          mBox.style.filter = "";
          mBox.style.transform = "";
          mBox.style.height = "";
          mBox.style.width = "";
          mBox.style.padding = "";
          mBox.dataset.isAnimating = "false";
          mBox.classList.toggle("dx-hidden", uiHidden);
          mBox.classList.toggle("dx-collapsed", uiHidden);
          void mBox.offsetHeight;
        }

        dxWrap.style.transition = "none";
        const r = dxWrap.getBoundingClientRect();
        const offLeft = dxVpOffsetLeft();
        const offTop = dxVpOffsetTop();
        ox = r.left - offLeft;
        oy = r.top - offTop;
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
              dxWrap.style.left = c.left + "px";
              dxWrap.style.top = c.top + "px";
              dxWrap.style.right = "auto";
              dxWrap.style.bottom = "auto";
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
          dxWrap.style.transition = "none";
          dxWrap.style.transform = "";
          return;
        }
        dxHandle.dataset.dragged = "1";
        setTimeout(() => {
          dxHandle.dataset.dragged = "";
        }, 60);
        panelCorner = nearestCorner();
        localStorage.setItem("dx_panel_corner", panelCorner);
        const first = dxWrap.getBoundingClientRect();
        dxWrap.style.transition = "none";
        positionPanel();
        const last = dxWrap.getBoundingClientRect();
        dxWrap.style.transform = `translate(${first.left - last.left}px, ${first.top - last.top}px)`;
        void dxWrap.offsetWidth;
        dxWrap.style.transition =
          "transform var(--DX-motion-page) var(--DX-ease)";
        dxWrap.style.transform = "";
        setTimeout(() => {
          dxWrap.style.transition = "none";
        }, DX_DRAG_SNAP_MS);
      };
      dxHandle.addEventListener("mousedown", onDown);
      dxHandle.addEventListener("touchstart", onDown, { passive: false });
      window.addEventListener("mousemove", onMove);
      window.addEventListener("touchmove", onMove, { passive: false });
      window.addEventListener("mouseup", onUp);
      window.addEventListener("touchend", onUp);
    }

    const notifSel = document.getElementById("DX_Notif_Select");
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
      notifSel.querySelector(".DX_Select_Text").innerText = posLabels[posVal];
      notifSel.querySelectorAll(".DX_Select_Option").forEach((opt) => {
        opt.classList.toggle(
          "selected",
          opt.getAttribute("data-value") === posVal,
        );
      });
    }

    const qSel = document.getElementById("DX_EZQuizLength_Select");
    if (qSel) {
      const storedLen = localStorage.getItem("dx_ez_quiz_len") || "5";
      qSel.setAttribute("data-value", storedLen);
      qSel.querySelector(".DX_Select_Text").innerText = storedLen;
      qSel.querySelectorAll(".DX_Select_Option").forEach((opt) => {
        opt.classList.toggle(
          "selected",
          opt.getAttribute("data-value") === storedLen,
        );
      });
    }

    document.getElementById("DX_Web_Btn").addEventListener("click", () => {
      window.open("https://duoxjs.vercel.app", "_blank");
    });

    document.getElementById("DX_Discord_Btn").addEventListener("click", () => {
      window.open("https://discord.gg/yawq7BxJPy", "_blank");
    });

    document.getElementById("DX_GitHub_Btn").addEventListener("click", () => {
      window.open("https://github.com/LibreDuo/DuoXJS", "_blank");
    });

    document
      .getElementById("DX_Credit_LibreDuo")
      .addEventListener("click", () => {
        window.open("https://github.com/LibreDuo", "_blank");
      });

    const openTermsBtn = document.getElementById("DX_Open_Terms_Btn");
    if (openTermsBtn) {
      openTermsBtn.addEventListener("click", () => {
        changePage("Terms");
        loadEulaAndTos();
      });
    }

    const lOpts = document.querySelector(
      "#DX_League_Select .DX_Select_Options",
    );
    if (lOpts) {
      lOpts.innerHTML = `<div class="DX_Select_Option" style="cursor:default;opacity:0.5;">Loading rank...</div>`;
    }

    const syncMenuOpen = () => {
      const anyOpen = !!document.querySelector(".DX_Select.open");
      document.querySelectorAll(".DX_Main_Box").forEach((box) => {
        box.classList.toggle("dx-menu-open", anyOpen);
      });
    };

    document.querySelectorAll(".DX_Select_Trigger").forEach((trig) => {
      trig.addEventListener("click", (event) => {
        event.stopPropagation();
        const pSel = trig.parentElement;

        document.querySelectorAll(".DX_Select").forEach((sel) => {
          if (sel !== pSel) sel.classList.remove("open");
        });

        if (!pSel.classList.contains("open")) {
          const opts = pSel.querySelector(".DX_Select_Options");
          const rect = pSel.getBoundingClientRect();
          const box = pSel.closest(".DX_Main_Box");
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
          opts.querySelectorAll(".DX_Select_Option").forEach((opt) => {
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
      const oEl = event.target.closest(".DX_Select_Option");
      if (oEl) {
        event.stopPropagation();
        const pSel = oEl.closest(".DX_Select");
        const sVal = oEl.getAttribute("data-value");

        pSel.querySelector(".DX_Select_Text").innerText = oEl.innerText;
        pSel.setAttribute("data-value", sVal);
        pSel.classList.remove("open");

        pSel
          .querySelectorAll(".DX_Select_Option")
          .forEach((opt) => opt.classList.remove("selected"));
        oEl.classList.add("selected");

        if (pSel.id === "DX_Privacy_Select") {
          setPrivacy(sVal === "private");
        }
        if (pSel.id === "DX_Notif_Select") {
          localStorage.setItem("dx_notif_pos", sVal);
          applyNotifPos(sVal);
        }
        if (pSel.id === "DX_League_Select" && sVal) {
          localStorage.setItem("dx_league_target", sVal);
        }
        if (pSel.id === "DX_EZQuizLength_Select") {
          localStorage.setItem("dx_ez_quiz_len", sVal);
          clearPrefetchedSessionsCache();
          notify(
            "info",
            "Lesson Shortener",
            "Reloading page to apply the change...",
          );
          setTimeout(() => window.location.reload(), 1200);
        }
        syncMenuOpen();
      } else {
        document.querySelectorAll(".DX_Select").forEach((sel) => {
          sel.classList.remove("open");
        });
        syncMenuOpen();
      }
    });

    const savedMainMode = localStorage.getItem("dx_main_mode") || "native";
    setMainMode(savedMainMode, false);
    const modeToggleBtn = document.getElementById("DX_Mode_Toggle_Btn");
    if (modeToggleBtn) {
      modeToggleBtn.addEventListener("click", () => {
        const nowMode =
          (localStorage.getItem("dx_main_mode") || "native") === "native"
            ? "solver"
            : "native";
        setMainMode(nowMode, true);
      });
    }
    const userRowBtn = document.getElementById("DX_User_Row");
    if (userRowBtn) {
      userRowBtn.addEventListener("click", () => {
        changePage("AccountManager");
        renderAccounts();
        accRefreshAll();
      });
    }

    const dxRootEl = document.getElementById("DX_Root");
    if (dxRootEl) {
      dxRootEl.addEventListener(
        "focus",
        (e) => {
          if (
            e.target &&
            (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
          ) {
            suppressScrollRestoreUntil = Date.now() + 2000;
            relayout();
            setTimeout(() => {
              suppressScrollRestoreUntil = Date.now() + 1500;
              relayout();
            }, 100);
            setTimeout(() => {
              suppressScrollRestoreUntil = Date.now() + 1000;
              relayout();
            }, 500);
            setTimeout(() => {
              suppressScrollRestoreUntil = Date.now() + 500;
              relayout();
            }, 1000);
          }
        },
        true,
      );
      dxRootEl.addEventListener(
        "blur",
        (e) => {
          if (
            e.target &&
            (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
          ) {
            setTimeout(() => {
              relayout();
            }, 50);
          }
        },
        true,
      );
    }

    const termsAccepted = localStorage.getItem("dx_terms_accepted") === "true";

    const declineBtn = document.getElementById("DX_Terms_Decline_Btn");
    if (declineBtn) {
      declineBtn.addEventListener("click", () => {
        const declineMd = `# Access Denied\n\nYou must accept the EULA & Terms of Service to use DuoXJS.\n\nAccess to the script's automated tools and account operations is disabled until accepted.`;
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
      const page1 = document.getElementById("DX_Page_1");
      if (page1) page1.classList.remove("active");

      const termsPage = document.getElementById("DX_Page_Terms");
      if (termsPage) termsPage.classList.add("active");

      pageId = "Terms";
      loadEulaAndTos();
    } else {
      connect().then(() => {
        accRefreshAll();
      });
    }
    initAutoSolverObserver();

    ["pushState", "replaceState"].forEach((method) => {
      const orig = history[method];
      history[method] = function () {
        const res = orig.apply(this, arguments);
        setTimeout(() => onNavChange(), 300);
        return res;
      };
    });
    window.addEventListener("popstate", () =>
      setTimeout(() => onNavChange(), 300),
    );
    onNavChange();

    document.addEventListener("mouseup", () => {
      setTimeout(() => {
        const active = document.activeElement;
        if (
          active &&
          active.closest &&
          active.closest(
            "#DX_Root button, #DX_Root [role='button'], #DX_User_Row",
          )
        ) {
          active.blur();
        }
      }, 0);
    });

    window.DX_checkForUpdates = () => checkForUpdates();
    window.DX_resetUpdateCheck = () => {
      localStorage.removeItem("dx_update_available_version");
      hideUpdateBanner();
    };
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();
