/**
 * MI CONTROL — Backend Google Apps Script + Google Sheets
 * V5.14 Google Backend
 *
 * El frontend NO llama directamente a Apps Script.
 * Vercel /api/google-backend hace de proxy.
 *
 * Acciones:
 * health, register, login, verify2fa, resend2fa, session,
 * logout, saveState, getState, resetRequest, resetConfirm,
 * adminData, adminDeleteFamily
 */

const APP_NAME = 'Mi Control';
const VERSION = '5.14.0-GOOGLE';
const SESSION_DAYS = 7;
const CODE_MINUTES = 10;
const SHEETS = [
  'CONFIG','USUARIOS','CODIGOS_2FA','SESIONES','AUDITORIA',
  'CUENTAS','CATEGORIAS','MOVIMIENTOS','PRESUPUESTOS','METAS',
  'CALENDARIO','NOTAS','DOCUMENTOS','NOTIFICACIONES'
];

function doGet(e) {
  return json_({
    ok:true,
    app:APP_NAME,
    version:VERSION,
    status:'ONLINE',
    timestamp:new Date().toISOString()
  });
}

function doPost(e) {
  try {
    const body = parseBody_(e);
    const action = String(body.action || 'health');
    ensureBackend_();
    return json_(route_(action, body.payload || {}));
  } catch (err) {
    console.error(err);
    return json_({ok:false,error:publicError_(err)});
  }
}

function route_(action,p) {
  switch(action) {
    case 'health': return {ok:true,app:APP_NAME,version:VERSION,status:'ONLINE'};
    case 'register': return register_(p);
    case 'login': return login_(p);
    case 'verify2fa': return verify2fa_(p);
    case 'resend2fa': return resend2fa_(p);
    case 'session': return session_(p);
    case 'logout': return logout_(p);
    case 'saveState': return saveState_(p);
    case 'getState': return getState_(p);
    case 'resetRequest': return resetRequest_(p);
    case 'resetConfirm': return resetConfirm_(p);
    case 'adminData': return adminData_(p);
    case 'adminDeleteFamily': return adminDeleteFamily_(p);
    default: throw new Error('Acción no soportada: '+action);
  }
}

function register_(p) {
  const name = clean_(p.name,70);
  const email = normalizeEmail_(p.email);
  const password = String(p.password || '');
  if (!name) throw new Error('Escribe tu nombre');
  validatePassword_(password);

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const existing = findUser_(email);
    if (existing) throw new Error('Este correo ya tiene una cuenta');

    const userId = Utilities.getUuid();
    const salt = randomToken_();
    const passwordHash = hashPassword_(password,salt);
    const now = new Date().toISOString();

    append_('USUARIOS',[
      userId,email,name,passwordHash,salt,'user','active',now,now
    ]);

    append_('CUENTAS',[
      userId,email,name,'individual','',now,now
    ]);

    audit_(userId,'register','Cuenta creada');
    const challenge = createCode_(userId,email,'2fa_register');
    sendCode_(email,name,challenge.code,'Código de seguridad de Mi Control');

    return {
      ok:true,
      requires2fa:true,
      challengeId:challenge.id,
      email,
      user:{id:userId,name,email,role:'user'}
    };
  } finally {
    lock.releaseLock();
  }
}

function login_(p) {
  const email = normalizeEmail_(p.email);
  const password = String(p.password || '');
  const user = findUser_(email);
  if (!user || user.status !== 'active' || hashPassword_(password,user.salt) !== user.password_hash) {
    audit_(user ? user.id : '', 'login_failed', 'Credenciales incorrectas');
    throw new Error('Correo o contraseña incorrectos');
  }

  const challenge = createCode_(user.id,email,'2fa_login');
  sendCode_(email,user.name,challenge.code,'Código de acceso a Mi Control');

  audit_(user.id,'login_challenge','Código 2FA enviado');
  return {
    ok:true,
    requires2fa:true,
    challengeId:challenge.id,
    email,
    user:publicUser_(user)
  };
}

function verify2fa_(p) {
  const email = normalizeEmail_(p.email);
  const code = String(p.code || '').trim();
  const challengeId = String(p.challengeId || '');
  const user = findUser_(email);
  if (!user) throw new Error('Usuario no encontrado');

  const challenge = findCode_(challengeId);
  if (!challenge || challenge.user_id !== user.id || challenge.used === 'TRUE' ||
      new Date(challenge.expires_at).getTime() < Date.now()) {
    throw new Error('El código ha vencido. Solicita uno nuevo');
  }

  if (hashCode_(code,challenge.salt) !== challenge.code_hash) {
    audit_(user.id,'2fa_failed','Código 2FA incorrecto');
    throw new Error('Código de seguridad incorrecto');
  }

  markCodeUsed_(challenge.row);
  const token = randomToken_()+randomToken_();
  const tokenHash = sha256_(token);
  const expires = new Date(Date.now()+SESSION_DAYS*86400000).toISOString();
  append_('SESIONES',[sha256_(token),user.id,expires,'active',new Date().toISOString()]);

  updateUserLastSeen_(user.id);
  audit_(user.id,'login','Sesión iniciada con 2FA');

  return {
    ok:true,
    sessionToken:token,
    expiresAt:expires,
    user:publicUser_(user),
    state:getStoredState_(user.id)
  };
}

function resend2fa_(p) {
  const email = normalizeEmail_(p.email);
  const user = findUser_(email);
  if (!user) throw new Error('Usuario no encontrado');
  const challenge = createCode_(user.id,email,'2fa_resend');
  sendCode_(email,user.name,challenge.code,'Nuevo código de seguridad de Mi Control');
  return {ok:true,challengeId:challenge.id};
}

function session_(p) {
  const user = requireSession_(p.sessionToken);
  return {ok:true,user:publicUser_(user),state:getStoredState_(user.id)};
}

function logout_(p) {
  const tokenHash = sha256_(String(p.sessionToken || ''));
  const sheet = sheet_('SESIONES');
  const values = sheet.getDataRange().getValues();
  for (let i=1;i<values.length;i++) {
    if (String(values[i][0])===tokenHash) {
      sheet.getRange(i+1,4).setValue('revoked');
      break;
    }
  }
  return {ok:true};
}

function saveState_(p) {
  const user = requireSession_(p.sessionToken);
  const state = p.state || {};
  const safe = {
    users:Array.isArray(state.users)?state.users:[],
    families:Array.isArray(state.families)?state.families:[],
    tasks:Array.isArray(state.tasks)?state.tasks:[],
    notes:Array.isArray(state.notes)?state.notes:[],
    expenses:Array.isArray(state.expenses)?state.expenses:[],
    chatMessages:Array.isArray(state.chatMessages)?state.chatMessages:[],
    postits:Array.isArray(state.postits)?state.postits:[],
    rewards:Array.isArray(state.rewards)?state.rewards:[],
    rewardDraw:state.rewardDraw || null,
    documents:Array.isArray(state.documents)?state.documents:[],
    currentFamilyId:state.currentFamilyId || '',
    currentUserId:user.id
  };
  let json = JSON.stringify(safe);
  if (json.length > 45000) {
    // Las imágenes/documentos locales no deben vivir en una celda de Sheets.
    safe.documents = [];
    json = JSON.stringify(safe);
  }
  upsertAccountState_(user,safe);
  return {ok:true,savedAt:new Date().toISOString()};
}

function getState_(p) {
  const user = requireSession_(p.sessionToken);
  return {ok:true,state:getStoredState_(user.id)};
}

function resetRequest_(p) {
  const email = normalizeEmail_(p.email);
  const user = findUser_(email);
  if (!user) throw new Error('No existe una cuenta con ese correo');
  const challenge = createCode_(user.id,email,'reset');
  sendCode_(email,user.name,challenge.code,'Código para restablecer tu contraseña');
  return {ok:true,challengeId:challenge.id,email};
}

function resetConfirm_(p) {
  const email = normalizeEmail_(p.email);
  const password = String(p.password || '');
  const code = String(p.code || '').trim();
  const challengeId = String(p.challengeId || '');
  validatePassword_(password);
  const user = findUser_(email);
  const challenge = findCode_(challengeId);
  if (!user || !challenge || challenge.user_id!==user.id || challenge.used==='TRUE' ||
      new Date(challenge.expires_at).getTime()<Date.now()) {
    throw new Error('Código de recuperación inválido o vencido');
  }
  if (hashCode_(code,challenge.salt)!==challenge.code_hash) {
    throw new Error('Código de recuperación incorrecto');
  }
  markCodeUsed_(challenge.row);
  const salt = randomToken_();
  updateUserCredentials_(user.id,hashPassword_(password,salt),salt);
  audit_(user.id,'password_reset','Contraseña actualizada');
  return {ok:true};
}

function adminData_(p) {
  const user = requireSession_(p.sessionToken);
  if (String(user.role)!=='super_admin') throw new Error('Acceso administrativo denegado');
  const users = rows_('USUARIOS').map(r=>({
    id:r[0],email:r[1],full_name:r[2],role:r[5],status:r[6],created_at:r[7],last_seen:r[8]
  }));
  const accounts = rows_('CUENTAS').map(r=>({user_id:r[0],email:r[1],name:r[2],mode:r[3],updated_at:r[6]}));
  return {ok:true,profiles:users,families:collectFamilies_(accounts),members:[],documents:[],audit:rows_('AUDITORIA').slice(-200)};
}

function adminDeleteFamily_(p) {
  const user = requireSession_(p.sessionToken);
  if (String(user.role)!=='super_admin') throw new Error('Acceso administrativo denegado');
  const familyId=String(p.familyId||'');
  const all=rows_('CUENTAS');
  all.forEach((r,i)=>{
    if (!r[4]) return;
    try {
      const s=JSON.parse(r[4]);
      if ((s.families||[]).some(f=>f.id===familyId)) {
        s.families=s.families.filter(f=>f.id!==familyId);
        s.tasks=(s.tasks||[]).filter(x=>x.familyId!==familyId);
        s.notes=(s.notes||[]).filter(x=>x.familyId!==familyId);
        s.expenses=(s.expenses||[]).filter(x=>x.familyId!==familyId);
        r[4]=JSON.stringify(s);
        sheet_('CUENTAS').getRange(i+2,5).setValue(r[4]);
      }
    } catch(e) {}
  });
  audit_(user.id,'admin_delete_family',familyId);
  return {ok:true};
}

function ensureBackend_() {
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Vincula este Apps Script a un Google Sheets');
  SHEETS.forEach(name=>{
    let sh=ss.getSheetByName(name);
    if(!sh) sh=ss.insertSheet(name);
    if(sh.getLastRow()===0){
      sh.appendRow(headers_(name));
    }
  });
  const cfg=sheet_('CONFIG');
  if(cfg.getLastRow()===1) cfg.appendRow(['APP_NAME',APP_NAME]);
}

function headers_(name) {
  const map={
    CONFIG:['CLAVE','VALOR'],
    USUARIOS:['ID','EMAIL','NOMBRE','PASSWORD_HASH','SALT','ROL','ESTADO','CREADO_EN','ULTIMO_ACCESO'],
    CODIGOS_2FA:['ID','USER_ID','EMAIL','TIPO','CODE_HASH','SALT','EXPIRA_EN','USADO'],
    SESIONES:['TOKEN_HASH','USER_ID','EXPIRA_EN','ESTADO','CREADO_EN'],
    AUDITORIA:['FECHA','USER_ID','ACCION','DETALLE'],
    CUENTAS:['USER_ID','EMAIL','NOMBRE','MODO','STATE_JSON','CREADO_EN','ACTUALIZADO_EN'],
    CATEGORIAS:['ID','NOMBRE','ACTIVA'],
    MOVIMIENTOS:['ID','USER_ID','FAMILY_ID','DATA_JSON','ACTUALIZADO_EN'],
    PRESUPUESTOS:['ID','USER_ID','FAMILY_ID','DATA_JSON','ACTUALIZADO_EN'],
    METAS:['ID','USER_ID','FAMILY_ID','DATA_JSON','ACTUALIZADO_EN'],
    CALENDARIO:['ID','USER_ID','FAMILY_ID','DATA_JSON','ACTUALIZADO_EN'],
    NOTAS:['ID','USER_ID','FAMILY_ID','DATA_JSON','ACTUALIZADO_EN'],
    DOCUMENTOS:['ID','USER_ID','FAMILY_ID','NOMBRE','TIPO','DRIVE_FILE_ID','ACTUALIZADO_EN'],
    NOTIFICACIONES:['ID','USER_ID','TIPO','DATA_JSON','ACTUALIZADO_EN']
  };
  return map[name] || ['ID','DATA'];
}

function sheet_(name){ return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name); }
function rows_(name){ const sh=sheet_(name); if(!sh||sh.getLastRow()<2)return []; return sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues(); }
function append_(name,row){ sheet_(name).appendRow(row); }

function findUser_(email) {
  const vals=rows_('USUARIOS');
  for (let i=0;i<vals.length;i++) if(String(vals[i][1]).toLowerCase()===email) {
    return {
      row:i+2,id:String(vals[i][0]),email:String(vals[i][1]),name:String(vals[i][2]),
      password_hash:String(vals[i][3]),salt:String(vals[i][4]),role:String(vals[i][5]||'user'),
      status:String(vals[i][6]||'active'),created_at:String(vals[i][7]||''),last_seen:String(vals[i][8]||'')
    };
  }
  return null;
}

function publicUser_(u){return {id:u.id,name:u.name,email:u.email,role:u.role==='super_admin'?'super_admin':'user'};}

function requireSession_(token) {
  token=String(token||'');
  if(!token) throw new Error('Sesión no válida');
  const h=sha256_(token), vals=rows_('SESIONES');
  for(const r of vals) {
    if(String(r[0])===h && String(r[3])==='active' && new Date(r[2]).getTime()>Date.now()) {
      const u=findUserById_(String(r[1]));
      if(u) return u;
    }
  }
  throw new Error('La sesión ha vencido. Inicia sesión nuevamente');
}

function findUserById_(id) {
  return rows_('USUARIOS').map((r,i)=>({
    row:i+2,id:String(r[0]),email:String(r[1]),name:String(r[2]),password_hash:String(r[3]),
    salt:String(r[4]),role:String(r[5]||'user'),status:String(r[6]||'active'),
    created_at:String(r[7]||''),last_seen:String(r[8]||'')
  })).find(u=>u.id===id)||null;
}

function createCode_(userId,email,type) {
  const code=String(Math.floor(100000+Math.random()*900000));
  const id=Utilities.getUuid(),salt=randomToken_();
  const expires=new Date(Date.now()+CODE_MINUTES*60000).toISOString();
  append_('CODIGOS_2FA',[id,userId,email,type,hashCode_(code,salt),salt,expires,'FALSE']);
  return {id,code,expires};
}

function findCode_(id) {
  const vals=rows_('CODIGOS_2FA');
  for(let i=0;i<vals.length;i++) if(String(vals[i][0])===id) {
    return {row:i+2,id:String(vals[i][0]),user_id:String(vals[i][1]),email:String(vals[i][2]),
      type:String(vals[i][3]),code_hash:String(vals[i][4]),salt:String(vals[i][5]),
      expires_at:String(vals[i][6]),used:String(vals[i][7])};
  }
  return null;
}

function markCodeUsed_(row){sheet_('CODIGOS_2FA').getRange(row,8).setValue('TRUE');}
function updateUserLastSeen_(id){const u=findUserById_(id);if(u)sheet_('USUARIOS').getRange(u.row,9).setValue(new Date().toISOString());}
function updateUserCredentials_(id,hash,salt){const u=findUserById_(id);if(!u)return;sheet_('USUARIOS').getRange(u.row,4,1,2).setValues([[hash,salt]]);}

function getStoredState_(userId) {
  const vals=rows_('CUENTAS');
  for(const r of vals) if(String(r[0])===userId && r[4]) {
    try{return JSON.parse(r[4]);}catch(e){}
  }
  return null;
}

function upsertAccountState_(user,state) {
  const sh=sheet_('CUENTAS'), vals=sh.getDataRange().getValues(), now=new Date().toISOString(), json=JSON.stringify(state);
  for(let i=1;i<vals.length;i++) if(String(vals[i][0])===user.id) {
    sh.getRange(i+1,3,1,5).setValues([[user.name,'individual',json,vals[i][5]||now,now]]);
    return;
  }
  sh.appendRow([user.id,user.email,user.name,'individual',json,now,now]);
}

function collectFamilies_(accounts) {
  const out=[];
  accounts.forEach(a=>{
    const st=getStoredState_(a.user_id);
    (st?.families||[]).forEach(f=>{
      if(!out.some(x=>x.id===f.id))out.push(f);
    });
  });
  return out;
}

function sendCode_(email,name,code,subject) {
  MailApp.sendEmail({
    to:email,
    subject:subject,
    htmlBody:'<div style="font-family:Arial,sans-serif"><h2>Mi Control</h2><p>Hola '+escapeHtml_(name)+'.</p><p>Tu código de seguridad es:</p><div style="font-size:32px;font-weight:700;letter-spacing:8px">'+code+'</div><p>Válido durante '+CODE_MINUTES+' minutos.</p><p>Si no solicitaste este código, ignora este mensaje.</p></div>',
    body:'Mi Control\n\nTu código de seguridad es: '+code+'\nVálido durante '+CODE_MINUTES+' minutos.'
  });
}

function audit_(userId,action,detail){append_('AUDITORIA',[new Date().toISOString(),userId,action,String(detail||'')]);}
function normalizeEmail_(v){return String(v||'').trim().toLowerCase();}
function clean_(v,n){return String(v||'').trim().slice(0,n);}
function validatePassword_(p){if(p.length<6)throw new Error('La contraseña debe tener al menos 6 caracteres');}
function randomToken_(){return Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,'').slice(0,16);}
function sha256_(v){return bytesToHex_(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(v),Utilities.Charset.UTF_8));}
function hashCode_(code,salt){return sha256_(String(code)+String(salt));}
function hashPassword_(password,salt){let h=String(password)+String(salt);for(let i=0;i<1000;i++)h=sha256_(h+salt);return h;}
function bytesToHex_(bytes){return bytes.map(b=>(b<0?b+256:b).toString(16).padStart(2,'0')).join('');}
function escapeHtml_(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function parseBody_(e){if(!e||!e.postData||!e.postData.contents)return {};try{return JSON.parse(e.postData.contents)}catch(err){throw new Error('JSON inválido');}}
function publicError_(err){return err&&err.message?err.message:String(err);}
