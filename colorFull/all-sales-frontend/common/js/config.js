let BASE_URL = "";

if (process.env.NODE_ENV === "development") {
  // 开发环境
  BASE_URL = "http://as-test.duodeclass.com/h5/api/";
} else {
  // 生产环境
  BASE_URL = "https://as-test.duodeclass.com/h5/api/";
}

export default BASE_URL;
