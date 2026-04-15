<template>
  <div class="guest-page">
    <nav class="ui menu borderless top-nav">
      <div class="ui container">
        <div class="header item brand-item">
          <i class="teal desktop icon"></i>
          <div class="brand-text">
            <div class="title">IT HELPDESK</div>
            <div class="subtitle">Quick support for your IT issues</div>
          </div>
        </div>

        <div class="right menu">
          <router-link to="/login" class="ui teal basic button login-button">Staff Login</router-link>
        </div>
      </div>
    </nav>

    <div class="hero-section">
      <div class="ui container center aligned hero-content">
        <h1 class="ui inverted header">How can we help you?</h1>
        <p>Find fast solutions for hardware, software, and network issues.</p>

        <div class="hero-actions ui stackable center aligned grid">
          <div class="sixteen wide mobile ten wide tablet nine wide computer column">
            <div class="ui huge left icon input search-box">
              <input type="text" v-model="searchQuery" @input="filterResults" placeholder="Search by issue code or description...">
              <i class="search icon"></i>
            </div>
          </div>
          <div class="sixteen wide mobile six wide tablet four wide computer column">
            <router-link to="/login" class="ui fluid large inverted button hero-login-button">Staff Login</router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="ui container content-area">
      <h3 class="ui horizontal divider header">
        <i class="lightbulb outline icon"></i> Popular Solutions
      </h3>

      <div class="ui three stackable cards" v-if="filteredResponses.length > 0">
        <div class="ui fluid card solution-card" v-for="res in filteredResponses" :key="res._id">
          <div class="content">
            <div class="card-top-row">
              <div class="ui teal ribbon label">{{ res.issueCode }}</div>
              <div class="ui mini label status-label">
                <i :class="res.isCommon ? 'star yellow icon' : 'star outline grey icon'"></i>
                {{ res.isCommon ? 'Common Issue' : 'Standard Issue' }}
              </div>
            </div>
            <div class="header" style="margin-top: 15px;">{{ res.description }}</div>
            <div class="description text-justified">
              {{ res.responseText }}
            </div>
          </div>
          
        </div>
      </div>

      <div class="ui segment placeholder center aligned" v-else>
        <div class="ui icon header">
          <i class="search grey icon"></i>
          No matching solutions found.
        </div>
        <p>Please contact IT support at hotline: 1900-xxxx</p>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../api';
export default {
  data() {
    return {
      allResponses: [],
      filteredResponses: [],
      searchQuery: ''
    }
  },
  async mounted() {
    try {
      // Call API to retrieve common issues (isCommon: true)
      const res = await api.get('/public/responses/common');
      this.allResponses = res.data;
      this.filteredResponses = res.data;
    } catch (e) { console.error(e); }
  },
  methods: {
    filterResults() {
      const query = this.searchQuery.toLowerCase();
      this.filteredResponses = this.allResponses.filter(r => 
        r.issueCode.toLowerCase().includes(query) || 
        r.description.toLowerCase().includes(query)
      );
    }
  }
}
</script>

<style scoped>
.guest-page { background: #f4f7fb; min-height: 100vh; }
.top-nav { background: white !important; box-shadow: 0 2px 18px rgba(0,0,0,0.08) !important; }
.brand-item { padding-left: 0 !important; }
.brand-text { margin-left: 0.75rem; text-align: left; }
.brand-text .title { font-weight: 700; font-size: 1rem; }
.brand-text .subtitle { font-size: 0.9rem; color: #6b778c; }
.login-button { margin-left: 0.75rem; }
.hero-section { 
  background: linear-gradient(135deg, #00b5ad 0%, #00827c 100%);
  padding: 90px 0; color: white; margin-bottom: 42px;
}
.hero-content { max-width: 980px; margin: 0 auto; }
.hero-section h1 { color: white !important; font-size: 3.2rem !important; margin-bottom: 14px; letter-spacing: -0.04em; }
.hero-section p { font-size: 1.15rem; opacity: 0.94; margin-bottom: 30px; }
.hero-actions { margin-top: 28px; }
.hero-login-button { background: rgba(255,255,255,0.16) !important; color: white !important; border-color: rgba(255,255,255,0.22) !important; }
.hero-login-button:hover { background: rgba(255,255,255,0.22) !important; }
.search-box { width: 100%; max-width: 760px; box-shadow: 0 16px 40px rgba(0,0,0,0.18); border-radius: 999px !important; }
.search-box input { border-radius: 999px !important; height: 64px !important; font-size: 1.05rem !important; }
.content-area { padding: 40px 0 60px; }
.solution-card { border: none !important; border-radius: 18px !important; transition: transform 0.28s ease, box-shadow 0.28s ease; box-shadow: 0 10px 35px rgba(15,23,42,0.08) !important; }
.solution-card:hover { transform: translateY(-4px); box-shadow: 0 14px 40px rgba(15,23,42,0.12) !important; }
.solution-card .content { padding: 28px !important; }
.card-top-row { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
.status-label { background: rgba(255,255,255,0.94) !important; color: #333 !important; }
.solution-card .header { font-size: 1.25rem !important; color: #1b1c1d; }
.solution-card .description { color: #4f4f4f; font-size: 1rem; line-height: 1.75; margin-top: 16px; }
.ui.segment.placeholder { border-radius: 18px !important; box-shadow: 0 8px 28px rgba(15,23,42,0.08) !important; padding: 44px !important; }
.ui.segment.placeholder .header { font-size: 1.45rem !important; }
@media screen and (max-width: 900px) {
  .hero-section { padding: 72px 0; }
  .hero-section h1 { font-size: 2.6rem !important; }
  .search-box input { font-size: 1rem !important; }
}
@media screen and (max-width: 600px) {
  .top-nav { padding: 16px 0 !important; }
  .hero-actions .column { width: 100% !important; }
  .hero-login-button { width: 100% !important; }
}
</style>