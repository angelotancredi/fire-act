import { useState, useRef, useEffect } from "react";

/* ═══ 컬러 시스템 ═══ */
const C = {
  bg: "#F6F4F0", card: "#FFFFFF", cardAlt: "#FAFAF8",
  primary: "#D95525", primarySoft: "#FFF1EC",
  accent: "#1A65E0", accentSoft: "#EDF2FF",
  text: "#222222", sub: "#5C5F66", muted: "#9EA3AB",
  border: "#E6E4DF", borderSoft: "#F0EEEA",
  red: "#C93131", redBg: "#FEF3F3",
  green: "#0E8A5F", greenBg: "#EEFBF5",
  purple: "#6D3CC7", purpleSoft: "#F3EEFF",
};

/* ═══ 주제별 법령 변경 이력 데이터 ═══ */
const TOPICS = [
  {
    id: "sprinkler", icon: "💧", label: "스프링클러",
    desc: "스프링클러설비 설치 대상·층수·면적 기준 변천",
    history: [
      {
        year: 1973, tag: "최초 도입", title: "특정소방대상물에 스프링클러 설치 의무 최초 도입",
        detail: "소방법 전부개정으로 '특정소방대상물' 개념을 도입하고, 백화점·호텔·병원 등 대형 건축물에 스프링클러 설치를 의무화함. 이때는 개별 건축물 유형별로 설치 여부를 지정하는 방식이었음.",
        keyPoints: ["특정소방대상물 개념 최초 신설", "백화점·호텔·병원 등 대형시설 위주 적용", "설치기준은 시행령 별표에 위임", "수원 20분 이상 방수 가능 의무"]
      },
      {
        year: 1990, tag: "아파트 최초 적용", title: "16층 이상 공동주택, 16층 이상 층에 설치 의무",
        detail: "고층 아파트 화재 위험 증가에 따라, 16층 이상 공동주택의 '16층 이상인 층'에만 스프링클러 설치를 의무화함. 15층 이하 층은 설치 의무 없었음.",
        keyPoints: ["16층 이상 아파트 → 16층 이상 층에만 설치", "15층 이하 층은 의무 대상 아님", "공동주택 최초 스프링클러 적용", "1990.7 시행"]
      },
      {
        year: 1999, tag: "기준 강화", title: "씨랜드 화재 후 숙박·수련시설 설치 대상 확대",
        detail: "1999년 씨랜드 청소년수련시설 화재(23명 사망, 어린이 19명 포함)를 계기로 숙박시설·수련시설·노유자시설 등으로 스프링클러 의무설치 대상이 확대됨.",
        keyPoints: ["수련시설·숙박시설 설치 의무 추가", "노유자시설(어린이집 등) 의무 대상 추가", "수용인원 100명 이상 기준 강화", "비상구·피난시설과 연계 기준 마련"]
      },
      {
        year: 2004, tag: "대폭 확대", title: "11층 이상 건축물 '전층' 설치로 확대",
        detail: "대구 지하철 참사(2003) 이후 소방 4법 분법과 함께, 기존 16층→11층으로 기준을 낮추고, 해당 층만이 아닌 '모든 층'에 설치하도록 대폭 확대함. 2004.5 시행.",
        keyPoints: ["16층 이상 → 11층 이상으로 기준 하향", "'해당 층만' → '건축물 전층' 설치로 변경", "시행령 별표5에 설치기준 일원화", "간이스프링클러 개념 최초 도입", "2004.5 시행 (소방시설법 체계)"]
      },
      {
        year: 2006, tag: "다중이용업소", title: "노래방·PC방 등 간이스프링클러 의무화",
        detail: "다중이용업소법 제정(2006)으로 노래방·PC방·고시원·학원 등에 간이스프링클러 의무설치. 소규모 다중이용 업소까지 스프링클러 보호 범위가 확대됨.",
        keyPoints: ["대상: 노래방, PC방, 고시원, 학원 등", "간이스프링클러 별도 기준 신설", "간이헤드 방수량 50L/min 이상", "기존 영업장도 소급 적용 규정 마련"]
      },
      {
        year: 2014, tag: "성능위주설계", title: "성능위주설계(PBD) 도입, 대형건축물 설계 유연화",
        detail: "연면적 20만㎡ 이상 등 대형 건축물에 대해 기존 사양기준(규격 중심) 대신 성능위주설계(PBD)를 적용할 수 있게 됨. 화재 시뮬레이션으로 스프링클러 배치를 최적화 가능.",
        keyPoints: ["연면적 20만㎡ 이상 PBD 적용 가능", "기존 사양기준도 병행 유지", "화재 시뮬레이션 기반 설계 허용", "법률명에 '화재예방' 추가"]
      },
      {
        year: 2018, tag: "전층 확대", title: "6층 이상 건축물 '전층' 설치로 재확대",
        detail: "기존 11층 기준을 6층으로 한 단계 더 낮춤. 6층 이상 모든 특정소방대상물의 전층에 스프링클러 설치 의무화. 2018.6 시행.",
        keyPoints: ["11층 이상 → 6층 이상으로 기준 하향", "6층 이상 건축물 전층 설치 의무", "2018.6 시행", "단, 기존 건축물 소급적용은 아님 (신축·증축 시 적용)"]
      },
      {
        year: 2024, tag: "현행 기준", title: "현행 스프링클러 설치 대상 (소방시설법 시행령 별표4)",
        detail: "현행법상 스프링클러 설치 대상: ①6층 이상 전층 ②근생·판매·의료·숙박 등 바닥면적 600㎡ 이상 전층 ③창고 5,000㎡ 이상 전층 ④랙크식 창고(높이10m↑) 1,500㎡ 이상 ⑤지하·무창·4층 이상 1,000㎡ 이상 해당층 ⑥복합건축물 5,000㎡ 이상 전층 ⑦ESS 전기저장시설 등",
        keyPoints: ["6층 이상 특정소방대상물: 전층", "근생·판매·의료·숙박 등: 600㎡ 이상 전층", "창고시설: 5,000㎡ 이상 전층", "랙크식창고(높이10m↑): 1,500㎡ 이상", "지하·무창·4층↑: 1,000㎡ 이상 해당층", "복합건축물: 연면적 5,000㎡ 이상 전층", "ESS 전기저장시설: 2024년 추가", "4~5층 어린이집: 600㎡ 미만도 전층 설치"]
      },
    ]
  },
  {
    id: "extinguisher", icon: "🧯", label: "소화기 배치",
    desc: "소화기 설치 대상·보행거리·능력단위 기준 변천",
    history: [
      {
        year: 1958, tag: "최초 제정", title: "소방법 제정 시 소화기 비치 의무 규정",
        detail: "최초 소방법에서 건축물 유형별 '단위수' 개념으로 소화기 수량을 산정. 위험물 저장소 중심으로 적용되었으며, 소화기 종류(포말, 소화액, 불연가스 등)별 능력단위를 규정함.",
        keyPoints: ["단위수 기반 소화기 수량 산정 방식", "위험물 저장소·제조소 중심 적용", "소화기 종류: 포말, 소화액, 불연가스 등", "이동식 대형소화기 25가론 이상 기준"]
      },
      {
        year: 1973, tag: "체계화", title: "보행거리 20m/30m, 능력단위 기준 확립",
        detail: "전부개정으로 현재까지 이어지는 소화기 설치 체계의 기본 골격이 마련됨. 바닥면적 기준 능력단위, 보행거리 기준, 설치높이 기준이 이때 확립됨.",
        keyPoints: ["바닥면적 33㎡마다 능력단위 1 이상", "소형소화기: 보행거리 20m 이내", "대형소화기: 보행거리 30m 이내", "설치높이: 바닥 1.5m 이하에 비치", "적색 바탕 백색 문자 표지 규정"]
      },
      {
        year: 2003, tag: "분법", title: "소방시설법 별표5 소화설비로 기준 이관",
        detail: "소방 4법 분법으로 소화기 설치기준이 시행령 별표5 소화설비 항목으로 체계적으로 재편됨. 위치표시등 설치 의무화.",
        keyPoints: ["시행령 별표5(소화설비)로 기준 이관", "능력단위 산정법 정비", "대형소화기 별도 기준 구체화", "소화기 위치표시등 설치 의무화"]
      },
      {
        year: 2022, tag: "현행", title: "현행 기준: 연면적 33㎡ 이상 모든 특정소방대상물",
        detail: "소방시설법 분리 시행 후 현행 기준 확정. 연면적 33㎡ 이상인 모든 특정소방대상물에 소화기 설치 의무. 자체점검 시 약제 유효기한 확인 항목 추가.",
        keyPoints: ["연면적 33㎡ 이상 모든 대상물 적용", "소형: 보행거리 20m, 대형: 30m 유지", "능력단위: 33㎡당 1단위 이상 유지", "자체점검 시 약제 유효기한 확인 추가", "미설치 시 과태료 300만원 이하"]
      },
    ]
  },
  {
    id: "alarm", icon: "🚨", label: "자동화재탐지",
    desc: "자동화재탐지설비 설치 대상·감지기·수신기 기준 변천",
    history: [
      {
        year: 1958, tag: "최초", title: "소방법 제정 시 '자동신호장치' 개념 등장",
        detail: "최초 소방법에서 '자동신호장치를 한 스프링클러'라는 표현으로 화재감지 설비 개념이 최초 등장. 독립된 설비가 아닌 스프링클러 부속장치 성격이었음.",
        keyPoints: ["'자동신호장치' 명칭으로 최초 등장", "스프링클러 연동 부속장치 성격", "위험물 제조소·저장소 중심 적용"]
      },
      {
        year: 1973, tag: "독립 분류", title: "자동화재탐지설비 독립 분류, 감지기 종류별 기준 마련",
        detail: "전부개정으로 자동화재탐지설비가 독립적 소방시설로 분류됨. 감지기 종류(차동식·정온식·이온화식·광전식)별 설치기준과 감지면적 기준이 마련됨.",
        keyPoints: ["자동화재탐지설비 독립 소방시설로 분류", "차동식 스포트: 내화 90㎡, 기타 50㎡ (1종)", "정온식 스포트: 내화 60㎡, 기타 30㎡ (특종)", "수신기: 상시 근무 장소(관리실 등) 설치", "음향장치: 25m 이내, 90dB 이상"]
      },
      {
        year: 2003, tag: "대폭 확대", title: "대구지하철 참사 후 설치 대상 대폭 확대",
        detail: "대구지하철 참사(192명 사망) 후 지하역사·지하상가 등이 의무대상에 추가되고, 연면적 기준이 대폭 하향 조정됨.",
        keyPoints: ["지하역사·지하상가 의무 설치 추가", "근생·판매·운수·숙박·의료 등: 연면적 600㎡ 이상", "공장·창고: 연면적 1,000㎡ 이상 (기존 1,500㎡→하향)", "발신기: 층마다 설치, 보행거리 25m 이내"]
      },
      {
        year: 2022, tag: "현행", title: "화재예방법 분리, 화재안전조사 제도 도입",
        detail: "화재예방법으로 화재안전조사 제도가 신설되면서 경보설비 점검의 투명성이 강화됨. 사전통지·결과공개 의무화.",
        keyPoints: ["화재안전조사 시 경보설비 중점 확인", "조사 전 사전통지·결과 공개 의무", "R형 수신기 설치 확대 추세", "감지기 오작동 관리 기준 강화", "아날로그식 감지기 확대 권고"]
      },
    ]
  },
  {
    id: "evacuation", icon: "🚪", label: "피난시설",
    desc: "피난시설·유도등·비상구 기준 변천",
    history: [
      {
        year: 1973, tag: "도입", title: "피난설비 기준 최초 체계화",
        detail: "전부개정으로 피난구유도등·통로유도등·비상조명등 등 피난설비 기준이 최초로 체계화됨. 완강기 등 피난기구 기준도 마련.",
        keyPoints: ["피난구유도등: 출입구 상단 설치", "통로유도등: 바닥 1m 이하, 20m 간격", "비상조명등: 바닥면 1lx 이상, 20분 유효", "완강기: 3층 이상, 지하층 설치 기준 마련"]
      },
      {
        year: 1999, tag: "강화", title: "씨랜드 화재 후 비상구·피난기준 강화",
        detail: "씨랜드 화재(어린이 19명 사망)에서 비상구 부실이 피해를 키운 것으로 확인됨. 비상구 폭·개수·잠금장치 기준이 대폭 강화됨.",
        keyPoints: ["비상구 폭: 0.75m 이상 명확화", "양방향 피난 시: 비상구 폭 1.0m 이상", "2방향 피난 원칙 강화", "노유자시설 피난기준 별도 마련", "피난통로 적재물 금지 규정 강화"]
      },
      {
        year: 2012, tag: "특별법", title: "초고층법: 30개 층마다 피난안전구역 의무",
        detail: "초고층 건축물(50층 이상 또는 200m 이상)에 대해 30개 층마다 피난안전구역 설치 의무화. 피난용 승강기, 종합방재실 연계 비상방송도 의무화됨.",
        keyPoints: ["30개 층마다 피난안전구역 의무", "피난용 승강기 설치 의무", "종합방재실 연계 비상방송 의무", "피난안전구역 내 급기가압 설비 설치"]
      },
      {
        year: 2018, tag: "대폭 강화", title: "제천·밀양 화재 후 비상구 관리 전면 강화",
        detail: "제천 스포츠센터(비상구 잠금→29명 사망)와 밀양 세종병원(환자 피난 불가→47명 사망) 참사 후 비상구 잠금장치·피난로 확보 기준이 전면 강화됨.",
        keyPoints: ["비상구 잠금장치: 자동개방 구조 의무", "피난통로 적재물 방치: 과태료 대폭 강화", "유도등 예비전원: 20분 이상 유효", "의료시설: 환자 피난 전용 계획 수립 의무", "소방차 진로방해 과태료 20만→200만원"]
      },
    ]
  },
  {
    id: "fireproof", icon: "🔥", label: "방염제도",
    desc: "방염 대상물·성능기준·대상시설 변천",
    history: [
      {
        year: 1973, tag: "도입", title: "방염제도 최초 도입: 11층 이상 커튼·카펫",
        detail: "전부개정으로 커튼·카펫·합판 등 실내장식물에 대한 방염 의무가 최초 도입됨. 11층 이상 건축물에 적용.",
        keyPoints: ["방염 대상: 커튼, 카펫, 합판, 무대합판, 암막, 블라인드", "11층 이상 건축물에 적용", "방염성능 시험 기준 마련", "방염성능검사필증 제도 시작"]
      },
      {
        year: 2003, tag: "확대", title: "다중이용업소·숙박시설 전면 적용, 침구류 추가",
        detail: "분법과 함께 방염 대상 시설이 다중이용업소·숙박시설·의료시설·노유자시설·장례식장으로 확대되고, 침구류·소파·의자도 방염처리 대상에 추가됨.",
        keyPoints: ["다중이용업소·숙박시설·의료시설 전면 적용", "침구류·소파·의자 → 방염처리 의무 추가", "지하상가 방염 대상 추가", "방염성능검사필증 부착 의무화"]
      },
      {
        year: 2022, tag: "분법", title: "화재예방법 제12조로 방염 규정 이관",
        detail: "화재예방법 제12조·시행령 제19조로 방염 규정이 이관됨. 성능기준은 잔염시간 3초 이내, 잔진시간 5초 이내, 탄화면적 40㎠ 이내로 유지.",
        keyPoints: ["화재예방법 제12조로 이관", "성능기준: 잔염 3초, 잔진 5초, 탄화 40㎠", "방염업자 등록제도 정비", "방염미필 물품 사용 시 과태료 300만원 이하"]
      },
      {
        year: 2024, tag: "대상 확대", title: "조산원·산후조리원, 치과·한의원까지 확대",
        detail: "시행령 개정으로 방염 대상 특정소방대상물에 조산원·산후조리원, 치과의원·한의원이 추가됨. 기존 시설도 실내장식물 교체 시 소급 적용.",
        keyPoints: ["조산원·산후조리원 → 방염 대상 추가", "치과의원·한의원 → 방염 대상 추가", "기존 시설: 실내장식물 교체 시 소급 적용", "건축물 내부 천장·벽 부착 가구류 추가"]
      },
    ]
  },
  {
    id: "manager", icon: "👷", label: "안전관리자",
    desc: "소방안전관리자 선임 등급·자격·신고 기준 변천",
    history: [
      {
        year: 1958, tag: "최초", title: "소방법 제정: '방화관리자' 제도 시작, 수용인원 50명 기준",
        detail: "최초 소방법에서 수용인원 50명 이상인 다수인 출입 장소에 '방화관리자' 선임 의무 규정. 등급 구분 없이 단일 제도. 해임 시 즉시 재선임 의무.",
        keyPoints: ["명칭: '방화관리자' (현 소방안전관리자)", "수용인원 50명 이상 장소에 선임 의무", "등급 구분 없음 (단일 제도)", "해임 시 즉시 재선임 의무", "소방서장에게 단순 신고"]
      },
      {
        year: 1967, tag: "완화", title: "선임 유예 30일 도입, 신고기한 7일 규정",
        detail: "전부개정으로 해임 후 즉시 재선임 의무가 30일 유예기간으로 완화됨. 선임·해임 시 7일 이내 소방서장 신고 의무 구체화.",
        keyPoints: ["해임 후 30일 유예기간 신설", "유예기간 중 소유자가 업무 대행", "선임·해임 7일 이내 신고 의무 구체화"]
      },
      {
        year: 1992, tag: "등급제 도입", title: "1급·2급 구분 도입: 수용인원→면적·층수 기준 전환",
        detail: "88올림픽 이후 고층건축물 증가에 대응하여, 수용인원 기준에서 면적·층수·소방시설 기준으로 전환. 1급·2급 방화관리대상물로 구분하여 관리자 자격 차등 적용.",
        keyPoints: ["수용인원 기준 → 면적·층수 기준으로 전환", "1급·2급 방화관리대상물 구분 신설", "11층 이상(소방력 한계 높이) → 1급", "자격기준 등급별 차등화 시작"]
      },
      {
        year: 2004, tag: "분법·명칭 변경", title: "'소방안전관리자'로 명칭 변경, 신고기한 14일로 강화",
        detail: "소방 4법 분법으로 '방화관리자'에서 '소방안전관리자'로 명칭 변경. 신고기한이 30일→14일로 단축되어 관리 강화. 기존 1급·2급 체계 유지.",
        keyPoints: ["방화관리자 → 소방안전관리자 명칭 변경", "선임 신고 기한: 30일 → 14일로 단축", "해임 신고 의무 폐지 (1999년 IMF 때 완화)", "1급·2급 체계 유지"]
      },
      {
        year: 2012, tag: "특급 신설", title: "30층 이상 고층건축물 → '특급' 등급 신설",
        detail: "2010년 부산 우신골든스위트(38층) 화재를 계기로, 30층 이상 고층건축물에 대한 특별관리를 위해 '특급' 소방안전관리대상물 등급을 새로 신설함.",
        keyPoints: ["특급 대상: 30층 이상 또는 120m 이상", "특급 대상: 연면적 20만㎡ 이상", "특급·1급·2급 3단계 체계로 확대", "특급 전담 안전관리자 선임 의무", "부산 우신골든스위트 화재(2010)가 계기"]
      },
      {
        year: 2017, tag: "3급 신설·세분화", title: "3급 신설 → 4단계(특급·1·2·3급) 체계 완성",
        detail: "제천 스포츠센터 화재(2017, 29명 사망)를 계기로 소방안전관리자 제도를 대대적으로 정비. 2급에서 3급을 분리(자탐만 설치된 소규모), 아파트도 규모별로 특급~3급 재분류. 시험 난이도 대폭 상승.",
        keyPoints: ["4단계 체계 완성: 특급·1급·2급·3급", "3급 분리: 자동화재탐지설비만 설치된 소규모", "아파트: 규모별 특급~3급 재분류", "합격률 급락: 특급 5~10%, 1급 10%대, 2급 20%대", "강습교육: 1급 80시간, 2급 40시간, 3급 24시간"]
      },
      {
        year: 2022, tag: "이관", title: "화재예방법 제24~28조로 이관, 교육 강화",
        detail: "화재예방법으로 안전관리자 규정 이관. 선임 30일 이내, 신고 14일 이내 체계 유지. 최초교육 선임 후 6개월 이내, 이후 2년마다 실무교육 의무.",
        keyPoints: ["화재예방법 제24~28조로 이관", "선임: 기준일로부터 30일 이내", "신고: 선임일로부터 14일 이내", "최초교육: 선임 후 6개월 이내", "정기교육: 2년마다 실무교육", "미선임 시 300만원 이하, 미신고 시 200만원 이하 과태료"]
      },
    ]
  },
  {
    id: "selfcheck", icon: "📋", label: "자체점검",
    desc: "소방시설 자체점검 유형·점검자·보고 기한 변천",
    history: [
      {
        year: 1973, tag: "도입", title: "소방시설 점검 의무 최초 도입",
        detail: "특정소방대상물 관계인에게 소방시설의 자체점검 의무를 최초 부여. 점검 결과를 기록·보관하도록 하고, 소방서장의 검사 권한도 병행 부여.",
        keyPoints: ["관계인 자체점검 의무 최초 규정", "점검 결과 기록·보관 의무", "소방서장 검사 권한 병행", "연 1회 이상 점검 원칙"]
      },
      {
        year: 2003, tag: "2단계 체계", title: "작동기능점검·종합정밀점검 2단계 구분",
        detail: "분법과 함께 자체점검을 작동기능점검(기능 정상 여부)과 종합정밀점검(설비 전반 성능)으로 2단계 구분. 전문 관리업체 점검 제도 도입.",
        keyPoints: ["작동기능점검: 기능 정상 여부 확인", "종합정밀점검: 설비 전반 성능 확인", "소방시설 관리업체 점검 제도 도입", "점검 결과 소방서 보고 의무화", "스프링클러·옥내소화전 등은 전문업체 필수"]
      },
      {
        year: 2014, tag: "강화", title: "보고 기한 30일 확정, 미실시 과태료 300만원",
        detail: "점검 완료 후 30일 이내 소방서 보고 의무 명확화. 미실시·미보고 시 과태료 300만원으로 명시. 점검 불량 시정명령 제도 도입.",
        keyPoints: ["완료 후 30일 이내 보고 의무 확정", "미실시·미보고: 과태료 300만원 이하", "점검 불량 시정명령 제도 도입", "점검 결과 허위 작성 시 벌칙 강화"]
      },
      {
        year: 2022, tag: "3단계 개편", title: "최초점검 신설 → 3단계 전면 개편 (2022.12.1 시행)",
        detail: "2022.12.1부터 최초점검·작동기능점검·종합정밀점검 3단계로 전면 개편. 옥내소화전·스프링클러 등은 관계인 직접 점검 불가, 소방기술사 또는 전문업체만 가능.",
        keyPoints: ["최초점검: 사용승인 후 60일 이내 (신설)", "작동기능점검: 연 1회 이상", "종합정밀점검: 연 1회 이상 (스프링클러 등, 1만㎡↑)", "옥내소화전·스프링클러 → 전문업체만 점검 가능", "관계인 직접 점검 가능 범위 축소", "점검 결과 공개 범위 확대"]
      },
    ]
  },
  {
    id: "penalty", icon: "💰", label: "벌칙·과태료",
    desc: "소방법 위반 벌칙·과태료 주요 변경 이력",
    history: [
      {
        year: 1958, tag: "최초", title: "소방법 제정 시 벌칙 규정 마련",
        detail: "소방검사 거부, 소방시설 미설치, 위험물 규정 위반 등에 대한 최초의 벌칙 규정이 마련됨.",
        keyPoints: ["소방검사 거부 시 벌칙", "소방시설 미설치 벌칙", "위험물 규정 위반 벌칙"]
      },
      {
        year: 2003, tag: "분법·신설", title: "시설 폐쇄·차단 5년 이하 징역 신설",
        detail: "분법으로 각 법률별 벌칙·과태료가 별도 규정됨. 소방시설 폐쇄·차단에 대한 벌칙이 5년 이하 징역(또는 5천만원 이하 벌금)으로 신설됨.",
        keyPoints: ["시설 폐쇄·차단: 5년 이하 징역 / 5천만원 이하 벌금", "시설 미설치: 3년 이하 징역 / 3천만원 이하 벌금", "각 법률별 벌칙·과태료 별도 규정"]
      },
      {
        year: 2018, tag: "대폭 강화", title: "소방차 진로방해 과태료 10배 상향, 소방관 보호 신설",
        detail: "제천·밀양 연이은 대형참사 후 소방차 진로방해 과태료를 20만원→200만원으로 10배 상향. 소방공무원의 적법한 소방활동에 대한 형사책임 감경·면제 조항 신설.",
        keyPoints: ["소방차 진로방해: 20만원 → 200만원 (10배)", "소방관 형사책임: 고의·중과실 없으면 감경·면제", "민형사 소송 지원 제도 신설", "비상소화장치 미관리: 과태료 신설"]
      },
    ]
  },
  {
    id: "multiuse", icon: "🎤", label: "다중이용업소",
    desc: "다중이용업소 안전관리 제도·시설기준 변천",
    history: [
      {
        year: 2003, tag: "계기", title: "대구지하철 참사 → 별도 법률 필요성 대두",
        detail: "192명 사망 참사 후 다중이 밀집하는 업소에 대해 기존 소방법만으로는 관리 한계가 있음을 인식. 별도 특별법 입법 논의 시작.",
        keyPoints: ["기존 소방법만으로는 관리 한계", "다중밀집 업소 별도 법률 필요성 제기", "국회 입법 논의 본격 시작"]
      },
      {
        year: 2006, tag: "특별법 제정", title: "다중이용업소법 제정: 노래방·PC방 안전시설 의무화",
        detail: "다중이용업소의 안전관리에 관한 특별법이 제정됨. 노래방·PC방·고시원·학원 등에 간이스프링클러·비상경보설비·피난유도선 등 설치 의무화.",
        keyPoints: ["대상: 노래방, PC방, 학원, 고시원, 목욕장 등", "간이스프링클러 설치 의무", "비상경보설비 설치 의무", "피난유도선·가스누설차단장치 의무", "내부 피난통로 폭 1.2m 이상 확보", "비상구 2개소 이상 확보", "업주 안전교육 이수 의무"]
      },
      {
        year: 2018, tag: "강화", title: "제천 화재 후 비상구·점검 기준 대폭 강화",
        detail: "제천 스포츠센터(비상구 잠금→탈출 불가→29명 사망)를 계기로 비상구 관리, 안전시설 점검 기준 대폭 강화. 업주 보수교육 주기도 단축됨.",
        keyPoints: ["비상구 잠금장치: 쉽게 열리는 구조 의무", "비상구 2개소 이상 확보 재강조", "안전시설등 정기점검 강화", "업주 보수교육 주기 단축", "위반 시 영업정지·과태료 강화"]
      },
    ]
  },
  {
    id: "ess", icon: "🔋", label: "ESS·신기술",
    desc: "전기저장시설(ESS) 소방기준 도입·변천",
    history: [
      {
        year: 2017, tag: "화재 발생", title: "ESS 화재 연이어 발생, 기존 법률에 기준 없음",
        detail: "2017년부터 태양광·풍력 등 신재생에너지 확대에 따라 ESS 설치가 급증하면서 ESS 관련 화재가 잇따라 발생. 2017~2019년 약 30건 이상. 기존 소방법에는 ESS 관련 별도 기준이 전무했음.",
        keyPoints: ["2017~2019년 ESS 화재 약 30건 이상", "기존 소방법에 ESS 기준 전무", "소방 당국 긴급 안전점검 실시", "ESS 화재 원인: 배터리 결함, 전기적 결함 등"]
      },
      {
        year: 2024, tag: "법제화", title: "ESS를 특정소방대상물로 분류, 소방시설 의무화",
        detail: "소방시설법 시행령 개정(2024)으로 전기저장시설을 특정소방대상물(별표2)에 추가. 자동소화설비·자동화재탐지설비 설치 필수, 건축허가 소방동의 대상에도 포함됨.",
        keyPoints: ["별표2 특정소방대상물에 ESS 추가", "자동소화설비(청정소화약제 등) 필수", "자동화재탐지설비 필수", "건축허가 소방동의 대상 포함", "전기사업법 제61조 인가 신청 시부터 적용", "온도감시 시스템·환기설비 권고"]
      },
    ]
  },
  {
    id: "hydrant", icon: "🔴", label: "옥내소화전",
    desc: "옥내소화전설비 설치 대상·방수성능 기준 변천",
    history: [
      {
        year: 1958, tag: "최초", title: "소방법 제정 시 옥내소화전 설치 규정",
        detail: "최초 소방법에서 '20분 이상 방수를 계속할 수 있는 수원 설치' 의무 규정. 소화전 설비를 단위수로 산정하는 방식이었음.",
        keyPoints: ["20분 이상 방수 가능한 수원 설치 의무", "단위수 기반 소화전 설비 산정", "대형 건축물·위험물 시설 중심 적용"]
      },
      {
        year: 1973, tag: "체계화", title: "방수압력 0.17MPa, 방수량 130L/min 기준 확립",
        detail: "전부개정으로 현재까지 유지되는 옥내소화전 핵심 기준이 확립됨. 방수압력·방수량·설치거리·수원량 기준이 구체적으로 정해짐.",
        keyPoints: ["노즐선단 방수압력: 0.17MPa 이상", "방수량: 130L/min 이상", "수평거리: 25m 이내 모든 부분 포함", "수원량: 최대 5개 × 2.6㎥ (20분 기준)", "각 층마다 설치 원칙"]
      },
      {
        year: 2003, tag: "분법·추가", title: "호스릴방식(60L/min) 기준 추가",
        detail: "분법과 함께 소규모 건축물에 적용하기 쉬운 호스릴방식 옥내소화전 기준이 추가됨. 기동표시등 설치 의무화.",
        keyPoints: ["호스릴방식: 방수량 60L/min 이상 추가", "기동표시등(적색) 설치 의무화", "소화전함 내 호스·관창 비치 의무", "펌프 자동기동 시험 기준 정비"]
      },
      {
        year: 2022, tag: "현행", title: "현행: 3,000㎡ 이상 또는 지하·무창 600㎡ 이상",
        detail: "현행 설치 대상: 연면적 3,000㎡ 이상 또는 지하층·무창층 바닥면적 600㎡ 이상. 자체점검 시 전문업체만 점검 가능.",
        keyPoints: ["설치 대상: 연면적 3,000㎡ 이상", "지하·무창층: 바닥면적 600㎡ 이상", "방수압력 0.17MPa, 방수량 130L/min 유지", "전문업체 전담 점검", "펌프 자동기동 시험 의무화"]
      },
    ]
  },
  {
    id: "org", icon: "🏛️", label: "소방 조직",
    desc: "소방행정 조직 변천 (내무부→소방청→국가직)",
    history: [
      {
        year: 1958, tag: "초기", title: "내무부 산하, 국가·지방사무 이원화",
        detail: "소방법 제정 당시 소방업무는 내무부-시도지사 소속으로 운영. 국가소방사무와 지방소방사무가 이원화된 구조였음.",
        keyPoints: ["내무부 산하 소방행정", "시도지사 소속 소방서", "국가·지방사무 이원화", "소방공무원: 지방직"]
      },
      {
        year: 1992, tag: "광역화", title: "소방사무 광역자치단체 일원화 추진",
        detail: "소방사무를 시·군 단위에서 시·도(광역) 단위로 일원화하는 작업이 추진됨. 시도 소방본부 체계가 정비됨.",
        keyPoints: ["시·군 → 시·도(광역) 단위 일원화", "시도 소방본부 체계 정비", "소방본부장 역할 강화"]
      },
      {
        year: 2004, tag: "분법", title: "소방기본법 제정, 119 구조·구급 법제화",
        detail: "소방기본법 제정으로 소방업무의 기본 체계가 법제화됨. 119 구조·구급 업무가 소방의 핵심 기능으로 법적 근거를 확보.",
        keyPoints: ["소방기본법 제정 (2003.5.29)", "119 구조·구급 업무 법제화", "소방박물관·체험관 설립 근거", "국제구조대 편성 근거"]
      },
      {
        year: 2014, tag: "국민안전처", title: "세월호 참사 → 국민안전처 신설, 소방본부 소속",
        detail: "세월호 참사(2014.4.16, 304명 사망)를 계기로 재난안전 컨트롤타워로 국민안전처가 신설(2014.11)되고, 중앙소방본부가 소속됨.",
        keyPoints: ["국민안전처 신설 (2014.11)", "중앙소방본부 → 국민안전처 소속", "해양경비안전본부도 국민안전처 소속", "재난안전 컨트롤타워 역할"]
      },
      {
        year: 2017, tag: "독립", title: "소방청 독립 신설 (행정안전부 외청)",
        detail: "정부조직법 개정(2017.7.26)으로 소방청이 행정안전부 외청으로 독립 신설됨. 소방행정의 전문성·독립성이 확보됨.",
        keyPoints: ["행정안전부 외청으로 독립 (2017.7)", "소방청장 직급 격상", "독자적 정책 수립·집행 체계 구축"]
      },
      {
        year: 2020, tag: "국가직", title: "소방공무원 지방직 → 국가직 전환 (2020.4.1)",
        detail: "소방공무원이 지방직에서 국가직으로 전환됨(2020.4.1 시행). 전국 균등한 소방서비스 제공과 처우 표준화의 기반이 마련됨.",
        keyPoints: ["지방직 → 국가직 전환 (2020.4.1)", "처우·보수 전국 표준화", "소방력 배치 기준 전국 통일", "한국119청소년단 설립 근거 마련"]
      },
    ]
  },
];

/* ═══ 법령 원문 URL 매핑 ═══ */
const LAW_URLS = {
  "소방법": "https://www.law.go.kr/법령/소방법",
  "소방기본법": "https://www.law.go.kr/법령/소방기본법",
  "소방시설법": "https://www.law.go.kr/법령/소방시설설치및관리에관한법률",
  "화재예방법": "https://www.law.go.kr/법령/화재의예방및안전관리에관한법률",
  "다중이용업소법": "https://www.law.go.kr/법령/다중이용업소의안전관리에관한특별법",
  "위험물안전관리법": "https://www.law.go.kr/법령/위험물안전관리법",
  "소방시설공사업법": "https://www.law.go.kr/법령/소방시설공사업법",
  "초고층법": "https://www.law.go.kr/법령/초고층및지하연계복합건축물재난관리에관한특별법",
  "정부조직법": "https://www.law.go.kr/법령/정부조직법",
  "구소방시설법": "https://www.law.go.kr/법령/화재예방,소방시설설치·유지및안전관리에관한법률",
};

function getLawInfo(year, topicId, tag) {
  // 2022년 분법 이후
  if (year >= 2022) {
    if (topicId === "manager" || topicId === "fireproof") return { name: "화재예방법 원문", url: LAW_URLS["화재예방법"] };
    if (topicId === "multiuse") return { name: "다중이용업소법 원문", url: LAW_URLS["다중이용업소법"] };
    if (topicId === "org") return { name: "소방기본법 원문", url: LAW_URLS["소방기본법"] };
    return { name: "소방시설법 원문", url: LAW_URLS["소방시설법"] };
  }
  // 특별법
  if (tag.includes("특별법") || topicId === "multiuse") {
    if (topicId === "multiuse") return { name: "다중이용업소법 원문", url: LAW_URLS["다중이용업소법"] };
    return { name: "초고층법 원문", url: LAW_URLS["초고층법"] };
  }
  // 조직 관련
  if (topicId === "org") {
    if (year >= 2017) return { name: "정부조직법 원문", url: LAW_URLS["정부조직법"] };
    return { name: "소방기본법 원문", url: LAW_URLS["소방기본법"] };
  }
  // 2014~2021: 구 소방시설법
  if (year >= 2014) return { name: "구 소방시설법 원문", url: LAW_URLS["구소방시설법"] };
  // 2003~2013: 분법 이후
  if (year >= 2003) {
    if (topicId === "penalty" && year === 2018) return { name: "소방기본법 원문", url: LAW_URLS["소방기본법"] };
    return { name: "소방시설법 원문", url: LAW_URLS["소방시설법"] };
  }
  // 2003년 이전: 구 소방법
  return { name: "구 소방법 원문", url: LAW_URLS["소방법"] };
}

/* ═══ 슬라이드 패널 (주제별 변경 이력) ═══ */
function HistoryPanel({ isOpen, onClose, topic }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.22)",
        zIndex: 998, opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "auto" : "none",
        transition: "opacity 0.3s ease", backdropFilter: "blur(2px)",
      }} />
      <div ref={scrollRef} style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: "100vw", background: C.bg, zIndex: 999,
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.32,0.72,0,1)",
        overflowY: "auto", WebkitOverflowScrolling: "touch",
        boxShadow: isOpen ? "-6px 0 40px rgba(0,0,0,0.1)" : "none",
      }}>
        {topic && (
          <>
            {/* 헤더 */}
            <div style={{
              position: "sticky", top: 0, background: C.bg, zIndex: 10,
              padding: "16px 20px 14px", borderBottom: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 26 }}>{topic.icon}</span>
                <div>
                  <div style={{ fontSize: 19, fontWeight: 700, color: C.text, letterSpacing: "-0.01em" }}>{topic.label}</div>
                  <div style={{ fontSize: 14, color: C.muted, fontWeight: 500 }}>변경 이력 타임라인</div>
                </div>
              </div>
              <button onClick={onClose} style={{
                width: 34, height: 34, borderRadius: 17, background: C.borderSoft,
                border: "none", fontSize: 17, color: C.sub, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>✕</button>
            </div>

            {/* 설명 */}
            <div style={{ padding: "16px 20px 0" }}>
              <div style={{
                background: C.accentSoft, borderRadius: 12, padding: "12px 14px",
                fontSize: 15, color: C.accent, fontWeight: 600, lineHeight: 1.5, marginBottom: 20,
              }}>📘 {topic.desc}</div>
            </div>

            {/* 타임라인 */}
            <div style={{ padding: "0 20px 40px" }}>
              {topic.history.map((h, idx) => (
                <div key={idx}>
                  {/* 카드 */}
                  <div style={{
                    background: C.card, borderRadius: 14,
                    padding: "18px 20px 20px",
                    border: `1px solid ${C.border}`,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <span style={{ fontSize: 22, fontWeight: 800, color: C.primary, letterSpacing: "-0.02em" }}>{h.year}년</span>
                      <span style={{
                        fontSize: 13, fontWeight: 600, padding: "3px 10px", borderRadius: 7,
                        background: h.tag.includes("화재") || h.tag.includes("강화") || h.tag.includes("계기") ? C.redBg :
                          h.tag.includes("분법") || h.tag.includes("개편") || h.tag.includes("이관") ? C.purpleSoft :
                            h.tag.includes("특별법") || h.tag.includes("법제화") ? C.greenBg : C.primarySoft,
                        color: h.tag.includes("화재") || h.tag.includes("강화") || h.tag.includes("계기") ? C.red :
                          h.tag.includes("분법") || h.tag.includes("개편") || h.tag.includes("이관") ? C.purple :
                            h.tag.includes("특별법") || h.tag.includes("법제화") ? C.green : C.primary,
                      }}>{h.tag}</span>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: C.text, lineHeight: 1.4, marginBottom: 10 }}>
                      {h.title}
                    </div>
                    <div style={{ fontSize: 15, color: C.sub, lineHeight: 1.6, marginBottom: 14, fontWeight: 450 }}>
                      {h.detail}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                      {h.keyPoints.map((kp, ki) => (
                        <div key={ki} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <span style={{
                            width: 6, height: 6, borderRadius: 3, flexShrink: 0,
                            background: C.primary, marginTop: 7, opacity: 0.5,
                          }} />
                          <span style={{ fontSize: 15, color: C.text, lineHeight: 1.5, fontWeight: 500 }}>{kp}</span>
                        </div>
                      ))}
                    </div>
                    {/* 법령 원문 보기 버튼 */}
                    {(() => {
                      const law = getLawInfo(h.year, topic.id, h.tag);
                      return (
                        <button
                          onClick={(e) => { e.stopPropagation(); window.open(law.url, "_blank"); }}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            width: "100%", padding: "12px 0",
                            background: C.accentSoft, border: `1px solid ${C.accent}30`,
                            borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
                            WebkitTapHighlightColor: "transparent",
                          }}
                        >
                          <span style={{ fontSize: 15 }}>📄</span>
                          <span style={{ fontSize: 14, fontWeight: 600, color: C.accent }}>{law.name}</span>
                          <span style={{ fontSize: 12, color: C.muted }}>↗</span>
                        </button>
                      );
                    })()}
                  </div>

                  {/* 구분 화살표 */}
                  {idx < topic.history.length - 1 && (
                    <div style={{
                      display: "flex", justifyContent: "center", padding: "12px 0",
                      fontSize: 20, opacity: 0.8, color: C.primary
                    }}>
                      ⬇️
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* ═══ 메인 앱 ═══ */
export default function App() {
  const [tab, setTab] = useState("home");
  const [panelTopic, setPanelTopic] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [aiQ, setAiQ] = useState("");
  const [aiR, setAiR] = useState("");
  const [aiL, setAiL] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handlePopState = () => {
      if (panelOpen) {
        setPanelOpen(false);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [panelOpen]);

  const openTopic = t => {
    window.history.pushState({ modal: true }, "");
    setPanelTopic(t);
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    if (window.history.state?.modal) {
      window.history.back();
    }
  };

  const [webSearch, setWebSearch] = useState(false);

  const askAI = async () => {
    if (!aiQ.trim()) return;
    setAiL(true); setAiR("");
    const sysPrompt = `당신은 대한민국 소방법령 역사 전문가입니다. 사용자가 특정 소방 규정이나 제도에 대해 물으면,
해당 법령이 '언제, 어떤 배경으로, 어떻게 변경되었는지'를 연도별 타임라인으로 정리해 답변합니다.
${webSearch ? "웹 검색으로 최신 법령 정보까지 반영합니다." : "내부 지식으로 빠르게 답변합니다."}
규칙:
- 한국어로 답변
- 연도별 흐름을 명확하게 제시 (예: "1973년: ~, 2003년: ~, 2022년: ~")
- 법률명·조항 구체적으로 포함
- 대형 화재 등 변경 계기가 있으면 반드시 언급
- 소방관 현장 실무에 도움되는 관점
- 간결하게 핵심만 정리`;

    try {
      const body = {
        model: "claude-sonnet-4-20250514", max_tokens: 1200,
        system: sysPrompt,
        messages: [{ role: "user", content: aiQ }],
        stream: true,
      };
      if (webSearch) body.tools = [{ type: "web_search_20250305", name: "web_search" }];

      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        setAiR("오류: " + (err.error?.message || res.statusText));
        setAiL(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.trim() || !line.startsWith("data: ")) continue;
          const data = line.slice(6);
          try {
            const evt = JSON.parse(data);
            const text = evt.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              fullText += text;
              setAiR(fullText);
            }
          } catch (e) {}
        }
      }
      if (!fullText) setAiR("응답을 가져올 수 없습니다.");
    } catch (err) { setAiR("오류: " + err.message); }
    setAiL(false);
  };

  const fTopics = TOPICS.filter(t =>
    !search || t.label.includes(search) || t.desc.includes(search) ||
    t.history.some(h => h.title.includes(search) || h.detail.includes(search) || String(h.year).includes(search))
  );

  const font = "'Pretendard Variable', 'Pretendard', -apple-system, 'Apple SD Gothic Neo', sans-serif";

  const Dots = ({ c }) => (
    <div style={{ display: "flex", gap: 6, alignItems: "center", padding: "14px 0" }}>
      {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: 4, background: c, animation: `d 1.4s ease ${i * .16}s infinite` }} />)}
      <span style={{ fontSize: 14, color: C.muted, marginLeft: 8, fontWeight: 500 }}>{webSearch ? "웹 검색 중... (10~20초)" : "답변 생성 중..."}</span>
      <style>{`@keyframes d{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1.2)}}`}</style>
    </div>
  );

  return (
    <div style={{ fontFamily: font, background: C.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", paddingBottom: 72, color: C.text }}>
      <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" rel="stylesheet" />

      {/* ─── Header ─── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(246,244,240,0.86)", backdropFilter: "blur(20px) saturate(180%)",
        padding: "16px 20px 14px", borderBottom: `1px solid ${C.borderSoft}`,
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 24 }}>🔥</span>
            <div style={{ fontSize: 19, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>소방법령 변천사</div>
          </div>
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 500, paddingLeft: 32 }}>법령이 언제, 왜, 어떻게 바뀌었는지 한눈에 확인하세요.</div>
        </div>
      </header>

      {/* ─── 홈 ─── */}
      {tab === "home" && (
        <div style={{ padding: "20px 20px 0" }}>
          {/* 소개 문구 */}
          <div style={{
            background: C.card, borderRadius: 14, padding: "16px 18px", marginBottom: 22,
            border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
          }}>
            <div style={{ fontSize: 15, color: C.text, lineHeight: 1.6, fontWeight: 500 }}>
              <span style={{ color: C.primary, fontWeight: 650 }}>항목을 선택</span>하면 해당 법령이
              <span style={{ color: C.primary, fontWeight: 650 }}> 연도별로 어떻게 변경</span>되어 왔는지
              한눈에 볼 수 있습니다. 빠진 항목은 AI가 법제처에서 실시간 검색하여 보여줍니다.
            </div>
          </div>

          {/* 뱃지 그리드 */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 3, height: 18, borderRadius: 2, background: C.primary }} />
              항목별 법령 변천사
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {fTopics.map(t => (
                <button key={t.id} onClick={() => openTopic(t)} style={{
                  background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
                  padding: "16px 6px 14px", cursor: "pointer", textAlign: "center",
                  fontFamily: font, display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
                  transition: "transform 0.12s", WebkitTapHighlightColor: "transparent",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                }}
                  onTouchStart={e => e.currentTarget.style.transform = "scale(0.95)"}
                  onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  <span style={{ fontSize: 28 }}>{t.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: 650, color: C.text, lineHeight: 1.3 }}>{t.label}</span>
                  <span style={{ fontSize: 12, color: C.muted, fontWeight: 500, lineHeight: 1.3, padding: "0 4px" }}>
                    {t.history.length}단계 변천
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* AI CTA */}
          <div style={{
            background: "linear-gradient(135deg, #1B1B3A, #2D2A5E)", borderRadius: 16,
            padding: "20px 18px", marginBottom: 28,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 18 }}>🤖</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>내장 데이터에 없는 주제는 AI가 검색</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["화재알림설비 변경 이력", "건설현장 임시소방시설 변천", "성능위주설계 도입 과정", "소방차 전용구역 법 변천"].map((q, i) => (
                <button key={i} onClick={() => { setAiQ(q); setTab("ai"); }} style={{
                  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 20, padding: "8px 14px", color: "#D8D6F0", fontSize: 14,
                  fontWeight: 600, cursor: "pointer", fontFamily: font,
                  WebkitTapHighlightColor: "transparent",
                }}>{q}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── AI 검색 ─── */}
      {tab === "ai" && (
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 3, height: 18, borderRadius: 2, background: C.purple }} />
              AI 법령 변천사 검색
            </div>
            <div style={{ fontSize: 14, color: C.muted, marginBottom: 14, fontWeight: 500, lineHeight: 1.5 }}>
              궁금한 소방 규정을 입력하면 연도별 변경 이력을 정리합니다.
            </div>
            {/* 속도 토글 */}
            <div style={{
              display: "flex", gap: 8, marginBottom: 14, background: C.borderSoft,
              borderRadius: 12, padding: 4,
            }}>
              <button onClick={() => setWebSearch(false)} style={{
                flex: 1, padding: "10px 0", borderRadius: 10, border: "none",
                background: !webSearch ? C.card : "transparent",
                boxShadow: !webSearch ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                color: !webSearch ? C.text : C.muted, fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: font, transition: "all 0.2s",
              }}>⚡ 빠른 답변</button>
              <button onClick={() => setWebSearch(true)} style={{
                flex: 1, padding: "10px 0", borderRadius: 10, border: "none",
                background: webSearch ? C.card : "transparent",
                boxShadow: webSearch ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                color: webSearch ? C.text : C.muted, fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: font, transition: "all 0.2s",
              }}>🔍 웹 검색 (정확)</button>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input value={aiQ} onChange={e => setAiQ(e.target.value)} onKeyDown={e => e.key === "Enter" && askAI()}
                placeholder="예: 화재알림설비 설치기준 변경 이력"
                style={{ flex: 1, width: 0, padding: "13px 16px", background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 16, color: C.text, fontFamily: font, outline: "none", fontWeight: 500 }} />
              <button onClick={askAI} disabled={aiL} style={{
                padding: "13px 20px", borderRadius: 12,
                background: aiL ? C.borderSoft : "linear-gradient(135deg, #6D3CC7, #8B5CF6)",
                border: "none", color: "#fff", fontSize: 16, fontWeight: 650,
                cursor: aiL ? "wait" : "pointer", fontFamily: font, whiteSpace: "nowrap",
              }}>{aiL ? "..." : webSearch ? "검색" : "질문"}</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {["물분무소화설비 기준 변천", "제연설비 설치 기준 변화", "소방시설 성능인증 제도", "소방기술자 자격 변천", "위험물 저장소 기준 변화"].map((q, i) => (
                <button key={i} onClick={() => setAiQ(q)} style={{
                  background: C.card, border: `1px solid ${C.border}`, borderRadius: 20,
                  padding: "7px 12px", fontSize: 14, color: C.sub, fontWeight: 600,
                  cursor: "pointer", fontFamily: font, WebkitTapHighlightColor: "transparent",
                }}>{q}</button>
              ))}
            </div>

            {aiL && <Dots c={C.purple} />}

            {aiR && (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 16px", fontSize: 15, color: C.text, lineHeight: 1.7, fontWeight: 450, whiteSpace: "pre-wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid ${C.borderSoft}` }}>
                  <span style={{ fontSize: 15 }}>🤖</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.purple }}>AI 변천사 분석</span>
                </div>
                {aiR}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Bottom Tab ─── */}
      <nav style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480,
        background: "rgba(255,255,255,0.86)", backdropFilter: "blur(20px) saturate(180%)",
        borderTop: `1px solid ${C.borderSoft}`,
        display: "flex", justifyContent: "space-around",
        padding: "7px 0 max(env(safe-area-inset-bottom, 0px), 7px)", zIndex: 100,
      }}>
        {[
          { id: "home", icon: "🏠", label: "항목별 검색" },
          { id: "ai", icon: "🤖", label: "AI 검색" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            padding: "7px 28px", fontFamily: font, WebkitTapHighlightColor: "transparent",
            opacity: tab === t.id ? 1 : 0.38, transition: "opacity 0.15s",
          }}>
            <span style={{ fontSize: 24, marginBottom: 4, opacity: tab === t.id ? 1 : 0.6 }}>{t.icon}</span>
            <span style={{
              fontSize: 12, fontWeight: 700,
              color: tab === t.id ? C.primary : "#666666",
            }}>{t.label}</span>
          </button>
        ))}
      </nav>

      {/* Panel */}
      <HistoryPanel isOpen={panelOpen} onClose={closePanel} topic={panelTopic} />
    </div>
  );
}
