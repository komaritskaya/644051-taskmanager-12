import API from "./api.js";
import SiteMenuComponent, {MenuItem} from './components/site-menu';
import FilterController from './controllers/filter';
import BoardComponent from './components/board';
import StatisticsComponent from './components/statistics';
import TasksModel from './models/tasks';
import BoardController from './controllers/board';
import {render} from './utils/render';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=`;
const END_POINT = `https://11.ecmascript.pages.academy/task-manager`;

const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();

const api = new API(END_POINT, AUTHORIZATION);
const tasksModel = new TasksModel();

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const siteMenuComponent = new SiteMenuComponent();
const statisticsComponent = new StatisticsComponent({tasks: tasksModel, dateFrom, dateTo});
const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent, tasksModel, api);
const filterController = new FilterController(siteMainElement, tasksModel);

render(siteHeaderElement, siteMenuComponent);
filterController.render();

render(siteMainElement, boardComponent);
render(siteMainElement, statisticsComponent);
statisticsComponent.hide();

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      statisticsComponent.hide();
      boardController.show();
      boardController.createTask();
      break;
    case MenuItem.STATISTICS:
      boardController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TASKS:
      statisticsComponent.hide();
      boardController.show();
      break;
  }
});

api.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(tasks);
    boardController.render();
  });


//    /\_/\
//   / - - \
//  <_  X  _>   /\_/\
//  /       \  <_0_0_>
// (_)_U_U_(_)  (u_u)
