/**
 * レーン名を正規化
 * 
 * @param {*} input 
 */
module.exports.foramtPositionName = (input) => {
  if (["top", "tp", "t", "トップ"].includes(input)) {
    return "top";
  } else if (["middle", "mid", "md", "m", "ミドル", "ミッド"].includes(input)) {
    return "middle";
  } else if (["adc", "bottom", "bot", "bt", "b", "ボトム", "ボット"].includes(input)) {
    return "bottom";
  } else if (["support", "sup", "sp", "s", "サポート", "サポ"].includes(input)) {
    return "support";
  } else if (["jungle", "jungler", "jg", "j", "ジャングル", "ジャングラ", "ジャングラー"].includes(input)) {
    return "jungle";
  } else {
    return "";
  }
}

/**
 * 英名 → 日本語名の変換
 * 
 * @param {*} championName 
 * @param {*} champions 
 */
module.exports.getCorrectChampionName = (championName, champions) => {
  let index;
  Object.values(champions).map((name, i) => {
    if (championName === name) {
      index = i;
    }
  });

  return Object.keys(champions)[index];
}

/**
 * 入力からチャンピオン名を推測
 * 
 * @param {*} input 
 * @param {*} list 
 */
module.exports.calculateIntentedChampionName = (input, list) => {
  let index = 0;
  let minimum = Number.MAX_VALUE;

  for (let i in list) {
    const championName = list[i];
    const distance = levenshteinDistance(input, championName);
    if (distance < minimum) {
      minimum = distance;
      index = i;
    }
  }

  return list[index];
}

/**
 * ひらがな → 全角カナ変換
 * 
 * @param {*} input 
 */
module.exports.toFullWidthKana = (input) => {
  const HIRAGANA_EXP = new RegExp('[ぁ-ゖ]+', 'g');
  const KATAKANA_MAP = {
    'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
    'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
    'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
    'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
    'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
    'ｳﾞ': 'ヴ', 'ﾜﾞ': 'ヷ', 'ｦﾞ': 'ヺ',
    'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
    'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
    'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
    'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
    'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
    'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
    'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
    'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
    'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
    'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
    'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
    'ｯ': 'ッ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
    '｡': '。', '､': '、', 'ｰ': 'ー', '｢': '「', '｣': '」', '･': '・'
  };
  const KATAKANA_EXP = new RegExp(`(${Object.keys(KATAKANA_MAP).join('|')})`, 'g');

  let result = input;
  if (HIRAGANA_EXP.test(input)) {
    const diff = 96; // 文字コード上のひらがな⇔カタカナの差

    // 正規表現に一致した文字列をカタカナに置換
    result.match(HIRAGANA_EXP).forEach((str) => {
      result = result.replace(
        str,
        str.split("").map((c) => String.fromCharCode(c.charCodeAt() + diff)).join('')
      );
    });
  }
  if (KATAKANA_EXP.test(input)) {
    result = result.replace(KATAKANA_EXP, (match) => KATAKANA_MAP[match]);
  }

  return result;
}

/**
 * レーベンシュタイン距離
 * FYI: https://ja.wikipedia.org/wiki/レーベンシュタイン距離
 * 
 * @inner
 * 
 * @param {*} str1 
 * @param {*} str2 
 */
function levenshteinDistance(str1, str2) {
  var r, c, cost,
    d = [];

  for (r = 0; r <= str1.length; r++) {
    d[r] = [r];
  }
  for (c = 0; c <= str2.length; c++) {
    d[0][c] = c;
  }
  for (r = 1; r <= str1.length; r++) {
    for (c = 1; c <= str2.length; c++) {
      cost = str1.charCodeAt(r - 1) == str2.charCodeAt(c - 1) ? 0 : 1;
      d[r][c] = Math.min(d[r - 1][c] + 1, d[r][c - 1] + 1, d[r - 1][c - 1] + cost);
    }
  }
  return d[str1.length][str2.length];
}
