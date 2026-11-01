const KEY="vaultops_snapshots_v1";
const $=id=>document.getElementById(id);
let snapshots=[];
try{snapshots=JSON.parse(localStorage.getItem(KEY))||[]}catch{snapshots=[]}
const fmtSize=n=>n<1024?n+" B":n<1048576?(n/1024).toFixed(1)+" KB":(n/1048576).toFixed(2)+" MB";
const fmtDate=s=>new Date(s).toLocaleString();
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function save(){try{localStorage.setItem(KEY,JSON.stringify(snapshots));return true}catch(e){notify("Browser storage is full. Remove old snapshots or use a smaller file.");return false}}
function notify(msg){$("toast").textContent=msg;$("toast").style.display="block";clearTimeout(notify.timer);notify.timer=setTimeout(()=>$("toast").style.display="none",2600)}
function render(){
  $("snapshotCount").textContent=snapshots.length;
  const total=snapshots.reduce((n,s)=>n+s.size,0);$("storageUsed").textContent=fmtSize(total);
  if(snapshots.length){const last=snapshots[0];$("lastBackup").textContent=new Date(last.createdAt).toLocaleDateString();$("lastBackupSub").textContent=new Date(last.createdAt).toLocaleTimeString()}
  else{$("lastBackup").textContent="Not yet";$("lastBackupSub").textContent="Create your first snapshot"}
  const q=$("search").value.toLowerCase();
  const shown=snapshots.filter(s=>(s.label+" "+s.fileName+" "+s.tier).toLowerCase().includes(q));
  $("backupRows").innerHTML=shown.map(s=>`<tr><td>${esc(s.id.slice(0,12))}</td><td>${esc(s.fileName)}</td><td>${fmtSize(s.size)}</td><td><span class="tag">${esc(s.tier)}</span></td><td>${esc(fmtDate(s.createdAt))}</td><td><button class="action" data-restore="${esc(s.id)}">Restore</button><button class="action delete" data-delete="${esc(s.id)}">Delete</button></td></tr>`).join("");
  $("historyEmpty").hidden=shown.length>0;
  $("recoveryEmpty").hidden=snapshots.length>0;
  $("recoveryList").innerHTML=snapshots.slice(0,4).map(s=>`<div class="recovery-item"><div><b>${esc(s.label||s.fileName)}</b><small>${esc(s.fileName)} · ${fmtDate(s.createdAt)}</small></div><button class="primary" data-restore="${esc(s.id)}">Restore</button></div>`).join("");
}
function restore(id){
  const s=snapshots.find(x=>x.id===id);if(!s)return;
  try{
    const bytes=Uint8Array.from(atob(s.data),c=>c.charCodeAt(0));
    const blob=new Blob([bytes],{type:s.type||"application/octet-stream"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download="RESTORED_"+s.fileName;a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    $("recoveryStatus").textContent="Restored";notify("Recovery copy downloaded. Verify the restored file.");
  }catch{notify("Could not restore this snapshot. The saved browser data may be damaged.")}
}
$("backupForm").addEventListener("submit",e=>{
  e.preventDefault();const file=$("sourceFile").files[0];if(!file)return;
  if(file.size>15*1024*1024){notify("File exceeds the 15 MB demo limit.");return}
  if(snapshots.length>=30){notify("Demo limit reached (30 snapshots). Delete older snapshots first.");return}
  const reader=new FileReader();
  reader.onerror=()=>notify("Could not read the selected file.");
  reader.onload=()=>{
    const data=String(reader.result).split(",")[1];
    const item={id:crypto.randomUUID?crypto.randomUUID():String(Date.now())+"-"+Math.random().toString(16).slice(2),label:$("backupLabel").value.trim()||file.name,fileName:file.name,size:file.size,type:file.type,tier:$("storageTier").value,createdAt:new Date().toISOString(),data};
    snapshots.unshift(item);
    if(save()){render();e.currentTarget.reset();notify("Backup snapshot created successfully.");}
    else snapshots.shift();
  };
  reader.readAsDataURL(file);
});
$("backupRows").addEventListener("click",e=>{
  const restoreId=e.target.dataset.restore,deleteId=e.target.dataset.delete;
  if(restoreId)restore(restoreId);
  if(deleteId&&confirm("Permanently delete this backup snapshot?")){snapshots=snapshots.filter(s=>s.id!==deleteId);save();render();notify("Snapshot deleted.");}
});
$("recoveryList").addEventListener("click",e=>{if(e.target.dataset.restore)restore(e.target.dataset.restore)});
$("search").addEventListener("input",render);
$("exportManifest").addEventListener("click",()=>{
  const manifest=snapshots.map(({data,...metadata})=>metadata);
  const blob=new Blob([JSON.stringify({project:"VaultOps",exportedAt:new Date().toISOString(),snapshots:manifest},null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="vaultops-backup-manifest.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
render();