/**
 * =======================================================================================
 * KHO DỮ LIỆU ĐỘNG TỪ BẤT QUY TẮC - LEXIMATRIX DATABASE
 * =======================================================================================
 * 
 * 👉 HƯỚNG DẪN DÁN DỮ LIỆU:
 * Bạn chỉ cần dán 388 đối tượng (object) JSON của bạn vào bên trong mảng VERB_DATABASE dưới đây.
 * 
 * Hệ thống LexiMatrix được thiết kế thông minh, tự động hỗ trợ cả 2 định dạng đặt tên trường:
 * 
 * ĐỊNH DẠNG 1 (Chuẩn giao diện LexiMatrix):
 * {
 *   v1: "write",
 *   vs: "writes",
 *   v2: "wrote",
 *   v3: "written",
 *   ving: "writing",
 *   ipaUS: "/raɪt/",
 *   meaning: "viết, soạn thảo, sáng tác",
 *   isIrregular: true,
 *   isTransitive: true,
 *   activeObject: "the letter",
 *   passiveSubject: "The letter"
 * }
 * 
 * ĐỊNH DẠNG 2 (Chuẩn kho xuất 4 đợt):
 * {
 *   v1: "write",
 *   v_s_es: "writes",
 *   v2: "wrote",
 *   v3: "written",
 *   v_ing: "writing",
 *   ipa: "/raɪt/",
 *   meaning: "viết, soạn thảo",
 *   transitive: true,
 *   object_sample: "the letter"
 * }
 * =======================================================================================
 */

const VERB_DATABASE = [
  /* =====================================================================================
   * 👇👇👇 [BẮT ĐẦU DÁN 388 ĐỘNG TỪ BẤT QUY TẮC CỦA BẠN VÀO ĐÂY] 👇👇👇
   * ===================================================================================== */

  // --- Dữ liệu mẫu ban đầu (Bạn có thể dán 388 từ của bạn đè lên hoặc nối tiếp vào đây) ---
  { v1: "write", vs: "writes", v2: "wrote", v3: "written", ving: "writing", ipaUS: "/raɪt/", meaning: "viết, soạn thảo, sáng tác", isIrregular: true, isTransitive: true, activeObject: "the letter", passiveSubject: "The letter" },
  { v1: "make", vs: "makes", v2: "made", v3: "made", ving: "making", ipaUS: "/meɪk/", meaning: "làm, chế tạo, tạo ra", isIrregular: true, isTransitive: true, activeObject: "a birthday cake", passiveSubject: "A birthday cake" },
  { v1: "build", vs: "builds", v2: "built", v3: "built", ving: "building", ipaUS: "/bɪld/", meaning: "xây dựng, kiến tạo", isIrregular: true, isTransitive: true, activeObject: "the bridge", passiveSubject: "The bridge" },
  { v1: "take", vs: "takes", v2: "took", v3: "taken", ving: "taking", ipaUS: "/teɪk/", meaning: "cầm, lấy, chụp (ảnh)", isIrregular: true, isTransitive: true, activeObject: "the photograph", passiveSubject: "The photograph" },
  { v1: "eat", vs: "eats", v2: "ate", v3: "eaten", ving: "eating", ipaUS: "/iːt/", meaning: "ăn, thưởng thức", isIrregular: true, isTransitive: true, activeObject: "an organic apple", passiveSubject: "An organic apple" },
  { v1: "drink", vs: "drinks", v2: "drank", v3: "drunk", ving: "drinking", ipaUS: "/drɪŋk/", meaning: "uống", isIrregular: true, isTransitive: true, activeObject: "green tea", passiveSubject: "Green tea" },
  { v1: "see", vs: "sees", v2: "saw", v3: "seen", ving: "seeing", ipaUS: "/siː/", meaning: "nhìn thấy, trông thấy", isIrregular: true, isTransitive: true, activeObject: "the shooting star", passiveSubject: "The shooting star" },
  { v1: "read", vs: "reads", v2: "read", v3: "read", ving: "reading", ipaUS: "/riːd/", meaning: "đọc, nghiên cứu", isIrregular: true, isTransitive: true, activeObject: "the novel", passiveSubject: "The novel" },
  { v1: "speak", vs: "speaks", v2: "spoke", v3: "spoken", ving: "speaking", ipaUS: "/spiːk/", meaning: "nói, phát biểu", isIrregular: true, isTransitive: true, activeObject: "English", passiveSubject: "English" },
  { v1: "buy", vs: "buys", v2: "bought", v3: "bought", ving: "buying", ipaUS: "/baɪ/", meaning: "mua, tậu", isIrregular: true, isTransitive: true, activeObject: "a new laptop", passiveSubject: "A new laptop" },
  { v1: "bring", vs: "brings", v2: "brought", v3: "brought", ving: "bringing", ipaUS: "/brɪŋ/", meaning: "mang đến, đem theo", isIrregular: true, isTransitive: true, activeObject: "the document", passiveSubject: "The document" },
  { v1: "teach", vs: "teaches", v2: "taught", v3: "taught", ving: "teaching", ipaUS: "/tiːtʃ/", meaning: "dạy học, giảng dạy", isIrregular: true, isTransitive: true, activeObject: "grammar", passiveSubject: "Grammar" },
  { v1: "break", vs: "breaks", v2: "broke", v3: "broken", ving: "breaking", ipaUS: "/breɪk/", meaning: "làm vỡ, phá vỡ", isIrregular: true, isTransitive: true, activeObject: "the world record", passiveSubject: "The world record" },
  { v1: "choose", vs: "chooses", v2: "chose", v3: "chosen", ving: "choosing", ipaUS: "/tʃuːz/", meaning: "lựa chọn, tuyển chọn", isIrregular: true, isTransitive: true, activeObject: "the best candidate", passiveSubject: "The best candidate" },
  { v1: "drive", vs: "drives", v2: "drove", v3: "driven", ving: "driving", ipaUS: "/draɪv/", meaning: "lái xe, điều khiển", isIrregular: true, isTransitive: true, activeObject: "the electric car", passiveSubject: "The electric car" },
  { v1: "find", vs: "finds", v2: "found", v3: "found", ving: "finding", ipaUS: "/faɪnd/", meaning: "tìm thấy, phát hiện", isIrregular: true, isTransitive: true, activeObject: "the hidden key", passiveSubject: "The hidden key" },
  { v1: "give", vs: "gives", v2: "gave", v3: "given", ving: "giving", ipaUS: "/ɡɪv/", meaning: "tặng, trao, đưa cho", isIrregular: true, isTransitive: true, activeObject: "a scholarship", passiveSubject: "A scholarship" },
  { v1: "know", vs: "knows", v2: "knew", v3: "known", ving: "knowing", ipaUS: "/nəʊ/", meaning: "biết, tường tận", isIrregular: true, isTransitive: true, activeObject: "the secret", passiveSubject: "The secret" },
  { v1: "send", vs: "sends", v2: "sent", v3: "sent", ving: "sending", ipaUS: "/send/", meaning: "gửi đi, chuyển phát", isIrregular: true, isTransitive: true, activeObject: "the package", passiveSubject: "The package" },
  { v1: "keep", vs: "keeps", v2: "kept", v3: "kept", ving: "keeping", ipaUS: "/kiːp/", meaning: "giữ gìn, lưu giữ", isIrregular: true, isTransitive: true, activeObject: "the promise", passiveSubject: "The promise" },
  { v1: "understand", vs: "understands", v2: "understood", v3: "understood", ving: "understanding", ipaUS: "/ˌʌndəˈstænd/", meaning: "hiểu, nắm bắt", isIrregular: true, isTransitive: true, activeObject: "the theory", passiveSubject: "The theory" },
  { v1: "do", vs: "does", v2: "did", v3: "done", ving: "doing", ipaUS: "/duː/", meaning: "làm, thực hiện", isIrregular: true, isTransitive: true, activeObject: "the assignment", passiveSubject: "The assignment" },
  { v1: "have", vs: "has", v2: "had", v3: "had", ving: "having", ipaUS: "/hæv/", meaning: "có, sở hữu, tổ chức", isIrregular: true, isTransitive: true, activeObject: "an important meeting", passiveSubject: "An important meeting" },
  { v1: "tell", vs: "tells", v2: "told", v3: "told", ving: "telling", ipaUS: "/tel/", meaning: "kể, bảo, thuật lại", isIrregular: true, isTransitive: true, activeObject: "an inspiring story", passiveSubject: "An inspiring story" },
  { v1: "leave", vs: "leaves", v2: "left", v3: "left", ving: "leaving", ipaUS: "/liːv/", meaning: "rời bỏ, để lại", isIrregular: true, isTransitive: true, activeObject: "a message", passiveSubject: "A message" },
  { v1: "forget", vs: "forgets", v2: "forgot", v3: "forgotten", ving: "forgetting", ipaUS: "/fəˈɡet/", meaning: "quên, lãng quên", isIrregular: true, isTransitive: true, activeObject: "the password", passiveSubject: "The password" },
  { v1: "hear", vs: "hears", v2: "heard", v3: "heard", ving: "hearing", ipaUS: "/hɪər/", meaning: "nghe thấy", isIrregular: true, isTransitive: true, activeObject: "the symphony", passiveSubject: "The symphony" },
  { v1: "lose", vs: "loses", v2: "lost", v3: "lost", ving: "losing", ipaUS: "/luːz/", meaning: "làm mất, đánh mất", isIrregular: true, isTransitive: true, activeObject: "the wallet", passiveSubject: "The wallet" },
  { v1: "meet", vs: "meets", v2: "met", v3: "met", ving: "meeting", ipaUS: "/miːt/", meaning: "gặp gỡ, đón tiếp", isIrregular: true, isTransitive: true, activeObject: "the partner", passiveSubject: "The partner" },
  { v1: "pay", vs: "pays", v2: "paid", v3: "paid", ving: "paying", ipaUS: "/peɪ/", meaning: "trả tiền, thanh toán", isIrregular: true, isTransitive: true, activeObject: "the invoice", passiveSubject: "The invoice" },
  { v1: "put", vs: "puts", v2: "put", v3: "put", ving: "putting", ipaUS: "/pʊt/", meaning: "đặt, để", isIrregular: true, isTransitive: true, activeObject: "the vase on the table", passiveSubject: "The vase" },
  { v1: "sing", vs: "sings", v2: "sang", v3: "sung", ving: "singing", ipaUS: "/sɪŋ/", meaning: "hát, ca hát", isIrregular: true, isTransitive: true, activeObject: "the national anthem", passiveSubject: "The national anthem" },
  { v1: "spend", vs: "spends", v2: "spent", v3: "spent", ving: "spending", ipaUS: "/spend/", meaning: "tiêu xài, dành (thời gian)", isIrregular: true, isTransitive: true, activeObject: "the budget", passiveSubject: "The budget" },
  { v1: "wear", vs: "wears", v2: "wore", v3: "worn", ving: "wearing", ipaUS: "/weər/", meaning: "mặc, đội, đeo", isIrregular: true, isTransitive: true, activeObject: "a silk suit", passiveSubject: "A silk suit" },
  { v1: "win", vs: "wins", v2: "won", v3: "won", ving: "winning", ipaUS: "/wɪn/", meaning: "chiến thắng, giành được", isIrregular: true, isTransitive: true, activeObject: "the gold trophy", passiveSubject: "The gold trophy" },
  { v1: "draw", vs: "draws", v2: "drew", v3: "drawn", ving: "drawing", ipaUS: "/drɔː/", meaning: "vẽ, phác họa", isIrregular: true, isTransitive: true, activeObject: "a portrait", passiveSubject: "A portrait" },
  { v1: "throw", vs: "throws", v2: "threw", v3: "thrown", ving: "throwing", ipaUS: "/θrəʊ/", meaning: "ném, quăng", isIrregular: true, isTransitive: true, activeObject: "the baseball", passiveSubject: "The baseball" },

  // --- Nhóm Nội động từ (Intransitive - Không chia ở Bị động) ---
  { v1: "go", vs: "goes", v2: "went", v3: "gone", ving: "going", ipaUS: "/ɡəʊ/", meaning: "đi, di chuyển đến", isIrregular: true, isTransitive: false, activeObject: "to school", passiveSubject: "" },
  { v1: "come", vs: "comes", v2: "came", v3: "come", ving: "coming", ipaUS: "/kʌm/", meaning: "đến, tới nơi", isIrregular: true, isTransitive: false, activeObject: "home early", passiveSubject: "" },
  { v1: "run", vs: "runs", v2: "ran", v3: "run", ving: "running", ipaUS: "/rʌn/", meaning: "chạy bộ", isIrregular: true, isTransitive: false, activeObject: "in the park", passiveSubject: "" },
  { v1: "sleep", vs: "sleeps", v2: "slept", v3: "slept", ving: "sleeping", ipaUS: "/sliːp/", meaning: "ngủ, nghỉ ngơi", isIrregular: true, isTransitive: false, activeObject: "peacefully", passiveSubject: "" },
  { v1: "fall", vs: "falls", v2: "fell", v3: "fallen", ving: "falling", ipaUS: "/fɔːl/", meaning: "rơi, ngã, giảm xuống", isIrregular: true, isTransitive: false, activeObject: "on the ground", passiveSubject: "" },
  { v1: "sit", vs: "sits", v2: "sat", v3: "sat", ving: "sitting", ipaUS: "/sɪt/", meaning: "ngồi", isIrregular: true, isTransitive: false, activeObject: "by the window", passiveSubject: "" },
  { v1: "stand", vs: "stands", v2: "stood", v3: "stood", ving: "standing", ipaUS: "/stænd/", meaning: "đứng", isIrregular: true, isTransitive: false, activeObject: "on the stage", passiveSubject: "" },
  { v1: "fly", vs: "flies", v2: "flew", v3: "flown", ving: "flying", ipaUS: "/flaɪ/", meaning: "bay, đi máy bay", isIrregular: true, isTransitive: false, activeObject: "above the clouds", passiveSubject: "" },
  { v1: "swim", vs: "swims", v2: "swam", v3: "swum", ving: "swimming", ipaUS: "/swɪm/", meaning: "bơi lội", isIrregular: true, isTransitive: false, activeObject: "across the river", passiveSubject: "" },
  { v1: "be", vs: "is", v2: "was/were", v3: "been", ving: "being", ipaUS: "/biː/", meaning: "thì, là, ở", isIrregular: true, isTransitive: false, activeObject: "very happy", passiveSubject: "" }

  /* =====================================================================================
   * 👆👆👆 [KẾT THÚC DÁN DỮ LIỆU] 👆👆👆
   * ===================================================================================== */
];

// Khởi tạo global và export cho module
if (typeof window !== "undefined") {
  window.VERB_DATABASE = VERB_DATABASE;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { VERB_DATABASE };
}
