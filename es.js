class e{#e;#t=new Set;constructor(e){this.#e=e}get value(){const{length:e}=l;return e&&this.#t.add(l[e-1]),this.#e}set value(e){e===u?i(this.#t,!1):this.#e!==e&&(this.#e=e,c===l?i(this.#t,!0):c.push(...this.#t))}peek(){return this.#e}then(){return this.value}toJSON(){return this.value}valueOf(){return this.value}toString(){return String(this.value)}}class t extends e{constructor(e,t){super(t).dispose=n((()=>{super.value=e(this.peek())}))}get value(){return super.value}set value(e){throw new Error("computed is read-only")}}const s=e=>{const t=c===l;t&&(c=[]);try{e()}finally{if(t){const e=new Set(c);c=l,i(e,!0)}}},r=(e,s)=>new t(e,s),u=Symbol(),n=(e,t)=>{const s=()=>{t=e(t)},r=()=>{o.add(s);for(const e of h.get(s))e()};h.set(s,[]);const u=l.push(s)-1;u&&h.get(l[u-1]).push(r);try{return s(),r}finally{l.pop()}},a=t=>new e(t),l=[],o=new WeakSet,h=new WeakMap,i=(e,t)=>{for(const s of e)o.has(s)?e.delete(s):t&&s()};let c=l;export{t as Computed,e as Signal,s as batch,r as computed,u as drain,n as effect,a as signal};
