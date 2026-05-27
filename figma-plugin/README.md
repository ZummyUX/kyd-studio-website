# KYD Studio — Figma Plugin

פלאגין שמייצר אוטומטית את כל עמוד הנחיתה של KYD Studio בתוך Figma.

## איך להשתמש

### שיטה 1 — Import from manifest (מומלץ)

1. הורד/clone את הריפו למחשב שלך
2. פתח Figma Desktop
3. לך ל: **Plugins → Development → Import plugin from manifest...**
4. בחר את הקובץ `figma-plugin/manifest.json`
5. הרץ את הפלאגין: **Plugins → Development → KYD Studio — Generate Design**

### שיטה 2 — הדבקה ישירה בקונסול

1. פתח Figma
2. לך ל: **Plugins → Development → Open Console**
3. העתק את כל התוכן של `code.js` והדבק בקונסול
4. הקש Enter

---

## מה הפלאגין מייצר

עמוד נחיתה שלם ב-1440px רוחב עם כל הסקשנים:

| סקשן | תיאור |
|------|-------|
| **Nav** | לוגו + תפריט + כפתור CTA |
| **Hero** | כותרת ראשית + טקסט + ויז'ואל Concept MVP |
| **Audience Strip** | 5 קבוצות קהל עם אייקונים |
| **מה אנחנו עושים** | 4 כרטיסים ממוספרים |
| **איך זה עובד** | זרימת 7 שלבים |
| **מה יוצא לך מזה** | 3 יתרונות |
| **דוגמאות מהשטח** | 3 case studies עם placeholder תמונה |
| **About** | פרופיל מייסד + 3 סטטיסטיקות |
| **חבילות מומלצות** | 3 מחירים + רשימת כלולות |
| **טופס יצירת קשר** | 4 שדות + כפתור שליחה |
| **Footer** | זכויות + לינקים + סושיאל |

## פונטים נדרשים

הפלאגין משתמש ב:
- **Frank Ruhl Libre** — כותרות (זמין ב-Google Fonts של Figma)
- **Assistant** — טקסט גוף (זמין ב-Google Fonts של Figma)

אם הפונטים לא נטענים, Figma ישתמש ב-fallback אוטומטי.
