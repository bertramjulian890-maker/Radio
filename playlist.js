/**
 * Radio Playlist
 *
 * Each entry = one radio_productions project.
 * Add episodes here; the player loads them sequentially with crossfade.
 *
 * Episode shape:
 *   id                string   – folder name (used for debugging)
 *   title             string   – song title
 *   artist            string   – displayed artist line
 *   cover             string   – path to cover.jpg
 *   audio             string   – path to final_mix.wav
 *   duration          number   – total seconds of final_mix.wav
 *   theme             object   – optional legacy colors; player derives the live background from cover.jpg
 *   crossfadeDuration number   – seconds before end to begin the transition to next episode
 *   subtitleCues      array    – [ { start, end, text } ] from subtitles.srt (seconds)
 *   lyricLines        array    – [ { time, text } ] absolute times in final_mix
 */

// Loaded as a plain <script> tag so it works on file:// without CORS issues.
// eslint-disable-next-line no-var
var PLAYLIST = [
  // ─────────────────────────────────────────
  //  Episode 1 · 色盲 · 裘德 / 徐佳莹
  // ─────────────────────────────────────────
  {
    id: 'selimang_20260524',
    title: '色盲',
    artist: '裘德 / 徐佳莹',
    cover: '../radio_productions/selimang_20260524/output/cover.jpg',
    audio: '../radio_productions/selimang_20260524/output/final_mix.wav',
    theme: {
      color1: '#0081f7',
      color2: '#61c7ff',
      color3: '#0753c7',
    },
    crossfadeDuration: 3,
    duration: 439.54,
    subtitleCues: [
      { start: 0,      end: 4.48,   text: '第三千七百日，第一次看见颜色。' },
      { start: 5.48,   end: 13.16,  text: '裘德以注脚揭示色盲核心：爱情重构色彩感知。' },
      { start: 14.16,  end: 23.58,  text: '灰度生活因一人而变，汗水蓝，心跳柳橙，你是夜空中黄色月亮。' },
      { start: 26.08,  end: 34.38,  text: '这是一首感知重构的情歌，色彩错位隐喻爱情为单调世界赋格。' },
      { start: 35.38,  end: 43.3,   text: '裘德与徐佳莹声线交织成听觉色谱：磁性质问与细腻应答。' },
      { start: 45.8,   end: 56.48,  text: '歌词用反逻辑色彩构建私人色谱：蓝色汗水、茶绯红光线打破物理规则。' },
      { start: 57.48,  end: 64.68,  text: '红灯转为私奔号令，两人蔑视世俗视觉规则。' },
      { start: 67.18,  end: 72.54,  text: '编曲以钢琴为基底，弦乐薄雾般升起。' },
      { start: 73.54,  end: 80.48,  text: '裘德低沉嗓音与徐佳莹透明声线形成冷暖对比。' },
      { start: 81.48,  end: 87.58,  text: '副歌唯独两眼是万花筒一样，模拟万花筒变幻。' },
      { start: 90.08,  end: 99.94,  text: '歌曲内核是哲学探讨：当爱成为认知坐标系，爱人即世界原色。' },
      { start: 100.94, end: 107.72, text: '呼应现象学意向性，意识完全指向对方。' },
      { start: 108.72, end: 115.72, text: '徐佳莹声线是验证者，让异常色彩变得可信。' },
      { start: 116.72, end: 123.7,  text: '二重唱隐喻爱情认知重构需要双方共谋。' },
      { start: 126.7,  end: 133.9,  text: '在专辑中，色盲承担从外部观察到内部感知的转折。' },
      { start: 134.9,  end: 144.5,  text: '它将生命感具象为色彩，对应青年时期第一次深刻爱恋的认知冲击。' },
      { start: 147.5,  end: 157.06, text: '在算法色卡统治视觉的今天，色盲提出最高分辨率视觉在爱人瞳孔中。' },
      { start: 158.06, end: 166.64, text: '当物理色彩疲惫，不妨做一次色盲，只保留属于你的原色。' },
      { start: 167.64, end: 179.42, text: '是否像夜里我仍分辨的你的目光，最深黑里，黄色月亮依然清晰。' },
      { start: 180.42, end: 185.54, text: '这不是视觉胜利，是爱之特权。' },
    ],
    lyricLines: [
      // Credits (appear as song fades in, ~185.5s narration end + ~10s crossfade)
      { time: 185.72, text: '作曲：裘德' },
      { time: 187.72, text: '作词：万一（SBMS）' },
      { time: 189.72, text: '制作人：裘德 / Tonyi NG' },
      { time: 191.72, text: '编曲：关浩德 / 宋扬' },
      // Verse 1
      { time: 195.72, text: '蓝色的汗水挂在左边眉毛' },
      { time: 202.8,  text: '茶绯红 光线太胡闹' },
      { time: 210,    text: '你干嘛趴在桌上又在笑' },
      { time: 215.4,  text: '柳橙色四溅的 我的心跳' },
      { time: 228.33, text: '铜绿的人群在生锈不重要' },
      { time: 235.5,  text: '飞出了 菖蒲色的鸟' },
      { time: 242.75, text: '一等到红灯我们就逃跑' },
      { time: 246.9,  text: '约定好别回头 放任城市在飘' },
      // Chorus 1
      { time: 257.4,  text: '那悬着的转着的你说的 黄的月亮' },
      { time: 264.4,  text: '是否像夜里我仍分辨的 你的目光' },
      { time: 271.59, text: '跟我来吧 在漆黑的隧道做两尊石像' },
      { time: 279.03, text: '你看不到的 就同我讲' },
      { time: 284.44, text: '这场旅途多么空荡' },
      { time: 290.05, text: '唯独两眼是万花筒一样' },
      // Verse 2
      { time: 322.58, text: '打翻了一个不敢给的拥抱' },
      { time: 330.15, text: '扩散成 无声的祈祷' },
      { time: 337.21, text: '去漫游直到世界会变好' },
      { time: 342.35, text: '琥珀色记载的 永恒一秒' },
      // Chorus 2
      { time: 354.8,  text: '那悬着的转着的你说的 黄的月亮' },
      { time: 361.68, text: '是否像夜里我仍分辨的 你的目光' },
      { time: 368.97, text: '跟我来吧 在漆黑的隧道做两尊石像' },
      { time: 376.22, text: '你看不到的 就同我讲' },
      { time: 383.1,  text: '这场旅途多么空荡' },
      { time: 389.42, text: '唯独两眼是万花筒一样' },
    ],
  },

  // ─────────────────────────────────────
  //  Episode 2 · 瑞贝卡 · 裘德
  // ─────────────────────────────────────
  {
    id: 'ruibeika_20260524',
    title: '瑞贝卡',
    artist: '裘德',
    cover: '../radio_productions/ruibeika_20260524/output/cover.jpg',
    audio: '../radio_productions/ruibeika_20260524/output/final_mix.wav',
    theme: {
      color1: '#a84820',
      color2: '#d07840',
      color3: '#5c2a0c',
    },
    crossfadeDuration: 3,
    duration: 443.88,
    // from ruibeika_20260524/output/subtitles.srt
    subtitleCues: [
      { start: 0,      end: 7.28,   text: '裘德的爵士叙事，总擅长用华丽编曲包裹柔软心事。' },
      { start: 8.28,   end: 13.92,  text: '今天我们走进瑞贝卡，一首藏在《颁奖的时候我要缺席》里的都市独白。' },
      { start: 14.92,  end: 22.76,  text: '以百老汇式爵士戏剧感，写透当代人在身份切换里的自我找寻。' },
      { start: 25.26,  end: 32.82,  text: '编曲一开场就定下基调：慵懒萨克斯缠绕复古鼓点。' },
      { start: 33.82,  end: 41.98,  text: '钢琴滑音如霓虹流淌，弦乐铺陈出夜晚的暧昧与疏离。' },
      { start: 42.98,  end: 55.56,  text: '裘德用松弛又略带戏剧化的唱腔，把瑞贝卡这个虚构名字，唱成每个在夜里藏起真实的我们。' },
      { start: 58.06,  end: 68.08,  text: '歌里的瑞贝卡，是夜晚卷发长裙、在吧台与灯影里周旋的陌生人。' },
      { start: 69.08,  end: 78.44,  text: '也是清晨扎起马尾、挤公交奔赴平凡的普通人。' },
      { start: 79.44,  end: 90.16,  text: '瑞贝卡是她的社交面具，也是她的自我保护。不必解释过往，不必暴露脆弱。' },
      { start: 92.66,  end: 102.16, text: '她不追奢侈品，把时间留给内心，对着枯萎的雏菊思考生命。' },
      { start: 103.16, end: 114.02, text: '甚至闪过遁入空门的念头。这不是消极逃避，是在快节奏城市里固执地寻找精神出口。' },
      { start: 116.52, end: 128.74, text: '裘德用爵士的自由节奏，对应瑞贝卡的身份流动。副歌反复吟唱的名字，像深夜里的自我确认。' },
      { start: 129.74, end: 145.14, text: '花谢会再开，人迷会再醒。不必急着成为谁，认真活着、慢慢和解，就是最珍贵的答案。' },
      { start: 148.14, end: 162.70, text: '瑞贝卡的妙处，在于用爵士的优雅消解现实的苦涩。裘德没有唱撕心裂肺的挣扎，只以温柔旋律包裹成长的阵痛。' },
      { start: 163.70, end: 174.94, text: '夜晚的霓虹是爵士的浪漫，清晨的公交是生活的真实，两者交织，就是我们的日常。' },
      { start: 177.44, end: 186.50, text: '它告诉每个听众：你可以在夜里做浪漫的瑞贝卡，也可以在白天做平凡的自己。' },
      { start: 187.50, end: 200.22, text: '两种身份都值得被接纳。当萨克斯再次响起，跟随裘德的嗓音，读懂瑞贝卡里的爵士哲学。' },
      { start: 201.22, end: 213.88, text: '不必完美，不必迎合，在流动的生命里，守住自我，就是最好的姿态。' },
    ],
    // from lyrics.lrc — all times = LRC timestamp + 206.84 (first verse at 3:55)
    lyricLines: [
      // Credits
      { time: 206.84, text: '作词：于梦' },
      { time: 207.84, text: '作曲：裘德' },
      { time: 210.32, text: '编曲：裘德' },
      // Verse 1
      { time: 235.00, text: '她给自己取了一个名字叫瑞贝卡' },
      { time: 242.56, text: '方便她在灯红酒绿里穿梭' },
      { time: 246.83, text: '方便人们在夜里见到她' },
      { time: 250.66, text: '凹凸有致的身姿' },
      { time: 254.91, text: '和浓密飘逸的长头发' },
      { time: 263.04, text: '她在清晨赶上了最早班车' },
      { time: 266.78, text: '裹在白风衣的秀发变成马尾了' },
      { time: 270.67, text: '在课堂上她依然叫瑞贝卡' },
      { time: 274.42, text: '方便老师提问和食堂阿姨刷饭卡' },
      // Pre-chorus
      { time: 279.96, text: '瑞贝卡没有买LV、香奈儿和卡地亚' },
      { time: 282.79, text: '她存的每一分钱都用在寻找她内心的活法' },
      { time: 286.71, text: '她想有天能想明白生命以及是否要出家' },
      // Chorus 1
      { time: 293.82, text: '瑞贝卡有时候会哭泣因为她养的花' },
      { time: 297.79, text: '在秋天的时候就萎败了' },
      { time: 302.16, text: '那是生命的消逝 傻瓜' },
      { time: 306.59, text: '她想也许这也有启发' },
      { time: 310.76, text: '于是她换了短裙工号128' },
      { time: 314.62, text: '某天客人在她身边醒了' },
      { time: 317.92, text: '说"昨夜我似乎又梦见了菩萨，对了你叫什么名字？"' },
      { time: 325.43, text: '"我的名字叫瑞贝卡"' },
      // Verse 2
      { time: 331.16, text: '她给自己取了一个名字叫瑞贝卡' },
      { time: 338.68, text: '方便她在灯红酒绿里穿梭' },
      { time: 342.54, text: '方便人们在夜里见到她' },
      { time: 347.74, text: '瑞贝卡没有买lv香奈儿和卡地亚' },
      { time: 350.66, text: '她存的每一分钱都用在寻找她内心的活法' },
      { time: 354.75, text: '她想有天能想明白生命以及是否要出家' },
      // Chorus 2
      { time: 363.31, text: '瑞贝卡有时候会哭泣因为她养的花' },
      { time: 368.65, text: '在秋天的时候就萎败了' },
      { time: 371.93, text: '那是生命的消逝 傻瓜' },
      { time: 376.76, text: '她想也许这也有启发' },
      { time: 380.68, text: '于是她换了短裙工号128' },
      { time: 384.66, text: '某天客人在她身边醒了' },
      { time: 387.79, text: '说"昨夜我似乎又梦见了菩萨，对了你叫什么名字？"' },
      // Outro
      { time: 395.04, text: '"对了对了"' },
      { time: 397.26, text: '有时候会哭泣因为她养的花' },
      { time: 400.59, text: '在秋天的时候就萎败了' },
      { time: 404.07, text: '那是生命的消逝 傻瓜' },
      { time: 408.69, text: '她想也许这也有启发' },
      { time: 412.56, text: '于是她换了短裙工号128' },
      { time: 416.59, text: '某天客人在她身边醒了' },
      { time: 419.79, text: '说"昨夜我似乎又梦见了菩萨，对了你叫什么名字？"' },
    ],
  },

  // ─────────────────────────────────────
  //  Episode 3 · 火山灰 · 裘德
  // ─────────────────────────────────────
  {
    id: 'huoshanhui',
    title: '火山灰',
    artist: '裘德',
    cover: '../radio_productions/火山灰/output/cover.jpg',
    audio: '../radio_productions/火山灰/output/final_mix.wav',
    theme: {
      color1: '#7d2e12',
      color2: '#f07a3a',
      color3: '#2b1812',
    },
    crossfadeDuration: 3,
    duration: 287.88,
    // from 火山灰/output/subtitles.srt
    subtitleCues: [
      { start: 0.00  , end: 11.68 , text: '把手腕覆盖在耳朵上可以听到岩浆翻涌的声音。那是肌肉与血液混合起来最小规模的活火山。' },
      { start: 12.48 , end: 22.54 , text: '我与你炙热的激烈碰撞，毛孔流淌出桔红色的明亮金属，却不肯放手一瞬。' },
      { start: 23.34 , end: 36.38 , text: '是该远离了，还是从头就不该靠近。眼泪刚流下就蒸腾，我们紧绷却动弹不得。' },
      { start: 37.38 , end: 42.32 , text: '等待。一切化成灰烬铺满天空。' },
    ],
    // from 火山灰/output/lyrics.lrc
    lyricLines: [
      { time: 45.680 , text: '我们之间的倒数' },
      { time: 51.440 , text: '数字在头上跳舞' },
      { time: 56.410 , text: '现在是几 你问我' },
      { time: 62.250 , text: '我的谎言娴熟' },
      { time: 68.840 , text: '约定要去的地方' },
      { time: 74.710 , text: '要另起一个夏天' },
      { time: 78.850 , text: '剩下的 时间 只足够' },
      { time: 85.640 , text: '原地感受分别' },
      { time: 91.780 , text: '再讲一遍关于爱' },
      { time: 95.690 , text: '却只字 不提到爱的故事' },
      { time: 103.630, text: '天边如常的烟霞' },
      { time: 107.370, text: '淡化了 一个末日' },
      { time: 115.670, text: '再晃动一些' },
      { time: 118.860, text: '再天崩地裂' },
      { time: 122.320, text: '都好过慢慢熄灭' },
      { time: 127.360, text: '你很想叹息' },
      { time: 130.300, text: '怎么用吻来 代替' },
      { time: 138.800, text: '又错了一些' },
      { time: 141.920, text: '或对了一些' },
      { time: 145.460, text: '都不再牵动结果' },
      { time: 150.220, text: '明明望着对方 却像目送什么' },
      { time: 187.630, text: '滞留在火山边缘' },
      { time: 191.550, text: '这结局 可恨在不够危险' },
      { time: 199.290, text: '并排着看一场雪' },
      { time: 203.130, text: '是灰烬 飘落眼前' },
      { time: 209.910, text: '再晃动一些' },
      { time: 213.290, text: '再天崩地裂' },
      { time: 216.540, text: '都好过慢慢熄灭' },
      { time: 221.560, text: '你很想叹息' },
      { time: 224.690, text: '怎么用吻来 代替' },
      { time: 233.050, text: '又错了一些' },
      { time: 236.320, text: '或对了一些' },
      { time: 239.830, text: '都不再牵动结果' },
      { time: 244.680, text: '明明望着对方 仍像目送什么' },
      { time: 256.300, text: '我们该逃走了' },
      { time: 260.000, text: '但却动弹不得' },
      { time: 268.000, text: '因为最小的失误' },
      { time: 273.480, text: '一切都开始倒数' },
    ],
  },

  // ─────────────────────────────────────
  //  Episode 4 · 浓缩蓝鲸 · 裘德
  // ─────────────────────────────────────
  {
    id: 'nongsuo_lanjing',
    title: '浓缩蓝鲸',
    artist: '裘德',
    cover: '../radio_productions/浓缩蓝鲸/output/cover.jpg',
    audio: '../radio_productions/浓缩蓝鲸/output/final_mix.wav',
    theme: {
      color1: '#0b4e7d',
      color2: '#61b9d8',
      color3: '#08263d',
    },
    crossfadeDuration: 3,
    duration: 349.45,
    // from 浓缩蓝鲸/output/subtitles.srt
    subtitleCues: [
      { start: 0.00  , end: 10.34 , text: '裘德用极其内敛的爵士编曲，将巨大与渺小、壮烈与易碎的矛盾张力演绎得入木三分。' },
      { start: 11.34 , end: 20.96 , text: '编曲开场的水泡声仿佛深海的呼唤，钢琴轻叩心弦，如磷虾在水中缓缓游动。' },
      { start: 21.96 , end: 34.26 , text: '裘德的声线在第一句歌词降到了最低，气声缱绻，像被浓缩在渺小身体里的巨大灵魂在轻声呢喃。' },
      { start: 35.76 , end: 46.80 , text: '这首歌的意象荒诞而诗意：蓝鲸，地球上最大的动物，灵魂却被浓缩进了磷虾。' },
      { start: 48.30 , end: 60.28 , text: '原本可以在大海中自由游弋的辽阔存在，如今被困在微小的躯壳里。所有的爱意只能以最轻柔的呓语出口。' },
      { start: 62.28 , end: 76.66 , text: '这是爱情中最极致的委屈：你的爱如此浩瀚，却只能以最微弱的方式表达；你的心意如此深沉，却消散得无声无息。' },
    ],
    // from 浓缩蓝鲸/output/lyrics.lrc
    lyricLines: [
      { time: 115.000, text: '只要你说 我就可以' },
      { time: 122.210, text: '带你到另一片海域' },
      { time: 127.990, text: '再大的浪都会像 一个喷嚏' },
      { time: 134.230, text: '不淹没谁只是 惹笑了你' },
      { time: 143.900, text: '如果声音 藏着秘密' },
      { time: 151.000, text: '在至深处给你写信' },
      { time: 156.870, text: '让语言接近沉默' },
      { time: 161.370, text: '让我接近 最幽微的隐喻 散落一地' },
      { time: 171.260, text: '如此 沉迷' },
      { time: 178.520, text: '划过暗潮看身后的风 被卷起' },
      { time: 185.540, text: '何必 怀疑' },
      { time: 191.540, text: '一呼一吸都能吵醒 水中的上帝' },
      { time: 199.830, text: '请用 你的眼神 给我回应' },
      { time: 204.920, text: '说你也信 在我怀中' },
      { time: 209.070, text: '蜷着鲸的身体' },
      { time: 213.950, text: '成为 它的辽阔 它的孤寂' },
      { time: 219.190, text: '放任我灵魂 睡在 何地' },
      { time: 225.990, text: '都能 借你栖息' },
      { time: 261.450, text: '就此 沉迷' },
      { time: 268.600, text: '蜕掉躯壳扇动着性命 跟上去' },
      { time: 275.990, text: '不曾 怀疑' },
      { time: 281.720, text: '每阵涟漪都缩印着 波涛的纹理' },
      { time: 289.820, text: '请用 你的眼神 将我倒映' },
      { time: 295.020, text: '带我穿过 漫天鱼群' },
      { time: 299.290, text: '去向蓝鲸的宿命' },
      { time: 304.330, text: '别怕 就算陨落 惊动天地' },
      { time: 309.470, text: '还能够为你 留下一座岛屿' },
      { time: 316.050, text: '"只是很可惜——"' },
      { time: 325.980, text: '一只磷虾 被谁叼去' },
      { time: 333.470, text: '遗言消散 在风里' },
    ],
  },
];
