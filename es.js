/*! (c) Andrea Giammarchi */
let t=null;const e=e=>{let s=t;s||(t=new Set);try{e()}finally{if(!s){[t,s]=[null,t];for(const t of s)t._()}}},s=t=>{const e=[...t];return t.clear(),e};class r extends Set{constructor(t){super()._=t}dispose(){for(const t of s(this))t.delete(this),t.dispose?.()}}let n=null;const l=t=>{const e=new r((()=>{const s=n;n=e;try{t()}finally{n=s}}));return e},u=t=>{let e,s=l((()=>{e?.call?.(),e=t()}));return n&&n.add(s),s._(),()=>s.dispose()},o=t=>{let e,s=n;return n=null,e=t(),n=s,e};class i extends Set{constructor(t){super()._=t}get value(){return n&&n.add(this.add(n)),this._}set value(e){if(this._!==e){this._=e;const r=!t;for(const e of s(this))r?e._():t.add(e)}}peek(){return this._}toJSON(){return this.value}valueOf(){return this.value}toString(){return String(this.value)}}const c=t=>new i(t);class a extends i{constructor(t,e){super(e).f=t,this.e=null}get value(){return this.e||(this.e=l((()=>{super.value=this.f(this._)})))._(),super.value}set value(t){throw new Error("computed is read-only")}}const d=(t,e)=>new a(t,e);export{a as Computed,i as Signal,e as batch,d as computed,u as effect,c as signal,o as untracked};
