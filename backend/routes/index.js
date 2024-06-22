import authRouter from "./auth.route.js";
import courseRouter from "./course.route.js";
import folderRouter from "./folder.route.js";
import userRouter from "./user.route.js";
import otherRouter from "./other.route.js";

const route = (app) => {
  app.use('/auth', authRouter);
  app.use('/users', userRouter);
  app.use('/folders', folderRouter);
  app.use('/courses', courseRouter);
  app.use('/other', otherRouter);
  app.get('/check', (req, res) => res.status(200).json({ message: "Healthy!" }))
}

export default route;