import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./supabase-config.js";

const gate = document.getElementById("authGate");
const form = document.getElementById("authForm");
const emailInput = document.getElementById("authEmail");
const passwordInput = document.getElementById("authPassword");
const message = document.getElementById("authMessage");
const submit = document.getElementById("authSubmit");
const signOut = document.getElementById("authSignOut");
const userLabel = document.getElementById("authUserLabel");
let supabase = null;

function showMessage(text, type = "") {
  message.textContent = text;
  message.className = `auth-message ${type}`.trim();
}
function setAuthenticated(user) {
  document.body.classList.toggle("auth-locked", !user);
  if (user) {
    userLabel.textContent = user.email || "Usuario autenticado";
    signOut.hidden = false;
    passwordInput.value = "";
  } else {
    userLabel.textContent = "";
    signOut.hidden = true;
  }
}

async function initAuth() {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY || SUPABASE_PUBLISHABLE_KEY.includes("PEGA_AQUI")) {
    showMessage("Falta configurar la clave publicable de Supabase. Consulta README-AUTENTICACION.md.", "error");
    return;
  }
  try {
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    setAuthenticated(data.session?.user || null);
    showMessage(data.session ? "Sesión activa." : "Ingresa con las credenciales de tu cuenta autorizada.");
    supabase.auth.onAuthStateChange((_event, session) => setAuthenticated(session?.user || null));
  } catch (error) {
    console.error("CAM-SST auth init:", error);
    showMessage("No se pudo conectar con el servicio de autenticación. Revisa la conexión y la configuración.", "error");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabase) { showMessage("Autenticación sin configurar. Completa primero supabase-config.js.", "error"); return; }
  submit.disabled = true; submit.textContent = "Validando…";
  showMessage("Validando credenciales…");
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email: emailInput.value.trim(), password: passwordInput.value });
    if (error) throw error;
    setAuthenticated(data.user);
    showMessage("Ingreso correcto.", "success");
  } catch (error) {
    console.error("CAM-SST sign-in:", error);
    showMessage("No fue posible ingresar. Verifica el correo y la contraseña o consulta al administrador.", "error");
  } finally { submit.disabled = false; submit.textContent = "Ingresar"; }
});

signOut.addEventListener("click", async () => {
  if (!supabase) return;
  signOut.disabled = true;
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setAuthenticated(null);
    showMessage("Sesión cerrada correctamente.", "success");
  } catch (error) {
    console.error("CAM-SST sign-out:", error);
    showMessage("No se pudo cerrar la sesión. Intenta nuevamente.", "error");
  } finally { signOut.disabled = false; }
});

initAuth();
