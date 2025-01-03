import Mock from "./mock";
import "./db/auth"
import "./db/api"

Mock.onAny().passThrough();
