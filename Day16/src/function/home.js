const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

async function home(req, res) {
  const query = `SELECT projects.id, projects.name, projects.start_date, projects.end_date_string, projects.description ,projects.technologies, projects.image, 
  users.name AS users, users.id AS usersId, projects."createdAt", projects."updatedAt" FROM projects LEFT JOIN users ON
  projects."userId" = users.id`;
  const obj = await sequelize.query(query, { type: QueryTypes.SELECT });
  for (let index = 0; index < obj.length; index++) {
    const start_date = obj[index].start_date;
    const end_date = obj[index].end_date_string;

    const timeDifference = end_date - start_date;
    const dayDifference = timeDifference / (1000 * 60 * 60 * 24);
    const monthDifference = end_date.getMonth() - start_date.getMonth() + 12 * (end_date.getFullYear() - start_date.getFullYear());
    const yearsDifference = end_date.getFullYear() - start_date.getFullYear();

    const isLogin = req.session.isLogin;

    let msg = '';
    if (dayDifference >= 1 && dayDifference <= 31) {
      msg = dayDifference + ' Day';
    } else if (monthDifference >= 1 && monthDifference <= 12) {
      msg = monthDifference + ' Month';
    } else {
      msg = yearsDifference + ' Years';
    }
    obj[index].isLogin = isLogin;
    obj[index].msg = msg;
  }
  console.log('databaseProjects= ', obj);

  res.render('index', { data: obj, user: req.session.users, isLogin: req.session.isLogin });
}

module.exports = home;
