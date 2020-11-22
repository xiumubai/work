/**
 * 接口信息
 * @type {String}
 */

const authorizations = 'authorizations'// 小程序登陆认证

const updateToken = 'authorizations'// 刷新token

const updateUsers = 'users/update'// 更新用户信息

const myinfo = 'myinfo'// 获取我的信息

const articlesTitle = 'articles/tops'// 文章标题列表

const articlesList = 'articles'// 文章列表

const articlesDetail = 'articles'// 文章详情

const coursesList = 'courses?include=tags,org'// 课程列表

const coursesDetail = 'courses'// 课程详情

const lessonsList = 'courses'// 课程课时列表

const lessonsDetail = 'lessons'// 课程课时列表

const resource = 'lessons'// 课程课时详情

const lessonLearn = 'lessons'// 课程课时学习记录

const courseLearnList = 'learns/courses'// 课程学习记录列表

const followtags = 'followtags'// 获取关注标签信息

const trycourses = 'trycourses'// 试学课程列表

const topcourses = 'topcourses'// banner课程列表

const coursecates = 'coursecates'// 课程分类列表

const plantasks = 'plantasks' // 学习计划

const bookoptions = 'bookoptions' // 教材的年级、上下册

const books = 'books' // 教材信息

const excardrecords = 'excardrecords' // 交流卡记录列表

const excards = 'excards' // 交流卡信息

const excardimages = 'excardimages' // 交流卡生成图片

const todayexcards = 'todayexcards' // 今日交流卡信息

const syncPractices = 'sync-practices' // 同步练习题列表

const syncPracticeBooks = 'sync-practice-books' // 练习题列表教材

const answers = 'answers' // 记录答题

const pronouncePractices = 'pronounce-practices' // 发音练习题列表

const pronouncePracticeBooks = 'pronounce-practice-books' // 发音练习教材列

const ebookPages = 'ebook-pages' // 获取电子书内容

const ebooks = 'ebooks' // 电子课本列表

const pronounceEvaluate = 'pronounce-evaluate' // 英语-语音评测

const pronounceAnswers = 'pronounce-answers' // 英语-发音练习答题记录

const englishDictatePractices = 'english-dictate-practices' // 英语-课后听写

const englishDictateBooks = 'english-dictate-books' // 英语-教材列表

const chineseDictatePractices = 'chinese-dictate-practices' // 语文-课后听写

const chineseDictateNooks = 'chinese-dictate-books' // 语文-教材列表

const hanziPractices = 'hanzi-practices' // 快速识字题

const hanziPracticeBooks = 'hanzi-practice-books' // 快速识字教材列表

const oralPractices = 'oral-practices' // 口算练习题列表

const oralPracticeBooks = 'oral-practice-books' // 口算练习教材列表

const ebookProgress = 'ebook-progress' // 记录点读进度

const learningCalendar = 'learning-calendar' // 获取学习日历情况

const dailyLearningLogs = 'daily-learning-logs' // 获取某日的学习记录

const learningCalendarShare = 'learning-calendar-share' // 标记学习日历分享

const learningChapters = 'learning-chapters' // 获取学习教材章节

const learningBooks = 'learning-books' // 学习教材

const ebookChapters = 'ebook-chapters' // 获取电子课本章节

const dictateChapters = 'dictate-chapters' // 获取课后听写课本章节

const pronounceChapters = 'pronounce-chapters' // 获取发音练习课本章节

const syncPracticeChapters = 'sync-practice-chapters' // 获取同步练习课本章节

const homeTopCourses = 'home-top-courses' // 获取首页顶部banner

export default {
  authorizations,
  updateToken,
  updateUsers,
  myinfo,
  articlesTitle,
  articlesList,
  articlesDetail,
  coursesList,
  coursesDetail,
  lessonsList,
  lessonsDetail,
  resource,
  lessonLearn,
  courseLearnList,
  followtags,
  trycourses,
  topcourses,
  coursecates,
  plantasks,
  bookoptions,
  books,
  excardrecords,
  excards,
  excardimages,
  todayexcards,
  syncPractices,
  syncPracticeBooks,
  answers,
  pronounceAnswers,
  pronouncePractices,
  pronouncePracticeBooks,
  ebookPages,
  ebooks,
  pronounceEvaluate,
  englishDictatePractices,
  englishDictateBooks,
  chineseDictatePractices,
  chineseDictateNooks,
  hanziPractices,
  hanziPracticeBooks,
  oralPractices,
  oralPracticeBooks,
  ebookProgress,
  learningCalendar,
  dailyLearningLogs,
  learningCalendarShare,
  learningBooks,
  learningChapters,
  ebookChapters,
  dictateChapters,
  pronounceChapters,
  syncPracticeChapters,
  homeTopCourses
}
