/** MI CONTROL — Google Apps Script backend V5.14 */
const APP_NAME='Mi Control';
const VERSION='5.18.0';
// Base de datos principal de Mi Control (Google Sheets).
// Se puede sobrescribir con la propiedad de script SPREADSHEET_ID.
const DEFAULT_SPREADSHEET_ID='1jhKi8XygsPYbmh1kknII79QKwcKqzTlSa_ATOFVy-QA';
const SESSION_DAYS=7;
const CODE_MINUTES=10;
const PASSWORD_ROUNDS=12000;
const LOCK_WAIT_MS=15000;
const SHEETS={
  CONFIG:['key','value'],
  USUARIOS:['id','name','email','password_hash','salt','role','status','created_at','last_seen','state_json'],
  CODIGOS_2FA:['id','email','code_hash','salt','type','expires_at','used','created_at'],
  SESIONES:['token','user_id','expires_at','created_at'],
  AUDITORIA:['id','user_id','action','detail','created_at'],
  CUENTAS:['id','user_id','type','status','created_at'],
  CATEGORIAS:['id','name','type','status'],
  MOVIMIENTOS:['id','user_id','data_json','created_at','updated_at'],
  PRESUPUESTOS:['id','user_id','data_json','created_at','updated_at'],
  METAS:['id','user_id','data_json','created_at','updated_at'],
  CALENDARIO:['id','user_id','data_json','created_at','updated_at'],
  NOTAS:['id','user_id','data_json','created_at','updated_at'],
  DOCUMENTOS:['id','user_id','data_json','created_at','updated_at'],
  NOTIFICACIONES:['id','user_id','data_json','created_at','updated_at']
};

function doGet(){try{setupBackend();return json_({ok:true,app:APP_NAME,version:VERSION,status:'ONLINE',timestamp:new Date().toISOString()});}catch(err){return json_({ok:false,error:'Backend Google no está inicializado: '+(err&&err.message?err.message:String(err))});}}
function doPost(e){
  var lock=LockService.getScriptLock();
  try{
    lock.waitLock(LOCK_WAIT_MS);
    var req=parseRequest_(e),action=String(req.action||''),p=req.payload||{};
    setupBackend();
    switch(action){
      case 'health':return json_({ok:true,app:APP_NAME,version:VERSION,status:'ONLINE'});
      case 'register':return register_(p);
      case 'login':return login_(p);
      case 'verify2fa':return verify2fa_(p);
      case 'resend2fa':return challenge_(normEmail_(p.email),'login');
      case 'resetRequest':return resetRequest_(p);
      case 'resetConfirm':return resetConfirm_(p);
      case 'session':return session_(p);
      case 'logout':return logout_(p);
      case 'saveState':return saveState_(p);
      case 'adminData':return adminData_(p);
      case 'adminDeleteFamily':return adminDeleteFamily_(p);
      default:return json_({ok:false,error:'Acción no reconocida: '+action});
    }
  }catch(err){return json_({ok:false,error:err&&err.message?err.message:String(err)});}finally{try{lock.releaseLock();}catch(_){}}
}
function parseRequest_(e){return e&&e.postData&&e.postData.contents?JSON.parse(e.postData.contents):{}}
function json_(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON)}
function setupBackend(){
  var ss=getDb_();
  Object.keys(SHEETS).forEach(function(name){
    var sh=ss.getSheetByName(name);if(!sh)sh=ss.insertSheet(name);
    var headers=SHEETS[name];
    if(sh.getLastRow()===0)sh.getRange(1,1,1,headers.length).setValues([headers]);
  });
  migrateLegacySchemas_();
  if(!findRow_(sheet_('CONFIG'),'key','SUPER_ADMIN_EMAIL'))append_(sheet_('CONFIG'),{key:'SUPER_ADMIN_EMAIL',value:'josehugo.tec@gmail.com'});
}
function migrateLegacySchemas_(){
  var sh=sheet_('CODIGOS_2FA');if(!sh)return;
  var current=SHEETS.CODIGOS_2FA;
  var lastCol=sh.getLastColumn();
  if(!lastCol){sh.getRange(1,1,1,current.length).setValues([current]);return;}
  var oldHeaders=sh.getRange(1,1,1,lastCol).getValues()[0].map(String);
  if(oldHeaders.join('|')===current.join('|'))return;
  var legacy=oldHeaders.indexOf('usuario_id')>=0&&oldHeaders.indexOf('codigo_hash')>=0&&oldHeaders.indexOf('tipo')>=0;
  if(!legacy)return;
  var rows=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,lastCol).getValues():[];
  var users=sheetObjects_('USUARIOS'),byId={};
  users.forEach(function(u){if(u.id)byId[String(u.id)]=String(u.email||'');});
  var idx={};oldHeaders.forEach(function(h,i){idx[h]=i;});
  var get=function(row,names){for(var i=0;i<names.length;i++){var j=idx[names[i]];if(j!==undefined&&row[j]!==undefined&&String(row[j])!=='')return row[j];}return '';};
  var out=rows.map(function(row){
    var uid=String(get(row,['usuario_id','user_id']));
    var email=String(get(row,['email']));if(!email&&uid.indexOf('@')>=0)email=uid;if(!email&&byId[uid])email=byId[uid];
    var estado=String(get(row,['used','estado'])).toLowerCase();
    var used=(estado==='true'||estado==='1'||estado==='usado'||estado==='used'||estado==='si'||estado==='sí')?'true':'false';
    return [
      String(get(row,['id']))||Utilities.getUuid(),
      email,
      String(get(row,['code_hash','codigo_hash'])),
      String(get(row,['salt'])),
      String(get(row,['type','tipo'])),
      String(get(row,['expires_at','expira'])),
      used,
      String(get(row,['created_at','creado']))||iso_()
    ];
  });
  sh.clearContents();
  sh.getRange(1,1,1,current.length).setValues([current]);
  if(out.length)sh.getRange(2,1,out.length,current.length).setValues(out);
}
function register_(p){
  var name=String(p.name||'').trim(),email=normEmail_(p.email),password=String(p.password||'');
  if(!name||!email||password.length<8)throw new Error('Nombre, correo y contraseña de al menos 8 caracteres son obligatorios');
  var sh=sheet_('USUARIOS');if(findRow_(sh,'email',email))throw new Error('Este correo ya tiene una cuenta');
  var id=Utilities.getUuid(),salt=Utilities.getUuid(),role=email===getConfig_('SUPER_ADMIN_EMAIL','josehugo.tec@gmail.com')?'super_admin':'user';
  append_(sh,{id:id,name:name,email:email,password_hash:hashPassword_(password,salt),salt:salt,role:role,status:'active',created_at:iso_(),last_seen:'',state_json:''});
  append_(sheet_('CUENTAS'),{id:Utilities.getUuid(),user_id:id,type:'individual',status:'active',created_at:iso_()});
  audit_(id,'register','Cuenta creada');
  return challenge_(email,'register');
}
function login_(p){
  var email=normEmail_(p.email),password=String(p.password||''),row=findRow_(sheet_('USUARIOS'),'email',email);
  if(!row||row.obj.status!=='active'||hashPassword_(password,row.obj.salt)!==row.obj.password_hash){audit_(row?row.obj.id:'','login_failed','Credenciales inválidas');throw new Error('Correo o contraseña incorrectos')}
  return challenge_(email,'login');
}
function challenge_(email,type){
  var code=String(Math.floor(100000+Math.random()*900000)),id=Utilities.getUuid(),salt=Utilities.getUuid(),expires=new Date(Date.now()+CODE_MINUTES*60000).toISOString();
  append_(sheet_('CODIGOS_2FA'),{id:id,email:email,code_hash:hash_(code,salt),salt:salt,type:type,expires_at:expires,used:'false',created_at:iso_()});
  MailApp.sendEmail({to:email,subject:APP_NAME+' · Código de seguridad',htmlBody:'<p>Tu código de seguridad es:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px"><b>'+code+'</b></p><p>Vence en '+CODE_MINUTES+' minutos.</p>'});
  return json_({ok:true,challengeId:id,expiresAt:expires});
}
function verify2fa_(p){
  var email=normEmail_(p.email),code=String(p.code||''),ch=findLatestChallenge_(email,p.challengeId);
  if(!ch||ch.obj.used==='true'||new Date(ch.obj.expires_at).getTime()<Date.now())throw new Error('El código o la sesión ha vencido');
  if(hash_(code,ch.obj.salt)!==ch.obj.code_hash)throw new Error('Código de seguridad incorrecto');
  updateCell_(sheet_('CODIGOS_2FA'),ch.row,7,'true');
  var user=findRow_(sheet_('USUARIOS'),'email',email);if(!user)throw new Error('Usuario no encontrado');
  updateCell_(sheet_('USUARIOS'),user.row,9,iso_());
  var token=Utilities.getUuid()+'-'+Utilities.getUuid(),expires=new Date(Date.now()+SESSION_DAYS*86400000).toISOString();
  append_(sheet_('SESIONES'),{token:token,user_id:user.obj.id,expires_at:expires,created_at:iso_()});
  audit_(user.obj.id,'login_success','Segundo factor validado');
  return json_({ok:true,sessionToken:token,expiresAt:expires,user:userPublic_(user.obj),state:readState_(user.obj)});
}
function resetRequest_(p){
  var email=normEmail_(p.email),row=findRow_(sheet_('USUARIOS'),'email',email);
  if(!row)throw new Error('No existe una cuenta con ese correo');
  return challenge_(email,'reset');
}
function resetConfirm_(p){
  var email=normEmail_(p.email),code=String(p.code||''),ch=findLatestChallenge_(email,p.challengeId);
  if(!ch||ch.obj.type!=='reset'||ch.obj.used==='true'||new Date(ch.obj.expires_at).getTime()<Date.now())throw new Error('El código o la sesión ha vencido');
  if(hash_(code,ch.obj.salt)!==ch.obj.code_hash)throw new Error('Código de recuperación incorrecto');
  var row=findRow_(sheet_('USUARIOS'),'email',email);if(!row)throw new Error('Usuario no encontrado');
  var password=String(p.password||'');if(password.length<8)throw new Error('La contraseña debe tener al menos 8 caracteres');
  var salt=Utilities.getUuid();updateCell_(sheet_('USUARIOS'),row.row,4,hashPassword_(password,salt));updateCell_(sheet_('USUARIOS'),row.row,5,salt);updateCell_(sheet_('CODIGOS_2FA'),ch.row,7,'true');audit_(row.obj.id,'password_reset','Contraseña actualizada');
  return json_({ok:true});
}
function session_(p){
  var s=validSession_(p.sessionToken);if(!s)throw new Error('Sesión vencida');
  var row=findRow_(sheet_('USUARIOS'),'id',s.user_id);if(!row)throw new Error('Usuario no encontrado');
  updateCell_(sheet_('USUARIOS'),row.row,9,iso_());
  return json_({ok:true,sessionToken:p.sessionToken,expiresAt:s.expires_at,user:userPublic_(row.obj),state:readState_(row.obj)});
}
function logout_(p){
  var s=validSession_(p.sessionToken);if(s){var row=findRow_(sheet_('SESIONES'),'token',p.sessionToken);if(row)sheet_('SESIONES').deleteRow(row.row);audit_(s.user_id,'logout','Sesión cerrada')}
  return json_({ok:true});
}
function saveState_(p){
  var s=validSession_(p.sessionToken);if(!s)throw new Error('Sesión vencida');
  var row=findRow_(sheet_('USUARIOS'),'id',s.user_id);if(!row)throw new Error('Usuario no encontrado');
  updateCell_(sheet_('USUARIOS'),row.row,10,JSON.stringify(sanitizeState_(p.state||{})));updateCell_(sheet_('USUARIOS'),row.row,9,iso_());
  return json_({ok:true,savedAt:iso_()});
}
function adminData_(p){
  var s=validSession_(p.sessionToken);if(!s)throw new Error('Sesión vencida');
  var me=findRow_(sheet_('USUARIOS'),'id',s.user_id);if(!me||me.obj.role!=='super_admin')throw new Error('Acceso administrativo denegado');
  var users=sheetObjects_('USUARIOS').map(function(u){return {id:u.id,full_name:u.name,email:u.email,status:u.status,last_seen:u.last_seen,role:u.role,created_at:u.created_at}});
  var families=[],members=[];
  users.forEach(function(u){
    var st=readState_(u);
    (st.families||[]).forEach(function(f){
      if(!families.some(function(x){return x.id===f.id}))families.push({id:f.id,name:f.name,createdBy:f.createdBy,created_at:f.createdAt});
      (f.memberIds||[]).forEach(function(uid){if(!members.some(function(m){return m.family_id===f.id&&m.user_id===uid}))members.push({family_id:f.id,user_id:uid,role:uid===u.id?'owner':'member'});});
    });
  });
  return json_({ok:true,profiles:users,families:families,members:members,documents:[],audit:sheetObjects_('AUDITORIA')});
}
function adminDeleteFamily_(p){
  var s=validSession_(p.sessionToken);if(!s)throw new Error('Sesión vencida');
  var me=findRow_(sheet_('USUARIOS'),'id',s.user_id);if(!me||me.obj.role!=='super_admin')throw new Error('Acceso administrativo denegado');
  var id=String(p.familyId||'');
  sheetObjects_('USUARIOS').forEach(function(u){
    var st=readState_(u);st.families=(st.families||[]).filter(function(f){return f.id!==id});
    ['tasks','notes','expenses','chatMessages','postits','documents'].forEach(function(k){if(Array.isArray(st[k]))st[k]=st[k].filter(function(x){return (x.familyId||'')!==id});});
    var row=findRow_(sheet_('USUARIOS'),'id',u.id);if(row)updateCell_(sheet_('USUARIOS'),row.row,10,JSON.stringify(sanitizeState_(st)));
  });
  audit_(s.user_id,'admin_delete_family','Familia eliminada: '+id);
  return json_({ok:true});
}
function readState_(u){if(!u.state_json)return {};try{return JSON.parse(u.state_json)||{}}catch(_){return {}}}
function sanitizeState_(s){var c=JSON.parse(JSON.stringify(s||{}));delete c.password;delete c.sessionToken;delete c.accounts;return c}
function userPublic_(u){return {id:u.id,name:u.name,email:u.email,role:u.role||'user',status:u.status||'active'}}
function validSession_(token){if(!token)return null;var row=findRow_(sheet_('SESIONES'),'token',String(token));if(!row)return null;if(new Date(row.obj.expires_at).getTime()<Date.now()){sheet_('SESIONES').deleteRow(row.row);return null}return row.obj}
function findLatestChallenge_(email,id){var a=sheetObjectsWithRows_('CODIGOS_2FA').filter(function(x){return x.obj.email===email&&(!id||x.obj.id===id)});a.sort(function(x,y){return new Date(y.obj.created_at)-new Date(x.obj.created_at)});return a[0]||null}
function audit_(userId,action,detail){append_(sheet_('AUDITORIA'),{id:Utilities.getUuid(),user_id:userId||'',action:action,detail:detail,created_at:iso_()})}
function hash_(v,s){var b=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(s)+'|'+String(v),Utilities.Charset.UTF_8);return b.map(function(x){return (x<0?x+256:x).toString(16).padStart(2,'0')).join('')}
function normEmail_(e){return String(e||'').trim().toLowerCase()}
function iso_(){return new Date().toISOString()}
function getDb_(){var ss=SpreadsheetApp.getActiveSpreadsheet();if(ss)return ss;var id=PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID')||DEFAULT_SPREADSHEET_ID;return SpreadsheetApp.openById(id)}
function sheet_(n){return getDb_().getSheetByName(n)}
function findRow_(sh,key,value){if(!sh||sh.getLastRow()<2)return null;var h=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0],idx=h.indexOf(key);if(idx<0)return null;var v=sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();for(var i=0;i<v.length;i++)if(String(v[i][idx])===String(value))return {row:i+2,obj:objectFrom_(h,v[i])};return null}
function sheetObjects_(n){return sheetObjectsWithRows_(n).map(function(x){return x.obj})}
function sheetObjectsWithRows_(n){var sh=sheet_(n);if(!sh||sh.getLastRow()<2)return [];var h=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];return sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues().map(function(v,i){return {row:i+2,obj:objectFrom_(h,v)}})}
function objectFrom_(h,v){var o={};h.forEach(function(k,i){o[k]=v[i]===undefined?'':v[i]});return o}
function append_(sh,o){var h=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];sh.appendRow(h.map(function(k){return o[k]===undefined?'':o[k]}))}
function updateCell_(sh,row,col,value){sh.getRange(row,col).setValue(value)}
function getConfig_(key,fallback){var r=findRow_(sheet_('CONFIG'),'key',key);return r?String(r.obj.value):fallback}