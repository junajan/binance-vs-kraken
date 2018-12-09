const _ = require('lodash');
const mysql = require('mysql');
const Promise = require('bluebird');

module.exports = class Mysql {
  constructor (config) {
    this.config = config
    this.client = mysql.createPool(config);
  }

  print (sql, data) {
    if (this.config.showSQL)
      console.log("QUERY: " + sql + " | PARAMS: " + JSON.stringify(data));
  }

  runQuery (sql, data) {
    return new Promise((resolve, reject) => {
      this.client.getConnection((err, conn) => {
        if(err)
          return reject(err);

        this.print(sql, data);

        conn.query(sql, data, (err, rows) => {
          conn.release();
          err ? reject(err): resolve(rows);
        });
      });
    });
  }

  getData (...args) {
    let sql = "";

    if (args[0])
      sql = "SELECT " + args[0];

    if (args[1])
      sql += " FROM " + args[1];

    if (args[2])
      sql += " WHERE " + args[2];

    if (args[4])
      sql += " ORDER BY " + args[4];

    if (args[4] && args[5])
      sql += " " + args[5];

    if (args[6])
      sql += " LIMIT " + args[6];

    return this.runQuery(sql, args[3] || []);
  }

  get (...args) {
    return this.getData(...args, 1)
      .then(res => res[0] || null)
  }

  insert (...args) {
    let sql = "INSERT ";

    if(args[2])
      sql += 'IGNORE ';
    sql += "INTO " + args[0] + " SET ? ";

    return this.runQuery(sql, args[1]);
  }

  insertMultiple (...args) {
    let sql = `INSERT IGNORE INTO ${args[0]} `;
    if (args.length > 2)
      sql += `(${args[1].join(',')})`;
    sql += ' VALUES ? ';

    return this.runQuery(sql, [args[2] || args[1]]);
  }

  update (where, values, cond, params) {
    const sqlVals = []
    const preparedVals = []
    let sql = `UPDATE ${where} SET `;

    for (let [key, val] of Object.entries(values)) {
      if (key[0] == ".")
        sqlVals.push(key.substr(1) + " = " + val)
      else {
        sqlVals.push(key + " = ?")
        preparedVals.push(val);
      }
    }

    sql += sqlVals.join(", ");

    if (cond)
      sql += " WHERE " + cond;

    if(params) {
      if (!_.isArray(params))
        params = [params]
      preparedVals.push(...params);
    }

    return this.runQuery(sql, preparedVals);
  }

  delete (where, cond, params) {
    const sql = "DELETE FROM " + where + " WHERE " + (cond || '1=1');
    this.runQuery(sql, this._arrayify(params));
  }

  sql (...args) {
    return this.runQuery(...args);
  }

  _arrayify (param) {
    return _.isArray(param) ? param : [param]
  }
}
