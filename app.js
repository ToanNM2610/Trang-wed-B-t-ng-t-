/**
 * =========================================================================
 * LEXIMATRIX ULTRA — CORE APPLICATION COMPANION ENGINE
 * 12-Tense Matrix | SGK 1-12 Curriculum | Gamified Arena Integration
 * =========================================================================
 */


    function formatPassiveSubject(objStr) {
      const cleaned = (objStr || '').trim();
      if (!cleaned) return 'It';
      const noPrep = cleaned.replace(/^(to|at|in|on|with|for|from|by)\s+/i, '');
      const target = noPrep || cleaned;
      return target.charAt(0).toUpperCase() + target.slice(1);
    }

    function normalizeVerb(item) {
      if (!item) return null;
      const v1 = (item.v1 || '').trim();
      if (!v1) return null;
      const vs = item.vs || item.v_s_es || (v1 + 's');
      const v2 = item.v2 || v1;
      const v3 = item.v3 || v1;
      const ving = item.ving || item.v_ing || (v1 + 'ing');
      const ipaUS = item.ipaUS || item.ipa || `/${v1}/`;
      const meaning = item.meaning || '';
      const isIrregular = item.isIrregular !== undefined ? Boolean(item.isIrregular) : true;
      const isTransitive = item.isTransitive !== undefined
        ? Boolean(item.isTransitive)
        : (item.transitive !== undefined ? Boolean(item.transitive) : true);
      const activeObject = item.activeObject !== undefined
        ? item.activeObject
        : (item.object_sample !== undefined ? item.object_sample : '');
      const passiveSubject = item.passiveSubject || formatPassiveSubject(activeObject);
      const grade = item.grade || 6;

      return {
        ...item,
        v1,
        vs,
        v2,
        v3,
        ving,
        ipaUS,
        meaning,
        isIrregular,
        isTransitive,
        activeObject,
        passiveSubject,
        grade
      };
    }

    const BUILTIN_388_VERBS = [{"v1": "write", "vs": "writes", "v2": "wrote", "v3": "written", "ving": "writing", "ipaUS": "/raɪt/", "meaning": "viết, soạn thảo, sáng tác", "isIrregular": true, "isTransitive": true, "activeObject": "the letter", "grade": 3}, {"v1": "make", "vs": "makes", "v2": "made", "v3": "made", "ving": "making", "ipaUS": "/meɪk/", "meaning": "làm, chế tạo, tạo ra", "isIrregular": true, "isTransitive": true, "activeObject": "a birthday cake", "grade": 3}, {"v1": "build", "vs": "builds", "v2": "built", "v3": "built", "ving": "building", "ipaUS": "/bɪld/", "meaning": "xây dựng, kiến tạo", "isIrregular": true, "isTransitive": true, "activeObject": "the smart bridge", "grade": 4}, {"v1": "take", "vs": "takes", "v2": "took", "v3": "taken", "ving": "taking", "ipaUS": "/teɪk/", "meaning": "cầm, lấy, chụp (ảnh)", "isIrregular": true, "isTransitive": true, "activeObject": "the photograph", "grade": 3}, {"v1": "eat", "vs": "eats", "v2": "ate", "v3": "eaten", "ving": "eating", "ipaUS": "/iːt/", "meaning": "ăn, thưởng thức", "isIrregular": true, "isTransitive": true, "activeObject": "an organic apple", "grade": 1}, {"v1": "go", "vs": "goes", "v2": "went", "v3": "gone", "ving": "going", "ipaUS": "/ɡəʊ/", "meaning": "đi, di chuyển đến", "isIrregular": true, "isTransitive": false, "activeObject": "to school", "grade": 1}, {"v1": "come", "vs": "comes", "v2": "came", "v3": "come", "ving": "coming", "ipaUS": "/kʌm/", "meaning": "đến, tới nơi", "isIrregular": true, "isTransitive": false, "activeObject": "home early", "grade": 2}, {"v1": "run", "vs": "runs", "v2": "ran", "v3": "run", "ving": "running", "ipaUS": "/rʌn/", "meaning": "chạy bộ, vận hành", "isIrregular": true, "isTransitive": false, "activeObject": "in the park", "grade": 1}, {"v1": "speak", "vs": "speaks", "v2": "spoke", "v3": "spoken", "ving": "speaking", "ipaUS": "/spiːk/", "meaning": "nói, phát biểu", "isIrregular": true, "isTransitive": true, "activeObject": "English fluently", "grade": 2}, {"v1": "know", "vs": "knows", "v2": "knew", "v3": "known", "ving": "knowing", "ipaUS": "/nəʊ/", "meaning": "biết, tường tận", "isIrregular": true, "isTransitive": true, "activeObject": "the secret", "grade": 4}, {"v1": "see", "vs": "sees", "v2": "saw", "v3": "seen", "ving": "seeing", "ipaUS": "/siː/", "meaning": "nhìn thấy, xem", "isIrregular": true, "isTransitive": true, "activeObject": "the aurora", "grade": 1}, {"v1": "do", "vs": "does", "v2": "did", "v3": "done", "ving": "doing", "ipaUS": "/duː/", "meaning": "làm, thực hiện", "isIrregular": true, "isTransitive": true, "activeObject": "the homework", "grade": 2}, {"v1": "have", "vs": "has", "v2": "had", "v3": "had", "ving": "having", "ipaUS": "/hæv/", "meaning": "có, dùng bữa", "isIrregular": true, "isTransitive": true, "activeObject": "a meeting", "grade": 2}, {"v1": "be", "vs": "is", "v2": "was/were", "v3": "been", "ving": "being", "ipaUS": "/biː/", "meaning": "thì, là, ở", "isIrregular": true, "isTransitive": false, "activeObject": "ready", "grade": 1}, {"v1": "get", "vs": "gets", "v2": "got", "v3": "gotten", "ving": "getting", "ipaUS": "/ɡet/", "meaning": "nhận được, đạt được", "isIrregular": true, "isTransitive": true, "activeObject": "high scores", "grade": 3}, {"v1": "give", "vs": "gives", "v2": "gave", "v3": "given", "ving": "giving", "ipaUS": "/ɡɪv/", "meaning": "tặng, đưa cho", "isIrregular": true, "isTransitive": true, "activeObject": "a present", "grade": 3}, {"v1": "find", "vs": "finds", "v2": "found", "v3": "found", "ving": "finding", "ipaUS": "/faɪnd/", "meaning": "tìm thấy, phát hiện", "isIrregular": true, "isTransitive": true, "activeObject": "the solution", "grade": 4}, {"v1": "think", "vs": "thinks", "v2": "thought", "v3": "thought", "ving": "thinking", "ipaUS": "/θɪŋk/", "meaning": "suy nghĩ, cân nhắc", "isIrregular": true, "isTransitive": true, "activeObject": "a new idea", "grade": 4}, {"v1": "tell", "vs": "tells", "v2": "told", "v3": "told", "ving": "telling", "ipaUS": "/tel/", "meaning": "kể, bảo, nói cho biết", "isIrregular": true, "isTransitive": true, "activeObject": "an inspiring story", "grade": 3}, {"v1": "become", "vs": "becomes", "v2": "became", "v3": "become", "ving": "becoming", "ipaUS": "/bɪˈkʌm/", "meaning": "trở thành, trở nên", "isIrregular": true, "isTransitive": false, "activeObject": "an engineer", "grade": 6}, {"v1": "show", "vs": "shows", "v2": "showed", "v3": "shown", "ving": "showing", "ipaUS": "/ʃəʊ/", "meaning": "cho xem, trình chiếu", "isIrregular": true, "isTransitive": true, "activeObject": "the blueprint", "grade": 4}, {"v1": "leave", "vs": "leaves", "v2": "left", "v3": "left", "ving": "leaving", "ipaUS": "/liːv/", "meaning": "rời đi, để lại", "isIrregular": true, "isTransitive": true, "activeObject": "the office", "grade": 5}, {"v1": "feel", "vs": "feels", "v2": "felt", "v3": "felt", "ving": "feeling", "ipaUS": "/fiːl/", "meaning": "cảm thấy, chạm vào", "isIrregular": true, "isTransitive": false, "activeObject": "confident", "grade": 4}, {"v1": "put", "vs": "puts", "v2": "put", "v3": "put", "ving": "putting", "ipaUS": "/pʊt/", "meaning": "đặt, để", "isIrregular": true, "isTransitive": true, "activeObject": "the book on the desk", "grade": 2}, {"v1": "bring", "vs": "brings", "v2": "brought", "v3": "brought", "ving": "bringing", "ipaUS": "/brɪŋ/", "meaning": "mang đến, đem lại", "isIrregular": true, "isTransitive": true, "activeObject": "good news", "grade": 5}, {"v1": "begin", "vs": "begins", "v2": "began", "v3": "begun", "ving": "beginning", "ipaUS": "/bɪˈɡɪn/", "meaning": "bắt đầu, khởi đầu", "isIrregular": true, "isTransitive": true, "activeObject": "the project", "grade": 5}, {"v1": "keep", "vs": "keeps", "v2": "kept", "v3": "kept", "ving": "keeping", "ipaUS": "/kiːp/", "meaning": "giữ, duy trì", "isIrregular": true, "isTransitive": true, "activeObject": "the promise", "grade": 5}, {"v1": "hold", "vs": "holds", "v2": "held", "v3": "held", "ving": "holding", "ipaUS": "/həʊld/", "meaning": "cầm, nắm, tổ chức", "isIrregular": true, "isTransitive": true, "activeObject": "a conference", "grade": 6}, {"v1": "stand", "vs": "stands", "v2": "stood", "v3": "stood", "ving": "standing", "ipaUS": "/stænd/", "meaning": "đứng, chịu đựng", "isIrregular": true, "isTransitive": false, "activeObject": "on the stage", "grade": 2}, {"v1": "hear", "vs": "hears", "v2": "heard", "v3": "heard", "ving": "hearing", "ipaUS": "/hɪər/", "meaning": "nghe thấy", "isIrregular": true, "isTransitive": true, "activeObject": "the melody", "grade": 3}, {"v1": "let", "vs": "lets", "v2": "let", "v3": "let", "ving": "letting", "ipaUS": "/let/", "meaning": "cho phép, để cho", "isIrregular": true, "isTransitive": true, "activeObject": "the team lead", "grade": 5}, {"v1": "mean", "vs": "means", "v2": "meant", "v3": "meant", "ving": "meaning", "ipaUS": "/miːn/", "meaning": "có nghĩa là, hàm ý", "isIrregular": true, "isTransitive": true, "activeObject": "success", "grade": 6}, {"v1": "set", "vs": "sets", "v2": "set", "v3": "set", "ving": "setting", "ipaUS": "/set/", "meaning": "thiết lập, đặt", "isIrregular": true, "isTransitive": true, "activeObject": "a new record", "grade": 6}, {"v1": "meet", "vs": "meets", "v2": "met", "v3": "met", "ving": "meeting", "ipaUS": "/miːt/", "meaning": "gặp gỡ, hội họp", "isIrregular": true, "isTransitive": true, "activeObject": "the clients", "grade": 3}, {"v1": "pay", "vs": "pays", "v2": "paid", "v3": "paid", "ving": "paying", "ipaUS": "/peɪ/", "meaning": "thanh toán, trả tiền", "isIrregular": true, "isTransitive": true, "activeObject": "the tuition fee", "grade": 5}, {"v1": "sit", "vs": "sits", "v2": "sat", "v3": "sat", "ving": "sitting", "ipaUS": "/sɪt/", "meaning": "ngồi", "isIrregular": true, "isTransitive": false, "activeObject": "in the front row", "grade": 1}, {"v1": "lose", "vs": "loses", "v2": "lost", "v3": "lost", "ving": "losing", "ipaUS": "/luːz/", "meaning": "mất, đánh mất, thua", "isIrregular": true, "isTransitive": true, "activeObject": "the key", "grade": 5}, {"v1": "fall", "vs": "falls", "v2": "fell", "v3": "fallen", "ving": "falling", "ipaUS": "/fɔːl/", "meaning": "rơi, ngã, giảm xuống", "isIrregular": true, "isTransitive": false, "activeObject": "from the tree", "grade": 5}, {"v1": "send", "vs": "sends", "v2": "sent", "v3": "sent", "ving": "sending", "ipaUS": "/send/", "meaning": "gửi đi", "isIrregular": true, "isTransitive": true, "activeObject": "an email", "grade": 4}, {"v1": "buy", "vs": "buys", "v2": "bought", "v3": "bought", "ving": "buying", "ipaUS": "/baɪ/", "meaning": "mua, tậu", "isIrregular": true, "isTransitive": true, "activeObject": "a new laptop", "grade": 3}, {"v1": "lead", "vs": "leads", "v2": "led", "v3": "led", "ving": "leading", "ipaUS": "/liːd/", "meaning": "dẫn dắt, lãnh đạo", "isIrregular": true, "isTransitive": true, "activeObject": "the research team", "grade": 8}, {"v1": "understand", "vs": "understands", "v2": "understood", "v3": "understood", "ving": "understanding", "ipaUS": "/ˌʌndəˈstænd/", "meaning": "hiểu, nắm bắt", "isIrregular": true, "isTransitive": true, "activeObject": "the grammar rule", "grade": 5}, {"v1": "spend", "vs": "spends", "v2": "spent", "v3": "spent", "ving": "spending", "ipaUS": "/spend/", "meaning": "dành (thời gian), tiêu (tiền)", "isIrregular": true, "isTransitive": true, "activeObject": "two hours reading", "grade": 5}, {"v1": "grow", "vs": "grows", "v2": "grew", "v3": "grown", "ving": "growing", "ipaUS": "/ɡrəʊ/", "meaning": "trồng, phát triển, lớn lên", "isIrregular": true, "isTransitive": true, "activeObject": "organic vegetables", "grade": 4}, {"v1": "win", "vs": "wins", "v2": "won", "v3": "won", "ving": "winning", "ipaUS": "/wɪn/", "meaning": "chiến thắng, đoạt giải", "isIrregular": true, "isTransitive": true, "activeObject": "the championship", "grade": 4}, {"v1": "teach", "vs": "teaches", "v2": "taught", "v3": "taught", "ving": "teaching", "ipaUS": "/tiːtʃ/", "meaning": "dạy học, giảng dạy", "isIrregular": true, "isTransitive": true, "activeObject": "mathematics", "grade": 3}, {"v1": "read", "vs": "reads", "v2": "read", "v3": "read", "ving": "reading", "ipaUS": "/riːd/", "meaning": "đọc, nghiên cứu", "isIrregular": true, "isTransitive": true, "activeObject": "the novel", "grade": 1}, {"v1": "learn", "vs": "learns", "v2": "learnt/learned", "v3": "learnt/learned", "ving": "learning", "ipaUS": "/lɜːn/", "meaning": "học tập, rèn luyện", "isIrregular": true, "isTransitive": true, "activeObject": "foreign languages", "grade": 2}, {"v1": "drink", "vs": "drinks", "v2": "drank", "v3": "drunk", "ving": "drinking", "ipaUS": "/drɪŋk/", "meaning": "uống", "isIrregular": true, "isTransitive": true, "activeObject": "fresh milk", "grade": 1}, {"v1": "sleep", "vs": "sleeps", "v2": "slept", "v3": "slept", "ving": "sleeping", "ipaUS": "/sliːp/", "meaning": "ngủ, nghỉ ngơi", "isIrregular": true, "isTransitive": false, "activeObject": "soundly", "grade": 1}, {"v1": "sing", "vs": "sings", "v2": "sang", "v3": "sung", "ving": "singing", "ipaUS": "/sɪŋ/", "meaning": "ca hát", "isIrregular": true, "isTransitive": true, "activeObject": "an English song", "grade": 1}, {"v1": "swim", "vs": "swims", "v2": "swam", "v3": "swum", "ving": "swimming", "ipaUS": "/swɪm/", "meaning": "bơi lội", "isIrregular": true, "isTransitive": false, "activeObject": "across the pool", "grade": 2}, {"v1": "draw", "vs": "draws", "v2": "drew", "v3": "drawn", "ving": "drawing", "ipaUS": "/drɔː/", "meaning": "vẽ, phác họa, thu hút", "isIrregular": true, "isTransitive": true, "activeObject": "a portrait", "grade": 1}, {"v1": "fly", "vs": "flies", "v2": "flew", "v3": "flown", "ving": "flying", "ipaUS": "/flaɪ/", "meaning": "bay, lái máy bay, thả diều", "isIrregular": true, "isTransitive": true, "activeObject": "a kite", "grade": 2}, {"v1": "ride", "vs": "rides", "v2": "rode", "v3": "ridden", "ving": "riding", "ipaUS": "/raɪd/", "meaning": "cưỡi (ngựa), đạp (xe)", "isIrregular": true, "isTransitive": true, "activeObject": "a bicycle", "grade": 2}, {"v1": "drive", "vs": "drives", "v2": "drove", "v3": "driven", "ving": "driving", "ipaUS": "/draɪv/", "meaning": "lái xe ô tô", "isIrregular": true, "isTransitive": true, "activeObject": "an electric car", "grade": 4}, {"v1": "wear", "vs": "wears", "v2": "wore", "v3": "worn", "ving": "wearing", "ipaUS": "/weər/", "meaning": "mặc, đội, đeo", "isIrregular": true, "isTransitive": true, "activeObject": "the school uniform", "grade": 3}, {"v1": "choose", "vs": "chooses", "v2": "chose", "v3": "chosen", "ving": "choosing", "ipaUS": "/tʃuːz/", "meaning": "lựa chọn, tuyển chọn", "isIrregular": true, "isTransitive": true, "activeObject": "the best option", "grade": 5}, {"v1": "break", "vs": "breaks", "v2": "broke", "v3": "broken", "ving": "breaking", "ipaUS": "/breɪk/", "meaning": "làm vỡ, phá vỡ", "isIrregular": true, "isTransitive": true, "activeObject": "the world record", "grade": 5}, {"v1": "catch", "vs": "catches", "v2": "caught", "v3": "caught", "ving": "catching", "ipaUS": "/kætʃ/", "meaning": "bắt lấy, đón (xe)", "isIrregular": true, "isTransitive": true, "activeObject": "the early bus", "grade": 4}, {"v1": "throw", "vs": "throws", "v2": "threw", "v3": "thrown", "ving": "throwing", "ipaUS": "/θrəʊ/", "meaning": "ném, quăng", "isIrregular": true, "isTransitive": true, "activeObject": "the basketball", "grade": 3}, {"v1": "cut", "vs": "cuts", "v2": "cut", "v3": "cut", "ving": "cutting", "ipaUS": "/kʌt/", "meaning": "cắt, giảm bớt", "isIrregular": true, "isTransitive": true, "activeObject": "the paper", "grade": 2}, {"v1": "hit", "vs": "hits", "v2": "hit", "v3": "hit", "ving": "hitting", "ipaUS": "/hɪt/", "meaning": "đánh, chạm mục tiêu", "isIrregular": true, "isTransitive": true, "activeObject": "the target", "grade": 5}, {"v1": "hurt", "vs": "hurts", "v2": "hurt", "v3": "hurt", "ving": "hurting", "ipaUS": "/hɜːt/", "meaning": "làm đau, gây tổn thương", "isIrregular": true, "isTransitive": true, "activeObject": "his ankle", "grade": 5}, {"v1": "shut", "vs": "shuts", "v2": "shut", "v3": "shut", "ving": "shutting", "ipaUS": "/ʃʌt/", "meaning": "đóng lại, khép lại", "isIrregular": true, "isTransitive": true, "activeObject": "the window", "grade": 4}, {"v1": "cost", "vs": "costs", "v2": "cost", "v3": "cost", "ving": "costing", "ipaUS": "/kɒst/", "meaning": "có giá, tốn kém", "isIrregular": true, "isTransitive": false, "activeObject": "a lot of money", "grade": 5}, {"v1": "spread", "vs": "spreads", "v2": "spread", "v3": "spread", "ving": "spreading", "ipaUS": "/spred/", "meaning": "lan truyền, trải ra", "isIrregular": true, "isTransitive": true, "activeObject": "positive energy", "grade": 8}, {"v1": "broadcast", "vs": "broadcasts", "v2": "broadcast", "v3": "broadcast", "ving": "broadcasting", "ipaUS": "/ˈbrɔːdkɑːst/", "meaning": "phát sóng, truyền thanh", "isIrregular": true, "isTransitive": true, "activeObject": "the live concert", "grade": 9}, {"v1": "forecast", "vs": "forecasts", "v2": "forecast", "v3": "forecast", "ving": "forecasting", "ipaUS": "/ˈfɔːkɑːst/", "meaning": "dự báo (thời tiết, xu hướng)", "isIrregular": true, "isTransitive": true, "activeObject": "the weather", "grade": 9}, {"v1": "quit", "vs": "quits", "v2": "quit", "v3": "quit", "ving": "quitting", "ipaUS": "/kwɪt/", "meaning": "từ bỏ, nghỉ việc", "isIrregular": true, "isTransitive": true, "activeObject": "bad habits", "grade": 8}, {"v1": "burst", "vs": "bursts", "v2": "burst", "v3": "burst", "ving": "bursting", "ipaUS": "/bɜːst/", "meaning": "nổ tung, bật (khóc/cười)", "isIrregular": true, "isTransitive": false, "activeObject": "into tears", "grade": 9}, {"v1": "bet", "vs": "bets", "v2": "bet", "v3": "bet", "ving": "betting", "ipaUS": "/bet/", "meaning": "đặt cược, cá cược", "isIrregular": true, "isTransitive": true, "activeObject": "everything", "grade": 10}, {"v1": "bid", "vs": "bids", "v2": "bid", "v3": "bid", "ving": "bidding", "ipaUS": "/bɪd/", "meaning": "đấu thầu, trả giá", "isIrregular": true, "isTransitive": true, "activeObject": "a high price", "grade": 11}, {"v1": "cast", "vs": "casts", "v2": "cast", "v3": "cast", "ving": "casting", "ipaUS": "/kɑːst/", "meaning": "phân vai, tung, chiếu", "isIrregular": true, "isTransitive": true, "activeObject": "a warm shadow", "grade": 10}, {"v1": "shed", "vs": "sheds", "v2": "shed", "v3": "shed", "ving": "shedding", "ipaUS": "/ʃed/", "meaning": "rơi (nước mắt), rụng, tỏa sáng", "isIrregular": true, "isTransitive": true, "activeObject": "new light on the issue", "grade": 11}, {"v1": "split", "vs": "splits", "v2": "split", "v3": "split", "ving": "splitting", "ipaUS": "/splɪt/", "meaning": "chia tách, phân đôi", "isIrregular": true, "isTransitive": true, "activeObject": "the bill", "grade": 8}, {"v1": "thrust", "vs": "thrusts", "v2": "thrust", "v3": "thrust", "ving": "thrusting", "ipaUS": "/θrʌst/", "meaning": "đẩy mạnh, ấn mạnh", "isIrregular": true, "isTransitive": true, "activeObject": "the sword forward", "grade": 12}, {"v1": "arise", "vs": "arises", "v2": "arose", "v3": "arisen", "ving": "arising", "ipaUS": "/əˈraɪz/", "meaning": "phát sinh, nảy sinh", "isIrregular": true, "isTransitive": false, "activeObject": "from the discussion", "grade": 11}, {"v1": "awake", "vs": "awakes", "v2": "awoke", "v3": "awoken", "ving": "awaking", "ipaUS": "/əˈweɪk/", "meaning": "đánh thức, thức giấc", "isIrregular": true, "isTransitive": true, "activeObject": "the sleeping giant", "grade": 9}, {"v1": "bear", "vs": "bears", "v2": "bore", "v3": "borne", "ving": "bearing", "ipaUS": "/beər/", "meaning": "chịu đựng, mang theo", "isIrregular": true, "isTransitive": true, "activeObject": "the responsibility", "grade": 10}, {"v1": "beat", "vs": "beats", "v2": "beat", "v3": "beaten", "ving": "beating", "ipaUS": "/biːt/", "meaning": "đánh bại, đập (nhịp tim)", "isIrregular": true, "isTransitive": true, "activeObject": "the opponent", "grade": 7}, {"v1": "bend", "vs": "bends", "v2": "bent", "v3": "bent", "ving": "bending", "ipaUS": "/bend/", "meaning": "uốn cong, cúi xuống", "isIrregular": true, "isTransitive": true, "activeObject": "the metal rod", "grade": 8}, {"v1": "bind", "vs": "binds", "v2": "bound", "v3": "bound", "ving": "binding", "ipaUS": "/baɪnd/", "meaning": "buộc chặt, đóng (sách), ràng buộc", "isIrregular": true, "isTransitive": true, "activeObject": "the contract", "grade": 11}, {"v1": "bite", "vs": "bites", "v2": "bit", "v3": "bitten", "ving": "biting", "ipaUS": "/baɪt/", "meaning": "cắn, ngoạm", "isIrregular": true, "isTransitive": true, "activeObject": "the bait", "grade": 6}, {"v1": "bleed", "vs": "bleeds", "v2": "bled", "v3": "bled", "ving": "bleeding", "ipaUS": "/bliːd/", "meaning": "chảy máu", "isIrregular": true, "isTransitive": false, "activeObject": "heavily", "grade": 8}, {"v1": "blow", "vs": "blows", "v2": "blew", "v3": "blown", "ving": "blowing", "ipaUS": "/bləʊ/", "meaning": "thổi, cuốn bay", "isIrregular": true, "isTransitive": true, "activeObject": "the candles", "grade": 5}, {"v1": "breed", "vs": "breeds", "v2": "bred", "v3": "bred", "ving": "breeding", "ipaUS": "/briːd/", "meaning": "nuôi dưỡng, nhân giống", "isIrregular": true, "isTransitive": true, "activeObject": "rare orchids", "grade": 10}, {"v1": "burn", "vs": "burns", "v2": "burnt/burned", "v3": "burnt/burned", "ving": "burning", "ipaUS": "/bɜːn/", "meaning": "đốt cháy, thắp sáng", "isIrregular": true, "isTransitive": true, "activeObject": "the dry wood", "grade": 6}, {"v1": "cling", "vs": "clings", "v2": "clung", "v3": "clung", "ving": "clinging", "ipaUS": "/klɪŋ/", "meaning": "bám chặt, giữ lấy", "isIrregular": true, "isTransitive": false, "activeObject": "to hope", "grade": 11}, {"v1": "creep", "vs": "creeps", "v2": "crept", "v3": "crept", "ving": "creeping", "ipaUS": "/kriːp/", "meaning": "bò, trườn, rón rén", "isIrregular": true, "isTransitive": false, "activeObject": "into the garden", "grade": 9}, {"v1": "deal", "vs": "deals", "v2": "dealt", "v3": "dealt", "ving": "dealing", "ipaUS": "/diːl/", "meaning": "giải quyết, đối phó, giao dịch", "isIrregular": true, "isTransitive": false, "activeObject": "with the challenge", "grade": 9}, {"v1": "dig", "vs": "digs", "v2": "dug", "v3": "dug", "ving": "digging", "ipaUS": "/dɪɡ/", "meaning": "đào bới, khai quật", "isIrregular": true, "isTransitive": true, "activeObject": "a deep tunnel", "grade": 6}, {"v1": "dive", "vs": "dives", "v2": "dove/dived", "v3": "dived", "ving": "diving", "ipaUS": "/daɪv/", "meaning": "lặn, lao xuống", "isIrregular": true, "isTransitive": false, "activeObject": "into the ocean", "grade": 7}, {"v1": "dream", "vs": "dreams", "v2": "dreamt/dreamed", "v3": "dreamt/dreamed", "ving": "dreaming", "ipaUS": "/driːm/", "meaning": "mơ ước, chiêm bao", "isIrregular": true, "isTransitive": false, "activeObject": "about the future", "grade": 5}, {"v1": "dwell", "vs": "dwells", "v2": "dwelt", "v3": "dwelt", "ving": "dwelling", "ipaUS": "/dwel/", "meaning": "cư ngụ, sinh sống", "isIrregular": true, "isTransitive": false, "activeObject": "in the valley", "grade": 12}, {"v1": "feed", "vs": "feeds", "v2": "fed", "v3": "fed", "ving": "feeding", "ipaUS": "/fiːd/", "meaning": "cho ăn, nuôi dưỡng", "isIrregular": true, "isTransitive": true, "activeObject": "the kittens", "grade": 4}, {"v1": "fight", "vs": "fights", "v2": "fought", "v3": "fought", "ving": "fighting", "ipaUS": "/faɪt/", "meaning": "chiến đấu, đấu tranh", "isIrregular": true, "isTransitive": true, "activeObject": "the virus", "grade": 6}, {"v1": "flee", "vs": "flees", "v2": "fled", "v3": "fled", "ving": "fleeing", "ipaUS": "/fliː/", "meaning": "chạy trốn, lánh nạn", "isIrregular": true, "isTransitive": true, "activeObject": "the storm", "grade": 10}, {"v1": "fling", "vs": "flings", "v2": "flung", "v3": "flung", "ving": "flinging", "ipaUS": "/flɪŋ/", "meaning": "quăng mạnh, liệng", "isIrregular": true, "isTransitive": true, "activeObject": "the coat aside", "grade": 11}, {"v1": "forbid", "vs": "forbids", "v2": "forbade", "v3": "forbidden", "ving": "forbidding", "ipaUS": "/fəˈbɪd/", "meaning": "cấm đoán, ngăn cấm", "isIrregular": true, "isTransitive": true, "activeObject": "smoking indoors", "grade": 10}, {"v1": "forgive", "vs": "forgives", "v2": "forgave", "v3": "forgiven", "ving": "forgiving", "ipaUS": "/fəˈɡɪv/", "meaning": "tha thứ, bỏ qua", "isIrregular": true, "isTransitive": true, "activeObject": "the mistake", "grade": 7}, {"v1": "forsake", "vs": "forsakes", "v2": "forsook", "v3": "forsaken", "ving": "forsaking", "ipaUS": "/fəˈseɪk/", "meaning": "ruồng bỏ, từ bỏ", "isIrregular": true, "isTransitive": true, "activeObject": "old prejudices", "grade": 12}, {"v1": "freeze", "vs": "freezes", "v2": "froze", "v3": "frozen", "ving": "freezing", "ipaUS": "/friːz/", "meaning": "đóng băng, đông lạnh", "isIrregular": true, "isTransitive": true, "activeObject": "the fresh berries", "grade": 7}, {"v1": "grind", "vs": "grinds", "v2": "ground", "v3": "ground", "ving": "grinding", "ipaUS": "/ɡraɪnd/", "meaning": "xay, nghiền, mài", "isIrregular": true, "isTransitive": true, "activeObject": "the coffee beans", "grade": 9}, {"v1": "hang", "vs": "hangs", "v2": "hung", "v3": "hung", "ving": "hanging", "ipaUS": "/hæŋ/", "meaning": "treo, mắc", "isIrregular": true, "isTransitive": true, "activeObject": "the painting", "grade": 6}, {"v1": "hide", "vs": "hides", "v2": "hid", "v3": "hidden", "ving": "hiding", "ipaUS": "/haɪd/", "meaning": "giấu, ẩn nấp", "isIrregular": true, "isTransitive": true, "activeObject": "the treasure", "grade": 5}, {"v1": "kneel", "vs": "kneels", "v2": "knelt", "v3": "knelt", "ving": "kneeling", "ipaUS": "/niːl/", "meaning": "quỳ gối", "isIrregular": true, "isTransitive": false, "activeObject": "on the carpet", "grade": 9}, {"v1": "knit", "vs": "knits", "v2": "knit/knitted", "v3": "knit/knitted", "ving": "knitting", "ipaUS": "/nɪt/", "meaning": "đan (len), kết nối", "isIrregular": true, "isTransitive": true, "activeObject": "a warm sweater", "grade": 8}, {"v1": "lay", "vs": "lays", "v2": "laid", "v3": "laid", "ving": "laying", "ipaUS": "/leɪ/", "meaning": "đặt, để, đẻ (trứng)", "isIrregular": true, "isTransitive": true, "activeObject": "the foundation", "grade": 8}, {"v1": "lean", "vs": "leans", "v2": "leant/leaned", "v3": "leant/leaned", "ving": "leaning", "ipaUS": "/liːn/", "meaning": "dựa vào, nghiêng về", "isIrregular": true, "isTransitive": false, "activeObject": "against the wall", "grade": 8}, {"v1": "leap", "vs": "leaps", "v2": "leapt/leaped", "v3": "leapt/leaped", "ving": "leaping", "ipaUS": "/liːp/", "meaning": "nhảy vọt, bật cao", "isIrregular": true, "isTransitive": false, "activeObject": "over the fence", "grade": 9}, {"v1": "lend", "vs": "lends", "v2": "lent", "v3": "lent", "ving": "lending", "ipaUS": "/lend/", "meaning": "cho mượn, cho vay", "isIrregular": true, "isTransitive": true, "activeObject": "the dictionary", "grade": 6}, {"v1": "lie", "vs": "lies", "v2": "lay", "v3": "lain", "ving": "lying", "ipaUS": "/laɪ/", "meaning": "nằm nghỉ, tọa lạc", "isIrregular": true, "isTransitive": false, "activeObject": "on the beach", "grade": 7}, {"v1": "light", "vs": "lights", "v2": "lit/lighted", "v3": "lit/lighted", "ving": "lighting", "ipaUS": "/laɪt/", "meaning": "thắp sáng, châm lửa", "isIrregular": true, "isTransitive": true, "activeObject": "the campfire", "grade": 6}, {"v1": "mistake", "vs": "mistakes", "v2": "mistook", "v3": "mistaken", "ving": "mistaking", "ipaUS": "/mɪˈsteɪk/", "meaning": "nhầm lẫn", "isIrregular": true, "isTransitive": true, "activeObject": "the address", "grade": 9}, {"v1": "overcome", "vs": "overcomes", "v2": "overcame", "v3": "overcome", "ving": "overcoming", "ipaUS": "/ˌəʊvəˈkʌm/", "meaning": "vượt qua, khắc phục", "isIrregular": true, "isTransitive": true, "activeObject": "all obstacles", "grade": 9}, {"v1": "overtake", "vs": "overtakes", "v2": "overtook", "v3": "overtaken", "ving": "overtaking", "ipaUS": "/ˌəʊvəˈteɪk/", "meaning": "vượt qua, bắt kịp", "isIrregular": true, "isTransitive": true, "activeObject": "the leading car", "grade": 10}, {"v1": "prove", "vs": "proves", "v2": "proved", "v3": "proven/proved", "ving": "proving", "ipaUS": "/pruːv/", "meaning": "chứng minh, chứng tỏ", "isIrregular": true, "isTransitive": true, "activeObject": "the theorem", "grade": 9}, {"v1": "ring", "vs": "rings", "v2": "rang", "v3": "rung", "ving": "ringing", "ipaUS": "/rɪŋ/", "meaning": "rung chuông, gọi điện", "isIrregular": true, "isTransitive": true, "activeObject": "the school bell", "grade": 5}, {"v1": "rise", "vs": "rises", "v2": "rose", "v3": "risen", "ving": "rising", "ipaUS": "/raɪz/", "meaning": "mọc (mặt trời), tăng lên", "isIrregular": true, "isTransitive": false, "activeObject": "in the east", "grade": 6}, {"v1": "saw", "vs": "saws", "v2": "sawed", "v3": "sawn/sawed", "ving": "sawing", "ipaUS": "/sɔː/", "meaning": "cưa (gỗ)", "isIrregular": true, "isTransitive": true, "activeObject": "the timber", "grade": 8}, {"v1": "seek", "vs": "seeks", "v2": "sought", "v3": "sought", "ving": "seeking", "ipaUS": "/siːk/", "meaning": "tìm kiếm, theo đuổi", "isIrregular": true, "isTransitive": true, "activeObject": "expert advice", "grade": 10}, {"v1": "sell", "vs": "sells", "v2": "sold", "v3": "sold", "ving": "selling", "ipaUS": "/sel/", "meaning": "bán, kinh doanh", "isIrregular": true, "isTransitive": true, "activeObject": "handmade crafts", "grade": 4}, {"v1": "sew", "vs": "sews", "v2": "sewed", "v3": "sewn/sewed", "ving": "sewing", "ipaUS": "/səʊ/", "meaning": "may vá, khâu", "isIrregular": true, "isTransitive": true, "activeObject": "a new dress", "grade": 7}, {"v1": "shake", "vs": "shakes", "v2": "shook", "v3": "shaken", "ving": "shaking", "ipaUS": "/ʃeɪk/", "meaning": "lắc, bắt (tay), rung chuyển", "isIrregular": true, "isTransitive": true, "activeObject": "the bottle", "grade": 6}, {"v1": "shine", "vs": "shines", "v2": "shone", "v3": "shone", "ving": "shining", "ipaUS": "/ʃaɪn/", "meaning": "chiếu sáng, tỏa sáng", "isIrregular": true, "isTransitive": false, "activeObject": "brightly", "grade": 5}, {"v1": "shoot", "vs": "shoots", "v2": "shot", "v3": "shot", "ving": "shooting", "ipaUS": "/ʃuːt/", "meaning": "bắn, sút bóng, quay phim", "isIrregular": true, "isTransitive": true, "activeObject": "a documentary", "grade": 7}, {"v1": "shrink", "vs": "shrinks", "v2": "shrank", "v3": "shrunk", "ving": "shrinking", "ipaUS": "/ʃrɪŋk/", "meaning": "co lại, thu hẹp", "isIrregular": true, "isTransitive": true, "activeObject": "the wool shirt", "grade": 10}, {"v1": "sink", "vs": "sinks", "v2": "sank", "v3": "sunk", "ving": "sinking", "ipaUS": "/sɪŋk/", "meaning": "chìm xuống, đánh chìm", "isIrregular": true, "isTransitive": true, "activeObject": "the old ship", "grade": 7}, {"v1": "slide", "vs": "slides", "v2": "slid", "v3": "slid", "ving": "sliding", "ipaUS": "/slaɪd/", "meaning": "trượt, lướt đi", "isIrregular": true, "isTransitive": true, "activeObject": "the glass door", "grade": 7}, {"v1": "smell", "vs": "smells", "v2": "smelt/smelled", "v3": "smelt/smelled", "ving": "smelling", "ipaUS": "/smel/", "meaning": "ngửi thấy, tỏa hương", "isIrregular": true, "isTransitive": true, "activeObject": "the jasmine tea", "grade": 5}, {"v1": "sow", "vs": "sows", "v2": "sowed", "v3": "sown/sowed", "ving": "sowing", "ipaUS": "/səʊ/", "meaning": "gieo (hạt)", "isIrregular": true, "isTransitive": true, "activeObject": "the golden seeds", "grade": 9}, {"v1": "spell", "vs": "spells", "v2": "spelt/spelled", "v3": "spelt/spelled", "ving": "spelling", "ipaUS": "/spel/", "meaning": "đánh vần", "isIrregular": true, "isTransitive": true, "activeObject": "the difficult word", "grade": 2}, {"v1": "spill", "vs": "spills", "v2": "spilt/spilled", "v3": "spilt/spilled", "ving": "spilling", "ipaUS": "/spɪl/", "meaning": "làm đổ, tràn ra", "isIrregular": true, "isTransitive": true, "activeObject": "the orange juice", "grade": 7}, {"v1": "spin", "vs": "spins", "v2": "spun", "v3": "spun", "ving": "spinning", "ipaUS": "/spɪn/", "meaning": "quay tròn, kéo sợi", "isIrregular": true, "isTransitive": true, "activeObject": "the wheel", "grade": 8}, {"v1": "spoil", "vs": "spoils", "v2": "spoilt/spoiled", "v3": "spoilt/spoiled", "ving": "spoiling", "ipaUS": "/spɔɪl/", "meaning": "làm hỏng, chiều hư", "isIrregular": true, "isTransitive": true, "activeObject": "the surprise", "grade": 8}, {"v1": "spring", "vs": "springs", "v2": "sprang", "v3": "sprung", "ving": "springing", "ipaUS": "/sprɪŋ/", "meaning": "bật nhảy, nảy ra", "isIrregular": true, "isTransitive": false, "activeObject": "into action", "grade": 10}, {"v1": "steal", "vs": "steals", "v2": "stole", "v3": "stolen", "ving": "stealing", "ipaUS": "/stiːl/", "meaning": "đánh cắp, lấy trộm", "isIrregular": true, "isTransitive": true, "activeObject": "the spotlight", "grade": 6}, {"v1": "stick", "vs": "sticks", "v2": "stuck", "v3": "stuck", "ving": "sticking", "ipaUS": "/stɪk/", "meaning": "dán, gắn chặt", "isIrregular": true, "isTransitive": true, "activeObject": "the label on the box", "grade": 6}, {"v1": "sting", "vs": "stings", "v2": "stung", "v3": "stung", "ving": "stinging", "ipaUS": "/stɪŋ/", "meaning": "đốt, chích (côn trùng)", "isIrregular": true, "isTransitive": true, "activeObject": "the careless hiker", "grade": 8}, {"v1": "strike", "vs": "strikes", "v2": "struck", "v3": "struck", "ving": "striking", "ipaUS": "/straɪk/", "meaning": "đánh, điểm (giờ), đình công", "isIrregular": true, "isTransitive": true, "activeObject": "a balance", "grade": 9}, {"v1": "strive", "vs": "strives", "v2": "strove", "v3": "striven", "ving": "striving", "ipaUS": "/straɪv/", "meaning": "phấn đấu, nỗ lực hết mình", "isIrregular": true, "isTransitive": false, "activeObject": "for excellence", "grade": 11}, {"v1": "swear", "vs": "swears", "v2": "swore", "v3": "sworn", "ving": "swearing", "ipaUS": "/sweər/", "meaning": "thề, tuyên thệ", "isIrregular": true, "isTransitive": true, "activeObject": "loyalty", "grade": 9}, {"v1": "sweep", "vs": "sweeps", "v2": "swept", "v3": "swept", "ving": "sweeping", "ipaUS": "/swiːp/", "meaning": "quét dọn, càn quét", "isIrregular": true, "isTransitive": true, "activeObject": "the classroom floor", "grade": 4}, {"v1": "swell", "vs": "swells", "v2": "swelled", "v3": "swollen/swelled", "ving": "swelling", "ipaUS": "/swel/", "meaning": "phồng lên, sưng lên, dâng cao", "isIrregular": true, "isTransitive": false, "activeObject": "with pride", "grade": 10}, {"v1": "swing", "vs": "swings", "v2": "swung", "v3": "swung", "ving": "swinging", "ipaUS": "/swɪŋ/", "meaning": "đung đưa, vung lên", "isIrregular": true, "isTransitive": true, "activeObject": "the tennis racket", "grade": 7}, {"v1": "tear", "vs": "tears", "v2": "tore", "v3": "torn", "ving": "tearing", "ipaUS": "/teər/", "meaning": "xé, làm rách", "isIrregular": true, "isTransitive": true, "activeObject": "the old envelope", "grade": 7}, {"v1": "thrive", "vs": "thrives", "v2": "throve/thrived", "v3": "thriven/thrived", "ving": "thriving", "ipaUS": "/θraɪv/", "meaning": "phát triển thịnh vượng", "isIrregular": true, "isTransitive": false, "activeObject": "in the digital era", "grade": 11}, {"v1": "tread", "vs": "treads", "v2": "trod", "v3": "trodden", "ving": "treading", "ipaUS": "/tred/", "meaning": "bước đi, giẫm lên", "isIrregular": true, "isTransitive": false, "activeObject": "carefully", "grade": 12}, {"v1": "undergo", "vs": "undergoes", "v2": "underwent", "v3": "undergone", "ving": "undergoing", "ipaUS": "/ˌʌndəˈɡəʊ/", "meaning": "trải qua (thay đổi, phẫu thuật)", "isIrregular": true, "isTransitive": true, "activeObject": "a major transformation", "grade": 11}, {"v1": "undertake", "vs": "undertakes", "v2": "undertook", "v3": "undertaken", "ving": "undertaking", "ipaUS": "/ˌʌndəˈteɪk/", "meaning": "đảm nhận, cam kết thực hiện", "isIrregular": true, "isTransitive": true, "activeObject": "the scientific mission", "grade": 11}, {"v1": "upset", "vs": "upsets", "v2": "upset", "v3": "upset", "ving": "upsetting", "ipaUS": "/ʌpˈset/", "meaning": "làm buồn lòng, làm đảo lộn", "isIrregular": true, "isTransitive": true, "activeObject": "the schedule", "grade": 8}, {"v1": "wake", "vs": "wakes", "v2": "woke", "v3": "woken", "ving": "waking", "ipaUS": "/weɪk/", "meaning": "thức dậy, đánh thức", "isIrregular": true, "isTransitive": true, "activeObject": "the children", "grade": 3}, {"v1": "weave", "vs": "weaves", "v2": "wove", "v3": "woven", "ving": "weaving", "ipaUS": "/wiːv/", "meaning": "dệt, đan lát", "isIrregular": true, "isTransitive": true, "activeObject": "traditional silk", "grade": 8}, {"v1": "weep", "vs": "weeps", "v2": "wept", "v3": "wept", "ving": "weeping", "ipaUS": "/wiːp/", "meaning": "khóc, rơi lệ", "isIrregular": true, "isTransitive": false, "activeObject": "with joy", "grade": 11}, {"v1": "wind", "vs": "winds", "v2": "wound", "v3": "wound", "ving": "winding", "ipaUS": "/waɪnd/", "meaning": "quấn, lên dây cót, uốn lượn", "isIrregular": true, "isTransitive": true, "activeObject": "the vintage clock", "grade": 9}, {"v1": "withdraw", "vs": "withdraws", "v2": "withdrew", "v3": "withdrawn", "ving": "withdrawing", "ipaUS": "/wɪðˈdrɔː/", "meaning": "rút (tiền), rút lui", "isIrregular": true, "isTransitive": true, "activeObject": "cash from the ATM", "grade": 10}, {"v1": "withstand", "vs": "withstands", "v2": "withstood", "v3": "withstood", "ving": "withstanding", "ipaUS": "/wɪðˈstænd/", "meaning": "chống chịu, chịu đựng được", "isIrregular": true, "isTransitive": true, "activeObject": "extreme pressure", "grade": 12}, {"v1": "wring", "vs": "wrings", "v2": "wrung", "v3": "wrung", "ving": "wringing", "ipaUS": "/rɪŋ/", "meaning": "vắt khô, siết chặt", "isIrregular": true, "isTransitive": true, "activeObject": "the wet towel", "grade": 10}, {"v1": "forget", "vs": "forgets", "v2": "forgot", "v3": "forgotten", "ving": "forgetting", "ipaUS": "/fəˈɡet/", "meaning": "quên", "isIrregular": true, "isTransitive": true, "activeObject": "the password", "grade": 4}, {"v1": "say", "vs": "says", "v2": "said", "v3": "said", "ving": "saying", "ipaUS": "/seɪ/", "meaning": "nói ra, phát biểu", "isIrregular": true, "isTransitive": true, "activeObject": "the truth", "grade": 2}, {"v1": "study", "vs": "studies", "v2": "studied", "v3": "studied", "ving": "studying", "ipaUS": "/ˈstʌdi/", "meaning": "học tập, nghiên cứu", "isIrregular": false, "isTransitive": true, "activeObject": "English grammar", "grade": 3}, {"v1": "play", "vs": "plays", "v2": "played", "v3": "played", "ving": "playing", "ipaUS": "/pleɪ/", "meaning": "chơi, biểu diễn (nhạc cụ)", "isIrregular": false, "isTransitive": true, "activeObject": "the piano", "grade": 1}, {"v1": "listen", "vs": "listens", "v2": "listened", "v3": "listened", "ving": "listening", "ipaUS": "/ˈlɪs.ən/", "meaning": "lắng nghe", "isIrregular": false, "isTransitive": false, "activeObject": "to the podcast", "grade": 1}, {"v1": "watch", "vs": "watches", "v2": "watched", "v3": "watched", "ving": "watching", "ipaUS": "/wɒtʃ/", "meaning": "xem, quan sát", "isIrregular": false, "isTransitive": true, "activeObject": "a documentary", "grade": 2}, {"v1": "clean", "vs": "cleans", "v2": "cleaned", "v3": "cleaned", "ving": "cleaning", "ipaUS": "/kliːn/", "meaning": "dọn dẹp, làm sạch", "isIrregular": false, "isTransitive": true, "activeObject": "the classroom", "grade": 2}, {"v1": "cook", "vs": "cooks", "v2": "cooked", "v3": "cooked", "ving": "cooking", "ipaUS": "/kʊk/", "meaning": "nấu ăn, chế biến", "isIrregular": false, "isTransitive": true, "activeObject": "dinner", "grade": 3}, {"v1": "wash", "vs": "washes", "v2": "washed", "v3": "washed", "ving": "washing", "ipaUS": "/wɒʃ/", "meaning": "rửa, giặt giũ", "isIrregular": false, "isTransitive": true, "activeObject": "the dishes", "grade": 2}, {"v1": "open", "vs": "opens", "v2": "opened", "v3": "opened", "ving": "opening", "ipaUS": "/ˈəʊ.pən/", "meaning": "mở ra, khai trương", "isIrregular": false, "isTransitive": true, "activeObject": "the gate", "grade": 1}, {"v1": "close", "vs": "closes", "v2": "closed", "v3": "closed", "ving": "closing", "ipaUS": "/kləʊz/", "meaning": "đóng lại, kết thúc", "isIrregular": false, "isTransitive": true, "activeObject": "the notebook", "grade": 1}, {"v1": "walk", "vs": "walks", "v2": "walked", "v3": "walked", "ving": "walking", "ipaUS": "/wɔːk/", "meaning": "đi bộ, tản bộ", "isIrregular": false, "isTransitive": false, "activeObject": "to the library", "grade": 1}, {"v1": "jump", "vs": "jumps", "v2": "jumped", "v3": "jumped", "ving": "jumping", "ipaUS": "/dʒʌmp/", "meaning": "nhảy lên, bật cao", "isIrregular": false, "isTransitive": false, "activeObject": "over the puddle", "grade": 1}, {"v1": "dance", "vs": "dances", "v2": "danced", "v3": "danced", "ving": "dancing", "ipaUS": "/dɑːns/", "meaning": "nhảy múa, khiêu vũ", "isIrregular": false, "isTransitive": false, "activeObject": "on the stage", "grade": 1}, {"v1": "talk", "vs": "talks", "v2": "talked", "v3": "talked", "ving": "talking", "ipaUS": "/tɔːk/", "meaning": "trò chuyện, trao đổi", "isIrregular": false, "isTransitive": false, "activeObject": "with the teacher", "grade": 2}, {"v1": "ask", "vs": "asks", "v2": "asked", "v3": "asked", "ving": "asking", "ipaUS": "/ɑːsk/", "meaning": "hỏi, yêu cầu", "isIrregular": false, "isTransitive": true, "activeObject": "a smart question", "grade": 2}, {"v1": "answer", "vs": "answers", "v2": "answered", "v3": "answered", "ving": "answering", "ipaUS": "/ˈɑːn.sər/", "meaning": "trả lời, giải đáp", "isIrregular": false, "isTransitive": true, "activeObject": "the question", "grade": 2}, {"v1": "help", "vs": "helps", "v2": "helped", "v3": "helped", "ving": "helping", "ipaUS": "/help/", "meaning": "giúp đỡ, hỗ trợ", "isIrregular": false, "isTransitive": true, "activeObject": "the community", "grade": 2}, {"v1": "love", "vs": "loves", "v2": "loved", "v3": "loved", "ving": "loving", "ipaUS": "/lʌv/", "meaning": "yêu thương, yêu thích", "isIrregular": false, "isTransitive": true, "activeObject": "nature", "grade": 1}, {"v1": "like", "vs": "likes", "v2": "liked", "v3": "liked", "ving": "liking", "ipaUS": "/laɪk/", "meaning": "thích, mến", "isIrregular": false, "isTransitive": true, "activeObject": "science fiction", "grade": 1}, {"v1": "want", "vs": "wants", "v2": "wanted", "v3": "wanted", "ving": "wanting", "ipaUS": "/wɒnt/", "meaning": "muốn, mong muốn", "isIrregular": false, "isTransitive": true, "activeObject": "a new dictionary", "grade": 2}, {"v1": "need", "vs": "needs", "v2": "needed", "v3": "needed", "ving": "needing", "ipaUS": "/niːd/", "meaning": "cần, đòi hỏi", "isIrregular": false, "isTransitive": true, "activeObject": "more information", "grade": 3}, {"v1": "live", "vs": "lives", "v2": "lived", "v3": "lived", "ving": "living", "ipaUS": "/lɪv/", "meaning": "sống, cư trú", "isIrregular": false, "isTransitive": false, "activeObject": "in Hanoi", "grade": 3}, {"v1": "work", "vs": "works", "v2": "worked", "v3": "worked", "ving": "working", "ipaUS": "/wɜːk/", "meaning": "làm việc, hoạt động", "isIrregular": false, "isTransitive": false, "activeObject": "in a laboratory", "grade": 4}, {"v1": "visit", "vs": "visits", "v2": "visited", "v3": "visited", "ving": "visiting", "ipaUS": "/ˈvɪz.ɪt/", "meaning": "thăm, ghé thăm", "isIrregular": false, "isTransitive": true, "activeObject": "the museum", "grade": 4}, {"v1": "travel", "vs": "travels", "v2": "travelled", "v3": "travelled", "ving": "travelling", "ipaUS": "/ˈtræv.əl/", "meaning": "du lịch, di chuyển", "isIrregular": false, "isTransitive": false, "activeObject": "around the world", "grade": 5}, {"v1": "arrive", "vs": "arrives", "v2": "arrived", "v3": "arrived", "ving": "arriving", "ipaUS": "/əˈraɪv/", "meaning": "đến nơi, đạt tới", "isIrregular": false, "isTransitive": false, "activeObject": "at the station", "grade": 5}, {"v1": "start", "vs": "starts", "v2": "started", "v3": "started", "ving": "starting", "ipaUS": "/stɑːt/", "meaning": "bắt đầu, khởi động", "isIrregular": false, "isTransitive": true, "activeObject": "the engine", "grade": 3}, {"v1": "finish", "vs": "finishes", "v2": "finished", "v3": "finished", "ving": "finishing", "ipaUS": "/ˈfɪn.ɪʃ/", "meaning": "hoàn thành, kết thúc", "isIrregular": false, "isTransitive": true, "activeObject": "the assignment", "grade": 4}, {"v1": "enjoy", "vs": "enjoys", "v2": "enjoyed", "v3": "enjoyed", "ving": "enjoying", "ipaUS": "/ɪnˈdʒɔɪ/", "meaning": "tận hưởng, yêu thích", "isIrregular": false, "isTransitive": true, "activeObject": "the festival", "grade": 4}, {"v1": "invite", "vs": "invites", "v2": "invited", "v3": "invited", "ving": "inviting", "ipaUS": "/ɪnˈvaɪt/", "meaning": "mời, trân trọng mời", "isIrregular": false, "isTransitive": true, "activeObject": "all classmates", "grade": 4}, {"v1": "celebrate", "vs": "celebrates", "v2": "celebrated", "v3": "celebrated", "ving": "celebrating", "ipaUS": "/ˈsel.ə.breɪt/", "meaning": "kỷ niệm, ăn mừng", "isIrregular": false, "isTransitive": true, "activeObject": "Teachers' Day", "grade": 5}, {"v1": "decorate", "vs": "decorates", "v2": "decorated", "v3": "decorated", "ving": "decorating", "ipaUS": "/ˈdek.ə.reɪt/", "meaning": "trang trí, tô điểm", "isIrregular": false, "isTransitive": true, "activeObject": "the living room", "grade": 5}, {"v1": "collect", "vs": "collects", "v2": "collected", "v3": "collected", "ving": "collecting", "ipaUS": "/kəˈlekt/", "meaning": "sưu tầm, thu thập", "isIrregular": false, "isTransitive": true, "activeObject": "rare stamps", "grade": 4}, {"v1": "plant", "vs": "plants", "v2": "planted", "v3": "planted", "ving": "planting", "ipaUS": "/plɑːnt/", "meaning": "trồng (cây), gieo trồng", "isIrregular": false, "isTransitive": true, "activeObject": "green trees", "grade": 4}, {"v1": "water", "vs": "waters", "v2": "watered", "v3": "watered", "ving": "watering", "ipaUS": "/ˈwɔː.tər/", "meaning": "tưới nước", "isIrregular": false, "isTransitive": true, "activeObject": "the flower garden", "grade": 3}, {"v1": "paint", "vs": "paints", "v2": "painted", "v3": "painted", "ving": "painting", "ipaUS": "/peɪnt/", "meaning": "sơn, vẽ màu", "isIrregular": false, "isTransitive": true, "activeObject": "a landscape", "grade": 2}, {"v1": "count", "vs": "counts", "v2": "counted", "v3": "counted", "ving": "counting", "ipaUS": "/kaʊnt/", "meaning": "đếm, tính toán", "isIrregular": false, "isTransitive": true, "activeObject": "the stars", "grade": 1}, {"v1": "point", "vs": "points", "v2": "pointed", "v3": "pointed", "ving": "pointing", "ipaUS": "/pɔɪnt/", "meaning": "chỉ trỏ, hướng vào", "isIrregular": false, "isTransitive": false, "activeObject": "at the map", "grade": 1}, {"v1": "smile", "vs": "smiles", "v2": "smiled", "v3": "smiled", "ving": "smiling", "ipaUS": "/smaɪl/", "meaning": "mỉm cười", "isIrregular": false, "isTransitive": false, "activeObject": "happily", "grade": 2}, {"v1": "laugh", "vs": "laughs", "v2": "laughed", "v3": "laughed", "ving": "laughing", "ipaUS": "/lɑːf/", "meaning": "cười vang", "isIrregular": false, "isTransitive": false, "activeObject": "at the joke", "grade": 3}, {"v1": "cry", "vs": "cries", "v2": "cried", "v3": "cried", "ving": "crying", "ipaUS": "/kraɪ/", "meaning": "khóc, kêu lên", "isIrregular": false, "isTransitive": false, "activeObject": "loudly", "grade": 2}, {"v1": "call", "vs": "calls", "v2": "called", "v3": "called", "ving": "calling", "ipaUS": "/kɔːl/", "meaning": "gọi điện, gọi tên", "isIrregular": false, "isTransitive": true, "activeObject": "the doctor", "grade": 3}, {"v1": "wait", "vs": "waits", "v2": "waited", "v3": "waited", "ving": "waiting", "ipaUS": "/weɪt/", "meaning": "chờ đợi", "isIrregular": false, "isTransitive": false, "activeObject": "for the train", "grade": 4}, {"v1": "use", "vs": "uses", "v2": "used", "v3": "used", "ving": "using", "ipaUS": "/juːz/", "meaning": "sử dụng, dùng", "isIrregular": false, "isTransitive": true, "activeObject": "a computer", "grade": 3}, {"v1": "share", "vs": "shares", "v2": "shared", "v3": "shared", "ving": "sharing", "ipaUS": "/ʃeər/", "meaning": "chia sẻ, san sẻ", "isIrregular": false, "isTransitive": true, "activeObject": "the books", "grade": 3}, {"v1": "practise", "vs": "practises", "v2": "practised", "v3": "practised", "ving": "practising", "ipaUS": "/ˈpræk.tɪs/", "meaning": "luyện tập, thực hành", "isIrregular": false, "isTransitive": true, "activeObject": "pronunciation", "grade": 5}, {"v1": "remember", "vs": "remembers", "v2": "remembered", "v3": "remembered", "ving": "remembering", "ipaUS": "/rɪˈmem.bər/", "meaning": "nhớ, ghi nhớ", "isIrregular": false, "isTransitive": true, "activeObject": "the vocabulary", "grade": 4}, {"v1": "check", "vs": "checks", "v2": "checked", "v3": "checked", "ving": "checking", "ipaUS": "/tʃek/", "meaning": "kiểm tra, rà soát", "isIrregular": false, "isTransitive": true, "activeObject": "the spelling", "grade": 4}, {"v1": "repeat", "vs": "repeats", "v2": "repeated", "v3": "repeated", "ving": "repeating", "ipaUS": "/rɪˈpiːt/", "meaning": "lặp lại, nhắc lại", "isIrregular": false, "isTransitive": true, "activeObject": "the sentence", "grade": 3}, {"v1": "complete", "vs": "completes", "v2": "completed", "v3": "completed", "ving": "completing", "ipaUS": "/kəmˈpliːt/", "meaning": "hoàn thiện, điền đầy đủ", "isIrregular": false, "isTransitive": true, "activeObject": "the table", "grade": 4}, {"v1": "match", "vs": "matches", "v2": "matched", "v3": "matched", "ving": "matching", "ipaUS": "/mætʃ/", "meaning": "nối, ghép cặp", "isIrregular": false, "isTransitive": true, "activeObject": "the headings", "grade": 3}, {"v1": "recycle", "vs": "recycles", "v2": "recycled", "v3": "recycled", "ving": "recycling", "ipaUS": "/ˌriːˈsaɪ.kəl/", "meaning": "tái chế", "isIrregular": false, "isTransitive": true, "activeObject": "plastic bottles", "grade": 6}, {"v1": "protect", "vs": "protects", "v2": "protected", "v3": "protected", "ving": "protecting", "ipaUS": "/prəˈtekt/", "meaning": "bảo vệ, che chở", "isIrregular": false, "isTransitive": true, "activeObject": "the environment", "grade": 6}, {"v1": "reduce", "vs": "reduces", "v2": "reduced", "v3": "reduced", "ving": "reducing", "ipaUS": "/rɪˈdjuːs/", "meaning": "cắt giảm, thu nhỏ", "isIrregular": false, "isTransitive": true, "activeObject": "carbon emissions", "grade": 6}, {"v1": "reuse", "vs": "reuses", "v2": "reused", "v3": "reused", "ving": "reusing", "ipaUS": "/ˌriːˈjuːz/", "meaning": "tái sử dụng", "isIrregular": false, "isTransitive": true, "activeObject": "glass jars", "grade": 6}, {"v1": "pollute", "vs": "pollutes", "v2": "polluted", "v3": "polluted", "ving": "polluting", "ipaUS": "/pəˈluːt/", "meaning": "gây ô nhiễm", "isIrregular": false, "isTransitive": true, "activeObject": "the river", "grade": 7}, {"v1": "donate", "vs": "donates", "v2": "donated", "v3": "donated", "ving": "donating", "ipaUS": "/dəʊˈneɪt/", "meaning": "quyên góp, hiến tặng", "isIrregular": false, "isTransitive": true, "activeObject": "books and clothes", "grade": 7}, {"v1": "volunteer", "vs": "volunteers", "v2": "volunteered", "v3": "volunteered", "ving": "volunteering", "ipaUS": "/ˌvɒl.ənˈtɪər/", "meaning": "tình nguyện tham gia", "isIrregular": false, "isTransitive": false, "activeObject": "at the shelter", "grade": 7}, {"v1": "provide", "vs": "provides", "v2": "provided", "v3": "provided", "ving": "providing", "ipaUS": "/prəˈvaɪd/", "meaning": "cung cấp, chu cấp", "isIrregular": false, "isTransitive": true, "activeObject": "clean water", "grade": 7}, {"v1": "support", "vs": "supports", "v2": "supported", "v3": "supported", "ving": "supporting", "ipaUS": "/səˈpɔːt/", "meaning": "ủng hộ, hỗ trợ", "isIrregular": false, "isTransitive": true, "activeObject": "local artisans", "grade": 8}, {"v1": "organize", "vs": "organizes", "v2": "organized", "v3": "organized", "ving": "organizing", "ipaUS": "/ˈɔː.ɡən.aɪz/", "meaning": "tổ chức, sắp xếp", "isIrregular": false, "isTransitive": true, "activeObject": "a charity fair", "grade": 7}, {"v1": "perform", "vs": "performs", "v2": "performed", "v3": "performed", "ving": "performing", "ipaUS": "/pəˈfɔːm/", "meaning": "biểu diễn, thực hiện", "isIrregular": false, "isTransitive": true, "activeObject": "a folk dance", "grade": 7}, {"v1": "discover", "vs": "discovers", "v2": "discovered", "v3": "discovered", "ving": "discovering", "ipaUS": "/dɪˈskʌv.ər/", "meaning": "khám phá, phát hiện", "isIrregular": false, "isTransitive": true, "activeObject": "a hidden cave", "grade": 8}, {"v1": "explore", "vs": "explores", "v2": "explored", "v3": "explored", "ving": "exploring", "ipaUS": "/ɪkˈsplɔːr/", "meaning": "thám hiểm, tìm tòi", "isIrregular": false, "isTransitive": true, "activeObject": "the coral reef", "grade": 8}, {"v1": "invent", "vs": "invents", "v2": "invented", "v3": "invented", "ving": "inventing", "ipaUS": "/ɪnˈvent/", "meaning": "phát minh, sáng chế", "isIrregular": false, "isTransitive": true, "activeObject": "a smart robot", "grade": 8}, {"v1": "develop", "vs": "develops", "v2": "developed", "v3": "developed", "ving": "developing", "ipaUS": "/dɪˈvel.əp/", "meaning": "phát triển, xây dựng", "isIrregular": false, "isTransitive": true, "activeObject": "green technology", "grade": 8}, {"v1": "communicate", "vs": "communicates", "v2": "communicated", "v3": "communicated", "ving": "communicating", "ipaUS": "/kəˈmjuː.nɪ.keɪt/", "meaning": "giao tiếp, truyền đạt", "isIrregular": false, "isTransitive": false, "activeObject": "via holographic video", "grade": 8}, {"v1": "connect", "vs": "connects", "v2": "connected", "v3": "connected", "ving": "connecting", "ipaUS": "/kəˈnekt/", "meaning": "kết nối, liên kết", "isIrregular": false, "isTransitive": true, "activeObject": "the devices", "grade": 8}, {"v1": "upload", "vs": "uploads", "v2": "uploaded", "v3": "uploaded", "ving": "uploading", "ipaUS": "/ʌpˈləʊd/", "meaning": "tải lên (mạng)", "isIrregular": false, "isTransitive": true, "activeObject": "the project file", "grade": 8}, {"v1": "download", "vs": "downloads", "v2": "downloaded", "v3": "downloaded", "ving": "downloading", "ipaUS": "/ˌdaʊnˈləʊd/", "meaning": "tải xuống", "isIrregular": false, "isTransitive": true, "activeObject": "the learning app", "grade": 8}, {"v1": "browse", "vs": "browses", "v2": "browsed", "v3": "browsed", "ving": "browsing", "ipaUS": "/braʊz/", "meaning": "duyệt (web), xem lướt", "isIrregular": false, "isTransitive": true, "activeObject": "the online library", "grade": 8}, {"v1": "preserve", "vs": "preserves", "v2": "preserved", "v3": "preserved", "ving": "preserving", "ipaUS": "/prɪˈzɜːv/", "meaning": "bảo tồn, giữ gìn", "isIrregular": false, "isTransitive": true, "activeObject": "cultural heritage", "grade": 9}, {"v1": "conserve", "vs": "conserves", "v2": "conserved", "v3": "conserved", "ving": "conserving", "ipaUS": "/kənˈsɜːv/", "meaning": "bảo tồn (tài nguyên)", "isIrregular": false, "isTransitive": true, "activeObject": "wildlife habitats", "grade": 9}, {"v1": "restore", "vs": "restores", "v2": "restored", "v3": "restored", "ving": "restoring", "ipaUS": "/rɪˈstɔːr/", "meaning": "trùng tu, khôi phục", "isIrregular": false, "isTransitive": true, "activeObject": "the ancient temple", "grade": 9}, {"v1": "recognize", "vs": "recognizes", "v2": "recognized", "v3": "recognized", "ving": "recognizing", "ipaUS": "/ˈrek.əɡ.naɪz/", "meaning": "công nhận, nhận ra", "isIrregular": false, "isTransitive": true, "activeObject": "the monument", "grade": 9}, {"v1": "recommend", "vs": "recommends", "v2": "recommended", "v3": "recommended", "ving": "recommending", "ipaUS": "/ˌrek.əˈmend/", "meaning": "đề xuất, giới thiệu", "isIrregular": false, "isTransitive": true, "activeObject": "this guidebook", "grade": 9}, {"v1": "suggest", "vs": "suggests", "v2": "suggested", "v3": "suggested", "ving": "suggesting", "ipaUS": "/səˈdʒest/", "meaning": "gợi ý, đề nghị", "isIrregular": false, "isTransitive": true, "activeObject": "an alternative route", "grade": 9}, {"v1": "advise", "vs": "advises", "v2": "advised", "v3": "advised", "ving": "advising", "ipaUS": "/ədˈvaɪz/", "meaning": "khuyên bảo, tư vấn", "isIrregular": false, "isTransitive": true, "activeObject": "the students", "grade": 9}, {"v1": "persuade", "vs": "persuades", "v2": "persuaded", "v3": "persuaded", "ving": "persuading", "ipaUS": "/pəˈsweɪd/", "meaning": "thuyết phục", "isIrregular": false, "isTransitive": true, "activeObject": "the investors", "grade": 9}, {"v1": "encourage", "vs": "encourages", "v2": "encouraged", "v3": "encouraged", "ving": "encouraging", "ipaUS": "/ɪnˈkʌr.ɪdʒ/", "meaning": "khuyến khích, động viên", "isIrregular": false, "isTransitive": true, "activeObject": "creative thinking", "grade": 8}, {"v1": "improve", "vs": "improves", "v2": "improved", "v3": "improved", "ving": "improving", "ipaUS": "/ɪmˈpruːv/", "meaning": "cải thiện, nâng cao", "isIrregular": false, "isTransitive": true, "activeObject": "speaking skills", "grade": 7}, {"v1": "prepare", "vs": "prepares", "v2": "prepared", "v3": "prepared", "ving": "preparing", "ipaUS": "/prɪˈpeər/", "meaning": "chuẩn bị, soạn sửa", "isIrregular": false, "isTransitive": true, "activeObject": "the presentation", "grade": 6}, {"v1": "discuss", "vs": "discusses", "v2": "discussed", "v3": "discussed", "ving": "discussing", "ipaUS": "/dɪˈskʌs/", "meaning": "thảo luận, bàn bạc", "isIrregular": false, "isTransitive": true, "activeObject": "the action plan", "grade": 7}, {"v1": "explain", "vs": "explains", "v2": "explained", "v3": "explained", "ving": "explaining", "ipaUS": "/ɪkˈspleɪn/", "meaning": "giải thích, làm rõ", "isIrregular": false, "isTransitive": true, "activeObject": "the phenomenon", "grade": 7}, {"v1": "describe", "vs": "describes", "v2": "described", "v3": "described", "ving": "describing", "ipaUS": "/dɪˈskraɪb/", "meaning": "miêu tả, mô tả", "isIrregular": false, "isTransitive": true, "activeObject": "the scenery", "grade": 6}, {"v1": "compare", "vs": "compares", "v2": "compared", "v3": "compared", "ving": "comparing", "ipaUS": "/kəmˈpeər/", "meaning": "so sánh, đối chiếu", "isIrregular": false, "isTransitive": true, "activeObject": "the two models", "grade": 8}, {"v1": "replace", "vs": "replaces", "v2": "replaced", "v3": "replaced", "ving": "replacing", "ipaUS": "/rɪˈpleɪs/", "meaning": "thay thế", "isIrregular": false, "isTransitive": true, "activeObject": "fossil fuels", "grade": 7}, {"v1": "produce", "vs": "produces", "v2": "produced", "v3": "produced", "ving": "producing", "ipaUS": "/prəˈdjuːs/", "meaning": "sản xuất, tạo ra", "isIrregular": false, "isTransitive": true, "activeObject": "solar panels", "grade": 8}, {"v1": "generate", "vs": "generates", "v2": "generated", "v3": "generated", "ving": "generating", "ipaUS": "/ˈdʒen.ə.reɪt/", "meaning": "tạo ra (năng lượng, ý tưởng)", "isIrregular": false, "isTransitive": true, "activeObject": "clean electricity", "grade": 8}, {"v1": "save", "vs": "saves", "v2": "saved", "v3": "saved", "ving": "saving", "ipaUS": "/seɪv/", "meaning": "tiết kiệm, cứu giúp", "isIrregular": false, "isTransitive": true, "activeObject": "energy", "grade": 6}, {"v1": "waste", "vs": "wastes", "v2": "wasted", "v3": "wasted", "ving": "wasting", "ipaUS": "/weɪst/", "meaning": "lãng phí", "isIrregular": false, "isTransitive": true, "activeObject": "drinking water", "grade": 6}, {"v1": "avoid", "vs": "avoids", "v2": "avoided", "v3": "avoided", "ving": "avoiding", "ipaUS": "/əˈvɔɪd/", "meaning": "tránh, ngăn ngừa", "isIrregular": false, "isTransitive": true, "activeObject": "traffic jams", "grade": 7}, {"v1": "obey", "vs": "obeys", "v2": "obeyed", "v3": "obeyed", "ving": "obeying", "ipaUS": "/əˈbeɪ/", "meaning": "tuân thủ, vâng lời", "isIrregular": false, "isTransitive": true, "activeObject": "traffic rules", "grade": 7}, {"v1": "respect", "vs": "respects", "v2": "respected", "v3": "respected", "ving": "respecting", "ipaUS": "/rɪˈspekt/", "meaning": "tôn trọng, kính trọng", "isIrregular": false, "isTransitive": true, "activeObject": "local customs", "grade": 8}, {"v1": "admire", "vs": "admires", "v2": "admired", "v3": "admired", "ving": "admiring", "ipaUS": "/ədˈmaɪər/", "meaning": "ngưỡng mộ, khâm phục", "isIrregular": false, "isTransitive": true, "activeObject": "the scientist", "grade": 8}, {"v1": "attend", "vs": "attends", "v2": "attended", "v3": "attended", "ving": "attending", "ipaUS": "/əˈtend/", "meaning": "tham dự, có mặt", "isIrregular": false, "isTransitive": true, "activeObject": "the workshop", "grade": 8}, {"v1": "participate", "vs": "participates", "v2": "participated", "v3": "participated", "ving": "participating", "ipaUS": "/pɑːˈtɪs.ɪ.peɪt/", "meaning": "tham gia vào", "isIrregular": false, "isTransitive": false, "activeObject": "in the competition", "grade": 8}, {"v1": "compete", "vs": "competes", "v2": "competed", "v3": "competed", "ving": "competing", "ipaUS": "/kəmˈpiːt/", "meaning": "thi đấu, cạnh tranh", "isIrregular": false, "isTransitive": false, "activeObject": "for the gold medal", "grade": 8}, {"v1": "achieve", "vs": "achieves", "v2": "achieved", "v3": "achieved", "ving": "achieving", "ipaUS": "/əˈtʃiːv/", "meaning": "đạt được, giành được", "isIrregular": false, "isTransitive": true, "activeObject": "remarkable results", "grade": 9}, {"v1": "succeed", "vs": "succeeds", "v2": "succeeded", "v3": "succeeded", "ving": "succeeding", "ipaUS": "/səkˈsiːd/", "meaning": "thành công", "isIrregular": false, "isTransitive": false, "activeObject": "in the exam", "grade": 9}, {"v1": "manage", "vs": "manages", "v2": "managed", "v3": "managed", "ving": "managing", "ipaUS": "/ˈmæn.ɪdʒ/", "meaning": "quản lý, xoay xở", "isIrregular": false, "isTransitive": true, "activeObject": "time effectively", "grade": 9}, {"v1": "balance", "vs": "balances", "v2": "balanced", "v3": "balanced", "ving": "balancing", "ipaUS": "/ˈbæl.əns/", "meaning": "cân bằng", "isIrregular": false, "isTransitive": true, "activeObject": "study and relaxation", "grade": 9}, {"v1": "suffer", "vs": "suffers", "v2": "suffered", "v3": "suffered", "ving": "suffering", "ipaUS": "/ˈsʌf.ər/", "meaning": "chịu đựng, mắc phải", "isIrregular": false, "isTransitive": false, "activeObject": "from stress", "grade": 9}, {"v1": "recover", "vs": "recovers", "v2": "recovered", "v3": "recovered", "ving": "recovering", "ipaUS": "/rɪˈkʌv.ər/", "meaning": "hồi phục, bình phục", "isIrregular": false, "isTransitive": false, "activeObject": "from the flu", "grade": 8}, {"v1": "prevent", "vs": "prevents", "v2": "prevented", "v3": "prevented", "ving": "preventing", "ipaUS": "/prɪˈvent/", "meaning": "ngăn chặn, phòng ngừa", "isIrregular": false, "isTransitive": true, "activeObject": "cyberbullying", "grade": 9}, {"v1": "solve", "vs": "solves", "v2": "solved", "v3": "solved", "ving": "solving", "ipaUS": "/sɒlv/", "meaning": "giải quyết, tháo gỡ", "isIrregular": false, "isTransitive": true, "activeObject": "the puzzle", "grade": 7}, {"v1": "affect", "vs": "affects", "v2": "affected", "v3": "affected", "ving": "affecting", "ipaUS": "/əˈfekt/", "meaning": "ảnh hưởng, tác động đến", "isIrregular": false, "isTransitive": true, "activeObject": "crop yields", "grade": 8}, {"v1": "cause", "vs": "causes", "v2": "caused", "v3": "caused", "ving": "causing", "ipaUS": "/kɔːz/", "meaning": "gây ra", "isIrregular": false, "isTransitive": true, "activeObject": "severe flooding", "grade": 8}, {"v1": "destroy", "vs": "destroys", "v2": "destroyed", "v3": "destroyed", "ving": "destroying", "ipaUS": "/dɪˈstrɔɪ/", "meaning": "phá hủy, tàn phá", "isIrregular": false, "isTransitive": true, "activeObject": "the forest", "grade": 8}, {"v1": "damage", "vs": "damages", "v2": "damaged", "v3": "damaged", "ving": "damaging", "ipaUS": "/ˈdæm.ɪdʒ/", "meaning": "làm hư hại", "isIrregular": false, "isTransitive": true, "activeObject": "the infrastructure", "grade": 8}, {"v1": "rescue", "vs": "rescues", "v2": "rescued", "v3": "rescued", "ving": "rescuing", "ipaUS": "/ˈres.kjuː/", "meaning": "giải cứu, cứu hộ", "isIrregular": false, "isTransitive": true, "activeObject": "the villagers", "grade": 8}, {"v1": "warn", "vs": "warns", "v2": "warned", "v3": "warned", "ving": "warning", "ipaUS": "/wɔːn/", "meaning": "cảnh báo", "isIrregular": false, "isTransitive": true, "activeObject": "coastal residents", "grade": 8}, {"v1": "predict", "vs": "predicts", "v2": "predicted", "v3": "predicted", "ving": "predicting", "ipaUS": "/prɪˈdɪkt/", "meaning": "dự đoán, tiên đoán", "isIrregular": false, "isTransitive": true, "activeObject": "the earthquake", "grade": 8}, {"v1": "measure", "vs": "measures", "v2": "measured", "v3": "measured", "ving": "measuring", "ipaUS": "/ˈmeʒ.ər/", "meaning": "đo lường", "isIrregular": false, "isTransitive": true, "activeObject": "the temperature", "grade": 8}, {"v1": "weigh", "vs": "weighs", "v2": "weighed", "v3": "weighed", "ving": "weighing", "ipaUS": "/weɪ/", "meaning": "cân nặng, cân nhắc", "isIrregular": false, "isTransitive": true, "activeObject": "the luggage", "grade": 8}, {"v1": "contain", "vs": "contains", "v2": "contained", "v3": "contained", "ving": "containing", "ipaUS": "/kənˈteɪn/", "meaning": "chứa đựng, bao gồm", "isIrregular": false, "isTransitive": true, "activeObject": "essential vitamins", "grade": 7}, {"v1": "include", "vs": "includes", "v2": "included", "v3": "included", "ving": "including", "ipaUS": "/ɪnˈkluːd/", "meaning": "bao gồm, tính cả", "isIrregular": false, "isTransitive": true, "activeObject": "practical examples", "grade": 7}, {"v1": "consist", "vs": "consists", "v2": "consisted", "v3": "consisted", "ving": "consisting", "ipaUS": "/kənˈsɪst/", "meaning": "bao gồm (consist of)", "isIrregular": false, "isTransitive": false, "activeObject": "of twelve modules", "grade": 9}, {"v1": "belong", "vs": "belongs", "v2": "belonged", "v3": "belonged", "ving": "belonging", "ipaUS": "/bɪˈlɒŋ/", "meaning": "thuộc về", "isIrregular": false, "isTransitive": false, "activeObject": "to the club", "grade": 6}, {"v1": "depend", "vs": "depends", "v2": "depended", "v3": "depended", "ving": "depending", "ipaUS": "/dɪˈpend/", "meaning": "phụ thuộc vào", "isIrregular": false, "isTransitive": false, "activeObject": "on renewable resources", "grade": 9}, {"v1": "rely", "vs": "relies", "v2": "relied", "v3": "relied", "ving": "relying", "ipaUS": "/rɪˈlaɪ/", "meaning": "dựa vào, tin cậy vào", "isIrregular": false, "isTransitive": false, "activeObject": "on public transport", "grade": 9}, {"v1": "focus", "vs": "focuses", "v2": "focused", "v3": "focused", "ving": "focusing", "ipaUS": "/ˈfəʊ.kəs/", "meaning": "tập trung vào", "isIrregular": false, "isTransitive": false, "activeObject": "on the core goal", "grade": 9}, {"v1": "concentrate", "vs": "concentrates", "v2": "concentrated", "v3": "concentrated", "ving": "concentrating", "ipaUS": "/ˈkɒn.sən.treɪt/", "meaning": "tập trung cao độ", "isIrregular": false, "isTransitive": false, "activeObject": "on the lecture", "grade": 9}, {"v1": "apply", "vs": "applies", "v2": "applied", "v3": "applied", "ving": "applying", "ipaUS": "/əˈplaɪ/", "meaning": "ứng tuyển, áp dụng", "isIrregular": false, "isTransitive": true, "activeObject": "the new formula", "grade": 9}, {"v1": "design", "vs": "designs", "v2": "designed", "v3": "designed", "ving": "designing", "ipaUS": "/dɪˈzaɪn/", "meaning": "thiết kế", "isIrregular": false, "isTransitive": true, "activeObject": "the user interface", "grade": 8}, {"v1": "create", "vs": "creates", "v2": "created", "v3": "created", "ving": "creating", "ipaUS": "/kriˈeɪt/", "meaning": "sáng tạo, tạo lập", "isIrregular": false, "isTransitive": true, "activeObject": "a digital portfolio", "grade": 7}, {"v1": "repair", "vs": "repairs", "v2": "repaired", "v3": "repaired", "ving": "repairing", "ipaUS": "/rɪˈpeər/", "meaning": "sửa chữa", "isIrregular": false, "isTransitive": true, "activeObject": "the roof", "grade": 6}, {"v1": "fix", "vs": "fixes", "v2": "fixed", "v3": "fixed", "ving": "fixing", "ipaUS": "/fɪks/", "meaning": "sửa, cố định", "isIrregular": false, "isTransitive": true, "activeObject": "the software bug", "grade": 7}, {"v1": "install", "vs": "installs", "v2": "installed", "v3": "installed", "ving": "installing", "ipaUS": "/ɪnˈstɔːl/", "meaning": "cài đặt, lắp đặt", "isIrregular": false, "isTransitive": true, "activeObject": "the security update", "grade": 8}, {"v1": "operate", "vs": "operates", "v2": "operated", "v3": "operated", "ving": "operating", "ipaUS": "/ˈɒp.ər.eɪt/", "meaning": "vận hành, điều khiển", "isIrregular": false, "isTransitive": true, "activeObject": "the machinery", "grade": 9}, {"v1": "control", "vs": "controls", "v2": "controlled", "v3": "controlled", "ving": "controlling", "ipaUS": "/kənˈtrəʊl/", "meaning": "kiểm soát, điều khiển", "isIrregular": false, "isTransitive": true, "activeObject": "the drone", "grade": 8}, {"v1": "contribute", "vs": "contributes", "v2": "contributed", "v3": "contributed", "ving": "contributing", "ipaUS": "/kənˈtrɪb.juːt/", "meaning": "đóng góp, góp phần", "isIrregular": false, "isTransitive": false, "activeObject": "to global peace", "grade": 10}, {"v1": "dedicate", "vs": "dedicates", "v2": "dedicated", "v3": "dedicated", "ving": "dedicating", "ipaUS": "/ˈded.ɪ.keɪt/", "meaning": "cống hiến, dành trọn", "isIrregular": false, "isTransitive": true, "activeObject": "his life to science", "grade": 10}, {"v1": "devote", "vs": "devotes", "v2": "devoted", "v3": "devoted", "ving": "devoting", "ipaUS": "/dɪˈvəʊt/", "meaning": "hiến dâng, dành hết cho", "isIrregular": false, "isTransitive": true, "activeObject": "resources to education", "grade": 12}, {"v1": "inspire", "vs": "inspires", "v2": "inspired", "v3": "inspired", "ving": "inspiring", "ipaUS": "/ɪnˈspaɪər/", "meaning": "truyền cảm hứng", "isIrregular": false, "isTransitive": true, "activeObject": "the younger generation", "grade": 10}, {"v1": "motivate", "vs": "motivates", "v2": "motivated", "v3": "motivated", "ving": "motivating", "ipaUS": "/ˈməʊ.tɪ.veɪt/", "meaning": "thúc đẩy, tạo động lực", "isIrregular": false, "isTransitive": true, "activeObject": "the whole team", "grade": 10}, {"v1": "stimulate", "vs": "stimulates", "v2": "stimulated", "v3": "stimulated", "ving": "stimulating", "ipaUS": "/ˈstɪm.jʊ.leɪt/", "meaning": "kích thích, khuấy động", "isIrregular": false, "isTransitive": true, "activeObject": "economic growth", "grade": 11}, {"v1": "enhance", "vs": "enhances", "v2": "enhanced", "v3": "enhanced", "ving": "enhancing", "ipaUS": "/ɪnˈhɑːns/", "meaning": "nâng cao, tăng cường", "isIrregular": false, "isTransitive": true, "activeObject": "system performance", "grade": 11}, {"v1": "boost", "vs": "boosts", "v2": "boosted", "v3": "boosted", "ving": "boosting", "ipaUS": "/buːst/", "meaning": "thúc đẩy mạnh, gia tăng", "isIrregular": false, "isTransitive": true, "activeObject": "productivity", "grade": 10}, {"v1": "promote", "vs": "promotes", "v2": "promoted", "v3": "promoted", "ving": "promoting", "ipaUS": "/prəˈməʊt/", "meaning": "thúc đẩy, quảng bá, thăng chức", "isIrregular": false, "isTransitive": true, "activeObject": "sustainable tourism", "grade": 10}, {"v1": "strengthen", "vs": "strengthens", "v2": "strengthened", "v3": "strengthened", "ving": "strengthening", "ipaUS": "/ˈstreŋ.θən/", "meaning": "củng cố, làm vững mạnh", "isIrregular": false, "isTransitive": true, "activeObject": "regional cooperation", "grade": 11}, {"v1": "expand", "vs": "expands", "v2": "expanded", "v3": "expanded", "ving": "expanding", "ipaUS": "/ɪkˈspænd/", "meaning": "mở rộng", "isIrregular": false, "isTransitive": true, "activeObject": "the vocabulary bank", "grade": 10}, {"v1": "extend", "vs": "extends", "v2": "extended", "v3": "extended", "ving": "extending", "ipaUS": "/ɪkˈstend/", "meaning": "kéo dài, mở rộng", "isIrregular": false, "isTransitive": true, "activeObject": "the deadline", "grade": 10}, {"v1": "broaden", "vs": "broadens", "v2": "broadened", "v3": "broadened", "ving": "broadening", "ipaUS": "/ˈbrɔː.dən/", "meaning": "mở mang (tầm nhìn, kiến thức)", "isIrregular": false, "isTransitive": true, "activeObject": "our horizons", "grade": 11}, {"v1": "widen", "vs": "widens", "v2": "widened", "v3": "widened", "ving": "widening", "ipaUS": "/ˈwaɪ.dən/", "meaning": "mở rộng (đường sá, khoảng cách)", "isIrregular": false, "isTransitive": true, "activeObject": "the highway", "grade": 10}, {"v1": "maintain", "vs": "maintains", "v2": "maintained", "v3": "maintained", "ving": "maintaining", "ipaUS": "/meɪnˈteɪn/", "meaning": "duy trì, bảo trì", "isIrregular": false, "isTransitive": true, "activeObject": "eye contact", "grade": 10}, {"v1": "sustain", "vs": "sustains", "v2": "sustained", "v3": "sustained", "ving": "sustaining", "ipaUS": "/səˈsteɪn/", "meaning": "duy trì bền vững, chống đỡ", "isIrregular": false, "isTransitive": true, "activeObject": "marine ecosystems", "grade": 11}, {"v1": "retain", "vs": "retains", "v2": "retained", "v3": "retained", "ving": "retaining", "ipaUS": "/rɪˈteɪn/", "meaning": "giữ lại, lưu giữ", "isIrregular": false, "isTransitive": true, "activeObject": "key information", "grade": 11}, {"v1": "obtain", "vs": "obtains", "v2": "obtained", "v3": "obtained", "ving": "obtaining", "ipaUS": "/əbˈteɪn/", "meaning": "đạt được, thu được", "isIrregular": false, "isTransitive": true, "activeObject": "a scholarship", "grade": 11}, {"v1": "acquire", "vs": "acquires", "v2": "acquired", "v3": "acquired", "ving": "acquiring", "ipaUS": "/əˈkwaɪər/", "meaning": "tiếp thu, đạt được (kỹ năng)", "isIrregular": false, "isTransitive": true, "activeObject": "digital literacy", "grade": 12}, {"v1": "attain", "vs": "attains", "v2": "attained", "v3": "attained", "ving": "attaining", "ipaUS": "/əˈteɪn/", "meaning": "đạt tới (trình độ, mục tiêu)", "isIrregular": false, "isTransitive": true, "activeObject": "fluency in English", "grade": 12}, {"v1": "pursue", "vs": "pursues", "v2": "pursued", "v3": "pursued", "ving": "pursuing", "ipaUS": "/pəˈsjuː/", "meaning": "theo đuổi (ước mơ, sự nghiệp)", "isIrregular": false, "isTransitive": true, "activeObject": "higher education", "grade": 11}, {"v1": "accomplish", "vs": "accomplishes", "v2": "accomplished", "v3": "accomplished", "ving": "accomplishing", "ipaUS": "/əˈkʌm.plɪʃ/", "meaning": "hoàn thành xuất sắc", "isIrregular": false, "isTransitive": true, "activeObject": "the mission", "grade": 11}, {"v1": "fulfill", "vs": "fulfills", "v2": "fulfilled", "v3": "fulfilled", "ving": "fulfilling", "ipaUS": "/fʊlˈfɪl/", "meaning": "thực hiện trọn vẹn, đáp ứng", "isIrregular": false, "isTransitive": true, "activeObject": "the requirements", "grade": 12}, {"v1": "implement", "vs": "implements", "v2": "implemented", "v3": "implemented", "ving": "implementing", "ipaUS": "/ˈɪm.plɪ.ment/", "meaning": "triển khai, thi hành", "isIrregular": false, "isTransitive": true, "activeObject": "the new policy", "grade": 11}, {"v1": "execute", "vs": "executes", "v2": "executed", "v3": "executed", "ving": "executing", "ipaUS": "/ˈek.sɪ.kjuːt/", "meaning": "thực thi, thi hành", "isIrregular": false, "isTransitive": true, "activeObject": "the command", "grade": 12}, {"v1": "conduct", "vs": "conducts", "v2": "conducted", "v3": "conducted", "ving": "conducting", "ipaUS": "/kənˈdʌkt/", "meaning": "tiến hành (nghiên cứu, khảo sát)", "isIrregular": false, "isTransitive": true, "activeObject": "a survey", "grade": 10}, {"v1": "carry", "vs": "carries", "v2": "carried", "v3": "carried", "ving": "carrying", "ipaUS": "/ˈkær.i/", "meaning": "mang, vác, tiến hành", "isIrregular": false, "isTransitive": true, "activeObject": "the equipment", "grade": 4}, {"v1": "analyze", "vs": "analyzes", "v2": "analyzed", "v3": "analyzed", "ving": "analyzing", "ipaUS": "/ˈæn.əl.aɪz/", "meaning": "phân tích", "isIrregular": false, "isTransitive": true, "activeObject": "the dataset", "grade": 10}, {"v1": "evaluate", "vs": "evaluates", "v2": "evaluated", "v3": "evaluated", "ving": "evaluating", "ipaUS": "/ɪˈvæl.ju.eɪt/", "meaning": "đánh giá, định giá", "isIrregular": false, "isTransitive": true, "activeObject": "the effectiveness", "grade": 11}, {"v1": "assess", "vs": "assesses", "v2": "assessed", "v3": "assessed", "ving": "assessing", "ipaUS": "/əˈses/", "meaning": "đánh giá, thẩm định", "isIrregular": false, "isTransitive": true, "activeObject": "the environmental impact", "grade": 11}, {"v1": "examine", "vs": "examines", "v2": "examined", "v3": "examined", "ving": "examining", "ipaUS": "/ɪɡˈzæm.ɪn/", "meaning": "kiểm tra kỹ, khảo sát", "isIrregular": false, "isTransitive": true, "activeObject": "the evidence", "grade": 10}, {"v1": "investigate", "vs": "investigates", "v2": "investigated", "v3": "investigated", "ving": "investigating", "ipaUS": "/ɪnˈves.tɪ.ɡeɪt/", "meaning": "điều tra, nghiên cứu sâu", "isIrregular": false, "isTransitive": true, "activeObject": "the incident", "grade": 11}, {"v1": "observe", "vs": "observes", "v2": "observed", "v3": "observed", "ving": "observing", "ipaUS": "/əbˈzɜːv/", "meaning": "quan sát, tuân thủ", "isIrregular": false, "isTransitive": true, "activeObject": "the solar eclipse", "grade": 10}, {"v1": "monitor", "vs": "monitors", "v2": "monitored", "v3": "monitored", "ving": "monitoring", "ipaUS": "/ˈmɒn.ɪ.tər/", "meaning": "giám sát, theo dõi", "isIrregular": false, "isTransitive": true, "activeObject": "air quality", "grade": 11}, {"v1": "identify", "vs": "identifies", "v2": "identified", "v3": "identified", "ving": "identifying", "ipaUS": "/aɪˈden.tɪ.faɪ/", "meaning": "nhận diện, xác định", "isIrregular": false, "isTransitive": true, "activeObject": "the root cause", "grade": 10}, {"v1": "determine", "vs": "determines", "v2": "determined", "v3": "determined", "ving": "determining", "ipaUS": "/dɪˈtɜː.mɪn/", "meaning": "xác định, quyết định", "isIrregular": false, "isTransitive": true, "activeObject": "the exact location", "grade": 11}, {"v1": "define", "vs": "defines", "v2": "defined", "v3": "defined", "ving": "defining", "ipaUS": "/dɪˈfaɪn/", "meaning": "định nghĩa, xác định rõ", "isIrregular": false, "isTransitive": true, "activeObject": "the core concept", "grade": 10}, {"v1": "interpret", "vs": "interprets", "v2": "interpreted", "v3": "interpreted", "ving": "interpreting", "ipaUS": "/ɪnˈtɜː.prɪt/", "meaning": "diễn giải, thông dịch", "isIrregular": false, "isTransitive": true, "activeObject": "the statistics", "grade": 12}, {"v1": "translate", "vs": "translates", "v2": "translated", "v3": "translated", "ving": "translating", "ipaUS": "/trænzˈleɪt/", "meaning": "biên dịch, chuyển ngữ", "isIrregular": false, "isTransitive": true, "activeObject": "the poem", "grade": 8}, {"v1": "illustrate", "vs": "illustrates", "v2": "illustrated", "v3": "illustrated", "ving": "illustrating", "ipaUS": "/ˈɪl.ə.streɪt/", "meaning": "minh họa, làm rõ", "isIrregular": false, "isTransitive": true, "activeObject": "the workflow", "grade": 11}, {"v1": "demonstrate", "vs": "demonstrates", "v2": "demonstrated", "v3": "demonstrated", "ving": "demonstrating", "ipaUS": "/ˈdem.ən.streɪt/", "meaning": "chứng minh, trình diễn", "isIrregular": false, "isTransitive": true, "activeObject": "the prototype", "grade": 11}, {"v1": "indicate", "vs": "indicates", "v2": "indicated", "v3": "indicated", "ving": "indicating", "ipaUS": "/ˈɪn.dɪ.keɪt/", "meaning": "chỉ ra, biểu thị", "isIrregular": false, "isTransitive": true, "activeObject": "a positive trend", "grade": 11}, {"v1": "reveal", "vs": "reveals", "v2": "revealed", "v3": "revealed", "ving": "revealing", "ipaUS": "/rɪˈviːl/", "meaning": "tiết lộ, bộc lộ", "isIrregular": false, "isTransitive": true, "activeObject": "the hidden pattern", "grade": 11}, {"v1": "reflect", "vs": "reflects", "v2": "reflected", "v3": "reflected", "ving": "reflecting", "ipaUS": "/rɪˈflekt/", "meaning": "phản ánh, suy ngẫm", "isIrregular": false, "isTransitive": true, "activeObject": "cultural values", "grade": 10}, {"v1": "represent", "vs": "represents", "v2": "represented", "v3": "represented", "ving": "representing", "ipaUS": "/ˌrep.rɪˈzent/", "meaning": "đại diện, tượng trưng cho", "isIrregular": false, "isTransitive": true, "activeObject": "the school", "grade": 10}, {"v1": "symbolize", "vs": "symbolizes", "v2": "symbolized", "v3": "symbolized", "ving": "symbolizing", "ipaUS": "/ˈsɪm.bəl.aɪz/", "meaning": "biểu tượng hóa", "isIrregular": false, "isTransitive": true, "activeObject": "longevity and peace", "grade": 10}, {"v1": "signify", "vs": "signifies", "v2": "signified", "v3": "signified", "ving": "signifying", "ipaUS": "/ˈsɪɡ.nɪ.faɪ/", "meaning": "biểu thị, có ý nghĩa là", "isIrregular": false, "isTransitive": true, "activeObject": "a major breakthrough", "grade": 12}, {"v1": "emphasize", "vs": "emphasizes", "v2": "emphasized", "v3": "emphasized", "ving": "emphasizing", "ipaUS": "/ˈem.fə.saɪz/", "meaning": "nhấn mạnh", "isIrregular": false, "isTransitive": true, "activeObject": "critical thinking", "grade": 11}, {"v1": "highlight", "vs": "highlights", "v2": "highlighted", "v3": "highlighted", "ving": "highlighting", "ipaUS": "/ˈhaɪ.laɪt/", "meaning": "làm nổi bật, nhấn mạnh", "isIrregular": false, "isTransitive": true, "activeObject": "the key findings", "grade": 10}, {"v1": "stress", "vs": "stresses", "v2": "stressed", "v3": "stressed", "ving": "stressing", "ipaUS": "/stres/", "meaning": "nhấn mạnh, gây căng thẳng", "isIrregular": false, "isTransitive": true, "activeObject": "the importance of safety", "grade": 10}, {"v1": "acknowledge", "vs": "acknowledges", "v2": "acknowledged", "v3": "acknowledged", "ving": "acknowledging", "ipaUS": "/əkˈnɒl.ɪdʒ/", "meaning": "thừa nhận, ghi nhận", "isIrregular": false, "isTransitive": true, "activeObject": "her contribution", "grade": 12}, {"v1": "admit", "vs": "admits", "v2": "admitted", "v3": "admitted", "ving": "admitting", "ipaUS": "/ədˈmɪt/", "meaning": "thừa nhận, nhận vào", "isIrregular": false, "isTransitive": true, "activeObject": "the error", "grade": 10}, {"v1": "deny", "vs": "denies", "v2": "denied", "v3": "denied", "ving": "denying", "ipaUS": "/dɪˈnaɪ/", "meaning": "phủ nhận, từ chối", "isIrregular": false, "isTransitive": true, "activeObject": "the rumor", "grade": 10}, {"v1": "reject", "vs": "rejects", "v2": "rejected", "v3": "rejected", "ving": "rejecting", "ipaUS": "/rɪˈdʒekt/", "meaning": "bác bỏ, từ chối", "isIrregular": false, "isTransitive": true, "activeObject": "the proposal", "grade": 11}, {"v1": "refuse", "vs": "refuses", "v2": "refused", "v3": "refused", "ving": "refusing", "ipaUS": "/rɪˈfjuːz/", "meaning": "từ chối", "isIrregular": false, "isTransitive": true, "activeObject": "the offer", "grade": 9}, {"v1": "accept", "vs": "accepts", "v2": "accepted", "v3": "accepted", "ving": "accepting", "ipaUS": "/əkˈsept/", "meaning": "chấp nhận, đồng ý nhận", "isIrregular": false, "isTransitive": true, "activeObject": "the challenge", "grade": 8}, {"v1": "approve", "vs": "approves", "v2": "approved", "v3": "approved", "ving": "approving", "ipaUS": "/əˈpruːv/", "meaning": "phê duyệt, chấp thuận", "isIrregular": false, "isTransitive": true, "activeObject": "the budget", "grade": 11}, {"v1": "confirm", "vs": "confirms", "v2": "confirmed", "v3": "confirmed", "ving": "confirming", "ipaUS": "/kənˈfɜːm/", "meaning": "xác nhận", "isIrregular": false, "isTransitive": true, "activeObject": "the reservation", "grade": 9}, {"v1": "verify", "vs": "verifies", "v2": "verified", "v3": "verified", "ving": "verifying", "ipaUS": "/ˈver.ɪ.faɪ/", "meaning": "xác minh, kiểm chứng", "isIrregular": false, "isTransitive": true, "activeObject": "the source", "grade": 11}, {"v1": "validate", "vs": "validates", "v2": "validated", "v3": "validated", "ving": "validating", "ipaUS": "/ˈvæl.ɪ.deɪt/", "meaning": "xác thực, chuẩn hóa", "isIrregular": false, "isTransitive": true, "activeObject": "the hypothesis", "grade": 12}, {"v1": "justify", "vs": "justifies", "v2": "justified", "v3": "justified", "ving": "justifying", "ipaUS": "/ˈdʒʌs.tɪ.faɪ/", "meaning": "biện minh, chứng minh là đúng", "isIrregular": false, "isTransitive": true, "activeObject": "the decision", "grade": 12}, {"v1": "clarify", "vs": "clarifies", "v2": "clarified", "v3": "clarified", "ving": "clarifying", "ipaUS": "/ˈklær.ɪ.faɪ/", "meaning": "làm sáng tỏ", "isIrregular": false, "isTransitive": true, "activeObject": "the instruction", "grade": 11}, {"v1": "simplify", "vs": "simplifies", "v2": "simplified", "v3": "simplified", "ving": "simplifying", "ipaUS": "/ˈsɪm.plɪ.faɪ/", "meaning": "đơn giản hóa", "isIrregular": false, "isTransitive": true, "activeObject": "the equation", "grade": 10}, {"v1": "modify", "vs": "modifies", "v2": "modified", "v3": "modified", "ving": "modifying", "ipaUS": "/ˈmɒd.ɪ.faɪ/", "meaning": "sửa đổi, điều chỉnh", "isIrregular": false, "isTransitive": true, "activeObject": "the design", "grade": 11}, {"v1": "adjust", "vs": "adjusts", "v2": "adjusted", "v3": "adjusted", "ving": "adjusting", "ipaUS": "/əˈdʒʌst/", "meaning": "điều chỉnh, thích nghi", "isIrregular": false, "isTransitive": true, "activeObject": "the mirror", "grade": 10}, {"v1": "adapt", "vs": "adapts", "v2": "adapted", "v3": "adapted", "ving": "adapting", "ipaUS": "/əˈdæpt/", "meaning": "thích ứng, phỏng theo", "isIrregular": false, "isTransitive": false, "activeObject": "to the new climate", "grade": 11}, {"v1": "adopt", "vs": "adopts", "v2": "adopted", "v3": "adopted", "ving": "adopting", "ipaUS": "/əˈdɒpt/", "meaning": "áp dụng, nhận nuôi", "isIrregular": false, "isTransitive": true, "activeObject": "a green lifestyle", "grade": 10}, {"v1": "transform", "vs": "transforms", "v2": "transformed", "v3": "transformed", "ving": "transforming", "ipaUS": "/trænsˈfɔːm/", "meaning": "chuyển đổi, biến đổi", "isIrregular": false, "isTransitive": true, "activeObject": "the city skyline", "grade": 11}, {"v1": "convert", "vs": "converts", "v2": "converted", "v3": "converted", "ving": "converting", "ipaUS": "/kənˈvɜːt/", "meaning": "chuyển đổi (định dạng, năng lượng)", "isIrregular": false, "isTransitive": true, "activeObject": "sunlight into power", "grade": 11}, {"v1": "alter", "vs": "alters", "v2": "altered", "v3": "altered", "ving": "altering", "ipaUS": "/ˈɔːl.tər/", "meaning": "thay đổi, biến đổi", "isIrregular": false, "isTransitive": true, "activeObject": "the itinerary", "grade": 11}, {"v1": "shift", "vs": "shifts", "v2": "shifted", "v3": "shifted", "ving": "shifting", "ipaUS": "/ʃɪft/", "meaning": "dịch chuyển, chuyển hướng", "isIrregular": false, "isTransitive": true, "activeObject": "the focus", "grade": 11}, {"v1": "switch", "vs": "switches", "v2": "switched", "v3": "switched", "ving": "switching", "ipaUS": "/swɪtʃ/", "meaning": "chuyển đổi, bật/tắt", "isIrregular": false, "isTransitive": true, "activeObject": "the channel", "grade": 8}, {"v1": "exchange", "vs": "exchanges", "v2": "exchanged", "v3": "exchanged", "ving": "exchanging", "ipaUS": "/ɪksˈtʃeɪndʒ/", "meaning": "trao đổi, đổi tiền", "isIrregular": false, "isTransitive": true, "activeObject": "contact details", "grade": 8}, {"v1": "interact", "vs": "interacts", "v2": "interacted", "v3": "interacted", "ving": "interacting", "ipaUS": "/ˌɪn.təˈrækt/", "meaning": "tương tác", "isIrregular": false, "isTransitive": false, "activeObject": "with artificial intelligence", "grade": 10}, {"v1": "collaborate", "vs": "collaborates", "v2": "collaborated", "v3": "collaborated", "ving": "collaborating", "ipaUS": "/kəˈlæb.ə.reɪt/", "meaning": "cộng tác, hợp tác", "isIrregular": false, "isTransitive": false, "activeObject": "with international experts", "grade": 11}, {"v1": "cooperate", "vs": "cooperates", "v2": "cooperated", "v3": "cooperated", "ving": "cooperating", "ipaUS": "/kəʊˈɒp.ər.eɪt/", "meaning": "hợp tác, phối hợp", "isIrregular": false, "isTransitive": false, "activeObject": "with local authorities", "grade": 10}, {"v1": "coordinate", "vs": "coordinates", "v2": "coordinated", "v3": "coordinated", "ving": "coordinating", "ipaUS": "/kəʊˈɔː.dɪ.neɪt/", "meaning": "điều phối, phối hợp", "isIrregular": false, "isTransitive": true, "activeObject": "the relief effort", "grade": 12}, {"v1": "negotiate", "vs": "negotiates", "v2": "negotiated", "v3": "negotiated", "ving": "negotiating", "ipaUS": "/nɪˈɡəʊ.ʃi.eɪt/", "meaning": "đàm phán, thương lượng", "isIrregular": false, "isTransitive": true, "activeObject": "the contract terms", "grade": 12}, {"v1": "compromise", "vs": "compromises", "v2": "compromised", "v3": "compromised", "ving": "compromising", "ipaUS": "/ˈkɒm.prə.maɪz/", "meaning": "thỏa hiệp", "isIrregular": false, "isTransitive": false, "activeObject": "on the schedule", "grade": 12}, {"v1": "resolve", "vs": "resolves", "v2": "resolved", "v3": "resolved", "ving": "resolving", "ipaUS": "/rɪˈzɒlv/", "meaning": "giải quyết dứt điểm", "isIrregular": false, "isTransitive": true, "activeObject": "the conflict", "grade": 11}, {"v1": "settle", "vs": "settles", "v2": "settled", "v3": "settled", "ving": "settling", "ipaUS": "/ˈset.əl/", "meaning": "giải quyết, định cư", "isIrregular": false, "isTransitive": true, "activeObject": "the dispute", "grade": 11}, {"v1": "tackle", "vs": "tackles", "v2": "tackled", "v3": "tackled", "ving": "tackling", "ipaUS": "/ˈtæk.əl/", "meaning": "giải quyết, xử lý (vấn đề khó)", "isIrregular": false, "isTransitive": true, "activeObject": "climate change", "grade": 11}, {"v1": "address", "vs": "addresses", "v2": "addressed", "v3": "addressed", "ving": "addressing", "ipaUS": "/əˈdres/", "meaning": "giải quyết, phát biểu", "isIrregular": false, "isTransitive": true, "activeObject": "the urgent issue", "grade": 11}, {"v1": "confront", "vs": "confronts", "v2": "confronted", "v3": "confronted", "ving": "confronting", "ipaUS": "/kənˈfrʌnt/", "meaning": "đối mặt, đương đầu", "isIrregular": false, "isTransitive": true, "activeObject": "the difficulty", "grade": 12}, {"v1": "encounter", "vs": "encounters", "v2": "encountered", "v3": "encountered", "ving": "encountering", "ipaUS": "/ɪnˈkaʊn.tər/", "meaning": "bắt gặp, đối mặt với", "isIrregular": false, "isTransitive": true, "activeObject": "unexpected problems", "grade": 11}, {"v1": "experience", "vs": "experiences", "v2": "experienced", "v3": "experienced", "ving": "experiencing", "ipaUS": "/ɪkˈspɪə.ri.əns/", "meaning": "trải nghiệm, trải qua", "isIrregular": false, "isTransitive": true, "activeObject": "cultural diversity", "grade": 9}, {"v1": "witness", "vs": "witnesses", "v2": "witnessed", "v3": "witnessed", "ving": "witnessing", "ipaUS": "/ˈwɪt.nəs/", "meaning": "chứng kiến", "isIrregular": false, "isTransitive": true, "activeObject": "rapid urbanization", "grade": 11}, {"v1": "undermine", "vs": "undermines", "v2": "undermined", "v3": "undermined", "ving": "undermining", "ipaUS": "/ˌʌn.dəˈmaɪn/", "meaning": "làm suy yếu, hủy hoại ngầm", "isIrregular": false, "isTransitive": true, "activeObject": "public trust", "grade": 12}, {"v1": "threaten", "vs": "threatens", "v2": "threatened", "v3": "threatened", "ving": "threatening", "ipaUS": "/ˈθret.ən/", "meaning": "đe dọa", "isIrregular": false, "isTransitive": true, "activeObject": "endangered species", "grade": 10}, {"v1": "endanger", "vs": "endangers", "v2": "endangered", "v3": "endangered", "ving": "endangering", "ipaUS": "/ɪnˈdeɪn.dʒər/", "meaning": "gây nguy hiểm cho", "isIrregular": false, "isTransitive": true, "activeObject": "sea turtles", "grade": 10}, {"v1": "eliminate", "vs": "eliminates", "v2": "eliminated", "v3": "eliminated", "ving": "eliminating", "ipaUS": "/iˈlɪm.ɪ.neɪt/", "meaning": "loại bỏ, xóa sổ", "isIrregular": false, "isTransitive": true, "activeObject": "plastic waste", "grade": 11}, {"v1": "remove", "vs": "removes", "v2": "removed", "v3": "removed", "ving": "removing", "ipaUS": "/rɪˈmuːv/", "meaning": "loại bỏ, dời đi", "isIrregular": false, "isTransitive": true, "activeObject": "the barrier", "grade": 8}, {"v1": "ban", "vs": "bans", "v2": "banned", "v3": "banned", "ving": "banning", "ipaUS": "/bæn/", "meaning": "cấm chính thức", "isIrregular": false, "isTransitive": true, "activeObject": "single-use plastics", "grade": 10}, {"v1": "prohibit", "vs": "prohibits", "v2": "prohibited", "v3": "prohibited", "ving": "prohibiting", "ipaUS": "/prəˈhɪb.ɪt/", "meaning": "nghiêm cấm", "isIrregular": false, "isTransitive": true, "activeObject": "hunting in the park", "grade": 11}, {"v1": "restrict", "vs": "restricts", "v2": "restricted", "v3": "restricted", "ving": "restricting", "ipaUS": "/rɪˈstrɪkt/", "meaning": "hạn chế, giới hạn", "isIrregular": false, "isTransitive": true, "activeObject": "vehicle access", "grade": 11}, {"v1": "limit", "vs": "limits", "v2": "limited", "v3": "limited", "ving": "limiting", "ipaUS": "/ˈlɪm.ɪt/", "meaning": "giới hạn", "isIrregular": false, "isTransitive": true, "activeObject": "screen time", "grade": 9}, {"v1": "regulate", "vs": "regulates", "v2": "regulated", "v3": "regulated", "ving": "regulating", "ipaUS": "/ˈreɡ.jʊ.leɪt/", "meaning": "điều tiết, quản lý bằng quy định", "isIrregular": false, "isTransitive": true, "activeObject": "carbon markets", "grade": 12}];

    const EXTERNAL_SOURCE = (typeof window !== 'undefined' && Array.isArray(window.VERB_DATABASE) && window.VERB_DATABASE.length >= 388)
      ? window.VERB_DATABASE
      : BUILTIN_388_VERBS;

    const ALL_VERBS = EXTERNAL_SOURCE.map(normalizeVerb).filter(Boolean);
    var VERB_DATABASE = ALL_VERBS;
    window.VERB_DATABASE = VERB_DATABASE;

    const QUICK_CHIPS = ["write", "build", "make", "take", "study", "eat", "go", "come", "run", "arrive", "speak", "know"];

    const SPECIAL_WORD_NOTES = {
      hello: {
        ipaUS: "/həˈləʊ/",
        meaning: "cất lời chào, gửi lời chào (thường dùng làm thán từ 'Xin chào!')",
        activeObject: "everyone",
        passiveSubject: "Everyone",
        isTransitive: true,
        customNote: "Lưu ý ngữ pháp: <strong>\"hello\"</strong> thông thường là thán từ hoặc danh từ (chào hỏi). Khi chuyển loại từ và chia như động từ có quy tắc (<code class='font-mono'>hello / helloes / helloed / helloing</code>), từ này mang nghĩa <em>\"cất lời chào ai đó\"</em>."
      },
      hi: {
        ipaUS: "/haɪ/",
        meaning: "chào hỏi thân mật (thông thường là thán từ 'Chào!')",
        activeObject: "the guests",
        passiveSubject: "The guests",
        isTransitive: true,
        customNote: "Lưu ý ngữ pháp: <strong>\"hi\"</strong> là thán từ chào hỏi thân mật. Trong giao tiếp chuẩn, người bản xứ thường dùng <code class='font-mono'>say hi to someone</code> hoặc <code class='font-mono'>greet someone</code>."
      },
      goodbye: {
        ipaUS: "/ˌɡʊdˈbaɪ/",
        meaning: "tạm biệt (thường dùng dưới dạng cụm 'say goodbye')",
        activeObject: "old friends",
        passiveSubject: "Old friends",
        isTransitive: true,
        customNote: "Lưu ý ngữ pháp: <strong>\"goodbye\"</strong> thường là thán từ/danh từ. Khi diễn đạt hành động tạm biệt, bạn cũng có thể dùng động từ <code class='font-mono'>bid farewell</code> hoặc <code class='font-mono'>say goodbye</code>."
      },
      chill: {
        ipaUS: "/tʃɪl/",
        meaning: "thư giãn, nghỉ ngơi (slang) / làm lạnh",
        activeObject: "with friends",
        passiveSubject: "",
        isTransitive: false,
        customNote: "Lưu ý: Khi mang nghĩa <em>\"thư giãn, nghỉ ngơi\"</em> (chill out), <strong>\"chill\"</strong> đóng vai trò là Nội động từ <code class='font-mono'>[vi.]</code>. Khi mang nghĩa <em>\"làm mát đồ uống\"</em>, nó là Ngoại động từ <code class='font-mono'>[vt.]</code>."
      }
    };

    const PASSIVE_AGENT_MAP = {
      "I": "by me",
      "You": "by you",
      "We": "by us",
      "They": "by them",
      "He": "by him",
      "She": "by her",
      "It": "by it"
    };

    function removeVietnameseTones(str) {
      return (str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase();
    }

    function findOrBuildVerb(rawInput) {
      const q = (rawInput || '').toLowerCase().trim();
      const defaultFirst = VERB_DATABASE[0];
      if (!q) return { ...defaultFirst };

      const exactMatch = VERB_DATABASE.find(item =>
        (item.v1 || '').toLowerCase() === q ||
        (item.vs || '').toLowerCase() === q ||
        (item.v2 || '').toLowerCase().split('/').map(s => s.trim()).includes(q) ||
        (item.v3 || '').toLowerCase().split('/').map(s => s.trim()).includes(q) ||
        (item.ving || '').toLowerCase() === q
      );
      if (exactMatch) return { ...exactMatch };

      // Multi-Field Fuzzy Search Engine high-confidence lookup
      if (typeof window !== 'undefined' && window.LexiSearchEngine && typeof window.LexiSearchEngine.search === 'function') {
        const topSearch = window.LexiSearchEngine.search(q, { limit: 1, minScore: 0.45 });
        if (topSearch.length > 0 && topSearch[0].verb) {
          return { ...topSearch[0].verb };
        }
      }

      const qNoTone = removeVietnameseTones(q);
      const viMatch = VERB_DATABASE.find(item =>
        (item.meaning || '').toLowerCase().includes(q) ||
        removeVietnameseTones(item.meaning || '').includes(qNoTone)
      );
      if (viMatch) return { ...viMatch };

      const v = q.replace(/[^a-z]/g, '');
      if (!v) return { ...defaultFirst };

      let vs = v + 's';
      let v2 = v + 'ed';
      let ving = v + 'ing';

      if (/(s|sh|ch|x|z|o)$/i.test(v)) {
        vs = v + 'es';
      } else if (/[^aeiou]y$/i.test(v)) {
        vs = v.slice(0, -1) + 'ies';
      }

      if (/e$/i.test(v)) {
        v2 = v + 'd';
      } else if (/[^aeiou]y$/i.test(v)) {
        v2 = v.slice(0, -1) + 'ied';
      } else if (v.length <= 4 && /^[^aeiou]+[aeiou][^aeiouwxy]$/i.test(v)) {
        v2 = v + v.slice(-1) + 'ed';
      }

      if (/ie$/i.test(v)) {
        ving = v.slice(0, -2) + 'ying';
      } else if (/[^e]e$/i.test(v)) {
        ving = v.slice(0, -1) + 'ing';
      } else if (v.length <= 4 && /^[^aeiou]+[aeiou][^aeiouwxy]$/i.test(v)) {
        ving = v + v.slice(-1) + 'ing';
      }

      if (SPECIAL_WORD_NOTES[v]) {
        const sp = SPECIAL_WORD_NOTES[v];
        return {
          v1: v,
          vs: vs,
          v2: v2,
          v3: v2,
          ving: ving,
          ipaUS: sp.ipaUS,
          meaning: sp.meaning,
          isIrregular: false,
          isTransitive: sp.isTransitive,
          activeObject: sp.activeObject,
          passiveSubject: sp.passiveSubject,
          customNote: sp.customNote,
          grade: 6,
          isCustomFallback: true
        };
      }

      return {
        v1: v,
        vs: vs,
        v2: v2,
        v3: v2,
        ving: ving,
        ipaUS: `/${v}/`,
        meaning: `Động từ chia theo quy tắc (-ed / -ing)`,
        isIrregular: false,
        isTransitive: true,
        activeObject: "everyone",
        passiveSubject: "Everyone",
        grade: 6,
        customNote: `Từ <code class="font-mono font-bold">"${v}"</code> chưa có trong từ điển gốc nên đang được chia tự động theo quy tắc chuẩn (<code class="font-mono">${v} / ${vs} / ${v2} / ${ving}</code>).`,
        isCustomFallback: true
      };
    }

    const TENSES = [
      {
        id: "pres_simple",
        timeframe: "present",
        aspect: "simple",
        aspectOrder: 1,
        viTitle: "Hiện tại đơn",
        enTitle: "Present Simple",
        formula: "S + V(s/es)",
        passiveFormula: "S + am/is/are + V3/ed + (by O)",
        formulasAll: {
          aff: "S + V1 / V(s/es) + O",
          neg: "S + do/does + not + V1 + O",
          int: "Do/Does + S + V1 + O?",
          pas: "S + am/is/are + V3/ed + (by O)"
        },
        signals: "every day, usually, often, always",
        signalBullets: [
          "<strong>Trạng từ tần suất:</strong> always, usually, often, sometimes, seldom, rarely, never.",
          "<strong>Cụm từ chỉ chu kỳ:</strong> every day/week/month/year, once/twice a week.",
          "<strong>Trạng từ chỉ lịch trình:</strong> on Mondays, at weekends, daily, annually."
        ],
        summary: "Thói quen lặp lại, lịch trình hoặc sự thật hiển nhiên.",
        detailUsage: "Diễn tả một thói quen lặp đi lặp lại ở hiện tại, một chân lý/sự thật hiển nhiên, hoặc một lịch trình cố định (tàu xe, máy bay, thời khóa biểu).",
        grammarTraps: [
          "<strong>Quên chia đuôi -s/es:</strong> Với chủ ngữ ngôi thứ 3 số ít (He, She, It), bắt buộc thêm <code>-s/es</code> ở câu khẳng định.",
          "<strong>Lỗi giữ -s/es sau trợ động từ:</strong> Trong câu phủ định và nghi vấn đã có <code>doesn't / Does</code> thì động từ chính phải trả về nguyên mẫu <code>V1</code>."
        ],
        extendedStructures: [
          {
            tab: "Lịch trình vs Tương lai",
            title: "Hiện tại đơn mang nghĩa Tương lai (Timetables)",
            desc: "Dùng Hiện tại đơn cho lịch trình công cộng cố định (tàu hỏa, chuyến bay, giờ mở cửa) dù hành động chưa diễn ra.",
            example: "The train leaves at 7:00 AM tomorrow morning."
          },
          {
            tab: "Đảo ngữ nhấn mạnh",
            title: "Trợ động từ Do / Does nhấn mạnh ở câu khẳng định",
            desc: "Đặt do/does trước V1 trong câu khẳng định để nhấn mạnh sự thật.",
            example: "She does write the report carefully every day!"
          }
        ]
      },
      {
        id: "pres_cont",
        timeframe: "present",
        aspect: "cont",
        aspectOrder: 2,
        viTitle: "Hiện tại tiếp diễn",
        enTitle: "Present Continuous",
        formula: "S + am/is/are + V-ing",
        passiveFormula: "S + am/is/are + being + V3/ed + (by O)",
        formulasAll: {
          aff: "S + am/is/are + V-ing + O",
          neg: "S + am/is/are + not + V-ing + O",
          int: "Am/Is/Are + S + V-ing + O?",
          pas: "S + am/is/are + being + V3/ed + (by O)"
        },
        signals: "now, right now, at the moment, Look!",
        signalBullets: [
          "<strong>Thời điểm ngay lúc nói:</strong> now, right now, at the moment, at present, currently.",
          "<strong>Câu mệnh lệnh gây chú ý:</strong> Look!, Listen!, Watch out!, Keep silent!",
          "<strong>Chuyển biến tăng tiến:</strong> more and more, getting + adj-er."
        ],
        summary: "Hành động đang diễn ra ngay tại thời điểm nói.",
        detailUsage: "Diễn tả sự việc đang diễn ra ngay lúc nói, hành động mang tính tạm thời, hoặc một kế hoạch cá nhân đã có lịch hẹn trước trong tương lai gần.",
        grammarTraps: [
          "<strong>CẤM dùng với Động từ trạng thái (Stative Verbs):</strong> <code>know, understand, believe, like, love, want, need, belong</code> KHÔNG chia ở dạng <code>V-ing</code>.",
          "<strong>Bẫy từ 'always':</strong> Khi <code>always / constantly</code> đi với Hiện tại tiếp diễn, câu mang hàm ý phàn nàn."
        ],
        extendedStructures: [
          {
            tab: "Phàn nàn với Always",
            title: "Be + always / constantly + V-ing (Phàn nàn)",
            desc: "Khác với Hiện tại đơn chỉ thói quen trung tính, cấu trúc này phê bình việc ai đó cứ làm điều gì gây khó chịu.",
            example: "He is always forgetting his password!"
          }
        ]
      },
      {
        id: "pres_perf",
        timeframe: "present",
        aspect: "perf",
        aspectOrder: 3,
        viTitle: "Hiện tại hoàn thành",
        enTitle: "Present Perfect",
        formula: "S + have/has + V3/ed",
        passiveFormula: "S + have/has + been + V3/ed + (by O)",
        formulasAll: {
          aff: "S + have/has + V3/ed + O",
          neg: "S + have/has + not + V3/ed + O",
          int: "Have/Has + S + V3/ed + O?",
          pas: "S + have/has + been + V3/ed + (by O)"
        },
        signals: "already, just, yet, ever, never, since, for",
        signalBullets: [
          "<strong>Mức độ hoàn tất:</strong> just, already, yet (cuối câu phủ định/nghi vấn).",
          "<strong>Trải nghiệm:</strong> ever, never, several times, so far, up to now, recently.",
          "<strong>Mốc & Khoảng thời gian:</strong> <code>since</code> + mốc thời gian / <code>for</code> + khoảng thời gian."
        ],
        summary: "Hành động đã xảy ra và còn lưu kết quả ở hiện tại.",
        detailUsage: "Diễn tả hành động bắt đầu trong quá khứ kéo dài đến hiện tại, trải nghiệm sống, hoặc việc vừa xảy ra để lại kết quả ở hiện tại.",
        grammarTraps: [
          "<strong>Nhầm với Quá khứ đơn:</strong> Nếu câu có mốc quá khứ xác định (<code>yesterday, in 2019, 3 days ago</code>) thì BẮT BUỘC dùng Quá khứ đơn.",
          "<strong>Phân biệt 'have gone to' và 'have been to':</strong> <code>gone to</code> là đã đi chưa về; <code>been to</code> là đã từng ghé thăm và đã về."
        ],
        extendedStructures: [
          {
            tab: "Since vs For",
            title: "Quy tắc vàng kết hợp Since + Quá khứ đơn",
            desc: "S + have/has + V3/ed + SINCE + S + V2/ed.",
            example: "She has written three novels since she graduated."
          }
        ]
      },
      {
        id: "pres_perf_cont",
        timeframe: "present",
        aspect: "perf_cont",
        aspectOrder: 4,
        viTitle: "Hiện tại hoàn thành tiếp diễn",
        enTitle: "Present Perfect Continuous",
        formula: "S + have/has been + V-ing",
        passiveFormula: "S + have/has + been + being + V3/ed (Ít dùng)",
        formulasAll: {
          aff: "S + have/has + been + V-ing + O",
          neg: "S + have/has + not + been + V-ing + O",
          int: "Have/Has + S + been + V-ing + O?",
          pas: "S + have/has + been + being + V3/ed"
        },
        signals: "all day, for hours, since morning, how long",
        signalBullets: [
          "<strong>Nhấn mạnh độ dài liên tục:</strong> all day, all morning, all week.",
          "<strong>Câu hỏi bao lâu:</strong> How long + have/has + S + been + V-ing?",
          "<strong>Kết hợp since/for:</strong> for 3 hours nonstop, since early morning."
        ],
        summary: "Nhấn mạnh tính liên tục kéo dài từ quá khứ đến nay.",
        detailUsage: "Nhấn mạnh quá trình liên tục không ngắt quãng của hành động bắt đầu trong quá khứ và vẫn đang tiếp diễn ở hiện tại.",
        grammarTraps: [
          "<strong>Phân biệt HTHT và HTHT Tiếp diễn:</strong> Nêu số lượng kết quả cụ thể -> dùng <strong>HTHT</strong>. Nhấn mạnh thời gian liên tục -> dùng <strong>HTHT Tiếp diễn</strong>."
        ],
        extendedStructures: [
          {
            tab: "Kết quả vs Quá trình",
            title: "So sánh trực tiếp HTHT & HTHT Tiếp diễn",
            desc: "HTHT nhìn vào số lượng đã xong; HTHT Tiếp diễn nhìn vào công sức đang bỏ ra liên tục.",
            example: "I have written 3 chapters vs. I have been writing all morning."
          }
        ]
      },
      {
        id: "past_simple",
        timeframe: "past",
        aspect: "simple",
        aspectOrder: 1,
        viTitle: "Quá khứ đơn",
        enTitle: "Past Simple",
        formula: "S + V2/ed",
        passiveFormula: "S + was/were + V3/ed + (by O)",
        formulasAll: {
          aff: "S + V2/ed + O",
          neg: "S + did + not + V1 + O",
          int: "Did + S + V1 + O?",
          pas: "S + was/were + V3/ed + (by O)"
        },
        signals: "yesterday, last week, 2 days ago, in 2020",
        signalBullets: [
          "<strong>Mốc quá khứ rõ ràng:</strong> yesterday, last night/week/month/year.",
          "<strong>Khoảng cách lùi về trước:</strong> 2 days ago, 5 years ago.",
          "<strong>Năm/thời kỳ đã qua:</strong> in 1995, when I was a child."
        ],
        summary: "Hành động đã bắt đầu và chấm dứt hoàn toàn trong quá khứ.",
        detailUsage: "Diễn tả sự việc đã xảy ra và kết thúc hoàn toàn tại một thời điểm xác định trong quá khứ.",
        grammarTraps: [
          "<strong>Lỗi dùng V2 sau 'did not / Did':</strong> Khi đã mượn trợ động từ <code>did</code>, động từ chính bắt buộc trở về nguyên mẫu <code>V1</code>."
        ],
        extendedStructures: [
          {
            tab: "Used to + V1",
            title: "Thói quen trong quá khứ (Used to + V1)",
            desc: "'Used to + V1' chỉ thói quen trong quá khứ nay không còn nữa.",
            example: "He used to write letters by hand, but now he sends emails."
          }
        ]
      },
      {
        id: "past_cont",
        timeframe: "past",
        aspect: "cont",
        aspectOrder: 2,
        viTitle: "Quá khứ tiếp diễn",
        enTitle: "Past Continuous",
        formula: "S + was/were + V-ing",
        passiveFormula: "S + was/were + being + V3/ed + (by O)",
        formulasAll: {
          aff: "S + was/were + V-ing + O",
          neg: "S + was/were + not + V-ing + O",
          int: "Was/Were + S + V-ing + O?",
          pas: "S + was/were + being + V3/ed + (by O)"
        },
        signals: "at 8 PM yesterday, while, when",
        signalBullets: [
          "<strong>Giờ cụ thể trong quá khứ:</strong> at 9 PM last night, at this time yesterday.",
          "<strong>Liên từ kết hợp:</strong> <code>while</code> (trong khi), <code>when</code> (khi)."
        ],
        summary: "Hành động đang diễn ra tại một mốc cụ thể trong quá khứ.",
        detailUsage: "Diễn tả hành động đang diễn ra tại một thời điểm cụ thể trong quá khứ, hoặc đang diễn ra thì có hành động khác cắt ngang.",
        grammarTraps: [
          "<strong>Hành động nền vs Hành động cắt ngang:</strong> Đang kéo dài làm nền dùng <strong>Quá khứ tiếp diễn</strong>; hành động ngắn xen vào dùng <strong>Quá khứ đơn</strong>."
        ],
        extendedStructures: [
          {
            tab: "When & While",
            title: "Phối hợp When & While trong bài thi",
            desc: "Đang diễn ra (was/were V-ing) thì bị cắt ngang (V2/ed).",
            example: "While I was writing the report, the power went out."
          }
        ]
      },
      {
        id: "past_perf",
        timeframe: "past",
        aspect: "perf",
        aspectOrder: 3,
        viTitle: "Quá khứ hoàn thành",
        enTitle: "Past Perfect",
        formula: "S + had + V3/ed",
        passiveFormula: "S + had + been + V3/ed + (by O)",
        formulasAll: {
          aff: "S + had + V3/ed + O",
          neg: "S + had + not + V3/ed + O",
          int: "Had + S + V3/ed + O?",
          pas: "S + had + been + V3/ed + (by O)"
        },
        signals: "before, after, by the time, prior to",
        signalBullets: [
          "<strong>Trước một mốc quá khứ:</strong> before + mốc quá khứ, by the time + S + V2/ed.",
          "<strong>Sau một hành động:</strong> after + S + had + V3/ed, S + V2/ed."
        ],
        summary: "Hành động hoàn tất trước một mốc/hành động quá khứ khác.",
        detailUsage: "Diễn tả một hành động xảy ra và hoàn tất trước một thời điểm hoặc trước một hành động khác trong quá khứ.",
        grammarTraps: [
          "<strong>Công thức Before / After:</strong> <code>Before + V2/ed, had V3/ed</code>. Ngược lại: <code>After + had V3/ed, V2/ed</code>."
        ],
        extendedStructures: [
          {
            tab: "No sooner / Hardly",
            title: "Đảo ngữ 'Vừa mới... thì đã...'",
            desc: "No sooner + had + S + V3/ed + THAN + S + V2/ed.",
            example: "No sooner had he written the letter than the postman arrived."
          }
        ]
      },
      {
        id: "past_perf_cont",
        timeframe: "past",
        aspect: "perf_cont",
        aspectOrder: 4,
        viTitle: "Quá khứ hoàn thành tiếp diễn",
        enTitle: "Past Perfect Continuous",
        formula: "S + had been + V-ing",
        passiveFormula: "S + had + been + being + V3/ed (Hiếm gặp)",
        formulasAll: {
          aff: "S + had + been + V-ing + O",
          neg: "S + had + not + been + V-ing + O",
          int: "Had + S + been + V-ing + O?",
          pas: "S + had + been + being + V3/ed"
        },
        signals: "for 2 hours before, until then, prior to that",
        signalBullets: [
          "<strong>Khoảng thời gian trước mốc quá khứ:</strong> for 3 hours before + S + V2/ed.",
          "<strong>Cho đến lúc đó:</strong> until then, up to that moment."
        ],
        summary: "Quá trình kéo dài liên tục trước một mốc trong quá khứ.",
        detailUsage: "Nhấn mạnh khoảng thời gian một hành động đã diễn ra liên tục trước khi một hành động quá khứ khác xảy đến.",
        grammarTraps: [
          "<strong>So sánh với HTHT Tiếp diễn:</strong> Nếu ngữ cảnh đang ở quá khứ (có <code>V2/ed</code>), bắt buộc lùi xuống <code>had been V-ing</code>."
        ],
        extendedStructures: [
          {
            tab: "Nguyên nhân - Kết quả QK",
            title: "Giải thích dấu hiệu để lại trong quá khứ",
            desc: "Dùng khi một hành động kéo dài để lại bằng chứng tại một thời điểm trong quá khứ.",
            example: "His eyes were red because he had been reading the novel for 5 hours."
          }
        ]
      },
      {
        id: "fut_simple",
        timeframe: "future",
        aspect: "simple",
        aspectOrder: 1,
        viTitle: "Tương lai đơn",
        enTitle: "Future Simple",
        formula: "S + will + V1",
        passiveFormula: "S + will + be + V3/ed + (by O)",
        formulasAll: {
          aff: "S + will + V1 + O",
          neg: "S + will not (won't) + V1 + O",
          int: "Will + S + V1 + O?",
          pas: "S + will + be + V3/ed + (by O)"
        },
        signals: "tomorrow, next week, soon, I think",
        signalBullets: [
          "<strong>Thời gian tương lai:</strong> tomorrow, tonight, next week/month/year, soon.",
          "<strong>Động từ dự đoán:</strong> I think, I believe, perhaps, probably, maybe."
        ],
        summary: "Quyết định tức thời, lời hứa hoặc dự đoán tương lai.",
        detailUsage: "Diễn tả quyết định nảy sinh ngay tại thời điểm nói, lời hứa, hoặc dự đoán chủ quan.",
        grammarTraps: [
          "<strong>CẤM dùng 'will' trong mệnh đề thời gian:</strong> Sau <code>when, while, as soon as, before, after, until, by the time</code>, dùng <strong>Hiện tại đơn</strong>."
        ],
        extendedStructures: [
          {
            tab: "Will vs Be going to",
            title: "Phân biệt Tương lai đơn (Will) & Tương lai gần (Be going to)",
            desc: "WILL + V1: Quyết định tức thời/dự đoán chủ quan. BE GOING TO + V1: Kế hoạch từ trước/dự đoán có căn cứ.",
            example: "Look at those dark clouds! It is going to rain."
          }
        ]
      },
      {
        id: "fut_cont",
        timeframe: "future",
        aspect: "cont",
        aspectOrder: 2,
        viTitle: "Tương lai tiếp diễn",
        enTitle: "Future Continuous",
        formula: "S + will be + V-ing",
        passiveFormula: "S + will + be + being + V3/ed (Ít dùng)",
        formulasAll: {
          aff: "S + will + be + V-ing + O",
          neg: "S + will not (won't) + be + V-ing + O",
          int: "Will + S + be + V-ing + O?",
          pas: "S + will + be + being + V3/ed"
        },
        signals: "at this time tomorrow, at 9 AM next Monday",
        signalBullets: [
          "<strong>Giờ cụ thể ở tương lai:</strong> at 10 AM tomorrow, at this time next week.",
          "<strong>Khoảng thời gian tương lai:</strong> from 2 PM to 4 PM tomorrow."
        ],
        summary: "Hành động sẽ đang diễn ra tại một mốc cụ thể ở tương lai.",
        detailUsage: "Diễn tả một hành động sẽ đang diễn ra tại một thời điểm xác định cụ thể trong tương lai.",
        grammarTraps: [
          "<strong>Chú ý 'at this time' hoặc giờ cụ thể:</strong> Có <code>at 8 PM tomorrow</code> hoặc <code>at this time tomorrow</code> -> chọn <strong>Tương lai tiếp diễn</strong>."
        ],
        extendedStructures: [
          {
            tab: "Hỏi lịch sự",
            title: "Dùng Will you be + V-ing để hỏi ý định lịch sự",
            desc: "Hỏi xem ai đó có sẵn tiện làm việc gì trong lịch trình của họ không.",
            example: "Will you be using your laptop this afternoon?"
          }
        ]
      },
      {
        id: "fut_perf",
        timeframe: "future",
        aspect: "perf",
        aspectOrder: 3,
        viTitle: "Tương lai hoàn thành",
        enTitle: "Future Perfect",
        formula: "S + will have + V3/ed",
        passiveFormula: "S + will + have + been + V3/ed + (by O)",
        formulasAll: {
          aff: "S + will + have + V3/ed + O",
          neg: "S + will not + have + V3/ed + O",
          int: "Will + S + have + V3/ed + O?",
          pas: "S + will + have + been + V3/ed + (by O)"
        },
        signals: "by tomorrow, by the end of this year, by 2030",
        signalBullets: [
          "<strong>Cụm từ 'By + mốc tương lai':</strong> by tomorrow, by next month, by 2030.",
          "<strong>Mệnh đề 'By the time':</strong> By the time + S + V(hiện tại đơn), S + will have + V3/ed."
        ],
        summary: "Hành động sẽ hoàn tất trước một mốc thời gian tương lai.",
        detailUsage: "Diễn tả một hành động sẽ được hoàn tất trọn vẹn trước một thời điểm hoặc trước một hành động khác trong tương lai.",
        grammarTraps: [
          "<strong>Mẹo phân biệt 'By the time':</strong> Sau <code>By the time</code> là <strong>Hiện tại đơn</strong> -> vế chính chia <strong>will have V3</strong>."
        ],
        extendedStructures: [
          {
            tab: "By the time",
            title: "Phối hợp thì với By the time",
            desc: "By the time + Present Simple, Future Perfect.",
            example: "By the time you arrive, I will have written the report."
          }
        ]
      },
      {
        id: "fut_perf_cont",
        timeframe: "future",
        aspect: "perf_cont",
        aspectOrder: 4,
        viTitle: "Tương lai hoàn thành tiếp diễn",
        enTitle: "Future Perfect Continuous",
        formula: "S + will have been + V-ing",
        passiveFormula: "S + will + have + been + being + V3/ed (Không dùng)",
        formulasAll: {
          aff: "S + will + have + been + V-ing + O",
          neg: "S + will not + have + been + V-ing + O",
          int: "Will + S + have + been + V-ing + O?",
          pas: "S + will + have + been + being + V3/ed"
        },
        signals: "for 5 years by next month",
        signalBullets: [
          "<strong>Dấu hiệu kép 'For + khoảng thời gian + By + mốc tương lai':</strong> for 10 years by the end of this year."
        ],
        summary: "Quá trình liên tục tính đến một mốc thời gian trong tương lai.",
        detailUsage: "Nhấn mạnh tính liên tục của một hành động đã kéo dài được bao lâu tính đến một mốc thời gian xác định trong tương lai.",
        grammarTraps: [
          "<strong>Dấu hiệu kép bắt buộc:</strong> Xuất hiện khi câu vừa có <code>for + khoảng thời gian</code> vừa có <code>by + mốc tương lai</code>."
        ],
        extendedStructures: [
          {
            tab: "TLHT vs TLHT Tiếp diễn",
            title: "Khi nào chọn will have V3 và will have been V-ing?",
            desc: "Nhấn mạnh hoàn tất -> will have V3. Có 'for + khoảng thời gian' nhấn mạnh liên tục -> will have been V-ing.",
            example: "By next May, she will have been teaching here for 10 years."
          }
        ]
      }
    ];
if (typeof window !== 'undefined') {
  window.TENSES = TENSES;
}


    const SGK_CURRICULUM = {
      1: { level: "Tiểu học", title: "Lớp 1 — Khởi đầu Làm quen Động từ Hành động", tenses: ["pres_simple"], desc: "Nhận diện động từ chỉ hoạt động cơ bản trong lớp học, gia đình và trò chơi (Lệnh đơn giản & Hiện tại đơn)." },
      2: { level: "Tiểu học", title: "Lớp 2 — Hoạt động Thường ngày & Khả năng", tenses: ["pres_simple", "pres_cont"], desc: "Mở rộng động từ vận động, sở thích, hỏi đáp việc đang làm (Present Simple & Present Continuous cơ bản)." },
      3: { level: "Tiểu học", title: "Lớp 3 — Giao tiếp Học đường & Thói quen", tenses: ["pres_simple", "pres_cont"], desc: "Chia động từ theo chủ ngữ I/You/We/They và He/She/It, các hoạt động học tập và giải trí." },
      4: { level: "Tiểu học", title: "Lớp 4 — Lịch trình, Nghề nghiệp & Bước đầu Quá khứ", tenses: ["pres_simple", "pres_cont", "past_simple"], desc: "Làm quen với động từ có quy tắc (-ed) và bất quy tắc thông dụng trong các chuyến đi, kỳ nghỉ." },
      5: { level: "Tiểu học", title: "Lớp 5 — Kể chuyện Quá khứ & Dự định Tương lai", tenses: ["pres_simple", "pres_cont", "past_simple", "fut_simple"], desc: "Nắm vững bộ 4 thì nền tảng: Hiện tại đơn, Hiện tại tiếp diễn, Quá khứ đơn (V2/ed) và Tương lai đơn (will + V1)." },
      6: { level: "THCS", title: "Lớp 6 — Ngữ pháp Nền tảng THCS & Môi trường Xanh", tenses: ["pres_simple", "pres_cont", "past_simple", "fut_simple"], desc: "Hệ thống hóa quy tắc phát âm đuôi -s/es, -ed và động từ chủ đề Môi trường (Recycle, Protect, Reduce)." },
      7: { level: "THCS", title: "Lớp 7 — Hoạt động Cộng đồng, Nghệ thuật & Năng lượng", tenses: ["pres_simple", "pres_cont", "past_simple", "fut_simple", "fut_cont"], desc: "Mở rộng ngoại động từ chỉ hoạt động tình nguyện, bảo tồn và Tương lai tiếp diễn." },
      8: { level: "THCS", title: "Lớp 8 — Khoa học Công nghệ, Thiên tai & Quá khứ Tiếp diễn", tenses: ["pres_perf", "past_cont", "past_simple", "fut_simple"], desc: "Làm chủ sự phối hợp thì Quá khứ tiếp diễn (While/When), Hiện tại hoàn thành và Câu bị động cơ bản." },
      9: { level: "THCS", title: "Lớp 9 — Di sản Văn hóa, Định hướng Nghề nghiệp & Ôn thi vào 10", tenses: ["pres_perf", "past_perf", "past_cont", "fut_simple"], desc: "Tổng hợp động từ học thuật THCS, Quá khứ hoàn thành (Before/After) và Bị động 6 thì trọng tâm." },
      10: { level: "THPT", title: "Lớp 10 — Phát minh, AI, Âm nhạc & Bảo vệ Hệ sinh thái", tenses: ["pres_perf", "past_cont", "fut_simple", "pres_simple"], desc: "Động từ học thuật THPT, phân biệt sâu Hiện tại hoàn thành vs Quá khứ đơn, Will vs Be going to và Bị động nâng cao." },
      11: { level: "THPT", title: "Lớp 11 — Đô thị thông minh, ASEAN & Biến đổi Khí hậu", tenses: ["pres_perf", "pres_perf_cont", "past_perf", "fut_perf"], desc: "Hoàn thiện các thì Hoàn thành & Hoàn thành tiếp diễn, Phân từ hoàn thành và Động từ trạng thái (Stative Verbs)." },
      12: { level: "THPT", title: "Lớp 12 — Toàn cầu hóa, Sự nghiệp & Chinh phục Kỳ thi THPT Quốc gia", tenses: ["pres_perf_cont", "past_perf", "past_perf_cont", "fut_perf", "fut_perf_cont"], desc: "Làm chủ toàn diện Ma trận 12 Thì, Đảo ngữ (No sooner/Hardly), Sự hòa hợp các thì (Sequence of Tenses) và 388 Động từ." }
    };

    function firstVariant(formStr) {
      return (formStr || '').split('/')[0].trim();
    }

    function conjugateTense(tenseId, verb, subj, isPassive = false) {
      if (isPassive) {
        return conjugatePassiveTense(tenseId, verb, subj);
      }

      const is3rd = ['He', 'She', 'It'].includes(subj);
      const isI = (subj === 'I');
      const subjLower = (subj === 'I') ? 'I' : subj.toLowerCase();
      const rawObj = (verb.activeObject !== undefined ? verb.activeObject : '').trim();
      const objSuffix = rawObj ? ` ${rawObj}` : '';
      const isBe = (verb.v1 === 'be');

      let affRaw = '', negRaw = '', intRaw = '';
      let affHtml = '', negHtml = '', intHtml = '';

      const S = `<span class="token-subj">${subj}</span>`;
      const sLow = `<span class="token-subj">${subjLower}</span>`;
      const A = (txt) => `<span class="token-aux">${txt}</span>`;
      const V = (txt) => `<span class="token-verb">${txt}</span>`;

      switch (tenseId) {
        case 'pres_simple': {
          if (isBe) {
            const be = isI ? 'am' : (is3rd ? 'is' : 'are');
            const BeCap = be.charAt(0).toUpperCase() + be.slice(1);
            const beComp = rawObj || 'ready';
            affRaw = `${subj} ${be} ${beComp}.`;
            negRaw = `${subj} ${be} not ${beComp}.`;
            intRaw = `${BeCap} ${subjLower} ${beComp}?`;
            affHtml = `${S} ${V(be)} ${beComp}.`;
            negHtml = `${S} ${V(be)} ${A('not')} ${beComp}.`;
            intHtml = `${V(BeCap)} ${sLow} ${beComp}?`;
          } else {
            const vForm = is3rd ? verb.vs : verb.v1;
            const aux = is3rd ? 'does' : 'do';
            const AuxCap = is3rd ? 'Does' : 'Do';
            affRaw = `${subj} ${vForm}${objSuffix}.`;
            negRaw = `${subj} ${aux} not ${verb.v1}${objSuffix}.`;
            intRaw = `${AuxCap} ${subjLower} ${verb.v1}${objSuffix}?`;
            affHtml = `${S} ${V(vForm)}${objSuffix}.`;
            negHtml = `${S} ${A(aux + ' not')} ${V(verb.v1)}${objSuffix}.`;
            intHtml = `${A(AuxCap)} ${sLow} ${V(verb.v1)}${objSuffix}?`;
          }
          break;
        }
        case 'pres_cont': {
          const be = isI ? 'am' : (is3rd ? 'is' : 'are');
          const BeCap = be.charAt(0).toUpperCase() + be.slice(1);
          affRaw = `${subj} ${be} ${verb.ving}${objSuffix}.`;
          negRaw = `${subj} ${be} not ${verb.ving}${objSuffix}.`;
          intRaw = `${BeCap} ${subjLower} ${verb.ving}${objSuffix}?`;
          affHtml = `${S} ${A(be)} ${V(verb.ving)}${objSuffix}.`;
          negHtml = `${S} ${A(be + ' not')} ${V(verb.ving)}${objSuffix}.`;
          intHtml = `${A(BeCap)} ${sLow} ${V(verb.ving)}${objSuffix}?`;
          break;
        }
        case 'pres_perf': {
          const have = is3rd ? 'has' : 'have';
          const HaveCap = is3rd ? 'Has' : 'Have';
          const v3Clean = firstVariant(verb.v3);
          affRaw = `${subj} ${have} ${v3Clean}${objSuffix}.`;
          negRaw = `${subj} ${have} not ${v3Clean}${objSuffix}.`;
          intRaw = `${HaveCap} ${subjLower} ${v3Clean}${objSuffix}?`;
          affHtml = `${S} ${A(have)} ${V(verb.v3)}${objSuffix}.`;
          negHtml = `${S} ${A(have + ' not')} ${V(verb.v3)}${objSuffix}.`;
          intHtml = `${A(HaveCap)} ${sLow} ${V(verb.v3)}${objSuffix}?`;
          break;
        }
        case 'pres_perf_cont': {
          const have = is3rd ? 'has' : 'have';
          const HaveCap = is3rd ? 'Has' : 'Have';
          affRaw = `${subj} ${have} been ${verb.ving}${objSuffix}.`;
          negRaw = `${subj} ${have} not been ${verb.ving}${objSuffix}.`;
          intRaw = `${HaveCap} ${subjLower} been ${verb.ving}${objSuffix}?`;
          affHtml = `${S} ${A(have + ' been')} ${V(verb.ving)}${objSuffix}.`;
          negHtml = `${S} ${A(have + ' not been')} ${V(verb.ving)}${objSuffix}.`;
          intHtml = `${A(HaveCap)} ${sLow} ${A('been')} ${V(verb.ving)}${objSuffix}?`;
          break;
        }
        case 'past_simple': {
          if (isBe) {
            const wasWere = (isI || is3rd) ? 'was' : 'were';
            const WasCap = wasWere.charAt(0).toUpperCase() + wasWere.slice(1);
            const beComp = rawObj || 'ready';
            affRaw = `${subj} ${wasWere} ${beComp}.`;
            negRaw = `${subj} ${wasWere} not ${beComp}.`;
            intRaw = `${WasCap} ${subjLower} ${beComp}?`;
            affHtml = `${S} ${V(wasWere)} ${beComp}.`;
            negHtml = `${S} ${V(wasWere)} ${A('not')} ${beComp}.`;
            intHtml = `${V(WasCap)} ${sLow} ${beComp}?`;
          } else {
            const v2Clean = firstVariant(verb.v2);
            affRaw = `${subj} ${v2Clean}${objSuffix}.`;
            negRaw = `${subj} did not ${verb.v1}${objSuffix}.`;
            intRaw = `Did ${subjLower} ${verb.v1}${objSuffix}?`;
            affHtml = `${S} ${V(verb.v2)}${objSuffix}.`;
            negHtml = `${S} ${A('did not')} ${V(verb.v1)}${objSuffix}.`;
            intHtml = `${A('Did')} ${sLow} ${V(verb.v1)}${objSuffix}?`;
          }
          break;
        }
        case 'past_cont': {
          const wasWere = (isI || is3rd) ? 'was' : 'were';
          const WasCap = wasWere.charAt(0).toUpperCase() + wasWere.slice(1);
          affRaw = `${subj} ${wasWere} ${verb.ving}${objSuffix}.`;
          negRaw = `${subj} ${wasWere} not ${verb.ving}${objSuffix}.`;
          intRaw = `${WasCap} ${subjLower} ${verb.ving}${objSuffix}?`;
          affHtml = `${S} ${A(wasWere)} ${V(verb.ving)}${objSuffix}.`;
          negHtml = `${S} ${A(wasWere + ' not')} ${V(verb.ving)}${objSuffix}.`;
          intHtml = `${A(WasCap)} ${sLow} ${V(verb.ving)}${objSuffix}?`;
          break;
        }
        case 'past_perf': {
          const v3Clean = firstVariant(verb.v3);
          affRaw = `${subj} had ${v3Clean}${objSuffix}.`;
          negRaw = `${subj} had not ${v3Clean}${objSuffix}.`;
          intRaw = `Had ${subjLower} ${v3Clean}${objSuffix}?`;
          affHtml = `${S} ${A('had')} ${V(verb.v3)}${objSuffix}.`;
          negHtml = `${S} ${A('had not')} ${V(verb.v3)}${objSuffix}.`;
          intHtml = `${A('Had')} ${sLow} ${V(verb.v3)}${objSuffix}?`;
          break;
        }
        case 'past_perf_cont': {
          affRaw = `${subj} had been ${verb.ving}${objSuffix}.`;
          negRaw = `${subj} had not been ${verb.ving}${objSuffix}.`;
          intRaw = `Had ${subjLower} been ${verb.ving}${objSuffix}?`;
          affHtml = `${S} ${A('had been')} ${V(verb.ving)}${objSuffix}.`;
          negHtml = `${S} ${A('had not been')} ${V(verb.ving)}${objSuffix}.`;
          intHtml = `${A('Had')} ${sLow} ${A('been')} ${V(verb.ving)}${objSuffix}?`;
          break;
        }
        case 'fut_simple': {
          affRaw = `${subj} will ${verb.v1}${objSuffix}.`;
          negRaw = `${subj} will not ${verb.v1}${objSuffix}.`;
          intRaw = `Will ${subjLower} ${verb.v1}${objSuffix}?`;
          affHtml = `${S} ${A('will')} ${V(verb.v1)}${objSuffix}.`;
          negHtml = `${S} ${A('will not')} ${V(verb.v1)}${objSuffix}.`;
          intHtml = `${A('Will')} ${sLow} ${V(verb.v1)}${objSuffix}?`;
          break;
        }
        case 'fut_cont': {
          affRaw = `${subj} will be ${verb.ving}${objSuffix}.`;
          negRaw = `${subj} will not be ${verb.ving}${objSuffix}.`;
          intRaw = `Will ${subjLower} be ${verb.ving}${objSuffix}?`;
          affHtml = `${S} ${A('will be')} ${V(verb.ving)}${objSuffix}.`;
          negHtml = `${S} ${A('will not be')} ${V(verb.ving)}${objSuffix}.`;
          intHtml = `${A('Will')} ${sLow} ${A('be')} ${V(verb.ving)}${objSuffix}?`;
          break;
        }
        case 'fut_perf': {
          const v3Clean = firstVariant(verb.v3);
          affRaw = `${subj} will have ${v3Clean}${objSuffix}.`;
          negRaw = `${subj} will not have ${v3Clean}${objSuffix}.`;
          intRaw = `Will ${subjLower} have ${v3Clean}${objSuffix}?`;
          affHtml = `${S} ${A('will have')} ${V(verb.v3)}${objSuffix}.`;
          negHtml = `${S} ${A('will not have')} ${V(verb.v3)}${objSuffix}.`;
          intHtml = `${A('Will')} ${sLow} ${A('have')} ${V(verb.v3)}${objSuffix}?`;
          break;
        }
        case 'fut_perf_cont': {
          affRaw = `${subj} will have been ${verb.ving}${objSuffix}.`;
          negRaw = `${subj} will not have been ${verb.ving}${objSuffix}.`;
          intRaw = `Will ${subjLower} have been ${verb.ving}${objSuffix}?`;
          affHtml = `${S} ${A('will have been')} ${V(verb.ving)}${objSuffix}.`;
          negHtml = `${S} ${A('will not have been')} ${V(verb.ving)}${objSuffix}.`;
          intHtml = `${A('Will')} ${sLow} ${A('have been')} ${V(verb.ving)}${objSuffix}?`;
          break;
        }
      }

      return { affRaw, negRaw, intRaw, affHtml, negHtml, intHtml };
    }

    function conjugatePassiveTense(tenseId, verb, subj) {
      const pSubj = (verb.passiveSubject || formatPassiveSubject(verb.activeObject) || 'It').trim();
      const pSubjLower = (pSubj === 'I') ? 'I' : (pSubj.charAt(0).toLowerCase() + pSubj.slice(1));
      const agent = PASSIVE_AGENT_MAP[subj] || 'by them';
      const v3Clean = firstVariant(verb.v3);

      const PS = `<span class="token-subj">${pSubj}</span>`;
      const psLow = `<span class="token-subj">${pSubjLower}</span>`;
      const BE = (txt) => `<span class="token-passive-be">${txt}</span>`;
      const V3 = `<span class="token-verb">${verb.v3}</span>`;
      const AG = `<span class="token-agent">${agent}</span>`;

      let affRaw = '', negRaw = '', intRaw = '';
      let affHtml = '', negHtml = '', intHtml = '';

      switch (tenseId) {
        case 'pres_simple':
          affRaw = `${pSubj} is ${v3Clean} ${agent}.`;
          negRaw = `${pSubj} is not ${v3Clean} ${agent}.`;
          intRaw = `Is ${pSubjLower} ${v3Clean} ${agent}?`;
          affHtml = `${PS} ${BE('is')} ${V3} ${AG}.`;
          negHtml = `${PS} ${BE('is not')} ${V3} ${AG}.`;
          intHtml = `${BE('Is')} ${psLow} ${V3} ${AG}?`;
          break;
        case 'pres_cont':
          affRaw = `${pSubj} is being ${v3Clean} ${agent}.`;
          negRaw = `${pSubj} is not being ${v3Clean} ${agent}.`;
          intRaw = `Is ${pSubjLower} being ${v3Clean} ${agent}?`;
          affHtml = `${PS} ${BE('is being')} ${V3} ${AG}.`;
          negHtml = `${PS} ${BE('is not being')} ${V3} ${AG}.`;
          intHtml = `${BE('Is')} ${psLow} ${BE('being')} ${V3} ${AG}?`;
          break;
        case 'pres_perf':
          affRaw = `${pSubj} has been ${v3Clean} ${agent}.`;
          negRaw = `${pSubj} has not been ${v3Clean} ${agent}.`;
          intRaw = `Has ${pSubjLower} been ${v3Clean} ${agent}?`;
          affHtml = `${PS} ${BE('has been')} ${V3} ${AG}.`;
          negHtml = `${PS} ${BE('has not been')} ${V3} ${AG}.`;
          intHtml = `${BE('Has')} ${psLow} ${BE('been')} ${V3} ${AG}?`;
          break;
        case 'pres_perf_cont':
          affRaw = `${pSubj} has been being ${v3Clean} ${agent}.`;
          negRaw = `${pSubj} has not been being ${v3Clean} ${agent}.`;
          intRaw = `Has ${pSubjLower} been being ${v3Clean} ${agent}?`;
          affHtml = `${PS} ${BE('has been being')} ${V3} ${AG}.`;
          negHtml = `${PS} ${BE('has not been being')} ${V3} ${AG}.`;
          intHtml = `${BE('Has')} ${psLow} ${BE('been being')} ${V3} ${AG}?`;
          break;
        case 'past_simple':
          affRaw = `${pSubj} was ${v3Clean} ${agent}.`;
          negRaw = `${pSubj} was not ${v3Clean} ${agent}.`;
          intRaw = `Was ${pSubjLower} ${v3Clean} ${agent}?`;
          affHtml = `${PS} ${BE('was')} ${V3} ${AG}.`;
          negHtml = `${PS} ${BE('was not')} ${V3} ${AG}.`;
          intHtml = `${BE('Was')} ${psLow} ${V3} ${AG}?`;
          break;
        case 'past_cont':
          affRaw = `${pSubj} was being ${v3Clean} ${agent}.`;
          negRaw = `${pSubj} was not being ${v3Clean} ${agent}.`;
          intRaw = `Was ${pSubjLower} being ${v3Clean} ${agent}?`;
          affHtml = `${PS} ${BE('was being')} ${V3} ${AG}.`;
          negHtml = `${PS} ${BE('was not being')} ${V3} ${AG}.`;
          intHtml = `${BE('Was')} ${psLow} ${BE('being')} ${V3} ${AG}?`;
          break;
        case 'past_perf':
          affRaw = `${pSubj} had been ${v3Clean} ${agent}.`;
          negRaw = `${pSubj} had not been ${v3Clean} ${agent}.`;
          intRaw = `Had ${pSubjLower} been ${v3Clean} ${agent}?`;
          affHtml = `${PS} ${BE('had been')} ${V3} ${AG}.`;
          negHtml = `${PS} ${BE('had not been')} ${V3} ${AG}.`;
          intHtml = `${BE('Had')} ${psLow} ${BE('been')} ${V3} ${AG}?`;
          break;
        case 'past_perf_cont':
          affRaw = `${pSubj} had been being ${v3Clean} ${agent}.`;
          negRaw = `${pSubj} had not been being ${v3Clean} ${agent}.`;
          intRaw = `Had ${pSubjLower} been being ${v3Clean} ${agent}?`;
          affHtml = `${PS} ${BE('had been being')} ${V3} ${AG}.`;
          negHtml = `${PS} ${BE('had not been being')} ${V3} ${AG}.`;
          intHtml = `${BE('Had')} ${psLow} ${BE('been being')} ${V3} ${AG}?`;
          break;
        case 'fut_simple':
          affRaw = `${pSubj} will be ${v3Clean} ${agent}.`;
          negRaw = `${pSubj} will not be ${v3Clean} ${agent}.`;
          intRaw = `Will ${pSubjLower} be ${v3Clean} ${agent}?`;
          affHtml = `${PS} ${BE('will be')} ${V3} ${AG}.`;
          negHtml = `${PS} ${BE('will not be')} ${V3} ${AG}.`;
          intHtml = `${BE('Will')} ${psLow} ${BE('be')} ${V3} ${AG}?`;
          break;
        case 'fut_cont':
          affRaw = `${pSubj} will be being ${v3Clean} ${agent}.`;
          negRaw = `${pSubj} will not be being ${v3Clean} ${agent}.`;
          intRaw = `Will ${pSubjLower} be being ${v3Clean} ${agent}?`;
          affHtml = `${PS} ${BE('will be being')} ${V3} ${AG}.`;
          negHtml = `${PS} ${BE('will not be being')} ${V3} ${AG}.`;
          intHtml = `${BE('Will')} ${psLow} ${BE('be being')} ${V3} ${AG}?`;
          break;
        case 'fut_perf':
          affRaw = `${pSubj} will have been ${v3Clean} ${agent}.`;
          negRaw = `${pSubj} will not have been ${v3Clean} ${agent}.`;
          intRaw = `Will ${pSubjLower} have been ${v3Clean} ${agent}?`;
          affHtml = `${PS} ${BE('will have been')} ${V3} ${AG}.`;
          negHtml = `${PS} ${BE('will not have been')} ${V3} ${AG}.`;
          intHtml = `${BE('Will')} ${psLow} ${BE('have been')} ${V3} ${AG}?`;
          break;
        case 'fut_perf_cont':
          affRaw = `${pSubj} will have been being ${v3Clean} ${agent}.`;
          negRaw = `${pSubj} will not have been being ${v3Clean} ${agent}.`;
          intRaw = `Will ${pSubjLower} have been being ${v3Clean} ${agent}?`;
          affHtml = `${PS} ${BE('will have been being')} ${V3} ${AG}.`;
          negHtml = `${PS} ${BE('will not have been being')} ${V3} ${AG}.`;
          intHtml = `${BE('Will')} ${psLow} ${BE('have been being')} ${V3} ${AG}?`;
          break;
      }

      return { affRaw, negRaw, intRaw, affHtml, negHtml, intHtml };
    }

    function generateTimelineSVG(tense) {
      const color = tense.timeframe === 'present' ? '#10B981' : (tense.timeframe === 'past' ? '#F59E0B' : '#06B6D4');
      const cx = tense.timeframe === 'past' ? 120 : (tense.timeframe === 'present' ? 240 : 360);

      let markerSvg = '';
      if (tense.aspect === 'simple') {
        markerSvg = `<circle cx="${cx}" cy="40" r="8" fill="${color}" /><circle cx="${cx}" cy="40" r="14" fill="${color}" fill-opacity="0.25" />`;
      } else if (tense.aspect === 'cont') {
        markerSvg = `
          <path d="M ${cx - 35} 40 Q ${cx - 17} 22, ${cx} 40 T ${cx + 35} 40" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>
          <circle cx="${cx}" cy="40" r="6" fill="${color}" />
        `;
      } else if (tense.aspect === 'perf') {
        markerSvg = `
          <line x1="${cx - 55}" y1="40" x2="${cx}" y2="40" stroke="${color}" stroke-width="4" stroke-dasharray="4 3" />
          <circle cx="${cx - 55}" cy="40" r="6" fill="${color}" />
          <circle cx="${cx}" cy="40" r="7" fill="${color}" />
        `;
      } else {
        markerSvg = `
          <rect x="${cx - 60}" y="33" width="60" height="14" rx="7" fill="${color}" fill-opacity="0.25" stroke="${color}" stroke-width="2" />
          <circle cx="${cx}" cy="40" r="6" fill="${color}" />
        `;
      }

      return `
        <svg viewBox="0 0 480 80" class="w-full h-full max-w-lg">
          <line x1="30" y1="40" x2="450" y2="40" stroke="currentColor" class="text-slate-300 dark:text-slate-700" stroke-width="2" />
          <line x1="120" y1="32" x2="120" y2="48" stroke="currentColor" class="text-slate-400 dark:text-slate-500" stroke-width="2" />
          <line x1="240" y1="26" x2="240" y2="54" stroke="currentColor" class="text-slate-500 dark:text-slate-400" stroke-width="2" />
          <line x1="360" y1="32" x2="360" y2="48" stroke="currentColor" class="text-slate-400 dark:text-slate-500" stroke-width="2" />
          <text x="120" y="68" text-anchor="middle" class="fill-amber-500 font-mono text-[10px]">PAST (Quá khứ)</text>
          <text x="240" y="70" text-anchor="middle" class="fill-emerald-400 font-mono font-bold text-[10px]">NOW (Hiện tại)</text>
          <text x="360" y="68" text-anchor="middle" class="fill-cyan-400 font-mono text-[10px]">FUTURE (Tương lai)</text>
          ${markerSvg}
        </svg>
      `;
    }

    let initialPins = ['write', 'go', 'be', 'have', 'do'];
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedPins = window.localStorage.getItem('leximatrix_pinned_verbs');
        if (savedPins) {
          const parsed = JSON.parse(savedPins);
          if (Array.isArray(parsed) && parsed.length > 0) {
            initialPins = parsed;
          }
        }
      }
    } catch (e) {}

    const state = {
      activeModule: 'matrix',
      verbKey: 'write',
      verbData: { ...VERB_DATABASE[0] },
      defaultActiveObject: VERB_DATABASE[0].activeObject,
      defaultPassiveSubject: VERB_DATABASE[0].passiveSubject,
      subject: 'I',
      polarity: 'aff',
      isPassive: false,
      layout: 'columns',
      activeTab: 'present',
      suggestionIndex: -1,
      selectedGrade: 6,
      fcIndex: 0,
      quizScore: 0,
      quizStreak: 0,
      quizTotal: 1,
      quizCorrectCount: 0,
      currentQuiz: null,
      patternFilter: 'all',
      leftSearchQuery: '',
      pinnedVerbs: initialPins
    };

    const verbInput = document.getElementById('verb-input');
    const btnClear = document.getElementById('btn-clear');
    const btnSearch = document.getElementById('btn-search');
    const suggestionsDropdown = document.getElementById('suggestions-dropdown');
    const quickChipsContainer = document.getElementById('quick-chips');

    const verbTypePill = document.getElementById('verb-type-pill');
    const verbTransitivityPill = document.getElementById('verb-transitivity-pill');
    const verbGradePill = document.getElementById('verb-grade-pill');
    const verbIpa = document.getElementById('verb-ipa');
    const heroVerbTitle = document.getElementById('hero-verb-title');
    const heroVerbMeaning = document.getElementById('hero-verb-meaning');
    const heroVerbContext = document.getElementById('hero-verb-context');
    const customWordNote = document.getElementById('custom-word-note');
    const customWordNoteText = document.getElementById('custom-word-note-text');
    const customObjectInput = document.getElementById('custom-object-input');

    const cellV1 = document.getElementById('cell-v1');
    const cellVs = document.getElementById('cell-vs');
    const cellV2 = document.getElementById('cell-v2');
    const cellV3 = document.getElementById('cell-v3');
    const cellVing = document.getElementById('cell-ving');

    const btnPassiveToggle = document.getElementById('btn-passive-toggle');
    const passiveSwitchTrack = document.getElementById('passive-switch-track');
    const passiveSwitchThumb = document.getElementById('passive-switch-thumb');
    const passiveStatusBadge = document.getElementById('passive-status-badge');
    const subjectLabel = document.getElementById('subject-label');
    const legendPassiveBe = document.getElementById('legend-passive-be');

    const matrixStage = document.getElementById('matrix-stage');
    const timeframeTabs = document.getElementById('timeframe-tabs');
    const toastEl = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');

    // Dual-Pane Electronic Lexicon Workstation DOM Elements
    const scratchpadChipsContainer = document.getElementById('scratchpad-chips-container');
    const btnPinCurrent = document.getElementById('btn-pin-current');

    const leftPaneSearch = document.getElementById('left-pane-search');
    const btnLeftSearchClear = document.getElementById('btn-left-search-clear');
    const leftPaneVerbList = document.getElementById('left-pane-verb-list');
    const leftPaneCountBadge = document.getElementById('left-pane-count-badge');
    const patternActiveDesc = document.getElementById('pattern-active-desc');
    const patternFilterBar = document.getElementById('pattern-filter-bar');
    const auxVs = document.getElementById('aux-vs');
    const auxVing = document.getElementById('aux-ving');
    const auxTrans = document.getElementById('aux-trans');

    const reverseResolutionBanner = document.getElementById('reverse-resolution-banner');
    const reverseResolutionText = document.getElementById('reverse-resolution-text');
    const dictCefrPill = document.getElementById('dict-cefr-pill');
    const dictAnchorSentences = document.getElementById('dict-anchor-sentences');
    const dictCollocationsContainer = document.getElementById('dict-collocations-container');
    const dictSynonymsContainer = document.getElementById('dict-synonyms-container');

    function classifyVerbPattern(verb) {
      if (!verb) return 'REGULAR';
      if (!verb.isIrregular) return 'REGULAR';
      const v1 = (verb.v1 || '').toLowerCase().trim();
      const v2 = (verb.v2 || '').toLowerCase().split('/')[0].trim();
      const v3 = (verb.v3 || '').toLowerCase().split('/')[0].trim();
      if (v1 === v2 && v2 === v3) return 'A-A-A';
      if (v2 === v3 && v1 !== v2) return 'A-B-B';
      if (v1 === v3 && v1 !== v2) return 'A-B-A';
      if (v1 !== v2 && v2 !== v3 && v1 !== v3) return 'A-B-C';
      return 'A-B-B';
    }

    function resolveInflectedForm(rawQuery) {
      const q = (rawQuery || '').toLowerCase().trim();
      if (!q) return null;

      const directRoot = VERB_DATABASE.find(item => (item.v1 || '').toLowerCase() === q);
      if (directRoot) return null;

      for (const item of VERB_DATABASE) {
        const v2Variants = (item.v2 || '').toLowerCase().split('/').map(s => s.trim());
        const v3Variants = (item.v3 || '').toLowerCase().split('/').map(s => s.trim());
        const vingVariants = (item.ving || '').toLowerCase().split('/').map(s => s.trim());

        const isV2 = v2Variants.includes(q);
        const isV3 = v3Variants.includes(q);
        const isVing = vingVariants.includes(q);

        if (isV2 && isV3) {
          return {
            rootVerb: item,
            formDescription: 'Quá khứ (V2) & Phân từ (V3)',
            pattern: classifyVerbPattern(item)
          };
        } else if (isV2) {
          return {
            rootVerb: item,
            formDescription: 'Quá khứ (V2)',
            pattern: classifyVerbPattern(item)
          };
        } else if (isV3) {
          return {
            rootVerb: item,
            formDescription: 'Phân từ hoàn thành (V3)',
            pattern: classifyVerbPattern(item)
          };
        } else if (isVing) {
          return {
            rootVerb: item,
            formDescription: 'Tiếp diễn (V-ing)',
            pattern: classifyVerbPattern(item)
          };
        }
      }
      return null;
    }

    const VERB_COLLOCATIONS_MAP = {
      write: ["write down", "write to someone", "write an essay", "write in ink", "write back"],
      make: ["make a decision", "make friends", "make mistakes", "make progress", "make sure"],
      take: ["take notes", "take care of", "take part in", "take time", "take a look"],
      build: ["build up", "build a bridge", "build confidence", "build a career", "rebuild"],
      go: ["go to school", "go for a walk", "go on holiday", "go abroad", "go out"],
      come: ["come back", "come from", "come across", "come true", "come in"],
      run: ["run away", "run into", "run out of", "run a business", "run fast"],
      speak: ["speak English", "speak up", "speak to someone", "speak fluently", "speak out"],
      know: ["know about", "know how to", "get to know", "well-known", "let someone know"],
      do: ["do homework", "do exercise", "do the laundry", "do one's best", "do good"],
      have: ["have breakfast", "have a meeting", "have fun", "have time", "have an idea"],
      be: ["be good at", "be interested in", "be ready for", "be able to", "be proud of"],
      get: ["get up", "get on with", "get ready", "get in touch", "get over"],
      give: ["give up", "give away", "give back", "give advice", "give in"],
      find: ["find out", "find a solution", "find it easy", "find fault with", "find time"],
      think: ["think about", "think of", "think twice", "think carefully", "think over"],
      see: ["see off", "see eye to eye", "let me see", "see someone later", "see through"],
      eat: ["eat out", "eat healthy", "eat up", "eat an apple", "eat breakfast"],
      cut: ["cut down on", "cut off", "cut out", "cut in pieces", "shortcut"],
      keep: ["keep in touch", "keep quiet", "keep an eye on", "keep going", "keep calm"],
      teach: ["teach English", "teach a lesson", "teach someone to", "teach oneself"],
      buy: ["buy online", "buy for someone", "buy from a store", "buy in bulk"],
      drive: ["drive a car", "drive someone crazy", "test drive", "drive safely"],
      break: ["break down", "break up", "break the ice", "break a promise"],
      bring: ["bring up", "bring about", "bring back", "bring together"],
      choose: ["choose between", "choose carefully", "choose from"],
      fall: ["fall in love", "fall down", "fall asleep", "fall apart"],
      feel: ["feel like", "feel happy", "feel free", "feel well"],
      grow: ["grow up", "grow fast", "grow plants", "grow old"],
      hear: ["hear from", "hear of", "hear about", "hear clearly"],
      hold: ["hold on", "hold a meeting", "hold hands", "hold back"],
      leave: ["leave for", "leave behind", "leave early", "leave alone"],
      meet: ["meet with", "meet deadlines", "nice to meet you", "meet friends"],
      pay: ["pay for", "pay attention to", "pay back", "pay off"],
      read: ["read aloud", "read widely", "read through", "read books"],
      send: ["send an email", "send out", "send for", "send back"],
      stand: ["stand up", "stand by", "stand for", "stand out"],
      tell: ["tell the truth", "tell a story", "tell a lie", "tell off"],
      understand: ["understand clearly", "make understood", "try to understand"],
      win: ["win a prize", "win a game", "win a scholarship", "win hearts"]
    };

    function getSynonymsForWord(word) {
      const w = (word || '').toLowerCase().trim();
      if (typeof window !== 'undefined' && window.CurriculumPipeline && window.CurriculumPipeline.CURRICULUM_CLUSTERS) {
        const clusters = Object.values(window.CurriculumPipeline.CURRICULUM_CLUSTERS);
        for (const cl of clusters) {
          if (cl.words && cl.words.includes(w)) {
            return cl.words.filter(x => x !== w);
          }
        }
      }
      const fallbackSynonymsMap = {
        write: ['compose', 'draft', 'author', 'record', 'create'],
        make: ['create', 'produce', 'build', 'craft', 'construct'],
        build: ['construct', 'make', 'create', 'develop', 'erect'],
        take: ['seize', 'grab', 'capture', 'hold', 'acquire'],
        eat: ['consume', 'dine', 'ingest', 'swallow', 'feast'],
        go: ['move', 'proceed', 'travel', 'depart', 'head'],
        come: ['arrive', 'approach', 'reach', 'enter'],
        run: ['sprint', 'jog', 'race', 'operate', 'function'],
        speak: ['talk', 'say', 'tell', 'converse', 'pronounce'],
        know: ['understand', 'comprehend', 'recognize', 'realize'],
        see: ['look', 'watch', 'observe', 'view', 'spot'],
        do: ['perform', 'execute', 'carry out', 'accomplish'],
        have: ['possess', 'own', 'hold', 'experience'],
        be: ['exist', 'live', 'remain'],
        get: ['receive', 'obtain', 'acquire', 'gain', 'fetch'],
        give: ['donate', 'provide', 'offer', 'grant', 'hand'],
        find: ['discover', 'locate', 'uncover', 'detect'],
        think: ['ponder', 'consider', 'reflect', 'reason', 'believe'],
        buy: ['purchase', 'procure', 'acquire', 'order'],
        teach: ['educate', 'instruct', 'train', 'guide', 'coach'],
        keep: ['retain', 'hold', 'maintain', 'preserve', 'save'],
        cut: ['slice', 'chop', 'sever', 'trim', 'divide'],
        drive: ['steer', 'navigate', 'operate', 'pilot'],
        break: ['shatter', 'fracture', 'smash', 'crack'],
        bring: ['fetch', 'carry', 'deliver', 'transport'],
        choose: ['select', 'pick', 'opt', 'decide'],
        fall: ['drop', 'descend', 'collapse', 'tumble'],
        feel: ['sense', 'perceive', 'experience'],
        grow: ['develop', 'expand', 'increase', 'mature'],
        hear: ['listen', 'perceive', 'catch'],
        hold: ['grasp', 'clutch', 'maintain'],
        leave: ['depart', 'exit', 'abandon', 'quit'],
        meet: ['encounter', 'greet', 'converge'],
        pay: ['compensate', 'remunerate', 'settle'],
        read: ['peruse', 'scan', 'study'],
        send: ['transmit', 'dispatch', 'forward'],
        stand: ['rise', 'endure', 'tolerate'],
        tell: ['inform', 'narrate', 'notify'],
        understand: ['comprehend', 'grasp', 'fathom'],
        win: ['triumph', 'succeed', 'prevail', 'conquer']
      };
      return fallbackSynonymsMap[w] || ['start', 'continue', 'finish'];
    }

    let availableVoices = [];
    function loadSpeechVoices() {
      if (!('speechSynthesis' in window)) return;
      availableVoices = window.speechSynthesis.getVoices() || [];
    }
    if ('speechSynthesis' in window) {
      loadSpeechVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadSpeechVoices;
      }
    }

    function pickBestVoice(lang = 'en-US') {
      if (!availableVoices.length) loadSpeechVoices();
      const isUK = lang.toLowerCase().includes('gb') || lang.toLowerCase().includes('uk');
      const preferredNames = isUK
        ? ['Google UK English Female', 'Google UK English Male', 'Microsoft Sonia', 'Daniel', 'Serena']
        : ['Google US English', 'Microsoft Aria', 'Microsoft Jenny', 'Samantha', 'Alex'];
      for (const name of preferredNames) {
        const found = availableVoices.find(v => v.name.includes(name));
        if (found) return found;
      }
      const exactLang = availableVoices.find(v => v.lang && v.lang.toLowerCase() === lang.toLowerCase());
      if (exactLang) return exactLang;
      return availableVoices.find(v => v.lang && v.lang.toLowerCase().startsWith('en')) || null;
    }

    function speak(text, lang = 'en-US', triggerEl = null) {
      if (!('speechSynthesis' in window)) {
        showToast('Trình duyệt của bạn không hỗ trợ Web Speech API');
        return;
      }
      window.speechSynthesis.cancel();
      const cleanText = (text || '').replace(/\//g, ' or ').trim();
      if (!cleanText) return;

      const utter = new SpeechSynthesisUtterance(cleanText);
      const chosenVoice = pickBestVoice(lang);
      if (chosenVoice) utter.voice = chosenVoice;
      utter.lang = lang;
      utter.rate = 0.93;
      utter.pitch = 1.0;

      const accentTag = lang.includes('GB') ? 'UK' : 'US';
      showToast(`🔊 Đang đọc (${accentTag}): "${cleanText}"`);

      if (triggerEl) {
        triggerEl.classList.add('is-speaking');
        utter.onend = () => triggerEl.classList.remove('is-speaking');
        utter.onerror = () => triggerEl.classList.remove('is-speaking');
      }
      window.speechSynthesis.speak(utter);
    }

    function copyText(text) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        showToast(`Đã sao chép: "${text}"`);
      } catch (e) {
        showToast('Không thể sao chép');
      }
      document.body.removeChild(ta);
    }

    let toastTimer = null;
    function showToast(msg) {
      toastMsg.textContent = msg;
      toastEl.classList.remove('translate-y-20', 'opacity-0');
      toastEl.classList.add('translate-y-0', 'opacity-100');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toastEl.classList.add('translate-y-20', 'opacity-0');
        toastEl.classList.remove('translate-y-0', 'opacity-100');
      }, 2200);
    }

    function renderHeroDictionary() {
      const d = state.verbData;
      heroVerbTitle.textContent = d.v1;
      verbIpa.textContent = d.ipaUS || `/${d.v1}/`;
      heroVerbMeaning.textContent = d.meaning;
      if (verbGradePill) {
        verbGradePill.textContent = `SGK Lớp ${d.grade || 6}`;
      }

      if (state.isPassive && d.isTransitive) {
        const pSubj = d.passiveSubject || formatPassiveSubject(d.activeObject);
        heroVerbContext.textContent = `Bị động: "${pSubj}" + be + ${d.v3} + ${PASSIVE_AGENT_MAP[state.subject]}`;
      } else {
        heroVerbContext.textContent = d.activeObject ? `+ ${d.activeObject}` : `(Không kèm tân ngữ)`;
      }

      if (document.activeElement !== customObjectInput) {
        customObjectInput.value = d.activeObject || '';
      }

      if (d.customNote) {
        customWordNote.classList.remove('hidden');
        customWordNoteText.innerHTML = d.customNote;
      } else {
        customWordNote.classList.add('hidden');
        customWordNoteText.innerHTML = '';
      }

      if (!d.isIrregular) {
        verbTypePill.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-400/35';
        verbTypePill.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> <span>Động từ Có quy tắc (Regular)</span>`;
      } else {
        verbTypePill.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-400/35';
        verbTypePill.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span> <span>Động từ Bất quy tắc (Irregular)</span>`;
      }

      if (d.isTransitive) {
        verbTransitivityPill.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-400/35 hover:bg-emerald-500/25 transition-all cursor-pointer select-none';
        verbTransitivityPill.innerHTML = `
          <svg class="w-3.5 h-3.5 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 10h14l-4-4"/><path d="M17 14H3l4 4"/>
          </svg>
          <span class="font-mono font-bold">[vt.]</span>
          <span>Ngoại động từ (Có bị động)</span>
        `;
      } else {
        verbTransitivityPill.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-400/35 hover:bg-rose-500/25 transition-all cursor-pointer select-none';
        verbTransitivityPill.innerHTML = `
          <svg class="w-3.5 h-3.5 shrink-0 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
          </svg>
          <span class="font-mono font-bold">[vi.]</span>
          <span>Nội động từ (Không bị động)</span>
        `;
      }

      cellV1.textContent = d.v1;
      cellVs.textContent = d.vs;
      cellV2.textContent = d.v2;
      cellV3.textContent = d.v3;
      cellVing.textContent = d.ving;

      document.querySelectorAll('.quick-chip-btn').forEach(btn => {
        const verbObj = VERB_DATABASE.find(x => x.v1 === btn.dataset.verb);
        const isIntrans = verbObj && !verbObj.isTransitive;
        if (btn.dataset.verb === d.v1) {
          btn.className = 'quick-chip-btn shrink-0 px-3 py-1 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-sm transition-all cursor-pointer';
        } else {
          btn.className = `quick-chip-btn shrink-0 px-3 py-1 rounded-xl text-xs font-mono font-medium bg-white/80 dark:bg-slate-900/90 ${isIntrans ? 'text-amber-600 dark:text-amber-300' : 'text-slate-600 dark:text-slate-300'} hover:border-cyan-400 border border-slate-300 dark:border-slate-700/80 transition-all cursor-pointer`;
        }
      });

      // Update CEFR Band Indicator
      if (dictCefrPill) {
        const g = Number(d.grade || 6);
        let band = 'CEFR A1';
        if (g <= 5) band = 'CEFR A1';
        else if (g <= 7) band = 'CEFR A2';
        else if (g <= 9) band = 'CEFR A2+';
        else band = 'CEFR B1-B2';
        dictCefrPill.textContent = band;
      }

      // Render 3 Bilingual Contextual Anchor Sentences
      if (dictAnchorSentences) {
        const cleanMeaning = (d.meaning || '').split(',')[0].trim();
        const v1 = d.v1;
        const v2 = firstVariant(d.v2);
        const v3 = firstVariant(d.v3);
        const obj = d.activeObject ? d.activeObject.trim() : '';

        const s1EN = `I usually ${v1}${obj ? ' ' + obj : ''} every day.`;
        const s1VN = `Tôi thường ${cleanMeaning}${obj ? ' ' + obj : ' mọi thứ'} mỗi ngày.`;

        const s2EN = `Yesterday, they ${v2}${obj ? ' ' + obj : ' an important project'}.`;
        const s2VN = `Hôm qua, họ đã ${cleanMeaning}${obj ? ' ' + obj : ' một dự án quan trọng'}.`;

        let s3EN = '';
        let s3VN = '';
        let s3Label = '';
        if (d.isTransitive) {
          s3Label = 'Bị động (Passive)';
          const pSubj = d.passiveSubject || 'The task';
          s3EN = `${pSubj} was ${v3} by the team.`;
          s3VN = `${pSubj} đã được ${cleanMeaning} bởi cả nhóm.`;
        } else {
          s3Label = 'Hoàn thành (Perfect)';
          s3EN = `They have ${v3} successfully.`;
          s3VN = `Họ đã ${cleanMeaning} thành công.`;
        }

        dictAnchorSentences.innerHTML = `
          <div class="anchor-card p-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-950/80 border border-slate-300 dark:border-violet-500/25 flex flex-col justify-between gap-1.5 shadow-xs">
            <div class="flex items-center justify-between text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
              <span>Hiện tại (Present)</span>
              <button type="button" class="btn-anchor-speak w-6 h-6 rounded flex items-center justify-center hover:bg-cyan-500/15 hover:text-cyan-400 transition-colors" title="Nghe câu" data-sentence="${s1EN.replace(/"/g, '&quot;')}">
                <i class="fa-solid fa-volume-high text-xs"></i>
              </button>
            </div>
            <p class="font-mono text-xs font-semibold text-slate-800 dark:text-slate-100 leading-snug">${s1EN}</p>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 italic">${s1VN}</p>
          </div>

          <div class="anchor-card p-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-950/80 border border-slate-300 dark:border-violet-500/25 flex flex-col justify-between gap-1.5 shadow-xs">
            <div class="flex items-center justify-between text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">
              <span>Quá khứ (Past)</span>
              <button type="button" class="btn-anchor-speak w-6 h-6 rounded flex items-center justify-center hover:bg-amber-500/15 hover:text-amber-400 transition-colors" title="Nghe câu" data-sentence="${s2EN.replace(/"/g, '&quot;')}">
                <i class="fa-solid fa-volume-high text-xs"></i>
              </button>
            </div>
            <p class="font-mono text-xs font-semibold text-slate-800 dark:text-slate-100 leading-snug">${s2EN}</p>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 italic">${s2VN}</p>
          </div>

          <div class="anchor-card p-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-950/80 border border-slate-300 dark:border-violet-500/25 flex flex-col justify-between gap-1.5 shadow-xs">
            <div class="flex items-center justify-between text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold">
              <span>${s3Label}</span>
              <button type="button" class="btn-anchor-speak w-6 h-6 rounded flex items-center justify-center hover:bg-purple-500/15 hover:text-purple-400 transition-colors" title="Nghe câu" data-sentence="${s3EN.replace(/"/g, '&quot;')}">
                <i class="fa-solid fa-volume-high text-xs"></i>
              </button>
            </div>
            <p class="font-mono text-xs font-semibold text-slate-800 dark:text-slate-100 leading-snug">${s3EN}</p>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 italic">${s3VN}</p>
          </div>
        `;

        dictAnchorSentences.querySelectorAll('.btn-anchor-speak').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const s = btn.dataset.sentence;
            if (s) speak(s, 'en-US', btn);
          });
        });
      }

      // Render Collocations & Preposition Partners
      if (dictCollocationsContainer) {
        dictCollocationsContainer.innerHTML = '';
        const v1 = d.v1.toLowerCase();
        let collocs = VERB_COLLOCATIONS_MAP[v1];
        if (!collocs || collocs.length === 0) {
          const defaultObj = d.activeObject ? d.activeObject.trim() : 'something';
          collocs = [
            `${d.v1} ${defaultObj}`,
            `${d.v1} with`,
            `${d.v1} about`,
            `${d.v1} together`
          ];
        }
        collocs.forEach(c => {
          const pill = document.createElement('span');
          pill.className = 'px-2 py-0.5 rounded-lg text-[11px] font-mono font-medium bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-400/25 hover:bg-cyan-500/20 cursor-pointer transition-colors';
          pill.textContent = c;
          pill.title = 'Bấm để nghe phát âm';
          pill.addEventListener('click', () => speak(c, 'en-US', pill));
          dictCollocationsContainer.appendChild(pill);
        });
      }

      // Render Synonyms from Semantic Clusters
      if (dictSynonymsContainer) {
        dictSynonymsContainer.innerHTML = '';
        const v1 = d.v1.toLowerCase();
        const synonyms = getSynonymsForWord(v1);

        synonyms.forEach(syn => {
          const pill = document.createElement('span');
          pill.className = 'px-2 py-0.5 rounded-lg text-[11px] font-mono font-medium bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-400/25 hover:bg-violet-500/20 cursor-pointer transition-colors';
          pill.textContent = syn;
          pill.title = 'Bấm để tra cứu hoặc nghe từ đồng nghĩa';
          pill.addEventListener('click', () => {
            if (VERB_DATABASE.some(x => x.v1 === syn)) {
              selectVerb(syn);
            } else {
              speak(syn, 'en-US', pill);
            }
          });
          dictSynonymsContainer.appendChild(pill);
        });
      }
    }

    function createTenseCardElement(tense) {
      const isPas = state.isPassive;
      const canPassive = state.verbData.isTransitive;
      const conj = conjugateTense(tense.id, state.verbData, state.subject, isPas && canPassive);

      const themeClass = `theme-${tense.timeframe}`;
      let badgeStyle = 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-400/35';
      let periodLabel = 'Hiện tại';

      if (tense.timeframe === 'past') {
        badgeStyle = 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-400/35';
        periodLabel = 'Quá khứ';
      } else if (tense.timeframe === 'future') {
        badgeStyle = 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-400/35';
        periodLabel = 'Tương lai';
      }

      const aspectLabels = {
        simple: 'Đơn (Simple)',
        cont: 'Tiếp diễn (Cont.)',
        perf: 'Hoàn thành (Perfect)',
        perf_cont: 'HT Tiếp diễn'
      };

      let primaryRaw = conj.affRaw;
      let primaryHtml = conj.affHtml;
      if (state.polarity === 'neg') {
        primaryRaw = conj.negRaw;
        primaryHtml = conj.negHtml;
      } else if (state.polarity === 'int') {
        primaryRaw = conj.intRaw;
        primaryHtml = conj.intHtml;
      }

      const speakerSvg = `<svg class="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover/sent:text-cyan-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;

      let sentenceDisplayBlock = '';

      if (isPas && !canPassive) {
        sentenceDisplayBlock = `
          <div class="my-3.5 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-900 dark:text-amber-200 space-y-1.5">
            <div class="flex items-center gap-2 text-xs font-bold">
              <i class="fa-solid fa-triangle-exclamation text-amber-400"></i>
              <span>Nội động từ ([vi.]), không chia ở thể bị động</span>
            </div>
            <p class="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Từ <code class="font-mono font-bold text-amber-500 dark:text-amber-300">"${state.verbData.v1}"</code> không tác động trực tiếp lên tân ngữ.
            </p>
          </div>
        `;
      } else if (state.polarity === 'all') {
        sentenceDisplayBlock = `
          <div class="space-y-2 my-3">
            <div data-speak-text="${conj.affRaw.replace(/"/g, '&quot;')}" class="sent-speak-row group/sent cursor-pointer p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-950/75 hover:border-emerald-400/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 transition-all">
              <div class="text-xs sm:text-sm leading-snug">
                <span class="font-mono text-[10px] font-bold text-emerald-500 mr-1.5">[+]</span>
                ${conj.affHtml}
              </div>
              ${speakerSvg}
            </div>
            <div data-speak-text="${conj.negRaw.replace(/"/g, '&quot;')}" class="sent-speak-row group/sent cursor-pointer p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-950/75 hover:border-rose-400/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 transition-all">
              <div class="text-xs sm:text-sm leading-snug">
                <span class="font-mono text-[10px] font-bold text-rose-400 mr-1.5">[−]</span>
                ${conj.negHtml}
              </div>
              ${speakerSvg}
            </div>
            <div data-speak-text="${conj.intRaw.replace(/"/g, '&quot;')}" class="sent-speak-row group/sent cursor-pointer p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-950/75 hover:border-cyan-400/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 transition-all">
              <div class="text-xs sm:text-sm leading-snug">
                <span class="font-mono text-[10px] font-bold text-cyan-400 mr-1.5">[?]</span>
                ${conj.intHtml}
              </div>
              ${speakerSvg}
            </div>
          </div>
        `;
      } else {
        const modeTitle = state.polarity === 'aff'
          ? (isPas ? '+ Bị động Khẳng định' : '+ Câu khẳng định')
          : (state.polarity === 'neg'
            ? (isPas ? '− Bị động Phủ định' : '− Câu phủ định')
            : (isPas ? '? Bị động Nghi vấn' : '? Câu nghi vấn'));

        sentenceDisplayBlock = `
          <div data-speak-text="${primaryRaw.replace(/"/g, '&quot;')}" title="Nhấn để nghe phát âm câu này" class="sent-speak-row cursor-pointer my-2.5 p-3 rounded-xl bg-slate-100/90 dark:bg-slate-950/85 hover:bg-slate-200/50 dark:hover:bg-slate-900 border ${isPas ? 'border-violet-400/45' : 'border-slate-200/90 dark:border-slate-800/90'} transition-all group/sent">
            <div class="flex items-center justify-between mb-1.5">
              <span class="font-mono text-[10px] uppercase tracking-wider ${isPas ? 'text-violet-500 dark:text-violet-300 font-bold' : 'text-slate-400 dark:text-slate-400'}">
                ${modeTitle}
              </span>
              ${speakerSvg}
            </div>
            <p class="text-base sm:text-[17px] leading-relaxed text-slate-900 dark:text-slate-100">
              ${primaryHtml}
            </p>
          </div>
        `;
      }

      const activeOrPassiveFormula = isPas ? tense.passiveFormula : tense.formula;

      const card = document.createElement('article');
      card.id = tense.id;
      card.className = `bento-card ${themeClass} rounded-2xl p-4 flex flex-col justify-between animate-card-in`;

      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between gap-2 mb-2">
            <div class="flex flex-wrap items-center gap-1.5">
              <span class="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${badgeStyle}">
                ${periodLabel}
              </span>
              <span class="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300">
                ${aspectLabels[tense.aspect]}
              </span>
              ${isPas ? `<span class="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 border border-violet-400/35">Passive</span>` : ''}
            </div>

            <div class="flex items-center gap-1">
              <button type="button" class="btn-card-speak w-8 h-8 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer" title="Nghe phát âm câu" aria-label="Nghe phát âm câu">
                <i class="fa-solid fa-volume-high text-xs" aria-hidden="true"></i>
              </button>
              <button type="button" class="btn-card-copy w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer" title="Sao chép câu" aria-label="Sao chép câu">
                <i class="fa-regular fa-copy text-xs" aria-hidden="true"></i>
              </button>
            </div>
          </div>

          <div class="flex items-baseline justify-between gap-2">
            <h3 class="font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">${tense.viTitle}</h3>
            <span class="font-mono text-[11px] text-slate-400 dark:text-slate-400">${tense.enTitle}</span>
          </div>

          <p class="text-xs text-slate-500 dark:text-slate-300 mt-1 line-clamp-1">${tense.summary}</p>

          ${sentenceDisplayBlock}
        </div>

        <div class="pt-3 border-t border-slate-200/80 dark:border-slate-800/90 flex items-center justify-between gap-2">
          <div class="font-mono text-[11px] sm:text-xs font-bold ${isPas ? 'text-violet-600 dark:text-violet-300 bg-violet-500/15' : 'text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/90'} px-2.5 py-1 rounded-lg truncate" title="${activeOrPassiveFormula}">
            ${activeOrPassiveFormula}
          </div>
          <button type="button" class="btn-card-detail px-3 py-1.5 rounded-xl text-xs font-bold text-cyan-600 dark:text-cyan-300 hover:bg-cyan-500/15 inline-flex items-center gap-1 shrink-0 transition-colors cursor-pointer">
            <span>Chi tiết</span>
            <span class="font-mono text-[11px]">[↗]</span>
          </button>
        </div>
      `;

      card.querySelectorAll('.sent-speak-row').forEach(row => {
        row.addEventListener('click', () => speak(row.dataset.speakText, 'en-US', row));
      });

      const speakBtn = card.querySelector('.btn-card-speak');
      if (speakBtn) {
        speakBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (isPas && !canPassive) {
            showToast(`"${state.verbData.v1}" là Nội động từ [vi.], không có câu bị động.`);
            return;
          }
          speak(primaryRaw, 'en-US', speakBtn);
        });
      }

      const copyBtn = card.querySelector('.btn-card-copy');
      if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (isPas && !canPassive) {
            showToast(`"${state.verbData.v1}" là Nội động từ [vi.], không có câu bị động.`);
            return;
          }
          copyText(primaryRaw);
        });
      }

      const detailBtn = card.querySelector('.btn-card-detail');
      if (detailBtn) {
        detailBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openDetailModal(tense);
        });
      }

      return card;
    }

    function renderMatrix() {
      matrixStage.innerHTML = '';

      if (state.isPassive && !state.verbData.isTransitive) {
        const noticeBanner = document.createElement('div');
        noticeBanner.className = 'p-4 sm:p-5 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-card-in';
        noticeBanner.innerHTML = `
          <div class="flex items-start gap-3.5">
            <div class="w-9 h-9 rounded-xl bg-amber-500/25 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <h4 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Động từ "${state.verbData.v1}" (${state.verbData.meaning}) là Nội động từ ([vi.]), không chia ở thể bị động
              </h4>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                Chỉ <strong>Ngoại động từ ([vt.])</strong> có tân ngữ trực tiếp mới chuyển được sang câu Bị động (<code>S + be + V3/ed</code>).
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button id="btn-banner-try-transitive" type="button" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition-all cursor-pointer">
              Thử từ "write"
            </button>
            <button id="btn-banner-exit-passive" type="button" class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 transition-all cursor-pointer">
              Về Chủ động
            </button>
          </div>
        `;
        matrixStage.appendChild(noticeBanner);
        const tryTransBtn = noticeBanner.querySelector('#btn-banner-try-transitive');
        if (tryTransBtn) tryTransBtn.addEventListener('click', () => selectVerb('write'));
        const exitPasBtn = noticeBanner.querySelector('#btn-banner-exit-passive');
        if (exitPasBtn) exitPasBtn.addEventListener('click', () => togglePassiveMode(false));
      }

      if (state.layout === 'columns') {
        const headerRow = document.createElement('div');
        headerRow.className = 'hidden lg:grid lg:grid-cols-3 gap-5';
        headerRow.innerHTML = `
          <div class="flex items-center justify-between px-4 py-3 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs uppercase tracking-wider shadow-sm">
            <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span> 1. Hiện tại (Present)</span>
            <span class="font-mono text-[11px] opacity-85">4 trạng thái</span>
          </div>
          <div class="flex items-center justify-between px-4 py-3 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-700 dark:text-amber-300 font-extrabold text-xs uppercase tracking-wider shadow-sm">
            <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400"></span> 2. Quá khứ (Past)</span>
            <span class="font-mono text-[11px] opacity-85">4 trạng thái</span>
          </div>
          <div class="flex items-center justify-between px-4 py-3 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-700 dark:text-cyan-300 font-extrabold text-xs uppercase tracking-wider shadow-sm">
            <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400"></span> 3. Tương lai (Future)</span>
            <span class="font-mono text-[11px] opacity-85">4 trạng thái</span>
          </div>
        `;
        matrixStage.appendChild(headerRow);

        const grid = document.createElement('div');
        grid.className = 'matrix-3col-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';

        for (let order = 1; order <= 4; order++) {
          ['present', 'past', 'future'].forEach(tf => {
            const match = TENSES.find(t => t.timeframe === tf && t.aspectOrder === order);
            if (match) grid.appendChild(createTenseCardElement(match));
          });
        }
        matrixStage.appendChild(grid);

      } else if (state.layout === 'aspects') {
        const aspectsMeta = [
          { order: 1, title: 'Hàng 1: Trạng thái ĐƠN (Simple)', subtitle: 'Sự kiện trọn vẹn, lặp lại hoặc sự thật hiển nhiên' },
          { order: 2, title: 'Hàng 2: Trạng thái TIẾP DIỄN (Continuous)', subtitle: 'Hành động đang diễn ra tại một thời điểm (be + V-ing)' },
          { order: 3, title: 'Hàng 3: Trạng thái HOÀN THÀNH (Perfect)', subtitle: 'Hành động hoàn tất trước một mốc thời gian (have/has/had + V3/ed)' },
          { order: 4, title: 'Hàng 4: HOÀN THÀNH TIẾP DIỄN (Perfect Continuous)', subtitle: 'Nhấn mạnh tính liên tục kéo dài (have/has/had been + V-ing)' }
        ];

        aspectsMeta.forEach(group => {
          const section = document.createElement('div');
          section.className = 'space-y-3';
          section.innerHTML = `
            <div class="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-200 dark:border-violet-500/25 pb-2">
              <h3 class="font-serif text-xl font-bold text-slate-900 dark:text-white">${group.title}</h3>
              <span class="text-xs text-slate-500 dark:text-slate-300">${group.subtitle}</span>
            </div>
          `;
          const rowGrid = document.createElement('div');
          rowGrid.className = 'grid grid-cols-1 lg:grid-cols-3 gap-5';
          ['present', 'past', 'future'].forEach(tf => {
            const match = TENSES.find(t => t.timeframe === tf && t.aspectOrder === group.order);
            if (match) rowGrid.appendChild(createTenseCardElement(match));
          });
          section.appendChild(rowGrid);
          matrixStage.appendChild(section);
        });

      } else if (state.layout === 'tabs') {
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-5';
        TENSES.filter(t => t.timeframe === state.activeTab).forEach(tense => {
          grid.appendChild(createTenseCardElement(tense));
        });
        matrixStage.appendChild(grid);
      }
    }

    const detailModal = document.getElementById('detail-modal');
    const modalBadge = document.getElementById('modal-badge');
    const modalAspectBadge = document.getElementById('modal-aspect-badge');
    const modalTitle = document.getElementById('modal-title');
    const modalUsage = document.getElementById('modal-usage');
    const modalTimelineSvg = document.getElementById('modal-timeline-svg');
    const modalCurrentVerbTag = document.getElementById('modal-current-verb-tag');
    const modalSentences = document.getElementById('modal-sentences');

    const modalSec1Formulas = document.getElementById('modal-sec1-formulas');
    const modalSec2Signals = document.getElementById('modal-sec2-signals');
    const modalSec3Traps = document.getElementById('modal-sec3-traps');
    const modalSec4Tabs = document.getElementById('modal-sec4-tabs');
    const modalSec4Content = document.getElementById('modal-sec4-content');

    function openDetailModal(tense) {
      const actConj = conjugateTense(tense.id, state.verbData, state.subject, false);
      const pasConj = conjugateTense(tense.id, state.verbData, state.subject, true);

      modalTitle.textContent = `${tense.viTitle} (${tense.enTitle})`;
      modalUsage.textContent = tense.detailUsage;
      modalTimelineSvg.innerHTML = generateTimelineSVG(tense);
      modalCurrentVerbTag.textContent = `${state.verbData.v1} (${state.verbData.meaning}) • Chủ ngữ: ${state.subject}`;

      const aspectNames = {
        simple: 'Trạng thái Đơn (Simple)',
        cont: 'Trạng thái Tiếp diễn (Continuous)',
        perf: 'Trạng thái Hoàn thành (Perfect)',
        perf_cont: 'Hoàn thành Tiếp diễn (Perfect Continuous)'
      };
      modalAspectBadge.textContent = aspectNames[tense.aspect];

      if (tense.timeframe === 'present') {
        modalBadge.className = 'inline-block font-mono text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400';
        modalBadge.textContent = '1. Mốc Hiện tại • Present';
      } else if (tense.timeframe === 'past') {
        modalBadge.className = 'inline-block font-mono text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400';
        modalBadge.textContent = '2. Mốc Quá khứ • Past';
      } else {
        modalBadge.className = 'inline-block font-mono text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400';
        modalBadge.textContent = '3. Mốc Tương lai • Future';
      }

      const modalSpeakerSvg = `<i class="fa-solid fa-volume-high text-xs text-slate-400" aria-hidden="true"></i>`;

      const passiveRowHtml = state.verbData.isTransitive
        ? `
          <div data-modal-speak="${pasConj.affRaw.replace(/"/g, '&quot;')}" class="modal-speak-item cursor-pointer p-2.5 rounded-xl bg-violet-500/15 hover:bg-violet-500/25 border border-violet-400/35 flex items-center justify-between gap-2 transition-colors">
            <div>
              <span class="font-mono text-[11px] font-bold text-violet-400 mr-2">[Bị động]</span>
              <span class="text-xs sm:text-sm font-medium">${pasConj.affHtml}</span>
            </div>
            ${modalSpeakerSvg}
          </div>
        `
        : `
          <div class="p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/35 text-xs text-amber-200 flex items-center gap-2">
            <i class="fa-solid fa-ban text-amber-400"></i>
            <span><strong>Bị động:</strong> Động từ "${state.verbData.v1}" là Nội động từ ([vi.]), không chia ở thể bị động.</span>
          </div>
        `;

      modalSentences.innerHTML = `
        <div data-modal-speak="${actConj.affRaw.replace(/"/g, '&quot;')}" class="modal-speak-item cursor-pointer p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-emerald-500/15 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 transition-colors">
          <div>
            <span class="font-mono text-[11px] font-bold text-emerald-400 mr-2">[+ Khẳng định]</span>
            <span class="text-xs sm:text-sm font-medium">${actConj.affHtml}</span>
          </div>
          ${modalSpeakerSvg}
        </div>
        <div data-modal-speak="${actConj.negRaw.replace(/"/g, '&quot;')}" class="modal-speak-item cursor-pointer p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-rose-500/15 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 transition-colors">
          <div>
            <span class="font-mono text-[11px] font-bold text-rose-400 mr-2">[− Phủ định]</span>
            <span class="text-xs sm:text-sm font-medium">${actConj.negHtml}</span>
          </div>
          ${modalSpeakerSvg}
        </div>
        <div data-modal-speak="${actConj.intRaw.replace(/"/g, '&quot;')}" class="modal-speak-item cursor-pointer p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-cyan-500/15 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 transition-colors">
          <div>
            <span class="font-mono text-[11px] font-bold text-cyan-400 mr-2">[? Nghi vấn]</span>
            <span class="text-xs sm:text-sm font-medium">${actConj.intHtml}</span>
          </div>
          ${modalSpeakerSvg}
        </div>
        ${passiveRowHtml}
      `;

      modalSentences.querySelectorAll('.modal-speak-item').forEach(el => {
        el.addEventListener('click', () => speak(el.dataset.modalSpeak, 'en-US', el));
      });

      modalSec1Formulas.innerHTML = `
        <div class="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <span class="text-emerald-400 font-bold">(+) Khẳng định:</span>
          <span class="text-slate-900 dark:text-white font-semibold">${tense.formulasAll.aff}</span>
        </div>
        <div class="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <span class="text-rose-400 font-bold">(−) Phủ định:</span>
          <span class="text-slate-900 dark:text-white font-semibold">${tense.formulasAll.neg}</span>
        </div>
        <div class="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <span class="text-cyan-400 font-bold">(?) Nghi vấn:</span>
          <span class="text-slate-900 dark:text-white font-semibold">${tense.formulasAll.int}</span>
        </div>
        <div class="p-2.5 rounded-xl bg-violet-500/15 border border-violet-400/35 flex items-center justify-between gap-2">
          <span class="text-violet-300 font-bold">⇄ Bị động:</span>
          <span class="text-violet-200 font-semibold text-right">${tense.formulasAll.pas}</span>
        </div>
      `;

      modalSec2Signals.innerHTML = tense.signalBullets.map(item => `
        <li class="flex items-start gap-2.5 leading-relaxed">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
          <span>${item}</span>
        </li>
      `).join('');

      modalSec3Traps.innerHTML = tense.grammarTraps.map(trap => `
        <li class="flex items-start gap-2.5 leading-relaxed">
          <i class="fa-solid fa-bolt text-amber-400 mt-1 text-xs shrink-0"></i>
          <span>${trap}</span>
        </li>
      `).join('');

      modalSec4Tabs.innerHTML = '';
      const extList = tense.extendedStructures || [];

      function renderExtTab(idx) {
        const ext = extList[idx];
        if (!ext) return;
        Array.from(modalSec4Tabs.children).forEach((b, i) => {
          if (i === idx) {
            b.className = 'px-2.5 py-1 rounded-lg text-xs font-bold bg-violet-600 text-white shadow-xs transition-all cursor-pointer';
          } else {
            b.className = 'px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-800 hover:text-white transition-all cursor-pointer';
          }
        });

        modalSec4Content.innerHTML = `
          <div class="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">${ext.title}</div>
          <p class="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">${ext.desc}</p>
          <div id="modal-ext-example-speak" class="cursor-pointer mt-2 p-2.5 rounded-lg bg-violet-500/15 hover:bg-violet-500/25 border border-violet-400/30 font-mono text-xs text-violet-900 dark:text-violet-200 flex items-center justify-between gap-2 transition-colors">
            <span>"${ext.example}"</span>
            ${modalSpeakerSvg}
          </div>
        `;
        const extSpeakEl = document.getElementById('modal-ext-example-speak');
        if (extSpeakEl) {
          extSpeakEl.addEventListener('click', () => speak(ext.example, 'en-US', extSpeakEl));
        }
      }

      extList.forEach((ext, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = ext.tab;
        btn.addEventListener('click', () => renderExtTab(idx));
        modalSec4Tabs.appendChild(btn);
      });
      renderExtTab(0);

      detailModal.classList.remove('hidden');
    }

    document.getElementById('btn-close-detail').addEventListener('click', () => detailModal.classList.add('hidden'));
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) detailModal.classList.add('hidden');
    });

    const cheatsheetModal = document.getElementById('cheatsheet-modal');
    document.getElementById('btn-open-cheatsheet').addEventListener('click', () => cheatsheetModal.classList.remove('hidden'));
    const btnCheatsheetMobile = document.getElementById('btn-open-cheatsheet-mobile');
    if (btnCheatsheetMobile) {
      btnCheatsheetMobile.addEventListener('click', () => cheatsheetModal.classList.remove('hidden'));
    }
    document.getElementById('btn-close-cheatsheet').addEventListener('click', () => cheatsheetModal.classList.add('hidden'));
    cheatsheetModal.addEventListener('click', (e) => {
      if (e.target === cheatsheetModal) cheatsheetModal.classList.add('hidden');
    });

    const viewMatrix = document.getElementById('module-view-matrix');
    const viewSgk = document.getElementById('module-view-sgk');
    const viewArena = document.getElementById('module-view-arena');

    function switchModuleTab(tabKey) {
      state.activeModule = tabKey;
      document.querySelectorAll('.cyber-module-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.moduleTab === tabKey);
      });
      viewMatrix.classList.toggle('hidden', tabKey !== 'matrix');
      viewSgk.classList.toggle('hidden', tabKey !== 'sgk');
      viewArena.classList.toggle('hidden', tabKey !== 'arena');

      if (tabKey !== 'arena' && typeof stopArenaTimer === 'function') {
        stopArenaTimer();
      }
      if (tabKey === 'sgk') {
        renderSgkCurriculum(state.selectedGrade);
      } else if (tabKey === 'arena') {
        if (!arenaQuizStage.classList.contains('hidden')) {
          generateDynamicQuestion();
        }
        renderFlashcard();
      }
    }

    document.querySelectorAll('.cyber-module-tab').forEach(btn => {
      btn.addEventListener('click', () => switchModuleTab(btn.dataset.moduleTab));
    });

    function renderSgkCurriculum(gradeNum) {
      state.selectedGrade = gradeNum;
      const gradeSelector = document.getElementById('sgk-grade-selector');
      const gradeSummary = document.getElementById('sgk-grade-summary');
      const sgkVerbsHeading = document.getElementById('sgk-verbs-heading');
      const sgkVerbsGrid = document.getElementById('sgk-verbs-grid');

      gradeSelector.innerHTML = '';
      for (let g = 1; g <= 12; g++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isSelected = (g === gradeNum);
        btn.className = isSelected
          ? 'py-2.5 px-2 rounded-xl font-mono text-xs font-extrabold bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg transition-all cursor-pointer'
          : 'py-2.5 px-2 rounded-xl font-mono text-xs font-bold bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-violet-500/30 hover:border-cyan-400 transition-all cursor-pointer';
        btn.textContent = `Lớp ${g}`;
        btn.addEventListener('click', () => renderSgkCurriculum(g));
        gradeSelector.appendChild(btn);
      }

      const meta = SGK_CURRICULUM[gradeNum] || SGK_CURRICULUM[6];
      const tenseChipsHtml = meta.tenses.map(tid => {
        const tObj = TENSES.find(x => x.id === tid);
        if (!tObj) return '';
        return `<button type="button" data-sgk-tense="${tid}" class="sgk-tense-chip px-3 py-1.5 rounded-xl text-xs font-bold bg-violet-500/20 text-violet-700 dark:text-violet-200 border border-violet-400/40 hover:bg-violet-500/30 transition-all cursor-pointer">⚡ ${tObj.viTitle} (${tObj.formula})</button>`;
      }).join('');

      gradeSummary.innerHTML = `
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <span class="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">Cấp ${meta.level} • Chương trình Chuẩn Bộ GD&amp;ĐT</span>
            <h3 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">${meta.title}</h3>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300">${meta.desc}</p>
        <div class="space-y-1.5">
          <span class="text-[11px] font-mono uppercase tracking-wider text-slate-400">Các Thì Trọng Tâm Lớp ${gradeNum} (Nhấn để xem Công thức &amp; Sơ đồ):</span>
          <div class="flex flex-wrap gap-2 pt-1">${tenseChipsHtml}</div>
        </div>
      `;

      gradeSummary.querySelectorAll('.sgk-tense-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const tObj = TENSES.find(x => x.id === chip.dataset.sgkTense);
          if (tObj) openDetailModal(tObj);
        });
      });

      const gradeVerbs = VERB_DATABASE.filter(v => Number(v.grade) === Number(gradeNum));
      sgkVerbsHeading.textContent = `Danh mục Động từ SGK Lớp ${gradeNum} (${gradeVerbs.length} động từ trọng tâm)`;

      sgkVerbsGrid.innerHTML = '';
      gradeVerbs.forEach(item => {
        const card = document.createElement('div');
        card.className = 'p-4 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-300 dark:border-violet-500/30 hover:border-cyan-400 transition-all flex flex-col justify-between gap-3';
        card.innerHTML = `
          <div>
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="font-mono text-lg font-extrabold text-slate-900 dark:text-white">${item.v1}</span>
                <span class="cyber-ipa-badge text-xs px-2 py-0.5 rounded-md">${item.ipaUS}</span>
              </div>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full ${item.isIrregular ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'}">
                ${item.isIrregular ? 'Bất quy tắc' : 'Có quy tắc'}
              </span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-1">${item.meaning}</p>
            <div class="mt-2 flex flex-wrap gap-1.5 font-mono text-[11px] text-slate-400">
              <span class="px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-cyan-300">V2: ${item.v2}</span>
              <span class="px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-purple-300">V3: ${item.v3}</span>
              <span class="px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-indigo-300">V-ing: ${item.ving}</span>
            </div>
          </div>
          <div class="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800">
            <button type="button" class="btn-sgk-speak text-xs font-bold text-cyan-400 hover:underline cursor-pointer">🔊 Nghe US</button>
            <button type="button" class="btn-sgk-use px-3 py-1 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-sm hover:opacity-95 cursor-pointer">
              ⚡ Chia 12 Thì
            </button>
          </div>
        `;
        card.querySelector('.btn-sgk-speak').addEventListener('click', () => speak(item.v1, 'en-US'));
        card.querySelector('.btn-sgk-use').addEventListener('click', () => {
          selectVerb(item.v1);
          switchModuleTab('matrix');
          showToast(`⚡ Đã nạp động từ "${item.v1}" vào Ma trận 12 Thì!`);
        });
        sgkVerbsGrid.appendChild(card);
      });
    }

/**
 * ============================================================================
 * LEXIMATRIX CYBER ARENA ENGINE (KAHOOT! + GIMKIT + BLOOKET GAMIFICATION)
 * Connected to: VERB_DATABASE (388 Verbs) & CURRICULUM_DATA (170 SGK Units)
 * ============================================================================
 */



/* Note: Game Arena Engine (Kahoot, Gimkit, Blooket) is loaded via arenaEngine.js */



    const btnArenaQuiz = document.getElementById('btn-arena-mode-quiz');
    const btnArenaFlashcard = document.getElementById('btn-arena-mode-flashcard');
    const arenaQuizStage = document.getElementById('arena-quiz-stage');
    const arenaFlashcardStage = document.getElementById('arena-flashcard-stage');

    btnArenaQuiz.addEventListener('click', () => {
      arenaQuizStage.classList.remove('hidden');
      arenaFlashcardStage.classList.add('hidden');
      btnArenaQuiz.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-md transition-all cursor-pointer';
      btnArenaFlashcard.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-white transition-all cursor-pointer';
      if (typeof window.generateDynamicQuestion === 'function') window.generateDynamicQuestion();
      else if (typeof generateDynamicQuestion === 'function') generateDynamicQuestion();
    });

    btnArenaFlashcard.addEventListener('click', () => {
      if (typeof window.stopArenaTimer === 'function') window.stopArenaTimer();
      else if (typeof stopArenaTimer === 'function') stopArenaTimer();
      arenaQuizStage.classList.add('hidden');
      arenaFlashcardStage.classList.remove('hidden');
      btnArenaFlashcard.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-md transition-all cursor-pointer';
      btnArenaQuiz.className = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-white transition-all cursor-pointer';
      renderFlashcard();
    });

    document.getElementById('btn-quiz-next').addEventListener('click', () => {
      if (typeof window.generateDynamicQuestion === 'function') window.generateDynamicQuestion();
      else if (typeof generateDynamicQuestion === 'function') generateDynamicQuestion();
    });

    // Question Type Filter Buttons
    document.querySelectorAll('.arena-qtype-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.arena-qtype-btn').forEach(b => {
          b.className = 'arena-qtype-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-cyan-400 cursor-pointer shrink-0';
        });
        btn.className = 'arena-qtype-btn px-3 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-xs cursor-pointer shrink-0';
        if (typeof window.ArenaState !== 'undefined') {
          window.ArenaState.questionTypeFilter = btn.dataset.qtype;
        } else if (typeof ArenaState !== 'undefined') {
          ArenaState.questionTypeFilter = btn.dataset.qtype;
        }
        if (typeof window.generateDynamicQuestion === 'function') window.generateDynamicQuestion();
        else if (typeof generateDynamicQuestion === 'function') generateDynamicQuestion();
      });
    });

    // Cyber Shop Bindings
    document.getElementById('btn-open-cyber-shop').addEventListener('click', () => {
      if (typeof window.openCyberShop === 'function') window.openCyberShop();
      else if (typeof openCyberShop === 'function') openCyberShop();
    });
    document.getElementById('btn-close-cyber-shop').addEventListener('click', () => {
      if (typeof window.closeCyberShop === 'function') window.closeCyberShop();
      else if (typeof closeCyberShop === 'function') closeCyberShop();
    });
    document.getElementById('cyber-shop-modal').addEventListener('click', (e) => {
      if (e.target.id === 'cyber-shop-modal') {
        if (typeof window.closeCyberShop === 'function') window.closeCyberShop();
        else if (typeof closeCyberShop === 'function') closeCyberShop();
      }
    });
    document.getElementById('btn-buy-multiplier').addEventListener('click', () => {
      if (typeof window.buyShopUpgrade === 'function') window.buyShopUpgrade('multiplier');
      else if (typeof buyShopUpgrade === 'function') buyShopUpgrade('multiplier');
    });
    document.getElementById('btn-buy-booster').addEventListener('click', () => {
      if (typeof window.buyShopUpgrade === 'function') window.buyShopUpgrade('booster');
      else if (typeof buyShopUpgrade === 'function') buyShopUpgrade('booster');
    });
    document.getElementById('btn-buy-insurance').addEventListener('click', () => {
      if (typeof window.buyShopUpgrade === 'function') window.buyShopUpgrade('insurance');
      else if (typeof buyShopUpgrade === 'function') buyShopUpgrade('insurance');
    });

    // Sound Mute Toggle
    const btnArenaMute = document.getElementById('btn-arena-mute');
    btnArenaMute.addEventListener('click', () => {
      const arenaObj = (typeof window !== 'undefined' && window.ArenaState) ? window.ArenaState : (typeof ArenaState !== 'undefined' ? ArenaState : null);
      if (arenaObj) {
        arenaObj.soundEnabled = !arenaObj.soundEnabled;
        btnArenaMute.textContent = arenaObj.soundEnabled ? '🔊 Âm thanh: BẬT' : '🔇 Âm thanh: TẮT';
      }
    });

    // Podium Bindings
    document.getElementById('btn-open-podium').addEventListener('click', () => {
      if (typeof window.openArenaPodium === 'function') window.openArenaPodium();
      else if (typeof openArenaPodium === 'function') openArenaPodium();
    });
    document.getElementById('btn-podium-replay').addEventListener('click', () => {
      if (typeof window.resetArenaGame === 'function') window.resetArenaGame();
      else if (typeof resetArenaGame === 'function') resetArenaGame();
    });
    document.getElementById('btn-podium-back-dict').addEventListener('click', () => {
      document.getElementById('arena-podium-modal').classList.add('hidden');
      switchModuleTab('matrix');
    });


    const flashcardInner = document.getElementById('flashcard-inner');
    function renderFlashcard() {
      const v = VERB_DATABASE[state.fcIndex] || VERB_DATABASE[0];
      flashcardInner.classList.remove('is-flipped');
      document.getElementById('fc-counter').textContent = `${state.fcIndex + 1} / ${VERB_DATABASE.length}`;
      document.getElementById('fc-front-badge').textContent = `${v.isIrregular ? 'Bất quy tắc (Irregular)' : 'Có quy tắc (Regular)'} • SGK Lớp ${v.grade || 6}`;
      document.getElementById('fc-front-word').textContent = v.v1;
      document.getElementById('fc-front-ipa').textContent = v.ipaUS;
      document.getElementById('fc-back-meaning').textContent = v.meaning;

      document.getElementById('fc-back-forms').innerHTML = `
        <div class="p-2 rounded-xl bg-slate-200/70 dark:bg-slate-800"><div class="text-[10px] text-cyan-400">V1</div><div class="font-bold text-sm text-white">${v.v1}</div></div>
        <div class="p-2 rounded-xl bg-slate-200/70 dark:bg-slate-800"><div class="text-[10px] text-emerald-400">V-s/es</div><div class="font-bold text-sm text-emerald-300">${v.vs}</div></div>
        <div class="p-2 rounded-xl bg-slate-200/70 dark:bg-slate-800"><div class="text-[10px] text-amber-400">V2</div><div class="font-bold text-sm text-amber-300">${v.v2}</div></div>
        <div class="p-2 rounded-xl bg-slate-200/70 dark:bg-slate-800"><div class="text-[10px] text-purple-400">V3</div><div class="font-bold text-sm text-purple-300">${v.v3}</div></div>
        <div class="p-2 rounded-xl bg-slate-200/70 dark:bg-slate-800"><div class="text-[10px] text-indigo-400">V-ing</div><div class="font-bold text-sm text-indigo-300">${v.ving}</div></div>
      `;
    }

    flashcardInner.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      flashcardInner.classList.toggle('is-flipped');
    });

    document.getElementById('btn-fc-flip').addEventListener('click', () => {
      flashcardInner.classList.toggle('is-flipped');
    });
    document.getElementById('btn-fc-prev').addEventListener('click', () => {
      state.fcIndex = (state.fcIndex - 1 + VERB_DATABASE.length) % VERB_DATABASE.length;
      renderFlashcard();
    });
    document.getElementById('btn-fc-next').addEventListener('click', () => {
      state.fcIndex = (state.fcIndex + 1) % VERB_DATABASE.length;
      renderFlashcard();
    });
    document.getElementById('btn-fc-random').addEventListener('click', () => {
      state.fcIndex = Math.floor(Math.random() * VERB_DATABASE.length);
      renderFlashcard();
    });
    document.getElementById('btn-fc-speak').addEventListener('click', (e) => {
      e.stopPropagation();
      const v = VERB_DATABASE[state.fcIndex] || VERB_DATABASE[0];
      speak(`${v.v1}, ${firstVariant(v.v2)}, ${firstVariant(v.v3)}`, 'en-US');
    });
    document.getElementById('btn-fc-load-matrix').addEventListener('click', (e) => {
      e.stopPropagation();
      const v = VERB_DATABASE[state.fcIndex] || VERB_DATABASE[0];
      selectVerb(v.v1);
      switchModuleTab('matrix');
    });

    function togglePassiveMode(forceState) {
      state.isPassive = typeof forceState === 'boolean' ? forceState : !state.isPassive;
      btnPassiveToggle.setAttribute('aria-checked', String(state.isPassive));

      if (state.isPassive) {
        btnPassiveToggle.className = 'group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border border-violet-400 bg-violet-600 text-white shadow-md shadow-violet-600/30 transition-all cursor-pointer select-none shrink-0';
        passiveSwitchTrack.className = 'relative inline-flex h-4 w-7 shrink-0 items-center rounded-full bg-white/30 transition-colors duration-200';
        passiveSwitchThumb.className = 'inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition-transform duration-200 translate-x-3.5';
        passiveStatusBadge.className = 'font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white font-bold';
        passiveStatusBadge.textContent = 'ON';
        subjectLabel.textContent = 'Tác nhân (by O):';
        legendPassiveBe.classList.remove('hidden');
      } else {
        btnPassiveToggle.className = 'group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-violet-500/35 bg-slate-100 dark:bg-slate-950/90 text-slate-700 dark:text-slate-200 hover:border-violet-400 transition-all cursor-pointer select-none shrink-0';
        passiveSwitchTrack.className = 'relative inline-flex h-4 w-7 shrink-0 items-center rounded-full bg-slate-300 dark:bg-slate-700 transition-colors duration-200';
        passiveSwitchThumb.className = 'inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition-transform duration-200 translate-x-0.5';
        passiveStatusBadge.className = 'font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400';
        passiveStatusBadge.textContent = 'OFF';
        subjectLabel.textContent = 'Chủ ngữ:';
        legendPassiveBe.classList.add('hidden');
      }

      renderHeroDictionary();
      renderMatrix();
    }

    btnPassiveToggle.addEventListener('click', () => togglePassiveMode());

    verbTransitivityPill.addEventListener('click', () => {
      state.verbData.isTransitive = !state.verbData.isTransitive;
      if (state.verbData.isTransitive && !state.verbData.passiveSubject) {
        state.verbData.passiveSubject = formatPassiveSubject(state.verbData.activeObject || 'everyone');
      }
      showToast(
        state.verbData.isTransitive
          ? `Đã chuyển "${state.verbData.v1}" sang [vt.] Ngoại động từ (Có bị động)`
          : `Đã chuyển "${state.verbData.v1}" sang [vi.] Nội động từ (Không bị động)`
      );
      renderHeroDictionary();
      renderMatrix();
    });

    function applyCustomObject(newObjStr) {
      const val = (newObjStr || '').trim();
      state.verbData.activeObject = val;
      state.verbData.passiveSubject = formatPassiveSubject(val);
      renderHeroDictionary();
      renderMatrix();
    }

    customObjectInput.addEventListener('input', (e) => applyCustomObject(e.target.value));

    document.querySelectorAll('.obj-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.obj-preset-btn').forEach(b => {
          b.className = 'obj-preset-btn px-2.5 py-1 rounded-lg text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/90 hover:border-cyan-400 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer';
        });
        btn.className = 'obj-preset-btn px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-400/40 transition-all cursor-pointer';

        const preset = btn.dataset.objPreset;
        if (preset === '__default__') {
          state.verbData.activeObject = state.defaultActiveObject;
          state.verbData.passiveSubject = state.defaultPassiveSubject;
          customObjectInput.value = state.defaultActiveObject;
          renderHeroDictionary();
          renderMatrix();
        } else {
          customObjectInput.value = preset;
          applyCustomObject(preset);
        }
      });
    });

    function selectVerb(query, skipReverseCheck = false) {
      let clean = (query || '').trim();
      if (!clean) return;

      if (!skipReverseCheck) {
        const rev = resolveInflectedForm(clean);
        if (rev && reverseResolutionBanner && reverseResolutionText) {
          reverseResolutionBanner.classList.remove('hidden');
          reverseResolutionText.innerHTML = `Nhận diện hình thái: <strong>"${clean}"</strong> là dạng <strong>${rev.formDescription}</strong> của <strong>"${rev.rootVerb.v1}"</strong> [<span class="font-mono text-cyan-500 dark:text-cyan-400 font-bold">${rev.pattern}</span>]`;
          clean = rev.rootVerb.v1;
        } else if (reverseResolutionBanner) {
          reverseResolutionBanner.classList.add('hidden');
        }
      }

      state.verbData = findOrBuildVerb(clean);
      state.defaultActiveObject = state.verbData.activeObject;
      state.defaultPassiveSubject = state.verbData.passiveSubject;
      state.verbKey = state.verbData.v1;
      verbInput.value = state.verbData.v1;
      customObjectInput.value = state.verbData.activeObject || '';
      btnClear.classList.remove('hidden');
      suggestionsDropdown.classList.add('hidden');
      state.suggestionIndex = -1;

      renderHeroDictionary();
      renderMatrix();
      highlightLeftPaneVerb(state.verbKey);
      renderScratchpad();
    }

    function renderLeftPaneVerbs() {
      if (!leftPaneVerbList) return;

      const q = (state.leftSearchQuery || '').trim();
      const filter = state.patternFilter || 'all';

      let filtered = [];
      if (q) {
        if (typeof window !== 'undefined' && window.LexiSearchEngine && typeof window.LexiSearchEngine.search === 'function') {
          const searchResults = window.LexiSearchEngine.search(q, {
            patternFilter: filter,
            minScore: 0.15
          });
          filtered = searchResults.map(r => r.verb);
        } else {
          const qLower = q.toLowerCase();
          const qNoTone = removeVietnameseTones(qLower);
          filtered = VERB_DATABASE.filter(item => {
            const pat = classifyVerbPattern(item);
            if (filter !== 'all' && pat !== filter) return false;
            const viNorm = removeVietnameseTones(item.meaning);
            return (
              item.v1.toLowerCase().includes(qLower) ||
              (item.v2 && item.v2.toLowerCase().includes(qLower)) ||
              (item.v3 && item.v3.toLowerCase().includes(qLower)) ||
              (item.meaning && item.meaning.toLowerCase().includes(qLower)) ||
              viNorm.includes(qNoTone)
            );
          });
        }
      } else {
        filtered = VERB_DATABASE.filter(item => {
          if (filter !== 'all') {
            const pat = classifyVerbPattern(item);
            if (pat !== filter) return false;
          }
          return true;
        });
      }

      if (leftPaneCountBadge) {
        leftPaneCountBadge.textContent = `${filtered.length} / ${VERB_DATABASE.length} Từ`;
      }

      leftPaneVerbList.innerHTML = '';

      if (filtered.length === 0) {
        leftPaneVerbList.innerHTML = `
          <div class="p-6 text-center text-xs text-slate-400">
            <i class="fa-solid fa-filter-circle-xmark text-lg mb-1 block text-slate-500"></i>
            Không tìm thấy động từ phù hợp với từ khóa hoặc nhóm hình thái đã chọn.
          </div>
        `;
        return;
      }

      const fragment = document.createDocumentFragment();

      filtered.forEach(item => {
        const pat = classifyVerbPattern(item);
        const isActive = item.v1.toLowerCase() === (state.verbKey || '').toLowerCase();

        const row = document.createElement('div');
        row.dataset.v1 = item.v1;
        row.className = `verb-matrix-row flex items-center justify-between p-2 rounded-xl cursor-pointer ${isActive ? 'is-active' : ''}`;

        row.innerHTML = `
          <div class="flex items-center gap-2.5 min-w-0 pr-1">
            <div class="w-1.5 h-6 rounded-full ${isActive ? 'bg-cyan-400' : 'bg-slate-300 dark:bg-slate-700'} shrink-0 row-indicator"></div>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-mono font-bold text-xs text-cyan-600 dark:text-cyan-300">${item.v1}</span>
                <span class="font-mono text-[11px] text-slate-500 dark:text-slate-400">${item.v2} • ${item.v3}</span>
              </div>
              <div class="text-[11px] text-slate-600 dark:text-slate-300 truncate max-w-[210px] sm:max-w-[260px]">
                ${item.meaning}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <span class="pattern-tag pattern-tag--${pat}">${pat}</span>
            <button type="button" class="btn-left-speak w-6 h-6 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 flex items-center justify-center transition-colors" title="Nghe phát âm">
              <i class="fa-solid fa-volume-high text-[10px]" aria-hidden="true"></i>
            </button>
          </div>
        `;

        row.addEventListener('click', () => {
          selectVerb(item.v1, true);
        });

        const speakBtn = row.querySelector('.btn-left-speak');
        if (speakBtn) {
          speakBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            speak(item.v1, 'en-US', speakBtn);
          });
        }

        fragment.appendChild(row);
      });

      leftPaneVerbList.appendChild(fragment);
    }

    function highlightLeftPaneVerb(v1) {
      if (!v1) return;
      const targetV1 = v1.toLowerCase();

      if (leftPaneVerbList) {
        const rows = leftPaneVerbList.querySelectorAll('.verb-matrix-row');
        rows.forEach(r => {
          const match = r.dataset.v1 && r.dataset.v1.toLowerCase() === targetV1;
          r.classList.toggle('is-active', match);
          const indicator = r.querySelector('.row-indicator');
          if (indicator) {
            indicator.className = match
              ? 'w-1.5 h-6 rounded-full bg-cyan-400 shrink-0 row-indicator'
              : 'w-1.5 h-6 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0 row-indicator';
          }
          if (match) {
            r.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
        });
      }

      const currentVerb = state.verbData || VERB_DATABASE.find(x => x.v1.toLowerCase() === targetV1);
      if (currentVerb) {
        if (auxVs) auxVs.textContent = currentVerb.vs || (currentVerb.v1 + 's');
        if (auxVing) auxVing.textContent = currentVerb.ving || (currentVerb.v1 + 'ing');
        if (auxTrans) {
          if (currentVerb.isTransitive) {
            auxTrans.className = 'text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-400/30';
            auxTrans.textContent = '[vt.] Ngoại ĐT';
          } else {
            auxTrans.className = 'text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold border border-rose-400/30';
            auxTrans.textContent = '[vi.] Nội ĐT';
          }
        }
      }
    }

    function savePinnedVerbs() {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('leximatrix_pinned_verbs', JSON.stringify(state.pinnedVerbs));
        }
      } catch (e) {}
    }

    function renderScratchpad() {
      if (!scratchpadChipsContainer) return;
      scratchpadChipsContainer.innerHTML = '';

      state.pinnedVerbs.forEach(verbKey => {
        const isCurrent = (state.verbKey || '').toLowerCase() === verbKey.toLowerCase();
        const pill = document.createElement('div');
        pill.className = `scratchpad-pin-pill inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-medium border cursor-pointer select-none transition-all ${
          isCurrent
            ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-transparent shadow-xs font-bold'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-amber-400'
        }`;

        pill.innerHTML = `
          <span>${verbKey}</span>
          <button type="button" class="btn-unpin text-slate-400 hover:text-rose-400 text-xs ml-0.5" title="Bỏ ghim">
            &times;
          </button>
        `;

        pill.addEventListener('click', (e) => {
          if (e.target.closest('.btn-unpin')) return;
          selectVerb(verbKey, true);
        });

        const btnUnpin = pill.querySelector('.btn-unpin');
        if (btnUnpin) {
          btnUnpin.addEventListener('click', (e) => {
            e.stopPropagation();
            unpinVerb(verbKey);
          });
        }

        scratchpadChipsContainer.appendChild(pill);
      });
    }

    function pinCurrentVerb() {
      const current = state.verbKey;
      if (!current) return;
      if (state.pinnedVerbs.includes(current)) {
        showToast(`Động từ "${current}" đã có sẵn trong Scratchpad!`);
        return;
      }
      state.pinnedVerbs.push(current);
      savePinnedVerbs();
      renderScratchpad();
      showToast(`📌 Đã ghim "${current}" vào Session Scratchpad!`);
    }

    function unpinVerb(verbKey) {
      state.pinnedVerbs = state.pinnedVerbs.filter(v => v !== verbKey);
      savePinnedVerbs();
      renderScratchpad();
      showToast(`Đã bỏ ghim "${verbKey}" khỏi Scratchpad.`);
    }

    if (leftPaneSearch) {
      leftPaneSearch.addEventListener('input', (e) => {
        state.leftSearchQuery = e.target.value;
        if (btnLeftSearchClear) {
          btnLeftSearchClear.classList.toggle('hidden', !state.leftSearchQuery);
        }
        renderLeftPaneVerbs();
      });
    }

    if (btnLeftSearchClear) {
      btnLeftSearchClear.addEventListener('click', () => {
        if (leftPaneSearch) leftPaneSearch.value = '';
        state.leftSearchQuery = '';
        btnLeftSearchClear.classList.add('hidden');
        renderLeftPaneVerbs();
        if (leftPaneSearch) leftPaneSearch.focus();
      });
    }

    if (patternFilterBar) {
      patternFilterBar.querySelectorAll('button[data-pattern]').forEach(btn => {
        btn.addEventListener('click', () => {
          const pat = btn.dataset.pattern;
          state.patternFilter = pat;

          patternFilterBar.querySelectorAll('button[data-pattern]').forEach(b => {
            b.className = 'pattern-filter-btn px-2 py-0.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-white bg-slate-200/70 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700/80 cursor-pointer';
          });
          btn.className = 'pattern-filter-btn px-2 py-0.5 rounded-lg font-bold bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-xs cursor-pointer';

          const patternDescMap = {
            all: 'Tất cả động từ (388)',
            'A-A-A': 'Bất biến: V1 = V2 = V3 (cut, hit, let...)',
            'A-B-B': 'Quá khứ = Phân từ: V2 = V3 (buy, build, teach...)',
            'A-B-A': 'Nguyên thể = Phân từ: V1 = V3 (come, run, become...)',
            'A-B-C': '3 dạng biến đổi riêng biệt: V1 ≠ V2 ≠ V3 (write, drive, sing...)',
            REGULAR: 'Động từ có quy tắc (-ed)'
          };
          if (patternActiveDesc) {
            patternActiveDesc.textContent = patternDescMap[pat] || pat;
          }

          renderLeftPaneVerbs();
        });
      });
    }

    if (btnPinCurrent) {
      btnPinCurrent.addEventListener('click', pinCurrentVerb);
    }

    function updateAutocomplete(val) {
      const q = (val || '').trim();
      state.suggestionIndex = -1;
      if (!q) {
        suggestionsDropdown.classList.add('hidden');
        return;
      }

      let matches = [];
      if (typeof window !== 'undefined' && window.LexiSearchEngine && typeof window.LexiSearchEngine.search === 'function') {
        const searchResults = window.LexiSearchEngine.search(q, {
          limit: 8,
          minScore: 0.18
        });
        matches = searchResults.map(r => r.verb);
      } else {
        const qLower = q.toLowerCase();
        const qNoTone = removeVietnameseTones(qLower);
        matches = VERB_DATABASE.filter(item => {
          const viNorm = removeVietnameseTones(item.meaning);
          return (
            item.v1.includes(qLower) ||
            item.v2.toLowerCase().includes(qLower) ||
            item.v3.toLowerCase().includes(qLower) ||
            item.ving.toLowerCase().includes(qLower) ||
            item.meaning.toLowerCase().includes(qLower) ||
            viNorm.includes(qNoTone)
          );
        }).sort((a, b) => {
          const aStarts = a.v1.startsWith(qLower) ? 0 : 1;
          const bStarts = b.v1.startsWith(qLower) ? 0 : 1;
          return aStarts - bStarts;
        }).slice(0, 8);
      }

      suggestionsDropdown.innerHTML = '';

      if (matches.length === 0) {
        const customRow = document.createElement('div');
        customRow.className = 'p-3.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/70 flex items-center justify-between';
        customRow.innerHTML = `
          <span>Chia tự động động từ <strong class="font-mono text-cyan-400">"${q}"</strong> theo quy tắc chuẩn</span>
          <span class="kbd-badge">Enter ↵</span>
        `;
        customRow.addEventListener('click', () => selectVerb(q));
        suggestionsDropdown.appendChild(customRow);
      } else {
        matches.forEach((item, index) => {
          const row = document.createElement('div');
          row.dataset.index = index;
          row.dataset.verb = item.v1;
          row.className = 'suggestion-item px-4 py-2.5 cursor-pointer hover:bg-violet-500/15 flex flex-wrap items-center justify-between gap-2 transition-colors';
          row.innerHTML = `
            <div class="flex items-center gap-3 min-w-0">
              <span class="font-mono font-bold text-sm text-cyan-500 dark:text-cyan-300">${item.v1}</span>
              <span class="font-mono text-xs text-slate-400">${item.v2} • ${item.v3}</span>
              <span class="text-xs text-slate-700 dark:text-slate-200 truncate">— ${item.meaning}</span>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300">Lớp ${item.grade || 6}</span>
              <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${item.isTransitive ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}">
                ${item.isTransitive ? '[vt.] Ngoại ĐT' : '[vi.] Nội ĐT'}
              </span>
            </div>
          `;
          row.addEventListener('click', () => selectVerb(item.v1));
          suggestionsDropdown.appendChild(row);
        });
      }

      suggestionsDropdown.classList.remove('hidden');
    }

    function highlightSuggestionRow(rows) {
      rows.forEach((r, idx) => {
        if (idx === state.suggestionIndex) {
          r.classList.add('bg-violet-500/25');
          r.scrollIntoView({ block: 'nearest' });
        } else {
          r.classList.remove('bg-violet-500/25');
        }
      });
    }

    let searchDebounceTimer = null;
    verbInput.addEventListener('input', (e) => {
      const val = e.target.value;
      btnClear.classList.toggle('hidden', !val);
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => updateAutocomplete(val), 180);
    });

    verbInput.addEventListener('keydown', (e) => {
      const rows = suggestionsDropdown.querySelectorAll('.suggestion-item');
      if (e.key === 'ArrowDown' && !suggestionsDropdown.classList.contains('hidden') && rows.length > 0) {
        e.preventDefault();
        state.suggestionIndex = (state.suggestionIndex + 1) % rows.length;
        highlightSuggestionRow(rows);
      } else if (e.key === 'ArrowUp' && !suggestionsDropdown.classList.contains('hidden') && rows.length > 0) {
        e.preventDefault();
        state.suggestionIndex = (state.suggestionIndex - 1 + rows.length) % rows.length;
        highlightSuggestionRow(rows);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (state.suggestionIndex >= 0 && rows[state.suggestionIndex]) {
          selectVerb(rows[state.suggestionIndex].dataset.verb);
        } else {
          selectVerb(verbInput.value);
        }
      } else if (e.key === 'Escape') {
        suggestionsDropdown.classList.add('hidden');
        verbInput.blur();
      }
    });

    btnSearch.addEventListener('click', () => selectVerb(verbInput.value));

    btnClear.addEventListener('click', () => {
      verbInput.value = '';
      btnClear.classList.add('hidden');
      suggestionsDropdown.classList.add('hidden');
      verbInput.focus();
    });

    const introOverlay = document.getElementById('intro-overlay');
    const btnIntroEnter = document.getElementById('btn-intro-enter');
    const btnReplayIntro = document.getElementById('btn-replay-intro');

    function dismissIntro() {
      if (typeof window.LexiMatrixIntroEngine !== 'undefined' && typeof window.LexiMatrixIntroEngine.exitIntro === 'function') {
        window.LexiMatrixIntroEngine.exitIntro();
      } else if (introOverlay) {
        introOverlay.classList.add('intro-hidden');
      }
    }

    if (btnIntroEnter) {
      btnIntroEnter.addEventListener('click', dismissIntro);
    }
    if (btnReplayIntro) {
      btnReplayIntro.addEventListener('click', () => {
        if (typeof window.LexiMatrixIntroEngine !== 'undefined' && typeof window.LexiMatrixIntroEngine.launch === 'function') {
          window.LexiMatrixIntroEngine.launch();
        } else if (introOverlay) {
          introOverlay.classList.remove('intro-hidden');
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (introOverlay && !introOverlay.classList.contains('intro-hidden')) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          dismissIntro();
          return;
        }
      }
      if (e.key === '/' && document.activeElement !== verbInput && document.activeElement !== customObjectInput) {
        e.preventDefault();
        switchModuleTab('matrix');
        verbInput.focus();
        verbInput.select();
      } else if (e.key === 'Escape') {
        detailModal.classList.add('hidden');
        cheatsheetModal.classList.add('hidden');
        suggestionsDropdown.classList.add('hidden');
        dismissIntro();
      }
    });

    document.addEventListener('click', (e) => {
      if (!verbInput.contains(e.target) && !suggestionsDropdown.contains(e.target)) {
        suggestionsDropdown.classList.add('hidden');
      }
    });

    document.querySelectorAll('.verb-form-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const key = cell.dataset.formKey;
        const formText = state.verbData[key];
        copyText(formText);
        speak(formText, 'en-US', cell);
      });
    });

    const btnSpeakUS = document.getElementById('btn-speak-us');
    const btnSpeakUK = document.getElementById('btn-speak-uk');
    btnSpeakUS.addEventListener('click', () => speak(state.verbData.v1, 'en-US', btnSpeakUS));
    btnSpeakUK.addEventListener('click', () => speak(state.verbData.v1, 'en-GB', btnSpeakUK));

    document.querySelectorAll('.subj-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.subj-btn').forEach(b => {
          b.className = 'subj-btn px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer';
        });
        btn.className = 'subj-btn px-3 py-1.5 rounded-lg text-xs font-extrabold bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-sm transition-all cursor-pointer';
        state.subject = btn.dataset.subj;
        renderHeroDictionary();
        renderMatrix();
      });
    });

    document.querySelectorAll('.pol-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pol-btn').forEach(b => {
          b.className = 'pol-btn px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer';
        });
        const pol = btn.dataset.pol;
        let activeColor = 'bg-violet-600 text-white';
        if (pol === 'aff') activeColor = 'bg-emerald-600 text-white';
        if (pol === 'neg') activeColor = 'bg-rose-600 text-white';
        if (pol === 'int') activeColor = 'bg-cyan-600 text-white';
        btn.className = `pol-btn px-2.5 py-1.5 rounded-lg text-xs font-bold ${activeColor} shadow-xs transition-all cursor-pointer`;
        state.polarity = pol;
        renderMatrix();
      });
    });

    document.querySelectorAll('.layout-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.layout-btn').forEach(b => {
          b.className = 'layout-btn shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer';
        });
        btn.className = 'layout-btn shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer';
        state.layout = btn.dataset.layout;
        timeframeTabs.classList.toggle('hidden', state.layout !== 'tabs');
        renderMatrix();
      });
    });

    document.querySelectorAll('.tf-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tf-tab-btn').forEach(b => {
          b.className = 'tf-tab-btn px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all cursor-pointer';
        });
        const tf = btn.dataset.tf;
        const bgMap = { present: 'bg-emerald-600', past: 'bg-amber-600', future: 'bg-cyan-600' };
        btn.className = `tf-tab-btn px-4 py-1.5 rounded-xl text-xs font-bold ${bgMap[tf]} text-white shadow-xs transition-all cursor-pointer`;
        state.activeTab = tf;
        renderMatrix();
      });
    });

    const themeToggleBtn = document.getElementById('btn-theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      themeIcon.className = isDark ? 'fa-solid fa-sun text-xs' : 'fa-solid fa-moon text-xs';
    });

    function initApp() {
      const totalVerbs = VERB_DATABASE.length;
      const headerCountBadge = document.getElementById('verb-count-badge');
      if (headerCountBadge) {
        headerCountBadge.textContent = `${totalVerbs} Động từ`;
      }
      const tabVerbCount = document.getElementById('tab-verb-count');
      if (tabVerbCount) {
        tabVerbCount.textContent = String(totalVerbs);
      }
      const heroTotalVerbsInline = document.getElementById('hero-total-verbs-inline');
      if (heroTotalVerbsInline) {
        heroTotalVerbsInline.textContent = `${totalVerbs} Động từ & SGK`;
      }

      quickChipsContainer.innerHTML = '';
      QUICK_CHIPS.forEach(v => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.dataset.verb = v;
        btn.textContent = v;
        btn.className = 'quick-chip-btn shrink-0 px-3 py-1 rounded-xl text-xs font-mono font-medium bg-white/80 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 hover:border-cyan-400 border border-slate-300 dark:border-slate-700/80 transition-all cursor-pointer';
        btn.addEventListener('click', () => selectVerb(v));
        quickChipsContainer.appendChild(btn);
      });

      // Initialize Multi-Field Inverted Search Engine Index
      if (typeof window !== 'undefined' && window.LexiSearchEngine && typeof window.LexiSearchEngine.initIndex === 'function') {
        window.LexiSearchEngine.initIndex(VERB_DATABASE);
      }

      renderScratchpad();
      renderLeftPaneVerbs();
      selectVerb('write');
    }

    window.addEventListener('DOMContentLoaded', initApp);
  


if (typeof window !== 'undefined') {
  window.conjugateTense = conjugateTense;
  window.conjugatePassiveTense = conjugatePassiveTense;
  window.speak = speak;
  window.showToast = showToast;
  window.selectVerb = selectVerb;
  window.switchModuleTab = switchModuleTab;
  window.renderSgkCurriculum = renderSgkCurriculum;
  window.classifyVerbPattern = classifyVerbPattern;
  window.resolveInflectedForm = resolveInflectedForm;
  window.renderLeftPaneVerbs = renderLeftPaneVerbs;
  window.highlightLeftPaneVerb = highlightLeftPaneVerb;
  window.renderScratchpad = renderScratchpad;
  window.state = state;
}
