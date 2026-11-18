export const APPS_SCRIPT_CODE = `/**
 * 전교회장 선거 개표방송 - Google Apps Script
 * 1) 스프레드시트 > 확장 프로그램 > Apps Script 에 붙여넣기
 * 2) setupTemplate 함수를 한 번 실행하면 '후보자', '설정' 시트가 만들어집니다.
 * 3) 배포 > 새 배포 > 유형: 웹 앱 / 실행: 나 / 액세스: 모든 사용자
 * 4) 발급된 웹 앱 URL(…/exec)을 관리자 화면에 붙여넣으세요.
 */
function doGet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var candidates = ss.getSheetByName('후보자') || ss.getSheets()[0];
  var settings = ss.getSheetByName('설정');
  var payload = {
    candidates: candidates.getDataRange().getDisplayValues(),
    settings: settings ? settings.getDataRange().getDisplayValues() : [],
    updatedAt: new Date().toISOString()
  };
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function setupTemplate() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var c = ss.getSheetByName('후보자') || ss.insertSheet('후보자', 0);
  if (c.getLastRow() === 0) {
    c.getRange(1, 1, 5, 6).setValues([
      ['기호', '이름', '소개', '득표수', '사진URL', '색상'],
      [1, '김서준', '듣는 학생회, 움직이는 학교', 0, '', '#2F6BFF'],
      [2, '이하은', '모두가 주인공인 우리 학교', 0, '', '#E5383B'],
      [3, '박지호', '약속은 데이터로 증명합니다', 0, '', '#12A37B'],
      [4, '최유나', '즐거운 등굣길을 만듭니다', 0, '', '#FF7A1A']
    ]);
    c.getRange(1, 1, 1, 6).setFontWeight('bold');
  }
  var s = ss.getSheetByName('설정') || ss.insertSheet('설정');
  if (s.getLastRow() === 0) {
    s.getRange(1, 1, 5, 2).setValues([
      ['선거인수', 1320],
      ['총투표수', 1250],
      ['개표수', 0],
      ['무효표', 0],
      ['선거명', '제27대 전교회장 선거']
    ]);
  }
}`
