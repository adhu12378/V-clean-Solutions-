import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import logo from "@/assets/vclean-logo-dark-theme.svg";

export const Route = createFileRoute("/auth")({ head: () => ({ meta: [{ title:"Admin sign in | VClean Solutions" },{name:"description",content:"Secure VClean administrator sign in."},{property:"og:title",content:"VClean Admin sign in"},{property:"og:description",content:"Secure access for VClean administrators."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"},{name:"robots",content:"noindex,nofollow"}] }), component: AuthPage });
function AuthPage() {
  const navigate = useNavigate();
  const [mode,setMode] = useState<"signin"|"signup"|"forgot">("signin");
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true);setMessage("");
    const f=new FormData(e.currentTarget); const email=String(f.get("email")); const password=String(f.get("password") || "");
    try {
      if(mode==="forgot") {
        const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${window.location.origin}/reset-password`}); if(error) throw error; setMessage("Check your email for a password reset link.");
      } else if(mode==="signup") {
        const {error}=await supabase.auth.signUp({email,password,options:{emailRedirectTo:`${window.location.origin}/auth`}}); if(error) throw error;setMessage("Check your email to confirm your account, then sign in.");
      } else {
        const {error}=await supabase.auth.signInWithPassword({email,password});if(error) throw error;await navigate({to:"/admin"});
      }
    } catch(error){setMessage(error instanceof Error ? error.message:"Sign in failed");} finally {setBusy(false);}
  }
  async function social(provider:"google"|"lovable") {
    setBusy(true); const result=await lovable.auth.signInWithOAuth(provider,{redirect_uri:`${window.location.origin}/auth`});
    if(result.error){setMessage(result.error.message);setBusy(false);return;}
    if(!result.redirected) await navigate({to:"/admin"});
  }
  return <main className="min-h-screen bg-background px-5 py-16 text-foreground"><div className="mx-auto max-w-md"><Link to="/"><img src={logo} className="h-16 w-48 object-contain" alt="VClean Solutions" /></Link><h1 className="mt-10 font-display text-3xl">{mode==="forgot"?"Reset your password":mode==="signup"?"Create admin account":"Administrator sign in"}</h1><form onSubmit={submit} className="mt-8 space-y-5"><label className="block text-sm">Email<input name="email" required type="email" autoComplete="email" className="form-field mt-2" /></label>{mode!=="forgot"&&<label className="block text-sm">Password<input name="password" required minLength={8} type="password" autoComplete={mode==="signin"?"current-password":"new-password"} className="form-field mt-2" /></label>}{message&&<p role="status" className="text-sm text-accent">{message}</p>}<Button disabled={busy} type="submit" className="w-full">{busy?"Please wait…":mode==="forgot"?"Send reset link":mode==="signup"?"Create account":"Sign in"}</Button></form>{mode==="signin"&&<div className="mt-4 space-y-3"><Button disabled={busy} variant="outline" className="w-full" onClick={()=>social("google")}>Continue with Google</Button><Button disabled={busy} variant="outline" className="w-full" onClick={()=>social("lovable")}>Sign in with Lovable</Button></div>}<div className="mt-6 flex flex-wrap gap-3"><Button variant="link" onClick={()=>{setMode(mode==="signin"?"signup":"signin");setMessage("");}}>{mode==="signin"?"Create admin account":"Back to sign in"}</Button>{mode==="signin"&&<Button variant="link" onClick={()=>setMode("forgot")}>Forgot password?</Button>}</div></div></main>;
}