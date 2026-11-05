const categories=[
  {name:'闲置场地',count:31,color:'#e59b43',icon:'地'}, {name:'可提质空间',count:26,color:'#4d9dd6',icon:'提'},
  {name:'闲置用房',count:19,color:'#8267c7',icon:'房'}, {name:'低效楼宇',count:14,color:'#d36f6f',icon:'楼'},
  {name:'可扩容设施',count:12,color:'#3fa597',icon:'扩'}, {name:'地下空间',count:15,color:'#63778d',icon:'下'},
  {name:'屋顶空间',count:11,color:'#6ea34f',icon:'顶'}
];
const resources=[
  {code:'ZY-2026-0018',name:'八角北路闲置场地',address:'石景山区八角街道八角北路东侧',type:'闲置场地',use:'完全闲置',verify:'已核实',area:'4,860 ㎡',owner:'区属企业',potential:'临时公共活动、停车调蓄',updated:'2026-11-03'},
  {code:'ZY-2026-0031',name:'古城南街低效楼宇',address:'石景山区古城街道古城南街西侧',type:'低效楼宇',use:'低效利用',verify:'核实中',area:'建筑面积 9,420 ㎡',owner:'国有单位',potential:'产业导入、功能复合',updated:'2026-11-04'},
  {code:'ZY-2026-0052',name:'鲁谷路沿线屋顶空间',address:'石景山区鲁谷街道鲁谷路北侧',type:'屋顶空间',use:'未利用',verify:'待核实',area:'可利用面积 2,150 ㎡',owner:'多元权属',potential:'光伏、屋顶花园',updated:'2026-11-02'},
  {code:'ZY-2026-0064',name:'苹果园交通节点地下空间',address:'石景山区苹果园街道交通节点周边',type:'地下空间',use:'部分闲置',verify:'已核实',area:'建筑面积 6,730 ㎡',owner:'公共设施单位',potential:'便民服务、停车转换',updated:'2026-10-29'},
  {code:'ZY-2026-0077',name:'鲁谷社区可扩容服务设施',address:'石景山区鲁谷街道社区服务中心',type:'可扩容设施',use:'正常利用',verify:'已核实',area:'扩容潜力 1,260 ㎡',owner:'街道',potential:'养老与社区服务补充',updated:'2026-11-01'},
  {code:'ZY-2026-0089',name:'八角游园边界可提质空间',address:'石景山区八角街道游园东侧',type:'可提质空间',use:'低效利用',verify:'核实中',area:'3,180 ㎡',owner:'公共空间',potential:'慢行衔接、绿地提质',updated:'2026-11-05'},
  {code:'ZY-2026-0103',name:'古城北路闲置用房',address:'石景山区古城街道古城北路南侧',type:'闲置用房',use:'完全闲置',verify:'待核实',area:'建筑面积 1,980 ㎡',owner:'待进一步核实',potential:'社区配套、创新办公',updated:'2026-11-05'}
];
const demoSteps=[
  {title:'资源全景总览',run(){resetView();flash('.metric-row');}},
  {title:'七类资源快速筛选',run(){selectCategory(2);flash('.category-item.active');}},
  {title:'地图定位与空间表达',run(){selectResource(5);flash('.polygon-resource.active');}},
  {title:'资源属性与照片管理',run(){selectResource(1);flash('.sidebar-right');}},
  {title:'变更申请集中审核',run(){openReview();flash('.modal');}},
  {title:'版本留痕与动态更新',run(){closeModal();selectResource(0);switchTab('version');flash('#detailPanel');}}
];
let selectedResource=0,selectedCategory=-1,demoIndex=0,demoTimer=null,playing=true;
const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];

function renderCategories(){
  $('#categoryList').innerHTML=categories.map((c,i)=>`<button class="category-item" data-index="${i}"><span class="category-icon" style="background:${c.color}">${c.icon}</span><strong>${c.name}</strong><em>${c.count}</em></button>`).join('');
  $$('.category-item').forEach(b=>b.addEventListener('click',()=>selectCategory(+b.dataset.index)));
}
function detailHtml(tab='base'){
  const r=resources[selectedResource];
  if(tab==='version')return `<div class="version-list"><div class="version-item current"><strong>V3.0 当前发布版</strong><span>${r.updated} · 超级管理员发布 · 属性与照片更新</span></div><div class="version-item"><strong>V2.0 核实修订</strong><span>2026-10-22 · 规划团队提交 · 空间范围调整</span></div><div class="version-item"><strong>V1.0 初始建库</strong><span>2026-10-08 · 规划团队录入</span></div></div>`;
  if(tab==='review')return `<div class="version-list"><div class="version-item current"><strong>审核通过</strong><span>${r.updated} · 管理员 · 信息完整，可发布</span></div><div class="version-item"><strong>提交复核</strong><span>2026-11-02 · 八角街道 · 补充现场照片</span></div></div>`;
  return `<div class="info-grid"><div class="info-item"><label>一级分类</label><span>${r.type}</span></div><div class="info-item"><label>利用状态</label><span>${r.use}</span></div><div class="info-item"><label>面积规模</label><span>${r.area}</span></div><div class="info-item"><label>权属类型</label><span>${r.owner}</span></div><div class="info-item full"><label>潜力方向</label><span>${r.potential}</span></div><div class="info-item"><label>所属街道</label><span>${r.address.includes('八角')?'八角街道':r.address.includes('古城')?'古城街道':r.address.includes('鲁谷')?'鲁谷街道':'苹果园街道'}</span></div><div class="info-item"><label>更新日期</label><span>${r.updated}</span></div></div>`;
}
function selectResource(index){selectedResource=index;const r=resources[index];$$('[data-resource]').forEach(x=>x.classList.toggle('active',+x.dataset.resource===index));$('#detailCode').textContent=r.code;$('#detailName').textContent=r.name;$('#detailAddress').textContent=r.address;$('#detailStatus').textContent=r.verify;$('#detailStatus').className=`status-badge ${r.verify==='已核实'?'verified':'pending'}`;switchTab('base');}
function selectCategory(index){selectedCategory=index;$$('.category-item').forEach((b,i)=>b.classList.toggle('active',i===index));$('#resourceCount').textContent=categories[index].count;showToast(`已筛选：${categories[index].name}，地图显示 ${categories[index].count} 项资源`);}
function resetView(){selectedCategory=-1;$$('.category-item').forEach(b=>b.classList.remove('active'));$('#resourceCount').textContent='128';closeModal();switchTab('base');}
function switchTab(tab){$$('.detail-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));$('#detailPanel').innerHTML=detailHtml(tab);}
function flash(selector){const el=$(selector);if(!el)return;el.classList.remove('demo-highlight');void el.offsetWidth;el.classList.add('demo-highlight');}
function showToast(text){const t=$('#toast');t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200);}
function openModal(html){$('#modalContent').innerHTML=html;$('#modalBackdrop').classList.add('open');$('#modalBackdrop').setAttribute('aria-hidden','false');}
function closeModal(){$('#modalBackdrop').classList.remove('open');$('#modalBackdrop').setAttribute('aria-hidden','true');}
function openReview(){openModal(`<h2>审核中心</h2><p>街道和规划团队提交的变更申请，管理员审核后进入正式资源库。</p><div class="modal-stats"><div><strong>6</strong><span>待我审核</span></div><div><strong>3</strong><span>今日新增</span></div><div><strong>2</strong><span>空间调整</span></div><div><strong>1</strong><span>归档申请</span></div></div><table class="review-table"><thead><tr><th>申请内容</th><th>申请单位</th><th>类型</th><th>状态</th></tr></thead><tbody><tr><td>古城南街低效楼宇属性修订</td><td>古城街道</td><td>属性修改</td><td><span class="tag">待审核</span></td></tr><tr><td>八角游园边界范围调整</td><td>规划团队</td><td>空间调整</td><td><span class="tag">待审核</span></td></tr><tr><td>鲁谷社区新增屋顶资源</td><td>鲁谷街道</td><td>新增资源</td><td><span class="tag">待审核</span></td></tr></tbody></table>`);}
function openAdd(){openModal(`<h2>新增资源申请</h2><p>演示版展示第一步录入界面。正式数据提交后进入审核流程。</p><div class="form-grid"><label>资源名称<input placeholder="请输入资源名称"></label><label>一级分类<select>${categories.map(c=>`<option>${c.name}</option>`).join('')}</select></label><label>利用状态<select><option>完全闲置</option><option>部分闲置</option><option>低效利用</option></select></label><label>空间表达<select><option>点</option><option>面</option></select></label><label style="grid-column:1/-1">地址<input placeholder="请输入地址或在地图上标注"></label></div><div class="detail-actions"><button class="secondary" onclick="document.querySelector('#modalClose').click()">保存草稿</button><button class="primary" onclick="document.querySelector('#modalClose').click()">提交审核</button></div>`);}
function runDemoStep(index){demoIndex=(index+demoSteps.length)%demoSteps.length;$('#demoTitle').textContent=demoSteps[demoIndex].title;$('#demoStep').textContent=`${demoIndex+1} / ${demoSteps.length}`;$('#demoProgress').style.width=`${(demoIndex+1)/demoSteps.length*100}%`;demoSteps[demoIndex].run();}
function startDemo(){clearInterval(demoTimer);playing=true;$('#toggleDemo').textContent='暂停';demoTimer=setInterval(()=>runDemoStep(demoIndex+1),5200);}
function toggleDemo(){if(playing){clearInterval(demoTimer);playing=false;$('#toggleDemo').textContent='继续';}else startDemo();}

renderCategories();selectResource(0);runDemoStep(0);startDemo();
$$('[data-resource]').forEach(el=>el.addEventListener('click',()=>{selectResource(+el.dataset.resource);showToast(`已定位：${resources[+el.dataset.resource].name}`);}));
$$('.detail-tabs button').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));
$$('[data-collapse]').forEach(b=>b.addEventListener('click',()=>$('.workspace').classList.add(`${b.dataset.collapse}-collapsed`)));
$('#leftReopen').addEventListener('click',()=>$('.workspace').classList.remove('left-collapsed'));$('#rightReopen').addEventListener('click',()=>$('.workspace').classList.remove('right-collapsed'));
$('#resetFilter').addEventListener('click',resetView);$('#reviewButton').addEventListener('click',openReview);$('#addButton').addEventListener('click',openAdd);$('#modalClose').addEventListener('click',closeModal);$('#modalBackdrop').addEventListener('click',e=>{if(e.target===e.currentTarget)closeModal();});
$('#layerButton').addEventListener('click',()=>{$('#planningLayer').classList.toggle('hidden');showToast($('#planningLayer').classList.contains('hidden')?'已隐藏规划地块图层':'已显示规划地块图层');});
$('#historyButton').addEventListener('click',()=>switchTab('version'));$('#editButton').addEventListener('click',()=>{openAdd();$('#modalContent h2').textContent='资源修改申请';});
$('#toggleDemo').addEventListener('click',toggleDemo);$('#prevStep').addEventListener('click',()=>{runDemoStep(demoIndex-1);startDemo();});$('#nextStep').addEventListener('click',()=>{runDemoStep(demoIndex+1);startDemo();});
$('#searchInput').addEventListener('input',e=>{const q=e.target.value.trim();if(!q)return;const i=resources.findIndex(r=>Object.values(r).some(v=>String(v).includes(q)));if(i>=0)selectResource(i);});
$$('.basemap-switch button').forEach(b=>b.addEventListener('click',()=>{$$('.basemap-switch button').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#mapCanvas').style.filter=b.textContent==='卫星'?'saturate(.72) contrast(1.08)':'none';showToast(`已切换至${b.textContent}底图演示`);}));

