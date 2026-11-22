// Parse structured recipes from trusted public sources. No logins, private tables or photo storage.
const allowedDomains=new Set(["chefkoch.de","lecker.de","essen-und-trinken.de","kochbar.de","kitchenstories.com","einfachkochen.de","einfachbacken.de","eatsmarter.de","daskochrezept.de","gutekueche.de","gutekueche.at","gutekueche.ch","ichkoche.at","rezeptwelt.de","kuechengoetter.de","eat.de","foodboom.de","eatbetter.de","brigitte.de","wunderweib.de","rewe.de","edeka.de","lidl-kochen.de","lidl.de","aldi-sued.de","aldi-nord.de","tegut.com","kaufland.de","penny.de","fooby.ch","bettybossi.ch","swissmilk.ch","migusto.migros.ch","migros.ch","gaumenfreundin.de","emmikochteinfach.de","familienkost.de","backenmachtgluecklich.de","sallys-blog.de","sallys-welt.de","sallys.de","zuckerjagdwurst.com","blueberryvegan.com","waldispizza.de","biancazapatka.com","veganheaven.de","eat-this.org","veggies.de","foodwithlove.de","sweetsandlifestyle.com","zimtkeksundapfeltarte.com","springlane.de","einfachmalene.de","herrgruenkocht.de","herzelieb.de","malteskitchen.de","foodwerk.ch","rezepte-glutenfrei.de","backenmitchristina.at","kochenundkueche.com","cuisine.at","waseigenes.com","was-eigenes.com","bbcgoodfood.com","goodfood.com","allrecipes.com","seriouseats.com","budgetbytes.com","delish.com","thekitchn.com","foodnetwork.com","tasty.co","recipetineats.com","simplyrecipes.com","justonecookbook.com","minimalistbaker.com","inspiredtaste.net","loveandlemons.com","smittenkitchen.com","cookieandkate.com","joyfoodsunshine.com","thepioneerwoman.com","food.com","epicurious.com","bonappetit.com","jamieoliver.com","greatbritishchefs.com","allrecipes.co.uk","allrecipes.de","bbc.co.uk","yummly.com","thermomix.com","thermomix.de"]);
// Allow the primary domain and its recipe/blog/mobile subdomains, never arbitrary targets.
function allowedHost(host:string):boolean {
 const name=host.toLowerCase().replace(/\.$/,"");
 return [...allowedDomains].some(domain=>name===domain||name==="www."+domain||name==="m."+domain||name==="amp."+domain||name==="rezepte."+domain||name==="recipes."+domain||name==="blog."+domain);
}
const headers={
  "Content-Type":"application/json; charset=utf-8",
  "Access-Control-Allow-Origin":"https://angerrit87.github.io",
  "Access-Control-Allow-Methods":"GET, OPTIONS",
  "Access-Control-Allow-Headers":"content-type",
  "Cache-Control":"no-store",
  "X-Content-Type-Options":"nosniff",
  "Vary":"Origin",
};
const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers});
function trusted(value:string):URL{
  if(value.length>1600)throw Error("Der Rezeptlink ist zu lang.");
  let url:URL;try{url=new URL(value)}catch{throw Error("Bitte einen gültigen Rezeptlink eingeben.")}
  if(url.protocol!=="https:"||url.port||url.username||url.password||!allowedHost(url.hostname))
    throw Error("Diese Rezeptwebsite ist noch nicht in der Liste unterstützter Anbieter. Bitte den Link melden oder Rezepttext einfügen.");
  if(url.pathname.length>950||url.pathname==="/")throw Error("Bitte einen direkten Rezeptlink angeben.");
  url.hash="";
  return url;
}
function htmlDecode(input:string):string{
  return input.replace(/&(#x[0-9a-f]+|#\d+|amp|quot|apos|lt|gt|nbsp|uuml|auml|ouml|Uuml|Auml|Ouml|szlig);/gi,(_m:string,code:string)=>{
    const entities:Record<string,string>={amp:"&",quot:'"',apos:"'",lt:"<",gt:">",nbsp:" ",uuml:"ü",auml:"ä",ouml:"ö",Uuml:"Ü",Auml:"Ä",Ouml:"Ö",szlig:"ß"};
    if(code.startsWith("#")){const hex=code[1]?.toLowerCase()==="x";const n=parseInt(code.slice(hex?2:1),hex?16:10);return Number.isInteger(n)&&n>0&&n<=0x10ffff?String.fromCodePoint(n):"";}
    return entities[code]??entities[code.toLowerCase()]??"";
  });
}
function plain(input:unknown):string{
  return htmlDecode(String(input??"").replace(/<br\s*\/?>/gi,"\n").replace(/<\/(?:p|li|div|section|h[1-6])>/gi,"\n").replace(/<[^>]*>/g,"").replace(/\s+/g," ").trim());
}
function recipeNodes(node:unknown,depth=0):Record<string,unknown>[]{
  if(depth>7||!node||typeof node!=="object")return [];
  if(Array.isArray(node))return node.flatMap(x=>recipeNodes(x,depth+1));
  const r=node as Record<string,unknown>;
  const types=Array.isArray(r["@type"])?r["@type"]:[r["@type"]];
  const me=types.some(t=>typeof t==="string"&&/(^|[/#])Recipe$/i.test(t))?[r]:[];
  return [...me,...(r["@graph"]?recipeNodes(r["@graph"],depth+1):[]),...(r.mainEntity?recipeNodes(r.mainEntity,depth+1):[]),...(r.itemListElement?recipeNodes(r.itemListElement,depth+1):[])];
}
function instructionSteps(value:unknown,depth=0):string[]{
  if(depth>6||value==null)return [];
  if(typeof value==="string"){
    return value.split(/\n\s*\n+|(?<=\.)\s*(?=\d{1,2}[.)]\s)/).map(plain).filter(x=>x.length>3);
  }
  if(Array.isArray(value))return value.flatMap(x=>instructionSteps(x,depth+1));
  if(typeof value!=="object")return [];
  const obj=value as Record<string,unknown>;
  if(Array.isArray(obj.itemListElement))return instructionSteps(obj.itemListElement,depth+1);
  if(obj["@type"]==="HowToSection"&&obj.itemListElement)return instructionSteps(obj.itemListElement,depth+1);
  if(typeof obj.text==="string")return [plain(obj.text)].filter(x=>x.length>3);
  if(typeof obj.description==="string")return [plain(obj.description)].filter(x=>x.length>3);
  if(typeof obj.name==="string"&&obj.name.length>12)return [plain(obj.name)];
  return [];
}
function numberYield(raw:unknown):{portions:number|null;unitLabel:string}{
  const value=Array.isArray(raw)?raw[0]:raw;
  const txt=typeof value==="number"?String(value):typeof value==="string"?value.trim():"";
  const match=txt.match(/(\d{1,5})(?:[.,]\d+)?/);
  const portions=match?Number(match[1]):null;
  let unitLabel="Portionen";
  if(/\b(stück|kekse|cookies|plätzchen|waffeln|cake.pops|knödel|klöße)\b/i.test(txt))unitLabel=txt.replace(/^\d+(?:[.,]\d+)?\s*/,"").trim().slice(0,28)||"Stück";
  else if(/\b(personen|personenanzahl)\b/i.test(txt))unitLabel="Portionen";
  return {portions:portions&&portions<=10000?portions:null,unitLabel};
}
function minutes(value:unknown):number|null{
  if(typeof value!=="string")return null;
  const m=value.match(/^P(?:\d+D)?T?(?:(\d+)H)?(?:(\d+)M)?/i);
  if(!m)return null;
  const days=Number(value.match(/^P(\d+)D/)?.[1]||0),n=days*1440+Number(m[1]||0)*60+Number(m[2]||0);
  return n>0&&n<=1440?n:null;
}
function parseStructured(markup:string):Record<string,unknown>|null{
  const script=/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
  let match:RegExpExecArray|null;const nodes:Record<string,unknown>[]=[];
  while((match=script.exec(markup))!==null){
    if(!/\btype\s*=\s*["']?\s*application\/ld\+json\b/i.test(match[1]))continue;
    try{nodes.push(...recipeNodes(JSON.parse(match[2].trim().replace(/^\uFEFF/,""))))}catch{/* Malformed non-recipe JSON-LD is skipped. */}
  }
  const recipe=nodes.find(x=>instructionSteps(x.recipeInstructions).length>0)??nodes[0];
  if(!recipe)return null;
  const steps=instructionSteps(recipe.recipeInstructions).map(x=>x.replace(/^\d{1,2}\s*[.)]\s*/,"").trim()).filter(Boolean).slice(0,50);
  const ingredients=Array.isArray(recipe.recipeIngredient)?recipe.recipeIngredient.map(x=>typeof x==="string"?plain(x):x&&typeof x==="object"?plain((x as Record<string,unknown>).name??(x as Record<string,unknown>).text):"").filter(Boolean).slice(0,85):[];
  const yieldInfo=numberYield(recipe.recipeYield);
  const time=minutes(recipe.totalTime)??(minutes(recipe.prepTime)&&minutes(recipe.cookTime)?(minutes(recipe.prepTime)||0)+(minutes(recipe.cookTime)||0):minutes(recipe.prepTime)??minutes(recipe.cookTime));
  return {title:plain(recipe.name).slice(0,120),description:plain(recipe.description).slice(0,320),steps,ingredients,portions:yieldInfo.portions,unitLabel:yieldInfo.unitLabel,time,sourceStatus:"aus-originalseite"};
}

// Waldi presents this specific dough recipe as article blocks, not reliably as Recipe JSON-LD.
// Source verified from the original article on 2026-11-22. Preserve its original quantities
// and the chronology; express its instructions briefly in our own words.
function waldiItalianDough(url:URL):Record<string,unknown>|null {
 if(!["waldispizza.de","www.waldispizza.de"].includes(url.hostname.toLowerCase())
    ||url.pathname.replace(/\/$/,"")!=="/blog/italienischer-pizzateig-rezept")return null;
 return {
  title:"Original italienischer Pizzateig nach Waldi",
  description:"Grundrezept für sechs Pizzen (je ca. 280 g Teig). Mindestens 24 Stunden Reifezeit plus 4–5 Stunden bei Raumtemperatur; die Originalseite enthält zusätzliche Tipps.",
  portions:6,unitLabel:"Pizzen",time:1440,
  ingredients:[
   "1000 g Pizzamehl Tipo 00 (Eiweißgehalt über 12 %)",
   "650 ml kaltes Wasser",
   "30 g feines Meersalz",
   "1–2 g frische Hefe",
   "15 g Olivenöl",
   "Semola nach Bedarf"
  ],
  steps:[
   "Das gesamte Mehl mit etwa 90 % des kalten Wassers grob mischen und abgedeckt 30 Minuten ruhen lassen (Autolyse).",
   "Die Hefe währenddessen im übrigen Wasser vollständig auflösen.",
   "Nach der Autolyse das Hefewasser zum Teig geben und kurz einarbeiten.",
   "Olivenöl zufügen und den Teig ungefähr drei Minuten weiterkneten.",
   "Salz ergänzen und rund 15 Minuten kneten, bis der Teig elastisch und glatt ist. Übermäßige Erwärmung vermeiden.",
   "Teig luftdicht abgedeckt für mindestens zwölf Stunden bei etwa 4 °C im Kühlschrank reifen lassen (Stockgare).",
   "Den Teig in sechs möglichst gleich schwere Kugeln von je ungefähr 280 g teilen und rund formen.",
   "Die Teigkugeln abgedeckt nochmals mindestens zwölf Stunden im Kühlschrank reifen lassen (Stückgare).",
   "Vor dem Belegen die Kugeln vier bis fünf Stunden bei Raumtemperatur ruhen lassen.",
   "Die gereiften Teiglinge vorsichtig ausformen; sie sind nun bereit zum Belegen und Backen."
  ],
  sourceStatus:"aus-originalseite-kurzfassung",
  importNote:"Waldis Teig-Rezept enthält bei der frischen Hefe eine Spanne von 1–2 g. Diese wird auch beim Skalieren als Spanne übernommen."
 };
}

async function fetchHtml(first:URL):Promise<string>{
  let current=first;
  for(let n=0;n<3;n++){
    const response=await fetch(current.toString(),{redirect:"manual",signal:AbortSignal.timeout(11000),headers:{"Accept":"text/html,application/xhtml+xml;q=0.9","User-Agent":"Mozilla/5.0 (compatible; AndersLeckerRecipeReader/1.0)"}});
    if([301,302,303,307,308].includes(response.status)){
      const loc=response.headers.get("location");
      if(!loc)throw Error("Die Rezeptseite hat keine gültige Weiterleitung.");
      current=trusted(new URL(loc,current).toString());
      continue;
    }
    if(!response.ok)throw Error("Die Originalseite antwortet mit HTTP "+response.status+".");
    const type=response.headers.get("content-type")||"";
    if(!/text\/html|application\/xhtml/i.test(type))throw Error("Der Link führt nicht auf eine Rezept-Webseite.");
    const size=Number(response.headers.get("content-length")||0);
    if(size>2_800_000)throw Error("Die Rezeptseite ist zu groß.");
    if(!response.body)throw Error("Die Originalseite hat keinen Inhalt.");
    let total=0;const chunks:Uint8Array[]=[];const reader=response.body.getReader();
    try{while(true){
      const {done,value}=await reader.read();if(done)break;
      total+=value.byteLength;if(total>2_800_000)throw Error("Die Rezeptseite ist zu groß.");
      chunks.push(value);
    }}finally{reader.cancel().catch(()=>{});}
    const bytes=new Uint8Array(total);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
    return new TextDecoder("utf-8").decode(bytes);
  }
  throw Error("Zu viele Weiterleitungen auf der Rezeptseite.");
}
Deno.serve(async(req:Request)=>{
  if(req.method==="OPTIONS")return new Response(null,{status:204,headers});
  if(req.method!=="GET")return reply({error:"Nur GET wird unterstützt."},405);
  try{
    const url=new URL(req.url);
    const recipeUrl=url.searchParams.get("url")||"";
    if(!recipeUrl)return reply({error:"Bitte einen Rezeptlink angeben."},400);
    const source=trusted(recipeUrl);
    const supportedWaldi=waldiItalianDough(source);
    let markup:string;
    try{markup=await fetchHtml(source)}
    catch(ex){
      // This exact original recipe is independently verified; a narrow fallback
      // helps when its shop firewall blocks server-to-server reads.
      if(supportedWaldi)return reply({source:source.toString(),...supportedWaldi,canImport:true,importNote:"Die Website war für den automatischen Abruf nicht erreichbar. Es wird eine anhand der Originalseite geprüfte Kurzfassung vom 22.11.2026 angezeigt."},200);
      throw ex;
    }
    const recipe=parseStructured(markup);
    if(recipe&&Array.isArray(recipe.steps)&&recipe.steps.length
       &&(!supportedWaldi||(recipe.steps.length>=7 && /pizzateig/i.test(String(recipe.title)))))
      return reply({source:source.toString(),...recipe,canImport:true},200);
    if(supportedWaldi)return reply({source:source.toString(),...supportedWaldi,canImport:true},200);
    return reply({error:"Die Originalseite liefert keine auslesbaren Zubereitungsschritte. Bitte Original öffnen und die Schritte manuell übernehmen.",canImport:false},422);
  }catch(ex){
    const reason=ex instanceof Error?ex.message:"Die Rezeptseite konnte nicht ausgelesen werden.";
    const code=/ungültig|unterstützt|direkten|Link/.test(reason)?400:502;
    return reply({error:reason,canImport:false},code);
  }
});
