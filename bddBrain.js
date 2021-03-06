/**
 * Classe d'accès à la base de données.
 * 
 * @return {void} 
 */
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

/**
 * Exécute une requète.
 * 
 * @param  {string} szQuery   Requète.
 * @param  {object} oCallback Fonction appelée après la fin des traitemants BDD.
 * 
 * @return {void}           
 */
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

/**
 * Exécute une requète de sélection.
 * 
 * @param  {string} szQuery   Requète de sélection.
 * @param  {object} oCallback Callback appelée à la fin des traitements BDD.
 * 
 * @return {void}          
 */
bddBrain.prototype.aSelect = function(szQuery, oCallback)
{
  var oThat = this;
  this.bExecQuery(szQuery, function(err, rows){
    if (err) {
      console.log('Erreur : ' +JSON.stringify(err));
      return false;
    } else {
      oCallback(rows);
    }
  });

};

/**
 * Exécute une requète d'update.
 * 
 * @param  {string} szTable       Table à mettre à jour.
 * @param  {array}  aValues       Valeurs.
 * @param  {string} szClauseWhere Clause where.
 * @param  {object} oCallback     Callback appelée à la fin du traitement BDD.
 * 
 * @return {void}               
 */
bddBrain.prototype.bUpdate = function(szTable, aValues, szClauseWhere, oCallback)
{
  var oThat = this;
  var szQuery = 'UPDATE '+szTable+' SET ';
  var nIndex = 0;
  Object.keys(aValues).forEach(function(szIndex){
    szValeur = aValues[szIndex];
    if (nIndex > 0) {
      szQuery += ', ';
    }
    szQuery += szIndex+' = '+ "'" + szValeur.replace(/'/g, "\\'") +"'";
    nIndex ++;
  });
  szQuery += ' WHERE 1=1 '+szClauseWhere;
  console.log(szQuery);
  this.bExecQuery(szQuery, function(err){
    if (err) {
      console.log('Erreur : ' +err);
      return false;
    } else {
      oCallback([]);
    }
  });
};

/**
 * Exécute une requète d'insert.
 * 
 * @param  {string} szTable   Table dans laquelle insérer.
 * @param  {array}  aValues   Valeurs.
 * @param  {object} oCallback Callback appelée à la fin des traitements BDD.
 * 
 * @return {void}           
 */
bddBrain.prototype.bInsert = function(szTable, aValues, oCallback)
{
  var oThat = this;
  var szQuery = 'INSERT INTO '+szTable+' (';
  var szValeurs = '';
  var aChamps = [];
  var aValeurs = [];
  Object.keys(aValues).forEach(function(szIndex){
    szValeur = aValues[szIndex];
    aChamps.push(szIndex);
    aValeurs.push("'"+szValeur.replace(/'/g, "\\'")+"'");
  });
  szQuery += aChamps.join(',');
  szQuery += ' ) VALUES (' + aValeurs.join(',') + ')';
  console.log(szQuery);
  this.bExecQuery(szQuery, function(err){
    if (err) {
      console.log('Erreur : ' +err);
      return false;
    } else {
      oCallback([]);
    }
  });
};

bddBrain.prototype.bDelete = function(szTable, nId, oCallback) {
  szQuery = "DELETE FROM "+szTable+" WHERE id_" + szTable + " = '" + nId + "'";
  this.bExecQuery(szQuery, function(err){
    if (err) {
      console.log('Erreur : ' +err);
      return false;
    } else {
      oCallback([]);
    }
  });
}



module.exports = bddBrain;