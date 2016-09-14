function bddBrain()
{
  var mysql = require("mysql");
  if (typeof bddBrain.oPool == 'undefined') {
    bddBrain.oPool = mysql.createPool({
      host: "127.0.0.1",
      user: "root",
      password: "root",
      database: "CAH"
    });
  } 
}

bddBrain.prototype.bExecQuery = function(szQuery, oCallback) {
  var mysql = require("mysql");

  // First you need to create a connection to the db
  //console.log(this.con);
  bddBrain.oPool.getConnection(function(err, con){
    //console.log(err);
    if(err){
      console.log('Error connecting to Db : '+err);
      return;
    }
    con.query(szQuery, function(err, rows){
      con.release();
      oCallback.apply(bddBrain, [err, rows]);
    });
  });
}

bddBrain.prototype.aSelect = function(szQuery, oClasse, oCallback)
{
  var oThat = this;
  this.bExecQuery(szQuery, function(err, rows){
    oThat.bClose();
    if (err) {
      console.log('Erreur : ' +JSON.stringify(err));
      return false;
    } else {
      oCallback.apply(oClasse, [rows]);
    }
  });

};

bddBrain.prototype.bUpdate = function(szTable, aValues, szClauseWhere, oClasse, oCallback)
{
  var oThat = this;
  var szQuery = 'UPDATE '+szTable+' SET ';
  var nIndex = 0;
  aValues.forEach(function(szValeur, szIndex, aValues){
    if (nIndex > 0) {
      szQuery += ', ';
    }
    szQuery += szIndex+' = '+szValeur;
    nIndex ++;
  });
  szQuery += ' WHERE 1=1 '+szClauseWhere;
  this.bExecQuery(szQuery, function(err){
    oThat.bClose();
    if (err) {
      console.log('Erreur : ' +err);
      return false;
    } else {
      oCallback.apply(oClasse, []);
    }
  });
};

bddBrain.prototype.bInsert = function(szTable, aValues, oClasse, oCallback)
{
  var szQuery = 'INSERT INTO '+szTable+' (';
  var szValeurs = '';
  var nIndex = 0;
  aValues.forEach(function(szValeur, szIndex, aValues){
    if (nIndex > 0) {
      szQuery += ', ';
      szValeurs += ', ';
    }
    szQuery += szIndex;
    szValeurs += szValeur;
  });
  szQuery += ' ) VALUES (' + szValeurs + ')';
  this.bExecQuery(szQuery, function(err){
    oThat.bClose();
    if (err) {
      console.log('Erreur : ' +err);
      return false;
    } else {
      oCallback.apply(oClasse, []);
    }
  });
};

bddBrain.prototype.bClose = function()
{
  /*this.con.end(function(err) {
    if (err) {

      throw err;
    }
  });*/
};


module.exports = bddBrain;