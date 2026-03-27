import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabase.js";

/* ════════════════════════════════════════════════════════════════
   NULLSPACE STUDIO LLC — Project Directory
   Black + Green Cyber-Luxury Theme + Supabase Persistence
   Pages: Directory, Privacy, Admin, Messenger
   ════════════════════════════════════════════════════════════════ */

// ─── Utility: Generate IDs ───
const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toLocaleString("en-US", {
  month: "short", day: "numeric", year: "numeric",
  hour: "numeric", minute: "2-digit", hour12: true
});

// ─── Utility: Format number ───
const fmt = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
};

// ─── Icons (inline SVG) ───
const Icons = {
  message: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  shield: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  grid: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  send: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  upload: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
    </svg>
  ),
  x: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  eye: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  click: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 9l5 12 1.8-5.2L21 14 9 9z"/><path d="M7.2 2.2L8 5.1"/><path d="M2.2 7.2l2.9.8"/><path d="M4.8 4.8l2.1 2.1"/>
    </svg>
  ),
  chart: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  plus: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  trash: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  link: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  image: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  arrow: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
    </svg>
  ),
  lock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  menu: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  heart: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  coffee: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  ),
  bitcoin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"/>
    </svg>
  ),
  play: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  film: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/>
    </svg>
  ),
};

// ─── INITIAL DEMO DATA (fallback if Supabase is empty or not configured) ───
const FALLBACK_PROJECTS = [
  {
    id: "demo-1",
    title: "ParcelChain",
    description: "Buy real USPS, UPS, and FedEx shipping labels using Bitcoin or Monero. Crypto-powered logistics for the modern era.",
    url: "https://parcelchain.io",
    category: "Web App",
    type: "app",
    image: null,
    dateAdded: "Mar 10, 2026, 2:30 PM",
    status: "active",
  },
];
const FALLBACK_MEDIA = [];

const PROJECT_TYPES = [
  { key: "all", label: "All" },
  { key: "website", label: "Websites" },
  { key: "app", label: "Apps" },
  { key: "api", label: "APIs" },
  { key: "tool", label: "Tools" },
];

const MEDIA_TYPES = [
  { key: "youtube", label: "YouTube Link" },
  { key: "image", label: "Image" },
  { key: "video", label: "Video File" },
  { key: "info", label: "Info / Announcement" },
];

const DEFAULT_DONATE = {
  heroSubtitle: "Every website, app, API, and tool built under NullSpace Studio — all in one place. Browse live projects or reach out to learn more.",
  maxMediaPosts: 10,
  donateMethods: JSON.stringify([
    { id: "coffee", label: "Buy Me a Coffee ($)", type: "link", value: "https://buymeacoffee.com/nullspacestudio" },
    { id: "btc", label: "Bitcoin (BTC)", type: "crypto", value: "bc1qYOUR_BTC_ADDRESS_HERE" },
    { id: "xmr", label: "Monero (XMR)", type: "crypto", value: "4YOUR_MONERO_ADDRESS_HERE" },
  ]),
};

const DEFAULT_CREDENTIALS = {
  passkey: "332347213323",
  email: "badassinc21@gmail.com",
  password: "Blake101",
};

// ─── Supabase helper: check if configured ───
const isSupabaseConfigured = () => supabase !== null && supabase !== undefined;

// ─── Supabase CRUD helpers (all return { ok, error? } for toast feedback) ───
const db = {
  // Connection test
  async testConnection() {
    if (!isSupabaseConfigured()) return { ok: false, error: "Supabase not configured — update src/supabase.js with your project URL and anon key." };
    try {
      const { error } = await supabase.from("site_settings").select("id").eq("id", 1).single();
      if (error) return { ok: false, error: `Supabase error: ${error.message}` };
      return { ok: true };
    } catch (e) {
      return { ok: false, error: `Connection failed: ${e.message}` };
    }
  },

  // Activity log
  async logActivity(action, target, details) {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from("activity_log").insert({
        action, target, details: details || "",
        created_at: new Date().toISOString()
      });
    } catch (e) { console.error("Log activity:", e); }
  },
  async loadActivityLog() {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(50);
    if (error) { console.error("Load activity log:", error); return []; }
    return data || [];
  },

  // Projects
  async loadProjects() {
    if (!isSupabaseConfigured()) return FALLBACK_PROJECTS;
    const { data, error } = await supabase.from("projects").select("*").order("date_added", { ascending: false });
    if (error) { console.error("Load projects:", error); return FALLBACK_PROJECTS; }
    return (data || []).map(p => ({
      id: p.id, title: p.title, description: p.description || "", url: p.url || "",
      category: p.category || "", type: p.type || "website", image: p.image || null,
      status: p.status || "active", deleted_at: p.deleted_at || null,
      dateAdded: p.date_added ? new Date(p.date_added).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }) : now(),
    }));
  },
  async saveProject(p) {
    if (!isSupabaseConfigured()) return { ok: false };
    const row = { id: p.id, title: p.title, description: p.description, url: p.url, category: p.category, type: p.type, image: p.image, status: p.status, deleted_at: p.deleted_at || null, date_added: p.date_added_raw || new Date().toISOString() };
    const { error } = await supabase.from("projects").upsert(row, { onConflict: "id" });
    if (error) { console.error("Save project:", error); return { ok: false, error: error.message }; }
    return { ok: true };
  },
  async softDeleteProject(id) {
    if (!isSupabaseConfigured()) return { ok: false };
    const { error } = await supabase.from("projects").update({ status: "deleted", deleted_at: new Date().toISOString() }).eq("id", id);
    if (error) { console.error("Soft delete project:", error); return { ok: false, error: error.message }; }
    return { ok: true };
  },
  async hardDeleteProject(id) {
    if (!isSupabaseConfigured()) return { ok: false };
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) { console.error("Hard delete project:", error); return { ok: false, error: error.message }; }
    return { ok: true };
  },
  async purgeOldDeleted() {
    if (!isSupabaseConfigured()) return;
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from("projects").delete().eq("status", "deleted").lt("deleted_at", cutoff);
    await supabase.from("media").delete().eq("status", "deleted").lt("deleted_at", cutoff);
  },

  // Media
  async loadMedia() {
    if (!isSupabaseConfigured()) return FALLBACK_MEDIA;
    const { data, error } = await supabase.from("media").select("*").order("date_added", { ascending: false });
    if (error) { console.error("Load media:", error); return FALLBACK_MEDIA; }
    return (data || []).map(m => ({
      id: m.id, type: m.type || "info", title: m.title, description: m.description || "",
      url: m.url || "", image: m.image || null, videoFile: m.video_file || null,
      status: m.status || "active", deleted_at: m.deleted_at || null,
      dateAdded: m.date_added ? new Date(m.date_added).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }) : now(),
    }));
  },
  async saveMedia(m) {
    if (!isSupabaseConfigured()) return { ok: false };
    const row = { id: m.id, type: m.type, title: m.title, description: m.description, url: m.url || "", image: m.image || null, video_file: m.videoFile || null, status: "active", date_added: new Date().toISOString() };
    const { error } = await supabase.from("media").upsert(row, { onConflict: "id" });
    if (error) { console.error("Save media:", error); return { ok: false, error: error.message }; }
    return { ok: true };
  },
  async softDeleteMedia(id) {
    if (!isSupabaseConfigured()) return { ok: false };
    const { error } = await supabase.from("media").update({ status: "deleted", deleted_at: new Date().toISOString() }).eq("id", id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  },
  async hardDeleteMedia(id) {
    if (!isSupabaseConfigured()) return { ok: false };
    const { error } = await supabase.from("media").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  },

  // Messages
  async loadMessages() {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
    if (error) { console.error("Load messages:", error); return []; }
    return data || [];
  },
  async saveMessage(m) {
    if (!isSupabaseConfigured()) return { ok: false };
    const { error } = await supabase.from("messages").insert({ id: m.id, email: m.email || "", text: m.text, image: m.image, time: m.time });
    if (error) { console.error("Save message:", error); return { ok: false }; }
    return { ok: true };
  },
  async clearMessages() {
    if (!isSupabaseConfigured()) return;
    await supabase.from("messages").delete().neq("id", "");
  },
  async updateMessage(id, updates) {
    if (!isSupabaseConfigured()) return { ok: false };
    const { error } = await supabase.from("messages").update(updates).eq("id", id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  },
  async deleteMessage(id) {
    if (!isSupabaseConfigured()) return;
    await supabase.from("messages").delete().eq("id", id);
  },
  async purgeDisregarded() {
    if (!isSupabaseConfigured()) return;
    const cutoff = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from("messages").delete().eq("status", "disregarded").lt("disregarded_at", cutoff);
  },

  // Q&A (public questions + admin replies)
  async loadQA() {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase.from("qa_posts").select("*").order("created_at", { ascending: false });
    if (error) { console.error("Load Q&A:", error); return []; }
    return data || [];
  },
  async saveQA(item) {
    if (!isSupabaseConfigured()) return { ok: false };
    const { error } = await supabase.from("qa_posts").upsert(item, { onConflict: "id" });
    if (error) { console.error("Save Q&A:", error); return { ok: false, error: error.message }; }
    return { ok: true };
  },
  async deleteQA(id) {
    if (!isSupabaseConfigured()) return;
    await supabase.from("qa_posts").delete().eq("id", id);
  },

  // Settings
  async loadSettings() {
    if (!isSupabaseConfigured()) return DEFAULT_CREDENTIALS;
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
    if (error || !data) return DEFAULT_CREDENTIALS;
    return { passkey: data.passkey, email: data.email, password: data.password };
  },
  async updateSetting(field, value) {
    if (!isSupabaseConfigured()) return { ok: false };
    const { error } = await supabase.from("site_settings").update({ [field]: value, updated_at: new Date().toISOString() }).eq("id", 1);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  },
  async loadSiteConfig() {
    if (!isSupabaseConfigured()) return { heroSubtitle: DEFAULT_DONATE.heroSubtitle, maxMediaPosts: DEFAULT_DONATE.maxMediaPosts, donateMethods: JSON.parse(DEFAULT_DONATE.donateMethods) };
    const { data, error } = await supabase.from("site_config").select("*").eq("id", 1).single();
    if (error || !data) return { heroSubtitle: DEFAULT_DONATE.heroSubtitle, maxMediaPosts: DEFAULT_DONATE.maxMediaPosts, donateMethods: JSON.parse(DEFAULT_DONATE.donateMethods) };
    let methods;
    try { methods = JSON.parse(data.donate_methods || DEFAULT_DONATE.donateMethods); } catch { methods = JSON.parse(DEFAULT_DONATE.donateMethods); }
    return {
      heroSubtitle: data.hero_subtitle || DEFAULT_DONATE.heroSubtitle,
      maxMediaPosts: data.max_media_posts || DEFAULT_DONATE.maxMediaPosts,
      donateMethods: methods,
    };
  },
  async updateSiteConfig(updates) {
    if (!isSupabaseConfigured()) return { ok: false, error: "Not configured" };
    const row = { updated_at: new Date().toISOString() };
    if (updates.heroSubtitle !== undefined) row.hero_subtitle = updates.heroSubtitle;
    if (updates.maxMediaPosts !== undefined) row.max_media_posts = updates.maxMediaPosts;
    if (updates.donateMethods !== undefined) row.donate_methods = JSON.stringify(updates.donateMethods);
    console.log("Saving site_config:", row);
    const { error } = await supabase.from("site_config").update(row).eq("id", 1);
    if (error) { console.error("updateSiteConfig error:", error); return { ok: false, error: error.message }; }
    return { ok: true };
  },

  // Analytics — event-based tracking via page_views table
  async trackPageView(page, eventType) {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from("page_views").insert({
        page: page || "home",
        event_type: eventType || "view",
        user_agent: navigator.userAgent || "",
        referrer: document.referrer || "",
        screen_width: window.innerWidth || 0,
      });
    } catch (e) { console.error("Track view:", e); }
  },
  async purgeOldAnalytics() {
    if (!isSupabaseConfigured()) return;
    const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from("page_views").delete().lt("created_at", cutoff);
  },
  async loadAnalytics(daysBack) {
    const empty = { totalVisitors: 0, totalClicks: 0, uniqueVisitors: 0, bounceRate: 0, daily: [], recentVisitors: [] };
    if (!isSupabaseConfigured()) return empty;
    const since = new Date(Date.now() - (daysBack || 7) * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase.from("page_views").select("*").gte("created_at", since).order("created_at", { ascending: true });
    if (error || !data) return empty;

    // Compute stats
    const views = data.filter(d => d.event_type === "view");
    const clicks = data.filter(d => d.event_type === "click");
    const uniqueAgents = new Set(views.map(d => d.user_agent)).size;

    // Group by day
    const dayMap = {};
    const allDays = [];
    for (let i = (daysBack || 7) - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dayMap[key] = { day: label, date: key, visitors: 0, clicks: 0 };
      allDays.push(key);
    }
    views.forEach(v => {
      const key = v.created_at.slice(0, 10);
      if (dayMap[key]) dayMap[key].visitors++;
    });
    clicks.forEach(c => {
      const key = c.created_at.slice(0, 10);
      if (dayMap[key]) dayMap[key].clicks++;
    });
    const daily = allDays.map(k => dayMap[k]);

    // Recent visitors (last 20) — include id for deletion
    const recent = views.slice(-20).reverse().map(v => ({
      id: v.id,
      time: new Date(v.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true }),
      page: v.page, agent: v.user_agent, referrer: v.referrer, screen: v.screen_width,
    }));

    // Bounce rate (single-page sessions approximation — visitors with only 1 view)
    const agentCounts = {};
    views.forEach(v => { agentCounts[v.user_agent] = (agentCounts[v.user_agent] || 0) + 1; });
    const singleVisit = Object.values(agentCounts).filter(c => c === 1).length;
    const bounceRate = Object.keys(agentCounts).length > 0 ? Math.round((singleVisit / Object.keys(agentCounts).length) * 100) : 0;

    return {
      totalVisitors: views.length,
      totalClicks: clicks.length,
      uniqueVisitors: uniqueAgents,
      bounceRate,
      daily,
      recentVisitors: recent,
    };
  },
  async deletePageView(id) {
    if (!isSupabaseConfigured()) return;
    await supabase.from("page_views").delete().eq("id", id);
  },
  async clearAllPageViews() {
    if (!isSupabaseConfigured()) return;
    await supabase.from("page_views").delete().neq("id", 0);
  },
};

// ═══════════════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════════════
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');

:root {
  --black: #050505;
  --black-2: #0a0a0a;
  --black-3: #0f0f0f;
  --black-4: #141414;
  --black-5: #1a1a1a;
  --black-6: #222222;
  --black-7: #2a2a2a;
  --green: #00ff88;
  --green-dim: #00cc6a;
  --green-dark: #00aa55;
  --green-glow: rgba(0, 255, 136, 0.15);
  --green-glow-strong: rgba(0, 255, 136, 0.3);
  --green-glow-subtle: rgba(0, 255, 136, 0.06);
  --text: #e8e8e8;
  --text-dim: #888888;
  --text-muted: #555555;
  --border: #1f1f1f;
  --border-hover: #2a2a2a;
  --danger: #ff4444;
  --danger-dim: rgba(255, 68, 68, 0.15);
  --font-display: 'Outfit', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --radius: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-display);
  background: var(--black);
  color: var(--text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--black-2); }
::-webkit-scrollbar-thumb { background: var(--black-6); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--green-dark); }

/* ── Grid Background ── */
.grid-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(0,255,136,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,136,0.02) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* ── Top Bar ── */
.topbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 32px; height: 64px;
  background: rgba(5,5,5,0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}
.topbar-brand {
  display: flex; align-items: center; gap: 10px;
  font-family: var(--font-mono); font-weight: 700;
  font-size: 16px; letter-spacing: -0.5px;
  cursor: pointer; color: var(--text);
  text-decoration: none;
}
.topbar-brand .dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 12px var(--green);
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; box-shadow: 0 0 12px var(--green); }
  50% { opacity: 0.5; box-shadow: 0 0 6px var(--green); }
}

.topbar-nav {
  display: flex; align-items: center; gap: 4px;
}
.topbar-nav a, .topbar-nav button {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px; border-radius: var(--radius);
  font-family: var(--font-display); font-size: 13px; font-weight: 500;
  color: var(--text-dim); background: none; border: none;
  cursor: pointer; text-decoration: none;
  transition: all var(--transition);
  white-space: nowrap;
}
.topbar-nav a:hover, .topbar-nav button:hover {
  color: var(--text); background: var(--black-5);
}
.topbar-nav a.active, .topbar-nav button.active {
  color: var(--green); background: var(--green-glow-subtle);
}

.topbar-actions {
  display: flex; align-items: center; gap: 8px;
}
.btn-icon {
  display: flex; align-items: center; justify-content: center;
  width: 38px; height: 38px; border-radius: var(--radius);
  background: var(--black-4); border: 1px solid var(--border);
  color: var(--text-dim); cursor: pointer;
  transition: all var(--transition); position: relative;
}
.btn-icon:hover { color: var(--green); border-color: var(--green-dark); background: var(--green-glow-subtle); }
.btn-icon .badge {
  position: absolute; top: -4px; right: -4px;
  width: 16px; height: 16px; border-radius: 50%;
  background: var(--green); color: var(--black);
  font-size: 9px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}

.btn-login {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: var(--radius);
  background: var(--green); color: var(--black);
  font-family: var(--font-display); font-size: 13px; font-weight: 600;
  border: none; cursor: pointer;
  transition: all var(--transition);
}
.btn-login:hover { background: var(--green-dim); box-shadow: 0 0 20px var(--green-glow-strong); }

/* ── Mobile Menu ── */
.mobile-menu-btn {
  display: none;
  align-items: center; justify-content: center;
  width: 40px; height: 40px; border: none;
  background: none; color: var(--text); cursor: pointer;
}

@media (max-width: 768px) {
  .topbar { padding: 0 16px; }
  .topbar-nav { display: none; }
  .mobile-menu-btn { display: flex; }
  .mobile-nav-open .topbar-nav {
    display: flex; flex-direction: column;
    position: fixed; top: 64px; left: 0; right: 0;
    background: rgba(5,5,5,0.97); backdrop-filter: blur(20px);
    padding: 16px; border-bottom: 1px solid var(--border);
  }
}

/* ── Main Content ── */
.main { padding-top: 64px; min-height: 100vh; position: relative; z-index: 1; }

/* ── Hero ── */
.hero {
  padding: 100px 32px 80px;
  text-align: center;
  position: relative;
}
.hero::before {
  content: '';
  position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%);
  pointer-events: none;
}
.hero-label {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 16px; border-radius: 20px;
  background: var(--green-glow-subtle);
  border: 1px solid rgba(0,255,136,0.15);
  font-family: var(--font-mono); font-size: 12px; font-weight: 500;
  color: var(--green); margin-bottom: 24px;
  letter-spacing: 0.5px; text-transform: uppercase;
}
.hero h1 {
  font-size: clamp(36px, 6vw, 72px); font-weight: 800;
  line-height: 1.05; letter-spacing: -2px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, var(--text) 0%, var(--text-dim) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.hero h1 .accent {
  background: linear-gradient(135deg, var(--green) 0%, var(--green-dim) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.hero p {
  font-size: 18px; color: var(--text-dim); max-width: 560px;
  margin: 0 auto 40px; line-height: 1.7;
}
.hero-cta {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 32px; border-radius: var(--radius);
  background: var(--green); color: var(--black);
  font-family: var(--font-display); font-size: 15px; font-weight: 600;
  border: none; cursor: pointer; text-decoration: none;
  transition: all var(--transition);
}
.hero-cta:hover { background: var(--green-dim); box-shadow: 0 0 30px var(--green-glow-strong); transform: translateY(-1px); }

/* ── Section ── */
.section {
  padding: 80px 32px;
  max-width: 1200px; margin: 0 auto;
}
.section-header {
  margin-bottom: 48px;
}
.section-label {
  font-family: var(--font-mono); font-size: 12px; font-weight: 500;
  color: var(--green); letter-spacing: 2px; text-transform: uppercase;
  margin-bottom: 12px;
}
.section-title {
  font-size: clamp(28px, 4vw, 42px); font-weight: 700;
  letter-spacing: -1px; line-height: 1.2;
}

/* ── Type Badge ── */
.type-badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 10px; border-radius: 10px; font-size: 10px;
  font-family: var(--font-mono); text-transform: uppercase;
  letter-spacing: 0.5px; font-weight: 600;
}
.type-badge.website { background: rgba(0,255,136,0.1); color: var(--green); }
.type-badge.app { background: rgba(88,166,255,0.1); color: #58a6ff; }
.type-badge.api { background: rgba(180,136,255,0.1); color: #b488ff; }
.type-badge.tool { background: rgba(255,170,0,0.1); color: #ffaa00; }

/* ── Filter Tabs ── */
.filter-bar {
  display: flex; gap: 6px; margin-bottom: 32px; flex-wrap: wrap;
}
.filter-tab {
  padding: 7px 18px; border-radius: 20px;
  font-family: var(--font-mono); font-size: 12px; font-weight: 500;
  color: var(--text-dim); background: var(--black-4);
  border: 1px solid var(--border); cursor: pointer;
  transition: all var(--transition); letter-spacing: 0.3px;
}
.filter-tab:hover { color: var(--text); border-color: var(--border-hover); }
.filter-tab.active {
  color: var(--green); background: var(--green-glow-subtle);
  border-color: rgba(0,255,136,0.25);
}
.filter-tab .count {
  display: inline-flex; align-items: center; justify-content: center;
  margin-left: 6px; min-width: 18px; height: 18px; padding: 0 5px;
  border-radius: 9px; font-size: 10px; font-weight: 700;
  background: var(--black-6); color: var(--text-muted);
}
.filter-tab.active .count {
  background: rgba(0,255,136,0.15); color: var(--green);
}

/* ── Directory Stats Row ── */
.dir-stats {
  display: flex; gap: 24px; margin-bottom: 8px;
  font-family: var(--font-mono); font-size: 12px; color: var(--text-muted);
}
.dir-stats span { display: flex; align-items: center; gap: 6px; }
.dir-stats .dot-live {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--green); box-shadow: 0 0 8px var(--green);
}
.dir-stats .dot-paused {
  width: 6px; height: 6px; border-radius: 50%;
  background: #ffaa00;
}

/* ── Services Grid ── */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}
.service-card {
  padding: 28px;
  background: var(--black-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition: all var(--transition);
  position: relative; overflow: hidden;
}
.service-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--green), transparent);
  opacity: 0; transition: opacity var(--transition);
}
.service-card:hover { border-color: var(--border-hover); transform: translateY(-2px); }
.service-card:hover::before { opacity: 1; }
.service-card h3 {
  font-size: 17px; font-weight: 600; margin-bottom: 8px;
  color: var(--text);
}
.service-card p { font-size: 14px; color: var(--text-dim); line-height: 1.6; }

/* ── Projects Grid ── */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
}
.project-card {
  background: var(--black-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden; transition: all var(--transition);
}
.project-card:hover { border-color: var(--border-hover); transform: translateY(-2px); }
.project-card-img {
  width: 100%; height: 180px; object-fit: cover;
  background: var(--black-5);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted); font-size: 13px;
  font-family: var(--font-mono);
}
.project-card-img img { width: 100%; height: 100%; object-fit: cover; }
.project-card-body { padding: 24px; }
.project-card-cat {
  font-family: var(--font-mono); font-size: 11px;
  color: var(--green); letter-spacing: 0.5px;
  text-transform: uppercase; margin-bottom: 8px;
}
.project-card-body h3 {
  font-size: 18px; font-weight: 600; margin-bottom: 8px;
}
.project-card-body p {
  font-size: 13px; color: var(--text-dim); line-height: 1.6;
  margin-bottom: 16px;
}
.project-card-footer {
  display: flex; align-items: center; justify-content: space-between;
}
.project-card-date {
  font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);
}
.project-card-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 500; color: var(--green);
  text-decoration: none; transition: all var(--transition);
}
.project-card-link:hover { color: var(--green-dim); gap: 8px; }
.project-status {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 2px 8px; border-radius: 10px; font-size: 10px;
  font-family: var(--font-mono); text-transform: uppercase;
  letter-spacing: 0.5px;
}
.project-status.active { background: rgba(0,255,136,0.1); color: var(--green); }
.project-status.active::before {
  content: ''; width: 5px; height: 5px; border-radius: 50%;
  background: var(--green);
}
.project-status.paused { background: rgba(255,170,0,0.1); color: #ffaa00; }
.project-status.paused::before {
  content: ''; width: 5px; height: 5px; border-radius: 50%;
  background: #ffaa00;
}

/* ── Footer ── */
.footer {
  padding: 40px 32px;
  border-top: 1px solid var(--border);
  text-align: center;
  font-size: 13px; color: var(--text-muted);
}
.footer a { color: var(--green); text-decoration: none; }

/* ── Privacy Page ── */
.privacy-page { padding: 100px 32px 80px; max-width: 800px; margin: 0 auto; }
.privacy-page h1 {
  font-size: 36px; font-weight: 700; margin-bottom: 8px; letter-spacing: -1px;
}
.privacy-page .updated {
  font-family: var(--font-mono); font-size: 12px; color: var(--text-muted);
  margin-bottom: 48px;
}
.privacy-section { margin-bottom: 40px; }
.privacy-section h2 {
  font-size: 20px; font-weight: 600; margin-bottom: 12px; color: var(--text);
}
.privacy-section p, .privacy-section li {
  font-size: 14px; color: var(--text-dim); line-height: 1.8;
  margin-bottom: 8px;
}
.privacy-section ul { padding-left: 20px; list-style: none; }
.privacy-section ul li::before {
  content: '—'; color: var(--green); margin-right: 8px;
}

/* ── Admin Dashboard ── */
.admin-page { padding: 88px 32px 60px; max-width: 1200px; margin: 0 auto; }
.admin-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 32px; flex-wrap: wrap; gap: 16px;
}
.admin-header h1 { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px; margin-bottom: 32px;
}
.stat-card {
  padding: 24px;
  background: var(--black-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}
.stat-card-icon {
  width: 36px; height: 36px; border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 12px;
}
.stat-card-icon.green { background: var(--green-glow-subtle); color: var(--green); }
.stat-card-icon.blue { background: rgba(88,166,255,0.1); color: #58a6ff; }
.stat-card-icon.purple { background: rgba(180,136,255,0.1); color: #b488ff; }
.stat-card-icon.amber { background: rgba(255,170,0,0.1); color: #ffaa00; }
.stat-card .stat-value {
  font-size: 28px; font-weight: 700; font-family: var(--font-mono);
  letter-spacing: -1px; margin-bottom: 4px;
}
.stat-card .stat-label {
  font-size: 12px; color: var(--text-muted);
  font-family: var(--font-mono); text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ── Chart ── */
.chart-container {
  background: var(--black-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px; margin-bottom: 24px;
}
.chart-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 24px; flex-wrap: wrap; gap: 12px;
}
.chart-header h3 { font-size: 16px; font-weight: 600; }
.chart-legend {
  display: flex; gap: 16px; font-size: 12px; color: var(--text-dim);
}
.chart-legend span { display: flex; align-items: center; gap: 6px; }
.chart-legend .dot-green { width: 8px; height: 8px; border-radius: 50%; background: var(--green); }
.chart-legend .dot-dim { width: 8px; height: 8px; border-radius: 50%; background: var(--text-muted); }
.chart-legend .dot-blue { width: 8px; height: 8px; border-radius: 2px; background: #58a6ff; }

.chart-range-picker {
  display: flex; gap: 4px;
}
.chart-range-btn {
  padding: 4px 12px; border-radius: 12px;
  font-family: var(--font-mono); font-size: 11px; font-weight: 500;
  color: var(--text-muted); background: var(--black-5);
  border: 1px solid var(--border); cursor: pointer;
  transition: all var(--transition);
}
.chart-range-btn:hover { color: var(--text); }
.chart-range-btn.active {
  color: var(--green); background: var(--green-glow-subtle);
  border-color: rgba(0,255,136,0.25);
}

/* Bar + Line hybrid chart */
.chart-area {
  position: relative; height: 220px;
  display: flex; align-items: flex-end; gap: 2px;
  padding: 0 4px;
}
.chart-col {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; height: 100%; justify-content: flex-end;
  position: relative; min-width: 0;
}
.chart-bar-stack {
  width: 100%; max-width: 32px; display: flex; flex-direction: column;
  align-items: center; gap: 2px; justify-content: flex-end; flex: 1;
}
.chart-bar {
  width: 100%; border-radius: 3px 3px 0 0; min-height: 2px;
  transition: all 0.4s ease; cursor: pointer; position: relative;
}
.chart-bar.visitors { background: var(--green); opacity: 0.6; }
.chart-bar.visitors:hover { opacity: 1; }
.chart-bar.clicks { background: #58a6ff; opacity: 0.6; }
.chart-bar.clicks:hover { opacity: 1; }
.chart-bar-label {
  font-family: var(--font-mono); font-size: 9px; color: var(--text-muted);
  margin-top: 6px; white-space: nowrap; text-align: center;
}
.chart-tooltip {
  position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
  padding: 6px 10px; background: var(--black-2); border: 1px solid var(--border);
  border-radius: var(--radius); font-family: var(--font-mono); font-size: 10px;
  color: var(--text); white-space: nowrap; pointer-events: none; z-index: 10;
  margin-bottom: 4px;
}

/* Line overlay on chart */
.chart-line-svg {
  position: absolute; inset: 0; pointer-events: none;
}

/* Recent visitors table */
.recent-visitors {
  background: var(--black-3); border: 1px solid var(--border);
  border-radius: var(--radius-lg); margin-bottom: 24px; overflow: hidden;
}
.recent-visitors-header {
  padding: 16px 20px; border-bottom: 1px solid var(--border);
  font-size: 15px; font-weight: 600;
}
.rv-row {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 20px; border-bottom: 1px solid var(--border);
  font-size: 12px; transition: background var(--transition);
}
.rv-row:last-child { border-bottom: none; }
.rv-row:hover { background: var(--black-4); }
.rv-time { font-family: var(--font-mono); color: var(--text-muted); min-width: 140px; font-size: 11px; }
.rv-page { color: var(--green); font-family: var(--font-mono); min-width: 80px; }
.rv-device { color: var(--text-dim); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rv-screen { font-family: var(--font-mono); color: var(--text-muted); font-size: 10px; }

/* ── Admin Projects Table ── */
.admin-table-wrap {
  background: var(--black-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.admin-table-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}
.admin-table-header h3 { font-size: 16px; font-weight: 600; }

.btn-green {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: var(--radius);
  background: var(--green); color: var(--black);
  font-family: var(--font-display); font-size: 13px; font-weight: 600;
  border: none; cursor: pointer; transition: all var(--transition);
}
.btn-green:hover { background: var(--green-dim); }
.btn-ghost {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: var(--radius);
  background: var(--black-5); color: var(--text-dim);
  font-family: var(--font-display); font-size: 13px; font-weight: 500;
  border: 1px solid var(--border); cursor: pointer; transition: all var(--transition);
}
.btn-ghost:hover { color: var(--text); border-color: var(--border-hover); }
.btn-danger {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 6px 12px; border-radius: var(--radius);
  background: var(--danger-dim); color: var(--danger);
  font-family: var(--font-display); font-size: 12px; font-weight: 500;
  border: none; cursor: pointer; transition: all var(--transition);
}
.btn-danger:hover { background: rgba(255,68,68,0.25); }

.admin-project-row {
  display: flex; align-items: center; gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border);
  transition: background var(--transition);
}
.admin-project-row:last-child { border-bottom: none; }
.admin-project-row:hover { background: var(--black-4); }
.admin-project-thumb {
  width: 48px; height: 48px; border-radius: var(--radius);
  background: var(--black-5); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; color: var(--text-muted);
}
.admin-project-thumb img { width: 100%; height: 100%; object-fit: cover; }
.admin-project-info { flex: 1; min-width: 0; }
.admin-project-info h4 {
  font-size: 14px; font-weight: 600;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.admin-project-info p {
  font-size: 12px; color: var(--text-muted);
  font-family: var(--font-mono);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.admin-project-actions { display: flex; gap: 8px; flex-shrink: 0; }

/* ── Modal ── */
.modal-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal {
  background: var(--black-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  width: 100%; max-width: 520px;
  max-height: 90vh; overflow-y: auto;
  animation: slideUp 0.3s ease;
}
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } }
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}
.modal-header h2 { font-size: 18px; font-weight: 600; }
.modal-header button {
  background: none; border: none; color: var(--text-dim);
  cursor: pointer; display: flex; padding: 4px;
}
.modal-header button:hover { color: var(--text); }
.modal-body { padding: 24px; }
.modal-footer {
  display: flex; gap: 12px; justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
}

/* ── Form ── */
.field { margin-bottom: 16px; }
.field label {
  display: block; font-size: 12px; font-weight: 500;
  color: var(--text-dim); margin-bottom: 6px;
  font-family: var(--font-mono); text-transform: uppercase;
  letter-spacing: 0.5px;
}
.field input, .field textarea, .field select {
  width: 100%; padding: 10px 14px;
  background: var(--black-5); border: 1px solid var(--border);
  border-radius: var(--radius); color: var(--text);
  font-family: var(--font-display); font-size: 14px;
  outline: none; transition: border-color var(--transition);
}
.field input:focus, .field textarea:focus, .field select:focus {
  border-color: var(--green-dark);
}
.field textarea { resize: vertical; min-height: 80px; }
.field select { cursor: pointer; }
.field select option { background: var(--black-3); }

.image-upload-zone {
  border: 2px dashed var(--border);
  border-radius: var(--radius-lg);
  padding: 32px; text-align: center;
  cursor: pointer; transition: all var(--transition);
}
.image-upload-zone:hover { border-color: var(--green-dark); background: var(--green-glow-subtle); }
.image-upload-zone .upload-icon {
  color: var(--text-muted); margin-bottom: 8px;
  display: flex; justify-content: center;
}
.image-upload-zone p { font-size: 13px; color: var(--text-muted); }
.image-upload-zone .file-types { font-size: 11px; color: var(--text-muted); margin-top: 4px; }
.image-upload-preview {
  position: relative; display: inline-block;
}
.image-upload-preview img {
  max-width: 100%; max-height: 160px; border-radius: var(--radius);
  border: 1px solid var(--border);
}
.image-upload-preview button {
  position: absolute; top: -6px; right: -6px;
  width: 24px; height: 24px; border-radius: 50%;
  background: var(--danger); border: none; color: white;
  cursor: pointer; display: flex; align-items: center;
  justify-content: center; font-size: 12px;
}

/* ── Messenger Panel ── */
.messenger-overlay {
  position: fixed; inset: 0; z-index: 150;
  background: rgba(0,0,0,0.5);
  animation: fadeIn 0.15s ease;
}
.messenger-panel {
  position: fixed; top: 0; right: 0; bottom: 0;
  width: 400px; max-width: 100vw; z-index: 151;
  background: var(--black-2);
  border-left: 1px solid var(--border);
  display: flex; flex-direction: column;
  animation: slideInRight 0.3s ease;
}
@keyframes slideInRight { from { transform: translateX(100%); } }

.messenger-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.messenger-header h3 { font-size: 16px; font-weight: 600; }
.messenger-header button {
  background: none; border: none; color: var(--text-dim);
  cursor: pointer; display: flex; padding: 4px;
}
.messenger-header button:hover { color: var(--text); }

.messenger-body {
  flex: 1; overflow-y: auto; padding: 20px;
  display: flex; flex-direction: column; gap: 16px;
}
.msg {
  max-width: 85%; padding: 12px 16px;
  border-radius: var(--radius-lg);
  font-size: 14px; line-height: 1.5;
  position: relative;
}
.msg.sent {
  align-self: flex-end;
  background: var(--green); color: var(--black);
  border-bottom-right-radius: 4px;
}
.msg.received {
  align-self: flex-start;
  background: var(--black-5); color: var(--text);
  border: 1px solid var(--border);
  border-bottom-left-radius: 4px;
}
.msg-time {
  font-family: var(--font-mono); font-size: 10px;
  margin-top: 4px; opacity: 0.6;
}
.msg.sent .msg-time { color: var(--black); }
.msg-image {
  max-width: 100%; border-radius: var(--radius);
  margin-bottom: 6px; cursor: pointer;
}

.messenger-input-area {
  padding: 12px 16px; border-top: 1px solid var(--border);
  flex-shrink: 0;
}
.messenger-input-row {
  display: flex; gap: 8px; align-items: flex-end;
}
.messenger-input-row input {
  flex: 1; padding: 10px 14px;
  background: var(--black-5); border: 1px solid var(--border);
  border-radius: var(--radius); color: var(--text);
  font-family: var(--font-display); font-size: 14px;
  outline: none;
}
.messenger-input-row input:focus { border-color: var(--green-dark); }
.messenger-input-row .btn-attach {
  display: flex; align-items: center; justify-content: center;
  width: 38px; height: 38px; border-radius: var(--radius);
  background: var(--black-5); border: 1px solid var(--border);
  color: var(--text-dim); cursor: pointer;
  flex-shrink: 0; transition: all var(--transition);
}
.messenger-input-row .btn-attach:hover { color: var(--green); border-color: var(--green-dark); }
.messenger-input-row .btn-send {
  display: flex; align-items: center; justify-content: center;
  width: 38px; height: 38px; border-radius: var(--radius);
  background: var(--green); border: none;
  color: var(--black); cursor: pointer;
  flex-shrink: 0; transition: all var(--transition);
}
.messenger-input-row .btn-send:hover { background: var(--green-dim); }
.msg-img-preview {
  padding: 8px 16px 0;
  display: flex; align-items: center; gap: 8px;
}
.msg-img-preview img {
  height: 40px; width: 40px; object-fit: cover;
  border-radius: 4px; border: 1px solid var(--border);
}
.msg-img-preview button {
  background: none; border: none; color: var(--text-muted);
  cursor: pointer; font-size: 11px;
}

/* ── Login Modal ── */
.login-content { text-align: center; padding: 32px 24px; }
.login-avatar {
  width: 64px; height: 64px; border-radius: 50%;
  background: var(--green-glow-subtle); border: 2px solid var(--green);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px; color: var(--green);
}
.login-content h2 { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
.login-content p { font-size: 13px; color: var(--text-dim); margin-bottom: 24px; }
.login-content .field { text-align: left; }
.login-btn {
  width: 100%; padding: 12px; border-radius: var(--radius);
  background: var(--green); color: var(--black);
  font-family: var(--font-display); font-size: 14px; font-weight: 600;
  border: none; cursor: pointer; margin-top: 8px;
  transition: all var(--transition);
}
.login-btn:hover { background: var(--green-dim); }

/* ── Animation classes ── */
.fade-in { animation: fadeIn 0.4s ease; }
.slide-up { animation: slideUp 0.5s ease; }

/* ── Donate Bar ── */
.donate-bar {
  display: flex; align-items: center; gap: 10px;
  flex-wrap: wrap;
}
.donate-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 18px; border-radius: var(--radius);
  font-family: var(--font-display); font-size: 13px; font-weight: 600;
  border: 1px solid var(--border); cursor: pointer;
  transition: all var(--transition); text-decoration: none;
}
.donate-btn.coffee {
  background: #ffdd00; color: #1a1a1a; border-color: #ffdd00;
}
.donate-btn.coffee:hover { background: #e6c700; box-shadow: 0 0 16px rgba(255,221,0,0.25); }
.donate-btn.btc {
  background: rgba(247,147,26,0.1); color: #f7931a; border-color: rgba(247,147,26,0.3);
}
.donate-btn.btc:hover { background: rgba(247,147,26,0.2); box-shadow: 0 0 16px rgba(247,147,26,0.2); }
.donate-btn.xmr {
  background: rgba(255,102,0,0.1); color: #ff6600; border-color: rgba(255,102,0,0.3);
}
.donate-btn.xmr:hover { background: rgba(255,102,0,0.2); box-shadow: 0 0 16px rgba(255,102,0,0.2); }

/* ── Donate Modal ── */
.crypto-address-box {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 14px; background: var(--black-5);
  border: 1px solid var(--border); border-radius: var(--radius);
  margin-top: 8px; margin-bottom: 16px;
}
.crypto-address-box code {
  flex: 1; font-family: var(--font-mono); font-size: 11px;
  color: var(--text); word-break: break-all; line-height: 1.5;
}
.crypto-address-box button {
  padding: 4px 10px; border-radius: 4px;
  background: var(--green-glow-subtle); color: var(--green);
  border: 1px solid rgba(0,255,136,0.2);
  font-size: 11px; font-weight: 600; cursor: pointer;
  font-family: var(--font-mono); white-space: nowrap;
  transition: all var(--transition);
}
.crypto-address-box button:hover { background: var(--green-glow); }

/* ── Media Section ── */
.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}
.media-card {
  background: var(--black-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition);
}
.media-card:hover { border-color: var(--border-hover); transform: translateY(-2px); }
.media-card-visual {
  width: 100%; height: 200px; background: var(--black-5);
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}
.media-card-visual img {
  width: 100%; height: 100%; object-fit: cover;
}
.media-card-visual iframe {
  width: 100%; height: 100%; border: none;
}
.media-card-visual video {
  width: 100%; height: 100%; object-fit: cover;
}
.media-card-visual .placeholder {
  display: flex; flex-direction: column; align-items: center;
  gap: 6px; color: var(--text-muted); font-size: 12px;
  font-family: var(--font-mono);
}
.media-card-body { padding: 20px; }
.media-card-type {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 10px; border-radius: 10px; font-size: 10px;
  font-family: var(--font-mono); text-transform: uppercase;
  letter-spacing: 0.5px; font-weight: 600;
  margin-bottom: 8px;
}
.media-card-type.youtube { background: rgba(255,0,0,0.1); color: #ff4444; }
.media-card-type.image { background: rgba(0,255,136,0.1); color: var(--green); }
.media-card-type.video { background: rgba(88,166,255,0.1); color: #58a6ff; }
.media-card-type.info { background: rgba(180,136,255,0.1); color: #b488ff; }
.media-card-body h3 { font-size: 16px; font-weight: 600; margin-bottom: 6px; }
.media-card-body p { font-size: 13px; color: var(--text-dim); line-height: 1.6; margin-bottom: 10px; }
.media-card-date {
  font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);
}

/* ── Media Modal (admin) ── */
.media-type-selector {
  display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px;
}
.media-type-btn {
  padding: 6px 14px; border-radius: 16px;
  font-family: var(--font-mono); font-size: 11px; font-weight: 500;
  color: var(--text-dim); background: var(--black-5);
  border: 1px solid var(--border); cursor: pointer;
  transition: all var(--transition);
}
.media-type-btn:hover { color: var(--text); border-color: var(--border-hover); }
.media-type-btn.active {
  color: var(--green); background: var(--green-glow-subtle);
  border-color: rgba(0,255,136,0.25);
}

/* ── Empty State ── */
.empty-state {
  text-align: center; padding: 60px 20px;
  color: var(--text-muted);
}
.empty-state p { font-size: 14px; margin-top: 8px; }

/* ── Toast Notifications ── */
.toast-container {
  position: fixed; top: 76px; right: 16px; z-index: 300;
  display: flex; flex-direction: column; gap: 8px;
  pointer-events: none;
}
.toast {
  padding: 12px 20px; border-radius: var(--radius-lg);
  font-family: var(--font-display); font-size: 13px; font-weight: 500;
  pointer-events: auto; animation: toastIn 0.3s ease, toastOut 0.3s ease 3.5s forwards;
  display: flex; align-items: center; gap: 8px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.4);
  max-width: 360px;
}
.toast.success { background: rgba(0,255,136,0.15); border: 1px solid rgba(0,255,136,0.3); color: var(--green); }
.toast.error { background: rgba(255,68,68,0.15); border: 1px solid rgba(255,68,68,0.3); color: var(--danger); }
.toast.info { background: rgba(88,166,255,0.15); border: 1px solid rgba(88,166,255,0.3); color: #58a6ff; }
.toast.warn { background: rgba(255,170,0,0.15); border: 1px solid rgba(255,170,0,0.3); color: #ffaa00; }
@keyframes toastIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
@keyframes toastOut { from { opacity: 1; } to { opacity: 0; transform: translateY(-10px); } }

/* ── Connection Status Badge ── */
.conn-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 12px; border-radius: 16px;
  font-family: var(--font-mono); font-size: 11px; font-weight: 600;
  letter-spacing: 0.3px;
}
.conn-badge.connected { background: rgba(0,255,136,0.1); color: var(--green); border: 1px solid rgba(0,255,136,0.2); }
.conn-badge.disconnected { background: rgba(255,68,68,0.1); color: var(--danger); border: 1px solid rgba(255,68,68,0.2); }
.conn-badge.local { background: rgba(255,170,0,0.1); color: #ffaa00; border: 1px solid rgba(255,170,0,0.2); }
.conn-dot { width: 6px; height: 6px; border-radius: 50%; }
.conn-badge.connected .conn-dot { background: var(--green); box-shadow: 0 0 6px var(--green); }
.conn-badge.disconnected .conn-dot { background: var(--danger); }
.conn-badge.local .conn-dot { background: #ffaa00; }

/* ── Deleted Status ── */
.project-status.deleted { background: rgba(255,68,68,0.1); color: var(--danger); }
.project-status.deleted::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: var(--danger); }

/* ── Activity Log ── */
.activity-row {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 12px 24px; border-bottom: 1px solid var(--border);
  font-size: 13px;
}
.activity-row:last-child { border-bottom: none; }
.activity-dot {
  width: 8px; height: 8px; border-radius: 50%; margin-top: 6px; flex-shrink: 0;
}
.activity-dot.created { background: var(--green); }
.activity-dot.updated { background: #58a6ff; }
.activity-dot.deleted { background: var(--danger); }
.activity-dot.restored { background: #b488ff; }
.activity-time {
  font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); margin-top: 2px;
}

/* ── Media Carousel ── */
.media-carousel-wrap { position: relative; }
.media-carousel {
  display: flex; gap: 16px; overflow-x: auto;
  scroll-behavior: smooth; scroll-snap-type: x mandatory;
  -ms-overflow-style: none; scrollbar-width: none;
  padding-bottom: 4px;
}
.media-carousel::-webkit-scrollbar { display: none; }
.media-carousel .media-card {
  min-width: 340px; max-width: 340px;
  scroll-snap-align: start; flex-shrink: 0;
}
@media (max-width: 768px) {
  .media-carousel .media-card { min-width: 280px; max-width: 280px; }
}
.carousel-arrow {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--black-3); border: 1px solid var(--border);
  color: var(--text-dim); cursor: pointer; z-index: 5;
  display: flex; align-items: center; justify-content: center;
  transition: all var(--transition); font-size: 18px;
  font-family: var(--font-mono);
}
.carousel-arrow:hover { color: var(--green); border-color: var(--green-dark); background: var(--green-glow-subtle); }
.carousel-arrow.left { left: -12px; }
.carousel-arrow.right { right: -12px; }
.carousel-track {
  width: 100%; height: 3px; background: var(--black-5);
  border-radius: 2px; margin-top: 12px; overflow: hidden;
}
.carousel-track-fill {
  height: 100%; background: var(--green); border-radius: 2px;
  transition: width 0.3s ease;
}

/* ── Reply Modal ── */
.reply-modal-recipient {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 16px; background: var(--black-5);
  border-radius: var(--radius-lg); margin-bottom: 16px;
  border: 1px solid var(--border);
}
.reply-modal-recipient .avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--green-glow-subtle); display: flex;
  align-items: center; justify-content: center; color: var(--green);
  flex-shrink: 0;
}
.reply-modal-original {
  padding: 12px 14px; background: var(--black-5);
  border-left: 3px solid var(--green-dark);
  border-radius: 0 var(--radius) var(--radius) 0;
  margin-bottom: 16px; font-size: 13px; color: var(--text-dim);
  line-height: 1.6;
}
.reply-modal-original .label {
  font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;
}
.reply-textarea {
  width: 100%; min-height: 120px; padding: 12px 14px;
  background: var(--black-5); border: 1px solid var(--border);
  border-radius: var(--radius); color: var(--text);
  font-family: var(--font-display); font-size: 14px;
  outline: none; resize: vertical; line-height: 1.6;
}
.reply-textarea:focus { border-color: var(--green-dark); }
.reply-mode-info {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 14px; border-radius: var(--radius);
  font-size: 12px; margin-bottom: 16px;
}
.reply-mode-info.email-mode {
  background: rgba(88,166,255,0.08); border: 1px solid rgba(88,166,255,0.2); color: #58a6ff;
}
.reply-mode-info.qa-mode {
  background: var(--green-glow-subtle); border: 1px solid rgba(0,255,136,0.15); color: var(--green);
}
.copy-success {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 12px; color: var(--green); font-weight: 600;
}

/* ── Inbox Message Actions ── */
.msg-actions {
  display: flex; gap: 6px; flex-shrink: 0;
}
.msg-status-badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 2px 8px; border-radius: 10px; font-size: 10px;
  font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.5px;
}
.msg-status-badge.saved { background: rgba(0,255,136,0.1); color: var(--green); }
.msg-status-badge.disregarded { background: rgba(255,170,0,0.1); color: #ffaa00; }
.msg-status-badge.replied { background: rgba(88,166,255,0.1); color: #58a6ff; }

.inline-reply-box {
  display: flex; gap: 8px; padding: 8px 0 0 44px; width: 100%;
}
.inline-reply-box input {
  flex: 1; padding: 8px 12px; background: var(--black-5);
  border: 1px solid var(--border); border-radius: var(--radius);
  color: var(--text); font-family: var(--font-display); font-size: 13px; outline: none;
}
.inline-reply-box input:focus { border-color: var(--green-dark); }

/* ── Q&A Page ── */
.qa-page { padding: 100px 32px 80px; max-width: 800px; margin: 0 auto; }
.qa-page h1 { font-size: 36px; font-weight: 700; margin-bottom: 8px; letter-spacing: -1px; }
.qa-page .subtitle { font-size: 15px; color: var(--text-dim); margin-bottom: 48px; }

.qa-card {
  background: var(--black-3); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 24px; margin-bottom: 16px;
  transition: all var(--transition);
}
.qa-card:hover { border-color: var(--border-hover); }
.qa-question {
  font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 8px;
  display: flex; align-items: flex-start; gap: 10px;
}
.qa-question .q-mark {
  display: flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; border-radius: 50%;
  background: var(--green-glow-subtle); color: var(--green);
  font-family: var(--font-mono); font-size: 13px; font-weight: 700;
  flex-shrink: 0; margin-top: 1px;
}
.qa-answer {
  padding-left: 34px; font-size: 14px; color: var(--text-dim);
  line-height: 1.7; margin-top: 8px;
}
.qa-answer .a-mark {
  display: inline-flex; align-items: center; justify-content: center;
  width: 20px; height: 20px; border-radius: 50%;
  background: rgba(88,166,255,0.1); color: #58a6ff;
  font-family: var(--font-mono); font-size: 11px; font-weight: 700;
  margin-right: 8px; flex-shrink: 0;
}
.qa-meta {
  padding-left: 34px; margin-top: 10px;
  font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);
}
.qa-empty {
  text-align: center; padding: 80px 20px; color: var(--text-muted);
}
`;

// ═══════════════════════════════════════════════════
//  COMPONENTS
// ═══════════════════════════════════════════════════

// ─── Toast Notifications ───
function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          {t.type === "success" ? "✓" : t.type === "error" ? "✕" : t.type === "warn" ? "⚠" : "ℹ"} {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── Reply Modal ───
function ReplyModal({ open, onClose, message, onSendReply }) {
  const [replyText, setReplyText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) { setReplyText(""); setCopied(false); }
  }, [open]);

  if (!open || !message) return null;

  const hasEmail = !!message.email;

  const handleCopyDraft = () => {
    const draft = `To: ${message.email}\nSubject: Re: Your message to NullSpace Studio\n\n${replyText}\n\n---\nOriginal message: "${message.text}"`;
    navigator.clipboard.writeText(draft).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleSend = () => {
    if (!replyText.trim()) return;
    onSendReply(message, replyText.trim(), hasEmail);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
        <div className="modal-header">
          <h2>Reply to Message</h2>
          <button onClick={onClose}>{Icons.x}</button>
        </div>
        <div className="modal-body">
          {/* Recipient */}
          <div className="reply-modal-recipient">
            <div className="avatar">{Icons.user}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{message.email || "Anonymous Visitor"}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{message.time}</div>
            </div>
          </div>

          {/* Original message */}
          <div className="reply-modal-original">
            <div className="label">Their message</div>
            {message.text}
          </div>

          {/* Mode indicator */}
          {hasEmail ? (
            <div className="reply-mode-info email-mode">
              {Icons.send} This will create a draft for you to copy and send via your email
            </div>
          ) : (
            <div className="reply-mode-info qa-mode">
              {Icons.message} No email — your reply will be posted publicly on the Q&A page
            </div>
          )}

          {/* Reply textarea */}
          <textarea
            className="reply-textarea"
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder={hasEmail ? "Write your reply..." : "Write your answer (will appear on Q&A page)..."}
            autoFocus
          />
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          {hasEmail ? (
            <>
              <button className="btn-ghost" onClick={handleCopyDraft} disabled={!replyText.trim()}>
                {copied ? <span className="copy-success">✓ Copied!</span> : "Copy Draft"}
              </button>
              <button className="btn-green" onClick={handleSend} disabled={!replyText.trim()}>
                {Icons.send} Mark as Replied
              </button>
            </>
          ) : (
            <button className="btn-green" onClick={handleSend} disabled={!replyText.trim()}>
              {Icons.send} Post to Q&A
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Messenger Panel ───
function MessengerPanel({ open, onClose, onVisitorMessage }) {
  const [messages, setMessages] = useState([
    {
      id: uid(), text: "Welcome to NullSpace Studio! Got questions about any of our projects or want to collaborate? Drop us a message and leave your email so we can get back to you.",
      sender: "system", time: now(), image: null
    }
  ]);
  const [input, setInput] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [pendingImage, setPendingImage] = useState(null);
  const bodyRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages]);

  const send = () => {
    if (!input.trim() && !pendingImage) return;
    const newMsg = {
      id: uid(), text: input.trim(), sender: "user",
      time: now(), image: pendingImage
    };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setPendingImage(null);

    // Forward to admin inbox with email
    if (onVisitorMessage) {
      onVisitorMessage({ id: uid(), email: visitorEmail, text: newMsg.text, time: newMsg.time, image: newMsg.image });
    }

    // Auto-reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: uid(),
        text: "Thanks for reaching out to NullSpace Studio! We've received your message and will get back to you shortly.",
        sender: "system", time: now(), image: null
      }]);
    }, 1200);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPendingImage(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  if (!open) return null;

  return (
    <>
      <div className="messenger-overlay" onClick={onClose} />
      <div className="messenger-panel">
        <div className="messenger-header">
          <h3>Messages</h3>
          <button onClick={onClose}>{Icons.x}</button>
        </div>

        {/* Email prompt bar */}
        {!emailSubmitted ? (
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--black-3)" }}>
            <label style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>
              Your email (so we can reply)
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="email" value={visitorEmail}
                onChange={e => setVisitorEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ flex: 1, padding: "8px 12px", background: "var(--black-5)", border: "1px solid var(--border)", borderRadius: "var(--radius)", color: "var(--text)", fontFamily: "var(--font-display)", fontSize: 13, outline: "none" }}
                onKeyDown={e => { if (e.key === "Enter" && visitorEmail.trim()) setEmailSubmitted(true); }}
              />
              <button
                className="btn-green"
                style={{ fontSize: 12, padding: "8px 14px" }}
                onClick={() => { if (visitorEmail.trim()) setEmailSubmitted(true); }}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: "8px 16px", borderBottom: "1px solid var(--border)", background: "var(--black-3)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-dim)" }}>
              {visitorEmail}
            </span>
            <button
              style={{ fontSize: 11, color: "var(--green)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-mono)" }}
              onClick={() => setEmailSubmitted(false)}
            >
              Edit
            </button>
          </div>
        )}

        <div className="messenger-body" ref={bodyRef}>
          {messages.map((m) => (
            <div key={m.id} className={`msg ${m.sender === "user" ? "sent" : "received"}`}>
              {m.image && <img src={m.image} className="msg-image" alt="attachment" />}
              {m.text && <div>{m.text}</div>}
              <div className="msg-time">{m.time}</div>
            </div>
          ))}
        </div>
        {pendingImage && (
          <div className="msg-img-preview">
            <img src={pendingImage} alt="preview" />
            <button onClick={() => setPendingImage(null)}>Remove</button>
          </div>
        )}
        <div className="messenger-input-area">
          <div className="messenger-input-row">
            <input
              type="file" ref={fileRef} accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            <button className="btn-attach" onClick={() => fileRef.current?.click()}>
              {Icons.image}
            </button>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Type a message..."
            />
            <button className="btn-send" onClick={send}>
              {Icons.send}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Login Modal (Passkey → Email/Password two-step) ───
function LoginModal({ open, onClose, onPasskey, onLogin, isLoggedIn, onLogout, step, error, passkeyError }) {
  const [passkey, setPasskey] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Reset fields when modal opens/closes
  useEffect(() => {
    if (!open) { setPasskey(""); setEmail(""); setPassword(""); }
  }, [open]);

  if (!open) return null;

  // Already logged in — show sign out
  if (isLoggedIn) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="login-content">
            <div className="login-avatar">{Icons.user}</div>
            <h2>Admin Account</h2>
            <p style={{ marginBottom: 16 }}>You are currently logged in as admin.</p>
            <button className="login-btn" onClick={onLogout}>Sign Out</button>
            <button className="btn-ghost" style={{ width: "100%", marginTop: 8, justifyContent: "center" }} onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Passkey
  if (step === "passkey") {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="login-content">
            <div className="login-avatar">{Icons.lock}</div>
            <h2>Access Code</h2>
            <p>Enter the passkey to continue</p>
            <div className="field">
              <label>Passkey</label>
              <input
                type="password" value={passkey}
                onChange={e => setPasskey(e.target.value)}
                placeholder="Enter passkey"
                onKeyDown={e => e.key === "Enter" && onPasskey(passkey)}
                autoFocus
              />
            </div>
            <button className="login-btn" onClick={() => onPasskey(passkey)}>
              Continue
            </button>
            {passkeyError && (
              <p style={{ fontSize: 12, color: "var(--danger)", marginTop: 12, fontWeight: 500 }}>
                Incorrect passkey.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Email + Password
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="login-content">
          <div className="login-avatar" style={{ borderColor: "var(--green)" }}>{Icons.user}</div>
          <h2>Admin Login</h2>
          <p>Verify your identity</p>
          <div className="field">
            <label>Email</label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoFocus
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              onKeyDown={e => e.key === "Enter" && onLogin(email, password)}
            />
          </div>
          <button className="login-btn" onClick={() => onLogin(email, password)}>
            Sign In
          </button>
          {error && (
            <p style={{ fontSize: 12, color: "var(--danger)", marginTop: 12, fontWeight: 500 }}>
              Invalid email or password. Try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Add/Edit Project Modal ───
function ProjectModal({ open, onClose, onSave, editProject }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("website");
  const [status, setStatus] = useState("active");
  const [image, setImage] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (editProject) {
      setTitle(editProject.title);
      setDescription(editProject.description);
      setUrl(editProject.url);
      setCategory(editProject.category);
      setType(editProject.type || "website");
      setStatus(editProject.status);
      setImage(editProject.image);
    } else {
      setTitle(""); setDescription(""); setUrl(""); setCategory(""); setType("website"); setStatus("active"); setImage(null);
    }
  }, [editProject, open]);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: editProject?.id || uid(),
      title, description, url, category, type, status, image,
      dateAdded: editProject?.dateAdded || now()
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editProject ? "Edit Project" : "Add New Project"}</h2>
          <button onClick={onClose}>{Icons.x}</button>
        </div>
        <div className="modal-body">
          <div className="field">
            <label>Project Name *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter project name" />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of the project" />
          </div>
          <div className="field">
            <label>URL</label>
            <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" />
          </div>
          <div className="field">
            <label>Category Label</label>
            <input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Web App, API, Tool" />
          </div>
          <div className="field">
            <label>Type</label>
            <select value={type} onChange={e => setType(e.target.value)}>
              <option value="website">Website</option>
              <option value="app">App</option>
              <option value="api">API</option>
              <option value="tool">Tool</option>
            </select>
          </div>
          <div className="field">
            <label>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </div>
          <div className="field">
            <label>Project Image</label>
            <input type="file" ref={fileRef} accept="image/*" style={{ display: "none" }} onChange={handleImage} />
            {image ? (
              <div className="image-upload-preview">
                <img src={image} alt="preview" />
                <button onClick={() => setImage(null)}>×</button>
              </div>
            ) : (
              <div className="image-upload-zone" onClick={() => fileRef.current?.click()}>
                <div className="upload-icon">{Icons.upload}</div>
                <p>Click to upload an image</p>
                <div className="file-types">PNG, JPG, GIF up to 10MB</div>
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-green" onClick={handleSave}>
            {editProject ? "Save Changes" : "Add Project"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Analytics Chart (Bar + Line with date range) ───
function AnalyticsChart({ data, range, onRangeChange }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const ranges = [{ key: 7, label: "7D" }, { key: 30, label: "30D" }, { key: 90, label: "90D" }];

  const totalViews = data ? data.reduce((s, d) => s + d.visitors, 0) : 0;
  const totalClicks = data ? data.reduce((s, d) => s + d.clicks, 0) : 0;
  const hasData = totalViews > 0 || totalClicks > 0;

  if (!data || data.length === 0 || !hasData) {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h3>Traffic</h3>
          <div className="chart-range-picker">
            {ranges.map(r => (
              <button key={r.key} className={`chart-range-btn ${range === r.key ? "active" : ""}`} onClick={() => onRangeChange(r.key)}>{r.label}</button>
            ))}
          </div>
        </div>
        <div className="empty-state" style={{ padding: "40px 20px" }}>
          <p>No traffic data for this period.</p>
        </div>
      </div>
    );
  }

  const maxVal = Math.max(...data.map(d => Math.max(d.visitors, d.clicks)), 1);
  // Only draw line if at least 2 days have data
  const daysWithData = data.filter(d => d.visitors > 0).length;
  const showLine = daysWithData >= 2;
  const linePoints = showLine ? data.map((d, i) => {
    const x = (i / Math.max(data.length - 1, 1)) * 100;
    const y = d.visitors > 0 ? (100 - (d.visitors / maxVal) * 85) : 100;
    return `${x},${y}`;
  }).join(" ") : "";
  const labelEvery = data.length > 30 ? 7 : data.length > 14 ? 3 : 1;

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Traffic</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div className="chart-legend">
            <span><div className="dot-green" /> Views</span>
            <span><div className="dot-blue" /> Clicks</span>
          </div>
          <div className="chart-range-picker">
            {ranges.map(r => (
              <button key={r.key} className={`chart-range-btn ${range === r.key ? "active" : ""}`} onClick={() => onRangeChange(r.key)}>{r.label}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="chart-area">
        {showLine && (
          <svg className="chart-line-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline points={linePoints} fill="none" stroke="var(--green)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
          </svg>
        )}
        {data.map((d, i) => (
          <div key={i} className="chart-col" onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
            <div className="chart-bar-stack">
              {d.visitors > 0 && <div className="chart-bar visitors" style={{ height: `${Math.max((d.visitors / maxVal) * 85, 3)}%` }} />}
              {d.clicks > 0 && <div className="chart-bar clicks" style={{ height: `${Math.max((d.clicks / maxVal) * 85, 3)}%` }} />}
            </div>
            {hoveredIdx === i && (d.visitors > 0 || d.clicks > 0) && <div className="chart-tooltip">{d.day}: {d.visitors} views, {d.clicks} clicks</div>}
            {(i % labelEvery === 0 || i === data.length - 1) && <div className="chart-bar-label">{d.day}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
//  PAGES
// ═══════════════════════════════════════════════════

// ─── YouTube URL → embed ID ───
function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}

// ─── Donate Panel ───
function DonatePanel({ open, onClose, donateConfig }) {
  const [copied, setCopied] = useState("");
  const methods = donateConfig?.donateMethods || [];

  const copy = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(""), 2000);
    });
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
        <div className="modal-header">
          <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>{Icons.heart} Support NullSpace</h2>
          <button onClick={onClose}>{Icons.x}</button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 20, lineHeight: 1.7 }}>
            NullSpace Studio is independently run. If you find our projects useful,
            consider supporting us. Every bit helps fuel the next build.
          </p>

          {methods.map((m) => (
            m.type === "link" ? (
              <a
                key={m.id}
                href={m.value}
                target="_blank"
                rel="noopener noreferrer"
                className="donate-btn coffee"
                style={{ width: "100%", justifyContent: "center", marginBottom: 12, textDecoration: "none" }}
              >
                {Icons.coffee} {m.label}
              </a>
            ) : (
              <div key={m.id} style={{ marginBottom: 12 }}>
                <div style={{ marginBottom: 4 }}>
                  <label style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {m.label}
                  </label>
                </div>
                <div className="crypto-address-box">
                  <code>{m.value}</code>
                  <button onClick={() => copy(m.value, m.id)}>
                    {copied === m.id ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            )
          ))}
          {methods.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center" }}>No donate methods configured yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Add/Edit Media Modal (admin) ───
function MediaModal({ open, onClose, onSave, editMedia }) {
  const [mediaType, setMediaType] = useState("youtube");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const fileRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (editMedia) {
      setMediaType(editMedia.type || "youtube");
      setTitle(editMedia.title || "");
      setDescription(editMedia.description || "");
      setUrl(editMedia.url || "");
      setImage(editMedia.image || null);
      setVideoFile(editMedia.videoFile || null);
    } else {
      setMediaType("youtube"); setTitle(""); setDescription(""); setUrl(""); setImage(null); setVideoFile(null);
    }
  }, [editMedia, open]);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleVideo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setVideoFile(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: editMedia?.id || uid(),
      type: mediaType,
      title,
      description,
      url: mediaType === "youtube" ? url : "",
      image: mediaType === "image" ? image : null,
      videoFile: mediaType === "video" ? videoFile : null,
      status: editMedia?.status || "active",
      dateAdded: editMedia?.dateAdded || now(),
    });
    setTitle(""); setDescription(""); setUrl(""); setImage(null); setVideoFile(null); setMediaType("youtube");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editMedia ? "Edit Media" : "Add Media"}</h2>
          <button onClick={onClose}>{Icons.x}</button>
        </div>
        <div className="modal-body">
          {/* Media Type Selector */}
          <div className="media-type-selector">
            {MEDIA_TYPES.map(t => (
              <button
                key={t.key}
                className={`media-type-btn ${mediaType === t.key ? "active" : ""}`}
                onClick={() => setMediaType(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="field">
            <label>Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="What is this about?" />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description" />
          </div>

          {mediaType === "youtube" && (
            <div className="field">
              <label>YouTube URL</label>
              <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
            </div>
          )}

          {mediaType === "image" && (
            <div className="field">
              <label>Upload Image</label>
              <input type="file" ref={fileRef} accept="image/*" style={{ display: "none" }} onChange={handleImage} />
              {image ? (
                <div className="image-upload-preview">
                  <img src={image} alt="preview" />
                  <button onClick={() => setImage(null)}>×</button>
                </div>
              ) : (
                <div className="image-upload-zone" onClick={() => fileRef.current?.click()}>
                  <div className="upload-icon">{Icons.upload}</div>
                  <p>Click to upload</p>
                  <div className="file-types">PNG, JPG, GIF up to 10MB</div>
                </div>
              )}
            </div>
          )}

          {mediaType === "video" && (
            <div className="field">
              <label>Upload Video</label>
              <input type="file" ref={videoRef} accept="video/*" style={{ display: "none" }} onChange={handleVideo} />
              {videoFile ? (
                <div style={{ position: "relative" }}>
                  <video src={videoFile} style={{ maxWidth: "100%", maxHeight: 160, borderRadius: "var(--radius)", border: "1px solid var(--border)" }} controls />
                  <button onClick={() => setVideoFile(null)} style={{ position: "absolute", top: -6, right: -6, width: 24, height: 24, borderRadius: "50%", background: "var(--danger)", border: "none", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>×</button>
                </div>
              ) : (
                <div className="image-upload-zone" onClick={() => videoRef.current?.click()}>
                  <div className="upload-icon">{Icons.film}</div>
                  <p>Click to upload a video</p>
                  <div className="file-types">MP4, WebM up to 50MB</div>
                </div>
              )}
            </div>
          )}

          {mediaType === "info" && (
            <p style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>
              Info posts are text-only announcements. The title and description are all you need.
            </p>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-green" onClick={handleSave}>
            {editMedia ? "Save Changes" : <>{Icons.plus} Add Media</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── HOME PAGE (Directory) ───
function HomePage({ projects, media, onNavigate, isLoggedIn, onAddMedia, onEditMedia, onDeleteMedia, donateConfig, maxMediaPosts, siteConfig }) {
  const [filter, setFilter] = useState("all");
  const [donateOpen, setDonateOpen] = useState(false);
  const activeProjects = projects.filter(p => p.status !== "deleted");
  const activeMedia = media.filter(m => m.status !== "deleted");
  const filtered = filter === "all" ? activeProjects : activeProjects.filter(p => p.type === filter);
  const activeCount = activeProjects.filter(p => p.status === "active").length;
  const pausedCount = activeProjects.filter(p => p.status === "paused").length;
  const carouselRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);

  const getCounts = (key) => {
    if (key === "all") return activeProjects.length;
    return activeProjects.filter(p => p.type === key).length;
  };

  const scrollCarousel = (dir) => {
    if (!carouselRef.current) return;
    const amount = 360;
    carouselRef.current.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const el = carouselRef.current;
    const pct = el.scrollWidth > el.clientWidth ? (el.scrollLeft / (el.scrollWidth - el.clientWidth)) * 100 : 0;
    setScrollPos(pct);
  };

  const maxPosts = maxMediaPosts || 10;
  const canAddMedia = activeMedia.length < maxPosts;

  return (
    <div className="fade-in">
      {/* Hero */}
      <div className="hero">
        <div className="hero-label">
          <span className="dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 8px var(--green)" }} />
          NullSpace Studio LLC
        </div>
        <h1>
          The Directory<span className="accent">.</span>
        </h1>
        <p>
          {siteConfig?.heroSubtitle || "Every website, app, API, and tool built under NullSpace Studio — all in one place. Browse live projects or reach out to learn more."}
        </p>
        {/* Donate Bar */}
        <div className="donate-bar" style={{ justifyContent: "center", marginTop: 8 }}>
          <button className="donate-btn coffee" onClick={() => setDonateOpen(true)}>
            {Icons.heart} Support Us
          </button>
        </div>
      </div>

      <DonatePanel open={donateOpen} onClose={() => setDonateOpen(false)} donateConfig={donateConfig} />

      {/* ── Media / Updates Feed ── */}
      {(activeMedia.length > 0 || isLoggedIn) && (
        <div className="section">
          <div className="section-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div className="section-label">// Feed</div>
              <div className="section-title">Updates & Media</div>
            </div>
            {isLoggedIn && canAddMedia && (
              <button className="btn-green" onClick={onAddMedia} style={{ marginTop: 4 }}>
                {Icons.plus} Add Media ({activeMedia.length}/{maxPosts})
              </button>
            )}
            {isLoggedIn && !canAddMedia && (
              <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "#ffaa00", marginTop: 8 }}>
                Max {maxPosts} posts reached
              </span>
            )}
          </div>

          {activeMedia.length === 0 ? (
            <div className="empty-state" style={{ padding: "40px 20px" }}>
              <p>No media posts yet.</p>
            </div>
          ) : (
            <div className="media-carousel-wrap">
              {activeMedia.length > 3 && (
                <button className="carousel-arrow left" onClick={() => scrollCarousel(-1)}>‹</button>
              )}
              <div className="media-carousel" ref={carouselRef} onScroll={handleScroll}>
                {activeMedia.map((m) => {
                const ytId = m.type === "youtube" ? getYouTubeId(m.url) : null;
                return (
                  <div key={m.id} className="media-card" style={{ position: "relative" }}>
                    {isLoggedIn && (
                      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 5, display: "flex", gap: 10 }}>
                        <button className="btn-ghost" style={{ fontSize: 12, padding: "6px 14px" }} onClick={() => onEditMedia(m)}>
                          Edit
                        </button>
                        <button className="btn-danger" style={{ fontSize: 12, padding: "6px 10px" }} onClick={() => onDeleteMedia(m.id)}>
                          {Icons.trash}
                        </button>
                      </div>
                    )}
                    <div className="media-card-visual">
                      {m.type === "youtube" && ytId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${ytId}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={m.title}
                        />
                      ) : m.type === "image" && m.image ? (
                        <img src={m.image} alt={m.title} />
                      ) : m.type === "video" && m.videoFile ? (
                        <video src={m.videoFile} controls />
                      ) : (
                        <div className="placeholder">
                          {m.type === "youtube" ? Icons.play : m.type === "info" ? Icons.message : Icons.image}
                          <span>{m.type === "info" ? "Announcement" : "No preview"}</span>
                        </div>
                      )}
                    </div>
                    <div className="media-card-body">
                      <span className={`media-card-type ${m.type}`}>{m.type}</span>
                      <h3>{m.title}</h3>
                      {m.description && <p>{m.description}</p>}
                      <div className="media-card-date">{m.dateAdded}</div>
                    </div>
                  </div>
                );
              })}
              </div>
              {activeMedia.length > 3 && (
                <>
                  <button className="carousel-arrow right" onClick={() => scrollCarousel(1)}>›</button>
                  <div className="carousel-track">
                    <div className="carousel-track-fill" style={{ width: `${Math.max(10, scrollPos)}%` }} />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Projects Directory ── */}
      <div className="section">
        <div className="section-header">
          <div className="section-label">// Projects</div>
          <div className="section-title">What We've Built</div>
          <div className="dir-stats" style={{ marginTop: 12 }}>
            <span><span className="dot-live" /> {activeCount} Live</span>
            {pausedCount > 0 && <span><span className="dot-paused" /> {pausedCount} Paused</span>}
            <span>{projects.length} Total</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-bar">
          {PROJECT_TYPES.map(t => (
            <button
              key={t.key}
              className={`filter-tab ${filter === t.key ? "active" : ""}`}
              onClick={() => setFilter(t.key)}
            >
              {t.label}
              <span className="count">{getCounts(t.key)}</span>
            </button>
          ))}
        </div>

        {/* Project Cards */}
        <div className="projects-grid">
          {filtered.map((p) => (
            <div key={p.id} className="project-card">
              <div className="project-card-img">
                {p.image ? <img src={p.image} alt={p.title} /> : (
                  <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    {Icons.grid}
                    <span style={{ fontSize: 11 }}>No preview</span>
                  </span>
                )}
              </div>
              <div className="project-card-body">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span className={`type-badge ${p.type || "website"}`}>{p.category}</span>
                  <span className={`project-status ${p.status}`}>{p.status}</span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="project-card-footer">
                  <span className="project-card-date">{p.dateAdded}</span>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="project-card-link">
                      Visit {Icons.arrow}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <p>No projects match this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PRIVACY PAGE ───
function PrivacyPage() {
  return (
    <div className="privacy-page fade-in">
      <h1>Privacy Policy & Terms</h1>
      <p className="updated">Last updated: March 15, 2026 · NullSpace Studio LLC</p>

      <div className="privacy-section">
        <h2>1. Information We Collect</h2>
        <p>
          NullSpace Studio LLC ("we," "us," or "our") collects information you provide
          directly when using our websites, applications, and services, including:
        </p>
        <ul>
          <li>Contact information such as name and email address when you reach out through our messenger</li>
          <li>Usage data including pages visited, time spent, and interaction patterns across our properties</li>
          <li>Technical data such as browser type, device information, and IP address</li>
          <li>Any files or images you upload through our platforms</li>
        </ul>
      </div>

      <div className="privacy-section">
        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Respond to your inquiries and fulfill your requests</li>
          <li>Monitor and analyze usage patterns and trends</li>
          <li>Protect against unauthorized access and ensure the security of our platform</li>
          <li>Comply with legal obligations</li>
        </ul>
      </div>

      <div className="privacy-section">
        <h2>3. Data Protection</h2>
        <p>
          We implement industry-standard security measures to protect your personal
          information. All data transmissions are encrypted using SSL/TLS protocols.
          We regularly audit our systems and processes to ensure the highest level
          of data protection.
        </p>
      </div>

      <div className="privacy-section">
        <h2>4. Third-Party Services</h2>
        <p>
          Our services may contain links to third-party websites or services that are
          not operated by us. We have no control over and assume no responsibility for
          the content, privacy policies, or practices of any third-party services.
          We encourage you to review the privacy policy of every site you visit.
        </p>
      </div>

      <div className="privacy-section">
        <h2>5. Data Retention</h2>
        <p>
          We retain your personal information only for as long as necessary to fulfill
          the purposes for which it was collected, including satisfying legal, accounting,
          or reporting requirements. When your data is no longer needed, it will be
          securely deleted or anonymized.
        </p>
      </div>

      <div className="privacy-section">
        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal information we hold about you</li>
          <li>Request correction of any inaccurate information</li>
          <li>Request deletion of your personal information</li>
          <li>Object to or restrict certain types of processing</li>
          <li>Receive your data in a portable format</li>
        </ul>
      </div>

      <div className="privacy-section">
        <h2>7. Terms of Service</h2>
        <p>
          By accessing and using our services, you agree to be bound by these terms.
          Our services are provided "as is" without warranties of any kind, either
          express or implied. We reserve the right to modify or discontinue any
          service at any time without prior notice.
        </p>
      </div>

      <div className="privacy-section">
        <h2>8. Limitation of Liability</h2>
        <p>
          In no event shall we be liable for any indirect, incidental, special,
          consequential, or punitive damages, including loss of profits, data,
          or other intangible losses, resulting from your use of or inability
          to use our services.
        </p>
      </div>

      <div className="privacy-section">
        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this privacy policy and terms of service from time to time.
          We will notify you of any changes by posting the new policy on this page
          with an updated "last updated" date. Continued use of our services after
          any changes constitutes acceptance of the new terms.
        </p>
      </div>

      <div className="privacy-section">
        <h2>10. Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or our terms of service,
          please reach out through our messenger or contact us directly. We aim to
          respond to all inquiries within 48 business hours.
        </p>
      </div>
    </div>
  );
}

// ─── Q&A PAGE (public) ───
function QAPage({ qaItems, isLoggedIn, onDeleteQA }) {
  return (
    <div className="qa-page fade-in">
      <h1>Questions & Answers</h1>
      <p className="subtitle">
        Got a question? Send it through the messenger and we'll answer it here for everyone.
      </p>

      {(!qaItems || qaItems.length === 0) ? (
        <div className="qa-empty">
          <div style={{ color: "var(--text-muted)", marginBottom: 12 }}>{Icons.message}</div>
          <p style={{ fontSize: 15, marginBottom: 4 }}>No questions answered yet.</p>
          <p style={{ fontSize: 13 }}>Use the messenger to ask a question — answers will show up here.</p>
        </div>
      ) : (
        qaItems.map((item) => (
          <div key={item.id} className="qa-card">
            <div className="qa-question">
              <span className="q-mark">Q</span>
              <span>{item.question}</span>
            </div>
            <div className="qa-answer">
              <span className="a-mark">A</span>
              {item.answer}
            </div>
            <div className="qa-meta">
              {item.asker_email ? `Asked by ${item.asker_email}` : "Asked by a visitor"} · {item.created_at ? new Date(item.created_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
              {isLoggedIn && (
                <button
                  onClick={() => onDeleteQA(item.id)}
                  style={{ marginLeft: 12, background: "none", border: "none", color: "var(--danger)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 10 }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── ADMIN PAGE ───
function AdminPage({ projects, setProjects, analytics, isLoggedIn, onLogin, inboxMessages, onClearInbox, onSaveMessage, onDisregardMessage, onReplyToMessage, credentials, onUpdateCredentials, onSaveProject, onDeleteProject, onRestoreProject, onPermanentDeleteProject, connStatus, activityLog, siteConfig, onUpdateSiteConfig, onLoadAnalytics, onDeletePageView, onClearAllPageViews }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [adminTab, setAdminTab] = useState("overview");
  const [replyingTo, setReplyingTo] = useState(null);
  const [analyticsRange, setAnalyticsRange] = useState(7);
  const [newPasskey, setNewPasskey] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [credSaved, setCredSaved] = useState("");
  // Donate/config state
  const [editHeroSubtitle, setEditHeroSubtitle] = useState(siteConfig?.heroSubtitle || "");
  const [editDonateMethods, setEditDonateMethods] = useState(siteConfig?.donateMethods || []);
  const [newMaxMedia, setNewMaxMedia] = useState(siteConfig?.maxMediaPosts || 10);
  const [configSaved, setConfigSaved] = useState("");

  // Sync when siteConfig loads
  useEffect(() => {
    if (siteConfig) {
      setEditHeroSubtitle(siteConfig.heroSubtitle || "");
      setEditDonateMethods(siteConfig.donateMethods || []);
      setNewMaxMedia(siteConfig.maxMediaPosts || 10);
    }
  }, [siteConfig]);

  if (!isLoggedIn) {
    return (
      <div className="admin-page fade-in">
        <div className="empty-state" style={{ paddingTop: 120 }}>
          <div style={{ color: "var(--green)", marginBottom: 16 }}>{Icons.lock}</div>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Admin Access Required</h2>
          <p style={{ marginBottom: 24 }}>Please sign in to access the admin dashboard.</p>
          <button className="btn-green" onClick={onLogin}>
            {Icons.user} Sign In
          </button>
        </div>
      </div>
    );
  }

  const handleSave = (project) => {
    if (onSaveProject) onSaveProject(project);
    setEditProject(null);
  };

  const handleDelete = (id) => {
    if (onDeleteProject) onDeleteProject(id);
  };

  const handleCredUpdate = (field) => {
    let val;
    if (field === "passkey" && newPasskey.trim()) val = newPasskey.trim();
    else if (field === "email" && newEmail.trim()) val = newEmail.trim();
    else if (field === "password" && newPassword.trim()) val = newPassword.trim();
    else return;
    onUpdateCredentials(field, val);
    setCredSaved(field);
    setTimeout(() => setCredSaved(""), 2000);
    if (field === "passkey") setNewPasskey("");
    if (field === "email") setNewEmail("");
    if (field === "password") setNewPassword("");
  };

  const handleConfigUpdate = (field, value) => {
    if (value === undefined || value === null) return;
    onUpdateSiteConfig(field, value);
    const labelMap = { heroSubtitle: "hero", donateMethods: "donate", maxMediaPosts: "max" };
    setConfigSaved(labelMap[field] || field);
    setTimeout(() => setConfigSaved(""), 2000);
  };

  return (
    <div className="admin-page fade-in">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <div style={{ marginTop: 8 }}>
            <span className={`conn-badge ${connStatus}`}>
              <span className="conn-dot" />
              {connStatus === "connected" ? "Supabase Connected" : connStatus === "local" ? "Local Mode (no persistence)" : "Supabase Disconnected"}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className={`btn-ghost`} onClick={() => setAdminTab("overview")} style={adminTab === "overview" ? { borderColor: "var(--green)", color: "var(--green)" } : {}}>
            {Icons.chart} Overview
          </button>
          <button className={`btn-ghost`} onClick={() => setAdminTab("inbox")} style={adminTab === "inbox" ? { borderColor: "var(--green)", color: "var(--green)" } : {}}>
            {Icons.message} Inbox{inboxMessages.length > 0 ? ` (${inboxMessages.length})` : ""}
          </button>
          <button className={`btn-ghost`} onClick={() => setAdminTab("log")} style={adminTab === "log" ? { borderColor: "var(--green)", color: "var(--green)" } : {}}>
            {Icons.eye} Activity Log
          </button>
          <button className={`btn-ghost`} onClick={() => setAdminTab("settings")} style={adminTab === "settings" ? { borderColor: "var(--green)", color: "var(--green)" } : {}}>
            {Icons.lock} Settings
          </button>
        </div>
      </div>

      {/* ═══ OVERVIEW TAB ═══ */}
      {adminTab === "overview" && (
        <>
          {/* Stats */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-card-icon green">{Icons.eye}</div>
              <div className="stat-value">{fmt(analytics.totalVisitors)}</div>
              <div className="stat-label">Page Views ({analyticsRange}D)</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon blue">{Icons.click}</div>
              <div className="stat-value">{fmt(analytics.totalClicks)}</div>
              <div className="stat-label">Clicks ({analyticsRange}D)</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon purple">{Icons.user}</div>
              <div className="stat-value">{fmt(analytics.uniqueVisitors)}</div>
              <div className="stat-label">Unique Visitors</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon amber">{Icons.chart}</div>
              <div className="stat-value">{analytics.bounceRate}%</div>
              <div className="stat-label">Bounce Rate</div>
            </div>
          </div>

          <AnalyticsChart
            data={analytics.daily}
            range={analyticsRange}
            onRangeChange={(r) => { setAnalyticsRange(r); onLoadAnalytics(r); }}
          />

          {/* Recent Visitors */}
          {analytics.recentVisitors && analytics.recentVisitors.length > 0 && (
            <div className="recent-visitors">
              <div className="recent-visitors-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Recent Visitors</span>
                <button className="btn-danger" style={{ fontSize: 11, padding: "4px 10px" }} onClick={() => onClearAllPageViews(analyticsRange)}>
                  {Icons.trash} Clear All
                </button>
              </div>
              {analytics.recentVisitors.slice(0, 10).map((v, i) => {
                const device = v.agent.includes("Mobile") ? "Mobile" : v.agent.includes("Tablet") ? "Tablet" : "Desktop";
                const browser = v.agent.includes("Chrome") ? "Chrome" : v.agent.includes("Firefox") ? "Firefox" : v.agent.includes("Safari") ? "Safari" : "Other";
                return (
                  <div key={v.id || i} className="rv-row">
                    <span className="rv-time">{v.time}</span>
                    <span className="rv-page">/{v.page}</span>
                    <span className="rv-device">{device} · {browser}</span>
                    <span className="rv-screen">{v.screen}px</span>
                    <button
                      onClick={() => onDeletePageView(v.id, analyticsRange)}
                      style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "2px 6px", fontSize: 11, fontFamily: "var(--font-mono)", transition: "color 0.2s" }}
                      onMouseEnter={e => e.target.style.color = "var(--danger)"}
                      onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
                      title="Delete this record"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Projects List */}
          <div className="admin-table-wrap" style={{ marginBottom: 24 }}>
            <div className="admin-table-header">
              <h3>Projects ({projects.length})</h3>
              <button className="btn-green" onClick={() => { setEditProject(null); setModalOpen(true); }}>
                {Icons.plus} New Project
              </button>
            </div>
            {projects.length === 0 ? (
              <div className="empty-state">
                <p>No projects yet. Click "New Project" to add one.</p>
              </div>
            ) : (
              projects.map((p) => (
                <div key={p.id} className="admin-project-row" style={p.status === "deleted" ? { opacity: 0.5 } : {}}>
                  <div className="admin-project-thumb">
                    {p.image ? <img src={p.image} alt={p.title} /> : Icons.grid}
                  </div>
                  <div className="admin-project-info">
                    <h4 style={p.status === "deleted" ? { textDecoration: "line-through" } : {}}>{p.title}</h4>
                    <p>
                      <span className={`type-badge ${p.type || "website"}`} style={{ marginRight: 6 }}>{p.category}</span>
                      · {p.dateAdded}
                      {p.status === "deleted" && p.deleted_at && (
                        <span style={{ marginLeft: 6, fontSize: 10, color: "var(--danger)" }}>
                          · Deletes permanently {new Date(new Date(p.deleted_at).getTime() + 30*24*60*60*1000).toLocaleDateString()}
                        </span>
                      )}
                    </p>
                  </div>
                  <span className={`project-status ${p.status}`}>{p.status}</span>
                  <div className="admin-project-actions">
                    {p.status === "deleted" ? (
                      <>
                        <button className="btn-green" style={{ fontSize: 11, padding: "4px 10px" }} onClick={() => onRestoreProject(p.id)}>
                          Restore
                        </button>
                        <button className="btn-danger" onClick={() => onPermanentDeleteProject(p.id)}>
                          {Icons.trash} Purge
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn-ghost" onClick={() => { setEditProject(p); setModalOpen(true); }}>
                          Edit
                        </button>
                        <button className="btn-danger" onClick={() => handleDelete(p.id)}>
                          {Icons.trash}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* ═══ INBOX TAB ═══ */}
      {adminTab === "inbox" && (
        <div className="admin-table-wrap">
          <div className="admin-table-header">
            <h3>Visitor Messages ({inboxMessages.filter(m => m.status !== "disregarded").length})</h3>
            {inboxMessages.length > 0 && (
              <button className="btn-danger" onClick={onClearInbox}>
                {Icons.trash} Clear All
              </button>
            )}
          </div>
          {inboxMessages.length === 0 ? (
            <div className="empty-state">
              <div style={{ color: "var(--text-muted)", marginBottom: 8 }}>{Icons.message}</div>
              <p>No messages from visitors yet.</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Messages sent through the site messenger will appear here.</p>
            </div>
          ) : (
            inboxMessages.map((m) => (
              <div key={m.id} className="admin-project-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: 8, opacity: m.status === "disregarded" ? 0.4 : 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "var(--radius)", background: "var(--green-glow-subtle)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", flexShrink: 0 }}>
                    {Icons.user}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{m.email || "Anonymous Visitor"}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginLeft: 8 }}>{m.time}</span>
                    {m.status === "saved" && <span className="msg-status-badge saved" style={{ marginLeft: 8 }}>Saved</span>}
                    {m.status === "disregarded" && <span className="msg-status-badge disregarded" style={{ marginLeft: 8 }}>Disregarded</span>}
                    {m.status === "replied" && <span className="msg-status-badge replied" style={{ marginLeft: 8 }}>Replied</span>}
                  </div>
                  {m.status !== "disregarded" && (
                    <div className="msg-actions">
                      <button className="btn-green" style={{ fontSize: 11, padding: "4px 10px" }} onClick={() => setReplyingTo(m)}>
                        Reply
                      </button>
                      {m.status !== "saved" && (
                        <button className="btn-ghost" style={{ fontSize: 11, padding: "4px 10px" }} onClick={() => onSaveMessage(m.id)}>
                          Save
                        </button>
                      )}
                      <button className="btn-danger" style={{ fontSize: 11, padding: "4px 8px" }} onClick={() => onDisregardMessage(m.id)}>
                        Disregard
                      </button>
                    </div>
                  )}
                </div>
                {m.image && (
                  <img src={m.image} alt="attachment" style={{ maxWidth: 200, maxHeight: 120, borderRadius: "var(--radius)", border: "1px solid var(--border)", marginLeft: 44 }} />
                )}
                {m.text && <p style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.6, paddingLeft: 44 }}>{m.text}</p>}
                {m.admin_reply && (
                  <div style={{ paddingLeft: 44, marginTop: 4 }}>
                    <span style={{ fontSize: 12, color: "#58a6ff", fontWeight: 600 }}>Your reply:</span>
                    <p style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 2 }}>{m.admin_reply}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Reply Modal */}
      <ReplyModal
        open={!!replyingTo}
        onClose={() => setReplyingTo(null)}
        message={replyingTo}
        onSendReply={onReplyToMessage}
      />

      {/* ═══ ACTIVITY LOG TAB ═══ */}
      {adminTab === "log" && (
        <div className="admin-table-wrap">
          <div className="admin-table-header">
            <h3>Activity Log</h3>
          </div>
          {(!activityLog || activityLog.length === 0) ? (
            <div className="empty-state">
              <div style={{ color: "var(--text-muted)", marginBottom: 8 }}>{Icons.eye}</div>
              <p>No activity recorded yet.</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                {connStatus === "local" ? "Connect Supabase to enable activity tracking." : "Actions like creating, updating, and deleting projects and media will appear here."}
              </p>
            </div>
          ) : (
            activityLog.map((entry) => (
              <div key={entry.id} className="activity-row">
                <div className={`activity-dot ${entry.action === "created" ? "created" : entry.action === "updated" ? "updated" : entry.action === "deleted" || entry.action === "purged" ? "deleted" : "restored"}`} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: "var(--text)" }}>
                    <span style={{ fontWeight: 600, textTransform: "capitalize" }}>{entry.action}</span>
                    {" "}
                    <span style={{ color: "var(--text-dim)" }}>{entry.target}:</span>
                    {" "}
                    <span>{entry.details}</span>
                  </div>
                  <div className="activity-time">
                    {entry.created_at ? new Date(entry.created_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }) : ""}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ═══ SETTINGS TAB ═══ */}
      {adminTab === "settings" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 600 }}>
          {/* Security */}
          <div className="admin-table-wrap">
            <div className="admin-table-header"><h3>Security Credentials</h3></div>
            <div style={{ padding: 24 }}>
              <div className="field">
                <label>Change Passkey</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="password" value={newPasskey} onChange={e => setNewPasskey(e.target.value)} placeholder="Enter new passkey" style={{ flex: 1 }} />
                  <button className="btn-green" onClick={() => handleCredUpdate("passkey")}>{credSaved === "passkey" ? "Saved!" : "Update"}</button>
                </div>
              </div>
              <div className="field">
                <label>Change Email</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Enter new email" style={{ flex: 1 }} />
                  <button className="btn-green" onClick={() => handleCredUpdate("email")}>{credSaved === "email" ? "Saved!" : "Update"}</button>
                </div>
              </div>
              <div className="field">
                <label>Change Password</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" style={{ flex: 1 }} />
                  <button className="btn-green" onClick={() => handleCredUpdate("password")}>{credSaved === "password" ? "Saved!" : "Update"}</button>
                </div>
              </div>
              <div style={{ marginTop: 12, padding: 10, background: "var(--black-5)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                <p style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>Current email: <span style={{ color: "var(--text)" }}>{credentials.email}</span></p>
              </div>
            </div>
          </div>

          {/* Hero Subtitle */}
          <div className="admin-table-wrap">
            <div className="admin-table-header"><h3>Homepage Subtitle</h3></div>
            <div style={{ padding: 24 }}>
              <div className="field">
                <label>Text under "The Directory."</label>
                <textarea value={editHeroSubtitle} onChange={e => setEditHeroSubtitle(e.target.value)} style={{ minHeight: 80 }} placeholder="Describe your studio..." />
              </div>
              <button className="btn-green" onClick={() => { handleConfigUpdate("heroSubtitle", editHeroSubtitle); }}>{configSaved === "hero" ? "Saved!" : "Update Subtitle"}</button>
            </div>
          </div>

          {/* Donate Methods Manager */}
          <div className="admin-table-wrap">
            <div className="admin-table-header">
              <h3>Donate & Payment Methods</h3>
              <button className="btn-green" style={{ fontSize: 12 }} onClick={() => {
                const methods = [...editDonateMethods, { id: uid(), label: "New Method", type: "crypto", value: "" }];
                setEditDonateMethods(methods);
              }}>
                {Icons.plus} Add Method
              </button>
            </div>
            <div style={{ padding: 24 }}>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.6 }}>
                Each method appears in the "Support Us" popup. Set type to "link" for clickable buttons (like Buy Me a Coffee) or "crypto" for copy-able wallet addresses.
              </p>
              {editDonateMethods.map((m, idx) => (
                <div key={m.id} style={{ padding: 16, background: "var(--black-5)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <div className="field" style={{ flex: 1, marginBottom: 0 }}>
                      <label>Label</label>
                      <input value={m.label} onChange={e => { const u = [...editDonateMethods]; u[idx] = { ...u[idx], label: e.target.value }; setEditDonateMethods(u); }} placeholder="e.g. Bitcoin (BTC)" />
                    </div>
                    <div className="field" style={{ width: 120, marginBottom: 0 }}>
                      <label>Type</label>
                      <select value={m.type} onChange={e => { const u = [...editDonateMethods]; u[idx] = { ...u[idx], type: e.target.value }; setEditDonateMethods(u); }}>
                        <option value="crypto">Crypto / Address</option>
                        <option value="link">Link / URL</option>
                      </select>
                    </div>
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>{m.type === "link" ? "URL" : "Wallet Address"}</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input value={m.value} onChange={e => { const u = [...editDonateMethods]; u[idx] = { ...u[idx], value: e.target.value }; setEditDonateMethods(u); }} placeholder={m.type === "link" ? "https://..." : "Paste address..."} style={{ flex: 1 }} />
                      <button className="btn-danger" style={{ padding: "6px 10px" }} onClick={() => { setEditDonateMethods(prev => prev.filter((_, i) => i !== idx)); }}>
                        {Icons.trash}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button className="btn-green" style={{ marginTop: 8 }} onClick={() => handleConfigUpdate("donateMethods", editDonateMethods)}>
                {configSaved === "donate" ? "Saved!" : "Save All Donate Methods"}
              </button>
            </div>
          </div>

          {/* Media Limits */}
          <div className="admin-table-wrap">
            <div className="admin-table-header"><h3>Media Settings</h3></div>
            <div style={{ padding: 24 }}>
              <div className="field">
                <label>Max Media Posts</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="number" min="1" max="50" value={newMaxMedia} onChange={e => setNewMaxMedia(parseInt(e.target.value) || 10)} style={{ flex: 1 }} />
                  <button className="btn-green" onClick={() => handleConfigUpdate("maxMediaPosts", newMaxMedia)}>{configSaved === "max" ? "Saved!" : "Update"}</button>
                </div>
              </div>
              <p style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 8 }}>
                Currently set to {siteConfig.maxMediaPosts}. First 3 show fully, the rest scroll in a carousel.
              </p>
            </div>
          </div>
        </div>
      )}

      <ProjectModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditProject(null); }}
        onSave={handleSave}
        editProject={editProject}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════
//  APP ROOT — Supabase-connected
// ═══════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");
  const [messengerOpen, setMessengerOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginStep, setLoginStep] = useState("passkey");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [projects, setProjects] = useState([]);
  const [media, setMedia] = useState([]);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [analytics, setAnalytics] = useState({ totalVisitors: 0, totalClicks: 0, uniqueVisitors: 0, bounceRate: 0, daily: [] });
  const [msgCount, setMsgCount] = useState(0);
  const [loginError, setLoginError] = useState(false);
  const [passkeyError, setPasskeyError] = useState(false);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [credentials, setCredentials] = useState(DEFAULT_CREDENTIALS);

  // Toast system
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((message, type = "success") => {
    const id = uid();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  // Connection status
  const [connStatus, setConnStatus] = useState("checking"); // "connected" | "disconnected" | "local"

  // Activity log
  const [activityLog, setActivityLog] = useState([]);

  // Site config (wallets, coffee link, max media)
  const [siteConfig, setSiteConfig] = useState(DEFAULT_DONATE);

  // Edit media
  const [editMediaItem, setEditMediaItem] = useState(null);

  // ─── Load everything on mount ───
  useEffect(() => {
    async function init() {
      try {
        if (isSupabaseConfigured()) {
          // Test connection first
          const connTest = await db.testConnection();
          if (connTest.ok) {
            setConnStatus("connected");

            const [p, m, msgs, creds, stats, log, qa, cfg] = await Promise.all([
              db.loadProjects(),
              db.loadMedia(),
              db.loadMessages(),
              db.loadSettings(),
              db.loadAnalytics(),
              db.loadActivityLog(),
              db.loadQA(),
              db.loadSiteConfig(),
            ]);
            setProjects(p.length > 0 ? p : FALLBACK_PROJECTS);
            setMedia(m);
            setInboxMessages(msgs);
            setCredentials(creds);
            setAnalytics(stats);
            setActivityLog(log);
            setQaItems(qa);
            setSiteConfig(cfg);
            if (msgs.length > 0) setMsgCount(msgs.length);
            db.trackPageView("home", "view");
            db.purgeOldDeleted();
            db.purgeDisregarded();
            db.purgeOldAnalytics();
          } else {
            setConnStatus("disconnected");
            setProjects(FALLBACK_PROJECTS);
            console.error(connTest.error);
          }
        } else {
          setConnStatus("local");
          setProjects(FALLBACK_PROJECTS);
          console.log("Supabase not configured — running in local mode.");
        }
      } catch (err) {
        console.error("Init error:", err);
        setConnStatus("disconnected");
        setProjects(FALLBACK_PROJECTS);
      }
      setLoading(false);
    }
    init();

    const session = sessionStorage.getItem("ns_admin");
    if (session === "true") {
      setIsLoggedIn(true);
      const lastPage = sessionStorage.getItem("ns_page");
      if (lastPage) setPage(lastPage);
    }
  }, []);

  const navigate = (p) => {
    setPage(p);
    setMobileNav(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    sessionStorage.setItem("ns_page", p);
    db.trackPageView(p, "click");
  };

  const openLoginModal = () => {
    setLoginOpen(true);
    setLoginStep("passkey");
    setLoginError(false);
    setPasskeyError(false);
  };

  const handlePasskey = (input) => {
    if (input === credentials.passkey) {
      setPasskeyError(false);
      setLoginStep("credentials");
    } else {
      setPasskeyError(true);
    }
  };

  const handleLogin = (email, password) => {
    if (email === credentials.email && password === credentials.password) {
      setIsLoggedIn(true);
      setLoginOpen(false);
      setLoginError(false);
      setPage("admin");
      sessionStorage.setItem("ns_admin", "true");
      toast("Logged in successfully", "success");
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginOpen(false);
    setPage("home");
    sessionStorage.removeItem("ns_admin");
    toast("Signed out", "info");
  };

  const handleUpdateCredentials = async (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    const result = await db.updateSetting(field, value);
    if (result && result.ok) {
      toast(`${field.charAt(0).toUpperCase() + field.slice(1)} updated`, "success");
      db.logActivity("updated", "credentials", `Changed ${field}`);
    } else if (connStatus === "local") {
      toast(`${field.charAt(0).toUpperCase() + field.slice(1)} updated (local only — connect Supabase to persist)`, "warn");
    }
  };

  // Project CRUD with toasts + activity log
  const handleSaveProject = async (project) => {
    const isEdit = projects.some(p => p.id === project.id);
    setProjects(prev => {
      const idx = prev.findIndex(p => p.id === project.id);
      if (idx >= 0) { const u = [...prev]; u[idx] = project; return u; }
      return [project, ...prev];
    });
    const result = await db.saveProject(project);
    if (result && result.ok) {
      toast(isEdit ? `"${project.title}" updated` : `"${project.title}" added`, "success");
      db.logActivity(isEdit ? "updated" : "created", "project", project.title);
      setActivityLog(await db.loadActivityLog());
    } else if (connStatus === "local") {
      toast(isEdit ? `"${project.title}" updated (local only)` : `"${project.title}" added (local only)`, "warn");
    } else {
      toast(`Failed to save "${project.title}"`, "error");
    }
  };

  const handleDeleteProject = async (id) => {
    const proj = projects.find(p => p.id === id);
    const name = proj?.title || "Project";
    // Soft delete — mark as deleted
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: "deleted", deleted_at: new Date().toISOString() } : p));
    const result = await db.softDeleteProject(id);
    if (result && result.ok) {
      toast(`"${name}" moved to trash (deleted after 30 days)`, "warn");
      db.logActivity("deleted", "project", name);
      setActivityLog(await db.loadActivityLog());
    } else if (connStatus === "local") {
      toast(`"${name}" moved to trash (local only)`, "warn");
    }
  };

  const handleRestoreProject = async (id) => {
    const proj = projects.find(p => p.id === id);
    const name = proj?.title || "Project";
    const restored = { ...proj, status: "active", deleted_at: null };
    setProjects(prev => prev.map(p => p.id === id ? restored : p));
    await db.saveProject(restored);
    toast(`"${name}" restored`, "success");
    db.logActivity("restored", "project", name);
    setActivityLog(await db.loadActivityLog());
  };

  const handlePermanentDeleteProject = async (id) => {
    const proj = projects.find(p => p.id === id);
    const name = proj?.title || "Project";
    setProjects(prev => prev.filter(p => p.id !== id));
    await db.hardDeleteProject(id);
    toast(`"${name}" permanently deleted`, "error");
    db.logActivity("purged", "project", name);
    setActivityLog(await db.loadActivityLog());
  };

  // Media CRUD with toasts
  const handleSaveMedia = async (m) => {
    const isEdit = media.some(x => x.id === m.id);
    setMedia(prev => {
      const idx = prev.findIndex(x => x.id === m.id);
      if (idx >= 0) { const u = [...prev]; u[idx] = m; return u; }
      return [m, ...prev];
    });
    const result = await db.saveMedia(m);
    if (result && result.ok) {
      toast(isEdit ? `"${m.title}" updated` : `"${m.title}" media added`, "success");
      db.logActivity(isEdit ? "updated" : "created", "media", m.title);
      setActivityLog(await db.loadActivityLog());
    } else if (connStatus === "local") {
      toast(isEdit ? `"${m.title}" updated (local only)` : `"${m.title}" added (local only)`, "warn");
    } else {
      toast(`Failed to save "${m.title}"`, "error");
    }
  };

  const handleDeleteMedia = async (id) => {
    const item = media.find(m => m.id === id);
    const name = item?.title || "Media";
    setMedia(prev => prev.map(m => m.id === id ? { ...m, status: "deleted", deleted_at: new Date().toISOString() } : m));
    await db.softDeleteMedia(id);
    toast(`"${name}" moved to trash`, "warn");
    db.logActivity("deleted", "media", name);
    setActivityLog(await db.loadActivityLog());
  };

  const handleRestoreMedia = async (id) => {
    const item = media.find(m => m.id === id);
    setMedia(prev => prev.map(m => m.id === id ? { ...m, status: "active", deleted_at: null } : m));
    await db.saveMedia({ ...item, status: "active" });
    toast(`"${item?.title}" restored`, "success");
  };

  const handlePermanentDeleteMedia = async (id) => {
    const item = media.find(m => m.id === id);
    setMedia(prev => prev.filter(m => m.id !== id));
    await db.hardDeleteMedia(id);
    toast(`"${item?.title}" permanently deleted`, "error");
  };

  // Messages
  const handleVisitorMessage = async (msg) => {
    setInboxMessages(prev => [msg, ...prev]);
    await db.saveMessage(msg);
  };

  const handleClearInbox = async () => {
    setInboxMessages([]);
    await db.clearMessages();
    toast("Inbox cleared", "info");
  };

  // Q&A state
  const [qaItems, setQaItems] = useState([]);

  // Message actions
  const handleSaveMessage = async (id) => {
    setInboxMessages(prev => prev.map(m => m.id === id ? { ...m, status: "saved" } : m));
    await db.updateMessage(id, { status: "saved" });
    toast("Message saved", "success");
  };

  const handleDisregardMessage = async (id) => {
    setInboxMessages(prev => prev.map(m => m.id === id ? { ...m, status: "disregarded", disregarded_at: new Date().toISOString() } : m));
    await db.updateMessage(id, { status: "disregarded", disregarded_at: new Date().toISOString() });
    toast("Message disregarded — auto-deletes in 3 days", "warn");
  };

  const handleReplyToMessage = async (msg, replyText, hasEmail) => {
    // Always mark message as replied with the reply text
    setInboxMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: "replied", admin_reply: replyText } : m));
    await db.updateMessage(msg.id, { status: "replied", admin_reply: replyText });

    if (!hasEmail) {
      // No email — post to Q&A
      const qaPost = {
        id: uid(),
        question: msg.text,
        answer: replyText,
        asker_email: "",
        created_at: new Date().toISOString(),
      };
      setQaItems(prev => [qaPost, ...prev]);
      await db.saveQA(qaPost);
      toast("Reply posted to Q&A", "success");
    } else {
      // Has email — reply saved as draft (user copies it manually)
      toast("Reply saved — draft copied to clipboard", "success");
    }

    db.logActivity("replied", "message", `Q: ${msg.text.slice(0, 50)}...`);
    setActivityLog(await db.loadActivityLog());
  };

  const handleDeleteQA = async (id) => {
    setQaItems(prev => prev.filter(q => q.id !== id));
    await db.deleteQA(id);
    toast("Q&A entry removed", "info");
  };

  // Site config (wallets, coffee, max media)
  const handleUpdateSiteConfig = async (field, value) => {
    console.log("Updating site config:", field, value);
    setSiteConfig(prev => ({ ...prev, [field]: value }));
    const result = await db.updateSiteConfig({ [field]: value });
    const labels = { heroSubtitle: "Subtitle", donateMethods: "Donate methods", maxMediaPosts: "Max media" };
    if (result && result.ok) {
      toast(`${labels[field] || field} updated`, "success");
    } else if (result && result.error) {
      console.error("Config save failed:", result.error);
      toast(`Failed to save: ${result.error}`, "error");
    } else if (connStatus === "local") {
      toast("Updated (local only)", "warn");
    }
  };

  // Edit media
  const handleEditMedia = (mediaItem) => {
    setEditMediaItem(mediaItem);
    setMediaModalOpen(true);
  };

  // Reload analytics with different date range
  const handleLoadAnalytics = async (days) => {
    const stats = await db.loadAnalytics(days);
    setAnalytics(stats);
  };

  // Delete individual page view rows
  const handleDeletePageView = async (id, days) => {
    await db.deletePageView(id);
    const stats = await db.loadAnalytics(days || 7);
    setAnalytics(stats);
    toast("Visit record removed", "info");
  };

  // Clear all analytics
  const handleClearAllPageViews = async (days) => {
    await db.clearAllPageViews();
    const stats = await db.loadAnalytics(days || 7);
    setAnalytics(stats);
    toast("All analytics data cleared", "warn");
  };

  if (loading) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="grid-bg" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "var(--font-mono)", color: "var(--green)", fontSize: 14, background: "var(--black)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 12px var(--green)", margin: "0 auto 16px", animation: "pulse-dot 1s ease-in-out infinite" }} />
            Loading NullSpace Studio...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="grid-bg" />

      {/* ── Top Bar ── */}
      <div className={`topbar ${mobileNav ? "mobile-nav-open" : ""}`}>
        <div className="topbar-brand" onClick={() => navigate("home")}>
          <span className="dot" />
          NULLSPACE STUDIO
        </div>

        <div className="topbar-nav">
          <a className={page === "home" ? "active" : ""} onClick={() => navigate("home")}>
            {Icons.home} Directory
          </a>
          <a className={page === "privacy" ? "active" : ""} onClick={() => navigate("privacy")}>
            {Icons.shield} Privacy & Terms
          </a>
          <a className={page === "qa" ? "active" : ""} onClick={() => navigate("qa")}>
            {Icons.message} Q&A
          </a>
          {isLoggedIn && (
            <a className={page === "admin" ? "active" : ""} onClick={() => navigate("admin")}>
              {Icons.grid} Admin
            </a>
          )}
        </div>

        <div className="topbar-actions">
          <button className="btn-icon" onClick={() => { setMessengerOpen(true); setMsgCount(0); }} title="Messages">
            {Icons.message}
            {msgCount > 0 && <span className="badge">{msgCount}</span>}
          </button>
          {isLoggedIn ? (
            <button className="btn-icon" onClick={() => setLoginOpen(true)} title="Admin" style={{ color: "var(--green)", borderColor: "rgba(0,255,136,0.3)" }}>
              {Icons.user}
            </button>
          ) : (
            <button className="btn-icon" onClick={openLoginModal} title="Admin Access">
              {Icons.lock}
            </button>
          )}
          <button className="mobile-menu-btn" onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? Icons.x : Icons.menu}
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="main">
        {page === "home" && (
          <HomePage
            projects={projects}
            media={media}
            onNavigate={navigate}
            isLoggedIn={isLoggedIn}
            onAddMedia={() => { setEditMediaItem(null); setMediaModalOpen(true); }}
            onEditMedia={handleEditMedia}
            onDeleteMedia={handleDeleteMedia}
            donateConfig={siteConfig}
            maxMediaPosts={siteConfig.maxMediaPosts}
            siteConfig={siteConfig}
          />
        )}
        {page === "privacy" && <PrivacyPage />}
        {page === "qa" && (
          <QAPage qaItems={qaItems} isLoggedIn={isLoggedIn} onDeleteQA={handleDeleteQA} />
        )}
        {page === "admin" && (
          <AdminPage
            projects={projects}
            setProjects={setProjects}
            analytics={analytics}
            isLoggedIn={isLoggedIn}
            onLogin={openLoginModal}
            inboxMessages={inboxMessages}
            onClearInbox={handleClearInbox}
            onSaveMessage={handleSaveMessage}
            onDisregardMessage={handleDisregardMessage}
            onReplyToMessage={handleReplyToMessage}
            credentials={credentials}
            onUpdateCredentials={handleUpdateCredentials}
            onSaveProject={handleSaveProject}
            onDeleteProject={handleDeleteProject}
            onRestoreProject={handleRestoreProject}
            onPermanentDeleteProject={handlePermanentDeleteProject}
            connStatus={connStatus}
            activityLog={activityLog}
            siteConfig={siteConfig}
            onUpdateSiteConfig={handleUpdateSiteConfig}
            onLoadAnalytics={handleLoadAnalytics}
            onDeletePageView={handleDeletePageView}
            onClearAllPageViews={handleClearAllPageViews}
          />
        )}
      </div>

      {/* ── Toasts ── */}
      <ToastContainer toasts={toasts} />

      {/* ── Footer ── */}
      <div className="footer">
        © {new Date().getFullYear()} NullSpace Studio LLC. All rights reserved. ·{" "}
        <a onClick={() => navigate("privacy")} style={{ cursor: "pointer" }}>Privacy Policy</a>
      </div>

      {/* ── Messenger ── */}
      <MessengerPanel open={messengerOpen} onClose={() => setMessengerOpen(false)} onVisitorMessage={handleVisitorMessage} />

      {/* ── Login Modal ── */}
      <LoginModal
        open={loginOpen}
        onClose={() => { setLoginOpen(false); setLoginError(false); setPasskeyError(false); }}
        onPasskey={handlePasskey}
        onLogin={handleLogin}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        step={loginStep}
        error={loginError}
        passkeyError={passkeyError}
      />

      {/* ── Media Modal ── */}
      <MediaModal
        open={mediaModalOpen}
        onClose={() => { setMediaModalOpen(false); setEditMediaItem(null); }}
        onSave={handleSaveMedia}
        editMedia={editMediaItem}
      />
    </>
  );
}
